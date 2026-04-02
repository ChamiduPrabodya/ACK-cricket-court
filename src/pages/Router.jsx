import { useEffect, useMemo, useState } from "react";
import { getUser } from "../services/auth.js";
import { parseHash } from "../services/hashRoute.js";
import Book from "./Book.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import MyBookings from "./MyBookings.jsx";
import Profile from "./Profile.jsx";
import Signup from "./Signup.jsx";

export default function Router() {
  const [{ path, params }, setRoute] = useState(() => parseHash());

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [path]);

  const element = useMemo(() => {
    const user = getUser();
    const protectedPaths = new Set(["/book", "/my-bookings", "/profile"]);
    const adminPaths = new Set(["/admin"]);
    if ((protectedPaths.has(path) || adminPaths.has(path)) && !user) {
      const returnTo = encodeURIComponent(path);
      window.location.hash = `#/login?returnTo=${returnTo}`;
      return null;
    }

    if (adminPaths.has(path) && user?.role !== "Admin") {
      window.location.hash = "#/";
      return null;
    }

    if (path === "/") return <Home />;
    if (path === "/login") return <Login returnTo={params.get("returnTo") || "/"} />;
    if (path === "/signup") return <Signup returnTo={params.get("returnTo") || "/"} />;
    if (path === "/book") return <Book />;
    if (path === "/admin") return <AdminDashboard />;
    if (path === "/my-bookings") return <MyBookings />;
    if (path === "/profile") return <Profile />;
    return <Home />;
  }, [path, params]);

  return element;
}
