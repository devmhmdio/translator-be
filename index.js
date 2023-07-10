const express = require('express');
const router = require('./router');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const WritingPad = require('./models/WritingPad');
const dotenv = require('dotenv');
dotenv.config();
let writerPads = {};
let displayedWriter = null;
let currentlyCastingWriterId;
const port = process.env.PORT || 8000;

const app = express();
const server = require('http').Server(app);
const io = socketIo(server, {
  cors: {
    origin: 'https://translator-fe.vercel.app',
    // origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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


io.on('connection', (socket) => {
  // console.log('New client connected');

  socket.on('update_pad', async (data) => {
    writerPads[data.writer] = data.content;
    io.emit('update_pad', data);
    if (currentlyCastingWriterId === data.writer) {
      console.log(`Casting screen update for writer ${data.writer}`);
      io.emit('cast_screen', data.content);
    }
  });  

  socket.on('display_pad', async (writer) => {
    displayedWriter = writer;
    const writingPad = await WritingPad.findOne({ writer });
    io.emit('display_pad', writingPad ? writingPad.content : '');
  });

  // listen for cast screen requests
  socket.on('cast_screen_request', ({ writerId, pads }) => {
    const padContent = pads[writerId];
    currentlyCastingWriterId = writerId;
    console.log('Emitting cast_screen with content:', padContent);
    io.emit('cast_screen', padContent);
  });

  socket.on('stop_cast', () => {
    currentlyCastingWriterId = null;
    io.emit('cast_screen', 'No preview available');
  });  

  socket.on('disconnect', () => {
    // console.log('Client disconnected');
  });
});

app.get('/pads', async (req, res) => {
  const writingPads = await WritingPad.find({});
  res.json(writingPads);
});

server.listen(port, () => console.log(`Listening on port ${port}`));
