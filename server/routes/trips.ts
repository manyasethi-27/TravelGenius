import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { getDB, saveDB } from "../db";
import { authenticate } from "../middleware";

const router = Router();

router.get("/", authenticate, async (req: any, res) => {
  const db = await getDB();
  const userTrips = db.trips.filter(t => t.members.some((m: any) => m.id === req.user.id));
  res.json(userTrips);
});

router.post("/create", authenticate, async (req: any, res) => {
  const db = await getDB();
  const user = db.users.find(u => u.id === req.user.id);
  const newTrip = {
    ...req.body,
    id: uuidv4(),
    joinCode: Math.random().toString(36).substring(2, 7).toUpperCase(),
    adminId: req.user.id,
    members: [{ id: user.id, name: user.name, avatar: user.avatar }],
    itinerary: [],
    expenses: [],
    documents: [],
    polls: []
  };
  db.trips.push(newTrip);
  await saveDB(db);
  res.json(newTrip);
});

router.post("/join", authenticate, async (req: any, res) => {
  const { joinCode } = req.body;
  const db = await getDB();
  const trip = db.trips.find(t => t.joinCode === joinCode);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  
  const user = db.users.find(u => u.id === req.user.id);
  if (trip.members.find((m: any) => m.id === user.id)) {
    return res.status(400).json({ message: "Already a member" });
  }
  
  trip.members.push({ id: user.id, name: user.name, avatar: user.avatar });
  await saveDB(db);
  res.json(trip);
});

router.put("/:id", authenticate, async (req: any, res) => {
  const db = await getDB();
  const index = db.trips.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Trip not found" });
  
  db.trips[index] = { ...db.trips[index], ...req.body };
  await saveDB(db);
  res.json(db.trips[index]);
});

router.delete("/:id", authenticate, async (req: any, res) => {
  const db = await getDB();
  const index = db.trips.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Trip not found" });
  
  if (db.trips[index].adminId !== req.user.id) {
    return res.status(403).json({ message: "Only the trip creator can delete it" });
  }
  
  db.trips.splice(index, 1);
  await saveDB(db);
  res.json({ message: "Trip deleted successfully" });
});

export default router;
