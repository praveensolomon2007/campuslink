import { useState } from "react";

function Rooms({ userId, role, opportunities, setOpportunities, teams, setTeams }) {
  const [notice, setNotice] = useState("");

  // Opp State (Host only)
  const [oppTitle, setOppTitle] = useState("");
  const [oppCategory, setOppCategory] = useState("Hackathon");
  const [oppDate, setOppDate] = useState("");
  const [oppDeadline, setOppDeadline] = useState("");
  const [oppTeamSize, setOppTeamSize] = useState("2–4 members");
  const [oppDesc, setOppDesc] = useState("");
  const [oppSkills, setOppSkills] = useState("");

  // Team State (Student only)
  const [teamName, setTeamName] = useState("");
  const [teamEventId, setTeamEventId] = useState("");
  const [teamProj, setTeamProj] = useState("");
  const [teamMembers, setTeamMembers] = useState("1 / 4 members");
  const [teamSkills, setTeamSkills] = useState("");

  function handleCreateOpportunity(e) {
    e.preventDefault();
    if (!oppTitle || !oppDesc) return setNotice("Fill required fields.");
    const newOpp = {
      id: crypto.randomUUID(), 
      title: oppTitle, 
      category: oppCategory, 
      date: oppDate || "TBD", 
      deadline: oppDeadline || "TBD", 
      teamSize: oppTeamSize,
      description: oppDesc, 
      skills: oppSkills.split(",").map(s => s.trim()).filter(Boolean), 
      eligibility: "Open to all relevant students.", 
      hostId: userId
    };
    setOpportunities([newOpp, ...opportunities]);
    setOppTitle(""); setOppDesc(""); setOppSkills(""); setOppDate(""); setOppDeadline(""); 
    setNotice("Opportunity published! Check the Opportunities tab.");
  }

  function handleCreateTeam(e) {
    e.preventDefault();
    if (!teamName || !teamEventId || !teamProj) return setNotice("Please fill all required fields and select an event.");
    
    const targetEvent = opportunities.find(opp => opp.id === teamEventId);
    
    const newTeam = {
      id: crypto.randomUUID(), 
      name: teamName, 
      members: teamMembers, 
      project: teamProj,
      eventId: targetEvent.id,
      eventName: targetEvent.title,
      skills: teamSkills.split(",").map(s => s.trim()).filter(Boolean), 
      creatorId: userId, 
      joinedUsers: []
    };
    setTeams([newTeam, ...teams]);
    setTeamName(""); setTeamProj(""); setTeamSkills(""); setTeamEventId("");
    setNotice(`Team created for ${targetEvent.title}! Check the Teams tab.`);
  }

  return (
    <section className="rooms-section" id="manage">
      <div className="section-heading" style={{maxWidth: '1160px', margin: '0 auto', padding: '0 24px'}}>
        <div>
          <span className="eyebrow">IGNITE - COLLABORATE</span>
          <h2>Manage your listings.</h2>
          <p>Create {role === 'host' ? 'opportunities' : 'teams'} that connect instantly across CampusLink.</p>
        </div>
        <span className="demo-badge">{role === 'host' ? 'Host Actions' : 'Student Actions'}</span>
      </div>

      <div className="page-shell">
        <div className="rooms-grid" style={{gridTemplateColumns: 'minmax(300px, 600px)', justifyContent: 'center'}}>
          
          {role === 'host' && (
            <form className="room-panel" onSubmit={handleCreateOpportunity}>
              <span className="room-icon">🚀</span>
              <h3>Publish Opportunity</h3>
              
              <label>Event Title</label>
              <input value={oppTitle} onChange={e => setOppTitle(e.target.value)} placeholder="e.g. Winter Code Sprint" required />
              
              <div style={{display: 'flex', gap: '12px', marginTop: '18px'}}>
                <div style={{flex: 1}}>
                  <label style={{marginTop: 0}}>Category</label>
                  <select value={oppCategory} onChange={e => setOppCategory(e.target.value)}>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Competition">Competition</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
                <div style={{flex: 1}}>
                  <label style={{marginTop: 0}}>Team Size</label>
                  <input value={oppTeamSize} onChange={e => setOppTeamSize(e.target.value)} placeholder="e.g. 2-4 members" />
                </div>
              </div>

              <div style={{display: 'flex', gap: '12px', marginTop: '18px'}}>
                <div style={{flex: 1}}>
                  <label style={{marginTop: 0}}>Event Date</label>
                  <input value={oppDate} onChange={e => setOppDate(e.target.value)} placeholder="e.g. 15 Nov 2026" />
                </div>
                <div style={{flex: 1}}>
                  <label style={{marginTop: 0}}>Deadline</label>
                  <input value={oppDeadline} onChange={e => setOppDeadline(e.target.value)} placeholder="e.g. 10 Nov 2026" />
                </div>
              </div>

              <label>Description</label>
              <textarea value={oppDesc} onChange={e => setOppDesc(e.target.value)} placeholder="Explain the opportunity..." required />
              
              <label>Skills Needed <span className="input-hint">(comma separated)</span></label>
              <input value={oppSkills} onChange={e => setOppSkills(e.target.value)} placeholder="e.g. React, Node, Design" />
              
              <div className="form-actions"><button className="primary-button room-submit" type="submit">Publish to feed →</button></div>
            </form>
          )}

          {role === 'student' && (
            <form className="room-panel" onSubmit={handleCreateTeam}>
              <span className="room-icon">👥</span>
              <h3>Create a Team</h3>
              
              <label>Team Name</label>
              <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="e.g. Pixel Pioneers" required />

              <label>Target Opportunity</label>
              <select value={teamEventId} onChange={e => setTeamEventId(e.target.value)} required>
                <option value="" disabled>Select an event...</option>
                {opportunities.map(opp => (
                  <option key={opp.id} value={opp.id}>{opp.title}</option>
                ))}
              </select>
              
              <label>Team Size Status</label>
              <input value={teamMembers} onChange={e => setTeamMembers(e.target.value)} placeholder="e.g. 1 / 4 members" required />

              <label>Project Idea</label>
              <textarea value={teamProj} onChange={e => setTeamProj(e.target.value)} placeholder="e.g. Building a productivity app..." required />
              
              <label>Skills We Have / Need <span className="input-hint">(comma separated)</span></label>
              <input value={teamSkills} onChange={e => setTeamSkills(e.target.value)} placeholder="e.g. React, UI Design" />
              
              <div className="form-actions"><button className="primary-button room-submit" type="submit">Create team →</button></div>
            </form>
          )}
        </div>

        {notice && <p className="notice-message" style={{marginTop: '24px', textAlign: 'center'}}>{notice}</p>}
      </div>
    </section>
  );
}

export default Rooms;