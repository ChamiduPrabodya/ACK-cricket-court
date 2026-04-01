import { useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
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

function isWeekday(dateISO) {
  const d = new Date(`${dateISO}T00:00:00`);
  const day = d.getDay(); // 0 Sun ... 6 Sat
  return day >= 1 && day <= 5;
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

function computePricing({ dateISO, startHour, endHour, hours }) {
  const anyNight = startHour < 7 || endHour > 18;
  if (anyNight) return { rate: 2500, label: "Indoor Court (with lights)" };

  const inPromoWindow = startHour >= 7 && endHour <= 18 && isWeekday(dateISO);
  if (inPromoWindow) return { rate: 1500, label: "Indoor Court (without lights)" };

  return { rate: 2000, label: "Indoor Court (without lights)" };
}

export default function Book() {
  const user = getUser();
  const slots = useMemo(() => buildSlots(), []);
  const [date, setDate] = useState(todayISO());
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState("");

  const selectedRange = useMemo(() => {
    if (selected.length === 0) return null;
    const sorted = [...selected].sort((a, b) => a - b);
    return { startIdx: sorted[0], endIdx: sorted[sorted.length - 1] };
  }, [selected]);

  const selectedHours = selected.length;
  const selectedStartHour = selectedRange ? slots[selectedRange.startIdx] : null;
  const selectedEndHour = selectedRange ? slots[selectedRange.endIdx] + 1 : null;

  const canConfirm = Boolean(date) && selectedHours > 0;

  const pricing = useMemo(() => {
    if (!date || selectedHours === 0 || selectedStartHour == null || selectedEndHour == null) return null;
    return computePricing({
      dateISO: date,
      startHour: selectedStartHour,
      endHour: selectedEndHour,
      hours: selectedHours
    });
  }, [date, selectedHours, selectedStartHour, selectedEndHour]);

  const totalPrice = pricing ? pricing.rate * selectedHours : 0;

  const selectedSlotLabels = useMemo(() => {
    if (!selectedRange) return [];
    const out = [];
    for (let idx = selectedRange.startIdx; idx <= selectedRange.endIdx; idx += 1) {
      out.push(formatSlotLabel(slots[idx]));
    }
    return out;
  }, [selectedRange, slots]);

  function showToast(message) {
    setToast(message);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 3200);
  }

  function onToggleSlot(idx) {
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

      showToast("Please select consecutive time slots only");
      return prev;
    });
  }

  function confirm() {
    if (!canConfirm) return;
    const pricing = computePricing({
      dateISO: date,
      startHour: selectedStartHour,
      endHour: selectedEndHour,
      hours: selectedHours
    });
    const total = pricing.rate * selectedHours;
    const booking = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      createdAt: new Date().toISOString(),
      userEmail: user.email,
      userName: user.name,
      userPhone: user.phone || "",
      date,
      startHour: selectedStartHour,
      endHour: selectedEndHour,
      hours: selectedHours,
      pricing: { currency: "LKR", rate: pricing.rate, total, label: pricing.label }
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

            <div className="slotsHeaderRow">
              <div className="slotsHeader">Time Slots (Select consecutive slots)</div>
              {selectedHours > 0 ? (
                <div className="slotsCount">{selectedHours} slots selected</div>
              ) : null}
            </div>
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
          </div>

          <aside className="card summaryCard">
            <h2 className="cardTitle">Booking Summary</h2>
            <div className="summaryBlock">
              <div className="summaryLabel">Date</div>
              <div className="summaryDateValue">{formatLongDate(date)}</div>
            </div>
            <div className="summaryBlock">
              <div className="summaryLabel">Selected Time Slots</div>
              <div className="summarySlots">
                {selectedSlotLabels.length === 0 ? (
                  <div className="summaryEmpty">Select time slots to continue</div>
                ) : (
                  selectedSlotLabels.map((s) => (
                    <div className="summarySlot" key={s}>
                      {s}
                    </div>
                  ))
                )}
              </div>
              <div className="summaryTotal">
                Total: {selectedHours === 0 ? "-" : `${selectedHours} hour${selectedHours === 1 ? "" : "s"}`}
              </div>

              {pricing ? (
                <>
                  <div className="summaryDivider" role="separator" aria-hidden="true" />
                  <div className="summaryLabel">Price Breakdown</div>
                  <div className="summaryPriceRow">
                    <div className="summaryPriceLeft">
                      <div className="summaryPriceName">
                        {pricing.label} ({selectedHours}h)
                      </div>
                      <div className="summaryPriceMeta">{formatMoneyLKR(pricing.rate)}/hour</div>
                    </div>
                    <div className="summaryPriceValue">{formatMoneyLKR(totalPrice)}</div>
                  </div>
                  <div className="summaryDivider" role="separator" aria-hidden="true" />
                  <div className="summaryGrandTotalRow">
                    <div className="summaryGrandTotalLabel">Total</div>
                    <div className="summaryGrandTotalValue">{formatMoneyLKR(totalPrice)}</div>
                  </div>
                </>
              ) : null}
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
      <Footer />
      {toast ? (
        <div className="toast" role="status" aria-live="polite">
          <div className="toastIcon" aria-hidden="true">
            !
          </div>
          <div className="toastText">{toast}</div>
        </div>
      ) : null}
    </div>
  );
}
