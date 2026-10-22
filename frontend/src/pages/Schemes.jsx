import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    api(`/schemes?${params}`).then((d) => setSchemes(d.schemes)).catch(() => setSchemes([]));
  }, [q, category]);

  const cats = [...new Set(schemes.map((s) => s.category).filter(Boolean))];

  return (
    <>
      <h1>Scheme catalogue</h1>
      <div className="row">
        <div className="field"><label>Search</label><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="housing, farmer, pension…" /></div>
        <div className="field">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-2">
        {schemes.map((s) => (
          <article className="card scheme-card" key={s._id}>
            <span className="badge cat">{s.category}</span>
            <h3><Link to={`/schemes/${s._id}`}>{s.name}</Link></h3>
            <p className="muted">{s.ministry}</p>
            <p>{s.description}</p>
          </article>
        ))}
      </div>
    </>
  );
}
