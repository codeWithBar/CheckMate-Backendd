import express from "express";
import lodash from "lodash";
import bcrypt from "bcrypt";
import authorize from "../middlewares/authorization";
import { User, validateUser } from "../models/User";

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find().sort("username");
  res.send(users);
});

router.get("/me", authorize, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    isAdmin: req.body.isAdmin,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(lodash.pick(user, ["_id", "username", "email"]));
});

export default router;
