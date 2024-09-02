
/**
 * Cлой визуализации
 */
class ContourVisualization extends paper.Layer {

  constructor(attr) {
    super(attr);
    this.map = new Map();
  }
  
  clear() {
    for(const [layer, group] of this.map) {
      group.clear();
    }
  }

}

