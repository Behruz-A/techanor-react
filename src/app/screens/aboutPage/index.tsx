import { Link } from "react-router-dom";
import { ArrowForwardRounded } from "@mui/icons-material";
import "../../../css/about.css";

const milestones = [
  { year: "2023", title: "Listening first", text: "Techanor began by listening closely to customer feedback and using it to shape a clearer, more helpful shopping experience.", image: "/img/customersfeedback.jpg", contain: false },
  { year: "2024", title: "A stronger team", text: "Dedicated leadership brought product selection, customer support and daily operations together around one shared standard.", image: "/img/manager.jpg", contain: false },
  { year: "2025", title: "Smarter fulfilment", text: "We improved how every order is checked, packed and prepared so products leave our fulfilment center safely and efficiently.", image: "/img/deleveringbox.jpg", contain: false },
  { year: "2026", title: "Delivery you can trust", text: "Clear order steps and dependable delivery completed the Techanor experience from selection to arrival.", image: "/img/deliveryman.jpg", contain: true },
];

const expertise = [
  { image: "/img/Firefly (47).png", role: "Product Specialist", name: "Daniel Martin", text: "Selects useful technology with quality, value and everyday performance in mind." },
  { image: "/img/export2.jpg", role: "Customer Experience", name: "Sofia Kim", text: "Creates clear guidance and thoughtful support throughout the shopping journey." },
  { image: "/img/newcontactimg.jpg", role: "Store Operations", name: "Techanor Team", text: "Connects product knowledge, customer care and dependable day-to-day store operations." },
];

export default function AboutPage() {
  return <main className="about-page">
    <section className="about-hero">
      <div className="about-container about-hero-copy">
        <span className="about-eyebrow">ABOUT TECHANOR</span>
        <h1>Our journey to better technology.</h1>
        <p>Thoughtful products and simpler shopping, all in one place.</p>
      </div>
      <div className="about-container about-hero-visual">
        <img src="/img/sellerimg.jpg" alt="A Techanor seller handing an order to a customer" />
        <div className="about-stat-card"><strong>100%</strong><span>Customer focused</span></div>
        <div className="about-stat-card"><strong>8</strong><span>Product categories</span></div>
      </div>
    </section>

    <section className="about-purpose">
      <div className="about-container">
        <div className="about-section-intro">
          <span className="about-dot-label">Independent. Thoughtful. Reliable.</span>
          <h2>Technology should feel clear, useful and made for real life.</h2>
        </div>
        <article className="about-purpose-row">
          <div className="about-purpose-copy"><span>01</span><h3>Our mission</h3><p>Our mission is to help people choose technology with confidence. Like a specialist explaining the right camera, we turn complex specifications into practical and understandable guidance.</p><p>Every recommendation should match the customer’s real needs—not simply the newest product on the shelf.</p></div>
          <div className="about-purpose-image"><img src="/img/manwhoisteachinghowtochoosecamera.jpg" alt="A technology specialist showing customers how to choose a camera" /></div>
        </article>
        <article className="about-purpose-row reverse">
          <div className="about-purpose-copy"><span>02</span><h3>Our vision</h3><p>We want Techanor to become a trusted destination for modern electronics—supported by focused people who continually improve how the store works.</p><p>Thoughtful planning behind the scenes helps us keep product information clear, service responsive and every digital step consistent.</p></div>
          <div className="about-purpose-image"><img src="/img/womanatoffice.jpg" alt="A Techanor operations specialist working in a modern office" /></div>
        </article>
      </div>
    </section>

    <section className="about-history">
      <div className="about-container">
        <div className="about-history-heading"><span className="about-dot-label">Our history</span><h2>Our tech journey</h2><p>Growing one thoughtful improvement at a time.</p></div>
        <div className="about-timeline">
          {milestones.map((item, index) => <article className="about-milestone" key={`${item.year}-${item.title}`}>
            <div className="about-milestone-copy"><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.text}</p></div>
            <div className={`about-milestone-image${item.contain ? " contain" : ""}`}><img src={item.image} alt="" /><strong aria-label={`Year ${item.year}`}>{item.year}</strong></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="about-experts">
      <div className="about-container about-experts-layout">
        <div className="about-experts-intro"><span className="about-dot-label">Our team</span><h2>Meet our experts</h2><p>Together, we make upgrading your digital life simple, seamless and enjoyable.</p></div>
        <div className="about-expert-list">
          {expertise.map(({ image, role, name, text }) => <article className="about-expert-card" key={name}>
            <div className="about-expert-photo"><img src={image} alt={`${name}, ${role}`} /></div>
            <div className="about-expert-copy"><span>{role}</span><h3>{name}</h3><p>{text}</p><div className="about-expert-socials" aria-label={`${name} social links`}><span>◎</span><span>𝕏</span><span>in</span></div></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="about-cta"><div className="about-container"><div><span className="about-dot-label">Discover Techanor</span><h2>Find technology that fits your everyday.</h2></div><Link to="/products">Explore the collection <ArrowForwardRounded /></Link></div></section>
  </main>;
}
