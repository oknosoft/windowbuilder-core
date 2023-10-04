

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
    }

  });
}
