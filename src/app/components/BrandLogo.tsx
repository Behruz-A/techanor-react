interface BrandLogoProps {
  tone?: "light" | "dark";
}

export default function BrandLogo({ tone = "light" }: BrandLogoProps) {
  return (
    <span className={`brand-logo brand-logo--${tone}`} aria-label="Techanor">
      <span className="brand-logo__mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="brand-logo__name">ECHANOR</span>
    </span>
  );
}
