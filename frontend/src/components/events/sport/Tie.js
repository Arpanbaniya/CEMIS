import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Tie() {
  const location = useLocation();
  const participants = location.state?.participants || [];
  const navigate = useNavigate();

  const [maleMatches, setMaleMatches] = useState([]);
  const [femaleMatches, setFemaleMatches] = useState([]);
  const [maleChampion, setMaleChampion] = useState(null);
  const [femaleChampion, setFemaleChampion] = useState(null);

  useEffect(() => {
    generateInitialTieSheet();
  }, [participants]);

  const generateInitialTieSheet = () => {
    const maleParticipants = participants.filter(p => p.gender === "Male");
    const femaleParticipants = participants.filter(p => p.gender === "Female");
    setMaleMatches(createRoundMatches(maleParticipants));
    setFemaleMatches(createRoundMatches(femaleParticipants));
  };

  const createRoundMatches = (participants) => {
    if (!participants || participants.length === 0) return [];
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const matches = [];
    let byeParticipant = null;

    if (shuffled.length % 2 !== 0) {
      byeParticipant = shuffled.pop();
    }

    for (let i = 0; i < shuffled.length; i += 2) {
      matches.push({
        participant1: shuffled[i],
        participant2: shuffled[i + 1],
        winner: null,
      });
    }

    if (byeParticipant) {
      matches.push({
        participant1: byeParticipant,
        participant2: null,
        winner: byeParticipant,
      });
    }

    return matches;
  };

  const handleSelectWinner = (gender, matchIndex, chosenParticipant) => {
    if (gender === "male") {
      const updated = [...maleMatches];
      updated[matchIndex].winner = chosenParticipant;
      setMaleMatches(updated);
    } else {
      const updated = [...femaleMatches];
      updated[matchIndex].winner = chosenParticipant;
      setFemaleMatches(updated);
    }
  };

  const handleNextRound = () => {
    const maleWinners = maleMatches.map(m => m.winner).filter(Boolean);
    const femaleWinners = femaleMatches.map(m => m.winner).filter(Boolean);

    if (maleWinners.length === 1) setMaleChampion(maleWinners[0]);
    else setMaleMatches(createRoundMatches(maleWinners));

    if (femaleWinners.length === 1) setFemaleChampion(femaleWinners[0]);
    else setFemaleMatches(createRoundMatches(femaleWinners));
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <style>{`
        .match { margin-bottom: 10px; }
        .winner-button { background-color: lightgreen; font-weight: bold; }
        .next-round { margin-top: 20px; padding: 10px 20px; font-size: 16px; cursor: pointer; }
        .winner { font-size: 24px; font-weight: bold; }
        .winner.male { color: green; }
        .winner.female { color: purple; }
        .confetti-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; z-index: 9999; }
        .confetti { position: absolute; width: 10px; height: 10px; background-color: gold; animation: fall 4s infinite linear; }
        @keyframes fall { 0% { transform: translateY(-10px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } }
      `}</style>
      <h1>Tie Sheet</h1>
      {(maleChampion || femaleChampion) && <div className="confetti-container"><div className="confetti"></div></div>}
      {maleChampion && <h2 className="winner male">🏆 Male Champion: {maleChampion.name} 🎉</h2>}
      {femaleChampion && <h2 className="winner female">🏆 Female Champion: {femaleChampion.name} 🎉</h2>}
      <h2>Male Bracket</h2>
      {maleMatches.map((match, idx) => (
        <div key={idx} className="match">
          <button onClick={() => handleSelectWinner("male", idx, match.participant1)} className={match.winner === match.participant1 ? "winner-button" : ""}>{match.participant1.name}</button>
          {match.participant2 && (
            <><span> VS </span><button onClick={() => handleSelectWinner("male", idx, match.participant2)} className={match.winner === match.participant2 ? "winner-button" : ""}>{match.participant2.name}</button></>
          )}
        </div>
      ))}
      <h2>Female Bracket</h2>
      {femaleMatches.map((match, idx) => (
        <div key={idx} className="match">
          <button onClick={() => handleSelectWinner("female", idx, match.participant1)} className={match.winner === match.participant1 ? "winner-button" : ""}>{match.participant1.name}</button>
          {match.participant2 && (
            <><span> VS </span><button onClick={() => handleSelectWinner("female", idx, match.participant2)} className={match.winner === match.participant2 ? "winner-button" : ""}>{match.participant2.name}</button></>
          )}
        </div>
      ))}
      <button onClick={handleNextRound} disabled={maleChampion && femaleChampion} className="next-round">Next Round</button>
    </div>
  );
}

export default Tie;
