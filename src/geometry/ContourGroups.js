
import paper from 'paper/dist/paper-core';

class LayerGroup extends paper.Group {
  save_coordinates(short, save, close) {
    for (let elm of this.children) {
      elm.save_coordinates?.(short, save, close);
    }
  }
}

class GroupVisualization extends LayerGroup {
  constructor(attr) {
    super(attr);
    new paper.Group({parent: this, name: 'by_insets'});
    new paper.Group({parent: this, name: 'by_spec'});
  }

  get by_insets() {
    return this.children.by_insets;
  }

  get by_spec() {
    return this.children.by_spec;
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
  new GroupVisualization({parent, name: 'visualization', guide: true});
  new GroupLayers({parent, name: 'topLayers'});
  new GroupProfiles({parent, name: 'profiles'});
  new GroupFillings({parent, name: 'fillings'});
  new GroupLayers({parent, name: 'bottomLayers'});
}
