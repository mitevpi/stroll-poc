const query_overpass = require('./QueryOSM');

class StreetData {
  constructor() {}

  static GetStreets(cityName) {
    return new Promise(function (resolve, reject) {

      if (!cityName) {
        console.error('Please pass city name as the first argument to this script');
        console.error('E.g. this will find all areas with Amsterdam as a name:');
        console.error('  node 1.find-area-id.js "Amsterdam"');
        process.exit(1);
      }

      console.log('Searching for ' + cityName);

      query_overpass(`area["name"="${cityName}"];out body;`).then(res => {
        console.log(res);
        resolve(res);
      }).catch(e => console.error(e));
    });
  }

  static GetStreets2(areaId) {
    if (!areaId) {
      console.error('Please pass area id as the first argument to this script');
      console.error('To find required area id, run:');
      console.error('  node 2.download-roads.js 3600197198 > data/3600197198.json');
      process.exit(1);
    }

    let highwayTags = [
      'motorway',
      'motorway_link',
      'trunk',
      'trunk_link',
      'primary',
      'primary_link',
      'secondary',
      'secondary_link',
      'tertiary',
      'tertiary_link',
      'unclassified',
      'unclassified_link',
      'residential',
      'residential_link',
      'service',
      'service_link',
      'living_street',
      'pedestrian',
      'road'
    ].join('|');

    let roadFilter = `["highway"~"${highwayTags}"]`;
    console.error('Searching for area ', areaId);

    let query = `
    (
    way${roadFilter}(area:${areaId});
    node(w);
    );
    out skel;`;

    query_overpass(query)
      .then(print).catch(e => console.log(e));

    function print(res) {
      console.log(res);
    }
  }
}

module.exports = StreetData;