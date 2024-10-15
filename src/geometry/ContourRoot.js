import paper from 'paper/dist/paper-core';
import {Contour} from './Contour';
import {DimensionDrawer, MapedGroup} from './DimensionDrawer';
import {GeneratrixElement} from './GeneratrixElement';

/**
 * @summary Группа произвольных надписей
 */
class GroupText extends MapedGroup {}

/**
 * @summary Группа визуализации точек
 * @desc К узлам этой сетки, могут привязываться инструменты
 */
class GroupDots extends paper.Group {
  constructor(attr) {
    super(Object.assign(attr, {guide: true}));
    this.symbol = new paper.Symbol(new paper.Path.Rectangle({
      point: [0, 0],
      size: [1, 1],
      strokeColor: 'black',
      guide: true,
      insert: false,
    }));
    this.current = {
      gridStep: 0,
    }
  }
  
  redraw() {
    const {symbol, current, project, children} = this;
    let {props: {gridStep, showGrid}, bounds} = project;
    if(!showGrid) {
      return this.removeChildren();
    }
    if(!bounds) {
      bounds = {left: -1000, right: 1000, top: -1000, bottom: 1000};
    }
    if(showGrid && (!children.length || current.gridStep !== gridStep ||
      current.left > bounds.left + 500 ||
      current.right < bounds.right - 500 ||
      current.top > bounds.top + 500||
      current.bottom < bounds.bottom - 500
    )) {
      current.gridStep = gridStep;
      current.left = bounds.left;
      current.right = bounds.right;
      current.top = bounds.top;
      current.bottom = bounds.bottom;
      this.removeChildren();
      for(let x = bounds.left - 1000; x < bounds.right + 1000; x += gridStep) {
        for(let y = bounds.top - 1000; y < bounds.bottom + 1000 ; y += gridStep) {
          const item = symbol.place(new paper.Point(x, y));
          item.parent = this;
        }
      }
    }
  }
}

/**
 * @summary Слой соединительных профилей и проёмов
 * @desc Корневой слой проекта
 */
export class ContourRoot extends Contour {

  constructor(attr) {
    super(attr);
    new GroupDots({parent: this, name: 'dots'});
    new DimensionDrawer({parent: this, name: 'dimensions'});
    new GroupText({parent: this, name: 'text'});
  }

  ProfileConstructor(attr) {
    if(attr?.elmType?.is('line')) {
      return GeneratrixElement.Line;
    }
    if(attr?.elmType?.is('cut')) {
      return GeneratrixElement.Cut;
    }
    return GeneratrixElement.Connective;
  }
   
  activate() {
    
  }
}

Contour.Root = ContourRoot;
