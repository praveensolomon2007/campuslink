function Navbar() {
  function showSection(tab) {
    document.getElementById("discover")?.scrollIntoView({
      behavior: "smooth",
    });

    window.setTimeout(() => {
      const buttons = document.querySelectorAll(".tabs .tab");
      const targetIndex = tab === "teams" ? 1 : 0;
      buttons[targetIndex]?.click();
    }, 100);
  }

  return (
    <nav>
      <div>
        <a className="nav-brand" href="#home">
          <h2>CampusLink</h2>
        </a>
      </div>

      <div>
        <a href="#home">Home</a>

        <a
          href="#discover"
          onClick={(event) => {
            event.preventDefault();
            showSection("opportunities");
          }}
        >
          Opportunities
        </a>

        <a
          href="#discover"
          onClick={(event) => {
            event.preventDefault();
            showSection("teams");
          }}
        >
          Teams
        </a>

        <a href="#footer">About</a>
      </div>
    </nav>
  );
}

export default Navbar;