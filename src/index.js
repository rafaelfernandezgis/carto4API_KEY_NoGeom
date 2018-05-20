import carto from '@carto/carto.js';
import renderTable from './table-renderer';
import getSql from './sql-filter';

const madridCenter = [40.4168, -3.7038];
const map = L.map('map').setView(madridCenter, 11);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

const client = new carto.Client({
  apiKey: '4yL3MeLsduy2pgL39XfgQA',
  username: 'udasaas'
});

let filterApplied = false;

const dataset = 'rgi_mini_urban';
const ind = 'rgi_mini_urban';
const geo = 'geo_boundary_geometry';
const source = new carto.source.SQL(getSql(ind,geo));
const style = new carto.style.CartoCSS(`
  #layer {
    polygon-fill: #826DBA;
    polygon-opacity: 0.7;
    ::outline {
      line-color: #FFFFFF;
      line-width: 2;
      line-opacity: 0.9;
    }
  }
`);

// Establecemos interactividad en la columna nombre
const layer = new carto.layer.Layer(source, style, {
  featureClickColumns: [ 'id' ]
});

// Usamos un dataview de categorias para obtener los nombres de los barrios
const barrios = new carto.dataview.Category(source, 'id', {
  limit: Number.MAX_SAFE_INTEGER
})

// Usamos un bounding box filter para que las categorias estén filtradas por el viewport
const bboxFilter = new carto.filter.BoundingBoxLeaflet(map);
barrios.addFilter(bboxFilter);

// Cuando cambien los datos del dataview, repintamos la tabla
barrios.on('dataChanged', (data) => {
  const names = data.categories.map(item => item.name);
  renderTable(document.getElementById('table'), names, onTableClicked, filterApplied, removeFilter);
});

// Cuando hagan click, recibiremos el valor de la columna nombre
layer.on('featureClicked', event => {
  applyFilter(event.data.id);
});

client.addLayer(layer);
client.addDataview(barrios);
client.getLeafletLayer().addTo(map);

// Helpers

/*
function applyFilter (barrio) {
  const newSql = getSql(dataset, 'nombre', barrio);
  source.setQuery(newSql);
  filterApplied = true;
}

function removeFilter () {
  const newSql = getSql(dataset);
  source.setQuery(newSql);
  filterApplied = false;
}
*/

function onTableClicked (event) {
  applyFilter(event.target.dataset.name);
}
