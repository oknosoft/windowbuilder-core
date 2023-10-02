
import {ToolElement} from './ToolElement';

export class ToolSelect extends ToolElement {

  #raw = {
    name: 'select_node',
    mouseStartPos: null,
    mode: null,
    hitItem: null,
    originalContent: null,
    originalHandleIn: null,
    originalHandleOut: null,
    changed: false,
    minDistance: 10,
    dp: null, //$p.dp.builder_pen.create({grid: 50}),
    input: null,
  }
  
  constructor() {
    super();
    this.on({
      activate: () => this.onActivate('cursor-arrow-white'),
      mousedown: this.mousedown,
      mouseup: this.mouseup,
      mousedrag: this.mousedrag,
      mousemove: this.hitTest,
    });
  }

  mousedown() {
    
  }

  mouseup() {
    
  }

  mousedrag() {
    
  }

  mousemove() {
    
  }

  hitTest({point}) {

    const tolerance = 16;
    const {project, canvasCursor} = this;
    this.hitItem = null;

    if (point) {

      // отдаём предпочтение выделенным ранее элементам
      this.hitItem = project.hitTest(point, {selected: true, stroke: true, tolerance});

      // во вторую очередь - тем элементам, которые не скрыты
      if (!this.hitItem) {
        this.hitItem = project.hitTest(point, {stroke: true, visible: true, tolerance});
      }

      // если мышь около сегмента - ему предпочтение
      let hit = project.hitTest(point, {handles: true, tolerance});
      if (hit) {
        this.hitItem = hit;
      }

      // Hit test points
      // hit = project.hitPoints(point, 26, true);
      //
      // if (hit) {
      //   if (hit.item.parent instanceof ProfileItem) {
      //     if (hit.item.parent.generatrix === hit.item) {
      //       this.hitItem = hit;
      //     }
      //   } else {
      //     this.hitItem = hit;
      //   }
      // }
    }

    const {hitItem} = this;
    if (hitItem) {
      if (hitItem.type == 'fill' || hitItem.type == 'stroke') {
        // if (hitItem.item.parent instanceof DimensionLine) {
        //   // размерные линии сами разберутся со своими курсорами
        // }
        // else if (hitItem.item instanceof PointText) {
        //   !(hitItem.item instanceof EditableText) && canvasCursor('cursor-text');     // указатель с черным Т
        // }
        // else 
        if (hitItem.item.selected) {
          canvasCursor('cursor-arrow-small');
        }
        else {
          canvasCursor('cursor-arrow-white-shape');
        }
      }
      else if (hitItem.type == 'segment' || hitItem.type == 'handle-in' || hitItem.type == 'handle-out') {
        if (hitItem.segment.selected) {
          canvasCursor('cursor-arrow-small-point');
        } else {
          canvasCursor('cursor-arrow-white-point');
        }
      }
    }
    else {
      canvasCursor('cursor-arrow-white');
    }

    return true;
  }
  
}
