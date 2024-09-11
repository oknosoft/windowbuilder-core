
import {ToolElement} from './ToolElement';
import {DimensionLine} from '../DimensionLine';
import {Filling} from '../Filling';
import {ContainerBlank} from '../ContainerBlank';
import paper from 'paper/dist/paper-core';

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
  
  hideDecor() {
    if(this.#raw.node) {
      this.#raw.node.visible = false;
      this.#raw.line.visible = false;
      this.#raw.text1.visible = false;
      this.#raw.text2.visible = false;
    }
  }
  
  onZoomFit() {
    if(this.#raw.node) {
      this.#raw.node.remove();
    }
    if(this.#raw.line) {
      this.#raw.line.remove();
    }
    if(this.#raw.text1) {
      this.#raw.text1.remove();
      this.#raw.text2.remove();
    }
    const {size, parent, project} = this;
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
      strokeWidth: 4,
      strokeScaling: false,
      strokeCap: 'round',
    });
    this.#raw.text1 = new paper.PointText({
      opacity: 0.7,
      parent,
      visible: false,
      guide: true,
      fillColor: 'blue',
      fontFamily: project.props.fontFamily(),
      fontSize: project.props.fontSize(),
    });
    this.#raw.text2 = this.#raw.text1.clone();
  }

  hitTestItem(item, point) {
    const tolerance = 26;
    
    // отдаём предпочтение выделенным ранее элементам
    this.#raw.hitItem = item.hitTest(point, {selected: true, stroke: true, tolerance});

    // во вторую очередь - тем элементам, которые не скрыты
    if (!this.#raw.hitItem) {
      this.#raw.hitItem = item.hitTest(point, {stroke: true, visible: true, tolerance});
    }

    // если мышь около сегмента - ему предпочтение
    let hit = item.hitTest(point, {ends: true, tolerance});
    if (hit) {
      this.#raw.hitItem = hit;
    }

    if(this.#raw.hitItem?.type === 'stroke') {
      const {gridStep, snap} = this.project.props;
      if(snap === 'grid') {
        this.#raw.hitItem.point = this.#raw.hitItem.item.snap(this.#raw.hitItem.point, gridStep);
      }
    }

    if(!this.#raw.hitItem) {
      hit = item.hitTest(point, {class: paper.PointText, fill: true, tolerance});
      if(hit?.item?.parent instanceof DimensionLine) {
        this.#raw.hitItem = {...hit, type: 'dimension'};
      }
    }

    if(!this.#raw.hitItem) {
      hit = item.hitTest(point, {fill: true});
      if(hit?.item?.parent instanceof Filling || hit?.item?.parent instanceof ContainerBlank) {
        this.#raw.hitItem = {...hit, type: 'filling'};
      }
      else {
        this.#raw.hitItem = hit;
      }
    }
  }
  
  hitTest(ev) {
    const {point} = ev;
    const {project} = this;
    this.#raw.hitItem = null;

    if (point) {
      this.hitTestItem(project.activeLayer, point);
      if(!this.#raw.hitItem) {
        this.hitTestItem(project, point);
      }
    }
  }

}
