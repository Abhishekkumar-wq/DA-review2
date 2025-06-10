// Load and process CSV file
fetch("data/Cricket_data.csv")
  .then(response => response.text())
  .then(csv => {
    const rows = csv.trim().split("\n").slice(1); // Skip header
    const seasonMatches = {};
    const teamWins = {};

    rows.forEach(row => {
      const cols = row.split(",");
      const season = cols[0]?.trim();
      const winner = cols[11]?.trim();

      if (season && winner && winner !== "TBC" && winner !== "TBA") {
        // Count matches per season
        seasonMatches[season] = (seasonMatches[season] || 0) + 1;

        // Count wins per team
        teamWins[winner] = (teamWins[winner] || 0) + 1;
      }
    });

    // Draw Matches Per Season
    const seasonLabels = Object.keys(seasonMatches).sort();
    const seasonData = seasonLabels.map(season => seasonMatches[season]);

    new Chart(document.getElementById("matchesPerSeason"), {
      type: "bar",
      data: {
        labels: seasonLabels,
        datasets: [{
          label: "Matches Per Season",
          data: seasonData,
          backgroundColor: "#4e79a7"
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });

    // Draw Team Wins Overall
    const teamLabels = Object.keys(teamWins);
    const teamData = teamLabels.map(team => teamWins[team]);

    new Chart(document.getElementById("teamWinsOverall"), {
      type: "bar",
      data: {
        labels: teamLabels,
        datasets: [{
          label: "Total Wins",
          data: teamData,
          backgroundColor: "#f28e2b"
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: { legend: { display: false } }
      }
    });

    // Draw Top 5 Teams (Pie)
    const topTeams = Object.entries(teamWins)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topLabels = topTeams.map(t => t[0]);
    const topData = topTeams.map(t => t[1]);

    new Chart(document.getElementById("topWinningTeams"), {
      type: "pie",
      data: {
        labels: topLabels,
        datasets: [{
          label: "Top 5 Teams",
          data: topData,
          backgroundColor: [
            "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1"
          ]
        }]
      },
      options: {
        responsive: true
      }
    });
  })
  .catch(error => {
    console.error("CSV Load Error:", error);
    alert("Failed to load CSV. Please run via a local server.");
  });
