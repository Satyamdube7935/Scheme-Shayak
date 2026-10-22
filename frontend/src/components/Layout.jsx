import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <>
      <header className="topbar">
        <NavLink className="brand" to="/">Scheme Sahayak</NavLink>
        <nav className="nav">
          <NavLink to="/schemes">Browse schemes</NavLink>
          {user ? (
            <>
              <NavLink to="/app">Dashboard</NavLink>
              <NavLink to="/app/profile">Profile</NavLink>
              <NavLink to="/app/documents">Documents</NavLink>
              <NavLink to="/app/results">Matches</NavLink>
              <button className="linkish" onClick={logout}>Sign out</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Sign in</NavLink>
              <NavLink to="/register">Create account</NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="wrap">
        <Outlet />
      </main>
      <footer className="site">College project · eligibility is indicative, not an official government decision.</footer>
    </>
  );
}
