
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
    this.skeleton.addProfile(this);
  }
  
  get skeleton() {
    return this.layer.skeleton;
  }
  
  get generatrix() {
    return this.children.generatrix;
  }
  
  get b() {
    return this.raw('b');
  }

  get e() {
    return this.raw('e');
  }

  get edge() {
    const {b, e} = this;
    return b.vertex.findEdge(e.vertex);
  }
}
