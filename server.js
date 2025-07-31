const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;
const USERS_FILE = './data/users.json';
const JWT_SECRET = 'your_jwt_secret_here';

let users = {};
if (fs.existsSync(USERS_FILE)) {
  const rawData = fs.readFileSync(USERS_FILE);
  users = JSON.parse(rawData);
}

function saveUsers() {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
  if (users[username]) return res.status(400).json({ error: 'Username already taken' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = {
    password: hashedPassword,
    progress: {}
  };
  saveUsers();

  res.json({ message: 'User registered successfully' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user) return res.status(400).json({ error: 'Invalid username or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Invalid username or password' });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.get('/api/progress', authenticate, (req, res) => {
  const user = users[req.user.username];
  res.json({ progress: user.progress || {} });
});

app.post('/api/progress', authenticate, (req, res) => {
  const { subject, lesson, score } = req.body;
  if (!subject || !lesson || score === undefined) return res.status(400).json({ error: 'Missing progress data' });

  if (!users[req.user.username].progress[subject]) {
    users[req.user.username].progress[subject] = {};
  }
  users[req.user.username].progress[subject][lesson] = score;
  saveUsers();

  res.json({ message: 'Progress saved' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
