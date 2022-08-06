
/**
 *
 *
 * @module invisible
 *
 * Created by Evgeniy Malyarov on 04.04.2018.
 */

class EditorInvisible extends paper.PaperScope {

  constructor() {

    super();

    /**
     * fake-undo
     * @private
     */
    this._undo = new EditorInvisible.History(this);

    /**
     * Собственный излучатель событий для уменьшения утечек памяти
     */
    this.eve = new (Object.getPrototypeOf($p.md.constructor))();

    consts.tune_paper(this);
  }

  get consts() {
    return consts;
  }

  /**
   * Возвращает элемент по номеру
   * @param num
   */
  elm(num) {
    return this.project.getItem({class: BuilderElement, elm: num});
  }

  /**
   * Заглушка установки заголовка редактора
   */
  set_text() {
  }

  /**
   * Создаёт проект с заданным типом канваса
   * @param format
   */
  create_scheme() {
    if(!this._canvas) {
      this._canvas = document.createElement('CANVAS');
      this._canvas.height = 480;
      this._canvas.width = 480;
      this.setup(this._canvas);
    }
    if(this.projects.length && !(this.projects[0] instanceof Scheme)) {
      this.projects[0].remove();
    }
    return new Scheme(this._canvas, this, true);
  }

  /**
   * Выполняет команду редактирования
   * @param type
   * @param attr
   */
  cmd(type, ...attr) {
    if(this._deformer[type] && this._deformer[type](...attr)) {
      this._undo.push(type, attr);
    }
  }

  unload() {
    this.eve.removeAllListeners();
    const revert = [];
    for(const elm of this.projects.concat(this.tools)){
      if(elm.unload) {
        revert.push(elm.unload());
      }
      else if(elm.remove) {
        elm.remove();
      }
    }

    const {_scopes} = EditorInvisible;
    for(let i in _scopes) {
      if(_scopes[i] === this) {
        delete _scopes[i];
      }
    }

    return Promise.all(revert);
  }

  /**
   * Returns all items intersecting the rect.
   * Note: only the item outlines are tested
   */
  paths_intersecting_rect(rect) {

    const paths = [];
    const boundingRect = new paper.Path.Rectangle(rect);

    this.project.getItems({class: ProfileItem}).forEach((item) => {
      if (rect.contains(item.generatrix.bounds)) {
        paths.push(item.generatrix);
        return;
      }
    });

    boundingRect.remove();

    return paths;
  }

  /**
   * Returns path points which are contained in the rect
   * @param rect
   * @returns {Array}
   */
  segments_in_rect(rect) {
    const segments = [];

    function checkPathItem(item) {
      if(item._locked || !item._visible || item._guide) {
        return;
      }
      const children = item.children || [];
      if(!rect.intersects(item.bounds)) {
        return;
      }
      if (item instanceof paper.Path) {
        if(item.parent instanceof ProfileItem){
          if(item != item.parent.generatrix) {
            return;
          }
          for (let i = 0; i < item.segments.length; i++) {
            if(rect.contains(item.segments[i].point)) {
              segments.push(item.segments[i]);
            }
          }
        }
      }
      else {
        for (let i = children.length - 1; i >= 0; i--)
          checkPathItem(children[i]);
      }
    }

    this.project.getItems({class: Contour}).forEach(checkPathItem);

    return segments;
  }

  clear_selection_bounds() {
    if (this._selectionBoundsShape) {
      this._selectionBoundsShape.remove();
    }
    this._selectionBoundsShape = null;
  }

  hide_selection_bounds() {
    if(this._drawSelectionBounds > 0) {
      this._drawSelectionBounds--;
    }
    if(this._drawSelectionBounds == 0) {
      if(this._selectionBoundsShape) {
        this._selectionBoundsShape.visible = false;
      }
    }
  }

  /**
   * Устанавливает икону курсора
   * Действие выполняется для всех канвасов редактора
   *
   * @param name {String} - имя css класса курсора
   */
  canvas_cursor(name) {
    this.projects.forEach(({view}) => {
      const {classList} = view.element;
      for(let i=0; i<classList.length; i++){
        const class_name = classList[i];
        if(class_name == name) {
          return;
        }
        else if((/\bcursor-\S+/g).test(class_name)) {
          classList.remove(class_name);
        }
      }
      classList.add(name);
    });
  }

