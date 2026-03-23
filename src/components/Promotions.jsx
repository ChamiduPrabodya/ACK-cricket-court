import { IconStar } from "./icons.jsx";

export default function Promotions() {
  return (
    <section className="promo" aria-label="Promotions">
      <div className="promoBg">
        <div className="container promoInner">
          <IconStar className="promoStar" />
          <div className="promoText">
            <div className="promoTitle">Active Promotions!</div>
            <div className="promoSub">March Special Offer</div>
            <div className="promoNote">
              Weekdays 7 AM - 6 PM: Only Rs. 1,500/hour (without lights)
            </div>
          </div>
          <IconStar className="promoStar" />
        </div>
      </div>
    </section>
  );
}

