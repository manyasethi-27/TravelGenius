import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { getDB, saveDB } from "../db";
import { JWT_SECRET } from "../middleware";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  const db = await getDB();
  if (db.users.find(u => u.email.toLowerCase() === normalizedEmail)) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email: normalizedEmail, password: hashedPassword, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}` };
  db.users.push(user);
  await saveDB(db);
  
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET);
  res.cookie("token", token, { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });
  res.json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  const db = await getDB();
  const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET);
  res.cookie("token", token, { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });
  res.json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ message: "Logged out" });
});

router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const db = await getDB();
    const user = db.users.find(u => u.id === decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
