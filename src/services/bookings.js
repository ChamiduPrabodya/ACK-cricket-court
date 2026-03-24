const KEY = "ack_bookings";

export function listBookings() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addBooking(booking) {
  const all = listBookings();
  all.unshift(booking);
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("ack:bookings"));
}

export function listBookingsForEmail(email) {
  return listBookings().filter((b) => b?.userEmail === email);
}

