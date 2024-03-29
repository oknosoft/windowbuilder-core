
/**
 * @summary Область разрыва заполнения
 * @desc В ней живут профили разрыва (образуют замкнутую фигуру) и вложенное заполнение
 */
class ContourTearing extends Contour {

  get ProfileConstructor() {
    return ProfileTearing;
  }

  get path() {
    return this.bounds;
  }
  set path(attr) {
    
  }

  /**
   * Путь внешних рёбер профилей разрыва
   * @return {paper.Path}
   */
  get profile_path() {
    const path = new paper.Path({insert: false});
    for(const profile of this.profiles) {
      if(!profile.elm_type.is('impost')) {
        // добавляем сегменты образующей
        path.addSegments(profile.generatrix.segments);
      }
    }
    return path;
  }

  get glass_path() {
    return new paper.Path({insert: false});
  }

  get profiles() {
    return this.children.filter((elm) => elm instanceof ProfileTearing);
  }

  presentation(bounds) {
    if(!bounds){
      bounds = this.bounds;
    }
    const {left, bottom} = this.profiles_by_side();
    return `Разрыв №${this.cnstr} ` +
      (bounds ? ` ${bounds.width.toFixed()}х${bounds.height.toFixed()} ` : '') +
      (left ? `X=${Math.min(left.x1, left.x2).toFixed()} Y=${Math.min(bottom.y1, bottom.y2).toFixed()}` : ``);
  }

  initialize({inset, clr, path, parent}) {
    this.dop = {parent: parent.elm};
    const proto = {elm_type: $p.enm.elm_types.tearing, inset, clr};
    for(const curr of path.curves) {
      const profile = new ProfileTearing({
        generatrix: new paper.Path({segments: [curr.segment1, curr.segment2]}),
        proto,
        parent: this,
      });
      profile.elm;
    }
  }
  
}

EditorInvisible.ContourTearing = ContourTearing;
