const facilities = [
  {
    title: "Indoor Cricket Court",
    desc: "Full-size indoor court with quality artificial turf and professional equipment",
    tag: null,
    img: "facility-1.jpg"
  },
  {
    title: "Hard Ball Nets",
    desc: "Professional hard ball nets for advanced training - launching soon!",
    tag: "Coming Soon",
    img: "facility-2.jpg"
  }
];

function Card({ title, desc, tag, img }) {
  const src = new URL(`../assets/${img}`, import.meta.url).toString();
  return (
    <article className="facilityCard">
      <div className="facilityMedia">
        <img
          className="facilityImg"
          src={src}
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="facilityImgFallback" aria-hidden="true" />
      </div>
      <div className="facilityBody">
        <div className="facilityTitleRow">
          <h3 className="facilityTitle">{title}</h3>
          {tag ? <span className="pill">{tag}</span> : null}
        </div>
        <p className="facilityDesc">{desc}</p>
      </div>
    </article>
  );
}

export default function Facilities() {
  return (
    <section className="section sectionLoose" aria-label="Facilities">
      <div className="container">
        <h2 className="sectionTitle">Our Facilities</h2>
        <div className="grid2">
          {facilities.map((f) => (
            <Card key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

