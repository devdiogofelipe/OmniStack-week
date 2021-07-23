const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');



module.exports = {
  async index(request, response) {
    const { latitude, longitude, tecno } = request.query;

    const techsArray = parseStringAsArray(tecno);

    const devs = await Dev.find({
      tecno: {
        $in: techsArray,
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000,
        },
      },
    });

    return response.json({ devs });
  }


}