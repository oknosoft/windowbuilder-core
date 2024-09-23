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
    return `Проем №${this.index}`;
  }

  get virtual() {
    return true;
  }
  
}

Contour.Portal = ContourPortal;
