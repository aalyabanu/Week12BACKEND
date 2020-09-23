const router = require("express").Router();
const auth = require("../middleware/auth");
const Event = require("../models/eventModel");

//post new event
router.post("/new", auth, async (req, res) => {
  try {
    const { title, location, date, time, description } = req.body;

    //validation
    if (!title || !location || !date || !time || !description)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const newEvent = new Event({
      title,
      location,
      date,
      time,
      description,
      userId: req.user,
    });
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get all events
router.get("/", auth, async (req, res) => {
  const events = await Event.find({ userId: req.user });
  res.json(events);
});

//delete an event
router.delete("delete/:id", auth, async (req, res) => {
  const event = await Event.findOne({ userId: req.user, _id: req.params.id });
  if (!event)
    return res.status(400).json({
      msg: "No event found with this ID that belongs to the current user. ",
    });
  const deletedEvent = await Event.findByIdAndDelete(req.params.id);
  res.json(deletedEvent);
});

//update an event
router.put("update/:id", auth, async (req, res) => {
  const event = await Event.findOne({ userId: req.user, _id: req.params.id });
  if (!event)
    return res.status(400).json({
      msg: "No event found with this ID that belongs to the current user.",
    });
  const updatedEvent = await Event.findOneAndUpdate(
    { _id: req.params.id },
    req.body
  );
  res.send({ message: "Event updated." });
});

// const events = require("./eventsController");

// /* GET home page. */
// router.put("/event/:id", events.update);
// router.delete("/event/:id", events.delete);
// router.get("/event/:id", events.show);
// router.get("/event", events.index);
// router.post("/event/create", events.create);

module.exports = router;
