
import {OwnerObj} from '@oknosoft/metadata/core/src/meta/metaObjs';
import {own} from '@oknosoft/metadata/core/src/meta/symbols';

/**
 * @summary Базовый класс параметров
 * @desc Прячет от прикладного программиста способ хранения значений параметров
 */
class BuilderParams extends OwnerObj {

  /**
   * @summary Возвращает контекст для извлечения значения параметра
   * @return {Object}
   */
  context(origin) {
    return {origin};
  }

  /**
   * @summary Список параметров, используемых элементом, изделием или слоем
   * @return {Array.<CchProperties>}
   */
  get list() {
    return [];
  }

  get(param, origin) {
    return param.contextValue(this.context(origin));
  }
  
  set(param, value) {
    
  }
  
  isDependOf(param) {
    return this.list.includes(param);
  }
}

/**
 * @summary Параметры слоя
 */
export class LayerParams extends BuilderParams {
  context(origin) {
    const layer = this[own];
    const {project, furn, sys, layer: parent} = layer;
    return {origin, layer, project};
  }
}

/**
 * @summary Параметры элемента
 */
export class ElementParams extends BuilderParams {
  
  context(origin) {
    const elm = this[own];
    return {...elm.layer.params.context(origin), elm};
  }

  /**
   * @summary Список параметров, используемых элементом
   * @desc Для профиля, это параметры основной вставки и концевых соединений
   * @return {Array.<CchProperties>}
   */
  get list() {
    return [];
  }
}

/**
 * @summary Параметры узла профиля 
 */
export class ProfileNodeParams extends BuilderParams {
  context(origin) {
    const node = this[own];
    const elm = node.owner;
    return {...elm.params.context(origin), node};
  }
}

/**
 * @summary Параметры вставки в элемент, изделие или слой
 */
export class InsetParams extends BuilderParams {

}

