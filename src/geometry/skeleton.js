/**
 * ### Скелет изделия
 * создаётся на время деформаций
 *
 * @module skeleton_rib
 *
 * Created by Evgeniy Malyarov on 23.02.2020.
 */

class Skeleton extends paper.Layer {

  constructor() {
    super();
    this.initialize();
  }

  by_nodes({gb, ge}, layer) {
    for(const rib of this.children) {
      const {b, e, generatrix} = rib;
      if((b.is_nearest(gb) && e.is_nearest(ge)) || (b.is_nearest(ge) && e.is_nearest(gb))) {
        return rib;
      }
      if(layer && generatrix.is_nearest(gb) && generatrix.is_nearest(ge)) {
        return rib;
      }
    }
  }

  // создаёт рёбра по профилям изделия
  initialize() {
    this.selections = [];
    this.nodes = [];
    for(const layer of this.project.layers) {
      if(layer === this) {
        continue;
      }
      layer.visible = false;
      if(layer instanceof ConnectiveLayer || layer instanceof Contour) {
        this.add_ribs(layer);
      }
    }
    this.project.deselectAll();
  }

  add_ribs({contours, profiles, layer}) {
    for(const profile of profiles) {
      const rib = this.by_nodes(profile, layer) || new SkeletonRib({parent: this, profile});
      rib.select_by(profile);
    }
    if(contours) {
      for(const layer of contours) {
        this.add_ribs(layer);
      }
    }
  }

  remove() {
    const {layers} = this.project;
    super.remove();
    for(const layer of layers) {
      layer.visible = true;
    }
  }

}

EditorInvisible.Skeleton = Skeleton;
