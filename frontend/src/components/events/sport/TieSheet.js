import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function TieSheet() {
  const location = useLocation();
  // Object of { "Team 1": [participants], "Team 2": [participants], ... }
  const participantsObject = location.state?.participants || {};

  // Store each bracket's matches in state
  const [maleMatches, setMaleMatches] = useState([]);
  const [femaleMatches, setFemaleMatches] = useState([]);

  // Track which round we’re on for each bracket
  const [maleRound, setMaleRound] = useState(1);
  const [femaleRound, setFemaleRound] = useState(1);

  // Champion states for each bracket
  const [maleChampion, setMaleChampion] = useState(null);
  const [femaleChampion, setFemaleChampion] = useState(null);

  useEffect(() => {
    // On initial load, create the bracket(s)
    generateInitialTieSheet();
    // eslint-disable-next-line
  }, [participantsObject]);

  // ---------------------------------------------------------
  // STEP 1: Split teams by checking the gender of participants
  // ---------------------------------------------------------
  const generateInitialTieSheet = () => {
    // Transform the object into arrays of { teamName, players: [...] }
    const allTeams = createTeamArray(participantsObject);

    // Now separate each team’s players by gender
    const { maleBracketTeams, femaleBracketTeams } = splitTeamsByGender(allTeams);

    // Create match-ups for Round 1
    setMaleMatches(createRoundMatches(maleBracketTeams));
    setFemaleMatches(createRoundMatches(femaleBracketTeams));
  };

  // Convert:
  // {
  //   "Team 1": [ p1, p2 ],
  //   "Team 2": [ p3, p4 ]
  // }
  // into:
  // [
  //   { teamName: "Team 1", players: [p1, p2] },
  //   { teamName: "Team 2", players: [p3, p4] },
  // ]
  const createTeamArray = (obj) => {
    return Object.keys(obj).map((teamName) => ({
      teamName,
      players: obj[teamName] || [],
    }));
  };

  // For each team, we see which participants are Male vs Female,
  // thus creating separate "sub-teams" if a single team has mixed genders.
  const splitTeamsByGender = (teams) => {
    const maleBracketTeams = [];
    const femaleBracketTeams = [];

    teams.forEach((team) => {
      const malePlayers = team.players.filter((p) => p.gender === "Male");
      const femalePlayers = team.players.filter((p) => p.gender === "Female");

      if (malePlayers.length > 0) {
        maleBracketTeams.push({
          teamName: `${team.teamName} (Male)`,
          players: malePlayers,
        });
      }
      if (femalePlayers.length > 0) {
        femaleBracketTeams.push({
          teamName: `${team.teamName} (Female)`,
          players: femalePlayers,
        });
      }
    });

    return { maleBracketTeams, femaleBracketTeams };
  };

  // ---------------------------------------------------------
  // STEP 2: Create the matches for a given array of teams
  // ---------------------------------------------------------
  const createRoundMatches = (teamsForRound) => {
    if (!teamsForRound || teamsForRound.length === 0) return [];

    // Shuffle for random seeding
    const shuffled = [...teamsForRound].sort(() => Math.random() - 0.5);

    const matches = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      if (shuffled[i + 1]) {
        matches.push({
          team1: shuffled[i],
          team2: shuffled[i + 1],
          winner: null,
        });
      } else {
        // Odd number -> last team gets a bye
        matches.push({
          team1: shuffled[i],
          team2: null,
          winner: shuffled[i], // auto-advance
        });
      }
    }
    return matches;
  };

  // ---------------------------------------------------------
  // STEP 3: Selecting a winner in a match
  // ---------------------------------------------------------
  const handleSelectWinner = (gender, matchIndex, chosenTeam) => {
    if (gender === "male") {
      const updated = [...maleMatches];
      updated[matchIndex].winner = chosenTeam;
      setMaleMatches(updated);
    } else {
      const updated = [...femaleMatches];
      updated[matchIndex].winner = chosenTeam;
      setFemaleMatches(updated);
    }
  };

  // ---------------------------------------------------------
  // STEP 4: Move winners to the next round
  // ---------------------------------------------------------
  const handleNextRound = (gender) => {
    if (gender === "male") {
      const winners = maleMatches.map((m) => m.winner).filter(Boolean);
      // If exactly 1 winner remains, we have a champion
      if (winners.length === 1) {
        setMaleChampion(winners[0]);
        return;
      }
      // If less than 1, bracket is empty
      if (winners.length < 2) {
        setMaleChampion(null); // no champion
        return;
      }
      // Otherwise, create next round
      setMaleRound((prev) => prev + 1);
      setMaleMatches(createRoundMatches(winners));
    } else {
      const winners = femaleMatches.map((m) => m.winner).filter(Boolean);
      if (winners.length === 1) {
        setFemaleChampion(winners[0]);
        return;
      }
      if (winners.length < 2) {
        setFemaleChampion(null);
        return;
      }
      setFemaleRound((prev) => prev + 1);
      setFemaleMatches(createRoundMatches(winners));
    }
  };

  // ---------------------------------------------------------
  // Confetti + Champion Display
  // ---------------------------------------------------------
  // Simple inline confetti effect: random squares floating down
  // We'll create a fixed container that overlays the screen.
  const Confetti = () => {
    const confettiCount = 80; // adjust for more or less confetti
    const colors = ["#FFC700", "#FF7A00", "#FF2371", "#00D7FF", "#6BFF00"];
    const confettiPieces = [];

    for (let i = 0; i < confettiCount; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const leftPos = Math.random() * 100; // 0 to 100%
      const delay = Math.random() * 5; // 0 to 5s
      const duration = 5 + Math.random() * 5; // 5 to 10s
      const size = 8 + Math.random() * 8; // 8 to 16px

      confettiPieces.push(
        <div
          key={`confetti-${i}`}
          style={{
            position: "absolute",
            top: "-10px",
            left: `${leftPos}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: randomColor,
            opacity: 0.8,
            animation: `fall ${duration}s linear ${delay}s forwards`,
          }}
        />
      );
    }

    // Inline keyframes for confetti falling
    const confettiKeyframes = `
      @keyframes fall {
        to {
          transform: translateY(120vh) rotate(360deg);
        }
      }
    `;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none", // allow clicks through confetti
          overflow: "hidden",
        }}
      >
        <style>{confettiKeyframes}</style>
        {confettiPieces}
      </div>
    );
  };

  // Renders the champion box with confetti
  const renderChampion = (champion) => {
    if (!champion) return null;
    return (
      <div style={{ position: "relative" }}>
        <Confetti />
        <div
          style={{
            position: "fixed",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#ffffff",
            border: "3px solid #333",
            borderRadius: "10px",
            padding: "30px",
            zIndex: 9999,
          }}
        >
          <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
            Congratulations <br />
            {champion.teamName}!
          </h1>
          <p style={{ fontSize: "1.2rem" }}>You are the final winner!</p>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------
  // Helper to render matches for a given bracket
  // ---------------------------------------------------------
  const renderBracket = (matches, roundNumber, genderLabel) => {
    // If we already have a champion, no need to render further matches
    if ((genderLabel === "Male" && maleChampion) ||
        (genderLabel === "Female" && femaleChampion)) {
      return null;
    }

    if (!matches || matches.length === 0) {
      return (
        <div style={{ marginBottom: "30px" }}>
          <h2>
            {genderLabel} Bracket - Round {roundNumber}
          </h2>
          <p>No teams in this bracket.</p>
        </div>
      );
    }

    return (
      <div style={{ marginBottom: "30px" }}>
        <h2>
          {genderLabel} Bracket - Round {roundNumber}
        </h2>
        {matches.map((match, idx) => {
          const { team1, team2, winner } = match;
          return (
            <div
              key={`${genderLabel}-round${roundNumber}-match${idx}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "10px 0",
              }}
            >
              {/* Team1 button */}
              <button
                onClick={() =>
                  handleSelectWinner(genderLabel.toLowerCase(), idx, team1)
                }
                style={{
                  padding: "10px",
                  margin: "5px",
                  backgroundColor: winner === team1 ? "green" : "white",
                  color: winner === team1 ? "white" : "black",
                  border: "1px solid black",
                  cursor: "pointer",
                }}
              >
                {team1.teamName}
              </button>

              <span style={{ margin: "0 10px" }}>VS</span>

              {/* Team2 button or BYE */}
              {team2 ? (
                <button
                  onClick={() =>
                    handleSelectWinner(genderLabel.toLowerCase(), idx, team2)
                  }
                  style={{
                    padding: "10px",
                    margin: "5px",
                    backgroundColor: winner === team2 ? "green" : "white",
                    color: winner === team2 ? "white" : "black",
                    border: "1px solid black",
                    cursor: "pointer",
                  }}
                >
                  {team2.teamName}
                </button>
              ) : (
                <span style={{ color: "gray", margin: "5px" }}>BYE</span>
              )}
            </div>
          );
        })}

        {/* Next Round button */}
        {matches.length > 0 && (
          <button
            onClick={() => handleNextRound(genderLabel.toLowerCase())}
            style={{ marginTop: "10px" }}
          >
            Next Round
          </button>
        )}
      </div>
    );
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Tie Sheet</h1>

      {/* Champion pop-ups (if any) */}
      {renderChampion(maleChampion)}
      {renderChampion(femaleChampion)}

      {/* Male Bracket */}
      {renderBracket(maleMatches, maleRound, "Male")}

      {/* Female Bracket */}
      {renderBracket(femaleMatches, femaleRound, "Female")}
    </div>
  );
}

export default TieSheet;
