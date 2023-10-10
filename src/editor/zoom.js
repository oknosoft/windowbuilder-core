
// ошибка в paper-core
(() => {
  function getZoom() {
    const scaling = this._decompose().scaling;
    return (Math.abs(scaling.x) + Math.abs(scaling.y)) / 2;
  }
  const {prototype} = paper.View;
  prototype.getZoom = getZoom;
  const setZoom = Object.getOwnPropertyDescriptor(prototype, 'zoom').set;
  delete prototype.zoom;
  Object.defineProperty(prototype, 'zoom', {
    get: getZoom,
    set: setZoom,
  });
})();
