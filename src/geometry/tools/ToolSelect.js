
import paper from 'paper/dist/paper-core';
import {ToolSelectable} from './ToolSelectable';
import {GeneratrixElement} from '../GeneratrixElement';

const {Point} = paper;
const arrowKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];

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
  
  get mover() {
    const {activeLayer, rootLayer} = this.project;
    return rootLayer.selectedProfiles.length ? rootLayer.mover : activeLayer.mover;
  }

  get selectedProfiles() {
    const {activeLayer, rootLayer} = this.project;
    return rootLayer.selectedProfiles.concat(activeLayer.selectedProfiles);
  }

  mousedown(ev) {
    //this.hitTest(ev);
    const {body, activeElement} = document;
    const {project, view, mover} = this;
    const {gridStep, snap} = project.props;
    const hitItem = this.get('hitItem');
    if(activeElement !== body && activeElement.parentNode !== view.element.parentNode) {
      activeElement.blur();
    }
    const {shift, space, control, alt} = ev.modifiers;
    const imitation = this.mode === 'select-imitation';

    this.mode = null;
    this.changed = false;
        
    const select = [];
    const deselect = [];
    this.mouseStartPos = hitItem?.point || ev.point.snap(gridStep);
    this.get('node').visible = false;

    if(hitItem && !alt) {
      

      let item = hitItem.item.parent;
      if(space && item?.nearest) {
        item = item.nearest;
      }

      if(item && ['filling', 'fill', 'stroke'].includes(hitItem.type)) {
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
            if(snap === 'grid') {
              this.mouseStartPos = (hitItem.point || ev.point).snap(gridStep);
            }
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
        // если imitationTarget, назначаем ему выделяемый элемент
        if(imitation && this.imitationTarget && select[0]?.item instanceof GeneratrixElement) {
          this.imitationTarget.raw('imitationOf', select[0]?.item === this.imitationTarget ? null : select[0]?.item);
        }
      }
      else if(hitItem.type === 'segment') {
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
        if(snap === 'grid') {
          this.mouseStartPos = (hitItem.point || ev.point).snap(gridStep);
        }
      }
      else if(hitItem.type === 'handle-in' || hitItem.type === 'handle-out') {
        this.mode = 'move-handle';
        this.originalHandleIn = hitItem.segment.handleIn.clone();
        this.originalHandleOut = hitItem.segment.handleOut.clone();
      }
      else if(hitItem.type === 'dimension') {
        if(!control && !alt) {
          return item.szStart(ev);
        }
        else {
          this._scope.cmd('deselect', [{item: null, shift}]);
          this._scope.cmd('select', [{item}]);
        }        
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
    if(this.mouseStartPos) {
      this.mousePos = snap === 'grid' ? this.mouseStartPos?.snap(gridStep) : this.mouseStartPos.clone();
    }
    else {
      this.mousePos = null;  
    }
    
    deselect.length && this._scope.cmd('deselect', deselect);
    select.length && this._scope.cmd('select', select);

    mover.prepareMovePoints(space ? 'space' : true);
  }

  mouseup(ev) {
    const {mode, project, mover} = this;
    if (mode === 'move-shapes' || mode === 'move-points') {
      if(mover.applyMovePoints()) {
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
      const {props: {gridStep, snap, snapAngle}}  = this.project;
      let delta = point.subtract(this.mouseStartPos);
      if (!modifiers.shift) {
        if(snap === 'angle') {
          delta = delta.snapToAngle(snapAngle); 
        }
        else if(snap === 'grid') {
          delta = delta.snap(gridStep);
        }
      }
      if(delta.length > 8) {
        this.mousePos = point.clone();
        this.mover.tryMovePoints(this.mouseStartPos, delta, modifiers.shift);
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
        if(hitItem.type === 'filling') {
          canvasCursor('cursor-arrow-white-point');
        }
        else if (hitItem.type === 'fill' || hitItem.type === 'stroke') {
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
    const {project, mode} = this;
    const {event: {code, key}, modifiers} = ev;
    if (code === 'Escape' && (mode === 'move-shapes' || mode === 'move-points')) {
      this.mode = null;
      this.mover.cancelMovePoints();
      if(this.mousePos) {
        this.hitTest({point: this.mousePos});
      }
    }
    else if (code === 'Delete') {
      let rm;
      if(mode === 'select-imitation') {
        const {selectedProfiles} = this;
        this.mode === null;
        if(selectedProfiles.length === 1 && selectedProfiles[0].imitationOf) {
          selectedProfiles[0].raw('imitationOf', null);
          rm = true;
          project.props.registerChange();
        }
      }
      else {
        for(const elm of this.selectedProfiles.concat(project.dimensions.children)) {
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
      }
      if(rm) {
        project.redraw();
        this.mousemove(ev);
      }
    }
    else if(arrowKeys.includes(code) || arrowKeys.includes(key)) {
      const {selectedProfiles} = this;
      if(selectedProfiles.length) {
        const {node, line} = this.get('node,line');
        if(node && line) {
          node.visible = false;
          line.visible = false;
        }
        const step = modifiers.shift ? 1 : project.props.gridStep;
        const pt = selectedProfiles[0].generatrix.interiorPoint;
        const delta = new Point();
        if(code === arrowKeys[0] || key === arrowKeys[0]) {
          delta.x = step;
        }
        else if(code === arrowKeys[1] || key === arrowKeys[1]) {
          delta.x = -step;
        }
        else if(code === arrowKeys[2] || key === arrowKeys[2]) {
          delta.y = -step;
        }
        else if(code === arrowKeys[3] || key === arrowKeys[3]) {
          delta.y = step;
        }
        const {mover} = this;
        mover.prepareMovePoints();
        mover.tryMovePoints(pt, delta, modifiers.shift);
        mover.applyMovePoints();
        project.redraw();
      }
    }
    else if(modifiers.control && code === 'KeyI') {
      const {selectedProfiles} = this;
      if(selectedProfiles.length === 1) {
        this.mode = 'select-imitation';
        this.imitationTarget = selectedProfiles[0];
      }
    }
  }
  
  
}
