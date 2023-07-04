const express = require('express');
const router = require('./router');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const WritingPad = require('./models/WritingPad');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 8000;

const app = express();
const server = require('http').Server(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

let writerPads = {};

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

let displayedWriter = null;

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('update_pad', async (data) => {
    let writingPad = await WritingPad.findOne({ writer: data.writer });
    if (writingPad) {
        writingPad.content = data.padContent;
    } else {
        writingPad = new WritingPad(data);
    }
    await writingPad.save();
    const writingPads = await WritingPad.find({});
    io.emit('update_pad', writingPads);
    if (displayedWriter === data.writer) {
      io.emit('display_pad', data.padContent);
    }
  });

  socket.on('display_pad', async (writer) => {
    displayedWriter = writer;
    const writingPad = await WritingPad.findOne({ writer });
    io.emit('display_pad', writingPad ? writingPad.content : '');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/pads', async (req, res) => {
  const writingPads = await WritingPad.find({});
  res.json(writingPads);
});

server.listen(port, () => console.log(`Listening on port ${port}`));
