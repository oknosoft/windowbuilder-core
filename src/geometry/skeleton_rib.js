/**
 * Ребро скелета
 *
 * @module skeleton_rib
 *
 * Created by Evgeniy Malyarov on 23.02.2020.
 */

class SkeletonRib extends paper.Group {

  constructor({parent, profile}) {
    super({parent});
    const def = {
      parent: this,
      strokeColor: '#333',
      strokeScaling: false,
      guide: true,
    };
    let {generatrix: {segments}, b, e, gb, ge} = profile;
    if(segments.length < 2) {
      this.remove;
      return;
    }
    if(b !== gb || e !== ge) {
      segments = [gb, ...segments, ge];
    }
    this.generatrix = new paper.Path(Object.assign({segments}, def));
    this.pb = new paper.Path.Circle(Object.assign({center: this.b, radius: 30}, def));
    this.pe = new paper.Path.Circle(Object.assign({center: this.e, radius: 30}, def));
  }

  get b() {
    return this.generatrix.firstSegment.point;
  }

  get e() {
    return this.generatrix.lastSegment.point;
  }

  // выделяет само ребро или его узлы, как у родительского элемента
  select_by(profile) {
    if(profile.selected && (!profile.b.selected && !profile.e.selected || profile.b.selected && profile.e.selected)) {
      this.generatrix.strokeColor = '#00c';
      this.generatrix.strokeWidth = 2;
      this.pb.strokeColor = '#00c';
      this.pe.strokeColor = '#00c';
      this.pb.fillColor = '#00c';
      this.pe.fillColor = '#00c';
      this.save_selection(profile);
    }
    else if(profile.b.selected) {
      const pt = this.b.is_nearest(profile.gb) ? 'pb' : 'pe';
      this[pt].strokeColor = '#00c';
      this[pt].fillColor = '#00c';
      this.save_selection(profile);
    }
    else if(profile.e.selected) {
      const pt = this.e.is_nearest(profile.ge) ? 'pe' : 'pb';
      this[pt].strokeColor = '#00c';
      this[pt].fillColor = '#00c';
      this.save_selection(profile);
    }
  }

  save_selection(profile) {
    this.layer.selections.push({profile, selected: profile.selected, b: profile.b.selected, e: profile.e.selected});
  }

}

EditorInvisible.SkeletonRib = SkeletonRib;
