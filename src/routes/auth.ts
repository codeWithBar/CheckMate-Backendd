import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import Joi from "joi";
import "dotenv/config";

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Email or password");

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req: any) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(256).required().email(),
    password: Joi.string().min(8).max(256).required(),
  });

  return schema.validate(req);
}
export default router;
