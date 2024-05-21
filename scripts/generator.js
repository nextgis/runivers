/**
 * This node script allows generating actual data for layers from http://213.248.47.89
 */
const fs = require('fs');

const NgwConnector = require('@nextgis/ngw-connector');

async function generator(options) {
  const out = options.out || './src/data/layers.json';
  const configPath = options.config || 'config.json';
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const baseUrl = config.baseUrl;
  const connector = new NgwConnector({ baseUrl });

  async function loadLayerData() {
    const results = [];

    for (const x of config.sourceGroups) {
      try {
        console.log(
          `Start loading layer ${x.name} resource from ${x.resourceId}`,
        );
        const items = await connector.getResourceChildren(x.resourceId, {
          cache: false,
        });
        results.push({ ...x, items });
      } catch (err) {
        console.error(`Failed to load data for ${x.name}:`, err);
      }
    }

    return results;
  }

  function generateData(data) {
    const toFile = data.map((x) => ({
      name: x.name,
      items: x.items.map((item) => ({
        resource: {
          display_name: item.resource.display_name,
          id: item.resource.id,
        },
      })),
    }));

    fs.writeFile(out, JSON.stringify(toFile), (err) => {
      if (err) {
        console.error('Error writing data to file:', err);
      } else {
        console.log('Data written to `' + out + '` file');
      }
    });
  }

  try {
    const data = await loadLayerData();
    generateData(data);
  } catch (err) {
    console.error('Error during data processing:', err);
  }
}

if (require.main === module) {
  const argv = require('minimist')(process.argv.slice(2));
  generator({
    out: argv.o,
    config: argv.c,
  });
}

module.exports = generator;
