import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { IconCalendar, IconClock, IconMail, IconPhone, IconTrash, IconUser } from "../components/icons.jsx";
import { getUser } from "../services/auth.js";
import { listBookingsForEmail, removeBooking } from "../services/bookings.js";

function formatTimeRange(startHour, endHour) {
  const to12 = (h) => {
    const hour = ((h + 11) % 12) + 1;
    const ampm = h < 12 || h === 24 ? "AM" : "PM";
    return `${hour}:00 ${ampm}`;
  };
  return `${to12(startHour)} - ${to12(endHour)}`;
}

function formatBookedOn(isoString) {
  const d = new Date(isoString);
  const dd = String(d.getDate());
  const mm = String(d.getMonth() + 1);
  const yyyy = String(d.getFullYear());
  return `${dd}/${mm}/${yyyy}`;
}

function formatDateLong(dateISO) {
  const d = new Date(`${dateISO}T00:00:00`);
  const parts = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).formatToParts(d);
  const get = (type) => parts.find((p) => p.type === type)?.value || "";
  return `${get("weekday")}, ${get("day")} ${get("month")}, ${get("year")}`;
}

function buildSlotLabels(startHour, endHour) {
  const out = [];
  for (let h = startHour; h < endHour; h += 1) out.push(formatTimeRange(h, h + 1));
  return out;
}

function isWeekday(dateISO) {
  const d = new Date(`${dateISO}T00:00:00`);
  const day = d.getDay();
  return day >= 1 && day <= 5;
}

function computePricingFallback({ dateISO, startHour, endHour, hours }) {
  const anyNight = startHour < 7 || endHour > 18;
  if (anyNight) return { rate: 2500, label: "Indoor Court (with lights)" };
  const inPromoWindow = startHour >= 7 && endHour <= 18 && isWeekday(dateISO);
  if (inPromoWindow) return { rate: 1500, label: "Indoor Court (without lights)" };
  return { rate: 2000, label: "Indoor Court (without lights)" };
}

function isUpcoming(booking) {
  const now = new Date();
  const start = new Date(`${booking.date}T00:00:00`);
  if (start > new Date(now.getFullYear(), now.getMonth(), now.getDate())) return true;
  if (start < new Date(now.getFullYear(), now.getMonth(), now.getDate())) return false;
  return (booking.endHour ?? 0) > now.getHours();
}

