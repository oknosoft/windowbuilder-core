
export default function ({Line, Point, Rectangle}) {
  Object.assign(Rectangle.prototype, {

    nearestRib(point) {
      const {left, top, right, bottom} = this;
      const {x, y} = point;
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
    },

  });
}
