function Navbar({ theme, onToggleTheme, role, onSwitchRole, onNavigate }) {
  const handleNav = (tab) => {
    onNavigate(tab);
    document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav>
      <div>
        <h2>
          <a href="#home" className="nav-brand">
            CampusLink<span>.</span>
          </a>
        </h2>
        <span className="role-badge">{role === 'host' ? 'Host View' : 'Student View'}</span>
      </div>
      <div>
        <button onClick={() => handleNav("opportunities")} className="nav-action">Opportunities</button>
        <button onClick={() => handleNav("teams")} className="nav-action">Teams</button>
        <a href="#manage" className="nav-action">Ignite</a>
        <button onClick={onSwitchRole} className="nav-action">Switch Role</button>
        <button onClick={onToggleTheme} className="theme-toggle">
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;