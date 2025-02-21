import {OwnerObj} from '@oknosoft/metadata/core/src/meta/metaObjs';
import {own} from '@oknosoft/metadata/core/src/meta/symbols';
import {FillingRibParams} from './BuilderParams';

export class FillingRib extends OwnerObj {

  constructor(owner, edge) {
    super(owner);
    this.params = new FillingRibParams(this);
    this.edge = edge;
    if(!owner.ribs.includes(this)) {
      owner.ribs.push(this);
    }
  }
  
  remove() {
    const {index} = this;
    if(index > -1) {
      this[own].ribs.splice(index, 1);
    }
  }
  
  get index() {
    return this[own].ribs.indexOf(this);
  }
  
  get next() {
    const {ribs} = this[own];
  }

  get prev() {
    const {ribs} = this[own];
  }
  
  get cnn() {
    const cnns = this[own].project.root.cat.cnns.iiCnns(this[own], this.edge.profile).filter(v => v.art1glass);
    return cnns[0] || null;
  }
  
  get size() {
    return this.cnn?.size?.(this[own], this.edge.profile) || 0;
  }
}
