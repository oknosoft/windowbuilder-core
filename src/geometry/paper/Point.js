
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
    
  });  
}