function formatMoneyLKR(value) {
  const n = Number(value || 0);
  return `Rs. ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function splitLabel(label) {
  const match = String(label || "").match(/^(.*?)(\s*\(.*\))$/);
  if (!match) return { main: label || "Indoor Court", sub: "" };
  return { main: match[1].trim(), sub: match[2].trim() };
}

export default function MyBookings() {
  const user = getUser();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("ack:bookings", onChange);
    return () => window.removeEventListener("ack:bookings", onChange);
  }, []);

  const bookings = useMemo(() => listBookingsForEmail(user.email), [user.email, tick]);
  const upcoming = bookings.filter(isUpcoming);
  const past = bookings.filter((b) => !isUpcoming(b));

  return (
    <div className="page myBookingsPage">
      <Navbar />
      <div className="myBookingsHero">
        <div className="container bookingHeroInner">
          <h1 className="myBookingsTitle">My Bookings</h1>
          <p className="myBookingsSub">View and manage your cricket stadium bookings</p>
        </div>
      </div>

      <div className="container bookingBody">
        <h2 className="upTitle">Upcoming Bookings ({upcoming.length})</h2>

        {bookings.length === 0 ? (
          <div className="card">
            <div className="emptyState">
              <div className="emptyTitle">No bookings yet</div>
              <div className="emptySub">Go to “Book Now” to reserve a slot.</div>
            </div>
          </div>
        ) : (
          <div className="bookingCards">
            {upcoming.map((b) => {
              const fallback = computePricingFallback({
                dateISO: b.date,
                startHour: b.startHour,
                endHour: b.endHour,
                hours: b.hours
              });
              const total = b?.pricing?.total ?? fallback.rate * (b.hours || 0);
              const label = b?.pricing?.label ?? fallback.label;
              const { main: labelMain, sub: labelSub } = splitLabel(label);
              const slotLabels = buildSlotLabels(b.startHour, b.endHour);
              return (
                <article className="card bookingBig" key={b.id}>
                  <div className="bookingTop">
                    <div>
                      <div className="bookingPlace">
                        {labelMain} {labelSub ? <span className="bookingPlaceSub">{labelSub}</span> : null}
                      </div>
                      <div className="bookingBookedOn">Booked on {formatBookedOn(b.createdAt)}</div>
                    </div>
                    <div className="bookingTotal">
                      <div className="bookingTotalValue">{formatMoneyLKR(total)}</div>
                      <div className="bookingTotalLabel">Total</div>
                    </div>
                  </div>

                  <div className="bookingDetails">
                    <div className="detail detailDate">
                      <div className="detailHead">
                        <span className="detailIcon detailIconGreen">
                          <IconCalendar />
                        </span>
                        <span className="detailLabel">Date</span>
                      </div>
                      <div className="detailValue">{formatDateLong(b.date)}</div>
                    </div>

                    <div className="detail detailTime">
                      <div className="detailHead">
                        <span className="detailIcon detailIconGreen">
                          <IconClock />
                        </span>
                        <span className="detailLabel">Time &amp; Duration</span>
                      </div>
                      <div className="detailValue">
                        {slotLabels.join(", ")} ({b.hours}h)
                      </div>
                    </div>

                    <div className="detail detailName">
                      <div className="detailHead">
                        <span className="detailIcon detailIconGreen">
                          <IconUser />
                        </span>
                        <span className="detailLabel">Name</span>
                      </div>
                      <div className="detailValue">{b.userName}</div>
                    </div>

                    <div className="detail detailPhone">
                      <div className="detailHead">
                        <span className="detailIcon detailIconGreen">
                          <IconPhone />
                        </span>
                        <span className="detailLabel">Phone</span>
                      </div>
                      <div className="detailValue">{b.userPhone || "-"}</div>
                    </div>

                    <div className="detail detailEmail">
                      <div className="detailHead">
                        <span className="detailIcon detailIconGreen">
                          <IconMail />
                        </span>
                        <span className="detailLabel">Email</span>
                      </div>
                      <div className="detailValue">{b.userEmail}</div>
                    </div>

                    <div className="detail detailActions">
                      <button
                        type="button"
                        className="cancelBtn"
                        onClick={() => removeBooking(b.id)}
                      >
                        <IconTrash />
                        Cancel
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            {past.length > 0 ? (
              <>
                <h2 className="upTitle upTitlePast">Past Bookings ({past.length})</h2>
                {past.map((b) => {
                  const fallback = computePricingFallback({
                    dateISO: b.date,
                    startHour: b.startHour,
                    endHour: b.endHour,
                    hours: b.hours
                  });
                  const total = b?.pricing?.total ?? fallback.rate * (b.hours || 0);
                  const label = b?.pricing?.label ?? fallback.label;
                  return (
                    <article className="card bookingBig bookingPast" key={b.id}>
                      <div className="bookingTop">
                        <div>
                          <div className="bookingPlace">{label}</div>
                          <div className="bookingBookedOn">Booked on {formatBookedOn(b.createdAt)}</div>
                        </div>
                        <div className="bookingTotal">
                          <div className="bookingTotalValue">{formatMoneyLKR(total)}</div>
                          <div className="bookingTotalLabel">Total</div>
                        </div>
                      </div>
                      <div className="bookingDetails">
                        <div className="detail">
                          <div className="detailHead">
                            <span className="detailIcon detailIconGreen">
                              <IconCalendar />
                            </span>
                            <span className="detailLabel">Date</span>
                          </div>
                          <div className="detailValue">{formatDateLong(b.date)}</div>
                        </div>
                        <div className="detail">
                          <div className="detailHead">
                            <span className="detailIcon detailIconGreen">
                              <IconClock />
                            </span>
                            <span className="detailLabel">Time &amp; Duration</span>
                          </div>
                          <div className="detailValue">
                            {buildSlotLabels(b.startHour, b.endHour).join(", ")} ({b.hours}h)
                          </div>
                        </div>
                        <div className="detail">
                          <div className="detailHead">
                            <span className="detailIcon detailIconGreen">
                              <IconMail />
                            </span>
                            <span className="detailLabel">Email</span>
                          </div>
                          <div className="detailValue">{b.userEmail}</div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </>
            ) : null}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
