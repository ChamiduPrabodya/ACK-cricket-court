import { useEffect, useMemo, useState } from "react";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

function getRouteFromHash() {
  const hash = window.location.hash || "#/";
  const route = hash.startsWith("#/") ? hash.slice(1) : "/";
  return route === "" ? "/" : route;
}

export default function Router() {
  const [route, setRoute] = useState(getRouteFromHash());

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [route]);

  const element = useMemo(() => {
    if (route === "/") return <Home />;
    if (route === "/login") return <Login />;
    if (route === "/signup") return <Signup />;
    return <Home />;
  }, [route]);

  return element;
}
