import { useMemo, useState } from "react";

const opportunities = [
  {
    id: 1,
    title: "Campus Innovation Hackathon",
    category: "Hackathon",
    date: "24 Oct 2026",
    deadline: "20 Oct 2026",
    teamSize: "2–4 members",
    description:
      "Build a practical solution to a real-world problem using technology, creativity, and teamwork.",
    skills: ["React", "Problem solving", "Presentation"],
    eligibility: "Open to college students. Beginners are welcome.",
  },
  {
    id: 2,
    title: "Student Startup Challenge",
    category: "Competition",
    date: "28 Oct 2026",
    deadline: "25 Oct 2026",
    teamSize: "2–5 members",
    description:
      "Develop a startup idea, validate a problem, and present a business solution.",
    skills: ["Business", "Research", "Pitching"],
    eligibility: "Open to students interested in entrepreneurship.",
  },
  {
    id: 3,
    title: "Creative Tech Showcase",
    category: "Workshop",
    date: "2 Nov 2026",
    deadline: "30 Oct 2026",
    teamSize: "1–3 members",
    description:
      "Showcase creative projects combining design, technology, and digital experiences.",
    skills: ["Design", "Web development", "Creativity"],
    eligibility: "Open to students from all departments.",
  },
];

const teams = [
  {
    id: 1,
    name: "Pixel Pioneers",
    members: "2 / 4 members",
    project: "Building a student productivity platform",
    skills: ["React", "UI design", "Presentation"],
  },
  {
    id: 2,
    name: "NextGen Founders",
    members: "3 / 5 members",
    project: "Exploring a campus startup idea",
    skills: ["Research", "Business", "Pitching"],
  },
  {
    id: 3,
    name: "Creative Coders",
    members: "2 / 4 members",
    project: "Creating a creative portfolio website",
    skills: ["Design", "React", "Creativity"],
  },
];

