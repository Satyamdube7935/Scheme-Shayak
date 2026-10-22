import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../AuthContext.jsx";

const TYPES = [
  { id: "aadhaar", label: "Aadhaar card" },
  { id: "pan", label: "PAN card" },
  { id: "income_certificate", label: "Income certificate" },
  { id: "caste_certificate", label: "Caste / category certificate" },
  { id: "disability_certificate", label: "Disability certificate" },
  { id: "ration_card", label: "Ration card" },
  { id: "land_record", label: "Land record / 7/12" },
  { id: "other", label: "Other" }
];

export default function Documents() {
  const { user, setUser } = useAuth();
  const [type, setType] = useState("aadhaar");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [last, setLast] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", type);
      form.append("applyToProfile", "true");
      const data = await api("/documents", { method: "POST", form });
      setUser((u) => ({
        ...u,
        profile: data.profile,
        documents: [...(u.documents || []), data.document]
      }));
      setLast(data.document);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    await api(`/documents/${id}`, { method: "DELETE" });
    setUser((u) => ({ ...u, documents: u.documents.filter((d) => d.id !== id) }));
  }

  return (
    <>
      <h1>Documents</h1>
      <p className="lede">Upload a photo or PDF. Text is read locally with OCR and used to fill eligibility fields. Full Aadhaar numbers are not stored — only a last-4 hint if found.</p>
      {error && <div className="alert">{error}</div>}
      <form className="card drop" onSubmit={onSubmit}>
        <div className="field">
          <label>Document type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label>File (JPG, PNG or PDF)</label>
          <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <button className="btn" disabled={busy || !file}>{busy ? "Reading document…" : "Upload and extract"}</button>
        <p className="muted">First OCR run may take a minute while the language model downloads.</p>
      </form>
      {last && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>Extracted from {last.originalName}</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(last.extractedFields, null, 2)}</pre>
          {last.extractedPreview && <p className="muted">{last.extractedPreview}</p>}
        </div>
      )}
      <h2>Uploaded</h2>
      <div className="grid grid-2">
        {(user?.documents || []).map((d) => (
          <div className="card" key={d.id}>
            <strong>{TYPES.find((t) => t.id === d.type)?.label || d.type}</strong>
            <p className="muted">{d.originalName}</p>
            <button className="btn ghost" type="button" onClick={() => remove(d.id)}>Remove</button>
          </div>
        ))}
      </div>
    </>
  );
}
