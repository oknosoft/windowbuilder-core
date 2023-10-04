
export default function (proto) {
  Object.assign(proto, {
    
    isNearest(point, sticking) {
      const epsilon = 0.1;
      if(sticking === 0){
        return Math.abs(this.x - Array.isArray(point) ? point[0] : point.x) < epsilon 
          && Math.abs(this.y - Array.isArray(point) ? point[1] : point.y) < epsilon;
      }
      return this.getDistance(point, true) < (typeof sticking === 'number' ? sticking : 64);
    },

    snapToAngle(snapAngle, shift) {
      if(!snapAngle){
        snapAngle = Math.PI*2/8;
      }

      let angle = Math.atan2(this.y, this.x);
      angle = Math.round(angle/snapAngle) * snapAngle;

      const dirx = Math.cos(angle),
        diry = Math.sin(angle),
        d = dirx*this.x + diry*this.y;

      return shift ?
        new paper.Point(dirx*d, diry*d) :
        new paper.Point((dirx*d / 10).round() * 10, (diry*d / 10).round() * 10);
    },
    
  });  
}
