
const express = require("express");
const crypto = require("crypto");

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.static("public"));

const events = [];
const adminToken = process.env.ADMIN_TOKEN;

app.post("/api/assessment", (req, res) => {
  const { participantCode, passwordFieldCompleted } = req.body;

  if (
    typeof participantCode !== "string" ||
    typeof passwordFieldCompleted !== "boolean"
  ) {
    return res.status(400).json({
      error: "Invalid assessment event"
    });
  }

  events.push({
    id: crypto.randomUUID(),
    participantCode: participantCode.slice(0, 40),
    passwordFieldCompleted,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true });
});

app.get("/api/events", (req, res) => {
  if (
    !adminToken ||
    req.headers.authorization !== `Bearer ${adminToken}`
  ) {
    return res.status(401).json({
      error: "Unauthorised"
    });
  }

  res.json(events);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Assessment server running on port ${PORT}`);
});
