const cards = [
  {
    title: "Daytime",
    badge: null,
    subtitle: "Without lights",
    price: "Rs. 2,000",
    priceColor: "green",
    features: ["Natural daylight", "Full equipment", "Professional turf"]
  },
  {
    title: "Weekday Deal",
    badge: "March Special",
    subtitle: "7 AM - 6 PM (No lights)",
    price: "Rs. 1,500",
    priceColor: "orange",
    highlighted: true,
    features: ["Weekdays only", "March special offer", "Not valid on holidays"]
  },
  {
    title: "Night Time",
    badge: null,
    subtitle: "With lights",
    price: "Rs. 2,500",
    priceColor: "green",
    features: ["Professional lighting", "Full equipment", "Evening/night sessions"],
    bolt: true
  }
];

function PricingCard({ title, badge, subtitle, price, priceColor, features, highlighted, bolt }) {
  return (
    <article className={`priceCard ${highlighted ? "priceCardHot" : ""}`}>
      {badge ? <div className="priceBadge">{badge}</div> : null}
      <div className="priceHead">
        <h3 className="priceTitle">
          {title} {bolt ? <span className="bolt">⚡</span> : null}
        </h3>
        <div className="priceSub">{subtitle}</div>
      </div>
      <div className={`priceValue priceValue-${priceColor}`}>
        {price}
        <span className="per">/hour</span>
      </div>
      <ul className="priceList">
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </article>
  );
}

export default function Pricing() {
  return (
    <section className="section sectionLoose" aria-label="Pricing">
      <div className="container">
        <h2 className="sectionTitle">Pricing</h2>
        <div className="grid3">
          {cards.map((c) => (
            <PricingCard key={c.title} {...c} />
          ))}
        </div>
        <p className="mutedCenter">All prices are in Sri Lankan Rupees (LKR)</p>
      </div>
    </section>
  );
}

