import { IconClock, IconPin, IconTrophy, IconUsers } from "./icons.jsx";

const items = [
  {
    title: "Professional Pitch",
    desc: "Premium quality turf with excellent bounce and pace",
    Icon: IconTrophy,
    tint: "mint"
  },
  {
    title: "Flexible Timing",
    desc: "Available throughout the day and night",
    Icon: IconClock,
    tint: "sky"
  },
  {
    title: "Group Friendly",
    desc: "Perfect for teams and coaching sessions",
    Icon: IconUsers,
    tint: "lilac"
  },
  {
    title: "Prime Location",
    desc: "Located in Hokandara with easy access",
    Icon: IconPin,
    tint: "sand"
  }
];

export default function WhyChoose() {
  return (
    <section className="section" aria-label="Why Choose">
      <div className="container">
        <h2 className="sectionTitle">Why Choose ACK Indoor Cricket Court?</h2>
        <div className="grid4">
          {items.map(({ title, desc, Icon, tint }) => (
            <article className="featureCard" key={title}>
              <div className={`featureIcon featureIcon-${tint}`}>
                <Icon />
              </div>
              <h3 className="featureTitle">{title}</h3>
              <p className="featureDesc">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

