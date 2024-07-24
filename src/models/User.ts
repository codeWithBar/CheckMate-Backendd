import Joi from "joi";
import mongoose, { Model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { joiPasswordExtendCore } from "joi-password";
const joiPassword = Joi.extend(joiPasswordExtendCore);

// Check out https://mongoosejs.com/docs/typescript/statics-and-methods.html
interface IUser {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}
// Check out https://mongoosejs.com/docs/typescript/statics-and-methods.html
interface InstanceMethods {
  generateAuthToken(): string;
}

interface UserModel extends Model<IUser, {}, InstanceMethods> {
  print(): void;
}

const userSchema = new Schema<IUser, UserModel, InstanceMethods>({
  username: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 256,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 256,
  },
  isAdmin: Boolean,
});

userSchema.method("generateAuthToken", function () {
  const token: string = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.PRIVATE_KEY!,
    { expiresIn: "1h" }
  );
  return token;
});

userSchema.static("print", () => {
  console.log("Hello World!");
});

export const User = mongoose.model<IUser, UserModel>("User", userSchema);

export function validateUser(user: any) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(256).required(),
    email: Joi.string().min(5).max(256).email().required(),
    password: joiPassword
      .string()
      .min(8)
      .minOfSpecialCharacters(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .onlyLatinCharacters(),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(user);
}
