import { FormEvent, useState } from "react";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { MapPinIcon } from "../../components/icons/TechanorIcons";
import "../../../css/contact.css";

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialForm: ContactForm = { firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" };

interface ContactPageProps {
  embedded?: boolean;
}

export default function ContactPage({ embedded = false }: ContactPageProps) {
  const [form, setForm] = useState<ContactForm>(initialForm);

  const updateField = (field: keyof ContactForm, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(form.subject.trim() || "Techanor support request");
    const body = encodeURIComponent(`Name: ${form.firstName.trim()} ${form.lastName.trim()}\nEmail: ${form.email.trim()}\nPhone: ${form.phone.trim() || "Not provided"}\n\n${form.message.trim()}`);
    window.location.href = `mailto:support@techanor.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className={`contact-page${embedded ? " contact-page--embedded" : ""}`}>
      <section className="contact-shell" aria-labelledby="contact-title">
        <header className="contact-heading">
          <span>TECHANOR SUPPORT</span>
          <h1 id="contact-title">Talk to our friendly support team.</h1>
          <p>Questions about a product, delivery or your account? We’re here to make things simple.</p>
        </header>

        <div className="contact-details-grid">
          <article><i><AccessTimeRoundedIcon /></i><h2>Working hours</h2><p>Mon–Fri, 9am–6pm<br />Sat, 10am–4pm</p></article>
          <article><i><PhoneOutlinedIcon /></i><h2>Phone</h2><p><a href="tel:+820100101010">+82 010-0101-010</a><br />Fast assistance during work hours</p></article>
          <article><i><EmailOutlinedIcon /></i><h2>Email</h2><p><a href="mailto:support@techanor.com">support@techanor.com</a><br />We reply within one business day</p></article>
          <article><i><MapPinIcon /></i><h2>Location</h2><p>Techanor Support Center<br />Seoul, South Korea</p></article>
        </div>

        <div className="contact-panel">
          <form className="contact-form" onSubmit={submitMessage}>
            <div className="contact-form-heading"><span>SEND A MESSAGE</span><h2>Get in touch and let’s talk.</h2><p>Share a few details and we’ll help you find the right answer.</p></div>
            <div className="contact-form-grid">
              <label>First name<input required autoComplete="given-name" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} placeholder="Your first name" /></label>
              <label>Last name<input required autoComplete="family-name" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} placeholder="Your last name" /></label>
              <label className="full">Email address<input required type="email" autoComplete="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" /></label>
              <label>Phone <small>Optional</small><input type="tel" autoComplete="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="+82 10-1234-5678" /></label>
              <label>Subject<input required value={form.subject} onChange={(event) => updateField("subject", event.target.value)} placeholder="How can we help?" /></label>
              <label className="full">Message<textarea required minLength={10} maxLength={1000} value={form.message} onChange={(event) => updateField("message", event.target.value)} placeholder="Tell us what you need help with" /><small>{form.message.length} / 1000</small></label>
            </div>
            <button type="submit">Send message</button>
            <p className="contact-form-note">Submitting opens your email app with the message prepared for Techanor Support.</p>
          </form>
          <div className="contact-visual"><img src="/img/newcontactimg.jpg" alt="Techanor customer support" /></div>
        </div>
      </section>
    </main>
  );
}
