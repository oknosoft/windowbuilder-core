import {epsilon} from './Point';

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
    
    isLinear() {
      const {curves, firstCurve} = this;
      // если в пути единственная кривая и она прямая - путь прямой
      if(curves.length === 1 && (!firstCurve.hasHandles() || firstCurve.isLinear())) {
        return true;
      }
      // если в пути есть искривления, путь кривой
      else if(this.hasHandles()) {
        return false;
      }
      else {
        // если у всех кривых пути одинаковые направленные углы - путь прямой
        const da = firstCurve.point2.subtract(firstCurve.point1).angle;
        for (let i = 1; i < curves.length; i++) {
          const dc = curves[i].point2.subtract(curves[i].point1).angle;
          if(Math.abs(dc - da) > epsilon) {
            return false;
          }
        }
      }
      return true;
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
     * @summary Возвращает фрагмент пути между точками
     * @memberof paper.Path#
     * @method
     * @param {paper.Point} point1 - точка начала фрагмента
     * @param {paper.Point} point2 - точка конца фрагмента
     * @param {Boolean} [strict] - если точки 1-2 не лежат в точности на пути, искать ли ближайшую
     * @return {paper.Path}
     */
    getSubPath(point1, point2, strict) {
      let tmp;
      const {project} = this;

      if(!this.length || !point1 || !point2 || (!strict && point1.isNearest(this.firstSegment.point) && point2.isNearest(this.lastSegment.point))){
        tmp = this.clone({insert: false, deep: false});
      }
      else if(!strict && point2.isNearest(this.firstSegment.point) && point1.isNearest(this.lastSegment.point)){
        tmp = this.clone({insert: false, deep: false});
        tmp.reverse();
        tmp._reversed = true;
      }
      else{
        const loc1 = this.getLocationOf(point1) || this.getNearestLocation(point1);
        const loc2 = this.getLocationOf(point2) || this.getNearestLocation(point2);
        const offset1 = loc1.offset;
        const offset2 = loc2.offset;

        if(this.isLinear()){
          // для прямого формируем новый путь из двух точек
          tmp = new paper.Path({
            project,
            segments: [loc1.point, loc2.point],
            insert: false
          });
        }
        else{
          // для кривого, создаём клон, вырезаем и добавляем плоский хвостик

          if(offset1 > offset2){
            tmp = this.clone({insert: false});
            tmp.splitAt(offset1);
            tmp = tmp.splitAt(offset2);
            tmp.reverse();
          }
          else {
            tmp = this.clone({insert: false});
            tmp.splitAt(offset2);
            tmp = tmp.splitAt(offset1);
          }
          if(tmp.lastSegment.handleIn.length > 0.1 || tmp.lastSegment.handleOut.length > 0.1) {
            tmp.divideAt(tmp.length * 0.99);
            tmp.lastSegment.clearHandles();
          }
          if(tmp.firstSegment.handleIn.length > 0.1 || tmp.firstSegment.handleOut.length > 0.1) {
            tmp.divideAt(tmp.length * 0.01);
            tmp.firstSegment.clearHandles();
          }
        }

        if(offset1 > offset2){
          tmp._reversed = true;
        }
      }

      return tmp;
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
      const sub = this.getSubPath(base, initial);
      const pt = sub.length <= min ? sub.getPointAt(sub.length / 2) : sub.getPointAt(min);
      return {delta: pt.subtract(initial)};
    },
    
    joinedPosition({base1, base2, initial, test, min}) {
      const sub = this.getSubPath(base1, base2);
      let pt, stop;
      if(sub.length <= min * 2) {
        pt = sub.getPointAt(sub.length / 2);
        stop = true;
      }
      else {
        pt = sub.getNearestPoint(test);
        const offset = sub.getOffsetOf(pt);
        if(offset < min) {
          pt = sub.getPointAt(min);
          stop = true;
        }
        else if(offset > sub.length - min) {
          pt = sub.getPointAt(sub.length - min);
          stop = true;
        }
      }
      return {delta: pt.subtract(initial), stop};
    },

    joinedDirectedPosition({test, initial, min, max}) {
      // удлиняем test
      const path = new paper.Path({insert: false, segments: [
          test.firstSegment.point,
          test.lastSegment.point.add(test.getTangentAt(test.length).multiply(max)),
        ]});
      const pt = this.intersectPoint(path, initial);
      return pt && pt.getDistance(test.firstSegment.point) > min ? {delta: pt.subtract(initial)} : {reset: true};
      // TODO: проверки
      // const dir = this.getDistance(test.firstSegment.point) > this.getDistance(test.lastSegment.point);
      // const nearest = dir ? test.lastSegment.point : test.firstSegment.point;
    },

  });
}
