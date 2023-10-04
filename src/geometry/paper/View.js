

export default function (proto) {

  function getZoom() {
    const scaling = this._decompose().scaling;
    return (Math.abs(scaling.x) + Math.abs(scaling.y)) / 2;
  }
  proto.getZoom = getZoom;
  const setZoom = Object.getOwnPropertyDescriptor(proto, 'zoom').set;
  delete proto.zoom;
  Object.defineProperty(proto, 'zoom', {
    get: getZoom,
    set: setZoom,
  });
}

