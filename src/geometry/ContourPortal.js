import paper from 'paper/dist/paper-core';
import {Contour} from './Contour';
import {ProfilePortal} from './ProfilePortal';

/**
 * @summary Виртуальный слой
 * @desc Изолирует проём от внешней части проекта
 */
export class ContourPortal extends Contour {

  ProfileConstructor(attr) {
    return ProfilePortal;
  }

  get level() {
    return -1;
  }

  get presentation() {
    return `Проем ${this.index}`;
  }

  get virtual() {
    return true;
  }

  /**
   * @summary Добавляет профили вокруг дочерних слоёв
   */
  addProfiles(contours) {
    const {topLayers} = this.children; 
    for(const contour of contours) {
      contour.parent = topLayers;
    }
    for(const contour of contours) {
      for(const profile of contour.outerProfiles) {

      }
    }
  }

  /**
   * @summary Удаляет слой из иерархии родителя
   */
  remove() {
    const {profiles, project} = this;
    for(const contour of this.contours) {
      for(const profile of contour.profiles) {
        if(profiles.includes(profile.nearest)) {
          profile.nearest = null;
        }
      }
      contour._parent = null;
      project.layers.push(contour);
    }
    const {topLayers, bottomLayers} = this.children;
    topLayers.children.length = 0;
    bottomLayers.children.length = 0;
    // собственно, удаляем
    super.remove();
  }
  
}

Contour.Portal = ContourPortal;
