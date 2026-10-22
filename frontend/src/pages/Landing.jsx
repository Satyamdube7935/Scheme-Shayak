import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Landing() {
  const { user } = useAuth();
  return (
    <>
      <section className="hero">
        <div>
          <p className="muted">AI-assisted eligibility matching · no paid APIs</p>
          <h1>Find government schemes you actually qualify for.</h1>
          <p className="lede">
            Scheme information is scattered and eligibility rules differ for every programme.
            Scheme Sahayak checks your profile and documents against scheme criteria, then ranks
            the most relevant options.
          </p>
          <p>
            <Link className="btn" to={user ? "/app" : "/register"}>Get started</Link>
            {" "}
            <Link className="btn ghost" to="/schemes">Browse the catalogue</Link>
          </p>
        </div>
        <div className="card">
          <h3>How a check works</h3>
          <ol>
            <li>Create a citizen profile (age, income, occupation, state…).</li>
            <li>Upload Aadhaar, PAN, income/caste/disability proofs — we extract fields with on-device OCR.</li>
            <li>The engine scores each scheme and ranks eligible matches first.</li>
          </ol>
        </div>
      </section>
      <div className="grid grid-3">
        <div className="card"><h3>Profile vs criteria</h3><p>Each scheme stores structured rules. Your answers are compared field by field.</p></div>
        <div className="card"><h3>Document-aware</h3><p>Uploads can fill age, gender, income, category and land details so you type less.</p></div>
        <div className="card"><h3>Ranked results</h3><p>Eligible schemes rise to the top. Gaps show as “needs more info”, not a silent miss.</p></div>
      </div>
    </>
  );
}
