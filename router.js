const router = require('express').Router();
const { getUsers, createUser, updateUser, getUserById, deleteUser, getUserByIts } = require('./controllers/User');

router.get('/', (req, res) => {
    res.send("Hello world");
});

router.get('/users', getUsers);
router.get('/its-user', getUserByIts);
router.post('/user', createUser);
router.put('/user/:id', updateUser);
router.get('/user/:id', getUserById);
router.delete('/user/:id', deleteUser);

module.exports = router;