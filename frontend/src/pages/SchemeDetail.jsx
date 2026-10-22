import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";

export default function SchemeDetail() {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/schemes/${id}`).then((d) => setScheme(d.scheme)).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="alert">{error}</div>;
  if (!scheme) return <p>Loading…</p>;

  return (
    <article className="card">
      <p><Link to="/schemes">← Catalogue</Link></p>
      <span className="badge cat">{scheme.category}</span>
      <h1>{scheme.name}</h1>
      <p className="muted">{scheme.ministry}</p>
      <p>{scheme.description}</p>
      <h3>Benefits</h3>
      <p>{scheme.benefits}</p>
      <h3>Eligibility rules used by the engine</h3>
      <ul>
        {(scheme.eligibility || []).map((r, i) => <li key={i}>{r.label}</li>)}
      </ul>
      <h3>Typical documents</h3>
      <ul>{(scheme.documentsRequired || []).map((d) => <li key={d}>{d}</li>)}</ul>
      {scheme.officialUrl && <p><a href={scheme.officialUrl} target="_blank" rel="noreferrer">Official page</a></p>}
    </article>
  );
}
