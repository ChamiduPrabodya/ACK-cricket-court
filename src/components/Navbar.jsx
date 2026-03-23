import { IconHome } from "./icons.jsx";

function Logo() {
  return (
    <div className="navLogo">
      <div className="navMark" aria-hidden="true">
        ACK
      </div>
      <div className="navText">
        <div className="navTitle">ACK Indoor Cricket</div>
        <div className="navSub">Hokandara</div>
      </div>
    </div>
  );
}

export default function Navbar() {
  return (
    <header className="navWrap">
      <div className="container nav">
        <Logo />
        <nav className="navActions" aria-label="Primary">
          <a className="navBtn navBtnActive" href="#">
            <IconHome className="navBtnIcon" />
            Home
          </a>
          <div className="navDivider" aria-hidden="true" />
          <a className="navBtn" href="#login">
            Login
          </a>
          <a className="navBtn navBtnPrimary" href="#signup">
            Sign Up
          </a>
        </nav>
      </div>
    </header>
  );
}

