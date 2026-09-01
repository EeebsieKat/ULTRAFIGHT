
let players = [];
let currentPlayer = null;
let gameMaster = null;
let leaderboard = {};
let fightActive = false;
let useLocations = true;
let useScenarios = true;
let locationCard = null;
let scenarioCard = null;

// Sample card decks (truncated; you can expand to 100-200 entries)
const characters = [
  { name: "Samurai Gorilla", description: "A genetically enhanced gorilla trained in ancient bushido." },
  { name: "Cyber Witch", description: "Hacker of both machines and minds." },
  { name: "Space Cowboy", description: "Rides asteroids and shoots black holes." }
];

const weapons = [
  { name: "Laser Banjo", description: "Disorients enemies with blinding country solos." },
  { name: "Infinite Yo-Yo", description: "Never stops spinning. Never." },
  { name: "Quantum Slingshot", description: "Hits targets in alternate timelines." }
];

const twists = [
  { name: "Cloned Mid-Fight", description: "Now there are two of them." },
  { name: "Shrinks when angry", description: "Gets more dangerous the smaller it is." },
  { name: "On roller skates", description: "Speed vs control dilemma." }
];

const locations = [
  { name: "Inside a Giant Blender", description: "Better keep moving." },
  { name: "On Top of a Speeding Train", description: "Momentum matters." }
];

const scenarios = [
  { name: "During a Cooking Show", description: "Presentation is everything." },
  { name: "With One Arm Tied", description: "Fairness enforced by force." }
];

function drawCard(deck) {
  const card = deck[Math.floor(Math.random() * deck.length)];
  return { ...card };
}

function renderCards(cards) {
  const row = document.getElementById("cards-row");
  row.innerHTML = "";
  cards.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.animationDelay = `${index * 0.2}s`;
    div.innerHTML = \`
      <h3>\${card.name}</h3>
      <p>\${card.description}</p>
      <i>\${card.type}</i>
    \`;
    row.appendChild(div);
  });
}

function updateLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";
  const sorted = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]);
  sorted.forEach(([name, points]) => {
    const li = document.createElement("li");
    li.textContent = \`\${name}: \${points} pts\`;
    list.appendChild(li);
  });
}

function newFight() {
  fightActive = true;
  const context = document.getElementById("fight-context");
  locationCard = useLocations ? drawCard(locations) : null;
  scenarioCard = useScenarios ? drawCard(scenarios) : null;
  const fightText = \`
FIGHT SCENARIO:
Location: \${locationCard ? locationCard.name : "N/A"}
Scenario: \${scenarioCard ? scenarioCard.name : "N/A"}\`;

  context.textContent = fightText;

  // Assign cards to each player
  const playerCards = players.map(p => ({
    player: p.name,
    cards: [
      { ...drawCard(characters), type: "Character" },
      { ...drawCard(weapons), type: "Weapon" },
      { ...drawCard(twists), type: "Twist" }
    ]
  }));

  const allCards = playerCards.flatMap(pc => pc.cards);
  renderCards(allCards);

  // Fill GM dropdown
  const winnerSelect = document.getElementById("winnerSelect");
  winnerSelect.innerHTML = "";
  players.forEach(p => {
    const option = document.createElement("option");
    option.value = p.name;
    option.textContent = p.name;
    winnerSelect.appendChild(option);
  });

  document.getElementById("gm-controls").style.display = currentPlayer === gameMaster ? "block" : "none";
}

function resetGameIfNeeded() {
  if (!fightActive && players.length >= 2) {
    setTimeout(newFight, 1000);
  }
}

// Event Listeners
document.getElementById("joinButton").addEventListener("click", () => {
  const name = document.getElementById("playerName").value.trim();
  if (!name || players.find(p => p.name === name)) return;

  currentPlayer = { name };
  players.push(currentPlayer);
  useLocations = document.getElementById("useLocations").checked;
  useScenarios = document.getElementById("useScenarios").checked;

  if (document.getElementById("isGameMaster").checked && !gameMaster) {
    gameMaster = name;
  }

  document.getElementById("startup").style.display = "none";
  document.getElementById("gameplay").style.display = "block";

  resetGameIfNeeded();
});

document.getElementById("declareWinner").addEventListener("click", () => {
  const winnerName = document.getElementById("winnerSelect").value;
  leaderboard[winnerName] = (leaderboard[winnerName] || 0) + 1;
  updateLeaderboard();
  fightActive = false;
  resetGameIfNeeded();
});

// Clear leaderboard every 30 minutes
setInterval(() => {
  leaderboard = {};
  updateLeaderboard();
}, 1800000);
