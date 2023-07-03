const router = require('express').Router();
const { getUsers, createUser, updateUser, getUserById, deleteUser } = require('./controllers/User');

router.get('/', (req, res) => {
    res.send("Hello world");
});

router.get('/users', getUsers);
router.post('/user', createUser);
router.put('/user/:id', updateUser);
router.get('/user/:id', getUserById);
router.delete('/user/:id', deleteUser);

module.exports = router;