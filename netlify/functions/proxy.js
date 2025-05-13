// netlify/functions/proxy.js
const Chemical = require('chemical');

exports.handler = async (event) => {
  const url = event.queryStringParameters.url;
  if (!url) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain'
      },
      body: 'Missing “url” query parameter'
    };
  }

  try {
    const chemRes = await Chemical.request({
      method:  event.httpMethod,
      url:     url,
      headers: { 'User-Agent': 'ChemicalJS-Proxy' }
    });

    // Preserve content type
    const contentType = chemRes.headers['content-type'] || 'text/plain';

    return {
      statusCode: chemRes.statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType
      },
      body: chemRes.body
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain'
      },
      body: `Proxy Error: ${err.message}`
    };
  }
};
