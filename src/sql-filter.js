
function getSql (dataset, zoom, bbox) {
  /*
  const filter = filterColumn
    ? ` WHERE udasaas.${dataset}.${ filterColumn} = '${ filterValue}'`
    : 'WHERE geo.id = 1';
    */

  let filter = null;
  if(zoom < 6) filter = ` WHERE ind.type = 10 and ST_Intersects(geo.the_geom, ST_MakeEnvelope(${bbox.getNorthEast().lng}, ${bbox.getNorthEast().lat}, ${bbox.getSouthWest().lng}, ${bbox.getSouthWest().lat}, 4326)) and ind.operation = 1 and ind.category_id is null`;
  if(zoom === 6) filter = ` WHERE ind.type = 11 and ST_Intersects(geo.the_geom, ST_MakeEnvelope(${bbox.getNorthEast().lng}, ${bbox.getNorthEast().lat}, ${bbox.getSouthWest().lng}, ${bbox.getSouthWest().lat}, 4326)) and ind.operation = 1 and ind.category_id is null`;
  if(zoom > 6 && zoom <= 8) filter = ` WHERE ind.type = 12 and ST_Intersects(geo.the_geom, ST_MakeEnvelope(${bbox.getNorthEast().lng}, ${bbox.getNorthEast().lat}, ${bbox.getSouthWest().lng}, ${bbox.getSouthWest().lat}, 4326)) and ind.operation = 1 and ind.category_id is null`;
  if(zoom > 8 && zoom <= 11) filter = ` WHERE ind.type = 13 and ST_Intersects(geo.the_geom, ST_MakeEnvelope(${bbox.getNorthEast().lng}, ${bbox.getNorthEast().lat}, ${bbox.getSouthWest().lng}, ${bbox.getSouthWest().lat}, 4326)) and ind.operation = 1 and ind.category_id is null`;
  if(zoom === 12) filter = ` WHERE ind.type = 14 and ST_Intersects(geo.the_geom, ST_MakeEnvelope(${bbox.getNorthEast().lng}, ${bbox.getNorthEast().lat}, ${bbox.getSouthWest().lng}, ${bbox.getSouthWest().lat}, 4326)) and ind.operation = 1 and ind.category_id is null`;
  if(zoom > 12) filter = ` WHERE ind.type = 15 and ST_Intersects(geo.the_geom, ST_MakeEnvelope(${bbox.getNorthEast().lng}, ${bbox.getNorthEast().lat}, ${bbox.getSouthWest().lng}, ${bbox.getSouthWest().lat}, 4326)) and ind.operation = 1 and ind.category_id is null`;

  return `SELECT ind.cartodb_id, ind.id, ind.o_a, ind.o_pu, ind.s_t, ind.y_s, geo.the_geom, geo.the_geom_webmercator 
    FROM udasaas.geo_boundary_geometry as geo INNER JOIN udasaas.${dataset} ind on geo.id = ind.id ${ filter }`;
}

module.exports = getSql;
