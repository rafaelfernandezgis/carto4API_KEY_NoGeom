function renderTable (element, data, barriosCallback, filter, filterCallback) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  if (filter) {
    const removeFilter = document.createElement('span');
    removeFilter.textContent = 'x remove filter';
    removeFilter.className = 'remove-filter';
    element.appendChild(removeFilter);

    removeFilter.addEventListener('click', filterCallback);
  }
  const barrios = document.createElement('div');
  barrios.className = 'barrios';
  element.appendChild(barrios);
  data.forEach(item => {
    const span = document.createElement('span');
    span.textContent = item;
    span.dataset.name = item;
    barrios.appendChild(span);
  });
  barrios.addEventListener('click', barriosCallback);
}

module.exports = renderTable;
