
import paper from 'paper/dist/paper-core';
import {LayerGroup} from './DimensionDrawer';
import {Containers} from './Containers';

class GroupVisualization extends LayerGroup {
  constructor(attr) {
    super(attr);
    new paper.Group({parent: this, name: 'insets'});
    new paper.Group({parent: this, name: 'spec'});
    new paper.Group({parent: this, name: 'ribs'});
    new paper.Group({parent: this, name: 'graph'});
    new paper.Group({parent: this, name: 'tool'});
    new paper.CompoundPath({parent: this, name: 'opening', strokeColor: 'black'});
    new paper.CompoundPath({parent: this, name: 'opening2', strokeColor: 'black', dashArray: [70, 50]});
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

  get tool() {
    return this.children.tool;
  }

  clear() {
    for(const grp of this.children) {
      grp.removeChildren();
    }
  }

  drawOpening() {
    const {outerEdges, furn, layer} = this.layer;
    const {opening, opening2} = this.children;
    const {openTypes} = project.root.enm;
    // подготавливаем слой для рисования
    opening.removeChildren();
    opening2.removeChildren();
    
    if (!layer || !openTypes.isOpening(furn.open_type)) {
      if (opening?.visible) {
        opening.visible = false;
      }
      if (opening2?.visible) {
        opening2.visible = false;
      }
      return;
    }
    // рисуем направление открывания
    furn.is_sliding ? this.drawSliding(outerEdges, furn) : this.drawRotaryFolding(outerEdges, furn);
  }

  drawRotaryFolding(outerEdges, furn) {
    const {opening, opening2} = this.children;
    const {project: {sketch_view}} = this;

    if(outerEdges.length < furn.side_count) {
      return;
    }
    const cache = {
      profiles: outerEdges,
      bottom: this.layer.profilesBySide('bottom', outerEdges),
    };

    furn.open_tunes.forEach((row) => {
      if (row.rotation_axis) {
        const axis = this.profileByFurnSide(row.side, cache);
        const other = this.profileByFurnSide(
          row.side + 2 <= outerEdges.length ? row.side + 2 : row.side - 2, cache);

        const center = other.rays.inner.getPointAt(other.rays.inner.length / 2);
        opening.moveTo(axis.corns(3));
        opening.lineTo(center);
        opening.lineTo(axis.corns(4));

        if(furn.open_type.is('pendulum')) {
          const loc = axis.generatrix.getLocationAt(0);
          opening2.moveTo(axis.corns(3).add(loc.normal.multiply(-30)));
          opening2.lineTo(center.add(loc.tangent.multiply(40)));
          opening2.moveTo(center.add(loc.tangent.multiply(-40)));
          opening2.lineTo(axis.corns(4).add(loc.normal.multiply(-30)));
        }
      }
    });

    if(furn.open_type.is('pendulum')) {
      opening2.visible = true;
    }
    else {
      if(sketch_view.is('out_hinge') || (opening.is('out') && !sketch_view.is('hinge'))) {
        opening.dashArray = [70, 50];
      }
      else if(opening.dashArray.length) {
        opening.dashArray = [];
      }
    }
    opening.visible = true;
  }

  drawSliding() {

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
  onRemove(elm) {
    this.layer.onRemove(elm);
  }
}

class GroupFillings extends LayerGroup {}


export function contourGroups(parent) {
  new GroupLayers({parent, name: 'bottomLayers'});
  new GroupFillings({parent, name: 'fillings'});
  new GroupProfiles({parent, name: 'profiles'});
  new GroupLayers({parent, name: 'topLayers'});
  new GroupVisualization({parent, name: 'visualization', guide: true});
  Object.defineProperty(parent, 'containers', {value: new Containers(parent)});
}
