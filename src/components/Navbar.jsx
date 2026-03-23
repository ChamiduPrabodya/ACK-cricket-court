import { useEffect, useState } from "react";
import { IconHome } from "./icons.jsx";

function getRouteFromHash() {
  const hash = window.location.hash || "#/";
  const route = hash.startsWith("#/") ? hash.slice(1) : "/";
  return route === "" ? "/" : route;
}

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
  const [route, setRoute] = useState(getRouteFromHash());

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <header className="navWrap">
      <div className="container nav">
        <Logo />
        <nav className="navActions" aria-label="Primary">
          <a className={`navBtn ${route === "/" ? "navBtnActive" : ""}`} href="#/">
            <IconHome className="navBtnIcon" />
            Home
          </a>
          <div className="navDivider" aria-hidden="true" />
          <a className={`navBtn ${route === "/login" ? "navBtnActive" : ""}`} href="#/login">
            Login
          </a>
          <a className={`navBtn navBtnPrimary ${route === "/signup" ? "navBtnActive" : ""}`} href="#/signup">
            Sign Up
          </a>
        </nav>
      </div>
    </header>
  );
}
