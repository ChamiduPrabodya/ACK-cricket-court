import Navbar from "../components/Navbar.jsx";
import { IconCalendar, IconUserPlus } from "../components/icons.jsx";

export default function Signup() {
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
              }}
            >
              <label className="field">
                <span className="fieldLabel">Full Name</span>
                <input className="fieldInput" type="text" placeholder="John Doe" required />
              </label>

              <label className="field">
                <span className="fieldLabel">Email</span>
                <input className="fieldInput" type="email" placeholder="your@email.com" required />
              </label>

              <label className="field">
                <span className="fieldLabel">Phone Number</span>
                <input className="fieldInput" type="tel" placeholder="+94 XX XXX XXXX" />
              </label>

              <label className="field">
                <span className="fieldLabel">Password</span>
                <input
                  className="fieldInput"
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
              <a className="authLink" href="#/login">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