  /**
   * ### Смещает импосты чтобы получить одинаковые размеры заполнений
   * возвращает массив дельт
   * @param name
   * @param glasses
   * @return {Array}
   */
  do_glass_align(name = 'auto', glasses) {

    const {project, Point, Key} = this;

    if(!glasses){
      glasses = project.selected_glasses();
    }
    if(glasses.length < 2){
      return;
    }

    const {enm, ui} = $p;

    // получаем текущий внешний контур
    let parent_layer;
    if(glasses.some(({layer}) => {
      const gl = layer.layer || layer;
      if(!parent_layer){
        parent_layer = gl;
      }
      else if(parent_layer != gl){
        return true;
      }
    })){
      parent_layer = null;
      if(glasses.some(({layer}) => {
        const gl = project.rootLayer(layer);
        if(!parent_layer){
          parent_layer = gl;
        }
        else if(parent_layer != gl){
          ui && ui.dialogs.alert({title: 'Выравнивание', text: 'Заполнения принадлежат разным рамным контурам'});
          return true;
        }
      })){
        return;
      }
    }

    // выясняем направление, в котром уравнивать
    if(name == 'auto'){
      name = 'width';
    }

    // собираем в массиве shift все импосты подходящего направления
    const orientation = name == 'width' ? enm.orientations.vert : enm.orientations.hor;
    // parent_layer.profiles
    const shift = parent_layer
      .getItems({class: Profile})
      .filter((impost) => {
        const {b, e} = impost.rays;
        // отрезаем плохую ориентацию и неимпосты
        return impost.orientation == orientation && (b.is_tt || e.is_tt || b.is_i || e.is_i);
      });

    // признак уравнивания геометрически, а не по заполнению
    const galign = Key.modifiers.control || Key.modifiers.shift || project.auto_align == enm.align_types.Геометрически;
    let medium = 0;

    // модифицируем коллекцию заполнений - подклеиваем в неё импосты, одновременно, вычиляем средний размер
    const glmap = new Map();
    glasses = glasses.map((glass) => {
      const {bounds, profiles} = glass;
      const res = {
        glass,
        width: bounds.width,
        height: bounds.height,
      };

      if(galign){
        // находим левый-правый-верхний-нижний профили
        const by_side = glass.profiles_by_side(null, profiles);
        res.width = (by_side.right.b.x + by_side.right.e.x - by_side.left.b.x - by_side.left.e.x) / 2;
        res.height = (by_side.bottom.b.y + by_side.bottom.e.y - by_side.top.b.y - by_side.top.e.y) / 2;
        medium += name == 'width' ? res.width : res.height;
      }
      else{
        medium += bounds[name];
      }

      profiles.forEach((curr) => {
        const profile = curr.profile.nearest() || curr.profile;

        if(shift.indexOf(profile) != -1){

          if(!glmap.has(profile)){
            glmap.set(profile, {dx: new Set, dy: new Set});
          }

          const gl = glmap.get(profile);
          if(curr.outer || (profile != curr.profile && profile.cnn_side(curr.profile) == enm.cnn_sides.outer)){
            gl.is_outer = true;
          }
          else{
            gl.is_inner = true;
          }

          const point = curr.b.add(curr.e).divide(2);
          if(name == 'width'){
            gl.dx.add(res);
            if(point.x < bounds.center.x){
              res.left = profile;
            }
            else{
              res.right = profile;
            }
          }
          else{
            gl.dy.add(res);
            if(point.y < bounds.center.y){
              res.top = profile;
            }
            else{
              res.bottom = profile;
            }
          }
        }
      });
      return res;
    });
    medium /= glasses.length;

    // дополняем в glmap структуры подходящих заполнений
    shift.forEach((impost) => {
      // если примыкают с двух сторон или вторая сторона рамная - импост проходит
      const gl = glmap.get(impost);
      if(!gl){
        return;
      }
      gl.ok = (gl.is_inner && gl.is_outer);
      gl.dx.forEach((glass) => {
        if(glass.left == impost && !glass.right){
          gl.delta = (glass.width - medium);
          gl.ok = true;
        }
        if(glass.right == impost && !glass.left){
          gl.delta = (medium - glass.width);
          gl.ok = true;
        }
      });
    });

    // рассчитываем, на сколько и в какую сторону двигать
    const res = [];

    shift.forEach((impost) => {

      const gl = glmap.get(impost);
      if(!gl || !gl.ok){
        return;
      }

      let delta = gl.delta || 0;

      if (name == 'width') {
        if(!gl.hasOwnProperty('delta')){
          gl.dx.forEach((glass) => {
            const double = 1.1 * gl.dx.size;
            if(glass.right == impost){
              delta += (medium - glass.width) / double;
            }
            else if(glass.left == impost){
              delta += (glass.width - medium) / double;
            }
          });
        }
        delta = new Point([delta,0]);
      }
      else {
        delta = new Point([0, delta]);
      }

      if(delta.length > consts.epsilon){
        const {b, e} = impost.rays;
        if(b.profile && impost.is_orthogonal(b.profile, b.point, 0.1) && e.profile && impost.is_orthogonal(e.profile, e.point, 0.1)) {
          impost.move_gen(delta);
        }
        else {
          impost.move_points(delta, true);
          impost.layer.redraw();
        }
        res.push(delta);
      }
    });

    return res;
  }

