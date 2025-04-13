
import {OwnerObj} from '@oknosoft/metadata/core/src/meta/metaObjs';
import {own, alias} from '@oknosoft/metadata/core/src/meta/symbols';

const proxyHandler = {
  get(target, prop, receiver) {
    switch (prop) {
      case 'owner':
        return target;
      case '_manager':
        return target.project;
      default:
        const param = target.project.root.cch.properties.get(prop);
        return target.get(param);
    }
  },
  set(target, prop, value, receiver) {
    const {cch, utils} = target.project.root;
    if(utils.is.guid(prop)) {
      const param = target.project.root.cch.properties.get(prop);
      target.set(param, value);
    }
    return true;
  }
};

/**
 * @summary Базовый класс параметров
 * @desc Прячет от прикладного программиста способ хранения значений параметров
 */
export class BuilderParams extends OwnerObj {
  
  constructor(...attr) {
    super(...attr);
    this.map = new Map();
    this.proxy = new Proxy(this, proxyHandler);
  }

  /**
   * @summary Возвращает контекст для извлечения значения параметра
   * @return {Object}
   */
  context(origin) {
    return {origin};
  }

  /**
   * Текущий проект
   * @type {Scheme}
   */
  get project() {
    let elm = this[own];
    if(!elm.project) {
      elm = elm.owner || elm[own];
    }
    return elm?.project;
  }

  /**
   * Вышестоящий набор параметров
   * @type {BuilderParams}
   */
  get up() {
    return null;
  }

  /**
   * @summary Список параметров, используемых элементом, изделием, соединением или слоем
   * @desc Возвращает набор массивов с учётом группировки
   * @return {Map}
   */
  get list() {
    if(!this._list) {
      this._list = new Map([[0, []]]);
    }
    return this._list;
  }

  appendList(res, tabular) {
    tabular.findRows({hide: false}, ({grouping, param}) => {
      if((!param.isCalculated || param.show_calculated)) {
        // TODO: сокрытие по связям
        if(!res.has(grouping)) {
          res.set(grouping, []);
        }
        const group = res.get(grouping);
        if(!group.includes(param)) {
          group.push(param);
        }
      }
    });
    const sort = this.project.root.utils.sort('sorting_field');
    for(const [key, rows] of res) {
      rows.sort(sort);
    }
    return res;
  }

  get(param, context, origin) {
    const {map, up} = this;
    if(map.has(param)) {
      return map.get(param);
    }
    
    const {inheritance, isCalculated} = param;
    if(!context) {
      context = this.context(origin);
    }
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

    const upValue = up?.get(param, context, origin);
    return upValue === undefined ? this.eigenvalue(param, context, origin) : upValue;
  }

  eigenvalue(param, context, origin) {
    return null;
  }
  
  set(param, value) {
    const {map, up} = this;
    const upValue = up?.get(param);
    if(upValue == value) {
      map.delete(param);
    }
    else {
      map.set(param, param.type.fetchType(value));
    }
  }
  
  isDependOf(param) {
    for(const [key, list] of this.list) {
      if(list.includes(param)) {
        return true;
      }
    }
    return false;
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

  get up() {
    const layer = this[own];
    return layer.layer ? layer.layer.params : layer.project.props;
  }

  get list() {
    const res = new Map();
    const layer = this[own];
    if(layer.level) {
      return this.appendList(res, layer.sys.furn_params);
    }
    else {
      return this.appendList(res, layer.sys.product_params);
    }
  }

  eigenvalue(param, context, origin) {
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

  get up() {
    return this[own].layer.params;
  }

  eigenvalue(param, context, origin) {
    const elm = this[own];
    /*
     * ищем для элемента и если не находим, получаем у слоя 
     */
    return elm.layer.params.eigenvalue(param, context, origin);
  }
  
  cnnII(elm2) {
    const elm = this[own];
    if(!elm.raw('cnnsII')) {
      elm.raw('cnnsII', new WeakMap());
    }
    const map = elm.raw('cnnsII');
    if(!map.has(elm2)) {
      map.set(elm2, new CnnIIParams(elm, elm2));
    }
    return map.get(elm2);
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

  get up() {
    return this[own].owner.params;
  }

  eigenvalue(param, context, origin) {
    return this.up.eigenvalue(param, context, origin);
  }
}

/**
 * @summary Параметры ребра заполнения
 */
export class FillingRibParams extends BuilderParams {
  context(origin) {
    const rib = this[own];
    /*
     * ищем для узла и если не находим, получаем у элемента 
     */
    const elm2 = rib[own];
    const elm = rib.edge.profile;
    return {...elm.params.context(origin), elm2, rib};
  }

  get up() {
    return this[own][own].params;
  }

  eigenvalue(param, context, origin) {
    const rib = this[own];
    /*
     * ищем для ребра и если не находим, получаем у элемента 
     */
    return rib.edge.profile.params.eigenvalue(param, context, origin);
  }
}

export class CnnIIParams extends BuilderParams {

  get up() {
    return this[own].layer.params;
  }
  
  get elm2() {
    return this[alias];
  }
}

/**
 * @summary Параметры вставки в элемент, изделие или слой
 */
export class InsetParams extends BuilderParams {

}

