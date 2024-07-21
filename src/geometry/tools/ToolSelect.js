
import paper from 'paper/dist/paper-core';
import {ToolSelectable} from './ToolSelectable';
import {GeneratrixElement} from '../GeneratrixElement';
import {Filling} from '../Filling';

const {Point} = paper;

export class ToolSelect extends ToolSelectable {
  
  constructor() {
    super();
    this.name = 'select_node';
    this.on({
      activate: () => {
        this.onActivate('cursor-arrow-white');
        this.onZoomFit();
      },
      mousedown: this.mousedown,
      mouseup: this.mouseup,
      mousedrag: this.mousedrag,
      mousemove: this.mousemove,
      keydown: this.keydown,
    });
  }

  mousedown(ev) {
    //this.hitTest(ev);
    const {body, activeElement} = document;
    const {project, view} = this;
    const {gridStep} = project.props;
    const hitItem = this.get('hitItem');
    if(activeElement !== body && activeElement.parentNode !== view.element.parentNode) {
      activeElement.blur();
    }
    const {shift, space, control, alt} = ev.modifiers;

    this.mode = null;
    this.changed = false;
        
    const select = [];
    const deselect = [];
    this.mouseStartPos = ev.point.snap(gridStep);
    this.get('node').visible = false;

    if(hitItem && !alt) {
      

      let item = hitItem.item.parent;
      if(space && item?.nearest?.()) {
        item = item.nearest();
      }

      if(item && (hitItem.type == 'fill' || hitItem.type == 'stroke' || hitItem.type == 'filling')) {
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
          if(item instanceof GeneratrixElement) {
            this.mode = 'move-shapes';
            this.mouseStartPos = hitItem.point.snap(gridStep);
          }
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
        this.mouseStartPos = hitItem.point.snap(gridStep);
      }
      else if(hitItem.type == 'handle-in' || hitItem.type == 'handle-out') {
        this.mode = 'move-handle';
        this.originalHandleIn = hitItem.segment.handleIn.clone();
        this.originalHandleOut = hitItem.segment.handleOut.clone();
      }
      else if(hitItem.type == 'dimension') {
        return item.szStart(ev);
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
    this.mousePos = this.mouseStartPos?.snap(gridStep) || null;
    
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
    this.mousemove(ev);
  }

  mousedrag({modifiers, point}) {
    if (this.mode === 'move-shapes' || this.mode === 'move-points') {
      const {props: {gridStep}, activeLayer}  = this.project;
      let delta = point.subtract(this.mouseStartPos);
      if (!modifiers.shift) {
        delta = delta.snapToAngle().snap(gridStep);
      }
      if(delta.length > 8) {
        this.mousePos = point.clone();
        activeLayer.mover.tryMovePoints(this.mouseStartPos, delta, modifiers.shift);
      }
    }
  }

  mousemove(ev) {
    this.hitTest(ev);
    const {canvasCursor} = this;
    const {hitItem, node, line} = this.get('hitItem,node,line');
    if(node && line) {
      node.visible = false;
      line.visible = false;
      if (hitItem) {
        if(hitItem.type == 'filling') {
          canvasCursor('cursor-arrow-white-point');
        }
        else if (hitItem.type == 'fill' || hitItem.type == 'stroke') {
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
  }

  keydown(ev) {
    const {project, mode, _scope} = this;
    const {event: {code, key, target}, modifiers} = ev;
    const {activeLayer} = project;
    const arrow = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
    if (code === 'Escape' && (mode === 'move-shapes' || mode === 'move-points')) {
      this.mode = null;
      activeLayer.mover.cancelMovePoints();
      if(this.mousePos) {
        this.hitTest({point: this.mousePos});
      }
    }
    else if (code === 'Delete') {
      let rm;
      for(const elm of activeLayer.profiles) {
        if(elm.selected) {
          try{
            elm.remove();
          }
          catch (err) {
            alert(err.message);
          }
          rm = true;
        }
      }
      if(rm) {
        project.redraw();
        this.mousemove(ev);
      }
    }
    else if(arrow.includes(code) || arrow.includes(key)) {
      const profiles = activeLayer.profiles.filter(p => p.selected);
      if(profiles.length) {
        const {node, line} = this.get('node,line');
        if(node && line) {
          node.visible = false;
          line.visible = false;
        }
        const step = modifiers.shift ? 1 : project.props.gridStep;
        const pt = profiles[0].generatrix.interiorPoint;
        const delta = new Point();
        if(code === arrow[0] || key === arrow[0]) {
          delta.x = step;
        }
        else if(code === arrow[1] || key === arrow[1]) {
          delta.x = -step;
        }
        else if(code === arrow[2] || key === arrow[2]) {
          delta.y = -step;
        }
        else if(code === arrow[3] || key === arrow[3]) {
          delta.y = step;
        }
        activeLayer.mover.prepareMovePoints();
        activeLayer.mover.tryMovePoints(pt, delta, modifiers.shift);
        activeLayer.mover.applyMovePoints();
        project.redraw();
      }
    }
  }
  
}
