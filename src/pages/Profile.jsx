import { useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { IconInfo, IconMail, IconPhone, IconSave, IconUser } from "../components/icons.jsx";
import { getUser, setUser } from "../services/auth.js";

export default function Profile() {
  const user = getUser();

  const initial = useMemo(() => {
    const current = user || { name: "", email: "", phone: "" };
    return {
      id: current.id || "user-001",
      role: current.role || "User",
      name: current.name || "",
      email: current.email || "",
      phone: current.phone || "",
    };
  }, [user]);

  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);

  return (
    <div className="profilePage">
      <Navbar />
      <div className="profileBg">
        <div className="profileWrap container">
          <header className="profileHeader">
            <div className="profileHeroIcon" aria-hidden="true">
              <IconUser />
            </div>
            <h1 className="profileTitle">My Profile</h1>
            <p className="profileSub">Update your personal information</p>
          </header>

          <section className="profileCard" aria-label="Profile form">
            <div className="profileSummary">
              <div className="profileSummaryItem">
                <div className="profileSummaryLabel">Account ID</div>
                <div className="profileSummaryValue">{initial.id}</div>
              </div>
              <div className="profileSummaryItem profileSummaryItemRight">
                <div className="profileSummaryLabel">Role</div>
                <div className="rolePill">
                  <IconUser />
                  {initial.role}
                </div>
              </div>
            </div>

            <form
              className="profileForm"
              onSubmit={(e) => {
                e.preventDefault();
                const next = {
                  ...user,
                  id: initial.id,
                  role: initial.role,
                  name: name.trim(),
                  email: email.trim(),
                  phone: phone.trim(),
                };
                setUser(next);
              }}
              onReset={(e) => {
                e.preventDefault();
                setName(initial.name);
                setEmail(initial.email);
                setPhone(initial.phone);
              }}
            >
              <label className="field">
                <span className="fieldLabel">Full Name</span>
                <span className="fieldInputIconWrap">
                  <span className="fieldIcon" aria-hidden="true">
                    <IconUser />
                  </span>
                  <input
                    className="fieldInput fieldInputWithIcon"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Silva"
                    required
                  />
                </span>
              </label>

              <label className="field">
                <span className="fieldLabel">Email Address</span>
                <span className="fieldInputIconWrap">
                  <span className="fieldIcon" aria-hidden="true">
                    <IconMail />
                  </span>
                  <input
                    className="fieldInput fieldInputWithIcon"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.silva@gmail.com"
                    required
                  />
                </span>
              </label>

              <label className="field">
                <span className="fieldLabel">Phone Number</span>
                <span className="fieldInputIconWrap">
                  <span className="fieldIcon" aria-hidden="true">
                    <IconPhone />
                  </span>
                  <input
                    className="fieldInput fieldInputWithIcon"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                  />
                </span>
                <div className="fieldHint">Sri Lankan format: +94 or 0 followed by 9-10 digits</div>
              </label>

              <div className="profileActions">
                <button className="btn btnPrimary profileSave" type="submit">
                  <IconSave />
                  Save Changes
                </button>
                <button className="btn profileReset" type="reset">
                  Reset
                </button>
              </div>

              <div className="profileNote" role="note" aria-label="Important notes">
                <div className="profileNoteTitle">
                  <IconInfo />
                  Important Notes:
                </div>
                <ul className="profileNoteList">
                  <li>Your email address is used for login and notifications</li>
                  <li>Phone number is used for booking confirmations</li>
                  <li>All changes are saved immediately upon submission</li>
                </ul>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
