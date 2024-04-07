import paper from 'paper/dist/paper-core';
import {Skeleton} from './graph/Skeleton';
import {Mover} from './graph/Mover';

import {Profile} from './ProfileItem';
import {contourGroups} from './ContourGroups';

export class Contour extends paper.Layer {

  #raw = {};

  constructor(attr) {
    super(attr);
    this.#raw.skeleton = new Skeleton(this);
    this.#raw.mover = new Mover(this);
    contourGroups(this);
  }

  get skeleton() {
    return this.#raw.skeleton;
  }
  
  /**
   * Возвращает массив вложенных контуров текущего контура
   * @memberOf AbstractFilling
   * @instance
   * @type Array.<Contour>
   */
  get contours() {
    const {topLayers, bottomLayers} = this.children; 
    return bottomLayers.children.concat(topLayers.children);
  }

  /**
   * @summary Массив профилей текущего слоя
   * @type {Array.<Profile>}
   */
  get profiles() {
    return [...this.children.profiles.children];
  }

  /**
   * @summary Массив Заполнений текущего слоя
   * @type {Array.<Filling>}
   */
  get fillings() {
    return [...this.children.fillings.children];
  }
  
  /**
   * @summary Габариты по внешним краям профилей контура
   * @type {paper.Rectangle}
   */
  get bounds() {
    return this.children.profiles.bounds;
  }
  

  /**
   * @param {Object} attr - объект со свойствами создаваемого элемента
   *  @param {paper.Point} [attr.b] - координата узла начала элемента
   *  @param {paper.Point} [attr.e] - координата узла конца элемента
   *  @param {paper.Path} [attr.path]
   *  @param {Array.<paper.Segment>} [attr.segments]
   *  @param {String} [attr.pathData]
   */
  createProfile({b, e, path, segments, pathData, ...other}) {
    let generatrix;
    if(path) {
      generatrix = path.clone({insert: false});
    }
    else if(pathData) {
      generatrix = new paper.Path({insert: false, pathData});
    }
    else if(segments) {
      generatrix = new paper.Path({insert: false, segments});
    }
    else if(b && e) {
      generatrix = new paper.Path({insert: false, segments: [b, e]});
    }
    if(!generatrix || generatrix.segments.length < 2) {
      throw new Error('createProfile: No generatrix');
    }
    b = generatrix.firstSegment.point;
    e = generatrix.lastSegment.point;
    if(this.skeleton.checkNodes(b, e)) {
      throw new Error('createProfile: Edge has already been added before');
    }
    generatrix.set({
      layer: this,
      //guide: true,
      strokeColor: 'grey',
      strokeScaling: false,
    });
    // TODO: defaultInset
    const profile = new Profile({
      layer: this,
      parent: this.children.profiles,
      generatrix,
      ...other
    });
    return profile;
  }

  /**
   * @summary Создаёт при необходимости, заполнения в замкнутых областях 
   */
  recalcFillings() {
    
  }

  prepareMovePoints(interactive) {
    return this.#raw.mover.prepareMovePoints(interactive);
  }
  
  tryMovePoints(start, delta, interactive) {
    return this.#raw.mover.tryMovePoints(start, delta, interactive);
  }
  
  applyMovePoints() {
    return this.#raw.mover.applyMovePoints();
  }

  cancelMovePoints() {
    return this.#raw.mover.cancelMovePoints();
  }

  /**
   * @summary Перерисовывает все элементы слоя
   */
  redraw() {
    for(const item of this.profiles) {
      item.redraw?.();
    }
    for(const item of this.fillings) {
      item.redraw?.();
    }
    for(const item of this.contours) {
      item.redraw?.();
    }
    this.drawVisualization();
  }
  
  drawVisualization() {
    const {project, children: {visualization}, skeleton} = this;
    visualization.children.graph.clear();
    if(project.props.carcass) {
      for(const vertex of skeleton.getAllVertices()) {
        new paper.PointText({
          point: vertex.point.add([20, -20]),
          content: vertex.value,
          parent: visualization.children.graph,
          fontSize: 60,
        })
      }
    }
  }
}
