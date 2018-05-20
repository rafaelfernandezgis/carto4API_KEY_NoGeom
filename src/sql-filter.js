function getSql (dataset, filterColumn, filterValue) {
  const filter = filterColumn
    ? ` WHERE ${ filterColumn} = '${ filterValue}'`
    : '';

  return `SELECT * FROM ${ dataset}${ filter }`;
}

function getSql2 (ind, geo) {

  return `SELECT ind.cartodb_id, ind.id, ind.o_a, ind.o_pu, ind.s_t, ind.y_s, geo.the_geom, geo.the_geom_webmercator FROM udasaas.${geo} as geo INNER JOIN udasaas.${ind} ind on geo.id = ind.id`;
}

module.exports = [getSql, getSql2];
