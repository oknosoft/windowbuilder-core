import paper from 'paper/dist/paper-core';
const clear = {
  inner: null,
  outer: null,
  middle: null,
  cut: null,
};

export class ProfileRays {

  constructor(cnn) {
    Object.defineProperties(this, {
      cnn: {value: cnn},
      
    });
  }
  
  clear() {
    Object.assign(this.pts, clear);
  }
  
  tuneRays() {
    const {cnn: {point, owner}, inner, outer} = this;
    const {d1, d2, width, generatrix} = owner;
    const ds = 3 * (width > 30 ? width : 30);
    const {offset, tangent, normal} = generatrix.getLocationOf(point);
    outer.removeSegments();
    inner.removeSegments();
    outer.add(point.add(normal.multiply(d1)).add(tangent.multiply(-ds)));
    inner.add(point.add(normal.multiply(d2)).add(tangent.multiply(-ds)));
    outer.add(point.add(normal.multiply(d1)).add(tangent.multiply(ds)));
    inner.add(point.add(normal.multiply(d2)).add(tangent.multiply(ds)));
    return this;
  }


}
