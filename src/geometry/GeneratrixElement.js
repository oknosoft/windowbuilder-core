
import {BuilderElement} from './BuilderElement';
import {CnnPoint} from './ProfileCnnPoint';

export class GeneratrixElement extends BuilderElement {

  /**
   * @param {Object} attr - объект со свойствами создаваемого элемента
   *  @param {Contour} [attr.layer] - контур (слой), которому принадлежит элемент
   *  @param {BuilderElement} [attr.parent] - родительский элемент, которому принадлежит текущий
   *  @param {BuilderElement} [attr.owner] - элемент - владелец, которому принадлежит текущий
   *  @param {CatInserts} [attr.inset] - вставка элемента. если не указано, будет вычислена по типу элемента
   *  @param {paper.Path} [attr.generatrix] - путь образующей
   *  @param {Object} [attr.cnns] - соединения концов профиля
   *  @param {CatCnns} [attr.cnns.b]
   *  @param {CatCnns} [attr.cnns.e]
   *  @param {CatCnns} [attr.cnns.bOuter]
   *  @param {CatCnns} [attr.cnns.eOuter]
   */
  constructor({generatrix, cnns, ...attr}) {
    super(attr);
    if(generatrix) {
      generatrix.set({parent: this, name: 'generatrix'});
    }
    this.raw('b', new CnnPoint({owner: this, name: 'b', cnn: cnns?.b, cnnOuter: cnns?.bOuter}));
    this.raw('e', new CnnPoint({owner: this, name: 'e', cnn: cnns?.e, cnnOuter: cnns?.eOuter}));
  }
  
  get skeleton() {
    return this.layer.skeleton;
  }

  /**
   * @summary Образующая
   * @desc Вокруг образующей, строится Путь элемента. Здесь может быть линия, простая дуга или безье
   * @type paper.Path
   */
  get generatrix() {
    return this.children.generatrix;
  }
  
  get b() {
    return this.raw('b');
  }

  get e() {
    return this.raw('e');
  }

  /**
   * @summary Расстояние от узла до опорной линии
   * @desc Для сегментов створок и вложенных элементов зависит от ширины элементов и свойств примыкающих соединений,
   * для соединителей и раскладок = 0
   * @type Number
   * @final
   */
  get d0() {
    return 0;
  }

  /**
   * @summary Расстояние от узла до внешнего ребра элемента
   * @desc для рамы, обычно = 0, для импоста 1/2 ширины, зависит от `d0` и `sizeb`
   * @type Number
   * @final
   */
  get d1() {
    return -(this.d0 - this.sizeb);
  }

  /**
   * @summary Расстояние от узла до внутреннего ребра элемента
   * @desc зависит от ширины элементов и свойств примыкающих соединений
   * @type Number
   * @final
   */
  get d2() {
    return this.d1 - this.width;
  }

  /**
   * @summary вспомогательный метод для sizeb
   * @return {Number}
   */
  get_sizeb() {
    const {sizeb} = this.inset;
    if(sizeb === -1100) {
      const {nom} = this;
      return nom ? nom.sizeb : 0;
    }
    else if(sizeb === -1200) {
      return this.width / 2;
    }
    else if(sizeb > 1000) {
      const parts = sizeb.toFixed(); //[для импоста]/[для рамы]
      const p1 = parts.substring(0, 3);
      const {b, e} = this.rays;
      if(b.is_cut() || b.is_t() || b.is_i() || e.is_cut() || e.is_t() || e.is_i()) {
        return parseFloat(p1);
      }
      let p2 = parts.substring(3, 3);
      while (p2.length < 3) {
        p2 += '0';
      }
      return parseFloat(p2);
    }
    return sizeb || 0;
  }

  /**
   * @summary Опорный размер
   * @desc рассчитывается таким образом, чтобы имитировать для вложенных изделий профили родителя
   * @type {Number}
   */
  get sizeb() {
    return this.get_sizeb();
  }

  /**
   * @summary Задаваемое пользователем смещение от образующей
   * @desc Особенно актуально для наклонных элементов а так же, в случае,
   * когда чертёж должен опираться на размеры проёма и отступы, вместо габаритов по профилю
   * @type Number
   */
  get offset() {
    return this._row?.offset || 0;
  }
  set offset(v) {
    const {_row, _attr, selected} = this;
    v = parseFloat(v) || 0;
    if(_row && _row.offset !== v) {
      _row.offset = v;
      /*
      if(selected) {
        this.selected = false;
      }
      const nearests = this.joined_nearests ? this.joined_nearests() : [];
      if(this.joined_imposts) {
        const imposts = this.joined_imposts();
        nearests.push.apply(nearests, imposts.inner.map((v) => v.profile).concat(imposts.outer.map((v) => v.profile)));
      }
      for(const profile of nearests) {
        profile._attr._rays && profile._attr._rays.clear();
      }
      _attr._rays && _attr._rays.clear();
      this.project.register_change(true);
      if(selected) {
        this.selected = true;
      }      
      */
    }
  }

  get imposts() {
    const {b, e} = this;
    const inner = [], outer = [];
    let vertices = b.vertex.getNeighbors();
    while (vertices.length) {
      const tmp = new Set();
      for(const vertex of vertices) {
        for(const cnnPoint of vertex.cnnPoints) {
          if(cnnPoint.isT && cnnPoint.profile === this) {
            inner.push(cnnPoint);
            tmp.add(vertex);
          }          
        }
      }
      vertices.length = 0;
      for(const vertex of Array.from(tmp)) {
        vertices.push(...vertex.getAncestors());
      }      
    }
    // vertices = e.vertex.getAncestors();
    // while (vertices.length) {
    //   const tmp = new Set();
    //   for(const vertex of vertices) {
    //     for(const cnnPoint of vertex.cnnPoints) {
    //       if(cnnPoint.isT && cnnPoint.profile === this) {
    //         outer.push(cnnPoint);
    //         tmp.add(vertex);
    //       }
    //     }
    //   }
    //   vertices.length = 0;
    //   for(const vertex of Array.from(tmp)) {
    //     vertices.push(...vertex.getAncestors());
    //   }
    // }
    return {inner, outer};
  }

  cnnSide(profile, interior) {
    if(!interior) {
      interior = profile.generatrix.interiorPoint;
    }
    return this.generatrix.pointPos(interior, interior);
  }
}
