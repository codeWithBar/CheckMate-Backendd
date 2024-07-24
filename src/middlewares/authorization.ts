import jwt from "jsonwebtoken";

// Authorization middleware function
export default function authorize(req: any, res: any, next: any) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
}
