
/*
 * Расширения объектов paper.js
 *
 * &copy; http://www.oknosoft.ru 2014-2018
 * @author	Evgeniy Malyarov
 *
 */

/**
 * @typedef PointAndProfile
 * @prop {paper.Point} point
 * @prop {ProfileItem} profile
 */

/**
 * @typedef JoinedProfiles
 * @prop {Array.<PointAndProfile>} outer
 * @prop {Array.<PointAndProfile>} inner
 */

/**
 * @typedef InnerOuter {'inner'|'outer'}
 */

/**
 * @typedef NodeBE {'b'|'e'}
 */

/**
 * @typedef NodeAndProfile
 * @prop {NodeBE} node
 * @prop {ProfileItem} profile
 */

/**
 * @typedef RectangleRib
 * @prop {paper.Line} rib
 * @prop {paper.Line} parallel
 * @prop {String} pos
 */

/**
 * Расширение класса Path
 */
Object.defineProperties(paper.Path.prototype, {

  /**
   * Вычисляет направленный угол в точке пути
   * @memberof paper.Path#
   * @method
   * @param {paper.Point} point
   * @return {Number}
   */
  getDirectedAngle: {
    value: function getDirectedAngle(point) {
      if(!point) {
        point = this.interiorPoint;
      }
      const np = this.getNearestPoint(point);
      const offset = this.getOffsetOf(np);
      return this.getTangentAt(offset).getDirectedAngle(point.add(np.negate()));
    }
  },

  /**
   * Возвращает массив самопересечений
   * @memberof paper.Path#
   * @method
   * @param {Boolean} [first] - возвращать первое найденное пересечение
   * @return {Array}
   */
  self_intersections: {
    value: function self_intersections(first) {
      const {curves} = this;
      const res = [];
      curves.some((crv1, i1) => {
        return curves.some((crv2, i2) => {
          if(i2 <= i1) {
            return;
          }
          const intersections = crv1.getIntersections(crv2);
          if(intersections.length) {
            const {point} = intersections[0];
            if(intersections.length > 1) {
              res.push({crv1, crv2, point});
              if(first) {
                return true;
              }
            }
            if(crv2.point1.is_nearest(crv1.point2, 0) && point.is_nearest(crv1.point2, 0)) {
              return;
            }
            if(crv1.point1.is_nearest(crv2.point2, 0) && point.is_nearest(crv1.point1, 0)) {
              return;
            }
            res.push({crv1, crv2, point});
            if(first) {
              return true;
            }
          }
        });
      });
      return res;
    }
  },

  /**
   * Является ли путь самопересекающимся
   * @memberof paper.Path#
   * @method
   * @return {Boolean}
   */
  is_self_intersected: {
    value: function is_self_intersected() {
      return this.self_intersections(true).length > 0;
    }
  },

  /**
   * Угол по отношению к соседнему пути _other_ в точке _point_
   * @memberof paper.Path#
   * @method
   * @param {paper.Path} other - соседний путь
   * @param {paper.Point} point - точка, в окрестности которой ищем угол
   * @param {paper.Point} [interior]  - точка внутри нашего пути
   * @param {Number} [round] - округлять до N знаков
   * @return {Number}
   */
  angle_to: {
      value : function angle_to(other, point, interior, round){
        const p1 = this.getNearestPoint(point),
          p2 = other.getNearestPoint(point),
          t1 = this.getTangentAt(this.getOffsetOf(p1)),
          t2 = other.getTangentAt(other.getOffsetOf(p2));
        let res = t2.angle - t1.angle;
        if(res < 0){
          res += 360;
        }
        if(interior && res > 180){
          res = 180 - (res - 180);
        }
        return typeof round === 'number' ? res.round(round) : res.round(1);
      }
    },

  /**
   * Угол между путями в точке _point_
   * @memberof paper.Path#
   * @method
   * @param {paper.Path} other - соседний путь
   * @param {paper.Point} point - точка, в окрестности которой ищем угол
   * @param {paper.Point} [interior]  - точка внутри нашего пути
   * @param {Number} [round] - округлять до N знаков
   * @return {Number}
   */
  angle_between: {
    value : function angle_between(other, point, interior, round){
      let res = 180 - this.angle_to(other, point, interior, round);
      if(res < 0){
        res += 360;
      }
      return res;
    }
  },

  is_orthogonal: {
    value: function is_orthogonal(other, point, delta = 1) {
      const offset1 = this.getOffsetOf(this.getNearestPoint(point));
      const offset2 = other.getOffsetOf(other.getNearestPoint(point));
      const v1 = this.getNormalAt(offset1);
      const v2 = other.getTangentAt(offset2);
      let angl = v1.getDirectedAngle(v2);
      if(angl < -170) {
        angl += 180;
      }
      else if(angl > 170) {
        angl -= 180;
      }
      return Math.abs(angl) < delta;
    }
  },

  /**
   * Выясняет, является ли путь прямым
   * @memberof paper.Path#
   * @method
   * @return {Boolean}
   */
  is_linear: {
    value: function is_linear() {
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
          if(Math.abs(dc - da) > consts.epsilon) {
            return false;
          }
        }
      }
      return true;
    }
  },

  /**
   * Выясняет, расположена ли точка в окрестности пути
   * @memberof paper.Path#
   * @method
   * @param {paper.Point} point - точка, положение которой надо оценить
   * @param {Boolean|Number} [sticking] - прилипание (размер окрестности)
   * @return {Boolean}
   */
  is_nearest: {
    value: function is_nearest(point, sticking) {
      return point.is_nearest(this.getNearestPoint(point), sticking);
    }
  },

  /**
   * Возвращает фрагмент пути между точками
   * @memberof paper.Path#
   * @method
   * @param {paper.Point} point1 - точка начала фрагмента
   * @param {paper.Point} point2 - точка конца фрагмента
   * @param {Boolean} [strict] - если точки 1-2 не лежат в точности на пути, искать ли ближайшую
   * @return {paper.Path}
   */
  get_subpath: {
      value: function get_subpath(point1, point2, strict) {
        let tmp;
        const {project} = this;

        if(!this.length || !point1 || !point2 || (!strict && point1.is_nearest(this.firstSegment.point) && point2.is_nearest(this.lastSegment.point))){
          tmp = this.clone({insert: false, deep: false});
        }
        else if(!strict && point2.is_nearest(this.firstSegment.point) && point1.is_nearest(this.lastSegment.point)){
          tmp = this.clone({insert: false, deep: false});
          tmp.reverse();
          tmp._reversed = true;
        }
        else{
          const loc1 = this.getLocationOf(point1) || this.getNearestLocation(point1);
          const loc2 = this.getLocationOf(point2) || this.getNearestLocation(point2);
          const offset1 = loc1.offset;
          const offset2 = loc2.offset;

          if(this.is_linear()){
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
      }
    },

  /**
   * Возвращает путь, равноотстоящий от текущего пути
   * @memberof paper.Path#
   * @method
   * @param {number} delta - расстояние, на которое будет смещен новый путь
   * @param {number} elong - удлинение нового пути с каждого конца
   * @return {paper.Path}
   */
  equidistant: {
      value: function equidistant(delta, elong) {

        const {project, firstSegment, lastSegment} = this;
        let normal = this.getNormalAt(0);
        const res = new paper.Path({
          project,
          segments: [firstSegment.point.add(normal.multiply(delta))],
          insert: false
        });

        if(this.is_linear()) {
          // добавляем последнюю точку
          res.add(lastSegment.point.add(normal.multiply(delta)));
        }
        else{

          if(firstSegment.handleIn.length){
            res.firstSegment.handleIn = firstSegment.handleIn.clone();
            res.firstSegment.handleIn.length /= 2;
          }
          if(firstSegment.handleOut.length){
            res.firstSegment.handleOut = firstSegment.handleOut.clone();
            res.firstSegment.handleOut.length /= 2;
          }

          // для кривого бежим по точкам
          let len = this.length, step = len * 0.02, point;
          if(step < 20) {
            step = len * 0.04;
          }
          else if(step > 90) {
            step = len * 0.014;
          }

          let addLast;
          for(let i = step; i < len; i += step) {
            point = this.getPointAt(i);
            if(!point)
              continue;
            normal = this.getNormalAt(i);
            res.add(point.add(normal.multiply(delta)));
            addLast = len - 1 > 0.2;
          }

          // добавляем последнюю точку
          if(addLast) {
            normal = this.getNormalAt(len);
            res.add(lastSegment.point.add(normal.multiply(delta)));
          }

          if(lastSegment.handleIn.length){
            res.lastSegment.handleIn = lastSegment.handleIn.clone();
            res.lastSegment.handleIn.length /= 2;
          }
          if(lastSegment.handleOut.length){
            res.lastSegment.handleOut = lastSegment.handleOut.clone();
            res.lastSegment.handleOut.length /= 2;
          }
          res.simplify(0.6);
        }

        return res.elongation(elong);
      }
    },

  /**
   * Удлиняет путь касательными в начальной и конечной точках
   * @memberof paper.Path#
   * @method
   * @param {number} delta - расстояние, на которое будет смещен новый путь
   * @return {paper.Path}
   */
  elongation: {
      value: function elongation(delta) {

        if(delta){
          if(this.is_linear()) {
            let tangent = this.getTangentAt(0);
            this.firstSegment.point = this.firstSegment.point.add(tangent.multiply(-delta));
            this.lastSegment.point = this.lastSegment.point.add(tangent.multiply(delta));
          }else{
            const {length} = this;
            let tangent = this.getTangentAt(length * 0.01);
            this.insert(0, this.firstSegment.point.add(tangent.multiply(-delta)));
            tangent = this.getTangentAt(length * 0.99);
            this.add(this.lastSegment.point.add(tangent.multiply(delta)));
          }
        }
        return this;
      }
    },

  /**
   * Находит координату пересечения путей в окрестности точки
   * @memberof paper.Path#
   * @method
   * @param {paper.Path} path
   * @param {paper.Point|NodeBE} point - точка или имя узла (b,e)
   * @param {Boolean|Number} [elongate] - если истина, пути будут продолжены до пересечения
   * @param {paper.Point} [other_point] - если указано, контролируем вектор пересечения
   * @param {Boolean} [clone] - если указано, не удлиняем текущие пути
   * @return {paper.Point}
   */
  intersect_point: {
      value: function intersect_point(path, point, elongate, other_point, clone) {
        const intersections = this.getIntersections(path);
        let delta = Infinity, tdelta, tpoint;

        if(intersections.length === 1){
          if(!point || typeof elongate !== 'number' || point.is_nearest(intersections[0].point, elongate * elongate)) {
            return intersections[0].point;
          }
        }
        if(intersections.length > 1){

          if(typeof point === 'string' && this.parent) {
            point = this.parent[point];
          }

          if(!point){
            point = this.getPointAt(this.length /2);
          }

          // здесь надо учесть не только близость пересечения к точке, но в первую очередь, вектор пересечения
          intersections.forEach((o) => {
            tdelta = o.point.getDistance(point, true);
            if(other_point) {
              const d2 = o.point.getDistance(other_point, true);
              if(d2 < tdelta) {
                return;
              }
            }
            if(tdelta < delta){
              delta = tdelta;
              tpoint = o.point;
            }
          });
          return tpoint;
        }
        else if(elongate == "nearest"){

          // ищем проекцию ближайшей точки на path на наш путь
          return this.getNearestPoint(path.getNearestPoint(point));

        }
        else if(elongate){

          if(!this.length || !path.length) {
            return null;
          }

          const path1 = clone ? this.clone({insert: false, deep: false}) : this;
          const path2 = clone ? path.clone({insert: false, deep: false}) : path;

          let p1 = path1.getNearestPoint(point),
            p2 = path2.getNearestPoint(point),
            p1f = path1.firstSegment.point.getDistance(p1),
            p1l = path1.lastSegment.point.getDistance(p1),
            p2f = path2.firstSegment.point.getDistance(p2),
            p2l = path2.lastSegment.point.getDistance(p2),
            p1last = p1f > p1l,
            p2last = p2f > p2l,
            p4 = 4, tg;

          if(p1.getDistance(p2) < 0.8) {
            if((p1f < p4 || p1l < p4) && (p2f < p4 || p2l < p4)) {
              return p1.add(p2).divide(2);
            }
          }

          // продлеваем пути до пересечения

          if(!path1.closed) {
            tg = (p1last ? path1.getTangentAt(path1.length) : path1.getTangentAt(0).negate()).multiply(typeof elongate === 'number' ? elongate : 100);
            if(path1.is_linear()){
              if(p1last) {
                path1.lastSegment.point = path1.lastSegment.point.add(tg);
              }
              else {
                path1.firstSegment.point = path1.firstSegment.point.add(tg);
              }
            }
            else {
              if(p1last) {
                path1.add(path1.lastSegment.point.add(tg));
              }
              else {
                path1.insert(0, path1.firstSegment.point.add(tg));
              }
            }
          }

          if(!path2.closed) {
            tg = (p2last ? path2.getTangentAt(path2.length) : path2.getTangentAt(0).negate()).multiply(typeof elongate === 'number' ? elongate : 100);
            if(path2.is_linear()){
              if(p2last) {
                path2.lastSegment.point = path2.lastSegment.point.add(tg);
              }
              else {
                path2.firstSegment.point = path2.firstSegment.point.add(tg);
              }
            }
            else {
              if(p2last) {
                path2.add(path2.lastSegment.point.add(tg));
              }
              else {
                path2.insert(0, path2.firstSegment.point.add(tg));
              }
            }
          }

          return path1.intersect_point(path2, point, false, other_point);

        }
      }
    },

  /**
   * Определяет положение точки относительно пути в окрестности interior
   * @memberof paper.Path#
   * @method
   * @param {paper.Point} point
   * @param {paper.Point} [interior]
   * @return {Number}
   */
  point_pos: {
    value: function point_pos(point, interior) {
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
  },

  /**
   * @summary Минимальный радиус, высисляемый по кривизне пути
   * @desc для прямых = 0
   * @memberof paper.Path#
   * @method
   * @return {Number}
   */
  rmin: {
    value() {
      if(this.is_linear()){
        return 0;
      }
      const {length} = this;
      const step = length / 9;
      let max = 0;
      for(let pos = 0; pos < length; pos += step){
        const curv = Math.abs(this.getCurvatureAt(pos));
        if(curv > max){
          max = curv;
        }
      }
      return (max === 0 ? 0 : 1 / max).round(2);
    }
  },

  /**
   * Максимальный радиус, высисляемый по кривизне пути
   * для прямых = 0
   * @memberof paper.Path#
   * @method
   * @return {Number}
   */
  rmax: {
    value() {
      if(this.is_linear()){
        return 0;
      }
      const {length} = this;
      const step = length / 9;
      let min = Infinity;
      for(let pos = 0; pos < length; pos += step){
        const curv = Math.abs(this.getCurvatureAt(pos));
        if(curv < min){
          min = curv;
        }
      }
      return (min === 0 ? 0 : 1 / min).round(2);
    }
  },

  /**
   * Cредний радиус пути по трём точкам
   * @memberof paper.Path#
   * @method
   * @return {Number}
   */
  ravg: {
    value() {
      if(this.is_linear()){
        return 0;
      }
      const b = this.firstSegment.point;
      const e = this.lastSegment.point;
      const ph0 = b.add(e).divide(2);
      const ph1 = this.getPointAt(this.length / 2);
      return ph0.arc_r(b.x, b.y, e.x, e.y, ph0.getDistance(ph1));
    }
  }

});

/**
 * Расширение класса Point
 */
Object.defineProperties(paper.Point.prototype, {

	/**
	 * Выясняет, расположена ли точка в окрестности точки
   * @memberof paper.Point#
   * @method
	 * @param {paper.Point} point
	 * @param {Boolean|Number} [sticking]
	 * @return {Boolean}
	 */
	is_nearest: {
		value: function is_nearest(point, sticking) {
      if(!point) {
        return false;
      }
		  if(sticking === 0){
        return Math.abs(this.x - point.x) < consts.epsilon && Math.abs(this.y - point.y) < consts.epsilon;
      }
			return this.getDistance(point, true) < (typeof sticking === 'number' ? sticking : (sticking ? consts.sticking2 : 16));
		}
	},

	/**
	 * Положение точки относительно прямой
   * @memberof paper.Point#
   * @method
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 * @return {Number}
	 */
	point_pos: {
		value: function point_pos(x1,y1, x2,y2){
			if (Math.abs(x1-x2) < 0.2){
				// вертикаль  >0 - справа, <0 - слева,=0 - на линии
				return (this.x-x1)*(y1-y2);
			}
			if (Math.abs(y1-y2) < 0.2){
				// горизонталь >0 - снизу, <0 - сверху,=0 - на линии
				return (this.y-y1)*(x2-x1);
			}
			// >0 - справа, <0 - слева,=0 - на линии
			return (this.y-y1)*(x2-x1)-(y2-y1)*(this.x-x1);
		}
	},

	/**
	 * Рассчитывает координаты центра окружности по точкам и радиусу
   * @memberof paper.Point#
   * @method
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 * @param {Number} r
	 * @param {Boolean} arc_ccw
	 * @param {Boolean} more_180
	 * @return {paper.Point}
	 */
	arc_cntr: {
    value(x1, y1, x2, y2, r0, ccw) {
      let a, b, p, r, q, yy1, xx1, yy2, xx2;
      if(ccw) {
        const tmpx = x1, tmpy = y1;
        x1 = x2;
        y1 = y2;
        x2 = tmpx;
        y2 = tmpy;
      }
      if(x1 != x2) {
        a = (x1 * x1 - x2 * x2 - y2 * y2 + y1 * y1) / (2 * (x1 - x2));
        b = ((y2 - y1) / (x1 - x2));
        p = b * b + 1;
        r = -2 * ((x1 - a) * b + y1);
        q = (x1 - a) * (x1 - a) - r0 * r0 + y1 * y1;
        yy1 = (-r + Math.sqrt(r * r - 4 * p * q)) / (2 * p);
        xx1 = a + b * yy1;
        yy2 = (-r - Math.sqrt(r * r - 4 * p * q)) / (2 * p);
        xx2 = a + b * yy2;
      }
      else {
        a = (y1 * y1 - y2 * y2 - x2 * x2 + x1 * x1) / (2 * (y1 - y2));
        b = ((x2 - x1) / (y1 - y2));
        p = b * b + 1;
        r = -2 * ((y1 - a) * b + x1);
        q = (y1 - a) * (y1 - a) - r0 * r0 + x1 * x1;
        xx1 = (-r - Math.sqrt(r * r - 4 * p * q)) / (2 * p);
        yy1 = a + b * xx1;
        xx2 = (-r + Math.sqrt(r * r - 4 * p * q)) / (2 * p);
        yy2 = a + b * xx2;
      }

      if(new paper.Point(xx1, yy1).point_pos(x1, y1, x2, y2) > 0) {
        return {x: xx1, y: yy1};
      }
      else {
        return {x: xx2, y: yy2};
      }
    }
  },

	/**
	 * Рассчитывает координаты точки, лежащей на окружности
   * @memberof paper.Point#
   * @method
   * @param {Number} x1
   * @param {Number} y1
   * @param {Number} x2
   * @param {Number} y2
   * @param {Number} r
   * @param {Boolean} arc_ccw
   * @param {Boolean} more_180
	 * @return {{x: number, y: number}}
	 */
	arc_point: {
    value(x1, y1, x2, y2, r, arc_ccw, more_180) {
      const point = {x: (x1 + x2) / 2, y: (y1 + y2) / 2};
      if(r > 0) {
        let dx = x1 - x2, dy = y1 - y2, dr = r * r - (dx * dx + dy * dy) / 4, l, h;
        if(dr >= 0) {
          const centr = this.arc_cntr(x1, y1, x2, y2, r, arc_ccw);
          dx = point.x - centr.x;
          dy = point.y - centr.y;	// т.к. Y перевернут
          l = Math.sqrt(dx * dx + dy * dy);

          if(more_180) {
            h = r + Math.sqrt(dr);
          }
          else {
            h = r - Math.sqrt(dr);
          }

          point.x += dx * h / l;
          point.y += dy * h / l;
        }
      }
      return point;
    }
	},

  /**
   * Рассчитывает радиус окружности по двум точкам и высоте
   * @memberof paper.Point#
   * @method
   * @param {Number} x1
   * @param {Number} y1
   * @param {Number} x2
   * @param {Number} y2
   * @param {Number} h
   * @return {Number}
   */
  arc_r: {
    value(x1, y1, x2, y2, h) {
      if(!h) {
        return 0;
      }
      const [dx, dy] = [(x1 - x2), (y1 - y2)];
      return (h / 2 + (dx * dx + dy * dy) / (8 * h)).round(2);
    }
  },

	/**
	 * @summary Привязка к углу
	 * @desc Сдвигает точку к ближайшему лучу с углом, кратным snapAngle
	 * @memberof paper.Point#
   * @method
	 * @param {Number} [snapAngle] - шаг угла, по умолчанию 45°
	 * @return {paper.Point}
	 */
	snap_to_angle: {
		value: function snap_to_angle(snapAngle, shift) {

			if(!snapAngle){
        snapAngle = Math.PI*2/8;
      }

			let angle = Math.atan2(this.y, this.x);
			angle = Math.round(angle/snapAngle) * snapAngle;

			const dirx = Math.cos(angle),
				diry = Math.sin(angle),
				d = dirx*this.x + diry*this.y;

			return shift || paper.Key.isDown('shift') ?
        new paper.Point(dirx*d, diry*d) :
        new paper.Point((dirx*d / 10).round() * 10, (diry*d / 10).round() * 10);
		}
	},

  /**
   * Выясняет одинаковость направлений векторов
   * @memberof paper.Point#
   * @method
   * @param {paper.Point} point - вектор, с которым сравниваем
   * @return {Boolean}
   */
  some_angle: {
    value: function some_angle(point) {
      const delta = Math.abs(this.angle - point.angle);
      return delta < 1 || (delta > 179 && delta < 181);
    }
  },

  /**
   * Осуществляем привязку (магнетизм) к узлам текущего слоя
   * Используется инструментами ui
   * @memberof paper.Point#
   * @method
   * @param {Number} sticking - размер области магнетизма
   * @param {Contour} activeLayer - текущий слой
   * @return {Boolean}
   */
  bind_to_nodes: {
	  value: function bind_to_nodes(sticking, {activeLayer}) {
      return activeLayer && activeLayer.nodes.some((point) => {
        if(point.is_nearest(this, sticking)){
          this.x = point.x;
          this.y = point.y;
          return true;
        }
      });
    }
  },

});

/**
 * Возвращает ближайшее ребро прямоугольника
 * @param {paper.Point} point
 * @return {RectangleRib}
 */
paper.Rectangle.prototype.nearest_rib = function nearest_rib(point) {
  const {left, top, right, bottom} = this;
  const {x, y} = point;
  const {Line, Point} = paper;
  const res = {rib: null, parallel: null, pos: ''};
  if(x > right && y > top && y < bottom) {
    res.rib = new Line(new Point(right, bottom), new Point(right, top));
    res.parallel = new Line(new Point(x, bottom), new Point(x, top));
    res.pos = 'right';
  }
  else if(x < left && y > top && y < bottom) {
    res.rib = new Line(new Point(left, bottom), new Point(left, top));
    res.parallel = new Line(new Point(x, bottom), new Point(x, top));
    res.pos = 'left';
  }
  else if(y < top && x > left && x < right) {
    res.rib = new Line(new Point(left, top), new Point(right, top));
    res.parallel = new Line(new Point(left, y), new Point(right, y));
    res.pos = 'top';
  }
  else if(y > bottom && x > left && x < right) {
    res.rib = new Line(new Point(left, bottom), new Point(right, bottom));
    res.parallel = new Line(new Point(left, y), new Point(right, y));
    res.pos = 'bottom';
  }
  return res;
};

class PathUnselectable extends paper.Path {

  setSelection(selection) {
    const {parent, project: {_scope}} = this;
    if(parent) {
      _scope.Item.prototype.setSelection.call(parent, selection);
    }
  }
}

class TextUnselectable extends paper.PointText {

  setSelection(selection) {
    const {parent, project: {_scope}} = this;
    if(parent) {
      _scope.Item.prototype.setSelection.call(parent, selection);
    }
  }
}

EditorInvisible.PathUnselectable = PathUnselectable;
EditorInvisible.TextUnselectable = TextUnselectable;





