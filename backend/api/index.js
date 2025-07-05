// api/index.js
const serverless = require("serverless-http");
const app = require("../server"); // Adjust path if your file is named differently

module.exports = serverless(app);
