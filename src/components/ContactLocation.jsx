import { IconLocation, IconMail, IconPhone } from "./icons.jsx";

export default function ContactLocation() {
  return (
    <footer className="contact" aria-label="Contact and Location">
      <div className="container contactGrid">
        <div>
          <h2 className="contactTitle">Get in Touch</h2>
          <ul className="contactList">
            <li>
              <span className="contactIcon">
                <IconLocation />
              </span>
              <span>ACK Indoor Cricket Court, Hokandara, Sri Lanka</span>
            </li>
            <li>
              <span className="contactIcon">
                <IconPhone />
              </span>
              <span>Contact us for bookings</span>
            </li>
            <li>
              <span className="contactIcon">
                <IconMail />
              </span>
              <span>bookings@ackindoor.com</span>
            </li>
          </ul>

          <h3 className="contactSubTitle">Book Your Slot Today</h3>
          <p className="contactDesc">
            Whether you're a beginner or a professional, our facility caters to all skill levels.
            Perfect for individual practice, team training, or friendly matches.
          </p>
          <a className="btn btnPrimary" href="#/login">
            Login to Book
          </a>
        </div>

        <div>
          <div className="locationTitleRow">
            <h2 className="contactTitle">Our Location</h2>
            <a
              className="mapLink"
              href="https://www.google.com/maps"
              target="_blank"
              rel="noreferrer"
            >
              Open in Maps ↗
            </a>
          </div>
          <div className="mapFrame">
            <iframe
              title="ACK Indoor Cricket Court location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Hokandara%2C%20Sri%20Lanka&output=embed"
              allowFullScreen
            />
          </div>
          <div className="mapNote">
            <span className="pinDot" aria-hidden="true">
              📍
            </span>
            Located in Hokandara - Easy access from Colombo and surrounding areas
          </div>
        </div>
      </div>
    </footer>
  );
}
