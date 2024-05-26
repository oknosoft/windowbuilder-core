
export class Cycle extends Array {

  /**
   * Ищет нижнее ребро и упорядочивает цикл
   * @param cycle
   * @param blackSet
   * @param graySet
   * @return {[]}
   */
  reorder(cycle, blackSet, graySet) {
    let delta = Infinity;
    let bottom = -1;
    this.length = 0;
    for (let i = 0; i < cycle.length; i++) {
      const edge = cycle[i];
      blackSet.add(edge);
      graySet.delete(edge);
      let {angle} = edge.endVertex.point.subtract(edge.startVertex.point);
      if(angle < 0) {
        angle += 360;
      }
      const cdelta = Math.abs(angle - 180);
      if(cdelta < delta) {
        bottom = i;
        delta = cdelta;
      }
    }
    for (let i = bottom; i < cycle.length; i++) {
      this.push(cycle[i]);
    }
    for (let i = 0; i < bottom; i++) {
      this.push(cycle[i]);
    }
    return this;
  }
  
  get key() {
    return this.reduce((prev, curr, index) => {
      if(prev) {
        prev += '_';
      }
      return prev + curr.startVertex.key;
    }, '')
  }
}
