import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { DeliveryAddress, DeliveryMethod } from "../../../lib/types/order";
import { serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { isMongoObjectId } from "../../../lib/utils/objectId";
import { ZapIcon } from "../../components/icons/TechanorIcons";
import "../../../css/checkout.css";

const FREE_SHIPPING_THRESHOLD = 79;
const STANDARD_SHIPPING_COST = 5;
const EXPRESS_SHIPPING_COST = 12;
const emptyAddress: DeliveryAddress = { fullName: "", phone: "", country: "South Korea", city: "", address: "", postalCode: "", note: "" };

export default function CheckoutPage() {
  const history = useHistory();
  const { authMember, setOrderBuilder, basket: { cartItems, onDeleteAll } } = useGlobals();
  const [form, setForm] = useState<DeliveryAddress>(emptyAddress);
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryAddress, string>>>({});
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("STANDARD");
  const [submitting, setSubmitting] = useState(false);
  const purchasableItems = useMemo(() => cartItems.filter((item) => isMongoObjectId(item._id)), [cartItems]);
  const checkoutSubtotal = useMemo(() => purchasableItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [purchasableItems]);
  const standardDelivery = checkoutSubtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const delivery = deliveryMethod === "EXPRESS" ? EXPRESS_SHIPPING_COST : standardDelivery;
  const total = checkoutSubtotal + delivery;

  useEffect(() => {
    if (!authMember) { history.replace("/"); return; }
    setForm((current) => ({ ...current, fullName: authMember.memberNick || "", phone: authMember.memberPhone || "", address: authMember.memberAddress || "" }));
  }, [authMember, history]);

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const name = event.target.name as keyof DeliveryAddress;
    setForm((current) => ({ ...current, [name]: event.target.value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof DeliveryAddress, string>> = {};
    (["fullName", "phone", "country", "city", "address", "postalCode"] as Array<keyof DeliveryAddress>).forEach((field) => {
      if (!form[field]?.trim()) next[field] = "This field is required";
    });
    if (form.phone && !/^[+\d][\d\s()-]{6,}$/.test(form.phone)) next.phone = "Enter a valid phone number";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting || !validate()) return;
    if (!purchasableItems.length) { sweetErrorHandling("Your basket does not contain purchasable products.").then(); return; }
    try {
      setSubmitting(true);
      const order = await new OrderService().createOrder(purchasableItems, form, deliveryMethod);
      if (!order?._id) throw new Error("Order could not be created. Please try again.");
      onDeleteAll();
      setOrderBuilder(new Date());
      history.push({ pathname: "/orders", state: { createdOrderId: order._id } });
    } catch (error) {
      sweetErrorHandling(error).then();
    } finally {
      setSubmitting(false);
    }
  };

  if (!authMember) return null;

  return <main className="checkout-page"><section className="checkout-shell">
    <header className="checkout-heading"><span>SECURE CHECKOUT</span><h1>Complete your order</h1><p>Confirm where your Techanor products should be delivered.</p></header>
    <div className="checkout-layout">
      <div className="checkout-main-column">
        <div className="checkout-progress" aria-label="Checkout progress"><div className="complete"><CheckCircleRounded/><span><b>Bag</b><small>Products selected</small></span></div><i/><div className="active"><b className="checkout-step-number">2</b><span><b>Delivery</b><small>Address details</small></span></div><i/><div><b className="checkout-step-number">3</b><span><b>Confirmation</b><small>Place order</small></span></div></div>
        <form className="checkout-form-card" onSubmit={placeOrder} noValidate>
          <div className="checkout-card-title"><div><span>DELIVERY DETAILS</span><h2>Where should we send it?</h2><p>Use an address where someone can receive the package.</p></div></div>
          <div className="checkout-fields">
            <Field label="Full name" name="fullName" value={form.fullName} error={errors.fullName} onChange={updateField} autoComplete="name" />
            <Field label="Phone number" name="phone" value={form.phone} error={errors.phone} onChange={updateField} autoComplete="tel" />
            <label className={`checkout-field${errors.country ? " invalid" : ""}`}><span>Country</span><select name="country" value={form.country} onChange={updateField}><option>South Korea</option><option>Uzbekistan</option><option>United States</option><option>United Kingdom</option><option>Japan</option></select>{errors.country && <small>{errors.country}</small>}</label>
            <Field label="City" name="city" value={form.city} error={errors.city} onChange={updateField} autoComplete="address-level2" />
            <Field label="Street address" name="address" value={form.address} error={errors.address} onChange={updateField} autoComplete="street-address" placeholder="Building, street and apartment" />
            <Field label="Postal code" name="postalCode" value={form.postalCode} error={errors.postalCode} onChange={updateField} autoComplete="postal-code" />
            <label className="checkout-field wide"><span>Delivery note <em>Optional</em></span><textarea name="note" value={form.note} onChange={updateField} maxLength={120} placeholder="Gate code, floor or delivery instructions"/><b className="checkout-character-count">{form.note?.length || 0} / 120</b></label>
          </div>
          <section className="checkout-delivery-method"><span>DELIVERY METHOD</span><div className="checkout-delivery-options">
            <button type="button" className={deliveryMethod === "STANDARD" ? "selected" : ""} onClick={() => setDeliveryMethod("STANDARD")}><i className="delivery-radio"/><span><LocalShippingOutlined/></span><div><strong>Standard {standardDelivery ? `($${standardDelivery})` : "(Free)"}</strong><small>2–4 business days</small><b>{standardDelivery ? `$${standardDelivery.toFixed(2)}` : "Free"}</b></div></button>
            <button type="button" className={deliveryMethod === "EXPRESS" ? "selected" : ""} onClick={() => setDeliveryMethod("EXPRESS")}><i className="delivery-radio"/><span><ZapIcon /></span><div><strong>Express</strong><small>Next business day</small><b>${EXPRESS_SHIPPING_COST.toFixed(2)}</b></div></button>
          </div></section>
          <div className="checkout-form-actions"><button type="button" className="checkout-back" onClick={() => history.goBack()}><ArrowBackRounded/>Back to bag</button><button type="submit" className="checkout-submit" disabled={submitting || !purchasableItems.length}>{submitting ? "Placing order..." : `Place order · $${total.toFixed(2)}`}</button></div>
        </form>
      </div>
      <aside className="checkout-summary-card"><div className="checkout-summary-title"><div><span>ORDER SUMMARY</span><h2>Your bag</h2></div><b>{purchasableItems.reduce((sum, item) => sum + item.quantity, 0)} items</b></div>
        <div className="checkout-summary-items">{purchasableItems.map((item) => { const image = item.image.startsWith("/") || item.image.startsWith("http") ? item.image : `${serverApi}/${item.image}`; return <article key={item._id}><img src={image} alt={item.name}/><div><strong>{item.name}</strong><span>${item.price.toLocaleString()} × {item.quantity}</span></div><b>${(item.price * item.quantity).toLocaleString()}</b></article>; })}</div>
        <div className="checkout-totals"><p><span>Subtotal</span><b>${checkoutSubtotal.toFixed(2)}</b></p><p><span>Delivery</span><b className={delivery ? "" : "free"}>{delivery ? `$${delivery.toFixed(2)}` : "Free"}</b></p><div><span>Total</span><strong>${total.toFixed(2)}</strong></div></div>
        <div className="checkout-assurance"><LockOutlined/><div><strong>Secure order</strong><span>Your details are protected and used only for delivery.</span></div></div>
        <div className="checkout-shipping-note"><LocalShippingOutlined/><div><strong>{deliveryMethod === "EXPRESS" ? "Express delivery selected" : standardDelivery ? `$${(FREE_SHIPPING_THRESHOLD - checkoutSubtotal).toFixed(2)} away from free delivery` : "Free delivery unlocked"}</strong><span>{deliveryMethod === "EXPRESS" ? "Priority delivery on the next business day." : standardDelivery ? "Add more products to save the $5 delivery fee." : "Your order qualifies for complimentary delivery."}</span></div></div>
      </aside>
    </div>
  </section></main>;
}

interface FieldProps { label: string; name: keyof DeliveryAddress; value?: string; error?: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void; className?: string; placeholder?: string; autoComplete?: string; }
function Field({ label, name, value, error, onChange, className = "", ...props }: FieldProps) {
  return <label className={`checkout-field ${className}${error ? " invalid" : ""}`}><span>{label}</span><input name={name} value={value || ""} onChange={onChange} {...props}/>{error && <small>{error}</small>}</label>;
}
