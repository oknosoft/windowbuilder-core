
/*
 * Вспомогательные классы для формирования размерных линий
 *
 * Created by Evgeniy Malyarov on 12.05.2017.
 *
 * @module geometry
 * @submodule dimension_drawer
 */

class DimensionGroup {

  clear() {
    for (let key in this) {
      this[key].removeChildren();
      this[key].remove();
      delete this[key];
    }
  }

  has_size(size) {
    for (let key in this) {
      const {path} = this[key];
      if(path && Math.abs(path.length - size) < 1) {
        return true;
      }
    }
  }

  sizes() {
    const res = [];
    for (let key in this) {
      if(this[key].visible) {
        res.push(this[key]);
      }
    }
    return res;
  }

}

/**
 * Служебный слой размерных линий  
 * Унаследован от [paper.Layer](http://paperjs.org/reference/layer/)
 *
 * @extends paper.Layer
 */
class DimensionLayer extends paper.Layer {

  get bounds() {
    return this.project.bounds;
  }

  get owner_bounds() {
    return this.bounds;
  }

  get dimension_bounds() {
    return this.project.dimension_bounds;
  }

  /**
   * @summary Создаёт и перерисовавает габаритные линии изделия
   * @desc Отвечает только за габариты изделия
   * Авторазмерные линии контуров и пользовательские размерные линии, контуры рисуют самостоятельно
   *
   */
  draw_sizes() {

    const {bounds, builder_props, contours} = this.project;

    if(bounds && builder_props.auto_lines && contours.some((l) => l.visible && !l.hidden)) {

      if(!this.bottom) {
        this.bottom = new DimensionLine({
          pos: 'bottom',
          parent: this,
          offset: -120
        });
      }
      else {
        this.bottom.offset = -120;
      }

      if(!this.right) {
        this.right = new DimensionLine({
          pos: 'right',
          parent: this,
          offset: -120
        });
      }
      else {
        this.right.offset = -120;
      }


      // если среди размеров, сформированных контурами есть габарит - второй раз не выводим

      if(contours.some((l) => l.l_dimensions.children.some((dl) =>
        dl.pos == 'right' && Math.abs(dl.size - bounds.height) < consts.sticking_l))) {
        this.right.visible = false;
      }
      else {
        this.right.redraw();
      }

      if(contours.some((l) => l.l_dimensions.children.some((dl) =>
        dl.pos == 'bottom' && Math.abs(dl.size - bounds.width) < consts.sticking_l))) {
        this.bottom.visible = false;
      }
      else {
        this.bottom.redraw();
      }
    }
    else {
      if(this.bottom) {
        this.bottom.visible = false;
      }
      if(this.right) {
        this.right.visible = false;
      }
    }
  }

}

/**
 * Построитель авторазмерных линий
 *
 * @extends paper.Group
 * @param attr
 * @param attr.parent - {paper.Item}, родитель должен иметь свойства profiles_by_side(), is_pos(), profiles, imposts
 */
class DimensionDrawer extends paper.Group {

  constructor(attr) {
    super(attr);
    this.ihor = new DimensionGroup();
    this.ivert = new DimensionGroup();
  }

  /**
   * Стирает размерные линии
   */
  clear(local) {

    this.ihor?.clear();
    this.ivert?.clear();

    for (const pos of ['bottom', 'top', 'right', 'left']) {
      if(this[pos]) {
        this[pos].removeChildren();
        this[pos].remove();
        this[pos] = null;
      }
    }
    
    if(!local) {
      this.layer?.layer?.l_dimensions?.clear();
    }
  }

