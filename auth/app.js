require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/user");
const auth = require("./middleware/auth");
const jwt = require("jsonwebtoken");
var cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const { name, password, room, admin } = req.body;

    if (!(name && password && room)) {
      res.status(400).send("All input is required");
      return;
    }

    const doesExist = await User.findOne({ name });

    if (doesExist) {
      return res.status(409).send("User Already Exist.");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    console.log(encryptedPassword);
    const user = await User.create({
      name,
      password: encryptedPassword,
      room,
      admin,
    });

    const token = jwt.sign(
      { userId: user._id, room: room, admin: admin },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      res.status(400).send("All input is required");
      return;
    }

    const user = await User.findOne({ name });
    console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { userId: user._id, room: user.room, admin: user.admin },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
      return;
    } else res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

// only for admin
app.get("/user", auth, async (req, res) => {
  try {
    const phrase = req.query.phrase;
    if (req.user.admin) {
      if (phrase == undefined) {
        const users = await User.find({}, "name room admin");
        res.status(200).json(users);
        return;
      } else {
        const users = await User.find(
          { name: { $regex: phrase, $options: "i" } },
          "name room admin"
        );
        res.status(200).json(users);
        return;
      }
    }
    res.status(401).send("Unauthorized.");
  } catch (err) {
    console.log(err);
  }
});

// only for admin
app.delete("/user/:id", auth, async (req, res) => {
  if (req.user.admin) {
    const dbRes = await User.deleteOne({ _id: req.params.id });

    if (dbRes.deletedCount === 1) {
      res.sendStatus(204);
      return;
    }
    res.status(404).send("User not found.");
    return;
  }

  res.status(401).send("Unauthorized.");
});

// only for admin
app.put("/user/:id", auth, async (req, res) => {
  if (req.user.admin) {
    const { name, password, room, admin } = req.body;

    const dbRes = await User.updateOne(
      { _id: req.params.id },
      { name, password, room, admin }
    );
    console.log(dbRes);

    res.status(204).send("User was modified.");
    return;
  }

  res.status(401).send("Unauthorized.");
});

module.exports = app;
