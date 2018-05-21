
function getSql (dataset, filterColumn, filterValue) {
  const filter = filterColumn
    ? ` WHERE udasaas.${dataset}.${ filterColumn} = '${ filterValue}'`
    : '';

    return `SELECT ind.cartodb_id, ind.id, ind.o_a, ind.o_pu, ind.s_t, ind.y_s, geo.the_geom, geo.the_geom_webmercator FROM udasaas.geo_boundary_geometry as geo INNER JOIN udasaas.${dataset} ind on geo.id = ind.id ${ filter }`;
}

module.exports = getSql;
