import { ChangeEvent, FormEvent, InputHTMLAttributes, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
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
type PaymentField = "cardholder" | "cardNumber" | "expiry" | "cvv";
const emptyPayment = { cardholder: "", cardNumber: "", expiry: "", cvv: "" };

export default function CheckoutPage() {
  const history = useHistory();
  const location = useLocation();
  const { authMember, setOrderBuilder, basket: { cartItems, onDeleteAll } } = useGlobals();
  const [form, setForm] = useState<DeliveryAddress>(emptyAddress);
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryAddress, string>>>({});
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("STANDARD");
  const [payment, setPayment] = useState(emptyPayment);
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<PaymentField, string>>>({});
  const step: 1 | 2 | 3 = location.pathname.endsWith("/shipping") ? 2 : location.pathname.endsWith("/payment") ? 3 : 1;
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const purchasableItems = useMemo(() => cartItems.filter((item) => isMongoObjectId(item._id)), [cartItems]);
  const checkoutSubtotal = useMemo(() => purchasableItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [purchasableItems]);
  const standardDelivery = checkoutSubtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const delivery = deliveryMethod === "EXPRESS" ? EXPRESS_SHIPPING_COST : standardDelivery;
  const total = checkoutSubtotal + delivery;

  useEffect(() => {
    if (!authMember) { history.replace("/"); return; }
    if (location.pathname === "/orders" || location.pathname === "/orders/") history.replace("/orders/address");
    setForm((current) => ({ ...current, fullName: current.fullName || authMember.memberNick || "", phone: current.phone || authMember.memberPhone || "", address: current.address || authMember.memberAddress || "" }));
  }, [authMember, history, location.pathname]);

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

  const updatePayment = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as PaymentField;
    let value = event.target.value;
    if (name === "cardNumber") value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (name === "expiry") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    }
    if (name === "cvv") value = value.replace(/\D/g, "").slice(0, 4);
    setPayment((current) => ({ ...current, [name]: value }));
    setPaymentErrors((current) => ({ ...current, [name]: undefined }));
  };

  const validatePayment = () => {
    const next: Partial<Record<PaymentField, string>> = {};
    if (!payment.cardholder.trim()) next.cardholder = "Cardholder name is required";
    if (payment.cardNumber.replace(/\s/g, "").length !== 16) next.cardNumber = "Enter a 16-digit card number";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry)) next.expiry = "Use MM/YY format";
    if (!/^\d{3,4}$/.test(payment.cvv)) next.cvv = "Enter a valid CVV";
    setPaymentErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = async (event: FormEvent) => {
    event.preventDefault();
    if (step !== 3) return;
    if (submitting) return;
    const addressIsValid = validate();
    const paymentIsValid = validatePayment();
    if (!addressIsValid || !paymentIsValid) {
      sweetErrorHandling(addressIsValid ? "Please enter valid card details before paying." : "Delivery details are incomplete. Go back and complete the address first.").then();
      return;
    }
    if (!purchasableItems.length) { sweetErrorHandling("Your basket does not contain purchasable products.").then(); return; }
    try {
      setSubmitting(true);
      const order = await new OrderService().createOrder(purchasableItems, form, deliveryMethod);
      if (!order?._id) throw new Error("Order could not be created. Please try again.");
      onDeleteAll();
      setOrderBuilder(new Date());
      setOrderSuccess(true);
    } catch (error) {
      sweetErrorHandling(error).then();
    } finally {
      setSubmitting(false);
    }
  };

  if (!authMember) return null;

  const checkoutProgress = <div className="checkout-progress" aria-label="Checkout progress"><div className={step === 1 ? "active" : "complete"}><b className="checkout-step-number">1</b><span><b>Address</b><small>Delivery details</small></span></div><i/><div className={step === 2 ? "active" : step > 2 ? "complete" : ""}><b className="checkout-step-number">2</b><span><b>Shipping</b><small>Delivery method</small></span></div><i/><div className={step === 3 ? "active" : ""}><b className="checkout-step-number">3</b><span><b>Payment</b><small>Review order</small></span></div></div>;

  return <main className={`checkout-page${step === 3 ? " checkout-payment-page" : ""}`}><section className="checkout-shell">
    <header className="checkout-heading"><span>SECURE CHECKOUT</span><h1>Complete your order</h1><p>Confirm where your Techanor products should be delivered.</p></header>
    {step === 3 && checkoutProgress}
    <div className={`checkout-layout${step === 3 ? " checkout-payment-layout" : ""}`}>
      <div className="checkout-main-column">
        {step !== 3 && checkoutProgress}
        <form className="checkout-form-card" onSubmit={placeOrder} noValidate>
          <div className="checkout-card-title"><div><span>STEP {step}</span><h2>{step === 1 ? "Select delivery address" : step === 2 ? "Choose shipment method" : "Payment"}</h2><p>{step === 1 ? "Use an address where someone can receive the package." : step === 2 ? "Select the delivery speed that works best for you." : "Complete your card details and review the order summary."}</p></div></div>
          {step === 1 && <div className="checkout-fields">
            <Field label="Full name" name="fullName" value={form.fullName} error={errors.fullName} onChange={updateField} autoComplete="name" />
            <Field label="Phone number" name="phone" value={form.phone} error={errors.phone} onChange={updateField} autoComplete="tel" />
            <label className={`checkout-field${errors.country ? " invalid" : ""}`}><span>Country</span><select name="country" value={form.country} onChange={updateField}><option>South Korea</option><option>Uzbekistan</option><option>United States</option><option>United Kingdom</option><option>Japan</option></select>{errors.country && <small>{errors.country}</small>}</label>
            <Field label="City" name="city" value={form.city} error={errors.city} onChange={updateField} autoComplete="address-level2" />
            <Field label="Street address" name="address" value={form.address} error={errors.address} onChange={updateField} autoComplete="street-address" placeholder="Building, street and apartment" />
            <Field label="Postal code" name="postalCode" value={form.postalCode} error={errors.postalCode} onChange={updateField} autoComplete="postal-code" />
            <label className="checkout-field wide"><span>Delivery note <em>Optional</em></span><textarea name="note" value={form.note} onChange={updateField} maxLength={120} placeholder="Gate code, floor or delivery instructions"/><b className="checkout-character-count">{form.note?.length || 0} / 120</b></label>
          </div>}
          {step === 2 && <section className="checkout-delivery-method checkout-step-section"><span>DELIVERY METHOD</span><div className="checkout-delivery-options">
            <button type="button" className={deliveryMethod === "STANDARD" ? "selected" : ""} onClick={() => setDeliveryMethod("STANDARD")}><i className="delivery-radio"/><span><LocalShippingOutlined/></span><div><strong>Standard {standardDelivery ? `($${standardDelivery})` : "(Free)"}</strong><small>2–4 business days</small><b>{standardDelivery ? `$${standardDelivery.toFixed(2)}` : "Free"}</b></div></button>
            <button type="button" className={deliveryMethod === "EXPRESS" ? "selected" : ""} onClick={() => setDeliveryMethod("EXPRESS")}><i className="delivery-radio"/><span><ZapIcon /></span><div><strong>Express</strong><small>Next business day</small><b>${EXPRESS_SHIPPING_COST.toFixed(2)}</b></div></button>
          </div></section>}
          {step === 3 && <section className="checkout-payment-panel">
            <div className="checkout-payment-label"><span>PAYMENT METHOD</span><b>Credit card</b></div>
            <div className="checkout-credit-card" aria-label="Card preview">
              <div className="credit-card-top"><i/><span>)))</span></div>
              <strong>{payment.cardNumber || "•••• •••• •••• ••••"}</strong>
              <div className="credit-card-bottom"><span/><img src="/icons/master-card.svg" alt="Mastercard"/></div>
            </div>
            <div className="checkout-payment-fields">
              <PaymentFieldInput label="Cardholder name" name="cardholder" value={payment.cardholder} error={paymentErrors.cardholder} onChange={updatePayment} autoComplete="cc-name" placeholder="Name on card" />
              <PaymentFieldInput label="Card number" name="cardNumber" value={payment.cardNumber} error={paymentErrors.cardNumber} onChange={updatePayment} autoComplete="cc-number" inputMode="numeric" placeholder="0000 0000 0000 0000" />
              <PaymentFieldInput label="Expiration date" name="expiry" value={payment.expiry} error={paymentErrors.expiry} onChange={updatePayment} autoComplete="cc-exp" inputMode="numeric" placeholder="MM/YY" />
              <PaymentFieldInput label="CVV" name="cvv" value={payment.cvv} error={paymentErrors.cvv} onChange={updatePayment} autoComplete="cc-csc" inputMode="numeric" placeholder="123" />
            </div>
            <label className="checkout-billing-check"><input type="checkbox" defaultChecked/><span>Same as delivery address</span></label>
          </section>}
          <div className="checkout-form-actions"><button type="button" className="checkout-back" onClick={() => step === 1 ? history.push("/products") : history.push(step === 2 ? "/orders/address" : "/orders/shipping")}><ArrowBackRounded/>{step === 1 ? "Back to products" : "Back"}</button>{step < 3 ? <button type="button" className="checkout-submit" onClick={(event) => { event.preventDefault(); event.stopPropagation(); if (step === 1 && !validate()) return; history.push(step === 1 ? "/orders/shipping" : "/orders/payment"); }}>Next</button> : <button type="submit" className="checkout-submit" disabled={submitting || !purchasableItems.length}>{submitting ? "Creating order..." : "Pay"}</button>}</div>
        </form>
      </div>
      <aside className="checkout-summary-card"><div className="checkout-summary-title"><div><span>ORDER SUMMARY</span><h2>{step === 3 ? "Summary" : "Your bag"}</h2></div><b>{purchasableItems.reduce((sum, item) => sum + item.quantity, 0)} items</b></div>
        <div className="checkout-summary-items">{purchasableItems.map((item) => { const image = item.image.startsWith("/") || item.image.startsWith("http") ? item.image : `${serverApi}/${item.image}`; return <article key={item._id}><img src={image} alt={item.name}/><div><strong>{item.name}</strong><span>${item.price.toLocaleString()} × {item.quantity}</span></div><b>${(item.price * item.quantity).toLocaleString()}</b></article>; })}</div>
        {step === 3 && <div className="checkout-summary-details"><p><span>ADDRESS</span><b>{form.address}, {form.city} {form.postalCode}</b></p><p><span>SHIPMENT METHOD</span><b>{deliveryMethod === "EXPRESS" ? "Express" : "Standard"} · {delivery ? `$${delivery.toFixed(2)}` : "Free"}</b></p></div>}
        <div className="checkout-totals"><p><span>Subtotal</span><b>${checkoutSubtotal.toFixed(2)}</b></p><p><span>Delivery</span><b className={delivery ? "" : "free"}>{delivery ? `$${delivery.toFixed(2)}` : "Free"}</b></p><div><span>Total</span><strong>${total.toFixed(2)}</strong></div></div>
        {step !== 3 && <><div className="checkout-assurance"><LockOutlined/><div><strong>Secure order</strong><span>Your details are protected and used only for delivery.</span></div></div><div className="checkout-shipping-note"><LocalShippingOutlined/><div><strong>{deliveryMethod === "EXPRESS" ? "Express delivery selected" : standardDelivery ? `$${(FREE_SHIPPING_THRESHOLD - checkoutSubtotal).toFixed(2)} away from free delivery` : "Free delivery unlocked"}</strong><span>{deliveryMethod === "EXPRESS" ? "Priority delivery on the next business day." : standardDelivery ? "Add more products to save the $5 delivery fee." : "Your order qualifies for complimentary delivery."}</span></div></div></>}
      </aside>
    </div>
    {orderSuccess && <div className="checkout-success-overlay" role="dialog" aria-modal="true" aria-labelledby="checkout-success-title">
      <div className="checkout-success-modal">
        <CheckCircleRounded/>
        <span>ORDER CONFIRMED</span>
        <h2 id="checkout-success-title">Thank you!</h2>
        <p>Your order has been placed successfully. We’ll keep you updated as it moves toward delivery.</p>
        <button type="button" onClick={() => history.push("/products")}>Continue shopping</button>
      </div>
    </div>}
  </section></main>;
}

interface FieldProps { label: string; name: keyof DeliveryAddress; value?: string; error?: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void; className?: string; placeholder?: string; autoComplete?: string; }
function Field({ label, name, value, error, onChange, className = "", ...props }: FieldProps) {
  return <label className={`checkout-field ${className}${error ? " invalid" : ""}`}><span>{label}</span><input name={name} value={value || ""} onChange={onChange} {...props}/>{error && <small>{error}</small>}</label>;
}

interface PaymentFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "value" | "onChange"> { label: string; name: PaymentField; value: string; error?: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void; }
function PaymentFieldInput({ label, name, value, error, onChange, ...props }: PaymentFieldProps) {
  return <label className={`checkout-field${error ? " invalid" : ""}`}><span>{label}</span><input name={name} value={value} onChange={onChange} {...props}/>{error && <small>{error}</small>}</label>;
}
