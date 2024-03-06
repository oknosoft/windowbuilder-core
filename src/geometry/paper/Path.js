

export default function (paper) {
  Object.assign(paper.Path.prototype, {

    /**
     * @summary Определяет, находится ли точка вблизи пути
     * @memberof paper.Path#
     * @param point
     * @param sticking
     * @return {*|boolean}
     */
    isNearest(point, sticking) {
      return point.isNearest(this.getNearestPoint(point), sticking);
    },

    /**
     * @summary Определяет положение точки относительно пути в окрестности interior
     * @memberof paper.Path#
     * @param {paper.Point} point
     * @param {paper.Point} [interior]
     * @return {Number}
     */
    pointPos(point, interior) {
      if(!point) {
        return 0;
      }
      if(!interior) {
        interior = point;
      }
      const np = this.getNearestPoint(interior);
      const offset = this.getOffsetOf(np);
      const line = new paper.Line(np, np.add(this.getTangentAt(offset)));
      return line.getSide(point, true);
    },

    intersectPoint(path, point, elongate) {
      const intersections = this.getIntersections(path);
      if (intersections.length === 1) {
        if (!point || typeof elongate !== 'number' || point.isNearest(intersections[0].point, elongate * elongate)) {
          return intersections[0].point;
        }
      }
      if (intersections.length > 1) {

      }
      else if (elongate == "nearest") {

      }
      else if(elongate) {
        
      }
    },

    /**
     * @summary Расстояние от точки до прямой
     * @param {paper.Point} point
     * @param {Boolean} [squared]
     * @return {Number}
     */
    getDistance(point, squared) {
      const np = this.getNearestPoint(point);
      return np?.getDistance(point, squared) || Infinity;
    },

    directedPosition({base, initial, test, free, min, max}) {
      const lb = this.getNearestLocation(base);
      const li = this.getNearestLocation(initial);
      const lt = this.getNearestLocation(test);
      const line = new paper.Line(lb.point, lb.point.add(lb.normal));
      const side = line.getSide(initial, true);
      const stop = (line.getSide(test, true) !== side) || line.getDistance(test) < min;
      if(free) {
        const segment = new paper.Path({insert: false, segments: [base, test]});
        if(segment.length > max) {
          segment.lastSegment.point = segment.getPointAt(max);
        }
        else if(segment.length < min) {
          segment.lastSegment.point = this.getPointAt(lb.offset > li.offset ? lb.offset - min : lb.offset + min);
        }
        return {delta: segment.lastSegment.point.subtract(initial), stop};
      }
      const sign = (li.offset >= lb.offset && lt.offset >= lb.offset) ||
        (li.offset <= lb.offset && lt.offset <= lb.offset) ? 1 : -1;
      const delta = initial.getDistance(test);
      if(delta > 0 && li.point.isNearest(lt.point) && free) {
        
      }
      return {location: lt, delta: lt.point.subtract(initial), stop};
    },

    directedMinPosition({base, initial, min}) {
      let pt;
      if(this.length <= min) {
        pt = this.getPointAt(this.length / 2);
      }
      else {
        const ob = this.getOffsetOf(base);
        const oi = this.getOffsetOf(initial);
        pt = this.getPointAt(oi <= ob ? ob - min : min);
      }
      return {delta: pt.subtract(initial)};
      
    }

  });
}