function Home() {
  const [activeTab, setActiveTab] = useState("opportunities");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [joinedTeams, setJoinedTeams] = useState([]);
  const [notice, setNotice] = useState("");
  const [userSkillsInput, setUserSkillsInput] = useState("React, Presentation");

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((event) => {
      const searchableText = [
        event.title,
        event.description,
        event.category,
        ...event.skills,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || event.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const userSkills = useMemo(
  () =>
    userSkillsInput
      .split(",")
      .map((skill) => skill.trim().toLowerCase())
      .filter(Boolean),
  [userSkillsInput]
  );

  function askQuestion(event) {
    event.preventDefault();

    if (!question.trim()) return;

    const q = question.toLowerCase();

    if (
      q.includes("skill") ||
      q.includes("know") ||
      q.includes("learn")
    ) {
      setAnswer(
        `The listed skills are: ${selectedEvent.skills.join(", ")}.`
      );
    } else if (
      q.includes("deadline") ||
      q.includes("last date") ||
      q.includes("register")
    ) {
      setAnswer(
        `The sample registration deadline is ${selectedEvent.deadline}. This is demo data, not a verified live event.`
      );
    } else if (
      q.includes("eligible") ||
      q.includes("who can") ||
      q.includes("beginner")
    ) {
      setAnswer(selectedEvent.eligibility);
    } else if (q.includes("team") || q.includes("member")) {
      setAnswer(`The listed team size is ${selectedEvent.teamSize}.`);
    } else {
      setAnswer(
        `${selectedEvent.description} Listed skills: ${selectedEvent.skills.join(", ")}. Try asking about skills, eligibility, team size, or the deadline.`
      );
    }
  }

  function requestToJoin(team) {
    setJoinedTeams((previous) =>
      previous.includes(team.id) ? previous : [...previous, team.id]
    );

    setNotice(
      `Demo request recorded for ${team.name}. No real message was sent.`
    );
  }

  function openSection(tab) {
    setActiveTab(tab);
    setNotice("");

    setTimeout(() => {
      document.getElementById("discover")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 0);
  }

  return (
    <main className="page-shell" id="home">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">YOUR CAMPUS. YOUR NEXT OPPORTUNITY.</span>

          <h1>
            Find your people.
            <br />
            <span>Build something meaningful.</span>
          </h1>

          <p>
            Discover campus opportunities, understand what they require,
            and connect with people who want to build alongside you.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => openSection("opportunities")}
            >
              Explore opportunities <span>↗</span>
            </button>

            <button
              className="secondary-button"
              onClick={() => openSection("teams")}
            >
              Find a team
            </button>
          </div>

          <div className="hero-note">
            <span className="status-dot" />
            One place to discover, connect, and participate.
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-topline">
            <span>THE CAMPUS NETWORK</span>
            <span>01 / CONNECT</span>
          </div>

          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit-center">CL</div>

          <div className="floating-card float-one">
            <span className="mini-icon">✳</span>
            <div>
              <strong>Find opportunities</strong>
              <small>Discover what's next</small>
            </div>
          </div>

          <div className="floating-card float-two">
            <span className="mini-icon violet">↗</span>
            <div>
              <strong>Meet your team</strong>
              <small>Make ideas happen</small>
            </div>
          </div>

          <div className="visual-caption">
            <strong>Talent is everywhere.</strong>
            <span>Visibility shouldn't be a barrier.</span>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <span>DISCOVER</span>
        <span className="strip-line" />
        <span>UNDERSTAND</span>
        <span className="strip-line" />
        <span>CONNECT</span>
        <span className="strip-line" />
        <span>PARTICIPATE</span>
      </section>

      <section className="discover-section" id="discover">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MAKE YOUR NEXT MOVE</span>
            <h2>Opportunity starts here.</h2>
            <p>
              Explore what's possible, then find the people to make it happen.
            </p>
          </div>

          <span className="demo-badge">INTERACTIVE DEMO</span>
        </div>

        <div className="tabs">
          <button
            className={activeTab === "opportunities" ? "tab active" : "tab"}
            onClick={() => {
              setActiveTab("opportunities");
              setNotice("");
            }}
          >
            Opportunities <span>{opportunities.length}</span>
          </button>

          <button
            className={activeTab === "teams" ? "tab active" : "tab"}
            onClick={() => {
              setActiveTab("teams");
              setNotice("");
            }}
          >
            Find a team <span>{teams.length}</span>
          </button>
        </div>

        {activeTab === "opportunities" ? (
          <>
            <div className="filter-bar">
              <label className="search-box">
                <span>⌕</span>
                <input
                  type="search"
                  placeholder="Search events, skills, or interests..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              <select
                aria-label="Filter by category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="All">All categories</option>
                <option value="Hackathon">Hackathons</option>
                <option value="Competition">Competitions</option>
                <option value="Workshop">Workshops</option>
              </select>
            </div>

            <div className="results-line">
              <span>
                <strong>{filteredOpportunities.length}</strong> opportunities
                to explore
              </span>
              <span>Sample data · Not live listings</span>
            </div>

            {filteredOpportunities.length > 0 ? (
              <div className="opportunity-grid">
                {filteredOpportunities.map((event, index) => (
                  <article className="opportunity-card" key={event.id}>
                    <div className="card-top">
                      <span className={`event-symbol symbol-${index + 1}`}>
                        {index === 0 ? "⌘" : index === 1 ? "↗" : "✳"}
                      </span>
                      <span className="category-pill">{event.category}</span>
                    </div>

                    <h3>{event.title}</h3>
                    <p>{event.description}</p>

                    <div className="event-meta">
                      <span>◷ &nbsp;{event.date}</span>
                      <span>♧ &nbsp;{event.teamSize}</span>
                    </div>

                    <div className="skill-list">
                      {event.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>

                    <button
                      className="card-link"
                      onClick={() => {
                        setSelectedEvent(event);
                        setQuestion("");
                        setAnswer("");
                      }}
                    >
                      View opportunity <span>→</span>
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No matching opportunities</h3>
                <p>Try another keyword or change the category filter.</p>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="team-intro">
              <div>
                <h3>Good ideas need good people.</h3>
                <p>
                  Explore demo teams and compare their listed skills with
                  what you want to contribute.
                </p>
                <label className="search-box skill-match-input">
                  <span>✳</span>
                  <input
                    type="text"
                    placeholder="Enter skills separated by commas"
                    value={userSkillsInput}
                    onChange={(event) => setUserSkillsInput(event.target.value)}
                    aria-label="Your skills, separated by commas"
                  />
                </label>
                <small className="skill-input-hint">
                  Example: React, Design, Research
                </small>
              </div>
              <span className="demo-badge">RULE-BASED MATCHING</span>
            </div>

            <div className="team-grid">
              {[...teams]
              .sort((a, b) => {
                const countMatches = (team) =>
                  team.skills.filter((skill) =>
                    userSkills.includes(skill.toLowerCase())
                  ).length;

                return countMatches(b) - countMatches(a);
              })
              .map((team) => {
                const matchedSkills = team.skills.filter((skill) =>
                  userSkills.includes(skill.toLowerCase())
                );

                const matchCount = matchedSkills.length;
                const matchPercent = Math.round(
                  (matchCount / team.skills.length) * 100
                );

                return (
                  <article className="team-card" key={team.id}>
                    <div className="team-card-top">
                      <div className="team-avatar">
                        {team.name.slice(0, 1)}
                      </div>
                      <span className="team-open">Recruiting</span>
                    </div>

                    <h3>{team.name}</h3>
                    <p>{team.project}</p>
                    <div className="team-members">{team.members}</div>

                    <div className="skill-list">
                      {team.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>

                    <div className="match-explanation">
                      <span>✳</span>
                      <div>
                        <strong>{matchCount}/{team.skills.length} skills match · {matchPercent}%</strong>
                        <p>
                          {matchedSkills.length
                            ? `Matched: ${matchedSkills.join(", ")}`
                            : "No exact skill matches yet. Try entering another skill."}
                        </p>
                      </div>
                    </div>

                    <button
                      className={
                        joinedTeams.includes(team.id)
                          ? "primary-button join-button joined"
                          : "primary-button join-button"
                      }
                      onClick={() => requestToJoin(team)}
                      disabled={joinedTeams.includes(team.id)}
                    >
                      {joinedTeams.includes(team.id)
                        ? "Request recorded ✓"
                        : "Request to join →"}
                    </button>
                  </article>
                );
              })}
            </div>

            {notice && <p className="notice-message">{notice}</p>}
          </>
        )}
      </section>

      <section className="how-section">
        <div>
          <span className="eyebrow">FROM DISCOVERY TO PARTICIPATION</span>
          <h2>
            Less searching.
            <br />
            More doing.
          </h2>
          <p>
            CampusLink brings the journey together, from discovering an
            opportunity to finding the people to pursue it with.
          </p>
        </div>

        <div className="steps-list">
          <div className="step-item">
            <span>01</span>
            <div>
              <h3>Discover</h3>
              <p>Find opportunities by category, interest, and skills.</p>
            </div>
          </div>

          <div className="step-item">
            <span>02</span>
            <div>
              <h3>Understand</h3>
              <p>
                Ask questions about requirements using the demo event
                information.
              </p>
            </div>
          </div>

          <div className="step-item">
            <span>03</span>
            <div>
              <h3>Connect</h3>
              <p>Explore teams and see an illustrative skills overlap.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer" id="footer">
        <a className="footer-brand" href="#home">
          CampusLink<span>.</span>
        </a>
        <p>Where Opportunities Meet People.</p>
        <span>
          Student prototype · Sample data · Not affiliated with listed events
        </span>
      </footer>

      {selectedEvent && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedEvent(null);
            }
          }}
        >
          <section
            className="event-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-title"
          >
            <button
              className="modal-close"
              aria-label="Close event details"
              onClick={() => setSelectedEvent(null)}
            >
              ×
            </button>

            <span className="eyebrow">OPPORTUNITY DETAILS · SAMPLE</span>
            <span className="category-pill">{selectedEvent.category}</span>

            <h2 id="event-title">{selectedEvent.title}</h2>
            <p>{selectedEvent.description}</p>

            <div className="detail-grid">
              <div>
                <small>Event date</small>
                <strong>{selectedEvent.date}</strong>
              </div>
              <div>
                <small>Registration deadline</small>
                <strong>{selectedEvent.deadline}</strong>
              </div>
              <div>
                <small>Team size</small>
                <strong>{selectedEvent.teamSize}</strong>
              </div>
            </div>

            <h3>Skills listed</h3>
            <div className="skill-list">
              {selectedEvent.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <h3>Ask about this opportunity</h3>
            <p className="assistant-disclaimer">
              Rule-based demo assistant · Answers use sample information;
              this is not a live AI service.
            </p>

            <form className="question-form" onSubmit={askQuestion}>
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="e.g. What skills are needed?"
                aria-label="Ask a question about this opportunity"
              />
              <button className="primary-button" type="submit">
                Ask →
              </button>
            </form>

            {answer && (
              <div className="answer-box">
                <strong>CampusLink assistant</strong>
                <p>{answer}</p>
              </div>
            )}

            <button
              className="secondary-button modal-done"
              onClick={() => setSelectedEvent(null)}
            >
              Done
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default Home;