const express = require('express');
const router = require('./router');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 8000;

const app = express();
app.use(router);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
