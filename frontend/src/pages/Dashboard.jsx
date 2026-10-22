import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

function completeness(profile = {}) {
  const keys = ["age", "gender", "state", "ruralUrban", "annualIncome", "occupation", "category"];
  const filled = keys.filter((k) => profile[k] !== "" && profile[k] !== null && profile[k] !== undefined);
  return Math.round((filled.length / keys.length) * 100);
}

export default function Dashboard() {
  const { user } = useAuth();
  const pct = completeness(user?.profile);
  return (
    <>
      <h1>Hello{user?.profile?.fullName ? `, ${user.profile.fullName}` : ""}</h1>
      <p className="lede">Complete your profile and documents, then run an eligibility check.</p>
      <div className="grid grid-3">
        <div className="card">
          <h3>Profile {pct}%</h3>
          <p className="muted">Age, income, occupation and category drive most matches.</p>
          <Link className="btn secondary" to="/app/profile">Edit profile</Link>
        </div>
        <div className="card">
          <h3>Documents</h3>
          <p className="muted">{user?.documents?.length || 0} file(s) uploaded. Aadhaar, PAN, income and caste certificates help auto-fill fields.</p>
          <Link className="btn secondary" to="/app/documents">Upload</Link>
        </div>
        <div className="card">
          <h3>Recommendations</h3>
          <p className="muted">Compare your profile against every scheme and get a ranked list.</p>
          <Link className="btn" to="/app/results">Check eligibility</Link>
        </div>
      </div>
    </>
  );
}
