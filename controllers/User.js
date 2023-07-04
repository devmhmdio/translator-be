const User = require("../models/User");

const getUsers = async (req, res) => {
  const users = await User.find();
  res.send(users);
};

const createUser = async (req, res) => {
  const user = new User({
    name: req.body.name,
    userRole: req.body.userRole,
    its: req.body.its,
    password: req.body.password,
  });
  user.save();
  res.send(user);
};

const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    userRole: req.body.userRole,
    its: req.body.its,
    password: req.body.password,
  });
  res.send(user);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(user);
};

const getUserByIts = async (req, res) => {
  const user = await User.findOne({ its: req.query.its });
  res.send(user);
};

const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send('User deleted');
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  getUserById,
  deleteUser,
  getUserByIts,
};
