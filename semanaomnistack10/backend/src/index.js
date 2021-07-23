const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const http = require ('http');
const cors = require('cors');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://admin:Sampleed1@cluster0-lfw7s.mongodb.net/semana10?retryWrites=true&w=majority'
  , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});


app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(1010);

