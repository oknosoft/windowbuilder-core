
/**
 * Сегмент заполнения
 *
 * содержит информацию о примыкающем профиле и координатах начала и конца
 */
class GlassSegment {

  constructor(profile, b, e, outer) {
    this.profile = profile;
    this.b = b.clone();
    this.e = e.clone();
    this.outer = outer;
    this.segment();
  }

  /**
   * часть конструктора оформлена отдельным методом из-за рекурсии
   */
  segment() {

    let gen;
    const {profile} = this;
    const cond = profile.children.some((addl) => {

      if (addl instanceof ProfileAddl && this.outer == addl.outer) {
        if (!gen) {
          gen = profile.generatrix;
        }
        const b = profile instanceof ProfileAddl ? profile.b : this.b;
        const e = profile instanceof ProfileAddl ? profile.e : this.e;

        // TODO: учесть импосты, привязанные к добору

        if (b.is_nearest(gen.getNearestPoint(addl.b), true) && e.is_nearest(gen.getNearestPoint(addl.e), true)) {
          this.profile = addl;
          this.outer = false;
          return true;
        }
      }
    });

    if (cond) {
      this.segment();
    }
  }

  /**
   * Проверяет наличие соединения по углам в узле
   * @param nodes
   * @param {Array} segments
   * @param {ProfileItem} curr_profile
   * @param {ProfileItem} segm_profile
   * @return {Boolean}
   */
  break_by_angle(nodes, segments, point, offset, curr_profile, segm_profile) {

    const node = nodes.byPoint(point);
    if(!node) {
      return false;
    }

    let tangent = curr_profile.generatrix.getTangentAt(offset);
    if(this.outer) {
      tangent = tangent.negate();
    }

    const angles = [];
    for(const elm of node) {
      if(elm.profile === curr_profile) {
        continue;
      }
      // сравним углы между образующими в точке
      const {generatrix} = elm.profile;
      const ppoint = generatrix.getNearestPoint(point);
      const poffset = generatrix.getOffsetOf(ppoint);
      const ptangent = generatrix.getTangentAt(poffset);
      for(const segm of segments) {
        if(segm.profile === elm.profile && segm.b.is_nearest(ppoint, true)) {
          angles.push({profile: elm.profile, angle: tangent.getDirectedAngle(segm.outer ? ptangent.negate() : ptangent)});
        }
      }
    }
    let angle;
    for(const elm of angles) {
      if(elm.profile === segm_profile && (!angle || elm.angle > angle)) {
        angle = elm.angle;
      }
    }
    if(angle < 0) {
      return true;
    }
    for(const elm of angles) {
      if(elm.profile !== segm_profile && elm.angle > angle) {
        return true;
      }
    }
  }

  /**
   * Выясняет, есть ли у текущего сегмента соединение с соседним
   * @param segm
   * @param point
   * @param nodes
   */
  has_cnn(segm, nodes, segments) {

    // если узлы не совпадают - дальше не смотрим
    const point = segm.b;
    if(!this.e.is_nearest(point, 0)) {
      return false;
    }

    // идём вверх по доборным профилям
    let curr_profile = this.profile;
    let segm_profile = segm.profile;
    while (curr_profile instanceof ProfileAddl) {
      if(!this.outer) {
        this.outer = !curr_profile.is_collinear(curr_profile.parent);
      }
      curr_profile = curr_profile.parent;
    }
    while (segm_profile instanceof ProfileAddl) {
      if(!segm.outer) {
        segm.outer = !segm_profile.is_collinear(segm_profile.parent);
      }
      segm_profile = segm_profile.parent;
    }

    if(curr_profile === segm_profile && (this.profile instanceof ProfileAddl || segm.profile instanceof ProfileAddl)) {
      return false;
    }
    if(curr_profile.gb.is_nearest(point, true)) {
      // проверяем для узла с несколькими профилями
      const by_angle = this.break_by_angle(nodes, segments, point, 0, curr_profile, segm_profile);
      if(by_angle) {
        return false;
      }
      // проверяем для обычного узла
      else if(by_angle === undefined || curr_profile.rays.b.profile === segm_profile) {
        return true;
      }
    }

    if(curr_profile.ge.is_nearest(point, true)) {
      // проверяем для узла с несколькими профилями
      const by_angle = this.break_by_angle(nodes, segments, point, curr_profile.generatrix.length, curr_profile, segm_profile);
      if(by_angle) {
        return false;
      }
      // проверяем для обычного узла
      else if(by_angle === undefined || curr_profile.rays.e.profile === segm_profile) {
        return true;
      }
    }

    if(segm_profile.gb.is_nearest(point, true)) {
      // проверяем для узла с несколькими профилями
      const by_angle = segm.break_by_angle(nodes, segments, point, 0, segm_profile, curr_profile)
      if(by_angle) {
        return false;
      }
      // проверяем для обычного узла
      else if(by_angle === undefined || segm_profile.rays.b.profile == curr_profile) {
        return true;
      }
    }

    if(segm_profile.ge.is_nearest(point, true)) {
      // проверяем для узла с несколькими профилями
      const by_angle = segm.break_by_angle(nodes, segments, point, segm_profile.generatrix.length, segm_profile, curr_profile);
      if(by_angle) {
        return false;
      }
      // проверяем для обычного узла
      else if(by_angle === undefined || segm_profile.rays.e.profile == curr_profile) {
        return true;
      }
    }

    return false;

  }

  get _sub() {
    const {sub_path} = this;
    return {
      get b() {
        return sub_path ? sub_path.firstSegment.point : new paper.Point();
      },
      set b(v) {
        sub_path && (sub_path.firstSegment.point = v);
      },
      get e() {
        return sub_path ? sub_path.lastSegment.point : new paper.Point();
      },
      set e(v) {
        sub_path && (sub_path.lastSegment.point = v);
      },
    };
  }
}

class PointMap extends Map {

  byPoint(point) {
    for(const [key, value] of this) {
      if(point.is_nearest(key, 0)) {
        return value.length > 2 && value;
      }
    }
  }
}

class LayerGroup extends paper.Group {
  save_coordinates(short, save, close) {
    let res = Promise.resolve();
    for (let elm of this.children) {
      res = res.then(() => elm.save_coordinates?.(short, save, close));
    }
    return res;
  }
}

class GroupVisualization extends LayerGroup {
  constructor({owner, ...attr}) {
    const {l_visualization} = owner.project;
    attr.layer = attr.parent = l_visualization;
    super(attr);
    new paper.Group({parent: this, name: 'by_insets'});
    new paper.Group({parent: this, name: 'by_spec'});
    new paper.Group({parent: this, name: 'static'});
    new paper.Group({parent: this, name: 'cnn'});
    new paper.CompoundPath({parent: this, name: '_opening', strokeColor: 'black'});
    new paper.CompoundPath({parent: this, name: '_opening2', strokeColor: 'black', dashArray: [70, 50]});
    this.owner = owner;
    l_visualization.map.set(owner, this);
  }
  
  remove() {
    this.project.l_visualization.map.delete(this.owner);
    super.remove();
  }

  clear() {
    this.children.by_insets.clear();
    this.children.by_spec.clear();
    this.children.static.clear();
    this.children.cnn.clear();
  }

  get cnn() {
    return this.children.cnn;
  }

  get _opening() {
    return this.children._opening;
  }
  get _opening2() {
    return this.children._opening2;
  }
  
  get static() {
    return this.children.static;
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
class GroupSectionals extends LayerGroup {
  
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