  /**
   * формирует авторазмерные линии
   */
  redraw(forse) {

    const {parent, project: {builder_props}} = this;
    
    if(!forse) {
      forse = parent.show_dimensions;
    }

    if(!forse) {
      this.clear(true);
    }
    else if(forse || !builder_props.auto_lines) {
      this.clear();
    }

    // сначала, перерисовываем размерные линии вложенных контуров, чтобы получить отступы
    const {contours} = parent;
    if(contours) {
      for (let chld of contours) {
        chld.l_dimensions.redraw();
      }
    }

    // для внешних контуров строим авторазмерные линии
    if(builder_props.auto_lines && forse) {

      const {ihor, ivert, by_side} = this.imposts();
      if(!Object.keys(by_side).length) {
        return this.clear();
      }

      // подмешиваем импосты вложенных контуров
      const our_profiles = parent.profiles;
      const profiles = new Set(our_profiles);
      parent.imposts.forEach((elm) => elm.visible && profiles.add(elm));

      for (let elm of profiles) {

        // получаем точки начала и конца элемента
        const our = our_profiles.includes(elm);
        const eb = our ? (elm instanceof GlassSegment ? elm._sub.b : elm.b) : elm.rays.b.npoint;
        const ee = our ? (elm instanceof GlassSegment ? elm._sub.e : elm.e) : elm.rays.e.npoint;

        this.push_by_point({ihor, ivert, eb, ee, elm});

        if(!parent.layer && elm.nearest() instanceof ProfileConnective) {
          this.push_by_point({ihor, ivert, eb: elm.c1, ee: elm.c2, elm});
        }
        
      }

      // для ihor добавляем по вертикали
      if(ihor.length > 2) {
        ihor.sort((a, b) => b.point - a.point);
        if(parent.is_pos('right') || (forse && !parent.is_pos('left'))) {
          this.by_imposts(ihor, this.ihor, 'right');
        }
        else if(parent.is_pos('left')) {
          this.by_imposts(ihor, this.ihor, 'left');
        }
      }
      else {
        ihor.length = 0;
      }

      // для ivert добавляем по горизонтали
      if(ivert.length > 2) {
        ivert.sort((a, b) => a.point - b.point);
        if(parent.is_pos('bottom') || (forse && !parent.is_pos('top'))) {
          this.by_imposts(ivert, this.ivert, 'bottom');
        }
        else if(parent.is_pos('top')) {
          this.by_imposts(ivert, this.ivert, 'top');
        }
      }
      else {
        ivert.length = 0;
      }

      // далее - размерные линии контура
      this.by_contour(ihor, ivert, forse, by_side);

    }

    // перерисовываем размерные линии текущего контура
    for (let dl of this.children) {
      dl.redraw && dl.redraw();
    }

  }

  push_by_point({ihor, ivert, eb, ee, elm}) {
    if(eb && ihor.every((v) => v.point != eb.y.round())) {
      ihor.push({
        point: eb.y.round(),
        elm: elm,
        p: eb._name || 'b'
      });
    }
    if(ee && ihor.every((v) => v.point != ee.y.round())) {
      ihor.push({
        point: ee.y.round(),
        elm: elm,
        p: ee._name || 'e'
      });
    }
    if(eb && ivert.every((v) => v.point != eb.x.round())) {
      ivert.push({
        point: eb.x.round(),
        elm: elm,
        p: eb._name || 'b'
      });
    }
    if(ee && ivert.every((v) => v.point != ee.x.round())) {
      ivert.push({
        point: ee.x.round(),
        elm: elm,
        p: ee._name || 'e'
      });
    }
  }

  /**
   * Формирует пользовательские линии по импостам
   */
  draw_by_imposts() {
    const {parent} = this;
    this.clear();

    // для всех палок контура
    // если на палке есть импосты, добавляем точки
    let index = 0;
    for (let elm of parent.profiles) {

      const {inner, outer} = elm.joined_imposts();
      const {generatrix, angle_hor} = elm;
      generatrix.visible = false;
      const imposts = inner.concat(outer);
      if(!imposts.length) {
        continue;
      }
      elm.mark_direction();
      let invert = angle_hor > 135 && angle_hor < 315;
      for(const impost of imposts) {
        const {point, profile: {rays, nom}} = impost;
        const pi = generatrix.intersect_point(rays.inner, point);
        const po = generatrix.intersect_point(rays.outer, point);
        const dx = generatrix.getOffsetOf(point);
        const dxi = generatrix.getOffsetOf(pi);
        const dxo = generatrix.getOffsetOf(po);
        let dx1, dx2;
        if(dx > dxi) {
          dx1 = dxi + nom.sizefaltz;
          dx2 = dxo - nom.sizefaltz;
        }
        else {
          dx1 = dxo + nom.sizefaltz;
          dx2 = dxi - nom.sizefaltz;
        }

        this.ihor[`i${++index}`] = new DimensionLineImpost({
          elm1: elm,
          elm2: elm,
          p1: invert ? dx : 'b',
          p2: invert ? 'b' : dx,
          dx1,
          dx2,
          parent: this,
          offset: invert ? -150 : 150,
          outer: outer.includes(impost),
        });
      }
    }

    // далее - размерные линии контура
    this.by_contour([], [], true);

    // перерисовываем размерные линии текущего контура
    for (let dl of this.children) {
      dl.redraw && dl.redraw();
    }

  }

