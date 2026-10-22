import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Recommendations() {
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  async function run() {
    setBusy(true);
    setError("");
    try {
      const data = await api("/recommendations/run", { method: "POST" });
      setResults(data.results);
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const shown = results.filter((r) => filter === "all" || r.status === filter);

  return (
    <>
      <h1>Eligibility & ranking</h1>
      <p className="lede">The engine compares your saved profile with every scheme rule, then sorts eligible matches by relevance score.</p>
      {error && <div className="alert">{error}</div>}
      <p>
        <button className="btn" onClick={run} disabled={busy}>{busy ? "Evaluating…" : "Run eligibility check"}</button>
      </p>
      {summary && (
        <p>
          <strong>{summary.eligible}</strong> eligible · <strong>{summary.needsMoreInfo}</strong> need more info · <strong>{summary.notEligible}</strong> not eligible
        </p>
      )}
      {results.length > 0 && (
        <p>
          <button className="btn ghost" onClick={() => setFilter("all")}>All</button>{" "}
          <button className="btn ghost" onClick={() => setFilter("eligible")}>Eligible</button>{" "}
          <button className="btn ghost" onClick={() => setFilter("needs_more_info")}>Need info</button>{" "}
          <button className="btn ghost" onClick={() => setFilter("not_eligible")}>Not eligible</button>
        </p>
      )}
      <div className="grid">
        {shown.map((r) => (
          <article className="card scheme-card" key={r.code}>
            <span className={`badge ${r.status}`}>{r.status.replaceAll("_", " ")}</span>
            {" "}
            <span className="score">Score {r.score}</span>
            <h3><Link to={`/schemes/${r.schemeId}`}>{r.name}</Link></h3>
            <p className="muted">{r.ministry} · {r.category}</p>
            <p>{r.explanation}</p>
            {r.matchedRules?.length > 0 && (
              <>
                <strong>Matched</strong>
                <ul className="list">{r.matchedRules.map((x) => <li key={x}>{x}</li>)}</ul>
              </>
            )}
            {r.failedRules?.length > 0 && (
              <>
                <strong>Unmet</strong>
                <ul className="list">{r.failedRules.map((x) => <li key={x}>{x}</li>)}</ul>
              </>
            )}
            {r.missingFields?.length > 0 && (
              <p className="muted">Missing: {r.missingFields.join(", ")}. <Link to="/app/profile">Update profile</Link> or <Link to="/app/documents">upload documents</Link>.</p>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
