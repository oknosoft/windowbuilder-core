
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
    const {inheritance, isCalculated} = param;
    const context = this.context(origin);
    // для некоторых параметров, значения живут не в изделии, а в отделе абонента
    if(inheritance === 3) {
      return param.branchValue(context);
    }
    if(inheritance === 5) {
      return param.templateValue(context);
    }
    if(isCalculated) {
      return param.calculatedValue(context);
    }
    return this.eigenvalue(param, origin);
  }

  eigenvalue(param, origin) {
    return null;
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

  eigenvalue(param, origin) {
    const layer = this[own];
    const {project, sys, layer: parent} = layer;
    /*
     * ищем для слоя и если не находим... 
     */
    const prow = sys.furn_params.find({param}) || sys.product_params.find({param}); // sys.params.find({param})
    return prow ? prow.value : param.type.fetchType();
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

  eigenvalue(param, origin) {
    const elm = this[own];
    /*
     * ищем для элемента и если не находим, получаем у слоя 
     */
    return elm.layer.params.eigenvalue(param, origin);
  }
}

/**
 * @summary Параметры узла профиля 
 */
export class ProfileNodeParams extends BuilderParams {
  context(origin) {
    const node = this[own];
    /*
     * ищем для узла и если не находим, получаем у элемента 
     */
    const elm = node.owner;
    return {...elm.params.context(origin), node};
  }

  eigenvalue(param, origin) {
    const node = this[own];
    const elm = node.owner;
    return elm.params.eigenvalue(param, origin);
  }
}

/**
 * @summary Параметры вставки в элемент, изделие или слой
 */
export class InsetParams extends BuilderParams {

}

