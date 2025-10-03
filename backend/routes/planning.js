const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const PlanningSlot = require("../models/PlanningSlot");

// public/parents: voir slots
router.get("/", async (req,res)=>{
  const q = await PlanningSlot.find().sort({date:1});
  res.json(q);
});

// admin/teacher: créer slots
router.post("/", requireAuth, requireRole("ADMIN","TEACHER"), async (req,res)=>{
  const s = await PlanningSlot.create(req.body);
  res.status(201).json(s);
});

// parent: s'inscrire
router.post("/:id/signup", requireAuth, requireRole("PARENT","ADMIN","TEACHER"), async (req,res)=>{
  const slot = await PlanningSlot.findById(req.params.id);
  if(!slot) return res.sendStatus(404);
  if(slot.signups.length >= slot.capacity) return res.status(400).json({message:"Місць немає"});
  slot.signups.push({ parent:req.user.id, note:req.body.note || "" });
  await slot.save();
  res.json(slot);
});

// admin/teacher: retirer/éditer
router.delete("/:id/signup/:signupId", requireAuth, requireRole("ADMIN","TEACHER"), async (req,res)=>{
  const slot = await PlanningSlot.findById(req.params.id);
  if(!slot) return res.sendStatus(404);
  slot.signups = slot.signups.filter(s=> s._id.toString() !== req.params.signupId);
  await slot.save();
  res.json(slot);
});

module.exports = router;
