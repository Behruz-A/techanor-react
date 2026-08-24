const partners = [
  { name: "ASUS", logo: "/icons/asus-4.svg" },
  { name: "Apple", logo: "/icons/apple-13.svg" },
  { name: "Sony", logo: "/icons/sony-logo-1.svg" },
  { name: "Beats", wordmark: "beats" },
  { name: "Samsung", wordmark: "SAMSUNG" },
  { name: "Linux", wordmark: "LINUX" },
];

function PartnerRow({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="continuous-partners-row" aria-hidden={duplicate || undefined}>
      {partners.map((partner) => (
        <div className="continuous-partner" key={`${duplicate ? "copy-" : ""}${partner.name}`}>
          <span className={`continuous-logo${partner.wordmark ? " wordmark" : ""}`}>
            {partner.logo ? <img src={partner.logo} alt={duplicate ? "" : partner.name} /> : partner.wordmark}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function OfficialPartners() {
  return (
    <section className="official-partners" aria-labelledby="partners-title">
      <div className="partners-heading">
        <span>Trusted technology brands</span>
        <h2 id="partners-title">Official Partners</h2>
        <p>Working with the names that shape modern technology.</p>
      </div>

      <div className="continuous-partners" aria-label="Technology partners">
        <div className="continuous-partners-track">
          <PartnerRow />
          <PartnerRow duplicate />
        </div>
      </div>
    </section>
  );
}
