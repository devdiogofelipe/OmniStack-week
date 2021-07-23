const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const {findConnections, sendMessage} = require('../websocket');



module.exports = {

  async index(request, response) {
    const devs = await Dev.find();
      
      return response.json(devs);
    
  },

  async store(request, response) {

const {github_username, tecno, latitude, longitude} = (request.body);


  let dev = await Dev.findOne({ github_username});

if (!dev) {

  const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

  const { name = login, avatar_url, bio} = apiResponse.data;

  const tecnoArray = parseStringAsArray(tecno);



  const location = {
    type: 'Point',
    coordinates: [longitude, latitude],
  };

    dev = await Dev.create({
      github_username,
      name,
      avatar_url,
      bio,
      tecno: tecnoArray,
      location,
    })

      const sendSocketMessageTo = findConnections(
        { latitude, longitude}, 
        tecnoArray,
        )
          sendMessage(sendSocketMessageTo, 'new-dev', dev);
  }

  

  return response.json(dev);
},

    async update(request, response) {
        const dev = await Dev.findByIdAndUpdate(request.params.id, request.body, { new: true });

        return response.json(dev);
    },

    async destroy(request, response){
        await Dev.findByIdAndRemove(request.params.id);

        return response.send('O Usuário foi removido com sucesso!!');
    },
};
