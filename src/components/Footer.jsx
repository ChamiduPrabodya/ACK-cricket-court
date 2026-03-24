export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="appFooter" aria-label="Footer">
      <div className="container footerInner">
        <div className="footerLeft">
          <div className="footerBrand">ACK Indoor Cricket</div>
          <div className="footerSub">Hokandara, Sri Lanka</div>
        </div>
        <div className="footerRight">
          <a className="footerLink" href="#/">
            Home
          </a>
          <a className="footerLink" href="#/book">
            Book Now
          </a>
          <a className="footerLink" href="#/my-bookings">
            My Bookings
          </a>
          <span className="footerCopy">© {year} ACK</span>
        </div>
      </div>
    </footer>
  );
}

