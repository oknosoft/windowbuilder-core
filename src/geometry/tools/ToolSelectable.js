
import {ToolElement} from './ToolElement';

export class ToolSelectable extends ToolElement {

  #raw = {
    mouseStartPos: null,
    hitItem: null,
    originalContent: null,
    originalHandleIn: null,
    originalHandleOut: null,
    changed: false,
    minDistance: 10,
  }

  get parent() {
    return this.project.rootLayer.children.visualization.tool;
  }

  get size() {
    const {zoom} = this.project.view;
    return this._scope.settings.handleSize / (zoom || 1);
  }

  get(attr) {
    if(typeof attr === 'object') {
      for(const fld of attr) {
        attr[fld] = this.#raw[fld];
      }
    }
    else if(typeof attr === 'string') {
      const flds = attr.split(',');
      if(flds.length === 1) {
        attr = this.#raw[attr];
      }
      else {
        attr = {};
        for(const fld of flds) {
          attr[fld] = this.#raw[fld];
        }
      }
    }
    return attr;
  }
  
  set(attr) {
    for(const fld in attr) {
      this.#raw[fld] = attr[fld];
    }
  }
  
  onZoomFit() {
    if(this.#raw.node) {
      this.#raw.node.remove();
    }
    if(this.#raw.line) {
      this.#raw.line.remove();
    }
    const {size, parent} = this;
    this.#raw.node = new paper.Path.Rectangle({
      point: [0, 0],
      size: [size, size],
      opacity: 0.4,
      parent,
      visible: false,
      guide: true,
      strokeColor: 'blue',
      fillColor: 'blue',
      strokeScaling: false,
    });
    this.#raw.line = new paper.Path({
      segments: [[0,0], [1,1]],
      opacity: 0.4,
      parent,
      visible: false,
      guide: true,
      strokeColor: 'blue',
      strokeWidth: 5,
      strokeScaling: false,
      strokeCap: 'round',
    });
  }
  

  hitTest(ev) {
    const {point} = ev;
    const tolerance = 26;
    const {project, canvasCursor} = this;
    this.#raw.hitItem = null;

    if (point) {

      // отдаём предпочтение выделенным ранее элементам
      this.#raw.hitItem = project.hitTest(point, {selected: true, stroke: true, tolerance});

      // во вторую очередь - тем элементам, которые не скрыты
      if (!this.#raw.hitItem) {
        this.#raw.hitItem = project.hitTest(point, {stroke: true, visible: true, tolerance});
      }

      // если мышь около сегмента - ему предпочтение
      let hit = project.hitTest(point, {ends: true, tolerance});
      if (hit) {
        this.#raw.hitItem = hit;
      }

      // Hit test points
      // hit = project.hitPoints(point, 26, true);
      //
      // if (hit) {
      //   if (hit.item.parent instanceof ProfileItem) {
      //     if (hit.item.parent.generatrix === hit.item) {
      //       this.#raw.hitItem = hit;
      //     }
      //   } else {
      //     this.#raw.hitItem = hit;
      //   }
      // }
    }
  }

}
