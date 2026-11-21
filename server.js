
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const events = [];

app.post("/api/assessment", (req, res) => {
  const { username, passwordEntered, userAgent } = req.body;

  if (!username || typeof passwordEntered !== "boolean") {
    return res.status(400).json({
      error: "Invalid assessment data"
    });
  }

  const event = {
    username,
    passwordEntered,
    userAgent,
    timestamp: new Date().toISOString()
  };

  events.push(event);

  res.json({
    success: true,
    message: "Assessment event recorded"
  });
});

app.get("/api/events", (req, res) => {
  res.json(events);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Assessment server running on ${PORT}`);
});
