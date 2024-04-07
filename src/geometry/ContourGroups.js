
import paper from 'paper/dist/paper-core';
import {LayerGroup, DimensionDrawer} from './DimensionDrawer';

class GroupVisualization extends LayerGroup {
  constructor(attr) {
    super(attr);
    new paper.Group({parent: this, name: 'insets'});
    new paper.Group({parent: this, name: 'spec'});
    new paper.Group({parent: this, name: 'ribs'});
    new paper.Group({parent: this, name: 'graph'});
  }

  get insets() {
    return this.children.insets;
  }

  get spec() {
    return this.children.spec;
  }

  get ribs() {
    return this.children.ribs;
  }
}

class GroupLayers extends LayerGroup {
  get contours() {
    return this.children.filter(v => v instanceof Contour);
  }
}

class GroupProfiles extends LayerGroup {
  get profiles() {
    return this.children;
  }
  on_remove_elm(elm) {
    this.layer.on_remove_elm(elm);
  }
}

class GroupFillings extends LayerGroup {}
class GroupText extends LayerGroup {}

export function contourGroups(parent) {
  new GroupLayers({parent, name: 'bottomLayers'});
  new GroupFillings({parent, name: 'fillings'});
  new GroupProfiles({parent, name: 'profiles'});
  new GroupLayers({parent, name: 'topLayers'});
  new GroupVisualization({parent, name: 'visualization', guide: true});
  new DimensionDrawer({parent, name: 'dimensions'});
  new GroupText({parent: this, name: 'text'});
  
}
