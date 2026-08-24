import { Link } from "react-router-dom";

export default function BlackFridayPromo() {
  return (
    <section className="black-friday" aria-labelledby="black-friday-title">
      <div className="black-friday__glow" aria-hidden="true" />
      <div className="black-friday__content">
        <div className="black-friday__copy">
          <span className="black-friday__eyebrow">Limited-time Techanor event</span>
          <h2 id="black-friday-title">Black Friday</h2>
          <p>Big tech. Better prices. Save up to 40% on selected devices.</p>
          <div className="black-friday__actions">
            <Link className="black-friday__primary" to="/products">Shop deals</Link>
            <Link className="black-friday__secondary" to="/products">Explore all</Link>
          </div>
        </div>

        <div className="black-friday__visual" aria-hidden="true">
          <span className="black-friday__offer">Up to <strong>40%</strong> off</span>
          <div className="black-friday__halo" />
          <img src="/img/testheadphone.avif" alt="" />
        </div>
      </div>
    </section>
  );
}
