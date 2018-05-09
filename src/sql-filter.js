function getSql (dataset, filterColumn, filterValue) {
  const filter = filterColumn
    ? ` WHERE ${ filterColumn} = '${ filterValue}'`
    : '';

  return `SELECT * FROM ${ dataset}${ filter }`;
}

module.exports = getSql;