  /**
   * ### Уравнивание по ширинам заполнений
   * выполняет в цикле до получения приемлемой дельты
   */
  glass_align(name = 'auto', glasses) {

    const shift = this.do_glass_align(name, glasses);
    if(!shift){
      return;
    }

    const {_attr, contours} = this.project;
    if(!_attr._align_counter){
      _attr._align_counter = 1;
    }
    if(_attr._align_counter > 20){
      _attr._align_counter = 0;
      return;
    }

    if(shift.some((delta) => delta.length > 0.3)) {
      _attr._align_counter++;
      for (const layer of contours) {
        layer.redraw();
      }
      return this.glass_align(name, glasses);
    }
    else {
      _attr._align_counter = 0;
      for (const layer of contours) {
        layer.redraw();
      }
      return true;
    }
  }

  /**
   * ### Смещает раскладку по световому проему, с учетом толщины раскладки
   * возвращает истину в случае успеха
   * @param name
   * @param glass
   * @return {Boolean}
   */
  do_lay_impost_align(name = 'auto', glass) {

    const {project, Point} = this;
    const {orientations, elm_types} = $p.enm;

    // выбираем заполнение, если не выбрано
    if(!glass) {
      const glasses = project.selected_glasses();
      if(glasses.length != 1) {
        return;
      }
      glass = glasses[0];
    }

    // проверяем наличие раскладки у заполнения
    if (!(glass instanceof Filling)
      || !glass.imposts.length
      || glass.imposts.some(impost => impost.elm_type != elm_types.Раскладка)) {
      return;
    }

    // восстановление соединений с заполнением
    let restored;
    for(const impost of glass.imposts) {
      for(const node of ['b','e']) {
        const {cnn} = impost.rays[node];
        if(cnn && cnn.cnn_type !== cnn.cnn_type._manager.i) {
          continue;
        }
        const point = impost.generatrix.clone({insert: false})
          .elongation(1500)
          .intersect_point(glass.path, impost[node], false, node === 'b' ? impost.e : impost.b);
        if(point && !impost[node].is_nearest(point, 0)) {
          impost[node] = point;
          restored = true;
        }
      }
    }
    if(restored) {
      return true;
    }

    // выясняем направление, в котором уравнивать
    if(name === 'auto') {
      name = 'width';
    }

    // собираем в массиве shift все импосты подходящего направления, остальные помещаем в neighbors
    const orientation = name === 'width' ? orientations.vert : orientations.hor;
    const neighbors = [];
    const shift = glass.imposts.filter(impost => {
      // отрезаем плохую ориентацию, учитываем наклонные импосты
      const vert = (impost.angle_hor > 45 && impost.angle_hor <= 135) || (impost.angle_hor > 225 && impost.angle_hor <= 315);
      const passed = impost.orientation == orientation
        || (orientation === orientations.vert && vert)
        || (orientation === orientations.hor && !vert);
      if (!passed) {
        neighbors.push(impost);
      }
      return passed;
    });

    // выходим, если отсутствуют импосты подходящего направления
    if (!shift.length) {
      return;
    }

    // получение ближайших связанных импостов
    function get_nearest_link(link, src, pt) {
      // поиск близжайшего импоста к точке
      const index = src.findIndex(elm => elm.b.is_nearest(pt) || elm.e.is_nearest(pt));
      if (index !== -1) {
        // запоминаем импост
        const impost = src[index];
        // удаляем импост из доступных импостов
        src.splice(index, 1);
        // добавляем импост в связь
        link.push(impost);
        // получаем близжайшие импосты
        get_nearest_link(link, src, impost.b);
        get_nearest_link(link, src, impost.e);
      }
    }

    // группируем импосты для сдвига
    const tmp = Array.from(shift);
    const links = [];
    while (tmp.length) {
      const link = [];
      get_nearest_link(link, tmp, tmp[0].b);
      if (link.length) {
        links.push(link);
      }
    }
    // сортируем группы по возрастанию координат начальной точки первого импоста в связи
    links.sort((a, b) => {
      return orientation === orientations.vert ? (a[0].b._x - b[0].b._x) : (a[0].b._y - b[0].b._y);
    });

    // извлекаем ширину раскладки из номенклатуры первого импоста
    const widthNom = shift[0].nom.width;
    // определяем границы светового проема
    const bounds = glass.bounds_light(0);

    // вычисление смещения
    function get_delta(dist, pt) {
      return orientation === orientations.vert
        ? (bounds.x + dist - pt._x)
        : (bounds.y + dist - pt._y);
    }

    // получаем ширину строки или столбца
    const width = (orientation === orientations.vert ? bounds.width : bounds.height) / links.length;
    // получаем шаг между осями накладок без учета ширины элементов раскладки
    const step = ((orientation === orientations.vert ? bounds.width : bounds.height) - widthNom * links.length) / (links.length + 1);
    // накопительная переменная
    let pos = 0;
    // двигаем строки или столбцы
    for (const link of links) {
      // рассчитываем расположение осевой линии импоста с учетом предыдущей
      pos += step + widthNom / (pos === 0 ? 2 : 1);

      for (const impost of link) {
        // собираем соседние узлы для сдвига
        let nbs = [];
        for (const nb of neighbors) {
          if (nb.b.is_nearest(impost.b) || nb.b.is_nearest(impost.e)) {
            nbs.push({
              impost: nb,
              point: 'b'
            });
          }
          if (nb.e.is_nearest(impost.b) || nb.e.is_nearest(impost.e)) {
            nbs.push({
              impost: nb,
              point: 'e'
            });
          }
        }

        // двигаем начальную точку
        let delta = get_delta(pos, impost.b);
        impost.select_node("b");
        impost.move_points(new Point(orientation === orientations.vert ? [delta, 0] : [0, delta]));
        glass.deselect_onlay_points();

        // двигаем конечную точку
        delta = get_delta(pos, impost.e);
        impost.select_node("e");
        impost.move_points(new Point(orientation === orientations.vert ? [delta, 0] : [0, delta]));
        glass.deselect_onlay_points();

        // двигаем промежуточные точки импоста
        impost.generatrix.segments.forEach(segm => {
          if (segm.point === impost.b || segm.point === impost.e) {
            return;
          }
          delta = get_delta(pos, segm.point);
          segm.point = segm.point.add(delta);
        });

        // двигаем соседние узлы
        nbs.forEach(node => {
          delta = get_delta(pos, node.impost[node.point]);
          node.impost.select_node(node.point);
          node.impost.move_points(new Point(orientation == orientations.vert ? [delta, 0] : [0, delta]));
          glass.deselect_onlay_points();
        });
      }
    }

    return true;
  }

  /**
   * ### Уравнивание раскладки по световому проему
   * выполняет смещение по ширине и высоте
   * @param name
   * @param glass
   * @return {Boolean}
   */
  lay_impost_align(name = 'auto', glass) {
    // выравниваем по длине
    const width = (name === 'auto' || name === 'width') && this.do_lay_impost_align('width', glass);
    // выравниваем по высоте
    const height = (name === 'auto' ||  name === 'height') && this.do_lay_impost_align('height', glass);
    if (!width && !height) {
      return;
    }

    // перерисовываем контуры
    this.project.contours.forEach(l => l.redraw());

    return true;
  }


}

/**
 * Экспортируем конструктор EditorInvisible, чтобы экземпляры построителя можно было создать снаружи
 * @property EditorInvisible
 * @for MetaEngine
 * @type function
 */
$p.EditorInvisible = EditorInvisible;
