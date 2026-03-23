export default function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="heroOverlay">
        <div className="container heroInner">
          <h1 className="heroTitle">ACK Indoor Cricket Court</h1>
          <p className="heroPlace">Hokandara</p>
          <p className="heroDesc">
            Premium indoor cricket facility with state-of-the-art equipment. Book your slot for
            practice sessions, matches, or corporate events.
          </p>
          <a className="btn btnPrimary" href="#login">
            Login to Book
          </a>
        </div>
      </div>
    </section>
  );
}

