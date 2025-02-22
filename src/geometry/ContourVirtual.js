import paper from 'paper/dist/paper-core';
import {Contour} from './Contour';
import {ProfileVirtual} from './ProfileVirtual';

/**
 * @summary Виртуальный слой
 * @desc Изолирует проём от внешней части проекта
 */
export class ContourVirtual extends Contour {

  ProfileConstructor(attr) {
    return ProfileVirtual;
  }

  get presentation() {
    return `Вирт ${this.index}`;
  }

  get virtual() {
    return true;
  }
  
}

Contour.Virtual = ContourVirtual;
