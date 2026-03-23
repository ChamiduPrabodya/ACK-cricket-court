import Navbar from "../components/Navbar.jsx";
import { IconArrowRight, IconCalendar } from "../components/icons.jsx";

export default function Login() {
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
              }}
            >
              <label className="field">
                <span className="fieldLabel">Email</span>
                <input className="fieldInput" type="email" placeholder="your@email.com" required />
              </label>

              <label className="field">
                <span className="fieldLabel">Password</span>
                <input className="fieldInput" type="password" placeholder="********" required />
              </label>

              <button className="btn btnPrimary authBtn" type="submit">
                <IconArrowRight />
                Sign In
              </button>
            </form>

            <div className="authFoot">
              Don&apos;t have an account?{" "}
              <a className="authLink" href="#/signup">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
