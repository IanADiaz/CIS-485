const xss = require("xss");

// Middleware to sanitize req.body inputs
function sanitizeBody(req, res, next) {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
}

module.exports = sanitizeBody;