  /**
   * Формирует линии по импостам по раскладкам
   */
  draw_by_falsebinding() {
    const {parent} = this;
    this.clear();

    const {ihor, ivert, by_side} = this.imposts();
    
    function crossing(elm, imposts) {
      for(const other of imposts) {
        if(other !== elm && other.generatrix.getCrossings(elm.generatrix).length) {
          return true;
        }
      }
    }

    for(const filling of parent.fillings) {
      if(!filling.visible) {
        continue;
      }
      const {path, imposts} = filling;
      for(const elm of imposts) {
        let {b: eb, e: ee} = elm;
        // если точка не на границе заполнения и импост имеет пересечения
        if(path.is_nearest(eb) && crossing(elm, imposts)) {
          eb = null;
        }
        if(path.is_nearest(ee) && crossing(elm, imposts)) {
          ee = null;
        }
        if(eb || ee) {
          this.push_by_point({ihor, ivert, eb, ee, elm});
        }
      }
    }

    // далее - размерные линии контура
    this.by_contour([], [], true, by_side);

    // для ihor добавляем по вертикали
    if(ihor.length > 2) {
      ihor.sort((a, b) => b.point - a.point);
      this.by_base(ihor, this.ihor, 'left');
    }
    else {
      ihor.length = 0;
    }

    // для ivert добавляем по горизонтали
    if(ivert.length > 2) {
      ivert.sort((a, b) => a.point - b.point);
      this.by_base(ivert, this.ivert, 'top');
    }
    else {
      ivert.length = 0;
    }

    // перерисовываем размерные линии текущего контура
    for (let dl of this.children) {
      dl.redraw && dl.redraw();
    }
  }

  /**
   * Формирует размерные линии импоста
   */
  by_imposts(arr, collection, pos) {
    let {base_offset, dop_offset} = consts;
    const {_regions} = this.project._attr;
    if(_regions) {
      base_offset += 80;
      dop_offset = base_offset + 40;
    }
    const offset = (pos == 'right' || pos == 'bottom') ? -dop_offset : base_offset;
    for (let i = 0; i < arr.length - 1; i++) {
      if(!collection[i]) {
        const prev = collection[i - 1];
        let shift = 0;
        if(prev && prev._attr.shift !== base_offset * 2) {
          shift = (Math.abs(arr[i].point - arr[i + 1].point) < base_offset) ? base_offset : 0;
          if(shift && prev._attr.shift) {
            shift += base_offset;
          }
        }
        collection[i] = new DimensionLine({
          pos: pos,
          elm1: arr[i].elm instanceof GlassSegment ? arr[i].elm._sub : arr[i].elm,
          p1: arr[i].p,
          elm2: arr[i + 1].elm instanceof GlassSegment ? arr[i + 1].elm._sub : arr[i + 1].elm,
          p2: arr[i + 1].p,
          parent: this,
          offset: offset - shift,
          impost: true
        });
        collection[i]._attr.shift = shift;
      }
    }
  }

  /**
   * Формирует размерные линии от габарита
   */
  by_base(arr, collection, pos) {
    let {base_offset, dop_offset} = consts;
    let offset = (pos == 'right' || pos == 'bottom') ? -dop_offset : base_offset;
    for (let i = 1; i < arr.length - 1; i++) {
      if(!collection[i - 1]) {
        collection[i - 1] = new DimensionLine({
          pos: pos,
          elm1: arr[0].elm instanceof GlassSegment ? arr[0].elm._sub : arr[0].elm,
          p1: arr[0].p,
          elm2: arr[i].elm instanceof GlassSegment ? arr[i].elm._sub : arr[i].elm,
          p2: arr[i].p,
          parent: this,
          offset: offset,
          impost: true
        });
        offset += base_offset;
      }
    }
  }

