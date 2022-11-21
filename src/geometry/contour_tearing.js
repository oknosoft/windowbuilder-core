
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

  get profiles() {
    return this.children.filter((elm) => elm instanceof ProfileTearing);
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
