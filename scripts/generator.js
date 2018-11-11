/**
 * This node script allow to generate actual data for layer from http://213.248.47.89
 */
const fs = require('fs');
const NgwConnector = require('../nextgisweb_frontend/packages/ngw-connector');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const baseUrl = config.baseUrl;

const file = './src/data/layers.json';

const adapterFor = (function () {
  const url = require('url'),
    adapters = {
      'http:': require('http'),
      'https:': require('https'),
    };
  return function (inputUrl) {
    return adapters[url.parse(inputUrl).protocol];
  }
}());

NgwConnector.prototype._getJson = function (url, options) {
  return new Promise((resolve, reject) => {
    adapterFor(url).get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

const connector = new NgwConnector({ baseUrl });

connector.makeQuery('/api/resource/?parent={id}', {
  id: config.sourceGroupId
}).then(generateData);

function generateData(data) {
  const toFile = data.map((x) => {
    const res = x.resource;
    return { resource: { display_name: res.display_name, id: res.id } }
  });

  fs.writeFile(file, JSON.stringify(toFile), () => console.log('Data write in `' + file + '` file'));
}