  /**
   * Формирует размерные линии контура
   */
  by_contour(ihor, ivert, forse, by_side) {

    const {project, parent} = this;
    const {bounds} = parent;
    let {base_offset, dop_offset} = consts;
    const {_regions} = this.project._attr;
    if(_regions) {
      base_offset += 60;
      dop_offset = base_offset + 40;
    }

    if(project.contours.length > 1 || forse) {

      if(parent.is_pos('left') && !parent.is_pos('right') && project.bounds.height != bounds.height) {
        if(!this.ihor.has_size(bounds.height)) {
          if(!this.left) {
            this.left = new DimensionLine({
              pos: 'left',
              parent: this,
              offset: base_offset + (ihor.length > 2 ? dop_offset : 0),
              contour: true
            });
          }
          else {
            this.left.offset = base_offset + (ihor.length > 2 ? dop_offset : 0);
          }
        }
      }
      else {
        if(this.left) {
          this.left.remove();
          this.left = null;
        }
      }

      if(parent.is_pos('right') && (project.bounds.height != bounds.height || forse)) {
        if(!this.ihor.has_size(bounds.height)) {
          if(!this.right) {
            this.right = new DimensionLine({
              pos: 'right',
              parent: this,
              offset: ihor.length > 2 ? -dop_offset * 2 : -dop_offset,
              contour: true
            });
          }
          else {
            this.right.offset = ihor.length > 2 ? -dop_offset * 2 : -dop_offset;
          }
        }
      }
      else {
        if(this.right) {
          this.right.remove();
          this.right = null;
        }
      }

      if(parent.is_pos('top') && !parent.is_pos('bottom') && project.bounds.width != bounds.width) {
        if(!this.ivert.has_size(bounds.width)) {
          if(!this.top) {
            this.top = new DimensionLine({
              pos: 'top',
              parent: this,
              offset: base_offset + (ivert.length > 2 ? dop_offset : 0),
              contour: true
            });
          }
          else {
            this.top.offset = base_offset + (ivert.length > 2 ? dop_offset : 0);
          }
        }
      }
      else {
        if(this.top) {
          this.top.remove();
          this.top = null;
        }
      }

      if(parent.is_pos('bottom') && (project.bounds.width != bounds.width || forse)) {
        if(!this.ivert.has_size(bounds.width)) {
          if(!this.bottom) {
            this.bottom = new DimensionLine({
              pos: 'bottom',
              parent: this,
              offset: ivert.length > 2 ? -dop_offset * 2 : -dop_offset,
              contour: true
            });
          }
          else {
            this.bottom.offset = ivert.length > 2 ? -dop_offset * 2 : -dop_offset;
          }
        }
      }
      else {
        if(this.bottom) {
          this.bottom.remove();
          this.bottom = null;
        }
      }

    }

    if(forse === 'faltz') {
      this.by_faltz(ihor, ivert, by_side);
    }
  }

  /**
   * Формирует размерные линии контура по фальцу
   */
  by_faltz(ihor, ivert, by_side) {
    const {base_offset} = consts;
    if (!this.left) {
      this.left = new DimensionLine({
        pos: 'left',
        parent: this,
        offset: base_offset,
        contour: true,
        faltz: (by_side.top.nom.sizefurn + by_side.bottom.nom.sizefurn) / 2,
      });
    }
    if(!this.top) {
      this.top = new DimensionLine({
        pos: 'top',
        parent: this,
        offset: base_offset,
        contour: true,
        faltz: (by_side.left.nom.sizefurn + by_side.right.nom.sizefurn) / 2,
      });
    }
  }

  imposts() {

    const {parent} = this;
    const {bounds} = parent;

    const by_side = parent.profiles_by_side();
    if(!Object.keys(by_side).length) {
      return {ihor: [], ivert: [], by_side: {}};
    }

    // сначала, строим размерные линии импостов
    // получаем все профили контура, делим их на вертикальные и горизонтальные
    const ihor = [
      {
        point: bounds.top.round(),
        elm: by_side.top,
        p: by_side.top.b.y < by_side.top.e.y ? 'b' : 'e'
      },
      {
        point: bounds.bottom.round(),
        elm: by_side.bottom,
        p: by_side.bottom.b.y > by_side.bottom.e.y ? 'b' : 'e'
      }];
    const ivert = [
      {
        point: bounds.left.round(),
        elm: by_side.left,
        p: by_side.left.b.x < by_side.left.e.x ? 'b' : 'e'
      },
      {
        point: bounds.right.round(),
        elm: by_side.right,
        p: by_side.right.b.x > by_side.right.e.x ? 'b' : 'e'
      }];

    return {ihor, ivert, by_side};
  }

  save_coordinates(short, save, close) {
    for (const elm of this.children) {
      elm.save_coordinates?.(short, save, close);
    }
    return Promise.resolve();
  }

  get owner_bounds() {
    return this.parent.bounds;
  }

  get dimension_bounds() {
    return this.parent.dimension_bounds;
  }
  
}

EditorInvisible.DimensionDrawer = DimensionDrawer;
EditorInvisible.DimensionLayer = DimensionLayer;
