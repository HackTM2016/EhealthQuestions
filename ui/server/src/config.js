module.exports = {
  api: {
    jsonSpaces: 4,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Accept',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Cache-Control': 'no-cache'
    }
  },
  port: process.env.PORT || 8001
};