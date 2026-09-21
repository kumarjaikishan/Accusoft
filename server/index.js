require('dotenv').config();
require('./conn/conn')
// require('./utils/nodecron')
// require('./test');
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./utils/errorHandler');
const route = require('./router/route');
const cookieParser = require("cookie-parser");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

// 🛡️ Zero-overhead security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: allowedOrigins,  // frontend URL
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api", route);
app.use(errorHandler);

app.use((req, res, next) => {
  // res.status(404).json({ message: 'Endpoint not found, kindly Re-Check api End point' });
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`server listening at ${port}`);
})
