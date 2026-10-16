import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";

const STORAGE_KEYS = {
  USER_ID: "campuslink-user-id",
  ROLE: "campuslink-role",
  OPPS: "campuslink-opportunities",
  TEAMS: "campuslink-teams",
  JOINED_TEAMS: "campuslink-joined-teams",
  THEME: "campuslink-theme"
};

function getOrCreateUserId() {
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
  return userId;
}

const defaultOpportunities = [
  {
    id: "opp-1", title: "Campus Innovation Hackathon", category: "Hackathon",
    date: "24 Oct 2026", deadline: "20 Oct 2026", teamSize: "2–4 members",
    description: "Build a practical solution to a real-world problem using technology, creativity, and teamwork.",
    skills: ["React", "Problem solving", "Presentation"],
    eligibility: "Open to college students. Beginners are welcome.", hostId: "system"
  },
  {
    id: "opp-2", title: "Student Startup Challenge", category: "Competition",
    date: "28 Oct 2026", deadline: "25 Oct 2026", teamSize: "2–5 members",
    description: "Develop a startup idea, validate a problem, and present a business solution.",
    skills: ["Business", "Research", "Pitching"],
    eligibility: "Open to students interested in entrepreneurship.", hostId: "system"
  }
];

const defaultTeams = [
  {
    id: "team-1", name: "Pixel Pioneers", members: "2 / 4 members",
    project: "Building a student productivity platform",
    skills: ["React", "UI design", "Presentation"], 
    eventId: "opp-1", eventName: "Campus Innovation Hackathon",
    creatorId: "system", joinedUsers: []
  }
];

function App() {
  const [userId] = useState(getOrCreateUserId);
  const [role, setRole] = useState(() => localStorage.getItem(STORAGE_KEYS.ROLE));
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEYS.THEME) || "light");
  
  const [activeTab, setActiveTab] = useState("opportunities");

  const [opportunities, setOpportunities] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OPPS);
    return saved ? JSON.parse(saved) : defaultOpportunities;
  });

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEAMS);
    return saved ? JSON.parse(saved) : defaultTeams;
  });

  const [joinedTeams, setJoinedTeams] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOINED_TEAMS)) || [];
  });

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem(STORAGE_KEYS.THEME, theme); }, [theme]);
  useEffect(() => { if (role) localStorage.setItem(STORAGE_KEYS.ROLE, role); else localStorage.removeItem(STORAGE_KEYS.ROLE); }, [role]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.OPPS, JSON.stringify(opportunities)); }, [opportunities]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams)); }, [teams]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.JOINED_TEAMS, JSON.stringify(joinedTeams)); }, [joinedTeams]);

  function toggleTheme() { setTheme((curr) => (curr === "light" ? "dark" : "light")); }

  if (!role) {
    return (
      <div className="role-selection-wrapper">
        <h1>Welcome to CampusLink</h1>
        <p>Choose how you want to use the platform in this demo.</p>
        <div className="role-cards">
          <div className="role-card" onClick={() => setRole("student")}>
            <div className="role-icon">👩‍💻</div>
            <h2>Student / Individual</h2>
            <p>Discover events, find teammates, join teams, and explore opportunities.</p>
            <button className="primary-button">Enter as Student →</button>
          </div>
          <div className="role-card" onClick={() => setRole("host")}>
            <div className="role-icon">🏛️</div>
            <h2>Host / Organization</h2>
            <p>Publish events, recruit participants, create teams, and manage opportunities.</p>
            <button className="secondary-button">Enter as Host →</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar 
        theme={theme} 
        onToggleTheme={toggleTheme} 
        role={role} 
        onSwitchRole={() => setRole(null)} 
        onNavigate={setActiveTab} 
      />
      <Home 
        userId={userId} 
        role={role} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        opportunities={opportunities} setOpportunities={setOpportunities}
        teams={teams} setTeams={setTeams}
        joinedTeams={joinedTeams} setJoinedTeams={setJoinedTeams} 
      />
      <Rooms 
        userId={userId} 
        role={role}
        opportunities={opportunities} setOpportunities={setOpportunities}
        teams={teams} setTeams={setTeams}
      />
    </div>
  );
}

export default App;