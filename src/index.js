import carto from '@carto/carto.js';
import getSql from './sql-filter';

const extremaduraCenter = [39.293543, -6.135158];
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

const formulaDataview = new carto.dataview.Formula(source, 'o_pu', {
  operation: carto.operation.AVG,
});


formulaDataview.on('dataChanged', newData => { 
  console.log(newData);
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
client.getLeafletLayer().addTo(map);
