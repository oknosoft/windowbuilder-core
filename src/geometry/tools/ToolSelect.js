
import {ToolElement} from './ToolElement';
import {GeneratrixElement} from '../GeneratrixElement';

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
  }
  
  constructor() {
    super();
    this.on({
      activate: () => {
        this.onActivate('cursor-arrow-white');
        this.onZoomFit();
      },
      mousedown: this.mousedown,
      mouseup: this.mouseup,
      mousedrag: this.mousedrag,
      mousemove: this.hitTest,
      keydown: this.keydown,
    });
  }

  onZoomFit() {
    if(this.#raw.node) {
      this.#raw.node.remove();
    }
    if(this.#raw.line) {
      this.#raw.line.remove();
    }
    const {zoom} = this.project.view;
    const size = this._scope.settings.handleSize / (zoom || 1);
    this.#raw.node = new paper.Path.Rectangle({
      point: [0, 0],
      size: [size, size],
      opacity: 0.4,
      parent: this.project.rootLayer.children.visualization.tool,
      visible: false,
      guide: true,
      strokeColor: 'blue',
      fillColor: 'blue',
      strokeScaling: false,
    });
    this.#raw.line = new paper.Path({
      segments: [[0,0], [1,1]],
      opacity: 0.4,
      parent: this.project.rootLayer.children.visualization.tool,
      visible: false,
      guide: true,
      strokeColor: 'blue',
      strokeWidth: 5,
      strokeScaling: false,
      strokeCap: 'round',
    });
  }

  mousedown(ev) {
    //this.hitTest(ev);
    const {body, activeElement} = document;
    const {project, view, hitItem} = this;
    if(activeElement !== body && activeElement.parentNode !== view.element.parentNode) {
      activeElement.blur();
    }
    const {shift, space, control, alt} = ev.modifiers;

    this.mode = null;
    this.changed = false;
        
    const select = [];
    const deselect = [];
    this.mouseStartPos = ev.point.clone();
    this.#raw.node.visible = false;

    if(hitItem && !alt) {
      

      let item = hitItem.item.parent;
      if(space && item?.nearest?.()) {
        item = item.nearest();
      }

      if(item && (hitItem.type == 'fill' || hitItem.type == 'stroke')) {
        if(shift) {
          if(item.selected) {
            deselect.push({item, node: null, shift});
          }
          else {
            select.push({item, node: null, shift});
          }
        }
        else {
          deselect.push({item: null, shift});
          select.push({item, node: null, shift});
        }
        if(select.length) {
          // при зажатом {Ctrl}, выделяем группу
          if(control) {
            if(item instanceof GeneratrixElement) {
              for(const profile of item.layer.profiles) {
                if(profile !== item) {
                  select.push({item: profile, node: null, shift});
                }
              }
            }
            // else if (item instanceof Filling) {
            //   for(const glass of project.glasses) {
            //     if(glass !== item) {
            //       select.push({elm: glass.elm, node: null, shift});
            //     }
            //   }
            // }
          }
          this.mode = 'move-shapes';
          this.mouseStartPos = hitItem.point.clone();
        }
        else if(deselect.length) {
          if(control) {
            if(item instanceof GeneratrixElement) {
              for(const profile of item.layer.profiles) {
                if(profile !== item) {
                  deselect.push({item: profile, node: null, shift});
                }
              }
            }
            // else if (item instanceof Filling) {
            //   for(const glass of project.glasses) {
            //     if(glass !== item) {
            //       deselect.push({elm: glass.elm, node: null, shift});
            //     }
            //   }
            // }
          }
        }
      }
      else if(hitItem.type == 'segment') {
        const node = item.generatrix.firstSegment.point.isNearest(hitItem.segment.point, true) ? 'b' : 'e';
        if(shift) {
          if(hitItem.segment.selected) {
            deselect.push({item, node, shift});
          }
          else {
            select.push({item, node, shift});
          }
        }
        else {
          if(!hitItem.segment.selected) {
            deselect.push({item: null, shift});
            select.push({item, node, shift});
          }
        }
        this.mode = 'move-points';
        this.mouseStartPos = hitItem.point.clone();
      }
      else if(hitItem.type == 'handle-in' || hitItem.type == 'handle-out') {
        this.mode = 'move-handle';
        this.originalHandleIn = hitItem.segment.handleIn.clone();
        this.originalHandleOut = hitItem.segment.handleOut.clone();
      }

      // подключаем диалог свойств элемента
      // if(item instanceof ProfileItem || item instanceof Filling) {
      //   eve.emit_async('elm_activated', item);
      //   this.profile = item;
      // }

      //this._scope.clear_selection_bounds();

    }
    else if(hitItem && alt) {
      this._scope.cmd('deselect', [{item: null, shift}]);
      this._scope.cmd('select', [{item: hitItem.item.layer}]);
    }
    else {
      // Clicked on and empty area, engage box select.
      this.mode = 'box-select';
      
      if(!control && !shift) {
        this._scope.cmd('deselect', [{item: null, shift}]);
      }

      if(!shift && this.profile) {
        delete this.profile;
      }

    }
    this.mousePos = this.mouseStartPos?.clone() || null;
    
    deselect.length && this._scope.cmd('deselect', deselect);
    select.length && this._scope.cmd('select', select);

    this.project.activeLayer.mover.prepareMovePoints(space ? 'space' : true);
  }

  mouseup(ev) {
    const {mode, project} = this;
    if (mode === 'move-shapes' || mode === 'move-points') {
      if(project.activeLayer.mover.applyMovePoints()) {
        project.props.registerChange();
        project.redraw();
      }
    }
    this.mode = null;
    this.mouseStartPos = null;
    this.mousePos = null;
    this.hitTest(ev);
  }

  mousedrag(ev) {
    if (this.mode === 'move-shapes' || this.mode === 'move-points') {
      let delta = ev.point.subtract(this.mouseStartPos);
      if (!ev.modifiers.shift) {
        delta = delta.snapToAngle();
      }
      if(delta.length > 8) {
        this.mousePos = ev.point.clone();
        this.project.activeLayer.mover.tryMovePoints(this.mouseStartPos, delta);
      }
    }
  }

  keydown(ev) {
    const {project, mode, _scope} = this;
    const {event: {code, target}, modifiers} = ev;
    if (code === 'Escape' && (mode === 'move-shapes' || mode === 'move-points')) {
      this.mode = null;
      project.activeLayer.mover.cancelMovePoints();
      if(this.mousePos) {
        this.hitTest({point: this.mousePos});
      }
    }
    else if (code === 'Delete') {
      for(const elm of project.activeLayer.profiles) {
        if(elm.selected) {
          try{
            elm.remove();
          }
          catch (err) {
            alert(err.message);
          }
        }
      }
    }
  }

  hitTest(ev) {
    const {point} = ev;
    const tolerance = 26;
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
      let hit = project.hitTest(point, {ends: true, tolerance});
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
    const {node, line} = this.#raw;
    if(node && line) {
      node.visible = false;
      line.visible = false;
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
          line.removeSegments();
          line.addSegments(hitItem.item.segments.map(({point, handleIn, handleOut}) => ({point, handleIn, handleOut})));
          line.visible = true;
        }
        else if (hitItem.type == 'segment' || hitItem.type == 'handle-in' || hitItem.type == 'handle-out') {
          node.position = hitItem.point.clone();
          node.visible = true;
          if (hitItem.segment.selected) {
            canvasCursor('cursor-arrow-small-point');
          }
          else {
            canvasCursor('cursor-arrow-white-point');
          }
        }
      }
      else {
        canvasCursor('cursor-arrow-white');
      }
    }

    return true;
  }
  
}
