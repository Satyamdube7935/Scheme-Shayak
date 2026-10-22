import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../AuthContext.jsx";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ ...(user?.profile || {}) });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        age: form.age === "" ? null : Number(form.age),
        annualIncome: form.annualIncome === "" ? null : Number(form.annualIncome),
        disabilityPercent: form.disabilityPercent === "" ? null : Number(form.disabilityPercent),
        landHoldingAcres: form.landHoldingAcres === "" ? null : Number(form.landHoldingAcres)
      };
      const data = await api("/profile", { method: "PUT", body: payload });
      setUser((u) => ({ ...u, profile: data.profile }));
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="card">
      <h1>Citizen profile</h1>
      <p className="muted">Used only to evaluate scheme rules. You can also fill this by uploading documents.</p>
      {error && <div className="alert">{error}</div>}
      {saved && <p className="ok">Profile saved.</p>}
      <form onSubmit={onSubmit}>
        <div className="row">
          <div className="field"><label>Full name</label><input value={form.fullName || ""} onChange={(e) => set("fullName", e.target.value)} /></div>
          <div className="field"><label>Date of birth (DD/MM/YYYY)</label><input value={form.dateOfBirth || ""} onChange={(e) => set("dateOfBirth", e.target.value)} /></div>
        </div>
        <div className="row">
          <div className="field"><label>Age</label><input type="number" value={form.age ?? ""} onChange={(e) => set("age", e.target.value)} /></div>
          <div className="field">
            <label>Gender</label>
            <select value={form.gender || ""} onChange={(e) => set("gender", e.target.value)}>
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="field">
            <label>State</label>
            <select value={form.state || ""} onChange={(e) => set("state", e.target.value)}>
              <option value="">Select</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="field"><label>District</label><input value={form.district || ""} onChange={(e) => set("district", e.target.value)} /></div>
        </div>
        <div className="row">
          <div className="field">
            <label>Area</label>
            <select value={form.ruralUrban || ""} onChange={(e) => set("ruralUrban", e.target.value)}>
              <option value="">Select</option>
              <option value="rural">Rural</option>
              <option value="urban">Urban</option>
            </select>
          </div>
          <div className="field">
            <label>Social category</label>
            <select value={form.category || ""} onChange={(e) => set("category", e.target.value)}>
              <option value="">Select</option>
              {["GEN", "EWS", "OBC", "SC", "ST", "Minority"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="field"><label>Annual household income (₹)</label><input type="number" value={form.annualIncome ?? ""} onChange={(e) => set("annualIncome", e.target.value)} /></div>
          <div className="field">
            <label>Occupation</label>
            <select value={form.occupation || ""} onChange={(e) => set("occupation", e.target.value)}>
              <option value="">Select</option>
              {["student", "farmer", "agricultural labour", "unemployed", "salaried", "self-employed", "street vendor", "artisan", "homemaker"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="field">
            <label>Marital status</label>
            <select value={form.maritalStatus || ""} onChange={(e) => set("maritalStatus", e.target.value)}>
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widow">Widow</option>
              <option value="divorced">Divorced</option>
            </select>
          </div>
          <div className="field">
            <label>Education</label>
            <select value={form.educationLevel || ""} onChange={(e) => set("educationLevel", e.target.value)}>
              <option value="">Select</option>
              {["8th", "10th", "12th", "diploma", "undergraduate", "postgraduate"].map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="field">
            <label>Ration card</label>
            <select value={form.rationCardType || ""} onChange={(e) => set("rationCardType", e.target.value)}>
              <option value="">Select</option>
              {["AAY", "BPL", "PHH", "APL", "none"].map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="field"><label>Land holding (acres)</label><input type="number" step="0.1" value={form.landHoldingAcres ?? ""} onChange={(e) => set("landHoldingAcres", e.target.value)} /></div>
        </div>
        <div className="row">
          <div className="field"><label>Disability %</label><input type="number" value={form.disabilityPercent ?? ""} onChange={(e) => set("disabilityPercent", e.target.value)} /></div>
          <div className="field" style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
            <label><input type="checkbox" checked={!!form.hasDisability} onChange={(e) => set("hasDisability", e.target.checked)} /> Person with disability</label>
            <label><input type="checkbox" checked={!!form.isFarmer} onChange={(e) => set("isFarmer", e.target.checked)} /> Farmer</label>
            <label><input type="checkbox" checked={!!form.isStudent} onChange={(e) => set("isStudent", e.target.checked)} /> Student</label>
            <label><input type="checkbox" checked={!!form.hasOwnHouse} onChange={(e) => set("hasOwnHouse", e.target.checked)} /> Already own a pucca house</label>
            <label><input type="checkbox" checked={!!form.hasLPG} onChange={(e) => set("hasLPG", e.target.checked)} /> Already have LPG</label>
            <label><input type="checkbox" checked={form.hasBankAccount !== false} onChange={(e) => set("hasBankAccount", e.target.checked)} /> Bank account</label>
          </div>
        </div>
        <button className="btn" type="submit">Save profile</button>
      </form>
    </div>
  );
}
