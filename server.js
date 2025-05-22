const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// --- Database setup ---
const db = new sqlite3.Database('./data/results.db', (err) => {
  if (err) {
    console.error('❌ Error opening database', err.message);
  } else {
    console.log('✅ Connected to the results database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        sex TEXT NOT NULL,
        age INTEGER NOT NULL,
        trait TEXT NOT NULL,
        label TEXT NOT NULL,
        question TEXT NOT NULL,
        score INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

// API endpoint to receive test results
app.post("/submit", (req, res) => {
  console.log("📥 Incoming /submit payload:", req.body);

  const { name, sex, age, responses } = req.body;

  if (!sex || !age || !Array.isArray(responses)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const stmt = db.prepare(`
    INSERT INTO responses (name, sex, age, trait, label, question, score)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  responses.forEach(item => {
    stmt.run(name || null, sex, age, item.trait, item.label, item.question, item.score);
  });

  stmt.finalize();
  res.status(200).json({ message: "Results saved successfully!" });
});

// API endpoint to get percentiles for the latest participant
app.get("/percentiles", (req, res) => {
  const traitScores = {
    Openness: [],
    Conscientiousness: [],
    Extraversion: [],
    Agreeableness: [],
    Neuroticism: []
  };

  db.all("SELECT trait, score FROM responses", [], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching data:", err.message);
      return res.status(500).json({ error: "Failed to fetch data" });
    }

    rows.forEach(row => {
      if (traitScores[row.trait]) {
        traitScores[row.trait].push(row.score);
      }
    });

    const averagesByTrait = {};
    db.all(
      `SELECT trait, AVG(score) AS avg FROM (
         SELECT trait, score, name
         FROM responses
         WHERE id IN (
           SELECT MAX(id)
           FROM responses
           GROUP BY name, trait
         )
       )
       GROUP BY trait`,
      [],
      (err, latestScores) => {
        if (err) {
          console.error("❌ Error fetching latest scores:", err.message);
          return res.status(500).json({ error: "Failed to fetch latest participant scores" });
        }

        latestScores.forEach(row => {
          averagesByTrait[row.trait] = row.avg;
        });

        const percentiles = {};
        for (const trait in averagesByTrait) {
          const scores = traitScores[trait];
          const userScore = averagesByTrait[trait];
          if (!scores.length) {
            percentiles[trait] = "N/A";
            continue;
          }
          const countBelow = scores.filter(s => s < userScore).length;
          percentiles[trait] = ((countBelow / scores.length) * 100).toFixed(2);
        }

        const participantCount = Math.floor(rows.length / 5); // 5 traits per participant
        res.json({ percentiles, participantCount });
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
