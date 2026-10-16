import { useMemo, useState } from "react";

function Home({ userId, role, activeTab, setActiveTab, opportunities, setOpportunities, teams, setTeams, joinedTeams, setJoinedTeams }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [teamEventFilter, setTeamEventFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [notice, setNotice] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userSkillsInput, setUserSkillsInput] = useState("React, Presentation");

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((event) => {
      const searchableText = [event.title, event.description, event.category, ...event.skills].join(" ").toLowerCase();
      const matchesSearch = searchableText.includes(search.toLowerCase());
      const matchesCategory = category === "All" || event.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [opportunities, search, category]);

  const userSkills = useMemo(() => 
    userSkillsInput.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean),
  [userSkillsInput]);

  async function askQuestion(event) {
    event.preventDefault();
    if (!question.trim()) return;

    setAnswer("");
    setIsTyping(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      setIsTyping(false);
      setAnswer("Error: Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file and restart the server.");
      return;
    }

    try {
      const prompt = `You are a helpful campus event assistant for a platform called CampusLink. Answer the student's question based strictly on the following event information. If the answer isn't in the details, politely say you don't have that specific information but encourage them to check with the organizers.

      Event Details:
      Title: ${selectedEvent.title}
      Description: ${selectedEvent.description}
      Date: ${selectedEvent.date}
      Deadline: ${selectedEvent.deadline}
      Team Size: ${selectedEvent.teamSize}
      Skills Required: ${selectedEvent.skills.join(", ")}
      Eligibility: ${selectedEvent.eligibility}

      Student's Question: ${question}

      Keep your answer conversational, helpful, and concise (1 to 2 sentences).`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setAnswer(`API Error: ${data.error.message}`);
      } else if (data.candidates && data.candidates[0].content?.parts[0]?.text) {
        setAnswer(data.candidates[0].content.parts[0].text);
      } else {
        setAnswer(`Unexpected API format. Response: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      setAnswer(`Network error: ${error.message}`);
    } finally {
      setIsTyping(false);
    }
  }

  function handleTeamAction(team) {
    if (joinedTeams.includes(team.id)) {
      setJoinedTeams(joinedTeams.filter((id) => id !== team.id));
      setNotice(`You left ${team.name}.`);
    } else {
      setJoinedTeams([...joinedTeams, team.id]);
      setNotice(`Demo request recorded for ${team.name}. No real message was sent.`);
    }
  }

  function handleDeleteOpportunity(id) {
    if (window.confirm("Delete this opportunity?")) {
      setOpportunities(opportunities.filter(o => o.id !== id));
      setTeams(teams.filter(t => t.eventId !== id));
    }
  }

  function handleDeleteTeam(id) {
    if (window.confirm("Delete this team?")) {
      setTeams(teams.filter(t => t.id !== id));
      setJoinedTeams(joinedTeams.filter(j => j !== id));
    }
  }

  function openSection(tab) {
    setActiveTab(tab);
    setNotice("");
    setTimeout(() => { document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" }); }, 0);
  }

  function handleViewTeamsForEvent(eventId) {
    setTeamEventFilter(eventId);
    setActiveTab("teams");
    setSelectedEvent(null);
    setTimeout(() => { document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" }); }, 0);
  }

  return (
    <main className="page-shell" id="home">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            {role === 'host' ? "EMPOWER YOUR CAMPUS. DISCOVER TALENT." : "YOUR CAMPUS. YOUR NEXT OPPORTUNITY."}
          </span>
          <h1>
            {role === 'host' ? (
              <>Publish opportunities.<br /><span>Support top talent.</span></>
            ) : (
              <>Find your people.<br /><span>Build something meaningful.</span></>
            )}
          </h1>
          <p>
            {role === 'host' 
              ? "Host hackathons, manage competitions, and track forming teams. Doubts? Ask the AI assistant to solve your doubts."
              : "Discover campus opportunities and find your team. Doubts? Ask the AI assistant to solve your doubts."}
          </p>
          <div className="hero-actions">
            {role === 'host' ? (
              <>
                <button className="primary-button" onClick={() => { document.getElementById("manage")?.scrollIntoView({ behavior: "smooth" }); }}>
                  Publish an event <span>↗</span>
                </button>
                <button className="secondary-button" onClick={() => openSection("teams")}>
                  Browse forming teams
                </button>
              </>
            ) : (
              <>
                <button className="primary-button" onClick={() => openSection("opportunities")}>
                  Explore opportunities <span>↗</span>
                </button>
                <button className="secondary-button" onClick={() => openSection("teams")}>
                  Find a team
                </button>
              </>
            )}
          </div>
          <div className="hero-note">
            <span className="status-dot" />
            {role === 'host' ? "One place to publish, track, and discover." : "One place to discover, connect, and participate."}
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-topline">
            <span>THE CAMPUS NETWORK</span>
            <span>{role === 'host' ? "01 / EMPOWER" : "01 / CONNECT"}</span>
          </div>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit-center">CL</div>
          <div className="floating-card float-one">
            <span className="mini-icon">✳</span>
            <div>
              <strong>{role === 'host' ? "Publish events" : "Find opportunities"}</strong>
              <small>{role === 'host' ? "Launch initiatives" : "Discover what's next"}</small>
            </div>
          </div>
          <div className="floating-card float-two">
            <span className="mini-icon violet">↗</span>
            <div>
              <strong>{role === 'host' ? "Monitor teams" : "Meet your team"}</strong>
              <small>{role === 'host' ? "Discover talent" : "Make ideas happen"}</small>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <span>DISCOVER</span><span className="strip-line" /><span>UNDERSTAND</span><span className="strip-line" /><span>CONNECT</span><span className="strip-line" /><span>PARTICIPATE</span>
      </section>

      <section className="discover-section" id="discover">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MAKE YOUR NEXT MOVE</span>
            <h2>Opportunity starts here.</h2>
            <p>Explore what's possible, then find the people to make it happen.</p>
          </div>
          <span className="demo-badge">INTERACTIVE DEMO</span>
        </div>

        <div className="tabs">
          <button className={activeTab === "opportunities" ? "tab active" : "tab"} onClick={() => openSection("opportunities")}>
            Opportunities <span>{opportunities.length}</span>
          </button>
          <button className={activeTab === "teams" ? "tab active" : "tab"} onClick={() => openSection("teams")}>
            Teams <span>{teams.length}</span>
          </button>
        </div>

        {activeTab === "opportunities" ? (
          <>
            <div className="filter-bar">
              <label className="search-box">
                <span>⌕</span>
                <input type="search" placeholder="Search events or skills..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="All">All categories</option>
                <option value="Hackathon">Hackathons</option>
                <option value="Competition">Competitions</option>
                <option value="Workshop">Workshops</option>
              </select>
            </div>
            
            <div className="results-line">
              <span><strong>{filteredOpportunities.length}</strong> opportunities to explore</span>
              <span>Unified shared listings</span>
            </div>

            {filteredOpportunities.length > 0 ? (
              <div className="opportunity-grid">
                {filteredOpportunities.map((event, index) => (
                  <article className="opportunity-card" key={event.id}>
                    <div className="card-top">
                      <span className={`event-symbol symbol-${(index % 3) + 1}`}>⌘</span>
                      <span className="category-pill">{event.category}</span>
                    </div>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <div className="event-meta">
                      <span>◷ &nbsp;{event.date}</span>
                      <span>♧ &nbsp;{event.teamSize}</span>
                    </div>
                    <div className="skill-list">
                      {event.skills.map((skill) => (<span key={skill}>{skill}</span>))}
                    </div>
                    <div className="card-actions">
                      <button className="card-link" onClick={() => { setSelectedEvent(event); setQuestion(""); setAnswer(""); }}>
                        View <span>→</span>
                      </button>
                      {role === "host" && event.hostId === userId && (
                        <button className="delete-action" onClick={() => handleDeleteOpportunity(event.id)}>Delete</button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No matching opportunities</h3>
                <p>Try another keyword or change the category filter.</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="team-intro">
              <div>
                <h3>{role === 'host' ? "Monitor event participation." : "Good ideas need good people."}</h3>
                <p>{role === 'host' ? "See which teams are forming under your published opportunities and filter by skills." : "Compare their listed skills with what you want to contribute."}</p>
                <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px'}}>
                  <label className="search-box skill-match-input" style={{flex: 2, minWidth: '250px'}}>
                    <span>✳</span>
                    <input type="text" placeholder="Enter skills (e.g. React, UI)" value={userSkillsInput} onChange={(e) => setUserSkillsInput(e.target.value)} />
                  </label>
                  <select 
                    style={{flex: 1, minWidth: '200px', borderRadius: '8px', padding: '0 12px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--navy)'}} 
                    value={teamEventFilter} 
                    onChange={(e) => setTeamEventFilter(e.target.value)}
                  >
                    <option value="All">All Opportunities</option>
                    
                    {role === 'host' && opportunities.some(opp => opp.hostId === userId) && (
                      <optgroup label="My Published Events">
                        {opportunities.filter(opp => opp.hostId === userId).map(opp => (
                          <option key={opp.id} value={opp.id}>{opp.title}</option>
                        ))}
                      </optgroup>
                    )}
                    
                    <optgroup label={role === 'host' ? "Other Events" : "Available Events"}>
                      {opportunities.filter(opp => role === 'host' ? opp.hostId !== userId : true).map(opp => (
                        <option key={opp.id} value={opp.id}>{opp.title}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>
              <span className="demo-badge">RULE-BASED MATCHING</span>
            </div>

            <div className="team-grid">
              {[...teams].filter(t => teamEventFilter === "All" || t.eventId === teamEventFilter).sort((a, b) => {
                const count = (t) => t.skills.filter(s => userSkills.includes(s.toLowerCase())).length;
                return count(b) - count(a);
              }).map((team) => {
                const matched = team.skills.filter(s => userSkills.includes(s.toLowerCase()));
                const pct = Math.round((matched.length / team.skills.length) * 100);

                return (
                  <article className="team-card" key={team.id}>
                    <div className="team-card-top">
                      <div className="team-avatar">{team.name.slice(0, 1)}</div>
                      <span className="team-open">Recruiting</span>
                    </div>
                    <h3>{team.name}</h3>
                    <p style={{marginBottom: '6px'}}>{team.project}</p>
                    <span className="category-pill" style={{marginBottom: '12px', background: 'var(--soft)', color: 'var(--muted)'}}>📍 {team.eventName}</span>
                    <div className="team-members">{team.members}</div>
                    <div className="skill-list">
                      {team.skills.map((skill) => (<span key={skill}>{skill}</span>))}
                    </div>
                    <div className="match-explanation">
                      <span>✳</span>
                      <div>
                        <strong>{matched.length}/{team.skills.length} skills match · {pct}%</strong>
                        <p>{matched.length ? `Matched: ${matched.join(", ")}` : "No exact matches yet."}</p>
                      </div>
                    </div>
                    
                    <div className="team-actions">
                      {role === "student" && (
                        <button className={joinedTeams.includes(team.id) ? "primary-button join-button joined" : "primary-button join-button"} onClick={() => handleTeamAction(team)}>
                          {joinedTeams.includes(team.id) ? "Leave team" : "Request to join →"}
                        </button>
                      )}
                      {role === "student" && team.creatorId === userId && (
                        <button className="danger-button join-button" onClick={() => handleDeleteTeam(team.id)}>Delete team</button>
                      )}
                      {role === "host" && (
                        <div style={{marginTop: 'auto', paddingTop: '10px', textAlign: 'center'}}>
                          <span className="category-pill" style={{background: 'var(--border)', color: 'var(--navy)'}}>Viewing as Host</span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
            {teams.filter(t => teamEventFilter === "All" || t.eventId === teamEventFilter).length === 0 && (
              <div className="empty-state">
                <h3>No teams found</h3>
                <p>There are no teams for this specific event yet.</p>
              </div>
            )}
            {notice && <p className="notice-message" style={{marginTop: '20px'}}>{notice}</p>}
          </>
        )}
      </section>

      {selectedEvent && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedEvent(null); }}>
          <section className="event-modal">
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>×</button>
            <span className="category-pill">{selectedEvent.category}</span>
            <h2>{selectedEvent.title}</h2>
            <p>{selectedEvent.description}</p>
            <div className="detail-grid">
              <div><small>Event date: </small><strong>{selectedEvent.date}</strong></div>
              <div><small>Deadline: </small><strong>{selectedEvent.deadline}</strong></div>
              <div><small>Team size: </small><strong>{selectedEvent.teamSize}</strong></div>
            </div>
            
            <div className="notice-message" style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span><strong>Looking for teams?</strong> Explore active teams forming for this event.</span>
              <button className="secondary-button" style={{minHeight: '34px', padding: '0 12px', fontSize: '11px'}} onClick={() => handleViewTeamsForEvent(selectedEvent.id)}>View Teams</button>
            </div>

            <h3>Skills listed</h3>
            <div className="skill-list">
              {selectedEvent.skills.map(s => <span key={s}>{s}</span>)}
            </div>
            <h3>Ask the CampusLink AI Assistant</h3>
            <p className="assistant-disclaimer">Powered by Gemini. Ask me anything about this opportunity.</p>
            <form className="question-form" onSubmit={askQuestion}>
              <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What skills are needed?" required />
              <button className="primary-button" type="submit" disabled={isTyping}>
                {isTyping ? "Asking..." : "Ask →"}
              </button>
            </form>
            {answer && <div className="answer-box"><strong>AI Assistant</strong><p>{answer}</p></div>}
            <button className="secondary-button modal-done" onClick={() => setSelectedEvent(null)}>Close</button>
          </section>
        </div>
      )}
    </main>
  );
}

export default Home;