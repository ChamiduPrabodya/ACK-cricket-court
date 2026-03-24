import { useEffect, useState } from "react";
import { clearUser, getUser } from "../services/auth.js";
import { go } from "../services/hashRoute.js";
import { IconBook, IconChevronDown, IconHome, IconList, IconUserCircle } from "./icons.jsx";

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
  const [user, setUser] = useState(() => getUser());

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onAuth = () => setUser(getUser());
    window.addEventListener("ack:auth", onAuth);
    window.addEventListener("storage", onAuth);
    return () => {
      window.removeEventListener("ack:auth", onAuth);
      window.removeEventListener("storage", onAuth);
    };
  }, []);

  return (
    <header className="navWrap">
      <div className="navContainer nav">
        <Logo />
        <nav className="navActions" aria-label="Primary">
          <a className={`navLink ${route === "/" ? "navLinkActive" : ""}`} href="#/">
            <IconHome className="navBtnIcon" />
            Home
          </a>
          {user ? (
            <>
              <a className={`navLink ${route === "/book" ? "navLinkActive" : ""}`} href="#/book">
                <IconBook className="navBtnIcon" />
                Book Now
              </a>
              <a
                className={`navLink ${route === "/my-bookings" ? "navLinkActive" : ""}`}
                href="#/my-bookings"
              >
                <IconList className="navBtnIcon" />
                My Bookings
              </a>
              <div className="navDivider" aria-hidden="true" />
              <details className="userMenu">
                <summary className="userChip" aria-label="User menu">
                  <span className="userAvatar" aria-hidden="true">
                    <IconUserCircle />
                  </span>
                  <span className="userMeta">
                    <span className="userName">{user.name || "User"}</span>
                    <span className="userRole">User</span>
                  </span>
                  <IconChevronDown className="userChevron" />
                </summary>
                <div className="userDrop">
                  <button
                    type="button"
                    className="userDropBtn"
                    onClick={() => {
                      clearUser();
                      go("/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
              </details>
            </>
          ) : (
            <>
              <div className="navDivider" aria-hidden="true" />
              <a className={`navBtn ${route === "/login" ? "navBtnActive" : ""}`} href="#/login">
                Login
              </a>
              <a
                className={`navBtn navBtnPrimary ${route === "/signup" ? "navBtnActive" : ""}`}
                href="#/signup"
              >
                Sign Up
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
