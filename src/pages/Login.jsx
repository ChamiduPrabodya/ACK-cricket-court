import Navbar from "../components/Navbar.jsx";
import { IconArrowRight, IconCalendar } from "../components/icons.jsx";
import { setUser } from "../services/auth.js";
import { go } from "../services/hashRoute.js";

function nameFromEmail(email) {
  const local = (email || "").split("@")[0] || "User";
  const nice = local.replace(/[._-]+/g, " ").trim();
  return nice ? nice.replace(/\b\w/g, (c) => c.toUpperCase()) : "User";
}

export default function Login({ returnTo = "/" }) {
  return (
    <div className="authPage">
      <Navbar />
      <div className="authBg">
        <div className="authWrap container">
          <div className="authCard" role="region" aria-label="Sign in">
            <div className="authIcon authIconBlue" aria-hidden="true">
              <IconCalendar />
            </div>
            <h1 className="authTitle">Welcome Back</h1>
            <p className="authSub">Sign in to ACK Indoor Cricket Court</p>

            <form
              className="authForm"
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                const email = String(form.get("email") || "").trim();
                const password = String(form.get("password") || "");
                if (!email || !password) return;
                setUser({ id: "user-001", role: "User", name: nameFromEmail(email), email, phone: "" });
                go(returnTo);
              }}
            >
              <label className="field">
                <span className="fieldLabel">Email</span>
                <input
                  className="fieldInput"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </label>

              <label className="field">
                <span className="fieldLabel">Password</span>
                <input
                  className="fieldInput"
                  name="password"
                  type="password"
                  placeholder="********"
                  required
                />
              </label>

              <button className="btn btnPrimary authBtn" type="submit">
                <IconArrowRight />
                Sign In
              </button>
            </form>

            <div className="authFoot">
              Don&apos;t have an account?{" "}
              <a className="authLink" href={`#/signup?returnTo=${encodeURIComponent(returnTo)}`}>
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
