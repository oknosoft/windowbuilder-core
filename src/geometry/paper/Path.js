

export default function (proto) {
  Object.assign(proto, {

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

    /**
     * @summary
     * @param point
     * @return {{normal: Point, tangent: Point, offset: Number}}
     */
    otn(point) {
      const offset = this.getOffsetOf(point);
      const tangent = this.getTangentAt(offset);
      const normal = this.getNormalAt(offset);
      return {offset, tangent, normal};
    }

  });
}
