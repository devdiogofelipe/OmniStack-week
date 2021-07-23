const socketio = require('socket.io');
const parseStringAsArray =require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

exports.setupWebsocket = (server) => {
   io = socketio(server);

  io.on('connection', socket => {
    
    const {latitude, longitude, tecno} = socket.handshake.query;

      connections.push({
        id: socket.id,
        coordinates: {
          latitude: Number(latitude),
          longitude: Number(longitude),  
        },
        tecno: parseStringAsArray(tecno),

      });
  } );
};

exports.findConnections =(coordinates, tecno) => {
  return connections.filter(connection => {
    return calculateDistance(coordinates, connection.coordinates) < 10
    && connection.tecno.some(item => tecno.includes(item))
  })
}


exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  })
}