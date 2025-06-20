require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose'); // Update this line to use mongoose directly
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken'); 

const app = express();

app.use(express.json());

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.headers['refresh-token'];
  console.log("Received refresh token:", refreshToken);
  if (!refreshToken) {
    return res.status(403).send('Refresh token is required');
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification error:", err); 
      return res.status(403).send('Invalid refresh token');
    }
    req.user = user; 
    next();
  });
};

const generateRefreshToken = (userId) => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  return jwt.sign({ userId }, secret, { expiresIn: '1d' });
};

app.get('/refresh-token', (req, res) => {
  const userId = req.query.userId || 'defaultUser  Id';
  const newRefreshToken = generateRefreshToken(userId);
  res.json({ refreshToken: newRefreshToken });
});

app.get('/status', verifyRefreshToken, (req, res) => {
  res.status(200).json({ message: "Service is up and running" });
});

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send("success");
});

const userRouter = require("../routers/user");
app.use(userRouter);

const httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`Server running securely on https://localhost:${port}`);
});
