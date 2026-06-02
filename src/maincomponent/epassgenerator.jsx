import { useState } from "react";
import axios from "axios";
import "../maincomponent/epassgenerator.css"

const API_URL = "https://tradeepass.bellaryinfotech.com/api/V2.0/users/register";

const IconUser = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24"><path d="M6 3h4l2 5-2.5 1.5a11 11 0 005 5L16 12l5 2v4a2 2 0 01-2 2C7 19 3 10.046 3 5a2 2 0 012-2z"/></svg>
);

const TICKERS = [
  { label: "NIFTY 50", val: "24,836.15", pct: "+0.62%", dir: "up" },
  { label: "SENSEX",   val: "81,449.02", pct: "+0.58%", dir: "up" },
  { label: "BANKNIFTY",val: "53,201.40", pct: "-0.31%", dir: "down" },
  { label: "RELIANCE", val: "2,941.75",  pct: "+1.10%", dir: "up" },
  { label: "TCS",      val: "3,815.30",  pct: "-0.45%", dir: "down" },
  { label: "INFOSYS",  val: "1,502.80",  pct: "+0.88%", dir: "up" },
];

const validate = ({ name, email, phone }) => {
  const errs = {};
  if (!name.trim()) errs.name = "Name is required";
  else if (name.trim().length < 2) errs.name = "Enter a valid name";
  if (!email.trim()) errs.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Enter a valid email";
  if (!phone.trim()) errs.phone = "Phone number is required";
  else if (!/^[6-9]\d{9}$/.test(phone.trim())) errs.phone = "Enter valid 10-digit mobile number";
  return errs;
};

function SuccessModal({ name, onClose }) {
  return (
    <div className="ep-overlay" onClick={onClose}>
      <div className="ep-modal" onClick={e => e.stopPropagation()}>
        <div className="ep-modal-glow" />
        <div className="ep-check-ring">
          <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
            <circle className="ep-ring-bg" cx="36" cy="36" r="32" />
            <circle className="ep-ring-progress" cx="36" cy="36" r="32" />
            <polyline className="ep-check-mark" points="22,37 31,46 50,27" />
          </svg>
        </div>
        <div className="ep-modal-tag">Registration Confirmed</div>
        <h2 className="ep-modal-title">Congratulations,<br />{name.split(" ")[0]}! 🎉</h2>
        <p className="ep-modal-msg">
          You have successfully registered for the <strong>Demo / Traders Meet</strong> with Trade With Srinivas.
          Your ePass has been dispatched to your registered WhatsApp number.
        </p>
        <div className="ep-modal-whatsapp">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12.003 2C6.477 2 2 6.477 2 12.003c0 1.771.461 3.434 1.267 4.876L2 22l5.233-1.237A9.954 9.954 0 0012.003 22C17.528 22 22 17.524 22 12.003 22 6.477 17.528 2 12.003 2zm0 18.154a8.139 8.139 0 01-4.17-1.143l-.3-.178-3.104.732.784-2.957-.196-.313A8.122 8.122 0 013.846 12c0-4.504 3.656-8.16 8.157-8.16 4.5 0 8.154 3.656 8.154 8.16 0 4.504-3.654 8.154-8.154 8.154z"/>
          </svg>
          <span>ePass sent to your WhatsApp number</span>
        </div>
        <button className="ep-modal-close" onClick={onClose}>
          Got it, Thank you!
        </button>
      </div>
    </div>
  );
}

const EpassGenerated = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: form.name.trim(),
        email: form.email.trim(),
        mobileNumber: form.phone.trim()
      };

      await axios.post(API_URL, payload);
      setSuccess(true);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setForm({ name: "", email: "", phone: "" });
    setErrors({});
  };

  return (
    <div className="ep-page">
      <div className="ep-ticker" aria-hidden="true">
        <div className="ep-ticker-track">
          {TICKERS.map((t, i) => (
            <span key={i} className={`ep-ticker-item ${t.dir}`}>
              {t.label}&nbsp;<b>{t.val}</b>&nbsp;{t.pct}
            </span>
          ))}
          {TICKERS.map((t, i) => (
            <span key={`d-${i}`} className={`ep-ticker-item ${t.dir}`}>
              {t.label}&nbsp;<b>{t.val}</b>&nbsp;{t.pct}
            </span>
          ))}
        </div>
      </div>

      <div className="ep-card">
        <div className="ep-logo-wrap">
          <div className="ep-badge">Exclusive Registration</div>
          <h1 className="ep-heading">
            Trade With<br /><span>Srinivas</span>
          </h1>
          <p className="ep-sub">
            Register below to receive your ePass for the upcoming Traders Meet &amp; Live Demo.
          </p>
        </div>

        <div className="ep-form">
          <div className="ep-field">
            <label className="ep-label">Full Name</label>
            <div className="ep-input-wrap">
              <input
                className={`ep-input${errors.name ? " ep-error" : ""}`}
                type="text"
                name="name"
                placeholder="Enter your Full Name"
                value={form.name}
                onChange={handleChange}
              />
              <span className="ep-input-icon"><IconUser /></span>
            </div>
            {errors.name && <span className="ep-error-msg">{errors.name}</span>}
          </div>

          <div className="ep-field">
            <label className="ep-label">Email Address</label>
            <div className="ep-input-wrap">
              <input
                className={`ep-input${errors.email ? " ep-error" : ""}`}
                type="email"
                name="email"
                placeholder="Enter your Email ID"
                value={form.email}
                onChange={handleChange}
              />
              <span className="ep-input-icon"><IconMail /></span>
            </div>
            {errors.email && <span className="ep-error-msg">{errors.email}</span>}
          </div>

          <div className="ep-field">
            <label className="ep-label">WhatsApp / Phone Number</label>
            <div className="ep-input-wrap">
              <input
                className={`ep-input${errors.phone ? " ep-error" : ""}`}
                type="tel"
                name="phone"
                placeholder="Enter your Mobile Number"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
              />
              <span className="ep-input-icon"><IconPhone /></span>
            </div>
            {errors.phone && <span className="ep-error-msg">{errors.phone}</span>}
          </div>

          <button className="ep-btn" onClick={handleSubmit} disabled={loading}>
            <span className="ep-btn-inner">
              {loading ? "Processing..." : "Get My ePass →"}
            </span>
          </button>
        </div>

        <p className="ep-note">
          Your ePass will be delivered instantly to your <strong>WhatsApp</strong> number.
        </p>
      </div>

      {success && <SuccessModal name={form.name || "Trader"} onClose={handleClose} />}
    </div>
  );
};

export default EpassGenerated;









