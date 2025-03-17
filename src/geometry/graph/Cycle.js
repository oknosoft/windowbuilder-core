import paper from 'paper/dist/paper-core';

export class Cycle extends Array {

  /**
   * @summary Ищет нижнее ребро и упорядочивает цикл
   * @desc При необходимости, выпрямляет углы
   * @param {Array} cycle
   * @param {Set} blackSet
   * @param {Set} graySet
   * @param {Boolean} isOrthogonal
   * @return {Cycle}
   */
  reorder(cycle, blackSet, graySet, isOrthogonal) {
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
    
    return isOrthogonal && !this.isOrthogonal ? this.orthogonalize() : this;
  }
  
  get isOrthogonal() {
    return this.length === 4 && this.reduce((sum, curr, index) => {
      if(!curr.profile.isLinear()) {
        return false;
      }
      if(sum) {
        const prev = this[index === 0 ? 3 : index - 1];
        const tg1 = prev.getTangentAt(prev.endVertex);
        const tg2 = curr.getTangentAt(curr.startVertex);
        sum = Math.abs(tg1.getDirectedAngle(tg2) - 90) < 0.1;
      }
      return sum;
    }, true);
  }
  
  get segments() {
    const res = [];
    for(const edge of this) {
      res.push(...edge.segments);
    }
    return res;
  }

  orthogonalize() {
    const path = new paper.Path({
      insert: false,
      segments: this.segments,
      closed: true,
    });
    const bounds = path.innerBounds();
  }

  /**
   * @summary Ключ цикла
   * @return {String}
   */
  get key() {
    return this.reduce((prev, curr, index) => {
      if(prev) {
        prev += '_';
      }
      return prev + curr.startVertex.key;
    }, '');
  }
}
