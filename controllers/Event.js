const Event = require('../models/Event');

const createEvent = async (req, res) => {
  const event = new Event({
    writers: req.body.writers,
    waaz: req.body.waaz,
    hijriDate: req.body.hijriDate,
    englishDate: req.body.englishDate,
  });
  event.save();
  res.send(event);
};

const getEvents = async (req, res) => {
  const events = await Event.find();
  res.send(events);
};

const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.send(event);
};

const getEventByWriterName = async (req, res) => {
  const event = await Event.find({ writers: { $in: [req.params.name] } });
  res.send(event);
};

const updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, {
    writers: req.body.writers,
    hijriDate: req.body.hijriDate,
    englishDate: req.body.englishDate,
    waaz: req.body.waaz,
  });
  res.send(event);
};

const deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.send('Event deleted');
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventByWriterName,
};
