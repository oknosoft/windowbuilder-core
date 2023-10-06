
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
    if(!this.project.props.loading) {
      this.skeleton.addProfile(this);
    }
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
