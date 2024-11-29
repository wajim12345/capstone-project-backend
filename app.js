require("dotenv").config();
require("./src/configs/db");

const helmet = require("helmet");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const isProduction = process.env.NODE_ENV === "production";
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: "Too many requests, please try again later.",
});

var usersRouter = require("./src/routes/users");
var authRouter = require("./src/routes/auth");
var patientRouter = require("./src/routes/patient");
var fileUploadRouter = require("./src/routes/fileUpload");
var teamMemberRouter = require("./src/routes/teamMember");
var guardianRoutes = require("./src/routes/guardians");
var waitlistClientRouter = require("./src/routes/waitlistClientRouter");
var consentRouter = require("./src/routes/consent");
var diagnosisRouter = require("./src/routes/diagnosis");
var insuranceInfoRouter = require("./src/routes/insuranceInfo");
var clientContractRouter = require("./src/routes/clientContract");
var outsideProviderRouter = require("./src/routes/outsideProvider");
var staffContractRouter = require("./src/routes/staffContract");

const invoiceRouter = require("./src/routes/invoice"); // new

var app = express();

const corsOptions = {
  origin: true,
};

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// use middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));
app.use(limiter);

app.use(
  helmet({
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "trusted-cdn.com"], // Keep CSP strict in production
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
          },
        }
      : false, // Disable CSP in development if needed
    frameguard: {
      action: "deny",
    },
    hidePoweredBy: true,
    hsts: isProduction
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false, 
    noSniff: true,
    xssFilter: true,
    ieNoOpen: true,
    dnsPrefetchControl: { allow: false },
  })
);

// define the routes
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/clients", patientRouter);
app.use("/files", fileUploadRouter);
app.use("/team-member", teamMemberRouter);
app.use("/guardians", guardianRoutes);
app.use("/waitlist-client", waitlistClientRouter);
app.use("/consents", consentRouter);
app.use("/diagnosis", diagnosisRouter);
app.use("/insurance-info", insuranceInfoRouter);
app.use("/client-contract", clientContractRouter);
app.use("/outside-provider", outsideProviderRouter);
app.use("/staff-contract", staffContractRouter);

app.use("/invoice", invoiceRouter);//new

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
