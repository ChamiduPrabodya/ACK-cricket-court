import { useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { getUser } from "../services/auth.js";
import { addBooking } from "../services/bookings.js";
import { go } from "../services/hashRoute.js";
import { IconCalendar, IconInfo } from "../components/icons.jsx";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatSlotLabel(startHour24) {
  const end = startHour24 + 1;
  const to12 = (h) => {
    const hour = ((h + 11) % 12) + 1;
    const ampm = h < 12 || h === 24 ? "AM" : "PM";
    return `${hour}:00 ${ampm}`;
  };
  return `${to12(startHour24)} - ${to12(end)}`;
}

function formatRange(startHour24, endHour24) {
  const to12 = (h) => {
    const hour = ((h + 11) % 12) + 1;
    const ampm = h < 12 || h === 24 ? "AM" : "PM";
    return `${hour}:00 ${ampm}`;
  };
  return `${to12(startHour24)} - ${to12(endHour24)}`;
}

function buildSlots() {
  const start = 6;
  const end = 23; // last slot 10 PM - 11 PM
  const out = [];
  for (let h = start; h <= end; h += 1) out.push(h);
  return out;
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export default function Book() {
  const user = getUser();
  const slots = useMemo(() => buildSlots(), []);
  const [date, setDate] = useState(todayISO());
  const [selected, setSelected] = useState([]);
  const [hint, setHint] = useState("");

  const selectedRange = useMemo(() => {
    if (selected.length === 0) return null;
    const sorted = [...selected].sort((a, b) => a - b);
    return { startIdx: sorted[0], endIdx: sorted[sorted.length - 1] };
  }, [selected]);

  const selectedHours = selected.length;
  const selectedStartHour = selectedRange ? slots[selectedRange.startIdx] : null;
  const selectedEndHour = selectedRange ? slots[selectedRange.endIdx] + 1 : null;

  const canConfirm = Boolean(date) && selectedHours > 0;

  function onToggleSlot(idx) {
    setHint("");
    setSelected((prev) => {
      if (prev.includes(idx)) {
        if (prev.length === 1) return [];
        return [idx];
      }
      if (prev.length === 0) return [idx];

      const sorted = [...prev].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      if (idx === max + 1) return [...sorted, idx];
      if (idx === min - 1) return [idx, ...sorted];

      setHint("Slots must be consecutive. Click a slot to start a new selection.");
      return [idx];
    });
  }

  function confirm() {
    if (!canConfirm) return;
    const booking = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      createdAt: new Date().toISOString(),
      userEmail: user.email,
      userName: user.name,
      userPhone: user.phone || "",
      date,
      startHour: selectedStartHour,
      endHour: selectedEndHour,
      hours: selectedHours
    };
    addBooking(booking);
    go("/my-bookings");
  }

  return (
    <div className="page bookingPage">
      <Navbar />

      <div className="bookingHero">
        <div className="container bookingHeroInner">
          <h1 className="bookingTitle">Book Your Slot</h1>
          <p className="bookingSub">ACK Indoor Cricket Court, Hokandara</p>
        </div>
      </div>

      <div className="container bookingBody">
        <div className="infoBox" role="note" aria-label="How to select time slots">
          <div className="infoIcon" aria-hidden="true">
            <IconInfo />
          </div>
          <div>
            <div className="infoTitle">How to select time slots:</div>
            <div className="infoText">
              Click on time slots to select them. You can select multiple consecutive slots (e.g.,
              6:00-7:00, 7:00-8:00, 8:00-9:00). Slots must be in a row - you cannot select random
              slots like 6:00-7:00 and 10:00-11:00.
            </div>
          </div>
        </div>

        <div className="bookingGrid">
          <div className="card">
            <h2 className="cardTitle">Select Date &amp; Time</h2>

            <div className="fieldRow">
              <div className="labelRow">
                <IconCalendar />
                <span>Date</span>
              </div>
              <input
                className="fieldInput bookingDate"
                type="date"
                value={date}
                min={todayISO()}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="slotsHeader">Time Slots (Select consecutive slots)</div>
            <div className="timeGrid" role="list">
              {slots.map((startHour, idx) => {
                const isSelected = selected.includes(idx);
                return (
                  <button
                    key={startHour}
                    type="button"
                    role="listitem"
                    className={`slotBtn ${isSelected ? "slotBtnSelected" : ""}`}
                    onClick={() => onToggleSlot(idx)}
                  >
                    {formatSlotLabel(startHour)}
                  </button>
                );
              })}
            </div>
            {hint ? <div className="slotHint">{hint}</div> : null}
          </div>

          <aside className="card summaryCard">
            <h2 className="cardTitle">Booking Summary</h2>
            <div className="summaryLine">
              <span>Date</span>
              <span className="summaryValue">{date || "-"}</span>
            </div>
            <div className="summaryLine">
              <span>Time</span>
              <span className="summaryValue">
                {selectedStartHour == null
                  ? "-"
                  : formatRange(selectedStartHour, selectedEndHour).replace(" - ", " → ")}
                {selectedStartHour == null ? "" : selectedHours > 1 ? ` (${selectedHours} hrs)` : " (1 hr)"}
              </span>
            </div>
            <button
              className={`btn authBtn ${canConfirm ? "btnPrimary" : "btnDisabled"}`}
              type="button"
              disabled={!canConfirm}
              onClick={confirm}
            >
              Confirm Booking
            </button>
            <div className="summaryNote">You will receive a confirmation email after booking</div>
          </aside>
        </div>

        <div className="card contactCard">
          <h2 className="cardTitle">Contact Details</h2>
          <div className="contactGridSmall">
            <label className="field">
              <span className="fieldLabel">Full Name</span>
              <input className="fieldInput" value={user.name || ""} readOnly />
            </label>
            <label className="field">
              <span className="fieldLabel">Email</span>
              <input className="fieldInput" value={user.email || ""} readOnly />
            </label>
            <label className="field">
              <span className="fieldLabel">Phone Number</span>
              <input className="fieldInput" value={user.phone || ""} readOnly />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
