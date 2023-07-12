const router = require('express').Router();
const { getEvents, createEvent, updateEvent, getEventById, deleteEvent, getEventByWriterName } = require('./controllers/Event');
const { getUsers, createUser, updateUser, getUserById, deleteUser, getUserByIts, getWriters } = require('./controllers/User');

router.get('/', (req, res) => {
    res.send("Hello world");
});

router.get('/users', getUsers);
router.get('/its-user', getUserByIts);
router.post('/user', createUser);
router.put('/user/:id', updateUser);
router.get('/user/:id', getUserById);
router.delete('/user/:id', deleteUser);
router.get('/events', getEvents);
router.post('/event', createEvent);
router.put('/event/:id', updateEvent);
router.get('/event/:id', getEventById);
router.get('/event-writer/:name', getEventByWriterName);
router.delete('/event/:id', deleteEvent);
router.get('/writers', getWriters);

module.exports = router;