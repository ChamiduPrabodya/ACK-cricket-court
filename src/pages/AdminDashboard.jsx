import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import { IconCalendar, IconClock, IconStar, IconTrendingUp, IconWallet } from "../components/icons.jsx";
import { listBookings, removeBooking } from "../services/bookings.js";
import { getUser } from "../services/auth.js";

function isWeekday(dateISO) {
  const d = new Date(`${dateISO}T00:00:00`);
  const day = d.getDay(); // 0 Sun ... 6 Sat
  return day >= 1 && day <= 5;
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

function formatLongDate(dateISO) {
  if (!dateISO) return "-";
  const d = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatRange(startHour24, endHour24) {
  const to12 = (h) => {
    const hour = ((h + 11) % 12) + 1;
    const ampm = h < 12 || h === 24 ? "AM" : "PM";
    return `${hour}:00 ${ampm}`;
  };
  return `${to12(startHour24)} - ${to12(endHour24)}`;
}

function safeBookingTotal(booking) {
  const fromPricing = Number(booking?.pricing?.total);
  if (!Number.isNaN(fromPricing) && fromPricing > 0) return fromPricing;
  const rate = Number(booking?.pricing?.rate);
  const hours = Number(booking?.hours);
  if (!Number.isNaN(rate) && !Number.isNaN(hours) && rate > 0 && hours > 0) return rate * hours;
  return 0;
}

function computeRateHint(booking) {
  const startHour = booking?.startHour ?? 0;
  const endHour = booking?.endHour ?? 0;
  const anyNight = startHour < 7 || endHour > 18;
  if (anyNight) return { rate: 2500, label: "Indoor Court (with lights)" };
  const inPromoWindow = startHour >= 7 && endHour <= 18 && isWeekday(booking?.date);
  if (inPromoWindow) return { rate: 1500, label: "Indoor Court (without lights)" };
  return { rate: 2000, label: "Indoor Court (without lights)" };
}

export default function AdminDashboard() {
  const user = getUser();
  const [tab, setTab] = useState("bookings");
  const [filter, setFilter] = useState("upcoming");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("ack:bookings", onChange);
    return () => window.removeEventListener("ack:bookings", onChange);
  }, []);

  const bookings = useMemo(() => {
    const all = listBookings();
    return [...all].sort((a, b) => {
      const da = String(a?.date || "");
      const db = String(b?.date || "");
      if (da !== db) return da.localeCompare(db);
      return Number(a?.startHour || 0) - Number(b?.startHour || 0);
    });
  }, [tick]);

  const upcoming = useMemo(() => bookings.filter(isUpcoming), [bookings]);
  const past = useMemo(() => bookings.filter((b) => !isUpcoming(b)), [bookings]);

  const visibleBookings = useMemo(() => {
    if (filter === "upcoming") return upcoming;
    if (filter === "past") return past;
    return bookings;
  }, [bookings, filter, past, upcoming]);

  const totalRevenue = useMemo(() => bookings.reduce((sum, b) => sum + safeBookingTotal(b), 0), [bookings]);
  const upcomingRevenue = useMemo(() => upcoming.reduce((sum, b) => sum + safeBookingTotal(b), 0), [upcoming]);

  return (
    <div className="page adminPage">
      <Navbar />

      <div className="adminHero">
        <div className="container adminHeroInner">
          <h1 className="adminTitle">Admin Dashboard</h1>
          <p className="adminSub">Manage bookings, promotions, and analytics</p>
        </div>
      </div>

      <div className="container adminBody">
        <div className="adminTabs" role="tablist" aria-label="Admin sections">
          <button
            type="button"
            className={`adminTab ${tab === "bookings" ? "adminTabActive" : ""}`}
            onClick={() => setTab("bookings")}
            role="tab"
            aria-selected={tab === "bookings"}
          >
            <IconCalendar />
            Bookings
          </button>
          <button
            type="button"
            className={`adminTab ${tab === "promotions" ? "adminTabActive" : ""}`}
            onClick={() => setTab("promotions")}
            role="tab"
            aria-selected={tab === "promotions"}
          >
            <IconStar />
            Promotions
          </button>
          <button
            type="button"
            className={`adminTab ${tab === "analytics" ? "adminTabActive" : ""}`}
            onClick={() => setTab("analytics")}
            role="tab"
            aria-selected={tab === "analytics"}
          >
            <IconTrendingUp />
            Analytics
          </button>
        </div>

        {tab === "bookings" ? (
          <>
            <div className="adminStats">
              <div className="card adminStatCard">
                <div className="adminStatTop">
                  <div className="adminStatLabel">Total Bookings</div>
                  <div className="adminStatIcon adminStatIconBlue" aria-hidden="true">
                    <IconCalendar />
                  </div>
                </div>
                <div className="adminStatValue">{bookings.length}</div>
              </div>
              <div className="card adminStatCard">
                <div className="adminStatTop">
                  <div className="adminStatLabel">Upcoming</div>
                  <div className="adminStatIcon adminStatIconGreen" aria-hidden="true">
                    <IconClock />
                  </div>
                </div>
                <div className="adminStatValue">{upcoming.length}</div>
              </div>
              <div className="card adminStatCard">
                <div className="adminStatTop">
                  <div className="adminStatLabel">Total Revenue</div>
                  <div className="adminStatIcon adminStatIconPurple" aria-hidden="true">
                    <IconWallet />
                  </div>
                </div>
                <div className="adminStatValue">{formatMoneyLKR(totalRevenue)}</div>
              </div>
              <div className="card adminStatCard">
                <div className="adminStatTop">
                  <div className="adminStatLabel">Upcoming Revenue</div>
                  <div className="adminStatIcon adminStatIconOrange" aria-hidden="true">
                    <IconTrendingUp />
                  </div>
                </div>
                <div className="adminStatValue">{formatMoneyLKR(upcomingRevenue)}</div>
              </div>
            </div>

            <div className="adminFilters" aria-label="Booking filters">
              <button
                type="button"
                className={`pillBtn ${filter === "all" ? "pillBtnActive" : ""}`}
                onClick={() => setFilter("all")}
              >
                All ({bookings.length})
              </button>
              <button
                type="button"
                className={`pillBtn ${filter === "upcoming" ? "pillBtnActiveGreen" : ""}`}
                onClick={() => setFilter("upcoming")}
              >
                Upcoming ({upcoming.length})
              </button>
              <button
                type="button"
                className={`pillBtn ${filter === "past" ? "pillBtnActive" : ""}`}
                onClick={() => setFilter("past")}
              >
                Past ({past.length})
              </button>
            </div>

            <div className="card adminListCard" role="region" aria-label="Bookings list">
              {visibleBookings.length === 0 ? (
                <div className="adminEmpty">
                  <div className="adminEmptyIcon" aria-hidden="true">
                    <IconCalendar />
                  </div>
                  <div className="adminEmptyTitle">No Bookings Found</div>
                  <div className="adminEmptySub">No bookings match the selected filter</div>
                </div>
              ) : (
                <div className="adminList">
                  {visibleBookings.map((b) => {
                    const id = String(b?.id || "");
                    const startHour = Number(b?.startHour ?? 0);
                    const endHour = Number(b?.endHour ?? 0);
                    const hours = Number(b?.hours ?? 0);
                    const total = safeBookingTotal(b);
                    const hint = computeRateHint(b);
                    return (
                      <div className="adminItem" key={id || `${b?.date}-${b?.startHour}-${b?.userEmail}`}>
                        <div className="adminItemMain">
                          <div className="adminItemTitle">{formatLongDate(b?.date)}</div>
                          <div className="adminItemSub">
                            {formatRange(startHour, endHour)} • {hours}h • {hint.label}
                          </div>
                          <div className="adminItemMeta">
                            <span className="adminMetaChip">{b?.userName || "User"}</span>
                            <span className="adminMetaChip">{b?.userEmail || "-"}</span>
                            {b?.userPhone ? <span className="adminMetaChip">{b.userPhone}</span> : null}
                          </div>
                        </div>

                        <div className="adminItemSide">
                          <div className="adminItemTotal">{formatMoneyLKR(total)}</div>
                          <div className="adminItemRate">
                            {formatMoneyLKR(b?.pricing?.rate ?? hint.rate)}/hour
                          </div>
                          <button
                            type="button"
                            className="btn adminDeleteBtn"
                            disabled={!id || user?.role !== "Admin"}
                            onClick={() => {
                              if (!id) return;
                              if (!window.confirm("Delete this booking?")) return;
                              removeBooking(id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : null}

        {tab === "promotions" ? (
          <div className="card adminComingSoon" role="region" aria-label="Promotions">
            <div className="adminComingSoonTitle">Promotions</div>
            <div className="adminComingSoonSub">Coming soon. Current rates are applied automatically during booking.</div>
          </div>
        ) : null}

        {tab === "analytics" ? (
          <div className="card adminComingSoon" role="region" aria-label="Analytics">
            <div className="adminComingSoonTitle">Analytics</div>
            <div className="adminComingSoonSub">Coming soon. This section will show revenue trends and peak hours.</div>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}

