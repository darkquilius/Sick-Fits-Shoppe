const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});
const createServer = require('./createServer');
const db = require("./db");

const server = createServer();

// USE EXPRESS TO HANDLE COOKIES (JWT OR JSON WEB TOKEN)
server.express.use(cookieParser());

// USE EXPRESS TO POPULATE CURRENT USER
server.express.use((req, res, next) => {
    const { token } = req.cookies;
    if (token) {
      const { userId } = jwt.verify(token, process.env.APP_SECRET);
      // put the userId onto the req for future requests to access
      req.userId = userId;
    }
    next();
  });
  
server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
},
    details => {
        console.log(`Server running on port ${details.port}`)
    }
);

// USE EXPRESS MIDDLE WARE TO HANDLE COOKIES (JSON WEB TOKENS)

// USE EXPRESS MIDDLEWARE TO POPULATE CURRENT USER INFO