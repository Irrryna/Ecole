const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const Homework = require("../models/Homework");

// PARENTS: voir devoirs d'une classe
router.get("/class/:classId", requireAuth, async (req,res)=>{
  const items = await Homework.find({ classId:req.params.classId }).sort({dueDate:1});
  res.json(items);
});

// TEACHER/ADMIN: CRUD
router.post("/", requireAuth, requireRole("TEACHER","ADMIN"), async (req,res)=>{
  const hw = await Homework.create({ ...req.body, createdBy:req.user.id });
  res.status(201).json(hw);
});
router.put("/:id", requireAuth, requireRole("TEACHER","ADMIN"), async (req,res)=>{
  const hw = await Homework.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(hw);
});
router.delete("/:id", requireAuth, requireRole("TEACHER","ADMIN"), async (req,res)=>{
  await Homework.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
