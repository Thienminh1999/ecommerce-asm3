const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const shopRoutes = require("./routes/shopRoutes");
const adminRoutes = require("./routes/adminRoutes");
const session = require("express-session");
const User = require("./models/User");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");

app.use(
  cors({
    credentials: true,
    origin: [
      "https://ecommerce-asm3.web.app",
      "https://ecommerce-asm3-admin.web.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
  })
);
// app.use(cors({ credentials: true }));

// setting for storing images
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(allowCors());
// setup for call api
// NOTE: need to change origin url when deploy to firebase
console.log("---------------");
app.use(express.json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("images")
);
app.use("/images", express.static(path.join(__dirname, "images")));

// setup for using session and cookie
const MONGODB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.k2ngtvf.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});
app.use(
  session({
    secret: "somesecretkey",
    resave: false,
    saveUninitialized: false,
    store: store,
    proxy: true,
    name: "MyCoolWebAppCookieName",
    cookie: {
      sameSite: "none", // in order to response to both first-party and cross-site requests
      secure: "auto", // it should set automatically to secure if is https.
      httpOnly: true,
    },
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/admin", adminRoutes);

// set up to handle error
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.use(helmet());
app.use(compression());

// setup for connect database
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.k2ngtvf.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`
  )
  .then((result) => {
    console.log("Server listening on port 5000");
    const server = app.listen(process.env.PORT || 5000);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("socket is listening");
      socket.on("chat", function (msg) {
        io.emit("chat", msg);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
