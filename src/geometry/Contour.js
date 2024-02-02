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

  get profiles() {
    return [...this.children.profiles.children];
  }

  get fillings() {
    return [...this.children.fillings.children];
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
    this.#raw.mover.prepareMovePoints(interactive);
  }
  
  tryMovePoints(delta, interactive) {
    this.#raw.mover.tryMovePoints(delta, interactive);
  }
  
  applyMovePoints() {
    this.#raw.mover.applyMovePoints();
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
  }
}
