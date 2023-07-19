const express = require('express');
const router = require('./router');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const WritingPad = require('./models/WritingPad');
const IsLive = require('./models/IsLive');
const dotenv = require('dotenv');
dotenv.config();
let writerPads = {};
let displayedWriter = null;
let currentlyCastingWriterId;
const port = process.env.PORT || 8000;

const app = express();
const server = require('http').Server(app);
// const io = socketIo(server);
const io = socketIo(server, {
  cors: {
    // origin: 'https://translator-fe.vercel.app',
    origin: 'https://www.waaztranslations.com',
    // origin: 'http://localhost:3000',
    // origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
  // socket.on('cast_screen_request', async ({ writerId, pads }) => {
  //   const padContent = pads[writerId];
  //   currentlyCastingWriterId = writerId;
  //   console.log('Emitting cast_screen with content:', padContent);
  //   io.emit('cast_screen', padContent);

  //   // Check if a document for this writerId already exists
  //   let isLiveDoc = await IsLive.findOne({ writerId: writerId });

  //   // If no document exists, create a new one
  //   if (!isLiveDoc) {
  //     isLiveDoc = new IsLive({
  //       isLive: true,
  //       writerId: writerId,
  //     });
  //   }
  //   // If a document does exist, update its isLive field
  //   else {
  //     isLiveDoc.isLive = true;
  //   }

  //   // Save the document
  //   isLiveDoc.save();

  //   // Set isLive to false for all other documents
  //   IsLive.updateMany(
  //     { writerId: { $ne: writerId } },
  //     { $set: { isLive: false } },
  //   );
  // });

  socket.on('cast_screen_request', async ({ writerId, pads }) => {
    let padContent = pads[writerId];
    currentlyCastingWriterId = writerId;
    let padContentArray = padContent.split(" ");

    // Emit each word when the array length is 10 or more
    let index = 0;
    console.log('pad content array', padContentArray)
    if (padContentArray.length >= 10) {
        while(index < padContentArray.length) {
            console.log('pad conent array', padContentArray[index])
            io.emit('cast_screen', padContentArray[index]);
            index += 1;
        }
    }

    // Check if a document for this writerId already exists
    let isLiveDoc = await IsLive.findOne({ writerId: writerId });

    // If no document exists, create a new one
    if (!isLiveDoc) {
      isLiveDoc = new IsLive({
        isLive: true,
        writerId: writerId,
      });
    }
    // If a document does exist, update its isLive field
    else {
      isLiveDoc.isLive = true;
    }

    // Save the document
    isLiveDoc.save();

    // Set isLive to false for all other documents
    IsLive.updateMany(
      { writerId: { $ne: writerId } },
      { $set: { isLive: false } },
    );
  });

  socket.on('stop_cast', async (id) => {
    io.emit('cast_screen', 'No preview available');
    let currentlyCastingWriterId = id;
    if (!currentlyCastingWriterId) {
      return;
    }

    await IsLive.findOneAndUpdate({
      writerId: currentlyCastingWriterId,
    }, {
      isLive: false,
    });
  });

  socket.on('disconnect', () => {
    // console.log('Client disconnected');
  });
});

app.get('/pads', async (req, res) => {
  const writingPads = await WritingPad.find({});
  res.json(writingPads);
});

app.get('/isLive/:writerId', async (req, res) => {
  const writerId = req.params.writerId;

  try {
    const isLiveDoc = await IsLive.findOne({ writerId: writerId });

    if (!isLiveDoc) {
      // If no document is found, return a default value of false
      res.json({ isLive: false });
    } else {
      res.json({ isLive: isLiveDoc.isLive });
    }
  } catch (err) {
    console.error('Error fetching IsLive document:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

server.listen(port, () => console.log(`Listening on port ${port}`));
