import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { getUser } from "../services/auth.js";
import { listBookingsForEmail } from "../services/bookings.js";

function formatTimeRange(startHour, endHour) {
  const to12 = (h) => {
    const hour = ((h + 11) % 12) + 1;
    const ampm = h < 12 || h === 24 ? "AM" : "PM";
    return `${hour}:00 ${ampm}`;
  };
  return `${to12(startHour)} - ${to12(endHour)}`;
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

  return (
    <div className="page bookingPage">
      <Navbar />
      <div className="bookingHero bookingHeroSmall">
        <div className="container bookingHeroInner">
          <h1 className="bookingTitle">My Bookings</h1>
          <p className="bookingSub">Your confirmed and upcoming bookings</p>
        </div>
      </div>

      <div className="container bookingBody">
        <div className="card">
          {bookings.length === 0 ? (
            <div className="emptyState">
              <div className="emptyTitle">No bookings yet</div>
              <div className="emptySub">Go to “Book Now” to reserve a slot.</div>
            </div>
          ) : (
            <div className="bookingList">
              {bookings.map((b) => (
                <article className="bookingItem" key={b.id}>
                  <div className="bookingItemMain">
                    <div className="bookingItemTitle">{b.date}</div>
                    <div className="bookingItemSub">{formatTimeRange(b.startHour, b.endHour)}</div>
                  </div>
                  <div className="bookingItemMeta">{b.hours} hr(s)</div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

