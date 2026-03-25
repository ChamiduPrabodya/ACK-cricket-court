import Navbar from "../components/Navbar.jsx";
import { IconCalendar, IconUserPlus } from "../components/icons.jsx";
import { setUser } from "../services/auth.js";
import { go } from "../services/hashRoute.js";

export default function Signup({ returnTo = "/" }) {
  return (
    <div className="authPage">
      <Navbar />
      <div className="authBg authBgPink">
        <div className="authWrap container">
          <div className="authCard" role="region" aria-label="Create account">
            <div className="authIcon authIconPink" aria-hidden="true">
              <IconCalendar />
            </div>
            <h1 className="authTitle">Create Account</h1>
            <p className="authSub">Join ACK Indoor Cricket Court</p>

            <form
              className="authForm"
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                const name = String(form.get("name") || "").trim();
                const email = String(form.get("email") || "").trim();
                const phone = String(form.get("phone") || "").trim();
                const password = String(form.get("password") || "");
                if (!name || !email || !password) return;
                setUser({ id: "user-001", role: "User", name, email, phone });
                go(returnTo);
              }}
            >
              <label className="field">
                <span className="fieldLabel">Full Name</span>
                <input
                  className="fieldInput"
                  name="name"
                  type="text"
                  placeholder="John Silva"
                  required
                />
              </label>

              <label className="field">
                <span className="fieldLabel">Email</span>
                <input
                  className="fieldInput"
                  name="email"
                  type="email"
                  placeholder="john.silva@gmail.com"
                  required
                />
              </label>

              <label className="field">
                <span className="fieldLabel">Phone Number</span>
                <input className="fieldInput" name="phone" type="tel" placeholder="+94 77 123 4567" />
              </label>

              <label className="field">
                <span className="fieldLabel">Password</span>
                <input
                  className="fieldInput"
                  name="password"
                  type="password"
                  placeholder="********"
                  minLength={6}
                  required
                />
                <div className="fieldHint">Minimum 6 characters</div>
              </label>

              <button className="btn btnPrimary authBtn" type="submit">
                <IconUserPlus />
                Create Account
              </button>
            </form>

            <div className="authFoot">
              Already have an account?{" "}
              <a className="authLink" href={`#/login?returnTo=${encodeURIComponent(returnTo)}`}>
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
