import carto from '@carto/carto.js';
import getSql from './sql-filter';

const extremaduraCenter = [40.293543, -6.135158];
const map = L.map('map').setView(extremaduraCenter, 8);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

const client = new carto.Client({
  apiKey: 'kmgOWAYJ7Suu7wx9IePRow',
  username: 'udasaas'
});

const dataset = 'rgi_mini_urban';
//const dataset = 'rgi';
const source = new carto.source.SQL(getSql(dataset));
const style = new carto.style.CartoCSS(`
  #layer {
    polygon-fill: #826DBA;
    polygon-opacity: 0.3;
    ::outline {
      line-color: #FFFFFF;
      line-width: 1;
      line-opacity: 0.9;
    }
  }
`);

// Establecemos interactividad en la columna nombre
const layer = new carto.layer.Layer(source, style, {
  featureClickColumns: [ 'id' ]
});

// Usamos un dataview de categorias para obtener los IDs
const ids = new carto.dataview.Category(source, 'id', {
  limit: Number.MAX_SAFE_INTEGER
})
ids.on('dataChanged', (data) => {
  console.log(data);
  const ids = data.categories.map(item => item.name);
  console.log(ids);

  let newIds = JSON.stringify(ids).slice(1, -1);
  //newIds = newIds.slice(1, -1);

  const test = [702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 716, 717, 719, 720, 721, 722, 723, 724];

  const apiKey = 'WOJ6qvpWJmQNrUC4QGScrA';
  const username = 'udasaas'

  const query = `SELECT ST_Extent(the_geom) as extent FROM udasaas.geo_boundary_geometry WHERE id = ANY ('{${newIds}}'::int[])`;
  const boundsUrl = `https://${username}.carto.com/api/v2/sql?q=${query}&api_key=${apiKey}`

      fetch(boundsUrl)
        .then(response => {
          return response.json()
        })
        .then(json => {
          const extent = json.rows[0].extent;
          const bounds = parseExtent(extent);
          console.log(extent);
          console.log(bounds);
          map.fitBounds(
            [
              [bounds.south, bounds.west],
              [bounds.north, bounds.east]
            ]
          );
        });

      // From BOX(-179.5 -89.9,179.3 82.3) to bounds object
      function parseExtent (extent) {
        const floatRegex = /-?[0-9]\d*(\.\d+)?/g;
        const matches = extent.match(floatRegex);
        return {
          west: Number.parseFloat(matches[0]),
          south: Number.parseFloat(matches[1]),
          east: Number.parseFloat(matches[2]),
          north: Number.parseFloat(matches[3])
        };
      }
});

const formulaDataview = new carto.dataview.Formula(source, 'o_pu', {
  operation: carto.operation.AVG,
});


formulaDataview.on('dataChanged', (newData) => { 
  console.log(newData);
  //const names = data.categories.map(item => item.name);
  
  //parseFloat(value).toLocaleString('de-DE', { maximumFractionDigits: 1 });
  if(newData.result) document.getElementById('ind_precios_value').innerText = Math.round(newData.result.toString());
});

formulaDataview.on('statusChanged', (status, error) => { 
  if(status === 'loading') console.log("status loading"); 
  if(status === 'loaded') console.log("status loaded"); 
});
formulaDataview.on('error', cartoError => { console.log(cartoError); });


// Usamos un bounding box filter para que las categorias estén filtradas por el viewport
const bboxFilter = new carto.filter.BoundingBoxLeaflet(map);
formulaDataview.addFilter(bboxFilter);

// Cuando hagan click, recibiremos el valor de la columna nombre
layer.on('featureClicked', event => {
  console.log('Tabla: ' + dataset + ', id: ' + event.data.id);
});


client.addLayer(layer);
client.addDataview(formulaDataview);
client.addDataview(ids);
client.getLeafletLayer().addTo(map);


