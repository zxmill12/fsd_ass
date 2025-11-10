const express = require('express');
const path = require('path');

// Simple static server: DB and API removed. The app now uses localStorage on the client.
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Static server running on port ${PORT}`);
});