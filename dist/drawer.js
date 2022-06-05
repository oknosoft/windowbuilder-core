module.exports = function({$p, paper}) {
/**
 * ### Движок графического построителя
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module geometry
 */

/**
 * Константы и параметры
 */
const consts = {

	tune_paper({settings, eve}) {

    const {job_prm} = $p;
    if(job_prm.debug) {
      eve.setMaxListeners(200);
    }

	  const builder = job_prm.builder || {};

    /* Размер визуализации узла пути */
		if(builder.handle_size) {
      settings.handleSize = builder.handle_size;
    }

    /* Деформации применяем к самим элементам, а не к их matrix */
    //settings.applyMatrix = false;

    /* Прилипание. На этом расстоянии узел пытается прилепиться к другому узлу или элементу */
		this.sticking = builder.sticking || 90;
		this.sticking_l = builder.sticking_l || 9;
		this.sticking0 = this.sticking / 2;
		this.sticking2 = this.sticking * this.sticking;
		this.font_size = builder.font_size || 90;
    this.font_family = builder.font_family || 'GOST type B';
    this.elm_font_size = builder.elm_font_size || 60;
    /* если габариты изделия больше этого значения, увеличиваем шрифт */
    this.cutoff = builder.cutoff || 1300;

    if(!builder.font_family) {
      builder.font_family = this.font_family;
    }
    if(!builder.font_size) {
      builder.font_size = this.font_size;
    }
    if(!builder.elm_font_size) {
      builder.elm_font_size = this.elm_font_size;
    }

    if($p.wsql.alasql.utils.isNode) {
      this.font_size *= 1.2;
      this.elm_font_size *= 1.2;
    }

    /* в пределах этого угла, считаем элемент вертикальным или горизонтальным */
		this.orientation_delta = builder.orientation_delta || 30;

	},

  epsilon: 0.01,
	move_points: 'move_points',
	move_handle: 'move_handle',
	move_shapes: 'move-shapes',

  get base_offset() {
	  const {font_size} = this;
    return font_size < 80 ? 90 : font_size + 12;
  },
  get dop_offset() {
	  return this.base_offset + 40;
  }

};


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
   * @method segments_in_rect
   * @for Editor
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
   * ### Устанавливает икону курсора
   * Действие выполняется для всех канвасов редактора
   *
   * @method canvas_cursor
   * @for Editor
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


/**
 * История редактирования
 */
class History {

  constructor(editor) {
    this.editor = editor;
    this.history = [];
    this.pos = -1;
  }

  push(type, attr) {
    this.history.push({time: new Date(), type, attr});
  }

  buttons_accessibility() {
    return {back: false, rewind: false};
  }

  clear() {
    this.history.length = 0;
    this.pos = -1;
  }

  back() {
    if(this.pos > 0) {
      this.pos--;
    }
    if(this.pos >= 0) {

    }
    else {

    }
  }

  rewind() {
    if (this.pos <= (this.history.length - 1)) {
      this.pos++;
    }
  }

  /**
   * Для совместимости со старым интерфейсом
   */
  save_snapshot() {}
}

EditorInvisible.History = History;


/**
 * ### Виртуальный инструмент - прототип для инструментов _select_node_ и _select_elm_
 *
 * @class ToolElement
 * @extends paper.Tool
 * @constructor
 */
EditorInvisible.ToolElement = class ToolElement extends paper.Tool {

  /* eslint-disable-next-line */
  resetHot(type, event, mode) {

  }

  /* eslint-disable-next-line */
  testHot(type, event, mode) {
    return this.hitTest(event);
  }

  /**
   * ### Отключает и выгружает из памяти окно свойств инструмента
   *
   * @method detache_wnd
   * @for ToolElement
   * @param tool
   */
  detache_wnd() {
    this.profile = null;
  }

  /**
   * ### Проверяет, есть ли в проекте слои, при необходимости добавляет
   * @method detache_wnd
   * @for ToolElement
   */
  check_layer() {
    const {project, eve} = this._scope;
    if (!project.contours.length) {
      // создаём пустой новый слой
      EditorInvisible.Contour.create({project});
      // оповещаем мир о новых слоях
      eve.emit_async('rows', project.ox, {constructions: true});
    }
  }

  /**
   * ### Общие действия при активизации инструмента
   *
   * @method on_activate
   * @for ToolElement
   */
  on_activate(cursor) {

    this._scope.canvas_cursor(cursor);
    this.eve.emit_async('tool_activated', this);

    // для всех инструментов, кроме select_node...
    if(this.options.name != 'select_node') {
      this.check_layer();
      // проверяем заполненность системы
      if(this.project._dp.sys.empty()) {
        const {msg, ui} = $p;
        ui && ui.dialogs.alert({text: msg.bld_not_sys, title: msg.bld_title});
      }
    }
  }

  get eve() {
    return this._scope.eve;
  }

  get project() {
    return this._scope.project;
  }

  get mover() {
    return this._scope._mover;
  }

};




/**
 * ### Абстрактное заполнение
 * Общие свойства заполнения и контура
 *
 * @module geometry
 * @submodule abstract_filling
 *
 * Created by Evgeniy Malyarov on 12.05.2017.
 */

const AbstractFilling = (superclass) => class extends superclass {

  /**
   * Тест положения контура в изделии
   */
  is_pos(pos) {
    // если в изделии один контур или если контур является створкой, он занимает одновременно все положения
    if(this.project.contours.count == 1 || this.parent){
      return true;
    }

    // если контур реально верхний или правый и т.д. - возвращаем результат сразу
    let res = Math.abs(this.bounds[pos] - this.project.bounds[pos]) < consts.sticking_l;

    if(!res){
      let rect;
      if(pos == "top"){
        rect = new paper.Rectangle(this.bounds.topLeft, this.bounds.topRight.add([0, -200]));
      }
      else if(pos == "left"){
        rect = new paper.Rectangle(this.bounds.topLeft, this.bounds.bottomLeft.add([-200, 0]));
      }
      else if(pos == "right"){
        rect = new paper.Rectangle(this.bounds.topRight, this.bounds.bottomRight.add([200, 0]));
      }
      else if(pos == "bottom"){
        rect = new paper.Rectangle(this.bounds.bottomLeft, this.bounds.bottomRight.add([0, 200]));
      }

      res = !this.project.contours.some((l) => {
        return l != this && rect.intersects(l.bounds);
      });
    }

    return res;
  }

  /**
   * Возвращает структуру профилей по сторонам
   */
  profiles_by_side(side, profiles) {
    // получаем таблицу расстояний профилей от рёбер габаритов
    if(!profiles){
      profiles = this.profiles;
    }
    const bounds = {
      left: Infinity,
      top: Infinity,
      bottom: -Infinity,
      right: -Infinity
    };
    const res = {};
    const ares = [];

    function by_side(name) {
      ares.some((elm) => {
        if(elm[name] == bounds[name]){
          res[name] = elm.profile;
          return true;
        }
      })
    };

    if (profiles.length) {
      profiles.forEach((profile) => {
        const {b, e} = profile;
        const x = b.x + e.x;
        const y = b.y + e.y;
        if(x < bounds.left){
          bounds.left = x;
        }
        if(x > bounds.right){
          bounds.right = x;
        }
        if(y < bounds.top){
          bounds.top = y;
        }
        if(y > bounds.bottom){
          bounds.bottom = y;
        }
        ares.push({
          profile: profile,
          left: x,
          top: y,
          bottom: y,
          right: x
        });
      });
      if (side) {
        by_side(side);
        return res[side];
      }

      Object.keys(bounds).forEach(by_side);
    }

    return res;
  }

  /**
   * Возвращает массив вложенных контуров текущего контура
   * @property contours
   * @for Contour
   * @type Array
   */
  get contours() {
    return this.children.filter((elm) => elm instanceof Contour);
  }

  get skeleton() {
    return this._skeleton;
  }

  /**
   * Cлужебная группа размерных линий
   */
  get l_dimensions() {
    const {_attr} = this;
    return _attr._dimlns || (_attr._dimlns = new DimensionDrawer({parent: this}));
  }

  /**
   * Габариты с учетом пользовательских размерных линий, чтобы рассчитать отступы автолиний
   */
  get dimension_bounds() {
    let {bounds} = this;
    this.getItems({class: DimensionLineCustom}).forEach((dl) => {
      bounds = bounds.unite(dl.bounds);
    });
    return bounds;
  }

};

EditorInvisible.AbstractFilling = AbstractFilling;


/**
 * ### Базовый класс элементов построителя
 * Унаследован от [paper.Group](http://paperjs.org/reference/group/). Cвойства и методы `BuilderElement` присущи всем элементам построителя,
 * но не характерны для классов [Path](http://paperjs.org/reference/path/) и [Group](http://paperjs.org/reference/group/) фреймворка [paper.js](http://paperjs.org/about/),
 * т.к. описывают не линию и не коллекцию графических примитивов, а элемент конструкции с определенной физикой и поведением
 *
 * @class BuilderElement
 * @param attr {Object} - объект со свойствами создаваемого элемента
 *  @param attr.b {paper.Point} - координата узла начала элемента - не путать с координатами вершин пути элемента
 *  @param attr.e {paper.Point} - координата узла конца элемента - не путать с координатами вершин пути элемента
 *  @param attr.contour {Contour} - контур, которому принадлежит элемент
 *  @param attr.type_el {_enm.elm_types}  может измениться при конструировании. например, импост -> рама
 *  @param [attr.inset] {_cat.inserts} -  вставка элемента. если не указано, будет вычислена по типу элемента
 *  @param [attr.path] (r && arc_ccw && more_180)
 * @constructor
 * @extends paper.Group
 * @menuorder 40
 * @tooltip Элемент изделия
 */
class BuilderElement extends paper.Group {

  constructor(attr) {

    super(attr);
    if(attr.parent){
      this.parent = attr.parent;
    }
    else if(attr.proto && attr.proto.parent){
      this.parent = attr.proto.parent;
    }

    if(!attr.row){
      attr.row = this.layer._ox.coordinates.add();
    }

    this._row = attr.row;

    this._attr = {};

    if(!this._row.elm){
      this._row.elm = (attr.elm && typeof attr.elm === 'number') ? attr.elm : this._row._owner.aggregate([], ['elm'], 'max') + 1;
    }

    if(attr._nearest){
      this._attr._nearest = attr._nearest;
      this._attr.binded = true;
      this._attr.simulated = true;
      this._row.elm_type = $p.enm.elm_types.Створка;
    }

    if(attr.proto){

      if(attr.proto.inset){
        this.set_inset(attr.proto.inset, true);
      }

      if(attr.proto instanceof Profile){
        this.insertBelow(attr.proto);
      }

      this.clr = attr.proto.clr;

    }

    if(!this._row.cnstr && this.layer.cnstr){
      this._row.cnstr = this.layer.cnstr;
    }

    if(this._row.elm_type.empty() && !this.inset.empty()){
      this._row.elm_type = this.nom.elm_type;
    }

    this.project.register_change();

    if(this.getView()._countItemEvent) {
      this.on('doubleclick', this.elm_dblclick);
    }

  }

  /**
   * ### Элемент - владелец
   * имеет смысл для раскладок и рёбер заполнения
   * @property owner
   * @type BuilderElement
   */
  get owner() {
    return this._attr.owner;
  }
  set owner(v) {
    this._attr.owner = v;
  }

  /**
   * ### Образующая
   * прочитать - установить путь образующей. здесь может быть линия, простая дуга или безье
   * по ней будут пересчитаны pathData и прочие свойства
   * @property generatrix
   * @type paper.Path
   */
  get generatrix() {
    return this._attr.generatrix;
  }
  set generatrix(attr) {

    const {_attr} = this;
    const {generatrix} = _attr;
    generatrix.removeSegments();

    this.rays && this.rays.clear();

    if(attr instanceof paper.Path){
      generatrix.addSegments(attr.segments);
    }
    if(Array.isArray(attr)){
      generatrix.addSegments(attr);
    }
    else if(attr.proto &&  attr.p1 &&  attr.p2){

      // сначала, выясняем направление пути
      let tpath = attr.proto;
      if(tpath.getDirectedAngle(attr.ipoint) < 0){
        tpath.reverse();
      }

      // далее, уточняем порядок p1, p2
      let d1 = tpath.getOffsetOf(attr.p1);
      let d2 = tpath.getOffsetOf(attr.p2), d3;
      if(d1 > d2){
        d3 = d2;
        d2 = d1;
        d1 = d3;
      }
      if(d1 > 0){
        tpath = tpath.split(d1);
        d2 = tpath.getOffsetOf(attr.p2);
      }
      if(d2 < tpath.length){
        tpath.split(d2);
      }

      generatrix.remove();
      _attr.generatrix = tpath;
      _attr.generatrix.parent = this;

      if(this.layer && this.layer.parent){
        _attr.generatrix.guide = true;
      }
    }
  }

  /**
   * путь элемента - состоит из кривых, соединяющих вершины элемента
   * для профиля, вершин всегда 4, для заполнений может быть <> 4
   * @property path
   * @type paper.Path
   */
  get path() {
    return this._attr.path;
  }
  set path(attr) {
    if(attr instanceof paper.Path){
      const {_attr} = this;
      _attr.path.removeSegments();
      _attr.path.addSegments(attr.segments);
      if(!_attr.path.closed){
        _attr.path.closePath(true);
      }
    }
  }

  // виртуальные метаданные для автоформ
  __metadata(iface) {
    const {fields, tabular_sections} = this.project.ox._metadata();
    const t = this,
      {utils, cat: {inserts, cnns, clrs}, enm: {elm_types,positions, inserts_glass_types, cnn_types}, cch} = $p,
      _xfields = tabular_sections.coordinates.fields,
      inset = Object.assign({}, _xfields.inset),
      arc_h = Object.assign({}, _xfields.r, {synonym: 'Высота дуги'}),
      info = Object.assign({}, fields.note, {synonym: 'Элемент'}),
      cnn1 = Object.assign({}, tabular_sections.cnn_elmnts.fields.cnn, {synonym: 'Соединение 1'}),
      cnn2 = Object.assign({}, cnn1, {synonym: 'Соединение 2'}),
      cnn3 = Object.assign({}, cnn1, {synonym: 'Соед. примыкания'}),
      clr = Object.assign(utils._clone(_xfields.clr), {choice_params: []});

    if(iface !== false) {
      iface = $p.iface;
    }

    function cnn_choice_links(o, cnn_point){

      const nom_cnns = cnns.nom_cnn(t, cnn_point.profile, cnn_point.cnn_types, false, undefined, cnn_point);

      if(!iface || utils.is_data_obj(o)){
        return nom_cnns.some((cnn) => o.ref == cnn);
      }
      else{
        let refs = '';
        nom_cnns.forEach((cnn) => {
          if(refs) {
            refs += ', ';
          }
          refs += `'${cnn.ref}'`;
        });
        return `_t_.ref in (${refs})`;
      }
    }


    // динамические отборы для вставок и соединений
    const {_types_filling} = inserts;

    inset.choice_links = [{
      name: ['selection', 'ref'],
      path: [(o, f) => {
        const {sys} = this.layer;

        let selection;

        if(this instanceof Filling) {
          const {glass_thickness, thicknesses} = sys;

          // !iface - нет dhtmlx, чистый react
          if(!iface || utils.is_data_obj(o)) {
            const insert = inserts.get(o);
            const {insert_type, insert_glass_type} = insert;
            if(_types_filling.includes(insert_type) && (insert_glass_type.empty() || insert_glass_type === inserts_glass_types.Заполнение)) {
              /*разбор параметра glass_thickness*/
              if(glass_thickness === 0) {
                return thicknesses.includes(insert.thickness(this));
              }
              else if(glass_thickness === 1) {
                return sys.glasses({elm: this}).includes(insert);
              }
              else if(glass_thickness === 2) {
                const thickness = insert.thickness(this);
                return thickness >= thicknesses[0] && thickness <= thicknesses[thicknesses.length - 1];
              }
              else if(glass_thickness === 3) {
                return true;
              }
            }
            return false;
          }
          else {
            let refs = '';
            inserts.by_thickness(sys).forEach((o) => {
              if(o.insert_glass_type.empty() || o.insert_glass_type === inserts_glass_types.Заполнение) {
                if(refs) {
                  refs += ', ';
                }
                refs += `'${o.ref}'`;
              }
            });
            return `_t_.ref in (${refs})`;
          }
        }
        else if(this instanceof ProfileConnective) {
          selection = {elm_type: elm_types.Соединитель};
        }
        else if(this instanceof ProfileAddl) {
          selection = {elm_type: elm_types.Добор};
        }
        else if(this instanceof Profile) {
          const {any} = positions;
          if(this.nearest()) {
            selection = {
              pos:{in:[this.pos,any]},
              elm_type: {in: [elm_types.flap, elm_types.flap0, elm_types.Добор]}
            };
          }
          else {
            selection = {pos:{in:[this.pos,any]},
              elm_type: {in: [elm_types.Рама, elm_types.Импост, elm_types.Штульп, elm_types.Добор]}};
          }
        }
        else {
          selection = {elm_type: this.nom.elm_type};
        }

        // !iface - нет dhtmlx, чистый react
        if(!iface || utils.is_data_obj(o)) {
          let ok = false;
          selection.nom = inserts.get(o);
          sys.elmnts.find_rows(selection, (row) => {
            ok = true;
            return false;
          });
          return ok;
        }
        else {
          let refs = '';
          sys.elmnts.find_rows(selection, (row) => {
            if(refs) {
              refs += ', ';
            }
            refs += `'${row.nom.ref}'`;
          });
          return `_t_.ref in (${refs})`;
        }
      }]
    }];

    cnn1.choice_links = [{
      name: ['selection', 'ref'],
      path: [(o, f) => cnn_choice_links(o, this.rays.b)]
    }];

    cnn2.choice_links = [{
      name: ['selection', 'ref'],
      path: [(o, f) => cnn_choice_links(o, this.rays.e)]
    }];

    cnn3.choice_links = [{
      name: ['selection', 'ref'],
      path: [(o) => {
        const cnn_ii = this.selected_cnn_ii();
        let nom_cnns = [utils.blank.guid];

        if(cnn_ii) {
          if(cnn_ii.elm instanceof Filling || this instanceof ProfileAdjoining) {
            nom_cnns = cnns.nom_cnn(cnn_ii.elm, this, cnn_types.acn.ii);
          }
          else if(cnn_ii.elm.elm_type == elm_types.flap && this.elm_type != elm_types.flap) {
            nom_cnns = cnns.nom_cnn(cnn_ii.elm, this, cnn_types.acn.ii);
          }
          else {
            nom_cnns = cnns.nom_cnn(this, cnn_ii.elm, cnn_types.acn.ii);
          }
        }

        if(!iface || utils.is_data_obj(o)) {
          return nom_cnns.some((cnn) => o.ref == cnn);
        }
        else {
          let refs = '';
          nom_cnns.forEach((cnn) => {
            if(refs) {
              refs += ', ';
            }
            refs += `'${cnn.ref}'`;
          });
          return `_t_.ref in (${refs})`;
        }
      }]
    }];

    // дополняем свойства поля цвет отбором по служебным цветам
    clrs.selection_exclude_service(clr, this);

    const mfields = {
      info,
      inset,
      clr,
      x1: _xfields.x1,
      x2: _xfields.x2,
      y1: _xfields.y1,
      y2: _xfields.y2,
      cnn1,
      cnn2,
      cnn3,
      arc_h,
      r: _xfields.r,
      arc_ccw: _xfields.arc_ccw,
      a1: Object.assign({}, _xfields.x1, {synonym: 'Угол 1'}),
      a2: Object.assign({}, _xfields.x1, {synonym: 'Угол 2'}),
      offset: Object.assign({}, _xfields.x1, {synonym: 'Смещение'}),
      region: _xfields.region,
      note: fields.note,
      price: Object.assign({}, tabular_sections.specification.fields.price, {synonym: 'Цена продажи'}),
      first_cost: Object.assign({}, tabular_sections.specification.fields.price, {synonym: 'Себестоимость план'}),
    };

    return {
      fields: new Proxy(mfields, {
        get(target, prop) {
          if(target[prop]) {
            return target[prop];
          }
          const param = cch.properties.get(prop);
          if(param) {
            const mf = {
              type: param.type,
              synonym: param.name,
            };
            if(param.type.types.includes('cat.property_values')) {
              mf.choice_params = [{
                name: 'owner',
                path: param.ref,
              }];
            }
            return mf;
          }
        }
      }),
    };
  }
  get _metadata() {
    return this.__metadata();
  }

  // виртуальный датаменеджер для автоформ
  get _manager() {
    return this.project._dp._manager;
  }

  // объект продукции текущего элемеента может отличаться от продукции текущего проекта
  get ox() {
    const {layer, _row} = this;
    const _ox = layer?._ox;
    if(_ox) {
      return _ox;
    }
    return _row ? _row._owner._owner : {cnn_elmnts: []};
  }

  /**
   * ### Номенклатура
   * свойство только для чтения, т.к. вычисляется во вставке
   * @type CatNom
   */
  get nom() {
    const {_attr} = this;
    if(!_attr.nom) {
      _attr.nom = this.inset.nom(this);
    }
    return _attr.nom;
  }

  // номер элемента - свойство только для чтения
  get elm() {
    return (this._row && this._row._obj.elm) || 0;
  }

  // информация для редактора свойств
  get info() {
    return "№" + this.elm;
  }

  // виртуальная ссылка
  get ref() {
    const {nom} = this;
    return nom && !nom.empty() ? nom.ref : this.inset.ref;
  }

  // ширина
  get width() {
    return this.nom.width || 80;
  }

  // толщина (для заполнений и, возможно, профилей в 3D)
  get thickness() {
    return this.inset.thickness(this);
  }

  // опорный размер (0 для рам и створок, 1/2 ширины для импостов)
  get sizeb() {
    const {sizeb} = this.inset;
    if(sizeb === -1100) {
      const {nom} = this;
      return nom ? nom.sizeb : 0;
    }
    else if(sizeb === -1200) {
      return this.width / 2;
    }
    else if(sizeb > 1000) {
      const parts = sizeb.toFixed(); //[для импоста]/[для рамы]
      const p1 = parts.substring(0, 3);
      const {b, e} = this.rays;
      if(b.is_cut() || b.is_t() || b.is_i() || e.is_cut() || e.is_t() || e.is_i()) {
        return parseFloat(p1);
      }
      let p2 = parts.substring(3, 3);
      while (p2.length < 3) {
        p2 += '0';
      }
      return parseFloat(p2);
    }
    return sizeb || 0;
  }

  // размер до фурнитурного паза
  get sizefurn() {
    return this.nom.sizefurn || 20;
  }

  // масса элемента
  get weight() {
    let {ox, elm, inset, layer} = this;
    // если элемент оформлен отдельной строкой заказа, массу берём из соседней характеристики
    if(inset.is_order_row_prod({ox, elm: this, contour: layer})) {
      ox = ox.find_create_cx(elm, $p.utils.blank.guid, false);
    }
    return ox.elm_weight(elm);
  }

  /**
   * Примыкающее соединение для диалога свойств
   */
  get cnn3(){
    const cnn_ii = this.selected_cnn_ii();
    return cnn_ii ? cnn_ii.row.cnn : $p.cat.cnns.get();
  }
  set cnn3(v) {
    const cnn_ii = this.selected_cnn_ii();
    if(cnn_ii && cnn_ii.row.cnn != v){
      cnn_ii.row.cnn = v;
      if(this._attr._nearest_cnn){
        this._attr._nearest_cnn = cnn_ii.row.cnn;
      }
      if(this.rays){
        this.rays.clear();
      }
      this.project.register_change();
    }
  }

  // вставка
  get inset() {
    return $p.cat.inserts.get(this._row && this._row._obj.inset);
  }
  set inset(v) {
    this.set_inset(v);
  }

  // цвет элемента
  get clr() {
    return this._row.clr;
  }
  set clr(v) {
    this.set_clr(v);
  }

  get clr_in() {
    return this.clr.clr_in;
  }
  set clr_in(v) {
    const {clr} = this;
    this.clr = $p.cat.clrs.composite_ref('clr_in', clr.clr_out.empty() ? clr : clr.clr_out, v);
  }

  get clr_out() {
    return this.clr.clr_out;
  }
  set clr_out(v) {
    const {clr} = this;
    this.clr = $p.cat.clrs.composite_ref('clr_out', clr.clr_in.empty() ? clr : clr.clr_in, v);
  }

  /**
   * Дополнительные свойства json
   * @return {Object}
   */
  get dop() {
    return this._row.dop;
  }
  set dop(v) {
    this._row.dop = v;
  }

  /**
   * Произвольный комментарий
   * @return {String}
   */
  get note() {
    return this.dop.note || '';
  }
  set note(v) {
    this.dop = {note: v};
  }

  /**
   * Плановая себестоимость единицы хранения в валюте упр. учёта
   * @return {Number}
   */
  get first_cost() {
    return this.dop.first_cost || 0;
  }
  set first_cost(v) {
    this.dop = {first_cost: v};
  }

  /**
   * Плановая цена продажи единицы хранения в валюте упр. учёта
   * @return {Number}
   */
  get price() {
    return this.dop.price || 0;
  }
  set price(v) {
    this.dop = {price: v};
  }

  /**
   * Создаёт-удаляет дополнительные свойства элемента в зависимости от их наличия в системе или параметрах параметра
   * [inset] {CatInserts} - указываем для дополнительных вставок
   * @return {Array}
   */
  elm_props(inset) {
    const {_attr, _row, layer, ox: {params}, rnum} = this;
    const {utils, md, enm: {positions}} = $p;
    const concat = inset || rnum;
    if(!inset) {
      inset = this.inset;
    }

    // получаем список свойств
    const props = [];
    if(this.isInserted()) {
      // свойства, нужные вставке текущего элемента
      const inset_params = inset.used_params();
      const product_params = concat ? inset_params.map((param) => ({param, elm: true})) : layer.sys.product_params;
      for(const {param, elm} of product_params) {
        if (!inset_params.includes(param)) {
          continue;
        }
        // если переопределение явно указано в системе
        if(elm) {
          props.push(param);
        }
        // если переопределение указано в самом параметре
        else if([1, 2].includes(param.inheritance)) {
          // дополнительно учтём тип и положение элемента
          const {elm_type, pos, orientation} = this;
          if(!param.applying.count()) {
            props.push(param);
          }
          else {
            for(const arow of param.applying) {
              if((arow.elm_type.empty() || arow.elm_type == elm_type) &&
                (!arow.pos || arow.pos.empty() || arow.pos === positions.any || arow.pos === pos || arow.pos === orientation)) {
                props.push(param);
                break;
              }
            }
          }
        }
      }

      if(!rnum) {
        // удаляем возможные паразитные свойства
        _attr.props && _attr.props.forEach((prop) => {
          if(!props.includes(prop)) {
            delete this[concat ? concat.ref + prop.ref : prop.ref];
          }
        });
        _attr.props = props;
        // создаём свойства
        props.forEach((prop) => {
          const key = concat ? concat.ref + prop.ref : prop.ref;
          if(!this.hasOwnProperty(key)) {
            Object.defineProperty(this, key, {
              get() {
                let prow;
                params.find_rows({
                  param: prop,
                  cnstr: {in: [0, -_row.row]},
                  inset: concat || utils.blank.guid,
                  region: 0,
                }, (row) => {
                  if(!prow || row.cnstr) {
                    prow = row;
                  }
                });

                if(prow) {
                  return prow.value;
                }
                const type = prop.type.types[0];
                if(type.includes('.')) {
                  const mgr = md.mgr_by_class_name(type);
                  if(mgr) {
                    return mgr.get();
                  }
                }
              },
              set(v) {
                let prow, prow0;
                params.find_rows({
                  param: prop,
                  cnstr: {in: [0, -_row.row]},
                  inset: concat || utils.blank.guid,
                  region: 0,
                }, (row) => {
                  if(row.cnstr) {
                    prow = row;
                  }
                  else {
                    prow0 = row;
                  }
                });
                // если устанавливаемое значение совпадает со значением изделия - удаляем
                if(prow0 && prow0.value == v) {
                  prow && prow._owner.del(prow);
                }
                else if(prow) {
                  prow.value = v;
                }
                else {
                  params.add({
                    param: prop,
                    cnstr: -_row.row,
                    region: 0,
                    inset: concat || utils.blank.guid,
                    value: v,
                  });
                }
                this.refresh_inset_depends(prop, true);
                return true;
              },
              configurable: true,
            });
          }
        });
      }
    }

    return props;
  }

  /**
   * Пересчитывает путь элемента, если изменились параметры, влияющие на основной материал вставки
   * @param param {CchProperties}
   * @param with_neighbor {Boolean} - с учетом примыкающих
   */
  refresh_inset_depends(param, with_neighbor) {

  }

  /**
   * Сеттер вставки с учетом выделенных элементов
   * @param v {CatInserts}
   * @param [ignore_select] {Boolean}
   */
  set_inset(v, ignore_select) {
    const {_row, _attr, project} = this;
    if(_row.inset != v){
      delete _attr.nom;
      _row.inset = v;
      if(_attr && _attr._rays){
        _attr._rays.clear(true);
      }
      project.register_change();
      project._scope.eve.emit('set_inset', this);
    }
  }

  /**
   * Сеттер цвета элемента
   * @param v {CatClrs}
   * @param [ignore_select] {Boolean}
   */
  set_clr(v, ignore_select) {
    const {_row, path, project} = this;
    const clr = _row.clr._manager.getter(v);
    const {clr_group} = _row.inset;
    if(clr_group.contains(clr) && _row.clr != clr) {
      _row.clr = clr;
      project.register_change();
    }
    // цвет элементу присваиваем только если он уже нарисован
    if(path instanceof paper.Path){
      path.fillColor = BuilderElement.clr_by_clr.call(this, _row.clr);
    }
  }

  /**
   * тот, к кому примыкает импост
   * @return {BuilderElement}
   */
  t_parent(be) {
    return this;
  }

  /**
   * Возвращает примыкающий элемент и строку табчасти соединений
   */
  selected_cnn_ii() {
    const {project, elm, ox} = this;
    const items = [];

    for(const item of project.getSelectedItems()) {
      if(item.parent instanceof ProfileItem || item.parent instanceof Filling) {
        items.push(item.parent);
      }
      else if(item instanceof Filling) {
        items.push(item);
      }
    }

    if(items.length > 1 && items.includes(this)) {
      const nelm = this.nearest();
      const shift = nelm instanceof ProfileVirtual && nelm.nearest();
      const {cat: {cnns}, enm: {cnn_types}} = $p;

      for(const item of items) {
        if(item === this) {
          continue;
        }
        for(const row of ox.cnn_elmnts) {
          if(row.node1 || row.node2) {
            continue;
          }
          if((row.elm1 == elm && row.elm2 == item.elm) || (row.elm1 == item.elm && row.elm2 == elm)) {
            row.cnn = item instanceof Filling ?
              cnns.elm_cnn(item, this, cnn_types.acn.ii, row.cnn, false) : cnns.elm_cnn(this, item, cnn_types.acn.ii, row.cnn, false);
            return {elm: item, row};
          }
          if(shift && row.elm1 == elm && row.elm2 == nelm.elm) {
            row.cnn = item instanceof Filling ?
              cnns.elm_cnn(item, this, cnn_types.acn.ii, row.cnn, false) : cnns.elm_cnn(this, item, cnn_types.acn.ii, row.cnn, false);
            return {elm: nelm, row};
          }
        }
      }
    }
  }

  /**
   * ### Удаляет элемент из контура и иерархии проекта
   * Одновлеменно, удаляет строку из табчасти табчасти _Координаты_ и отключает наблюдателя
   * @method remove
   */
  remove() {
    this.detache_wnd && this.detache_wnd();

    const {parent, project, _row, ox, elm, path} = this;

    if(parent && parent.on_remove_elm) {
      parent.on_remove_elm(this);
    }

    if(path && path.onMouseLeave) {
      path.onMouseEnter = null;
      path.onMouseLeave = null;
    }

    project._scope.eve.emit('elm_removed', this);

    if (this.observer){
      project._scope.eve.off(consts.move_points, this.observer);
      delete this.observer;
    }

    if(_row && _row._owner._owner === ox && !project.ox.empty()){
      ox.params.clear({cnstr: -elm});
      ox.inserts.clear({cnstr: -elm});
      _row._owner.del(_row);
    }

    project.register_change();

    super.remove();
  }

  /**
   * ### добавляет информацию об ошибке в спецификацию, если таковой нет для текущего элемента
   * @param nom {CatNom}
   * @param text {String}
   * @param origin {DataObj} - происхождение
   */
  err_spec_row(nom, text, origin) {
    if(!nom){
      nom = $p.job_prm.nom.info_error;
    }
    const {_ox} = this.layer;
    if(!_ox.specification.find_rows({elm: this.elm, nom}).length){
      $p.ProductsBuilding.new_spec_row({
        elm: this,
        row_base: {clr: $p.cat.clrs.get(), nom},
        spec: _ox.specification,
        ox: _ox,
        origin,
      });
    }
    if(text){

    }
  }

  elm_dblclick(event) {
    this.project._scope.eve.emit('elm_dblclick', this, event);
  }

  static clr_by_clr(clr) {
    let {clr_str, clr_in, clr_out} = clr;
    const {_reflected} = this.project._attr;

    if(_reflected){
      if(!clr_out.empty() && clr_out.clr_str) {
        clr_str = clr_out.clr_str;
      }
    }
    else{
      if(!clr_in.empty() && clr_in.clr_str) {
        clr_str = clr_in.clr_str;
      }
    }

    if(!clr_str) {
      clr_str = this.default_clr_str ? this.default_clr_str : 'fff';
    }

    if(clr_str) {
      clr = clr_str.split(',');
      if(clr.length == 1) {
        if(clr_str[0] != '#') {
          clr_str = '#' + clr_str;
        }
        clr = new paper.Color(clr_str);
        clr.alpha = 0.96;
      }
      else if(clr.length == 4) {
        clr = new paper.Color(clr[0], clr[1], clr[2], clr[3]);
      }
      else if(clr.length == 3) {
        if(this.path && this.path.bounds) {
          clr = new paper.Color({
            stops: [clr[0], clr[1], clr[2]],
            origin: this.path.bounds.bottomLeft,
            destination: this.path.bounds.topRight
          });
        }
        else {
          clr = new paper.Color(clr[0]);
        }
      }
      return clr;
    }
  }
}

EditorInvisible.BuilderElement = BuilderElement;


/**
 * Обёртка строки табчасти параметра
 */
class BuilderPrmRow {

  constructor(_owner, _row) {
    this._owner = _owner;
    this._row = _row;
  }

  get row() {
    return this._row.row;
  }

  get param() {
    return this._row.param;
  }

  get inset() {
    return this._row.inset;
  }

  get sorting_field() {
    return this.param.sorting_field;
  }

  get value() {
    return this._row.value;
  }
  set value(value) {
    if(this.value == value) {
      return;
    }
    const {inset, param, _owner, _row} = this;
    const {params, cnstr} = _owner;
    if(_row.cnstr) {
      const prow = params.find({cnstr: 0, param, inset});
      if(prow?.value == value) {
        params.del(_row);
        this._row = prow;
      }
      else {
        _row.value = value;
      }
    }
    else {
      this._row = params.add({cnstr, param, inset, value});
    }
  }
}

/**
 * Свойства слоя или элемента
 *
 * Created by Evgeniy Malyarov on 11.04.2022.
 */
class BuilderPrms {

  constructor({elm, layer}) {
    this.elm = elm;
    this.layer = layer;
    this.cnstr = layer ? layer.cnstr : elm.elm;
  }

  get _name() {
    return 'params';
  }

  get _owner() {
    return this.elm ? (elm.prm_ox || elm.ox) : this.layer._ox;
  }

  get params() {
    return this._owner.params;
  }

  find_rows({inset}, cb) {
    const {cnstr, params} = this;
    const map = new Map();
    const cnstrs = [0, cnstr];
    for(const row of params) {
      if(cnstrs.includes(row.cnstr) && row.inset == inset && !row.hide) {
        if(!map.has(row.param) || row.cnstr) {
          map.set(row.param, row);
        }
      }
    }
    const res = [];
    for(const [param, row] of map) {
      res.push(new BuilderPrmRow(this, row));
    }

    res.sort($p.utils.sort('sorting_field'));
    for(const row of res) {
      cb(row);
    }
    return res;
  }

}

/**
 * Элемент составного пути (например, подоконник с закруглением и вырезом)
 *
 * @module compound
 *
 * Created by Evgeniy Malyarov on 09.02.2022.
 */
class Compound extends BuilderElement {

  /**
   * Возвращает тип элемента (Составной путь)
   */
  get elm_type() {
    return $p.enm.elm_types.compound;
  }
}

EditorInvisible.Compound = Compound;


/**
 * ### Контур (слой) изделия
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * Created 24.07.2015
 *
 * @module geometry
 * @submodule contour
 */


/**
 * ### Сегмент заполнения
 * содержит информацию о примыкающем профиле и координатах начала и конца
 * @class GlassSegment
 * @constructor
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

    if (this.profile.children.some((addl) => {

        if (addl instanceof ProfileAddl && this.outer == addl.outer) {

          if (!gen) {
            gen = this.profile.generatrix;
          }

          const b = this.profile instanceof ProfileAddl ? this.profile.b : this.b;
          const e = this.profile instanceof ProfileAddl ? this.profile.e : this.e;

          // TODO: учесть импосты, привязанные к добору

          if (b.is_nearest(gen.getNearestPoint(addl.b), true) && e.is_nearest(gen.getNearestPoint(addl.e), true)) {
            this.profile = addl;
            this.outer = false;
            return true;
          }
        }
      })) {

      this.segment();
    }

  }

  /**
   * Проверяет наличие соединения по углам в узле
   * @param nodes
   * @param tangent
   * @param curr_profile
   * @param segm_profile
   * @return {boolean}
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
        //if(segm.profile === elm.profile && (offset === 0 ? segm.e : segm.b).is_nearest(ppoint, true))
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
   * Выясныет, есть ли у текущего сегмента соединение с соседним
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

/**
 * ### Контур (слой) изделия
 * Унаследован от  [paper.Layer](http://paperjs.org/reference/layer/)
 * новые элементы попадают в активный слой-контур и не могут его покинуть
 * @class Contour
 * @constructor
 * @extends paper.Layer
 * @menuorder 30
 * @tooltip Контур (слой) изделия
 */
class Contour extends AbstractFilling(paper.Layer) {

  constructor(attr) {

    super({parent: attr.parent, project: attr.project});

    this._attr = {};

    // узлы и рёбра текущего слоя
    this._skeleton = new Skeleton(this);

    const {project} = this;

    // строка в таблице конструкций
    this._row = attr.row;

    if(attr.direction) {
      this.direction = attr.direction;
    }
    if(attr.furn && typeof attr.furn !== 'string') {
      this.furn = attr.furn || this.default_furn;
    }

    // добавляем элементы контура
    const ox = attr.ox || project.ox;
    this.prms = new BuilderPrms({layer: this});
    this.create_children({coordinates: ox.coordinates, cnstr: this.cnstr});

    project.l_connective.bringToFront();

  }

  get ProfileConstructor() {
    return Profile;
  }

  /**
   * ### Фурнитура по умолчанию
   * Возвращает фурнитуру текущего слоя по умолчанию
   *
   * @property default_furn
   * @final
   */
  get default_furn() {
    // ищем ранее выбранную фурнитуру для системы
    let {sys} = this;
    let res;
    const {job_prm: {builder}, cat} = $p;
    while (true) {
      res = builder.base_furn[sys.ref];
      if(res || sys.empty()) {
        break;
      }
      sys = sys.parent;
    }
    if(!res) {
      res = builder.base_furn.null;
    }
    if(!res) {
      const furns = this.sys.furns(this._ox, this);
      if(furns.length) {
        const {cache, cnstr, _ox} = this;
        for(const {furn} of furns) {
          if(furn.is_folder || this.open_restrictions_err({furn, cache, bool: true})) {
            continue;
          }
          const weight_max = furn.furn_set.flap_weight_max;
          if(weight_max && weight_max < _ox.elm_weight(-cnstr)) {
            continue;
          }
          res = furn;
          break;
        }
      }
    }
    if(!res) {
      cat.furns.find_rows({is_folder: false, is_set: false, id: {not: ''}}, (row) => {
        res = row;
        return false;
      });
    }
    return res;
  }

  /**
   * Создаёт дочерние элементы
   * @param coordinates {TabularSection}
   * @param cnstr {Number}
   */
  create_children({coordinates, cnstr}) {

    if (!cnstr) {
      return;
    }

    const {elm_types} = $p.enm;
    const glasses = [];
    coordinates.find_rows({cnstr, region: 0}, (row) => {
      const attr = {row, parent: this};
      // профили и доборы
      if(row.elm_type === elm_types.attachment) {
        new this.ProfileConstructor(attr);
      }
      else if(elm_types.profiles.includes(row.elm_type)) {
        row.elm_type === elm_types.impost ? new Profile(attr) : new this.ProfileConstructor(attr);
      }
      // заполнения
      else if(elm_types.glasses.includes(row.elm_type)) {
        glasses.push(row);
      }
      // разрезы
      else if(row.elm_type === elm_types.drainage) {
        new Sectional(attr)
      }
      // остальные элементы (текст)
      else if(row.elm_type === elm_types.text) {
        new FreeText({row, parent: this.l_text})
      }
    });
    for(const row of glasses) {
      new Filling({row, parent: this});
    }
  }

  /**
   *
   * @param attr
   * @return {Contour}
   */
  static create(attr = {}) {
    let {kind, row, project} = attr;
    if(typeof kind === 'undefined') {
      kind = row ? row.kind : 0;
    }
    let Constructor = Contour;
    if(kind === 1) {
      Constructor = ContourVirtual;
    }
    else if(kind === 2) {
      Constructor = ContourNested;
    }
    else if(kind === 3) {
      Constructor = ContourParent;
    }
    else if(attr.parent instanceof ContourNestedContent || attr.parent instanceof ContourNested) {
      Constructor = ContourNestedContent;
    }

    // строка в таблице конструкций
    if (!attr.row) {
      const {constructions} = project.ox;
      attr.row = constructions.add({parent: attr.parent ? attr.parent.cnstr : 0});
      attr.row.cnstr = constructions.aggregate([], ['cnstr'], 'MAX') + 1;
    }
    if(kind) {
      attr.row.kind = kind;
    }
    // оповещаем мир о новых слоях
    const contour = new Constructor(attr);
    project._scope.eve.emit_async('rows', contour._ox, {constructions: true});
    return contour;
  }

  presentation(bounds) {
    if(!bounds){
      bounds = this.bounds;
    }
    const {_ox, cnstr, layer} = this;
    const weight = _ox.elm_weight(-cnstr);
    return (layer ? 'Створка №' : 'Рама №') + cnstr +
      (bounds ? ` ${bounds.width.toFixed()}х${bounds.height.toFixed()}` : '') +
      (weight ? `, ${weight.toFixed()}кг` : '');
  }

  /**
   * Синоним presentation
   * @return {String}
   */
  get info() {
    return this.presentation();
  }

  /**
   * Ключ слоя - переопределяется для вложение
   * @return {String}
   */
  get key() {
    return this.cnstr.toFixed();
  }

  /**
   * Тип слоя
   * @return {Number}
   */
  get kind() {
    let {kind} = this._row;
    let layer = this;
    while (kind === 0 && layer) {
      layer = layer.layer;
      if(!layer) {
        break;
      }
      if([10, 11].includes(layer._row.kind)) {
        kind = layer._row.kind;
      }
    }
    return kind;
  }

  /**
   * Текущий или слой верхнего уровня для вытягивания в заказ
   * @return {Contour}
   */
  prod_layer() {
    let {kind} = this._row;
    let layer = this;
    while (kind === 0 && layer) {
      layer = layer.layer;
      if(!layer) {
        break;
      }
      if([10, 11].includes(layer._row.kind)) {
        return layer;
      }
    }
    return [10, 11].includes(kind) ? layer : null;
  }

  /**
   * ### Возвращает строку svg слоя
   *    *
   * @method get_svg
   * @param [attr] {Object}
   */
  get_svg(attr = {}) {
    for(const item of this.children) {
      item.selected = false;
    }
    const options = attr.export_options || {};
    if(!options.precision) {
      options.precision = 1;
    }

    const svg = this.exportSVG(options);
    const bounds = this.strokeBounds.unite(this.l_dimensions.strokeBounds);

    svg.setAttribute('x', bounds.x);
    svg.setAttribute('y', bounds.y);
    svg.setAttribute('width', bounds.width + 40);
    svg.setAttribute('height', bounds.height);
    svg.querySelector('g').removeAttribute('transform');

    return svg.outerHTML;
  }

  /**
   * Перемещает слой выше-ниже по координате Z
   * @param {('up'|'down')} direction
   */
  bring(direction = 'up') {
    const {layer, project, _row} = this;
    const contours = layer ? layer.contours : project.contours;
    const index = contours.indexOf(this);
    if(contours.length < 2 || (direction === 'down' && index === 0) || (direction === 'up' && index === contours.length - 1) ) {
      return;
    }
    const other = direction === 'up' ? contours[index + 1] : contours[index - 1];
    if(direction === 'up') {
      this.insertAbove(other);
    }
    else {
      this.insertBelow(other);
    }
    _row._owner.swap(_row, other._row);
  }

  /**
   * Врезаем оповещение при активации слоя
   */
  activate(custom) {
    this.project._activeLayer = this;
    if (this._row) {
      this.notify(this, 'layer_activated', !custom);
      this.project.register_update();
    }
  }

  /**
   * Продукция текущего слоя
   * Для вложенных, отличается от изделия проекта
   * @return {CatCharacteristics}
   */
  get _ox() {
    const {layer, project} = this;
    return layer ? layer._ox : project.ox;
  }

  /**
   * Продукция слоя c учётом вытягивания
   * @return {CatCharacteristics}
   */
  get prod_ox() {
    const layer = this.prod_layer();
    if(layer) {
      const {project: {ox}, cnstr} = layer;
      let cx;
      ox.calc_order.production.find_rows({ordn: ox}, ({characteristic}) => {
        if(characteristic.leading_elm === -cnstr && characteristic.origin.empty()) {
          cx = characteristic;
          return false;
        }
      });
      if(cx) {
        return cx;
      }
    }
    return this._ox;
  }

  /**
   * Отдел абрнента текущего слоя получаем из проекта
   * @return {CatBranches}
   */
  get branch() {
    return this.project.branch;
  }

  /**
   * ### Габаритная площадь контура
   */
  get area() {
    return (this.bounds.area/1e6).round(3);
  }

  /**
   * ### площадь контура с учетом наклонов-изгибов профиля
   * Получаем, как сумму площадей всех заполнений и профилей контура
   * Вычисления тяжелые, но в общем случае, с учетом незамкнутых контуров и соединений с пустотой, короче не сделать
   */
  get form_area() {
    let upath;
    this.glasses(false, true).concat(this.profiles).forEach(({path}) => {
      if(upath) {
        upath = upath.unite(path, {insert: false});
      }
      else {
        upath = path.clone({insert: false});
      }
    });
    return (upath.area/1e6).round(3);
  }

  /**
   * указатель на фурнитуру
   */
  get furn() {
    return this._row.furn;
  }

  set furn(v) {
    const {_row, profiles, project, sys, level} = this;

    if(sys.furn_level > level) {
      v = _row.furn._manager.get();
    }

    if (_row.furn == v) {
      return;
    }

    _row.furn = v;

    // при необходимости устанавливаем направление открывания
    if (this.direction.empty()) {
      sys.furn_params.find_rows({param: $p.job_prm.properties.direction}, ({value}) => {
        _row.direction = value;
        return false;
      });
    }

    // перезаполняем параметры фурнитуры
    _row.furn.refill_prm(this);

    // двигаем по Z
    switch(_row.furn.shtulp_kind()) {
    case 2: // пассивная
      this.bring('down');
      break;
    case 1: // активная
      this.bring('up');
    }

    // пересчитываем вставки и соединения, если они зависят от параметров фурнитуры
    for(const {_attr} of profiles) {
      _attr._rays && _attr._rays.clear('with_neighbor');
    }

    project.register_change(true);

    this.notify(this, 'furn_changed');
  }

  /**
   * Возвращает массив заполнений + створок текущего контура
   * @property glasses
   * @for Contour
   * @param [hide] {Boolean} - если истина, устанавливает для заполнений visible=false
   * @param [glass_only] {Boolean} - если истина, возвращает только заполнения
   * @returns {Array}
   */
  glasses(hide, glass_only) {
    return this.children.filter((elm) => {
      if ((!glass_only && elm instanceof Contour) || elm instanceof Filling) {
        if (hide) {
          elm.visible = false;
        }
        return true;
      }
    });
  }

  /**
   * Возвращает массив заполнений текущего и вложенного контуров
   */
  get fillings() {
    const fillings = [];
    for(const glass of this.glasses()){
      if(glass instanceof Contour){
        fillings.push.apply(fillings, glass.fillings);
      }
      else{
        fillings.push(glass);
      }
    }
    return fillings;
  }

  /**
   * Возвращает массив массивов сегментов - база для построения пути заполнений
   * @property glass_contours
   * @type Array
   */
  get glass_contours() {
    const segments = this.glass_segments;
    const nodes = this.count_nodes();
    const res = [];
    let curr, acurr;

    // рекурсивно получает следующий сегмент, пока не уткнётся в текущий
    function go_go(segm) {
      const anext = GlassSegment.next(segm, nodes, segments);
      for (const next of anext) {
        if (next === curr) {
          return anext;
        }
        else if (acurr.every((el) => el !== next)) {
          acurr.push(next);
          return go_go(next);
        }
      }
    }

    while (segments.length) {

      curr = segments[0];
      acurr = [curr];
      if (go_go(curr) && acurr.length > 1) {
        res.push(acurr);
      }

      // удаляем из segments уже задействованные или не пригодившиеся сегменты
      acurr.forEach((el) => {
        const ind = segments.indexOf(el);
        if (ind != -1) {
          segments.splice(ind, 1);
        }
      });
    }

    return res;
  }

  /**
   * Ищет и привязывает узлы профилей к пути заполнения
   * @method glass_nodes
   * @for Contour
   * @param path {paper.Path} - массив ограничивается узлами, примыкающими к пути
   * @param [nodes] {Array} - если указано, позволяет не вычислять исходный массив узлов контура, а использовать переданный
   * @param [bind] {Boolean} - если указано, сохраняет пары узлов в path._attr.curve_nodes
   * @returns {Array}
   */
  glass_nodes(path, nodes, bind) {
    const curve_nodes = [];
    const path_nodes = [];
    const ipoint = path.interiorPoint.negate();
    let curve, findedb, findede, d, node1, node2;

    if (!nodes) {
      nodes = this.nodes;
    }

    // имеем путь и контур.
    for (let i in path.curves) {
      curve = path.curves[i];

      // в node1 и node2 получаем ближайший узел контура к узлам текущего сегмента
      let d1 = Infinity;
      let d2 = Infinity;
      nodes.forEach((n) => {
        if ((d = n.getDistance(curve.point1, true)) < d1) {
          d1 = d;
          node1 = n;
        }
        if ((d = n.getDistance(curve.point2, true)) < d2) {
          d2 = d;
          node2 = n;
        }
      });

      // в path_nodes просто накапливаем узлы. наверное, позже они будут упорядочены
      if (path_nodes.indexOf(node1) == -1)
        path_nodes.push(node1);
      if (path_nodes.indexOf(node2) == -1)
        path_nodes.push(node2);

      if (!bind)
        continue;

      // заполнение может иметь больше курв, чем профиль
      if(node1 === node2) {
        continue;
      }
      findedb = false;
      for (let n in curve_nodes) {
        if (curve_nodes[n].node1 == node1 && curve_nodes[n].node2 == node2) {
          findedb = true;
          break;
        }
      }
      if (!findedb) {
        findedb = this.profile_by_nodes(node1, node2);
        const loc1 = findedb.generatrix.getNearestLocation(node1);
        const loc2 = findedb.generatrix.getNearestLocation(node2);
        // уточняем порядок нод
        if (node1.add(ipoint).getDirectedAngle(node2.add(ipoint)) < 0)
          curve_nodes.push({
            node1: node2,
            node2: node1,
            profile: findedb,
            out: loc2.index == loc1.index ? loc2.parameter > loc1.parameter : loc2.index > loc1.index,
          });
        else
          curve_nodes.push({
            node1: node1,
            node2: node2,
            profile: findedb,
            out: loc1.index == loc2.index ? loc1.parameter > loc2.parameter : loc1.index > loc2.index,
          });
      }
    }

    this.sort_nodes(curve_nodes);

    return path_nodes;
  }

  /**
   * Вычисляет рейтинг контура для заполнения
   * @param glcontour
   * @param glass
   * @return {number}
   */
  calck_rating(glcontour, glass) {

    const {outer_profiles} = glass;
    let crating = 0;

    // если есть привязанные профили, используем их. иначе - координаты узлов
    if (outer_profiles.length) {
      for(const cnt of glcontour) {
        for(const curr of outer_profiles) {
          if(cnt.profile == curr.profile && cnt.b.is_nearest(curr.b) && cnt.e.is_nearest(curr.e)) {
            crating++;
            break;
          }
        }
        if (crating > 2) {
          break;
        }
      }
    }
    else {
      const {nodes} = glass;
      for(const cnt of glcontour) {
        for(const node of nodes) {
          if (cnt.b.is_nearest(node)) {
            crating++;
            break;
          }
        }
        if (crating > 2) {
          break;
        }
      }
    }

    return crating;
  }

  /**
   * Получает замкнутые контуры, ищет подходящие створки или заполнения, при необходимости создаёт новые
   * @method glass_recalc
   * @for Contour
   */
  glass_recalc() {
    const {glass_contours} = this;      // массиы новых рёбер
    const glasses = this.glasses(true); // массив старых заполнений
    const binded = new Set();

    // сначала, пробегаем по заполнениям и пытаемся оставить их на месте
    for(const glass of glasses) {
      if (glass.visible) {
        continue;
      }
      for(const glcontour of glass_contours) {
        if (binded.has(glcontour)) {
          continue;
        }
        if ((glass_contours.length === 1 && !binded.size) || this.calck_rating(glcontour, glass) > 2) {
          glass.path = glcontour;
          glass.visible = true;
          if (glass instanceof Filling) {
            glass.redraw();
          }
          binded.add(glcontour);
          break;
        }
      }
    }

    // бежим по найденным контурам заполнений и выполняем привязку
    for(const glcontour of glass_contours) {
      if (binded.has(glcontour)) {
        continue;
      }

      let rating = 0, glass, crating, cglass, glass_center;

      for (const g in glasses) {

        glass = glasses[g];
        if (glass.visible) {
          continue;
        }

        // вычисляем рейтинг
        crating = this.calck_rating(glcontour, glass);

        if (crating > rating || !cglass) {
          rating = crating;
          cglass = glass;
        }
        if (crating == rating && cglass != glass) {
          if (!glass_center) {
            glass_center = glcontour.reduce((sum, val) => sum.add(val.b), new paper.Point).divide(glcontour.length);
          }
          if (glass_center.getDistance(glass.bounds.center, true) < glass_center.getDistance(cglass.bounds.center, true)) {
            cglass = glass;
          }
        }
      }

      // TODO реализовать настоящее ранжирование
      if (cglass || (cglass = this.getItem({class: Filling, visible: false}))) {
        cglass.path = glcontour;
        cglass.visible = true;
        if (cglass instanceof Filling) {
          cglass.redraw();
        }
      }
      else {
        // добавляем заполнение
        // 1. ищем в изделии любое заполнение
        // 2. если не находим, используем умолчание системы
        if (glass = this.getItem({class: Filling})) {

        }
        else if (glass = this.project.getItem({class: Filling})) {

        }
        else {

        }
        cglass = new Filling({proto: glass, parent: this, path: glcontour});
        cglass.redraw();
      }
    }
  }

  /**
   * Возвращает массив отрезков, которые потенциально могут образовывать заполнения
   * (соединения с пустотой отбрасываются)
   * @property glass_segments
   * @type Array
   */
  get glass_segments() {
    const nodes = [];

    function push_new(profile, b, e, outer = false) {
      if(b.is_nearest(e, 0)){
        return;
      }
      for(const segm of nodes) {
        if(segm.profile === profile && segm.b.is_nearest(b, 0) && segm.e.is_nearest(e, 0) && segm.outer == outer){
          return;
        }
      }
      nodes.push(new GlassSegment(profile, b, e, outer));
    }

    // для всех профилей контура
    for(const p of this.profiles) {
      const sort = GlassSegment.fn_sort.bind(p.generatrix);

      // ищем примыкания T к текущему профилю
      const ip = p.joined_imposts();
      const {b: pb, e: pe} = p.rays;

      // для створочных импостов используем не координаты их b и e, а ближайшие точки примыкающих образующих
      const pbg = pb.is_t && pb.profile.d0 ? pb.profile.generatrix.getNearestPoint(p.b) : p.b;
      const peg = pe.is_t && pe.profile.d0 ? pe.profile.generatrix.getNearestPoint(p.e) : p.e;

      // если есть примыкания T, добавляем сегменты, исключая соединения с пустотой
      if (ip.inner.length) {

        ip.inner.sort(sort);

        if (!pb.is_i && !pbg.is_nearest(ip.inner[0].point)) {
          push_new(p, pbg, ip.inner[0].point);
        }

        for (let i = 1; i < ip.inner.length; i++) {
          push_new(p, ip.inner[i - 1].point, ip.inner[i].point);
        }

        if (!pe.is_i && !ip.inner[ip.inner.length - 1].point.is_nearest(peg)) {
          push_new(p, ip.inner[ip.inner.length - 1].point, peg);
        }

      }
      if (ip.outer.length) {

        ip.outer.sort(sort);

        if (!pb.is_i && !ip.outer[0].point.is_nearest(pbg)) {
          push_new(p, ip.outer[0].point, pbg, true);
        }

        for (let i = 1; i < ip.outer.length; i++) {
          push_new(p, ip.outer[i].point, ip.outer[i - 1].point, true);
        }

        if (!pe.is_i && !peg.is_nearest(ip.outer[ip.outer.length - 1].point)) {
          push_new(p, peg, ip.outer[ip.outer.length - 1].point, true);
        }
      }

      // добавляем, если нет соединений с пустотой
      if (!ip.inner.length) {
        if (!pb.is_i && !pe.is_i) {
          push_new(p, pbg, peg);
        }
      }

      // для импостов добавляем сегмент в обратном направлении
      if (!ip.outer.length && (pb.is_cut || pe.is_cut || pb.is_t || pe.is_t)) {
        if (!pb.is_i && !pe.is_i) {
          push_new(p, peg, pbg, true);
        }
      }
      else if(pb.is_x || pe.is_x) {
        push_new(p, peg, pbg, true);
      }
    }

    return nodes;
  }

  /**
   * Признак прямоугольности
   */
  get is_rectangular() {
    const {Импост} = $p.enm.elm_types;
    const outer = this.profiles.filter((v) => v.elm_type != Импост);
    return outer.length === 4 && !outer.some(profile => !(profile.is_linear() && Math.abs(profile.angle_hor % 90) < 0.2));
  }

  move(delta) {
    const {contours, profiles, project} = this;
    const crays = (p) => p.rays.clear();
    this.translate(delta);
    contours.forEach((elm) => elm.profiles.forEach(crays));
    profiles.forEach(crays);
    project.register_change();
  }

  /**
   * Возвращает массив узлов текущего контура
   * @property nodes
   * @type Array
   */
  get nodes() {
    const nodes = [];
    this.profiles.forEach(({b, e}) => {
      let findedb;
      let findede;
      nodes.forEach((n) => {
        if (b && b.is_nearest(n)) {
          findedb = true;
        }
        if (e && e.is_nearest(n)) {
          findede = true;
        }
      });
      if (!findedb && b) {
        nodes.push(b.clone());
      }
      if (!findede && e) {
        nodes.push(e.clone());
      }
    });
    return nodes;
  }

  /**
   * Рассчитывает количество профилей в узлах
   * @return {Map<any, any>}
   */
  count_nodes() {
    const nodes = new PointMap();
    this.profiles.forEach((profile) => {
      const {b, e} = profile;
      let findedb;
      let findede;
      for(const [key, value] of nodes) {
        if (b && b.is_nearest(key)) {
          value.push({profile, point: 'b'})
          findedb = true;
        }
        if (e && e.is_nearest(key)) {
          value.push({profile, point: 'e'})
          findede = true;
        }
      }
      if (!findedb && b) {
        nodes.set(b.clone(), [{profile, point: 'b'}]);
      }
      if (!findede && e) {
        nodes.set(e.clone(), [{profile, point: 'e'}]);
      }
    });
    return nodes;
  }

  /**
   * Формирует оповещение для тех, кто следит за this._noti
   * @param obj
   */
  notify(obj, type = 'update') {
    if (obj.type) {
      type = obj.type;
    }
    this.project._scope.eve.emit_async(type, obj);
    type === consts.move_points && this.project.register_change();
  }

  /**
   * Возвращает массив внешних профилей текущего контура. Актуально для створок, т.к. они всегда замкнуты
   * @property outer_nodes
   * @type Array
   */
  get outer_nodes() {
    return this.outer_profiles.map((v) => v.elm);
  }

  /**
   * Возвращает массив внешних и примыкающих профилей текущего контура
   */
  get outer_profiles() {
    // сначала получим все профили
    const {profiles} = this;
    const to_remove = [];
    const res = [];

    let findedb, findede;

    // прочищаем, выкидывая такие, начало или конец которых соединениы не в узле
    for (let i = 0; i < profiles.length; i++) {
      const elm = profiles[i];
      if (elm._attr.simulated)
        continue;
      findedb = false;
      findede = false;
      for (let j = 0; j < profiles.length; j++) {
        if (profiles[j] == elm)
          continue;
        if (!findedb && elm.has_cnn(profiles[j], elm.b) && elm.b.is_nearest(profiles[j].e))
          findedb = true;
        if (!findede && elm.has_cnn(profiles[j], elm.e) && elm.e.is_nearest(profiles[j].b))
          findede = true;
      }
      if (!findedb || !findede){
        to_remove.push(elm);
      }
    }
    for (let i = 0; i < profiles.length; i++) {
      const elm = profiles[i];
      if (to_remove.indexOf(elm) != -1)
        continue;
      elm._attr.binded = false;
      res.push({
        elm: elm,
        profile: elm.nearest(true),
        b: elm.b,
        e: elm.e,
      });
    }
    return res;
  }

  /**
   * Возвращает профиль по номеру стороны фурнитуры, учитывает направление открывания, по умолчанию - левое
   * - первая первая сторона всегда нижняя
   * - далее, по часовой стрелке 2 - левая, 3 - верхняя и т.д.
   * - если направление правое, обход против часовой
   * @param side {Number}
   * @param cache {Object}
   */
  profile_by_furn_side(side, cache) {

    if (!cache || !cache.profiles) {
      cache = {
        profiles: this.outer_nodes,
        bottom: this.profiles_by_side('bottom'),
      };
    }

    const profile_node = this.direction == $p.enm.open_directions.Правое ? 'b' : 'e';
    const other_node = profile_node == 'b' ? 'e' : 'b';

    let profile = cache.bottom;

    const next = () => {
      side--;
      if (side <= 0) {
        return profile;
      }

      cache.profiles.some((curr) => {
        if (curr[other_node].is_nearest(profile[profile_node])) {
          profile = curr;
          return true;
        }
      });

      return next();
    };

    return next();

  }


  /**
   * Возвращает ребро текущего контура по узлам
   * @param n1 {paper.Point} - первый узел
   * @param n2 {paper.Point} - второй узел
   * @param [point] {paper.Point} - дополнительная проверочная точка
   * @returns {Profile}
   */
  profile_by_nodes(n1, n2, point) {
    const {profiles} = this;
    for (let i = 0; i < profiles.length; i++) {
      const {generatrix} = profiles[i];
      if (generatrix.getNearestPoint(n1).is_nearest(n1) && generatrix.getNearestPoint(n2).is_nearest(n2)) {
        if (!point || generatrix.getNearestPoint(point).is_nearest(point))
          return profiles[i];
      }
    }
  }

  /**
   * Удаляет контур из иерархии проекта
   * Одновлеменно, удаляет строку из табчасти _Конструкции_ и подчиненные строки из табчасти _Координаты_
   * @method remove
   */
  remove() {

    // сначала удаляем створки и заполнения
    for(const elm of this.glasses()) {
      elm.remove();
    }

    // затем - импосты
    for(const elm of this.imposts.reverse()) {
      elm.remove();
    }

    // и всех остальных детей
    const {children, project, _row, cnstr, _ox} = this;
    while (children.length) {
      children[0].remove();
    }

    project._scope.eve.emit('elm_removed', this);

    if (_row) {
      if(!project.ox.empty()) {
        if(_ox === _row._owner._owner) {
          _ox.coordinates.clear({cnstr});
          _ox.params.clear({cnstr});
          _ox.inserts.clear({cnstr});
        }
        _row._owner.del(_row);
      }
      this._row = null;
    }

    // стандартные действия по удалению элемента paperjs
    super.remove();
  }

  /**
   * виртуальный датаменеджер для автоформ
   */
  get _manager() {
    return this.project._dp._manager;
  }

  /**
   * виртуальные метаданные для автоформ
   */
  _metadata(fld) {

    const {tabular_sections, fields: {sys}} = this._ox._metadata();
    const {fields} = tabular_sections.constructions;

    if(fld === 'sys') {
      return sys;
    }

    return fld ? (fields[fld] || tabular_sections[fld]) : {
      fields: {
        furn: fields.furn,
        direction: fields.direction,
        h_ruch: fields.h_ruch,
        flipped: fields.flipped,
        sys,
      },
      tabular_sections: {
        params: tabular_sections.params,
      },
    };

  }

  /**
   * Габариты по внешним краям профилей контура
   */
  get bounds() {
    const {_attr, parent} = this;
    if (!_attr._bounds || !_attr._bounds.width || !_attr._bounds.height) {

      this.profiles.forEach((profile) => {
        const path = profile.path && profile.path.segments.length ? profile.path : profile.generatrix;
        if (path) {
          _attr._bounds = _attr._bounds ? _attr._bounds.unite(path.bounds) : path.bounds;
          if (!parent) {
            const {d0} = profile;
            if (d0) {
              _attr._bounds = _attr._bounds.unite(profile.generatrix.bounds);
            }
          }
        }
      });
      this.sectionals.forEach((sectional) => {
        _attr._bounds = _attr._bounds ? _attr._bounds.unite(sectional.bounds) : sectional.bounds;
      });

      if (!_attr._bounds) {
        _attr._bounds = new paper.Rectangle();
      }
    }
    return _attr._bounds;
  }

  /**
   * Габариты по образующим
   */
  get lbounds() {
    const parent = new paper.Group({insert: false});
    for (const {generatrix} of this.profiles) {
      parent.addChild(generatrix.clone({insert: false}));
    }
    return parent.bounds;
  }

  /**
   * Номер конструкции текущего слоя
   */
  get cnstr() {
    return this._row ? this._row.cnstr : 0;
  }

  set cnstr(v) {
    this._row && (this._row.cnstr = v);
  }

  /**
   * Габариты с учетом пользовательских размерных линий, чтобы рассчитать отступы автолиний
   */
  get dimension_bounds() {
    let bounds = super.dimension_bounds;
    const ib = this.l_visualization._by_insets.bounds;
    if (ib.height && ib.bottom > bounds.bottom) {
      const delta = ib.bottom - bounds.bottom + 10;
      bounds = bounds.unite(
        new paper.Rectangle(bounds.bottomLeft, bounds.bottomRight.add([0, delta < 250 ? delta * 1.1 : delta * 1.2]))
      );
    }
    for(const profile of this.profiles) {
      for(const adj of profile.adjoinings) {
        bounds = bounds.unite(adj.bounds);
      }
    }
    return bounds;
  }

  /**
   * Направление открывания
   */
  get direction() {
    return this._row.direction;
  }

  set direction(v) {
    this._row.direction = v;
    this.project.register_change(true);
  }

  /**
   * Открывание (внутрь, наружу)
   */
  get opening() {
    const {enm, cch} = $p;
    const param = cch.properties.predefined('opening');
    let res = enm.opening.in;
    if(param && !param.empty()) {
      const {params, cnstr} = this;
      params.find_rows({param, cnstr: {in: [0, cnstr]}}, (row)  => {
        res = enm.opening.get(row.value);
        if(row.cnstr === cnstr) {
          return false;
        }
      });
    }
    return res;
  }

  set opening(v) {
    const param = $p.cch.properties.predefined('opening');
    if(param && !param.empty()) {
      const {params, cnstr} = this;
      const row = params.find({param, cnstr});
      if(row) {
        row.value = v;
      }
      else {
        params.add({param, cnstr, value: v});
      }
      this.project.register_change(true);
    }
  }

  /**
   * ### Изменяет центр и масштаб, чтобы слой вписался в размер окна
   * Используется инструментом {{#crossLink "ZoomFit"}}{{/crossLink}}, вызывается при открытии изделия и после загрузки типового блока
   *
   * @method zoom_fit
   */
  zoom_fit() {
    this.project.zoom_fit.call(this, null, true);
  }

  /**
   * Рисует ошибки статики
   */
  draw_static_errors() {
    const {l_visualization, sys} = this;

    if(!sys.check_static) {
      return;
    }

    const {Рама, Импост} = $p.enm.elm_types;

    if(l_visualization._static) {
      l_visualization._static.removeChildren();
    }
    else {
      l_visualization._static = new paper.Group({parent: l_visualization});
    }

    for (var i = 0; i < this.profiles.length; i++) {

      if([Рама, Импост].includes(this.profiles[i].elm_type) &&
        this.profiles[i].static_load().can_use === false) {
        //this.profiles[i].err_spec_row($p.job_prm.nom.static_error);
        new paper.Path.Circle({
          center: this.profiles[i].bounds.center,
          radius: 20,
          strokeColor: 'blue',
          strokeWidth: 4,
          strokeCap: 'round',
          strokeScaling: false,
          guide: true,
          parent: l_visualization._static,
          fillColor: 'red'
        });
      }
    }
  }

  /**
   * Рисует ошибки соединений
   */
  draw_cnn_errors() {

    const {l_visualization, project: {_scope: {eve}}} = this;

    if (l_visualization._cnn) {
      l_visualization._cnn.removeChildren();
    }
    else {
      l_visualization._cnn = new paper.Group({parent: l_visualization});
    }

    if(eve._async?.move_points?.timer) {
      return;
    }

    const err_attrs = {
      strokeColor: 'red',
      strokeWidth: 2,
      strokeCap: 'round',
      strokeScaling: false,
      dashOffset: 4,
      dashArray: [4, 4],
      guide: true,
      parent: l_visualization._cnn,
    };

    // ошибки соединений с заполнениями
    this.glasses(false, true).forEach(glass => {
      let err;
      const {_row, path, profiles, imposts, inset} = glass;
      _row.s = glass.form_area;

      profiles.forEach(({cnn, sub_path}) => {
        if (!cnn) {
          Object.assign(sub_path, err_attrs);
          err = true;
        }
      });

      if (err || path.is_self_intersected() || !inset.check_base_restrictions(inset, glass)) {
        glass.fill_error();
      }
      else {
        path.fillColor = BuilderElement.clr_by_clr.call(glass, _row.clr);
      }

      // Ошибки соединений Onlay в этом заполнении
      imposts.forEach((impost) => {
        if(impost instanceof Onlay) {
          const {b, e} = impost._attr._rays;
          const oerr_attrs = Object.assign({radius: 50}, err_attrs);
          b.check_err(oerr_attrs);
          e.check_err(oerr_attrs);
        }
      });
    });

    // ошибки соединений профиля
    this.profiles.forEach((elm) => {
      const {_corns, _rays} = elm._attr;
      // ошибки угловых (торцевых) соединений
      _rays.b.check_err(err_attrs);
      _rays.e.check_err(err_attrs);
      // ошибки примыкающих соединений
      if (elm.nearest(true) && (!elm._attr._nearest_cnn || elm._attr._nearest_cnn.empty())) {
        const subpath = elm.path.get_subpath(_corns[1], _corns[2]);
        Object.assign(subpath, err_attrs);
        if(elm._attr._nearest instanceof ProfileConnective) {
          subpath.parent = elm._attr._nearest.layer._errors;
        }
      }
      // если у профиля есть доборы, проверим их соединения
      elm.addls.forEach((elm) => {
        if (elm.nearest(true) && (!elm._attr._nearest_cnn || elm._attr._nearest_cnn.empty())) {
          Object.assign(elm.path.get_subpath(_corns[1], _corns[2]), err_attrs);
        }
      });
    });

    l_visualization.bringToFront();
  }

  /**
   * Рисует визуализацию москитки
   */
  draw_mosquito() {
    const {l_visualization, project, _ox} = this;
    const {inserts_types, elm_types, count_calculating_ways} = $p.enm;
    if(project.builder_props.mosquito === false) {
      return;
    }
    _ox.inserts.find_rows({cnstr: this.cnstr}, (row) => {
      if (row.inset.insert_type == inserts_types.МоскитнаяСетка) {
        const props = {
          parent: new paper.Group({parent: l_visualization._by_insets}),
          strokeColor: 'grey',
          strokeWidth: 3,
          dashArray: [6, 4],
          strokeScaling: false,
        };
        let sz, nom, imposts;

        row.inset.specification.forEach((rspec) => {
          if (!sz && rspec.count_calc_method == count_calculating_ways.perim && rspec.nom.elm_type == elm_types.rama) {
            sz = rspec.sz;
            nom = rspec.nom;
          }
          if (!imposts && rspec.count_calc_method == count_calculating_ways.steps && rspec.nom.elm_type == elm_types.Импост) {
            imposts = rspec;
          }
        });

        if(!nom) {
          return false;
        }

        // рисуем контур
        const perimetr = this.perimeter_inner(sz, nom);
        for(const {sub_path} of perimetr) {
          Object.assign(sub_path, props)
        }

        // добавляем текст
        const {elm_font_size} = consts;
        const {bounds} = props.parent;
        new paper.PointText({
          parent: props.parent,
          fillColor: 'black',
          fontFamily: consts.font_family,
          fontSize: consts.elm_font_size,
          guide: true,
          content: row.inset.presentation,
          point: bounds.bottomLeft.add([elm_font_size * 1.2, -elm_font_size * 0.4]),
        });

        // рисуем поперечину
        if (imposts) {
          const {offsets, do_center, step} = imposts;
          const add_impost = function (y) {
            const impost = Object.assign(new paper.Path({
              insert: false,
              segments: [[bounds.left, y], [bounds.right, y]],
            }), props);
            const {length} = impost;
            perimetr.forEach((curr) => {
              const aloc = curr.getIntersections(impost);
              if (aloc.length) {
                const l1 = impost.firstSegment.point.getDistance(aloc[0].point);
                const l2 = impost.lastSegment.point.getDistance(aloc[0].point);
                if (l1 < length / 2) {
                  impost.firstSegment.point = aloc[0].point;
                }
                if (l2 < length / 2) {
                  impost.lastSegment.point = aloc[0].point;
                }
              }
            });
          }

          if(step) {
            const height = bounds.height - offsets;
            if(height >= step) {
              if(do_center) {
                const {top, centerY} = bounds;
                const stp = Math.trunc((-top - (-centerY)) / step); //stp - количество повторений рёбер от центра
                const mv = (top - centerY) / (stp + 1); // размер одного смещения от центра

                add_impost(centerY);
                if(stp >= 1) {
                  for (let y = 1; y <= stp; y += 1) {
                    add_impost(centerY + (mv * y));
                    add_impost(centerY - (mv * y));
                  }
                }
              }
              else {
                for (let y = step; y < height; y += step) {
                  add_impost(y);
                }
              }
            }
          }
        }

        return false;
      }
    });
  }

  /**
   * Рисует визуализацию жалюзи
   */
  draw_jalousie(glass) {
    const {l_visualization, project, _ox} = this;
    if(project.builder_props.jalousie === false) {
      return;
    }
    _ox.inserts.find_rows({cnstr: -glass.elm}, ({inset, clr}) => {
      if(inset.insert_type == $p.enm.inserts_types.Жалюзи) {

        let control, type, shift, step, steps, pos;
        _ox.params.find_rows({inset, cnstr: -glass.elm}, ({param, value}) => {
          if(value.css && ['tb_jalousie_horizontal', 'tb_jalousie_vertical', 'tb_jalousie_roller'].includes(value.css)) {
            type = value.css.replace('tb_jalousie_', '');
          }
          if(value.css && ['tb_jalousie_control-side-left', 'tb_jalousie_control-side-right'].includes(value.css)) {
            control = value.css.replace('tb_jalousie_control-side-', '');
          }
        });
        if(!type) {
          type = 'horizontal';
        }
        if(!control) {
          control = 'left';
        }

        const props = {
          parent: new paper.Group({parent: l_visualization._by_insets}),
          fillColor: BuilderElement.clr_by_clr.call(this, clr),
          shadowColor: 'lightgray',
          shadowBlur: 20,
          shadowOffset: [13, 13],
          opacity: 0.3,
          strokeScaling: false,
          closed: true,
          guide: true,
        };
        const bounds = glass.bounds_light();
        inset.specification.forEach(({count_calc_method, sz, offsets}) => {
          if (count_calc_method == $p.enm.count_calculating_ways.area && sz && offsets) {
            bounds.height += offsets;
            bounds.width += sz;
            bounds.left -= sz * 0.6;
            bounds.top -= offsets * 0.6;
            return false;
          }
        });

        switch (type) {
        case 'roller':
          new paper.Path(Object.assign({
            segments: [bounds.topLeft, bounds.topRight, bounds.bottomRight, bounds.bottomLeft],
          }, props));
          break;

        case 'horizontal':
          steps = Math.floor(bounds.height / 60);
          step = bounds.height / steps - 0.01;
          pos = bounds.top;
          while (pos < bounds.bottom - step) {
            new paper.Path(Object.assign({
              segments: [[bounds.left, pos], [bounds.right, pos], [bounds.right, pos + step - 20], [bounds.left, pos + step - 20]],
            }, props));
            pos += step;
          }
          break;

        case 'vertical':
          steps = Math.floor(bounds.width / 60);
          step = bounds.width / steps - 0.01;
          pos = bounds.left;
          while (pos < bounds.right - step) {
            new paper.Path(Object.assign({
              segments: [[pos, bounds.top], [pos + step - 20, bounds.top], [pos + step - 20, bounds.bottom], [pos, bounds.bottom]],
            }, props));
            pos += step;
          }
          break;
        }

        // рисуем верёвочку
        pos = control === 'left' ? bounds.left - 10 : bounds.right + 10;
        new paper.Path(Object.assign({
          segments: [
            [pos, bounds.top],
            [pos + 10, bounds.top],
            [pos + 10, bounds.bottom - 80],
            [pos + 20, bounds.bottom - 40],
            [pos - 10, bounds.bottom - 40],
            [pos, bounds.bottom - 80],
          ],
        }, props, {
          strokeColor: 'lightgray',
          strokeOpacity: 0.5,
          fillColor: 'gray',
          opacity: 0.6,
        }));
        // и палочку сверху
        new paper.Path(Object.assign({
          segments: [
            bounds.topLeft.add([0, -10]),
            bounds.topRight.add([0, -10]),
            bounds.topRight.add([0, 20]),
            bounds.topLeft.add([0, 20]),
          ],
        }, props, {
          strokeColor: 'lightgray',
          strokeOpacity: 0.5,
          fillColor: 'lightgray',
          opacity: 0.6,
        }));

        // добавляем текст
        const {elm_font_size} = consts;
        new paper.PointText({
          parent: props.parent,
          fillColor: 'black',
          fontFamily: consts.font_family,
          fontSize: consts.elm_font_size,
          guide: true,
          content: inset.presentation,
          point: bounds.topLeft.add([elm_font_size/3, 0]),
        });

        return false;
      }
    });
  }

  /**
   * Рисует визуализацию подоконника
   */
  draw_sill() {
    const {l_visualization, cnstr, _ox} = this;
    const {properties} = $p.job_prm;
    if (!properties) {
      return;
    }
    // указатели на параметры длина и ширина
    const {length, width} = properties;

    _ox.inserts.find_rows({cnstr}, (row) => {
      if (row.inset.insert_type == $p.enm.inserts_types.Подоконник) {

        const bottom = this.profiles_by_side('bottom');
        let vlen, vwidth;
        _ox.params.find_rows({cnstr: cnstr, inset: row.inset}, (prow) => {
          if (prow.param == length) {
            vlen = prow.value;
          }
          if (prow.param == width) {
            vwidth = prow.value;
          }
        });
        if (!vlen) {
          vlen = bottom.length + 160;
        }
        if (vwidth) {
          vwidth = vwidth * 0.7;
        }
        else {
          vwidth = 200;
        }
        const delta = (vlen - bottom.length) / 2;

        new paper.Path({
          parent: new paper.Group({parent: l_visualization._by_insets}),
          strokeColor: 'grey',
          fillColor: BuilderElement.clr_by_clr.call(this, row.clr),
          shadowColor: 'grey',
          shadowBlur: 20,
          shadowOffset: [10, 20],
          opacity: 0.7,
          strokeScaling: false,
          closed: true,
          segments: [
            bottom.b.add([delta, 0]),
            bottom.e.add([-delta, 0]),
            bottom.e.add([-delta - vwidth, vwidth]),
            bottom.b.add([delta - vwidth, vwidth]),
          ],
        });

        return false;
      }
    });
  }

  /**
   * Рисует направление открывания
   */
  draw_opening() {

    const {l_visualization, furn, opening} = this;
    const {open_types, open_directions, opening: {out}} = $p.enm;

    if (!this.parent || !open_types.is_opening(furn.open_type)) {
      if (l_visualization._opening && l_visualization._opening.visible)
        l_visualization._opening.visible = false;
      return;
    }

    // создаём кеш элементов по номеру фурнитуры
    const cache = {
      profiles: this.outer_nodes,
      bottom: this.profiles_by_side('bottom'),
    };

    // рисует линии открывания на поворотной, поворотнооткидной и фрамужной фурнитуре
    const rotary_folding = () => {

      const {_opening} = l_visualization;
      const {side_count} = this;

      furn.open_tunes.forEach((row) => {
        if (row.rotation_axis) {
          const axis = this.profile_by_furn_side(row.side, cache);
          const other = this.profile_by_furn_side(
            row.side + 2 <= side_count ? row.side + 2 : row.side - 2, cache);

          _opening.moveTo(axis.corns(3));
          _opening.lineTo(other.rays.inner.getPointAt(other.rays.inner.length / 2));
          _opening.lineTo(axis.corns(4));

        }
      });

      if(opening === out) {
        _opening.dashArray = [70, 50];
      }
      else if(_opening.dashArray.length) {
        _opening.dashArray = [];
      }

    };

    // рисует линии открывания на раздвижке
    const sliding = () => {
      // находим центр
      const {center} = this.bounds;
      const {_opening} = l_visualization;

      if (this.direction == open_directions.Правое) {
        _opening.moveTo(center.add([-100, 0]));
        _opening.lineTo(center.add([100, 0]));
        _opening.moveTo(center.add([30, 30]));
        _opening.lineTo(center.add([100, 0]));
        _opening.lineTo(center.add([30, -30]));
      }
      else {
        _opening.moveTo(center.add([100, 0]));
        _opening.lineTo(center.add([-100, 0]));
        _opening.moveTo(center.add([-30, 30]));
        _opening.lineTo(center.add([-100, 0]));
        _opening.lineTo(center.add([-30, -30]));
      }
    };

    // подготавливаем слой для рисования
    if (!l_visualization._opening) {
      l_visualization._opening = new paper.CompoundPath({
        parent: l_visualization,
        strokeColor: 'black',
      });
    }
    else {
      l_visualization._opening.removeChildren();
    }

    // рисуем раправление открывания
    return furn.is_sliding ? sliding() : rotary_folding();

  }

  /**
   * Рисует дополнительную визуализацию. Данные берёт из спецификации и проблемных соединений
   */
  draw_visualization(rows) {

    const {profiles, l_visualization, contours, project: {_attr, builder_props}} = this;
    const glasses = this.glasses(false, true).filter(({visible}) => visible);

    l_visualization._by_spec.removeChildren();

    // если кеш строк визуализации пустой - наполняем
    const hide_by_spec = _attr._reflected || !builder_props.visualization;
    if(!rows && !hide_by_spec) {
      rows = [];
      this._ox.specification.find_rows({dop: -1}, (row) => rows.push(row));
    }

    function draw(elm) {
      if(this.elm === elm.elm && elm.visible) {
        this.nom.visualization.draw(elm, l_visualization, this.len * 1000, this.width * 1000 * (this.alp1 || 1));
        return true;
      }
    };

    // рисуем москитки
    this.draw_mosquito();

    // рисуем подоконники
    this.draw_sill();

    // рисуем жалюзи
    glasses.forEach(this.draw_jalousie.bind(this));

    // бежим по строкам спецификации с визуализацией
    if(!hide_by_spec) {
      for (const row of rows) {
        // визуализация для текущего профиля
        if(!profiles.some(draw.bind(row))) {
          // визуализация для текущего заполнения
          glasses.some((elm) => {
            if(row.elm === elm.elm) {
              row.nom.visualization.draw(elm, l_visualization, [row.len * 1000, row.width * 1000]);
              return true;
            }
            // визуализация для текущей раскладки
            return elm.imposts.some(draw.bind(row));
          });
        }
      }
    }

    // подписи профилей
    if(builder_props.articles) {
      for(const profile of profiles) {
        const {rays: {outer}, sizeb, inset, nom} = profile;
        const p0 = outer.getNearestPoint(profile.corns(1));
        const offset = outer.getOffsetOf(p0) + 80;
        const position = outer.getPointAt(offset).add(outer.getNormalAt(offset).multiply((-consts.font_size) / 2));
        const tangent = outer.getTangentAt(offset);

        let content = '→ ';
        switch (builder_props.articles) {
        case 1:
          content += profile.elm.toFixed();
          break;
        case 2:
          content += inset.article || inset.name;
          break;
        case 3:
          content += nom.article || nom.name;
          break;
        case 4:
          content += `${profile.elm.toFixed()} ${inset.article || inset.name}`;
          break;
        case 5:
          content += `${profile.elm.toFixed()} ${nom.article || nom.name}`;
          break;
        }

        const text = new paper.PointText({
          parent: l_visualization._by_spec,
          guide: true,
          //justification: 'left',
          fillColor: 'darkblue',
          fontFamily: consts.font_family,
          fontSize: consts.font_size,
          content,
          position,
        });
        const {width} = text.bounds;
        text.rotate(tangent.angle);
        text.translate(tangent.multiply(width / 2));
      }
    }

    // перерисовываем вложенные контуры
    for(const contour of contours){
      contour.draw_visualization(contour instanceof ContourNestedContent ? null : (contour instanceof ContourNested ? [] : rows));
    }

  }

  get hidden() {
    return !!this._hidden;
  }
  set hidden(v) {
    if (this.hidden != v) {
      this._hidden = v;
      const visible = !this._hidden;
      this.children.forEach((elm) => {
        if (elm instanceof BuilderElement) {
          elm.visible = visible;
        }
      });
      this.l_visualization.visible = visible;
      this.l_dimensions.visible = visible;
    }
  }

  hide_generatrix() {
    this.profiles.forEach((elm) => {
      elm.generatrix.visible = false;
    });
  }

  /**
   * Возвращает массив импостов текущего + вложенных контуров
   * @property imposts
   * @for Contour
   * @returns {Array.<Profile>}
   */
  get imposts() {
    return this.getItems({class: Profile}).filter((elm) => {
      if(elm instanceof ProfileNestedContent) {
        return false;
      }
      const {b, e} = elm.rays;
      return b.is_tt || e.is_tt || b.is_i || e.is_i;
    });
  }

  /**
   * виртуальная табличная часть параметров фурнитуры
   */
  get params() {
    return this._ox.params;
  }

  /**
   * путь контура - при чтении похож на bounds
   * для вложенных контуров определяет положение, форму и количество сегментов створок
   * @property attr {Array}
   */
  get path() {
    return this.bounds;
  }

  set path(attr) {
    if (!Array.isArray(attr)) {
      return;
    }

    const noti = {type: consts.move_points, profiles: [], points: []};
    const {outer_nodes} = this;

    let need_bind = attr.length,
      available_bind = outer_nodes.length,
      elm, curr;

    function set_node(n) {
      if (!curr[n].is_nearest(elm[n], 0)) {
        elm.rays.clear(true);
        elm[n] = curr[n];
        if (!noti.profiles.includes(elm)) {
          noti.profiles.push(elm);
        }
        if (!noti.points.some((point) => point.is_nearest(elm[n], 0))) {
          noti.points.push(elm[n]);
        }
      }
    }

    // первый проход: по двум узлам либо примыканию к образующей
    if (need_bind) {
      for (let i = 0; i < attr.length; i++) {
        curr = attr[i];             // curr.profile - сегмент внешнего профиля
        for (let j = 0; j < outer_nodes.length; j++) {
          elm = outer_nodes[j];   // elm - сегмент профиля текущего контура
          if (elm._attr.binded) {
            continue;
          }
          if (curr.profile.is_nearest(elm)) {
            elm._attr.binded = true;
            curr.binded = true;
            need_bind--;
            available_bind--;

            set_node('b');
            set_node('e');

            break;
          }
        }
      }
    }

    // второй проход: по одному узлу
    if (need_bind) {
      for (let i = 0; i < attr.length; i++) {
        curr = attr[i];
        if (curr.binded)
          continue;
        for (let j = 0; j < outer_nodes.length; j++) {
          elm = outer_nodes[j];
          if (elm._attr.binded)
            continue;
          if (curr.b.is_nearest(elm.b, true) || curr.e.is_nearest(elm.e, true)) {
            elm._attr.binded = true;
            curr.binded = true;
            need_bind--;
            available_bind--;

            set_node('b');
            set_node('e');

            break;
          }
        }
      }
    }

    // третий проход - из оставшихся
    if (need_bind && available_bind) {
      for (let i = 0; i < attr.length; i++) {
        curr = attr[i];
        if (curr.binded)
          continue;
        for (let j = 0; j < outer_nodes.length; j++) {
          elm = outer_nodes[j];
          if (elm._attr.binded)
            continue;
          elm._attr.binded = true;
          curr.binded = true;
          need_bind--;
          available_bind--;
          // TODO заменить на клонирование образующей

          set_node('b');
          set_node('e');

          break;
        }
      }
    }

    // четвертый проход - добавляем
    if (need_bind) {
      for (let i = 0; i < attr.length; i++) {
        curr = attr[i];
        if (curr.binded) {
          continue;
        }
        elm = new this.ProfileConstructor({
          generatrix: curr.profile.generatrix.get_subpath(curr.b, curr.e),
          proto: outer_nodes.length ? outer_nodes[0] : {parent: this, clr: curr.profile.clr},
          _nearest: curr.profile,
        });

        curr.profile = elm;
        delete curr.outer;
        curr.binded = true;

        noti.profiles.push(elm);
        noti.points.push(elm.b);
        noti.points.push(elm.e);

        need_bind--;
      }
    }

    // удаляем лишнее
    if (available_bind) {
      outer_nodes.forEach((elm) => {
        if (!elm._attr.binded) {
          elm.rays.clear(true);
          elm.remove();
          available_bind--;
        }
      });
    }

    // пересчитываем вставки створок
    if(!(this instanceof ContourNestedContent)) {
      this.profiles.forEach((p) => p.default_inset());
    }

    // информируем систему об изменениях
    if (noti.points.length) {
      this.profiles.forEach((p) => p._attr._rays && p._attr._rays.clear());
      this.notify(noti);
    }

    this._attr._bounds = null;
  }

  /**
   * Массив с рёбрами периметра
   * @return {Array}
   */
  get perimeter() {
    const res = [];
    this.outer_profiles.forEach((curr) => {
      const tmp = curr.sub_path ? {
        len: curr.sub_path.length,
        angle: curr.e.subtract(curr.b).angle,
      } : {
        len: curr.elm.length,
        angle: curr.elm.angle_hor,
      };
      res.push(tmp);
      if (tmp.angle < 0) {
        tmp.angle += 360;
      }
      tmp.angle_hor = tmp.angle;
      tmp.profile = curr.profile || curr.elm;
    });
    return res;
  }

  /**
   * Массив с рёбрами периметра по внутренней стороне профилей
   * @param [size] {Number}
   * @param [nom] {CatNom}
   * @return {Array}
   */
  perimeter_inner(size, nom) {
    // накопим в res пути внутренних рёбер профилей
    const {center} = this.bounds;
    const {cat: {cnns}, enm: {cnn_types, elm_types, count_calculating_ways}, CatInserts} = $p;

    // если передали вставку, ищем первую подходящую строку рамки профиля
    if(nom instanceof CatInserts) {
      for(const row of nom.specification) {
        if(row.count_calc_method === count_calculating_ways.perim && row.nom.elm_type === elm_types.rama) {
          nom = row.nom;
          size = row.sz;
        }
      }
    }

    const res = this.outer_profiles.map((curr) => {
      const profile = curr.profile || curr.elm;
      const {inner, outer} = profile.rays;
      const sub_path = inner.getNearestPoint(center).getDistance(center, true) < outer.getNearestPoint(center).getDistance(center, true) ?
        inner.get_subpath(inner.getNearestPoint(curr.b), inner.getNearestPoint(curr.e)) : outer.get_subpath(outer.getNearestPoint(curr.b), outer.getNearestPoint(curr.e));
      let angle = curr.e.subtract(curr.b).angle.round(1);
      if(angle < 0) angle += 360;

      // поправка на размер соединения
      const cnn = nom && cnns.nom_cnn(nom, profile, cnn_types.ii, true)[0];
      const sz = cnn ? cnn.size(profile, profile) : 0;

      return {
        profile,
        sub_path,
        angle,
        b: curr.b,
        e: curr.e,
        size: size + sz,
      };
    });
    const ubound = res.length - 1;
    return res.map((curr, index) => {
      const elong = Math.abs(curr.size) * 2;
      let sub_path = curr.sub_path.equidistant(curr.size, elong);
      const prev = !index ? res[ubound] : res[index - 1];
      const next = (index == ubound) ? res[0] : res[index + 1];
      const b = sub_path.intersect_point(prev.sub_path.equidistant(curr.size, elong), curr.b, true);
      const e = sub_path.intersect_point(next.sub_path.equidistant(curr.size, elong), curr.e, true);
      if (b && e) {
        sub_path = sub_path.get_subpath(b, e);
      }
      return {
        profile: curr.profile,
        angle: curr.angle,
        len: sub_path.length,
        sub_path,
      };
    });
  }

  /**
   * Габариты по рёбрам периметра внутренней стороны профилей
   * @param [size] {Number}
   * @param [nom] {CatNom}
   * @return {Rectangle}
   */
  bounds_inner(size, nom) {
    const path = new paper.Path({insert: false});
    for (let curr of this.perimeter_inner(size, nom)) {
      path.addSegments(curr.sub_path.segments);
    }
    if (path.segments.length && !path.closed) {
      path.closePath(true);
    }
    path.reduce();
    return path.bounds;
  }

  /**
   * Положение контура в изделии или створки в контуре
   */
  get pos() {

  }

  /**
   * Возвращает массив профилей текущего контура
   * @property profiles
   * @for Contour
   * @returns {Array.<Profile>}
   */
  get profiles() {
    return this.children.filter((elm) => elm instanceof Profile);
  }

  /**
   * Массив разрезов
   * @return {Array.<Sectional>}
   */
  get sectionals() {
    return this.children.filter((elm) => elm instanceof Sectional);
  }

  /**
   * Массив примыканий
   * @return {Array.<ProfileAdjoining>}
   */
  get adjoinings() {
    return this.children.filter((elm) => elm instanceof ProfileAdjoining);
  }


  /**
   * Массив раскладок
   * @return {Array.<Onlay>}
   */
  get onlays() {
    const res = [];
    this.fillings.forEach((filling) => {
      filling.children.forEach((elm) => elm instanceof Onlay && res.push(elm));
    })
    return res;
  }


  /**
   * Перерисовывает элементы контура
   * @method redraw
   * @for Contour
   */
  redraw() {

    if (!this.visible || this.hidden) {
      return;
    }

    // сбрасываем кеш габаритов
    this._attr._bounds = null;

    // чистим визуализацию
    const {_by_insets, _by_spec} = this.l_visualization;
    _by_insets.removeChildren();
    !this.project._attr._saving && _by_spec.removeChildren();

    //$p.job_prm.debug && console.profile();

    // сначала перерисовываем все профили контура
    for(const elm of this.profiles) {
      elm.redraw();
    }

    // затем, создаём и перерисовываем заполнения, которые перерисуют свои раскладки
    this.glass_recalc();

    //$p.job_prm.debug && console.profileEnd();

    // рисуем направление открывания
    this.draw_opening();

    // перерисовываем вложенные контуры
    for(const elm of this.contours) {
      elm.redraw();
    }

    // рисуем ошибки соединений
    this.draw_cnn_errors();

    //рисуем ошибки статических прогибов
    this.draw_static_errors();

    // перерисовываем все водоотливы контура
    for(const elm of this.sectionals) {
      elm.redraw();
    }

    // информируем мир о новых размерах нашего контура
    this.notify(this, 'contour_redrawed', this._attr._bounds);

  }

  /**
   * Пересчитывает связи параметров
   * @param root
   */
  refresh_prm_links(root) {

    const cnstr = root ? 0 : this.cnstr || -9999;
    const {project, sys, own_sys, prod_ox} = this;
    const {_dp} = project;
    let notify;

    // пробегаем по всем строкам
    this.params.find_rows({cnstr, inset: $p.utils.blank.guid}, (prow) => {
      const {param} = prow;
      const links = param.params_links({
        grid: {selection: {cnstr}},
        obj: prow,
        layer: this,
      });

      // сокрытие по умолчаниям или связям
      let hide = (!param.show_calculated && param.is_calculated) || links.some((link) => link.hide);
      if(!hide) {
        const drow = sys.prm_defaults(param, own_sys ? 0 : cnstr);
        if(drow && drow.hide) {
          hide = true;
        }
      }

      // проверим вхождение значения в доступные и при необходимости изменим
      if (links.length && param.linked_values(links, prow)) {
        notify = true;
      }
      else if(param.inheritance === 3) {
        const bvalue = param.branch_value({project, cnstr, ox: prod_ox});
        if(prow.value !== bvalue) {
          prow.value = bvalue;
          notify = true;
        }
      }
      if (prow.hide !== hide) {
        prow.hide = hide;
        notify = true;
      }
    });

    // информируем мир о новых размерах нашего контура
    if(notify) {
      this.notify(this, 'refresh_prm_links');
      if(root) {
        _dp._manager.emit_async('rows', _dp, {extra_fields: true});
        project.check_clr();
      }
    };

  }

  /**
   * Пересчитывает пути элементов, если изменились параметры, влияющие на основной материал вставок
   * @param param {CchProperties}
   */
  refresh_inset_depends(param) {
    const {contours, profiles} = this;
    for(const profile of profiles) {
      profile.refresh_inset_depends(param, true);
    }
    for(const glass of this.glasses(false, true)) {
      glass.refresh_inset_depends(param);
    }
    for(const contour of contours) {
      contour.refresh_inset_depends(param);
    }
  }

  /**
   * Вычисляемые поля в таблицах конструкций и координат
   * @method save_coordinates
   * @param short {Boolean} - короткий вариант - только координаты контура
   */
  save_coordinates(short, save, close) {

    let res = Promise.resolve();
    const push = (contour) => {
      res = res.then(() => contour.save_coordinates(short, save, close))
    };

    if (!short) {
      // если контур не скрыт, удаляем скрытые заполнения
      if(!this.hidden) {
        this.glasses(false, true).forEach((glass) => !glass.visible && glass.remove());
      }

      // запись в таблице координат, каждый элемент пересчитывает самостоятельно
      const {l_text, l_dimensions} = this;
      for (let elm of this.children) {
        if (elm.save_coordinates) {
          push(elm);
        }
        else if (elm === l_text || elm === l_dimensions) {
          elm.children.forEach((elm) => elm.save_coordinates && push(elm));
        }
      }
    }

    return res.then(() => {
      // ответственность за строку в таблице конструкций лежит на контуре
      const {bounds} = this;
      this._row.x = bounds ? bounds.width.round(4) : 0;
      this._row.y = bounds ? bounds.height.round(4) : 0;
      this._row.is_rectangular = this.is_rectangular;
      if (this.parent) {
        this._row.w = this.w.round(4);
        this._row.h = this.h.round(4);
      }
      else {
        this._row.w = 0;
        this._row.h = 0;
      }
    });
  }

  /**
   * Упорядочивает узлы, чтобы по ним можно было построить путь заполнения
   * @method sort_nodes
   * @param [nodes] {Array}
   */
  sort_nodes(nodes) {
    if (!nodes.length) {
      return nodes;
    }
    let prev = nodes[0];
    const res = [prev];
    let couner = nodes.length + 1;

    while (res.length < nodes.length && couner) {
      couner--;
      for (let i = 0; i < nodes.length; i++) {
        const curr = nodes[i];
        if (res.indexOf(curr) != -1)
          continue;
        if (prev.node2 == curr.node1) {
          res.push(curr);
          prev = curr;
          break;
        }
      }
    }
    if (couner) {
      nodes.length = 0;
      for (let i = 0; i < res.length; i++) {
        nodes.push(res[i]);
      }
      res.length = 0;
    }
  }

  /**
   * Уровень вложенности слоя
   * @return {number}
   */
  get level() {
    const {layer} = this;
    return layer ? layer.level + 1 : 0;
  }

  /**
   * Система текущего слоя
   * пока, повторяет систему проекта, но в будущем, можем переопределить
   * @return {CatProduction_params}
   */
  get sys() {
    const {layer, project} = this;
    return layer ? layer.sys : project._dp.sys;
  }
  set sys(v) {
    const {layer, project} = this;
    if(layer) {
      layer.sys = v;
    }
    else {
      project._dp.sys = v;
    }
  }

  /**
   * Бит, может ли данный слой иметь собственную систему
   * @return {boolean}
   */
  get own_sys() {
    return this.layer ? false : [10, 11].includes(this.kind);
  }

  /**
   * Возвращает значение параметра с учётом наследования
   * @param param {CchProperties}
   * @param cnstr {Number}
   * @param elm {BuilderElement}
   * @param origin {CatInserts|undefined}
   * @param prm_row
   * @returns {*}
   */
  extract_pvalue({param, cnstr, elm, origin, prm_row}) {
    if(elm?.rnum) {
      return elm[param.valueOf()];
    }
    const {layer, own_sys} = this;
    if(!cnstr) {
      if(layer && !own_sys) {
        return layer.extract_pvalue({param, cnstr, elm, origin, prm_row});
      }
    }
    const {enm: {plan_detailing}, utils, CatInserts} = $p;
    const {_ox} = this;
    if(plan_detailing.eq_product.includes(prm_row.origin) && (!cnstr || cnstr === this.cnstr)) {
      let prow;
      _ox.params.find_rows({
        param,
        cnstr: {in: [0, this.cnstr]},
        inset: (origin instanceof CatInserts || utils.is_guid(origin)) ? origin : utils.blank.guid,
      }, (row) => {
        if(!prow || row.cnstr) {
          prow = row;
          return false;
        }
      });
      if(prow) {
        return prow.value;
      }
      else if(cnstr && layer && !own_sys) {
        return layer.extract_pvalue({param, cnstr: 0, elm, origin, prm_row});
      }
      console.error(`Не задано значений параметра ${param.toString()}`);
      return param.fetch_type();
    }
    return param.extract_pvalue({ox: _ox, cnstr, elm, origin, prm_row});
  }

  /**
   * Кеш используется при расчете спецификации фурнитуры
   * @return {Object}
   */
  get furn_cache() {
    return {
      profiles: this.outer_nodes,
      bottom: this.profiles_by_side('bottom'),
      ox: this._ox,
      w: this.w,
      h: this.h,
    };
  }

  /**
   * Проверяет, подходит ли фурнитура текущему слою
   * @param [furn] {CatFurns}
   * @param [cache] {Object}
   * @param [bool] {Boolean} - только проверка без формирования массива ошибочных профилей
   * @return {Array.<Profile>|boolean}
   */
  open_restrictions_err({furn, cache, bool}) {
    if(!furn) {
      furn = this.furn;
    }
    if(!cache) {
      cache = this.furn_cache;
    }
    let err = [];
    const {side_count, direction, sys} = this;
    const {open_types, open_directions, elm_types} = $p.enm;

    // проверяем количество сторон
    if(furn.open_type !== open_types.Глухое && furn.side_count && side_count !== furn.side_count) {
      if(bool) {
        return true;
      }
      this.profiles.forEach(err.push.bind(err));
    }

    if(!err.length) {
      if(furn.formula.empty()) {
        // геометрия по табчасти настроек открывания
        for(const row of furn.open_tunes) {
          const elm = this.profile_by_furn_side(row.side, cache);
          const prev = this.profile_by_furn_side(row.side === 1 ? side_count : row.side - 1, cache);
          const next = this.profile_by_furn_side(row.side === side_count ? 1 : row.side + 1, cache);
          const len = elm.length - prev.nom.sizefurn - next.nom.sizefurn;

          const angle = direction == open_directions.Правое ?
            elm.generatrix.angle_between(prev.generatrix, elm.e) :
            prev.generatrix.angle_between(elm.generatrix, elm.b);

          const {lmin, lmax, amin, amax} = row;
          if(len < lmin || len > lmax || angle < amin || (angle > amax && amax > 0) || (!elm.is_linear() && !row.arc_available)) {
            if(bool) {
              return true;
            }
            !err.includes(elm) && err.push(elm);
          }
        }
      }
      else {
        // габариты по формуле
        try {
          const path = furn.formula.execute();
          if(!path.contains([cache.w, cache.h])) {
            if(bool) {
              return true;
            }
            this.profiles.forEach(err.push.bind(err));
          }
        }
        catch (e) {}
      }
    }

    // в створках без импоста штульповые не используем и наоборот
    for(const row of furn.open_tunes) {
      const elm = this.profile_by_furn_side(row.side, cache);
      const nearest = elm && elm.nearest();
      if(nearest) {
        if(nearest instanceof ProfileParent || nearest instanceof ProfileVirtual) {
          if(row.shtulp_available) {
            if(bool) {
              return true;
            }
            !err.includes(elm) && err.push(elm);
          }
        }
        else {
          const {elm_type, inset} = nearest;
          if((row.shtulp_available && (elm_type !== elm_types.impost || !sys.is_elm_type(inset, elm_types.shtulp))) ||
            (!row.shtulp_available && !sys.is_elm_type(inset, [elm_types.rama, elm_types.flap, elm_types.impost]))) {
            if(bool) {
              return true;
            }
            !err.includes(elm) && err.push(elm);
          }
        }
      }
    }

    return bool ? false : err;
  }

  /**
   * Возаращает линию, проходящую через ручку
   *
   * @param elm {Profile}
   */
  handle_line(elm) {

    // строим горизонтальную линию от нижней границы контура, находим пересечение и offset
    const {bounds, h_ruch} = this;
    const by_side = this.profiles_by_side();
    return (elm == by_side.top || elm == by_side.bottom) ?
      new paper.Path({
        insert: false,
        segments: [[bounds.left + h_ruch, bounds.top - 200], [bounds.left + h_ruch, bounds.bottom + 200]],
      }) :
      new paper.Path({
        insert: false,
        segments: [[bounds.left - 200, bounds.bottom - h_ruch], [bounds.right + 200, bounds.bottom - h_ruch]],
      });

  }

  /**
   * Уточняет высоту ручки
   * @param cache {Object}
   */
  update_handle_height(cache, from_setter) {

    const {furn, _row, project} = this;
    const {furn_set, handle_side} = furn;
    if (!handle_side || furn_set.empty()) {
      return;
    }

    if (!cache) {
      cache = this.furn_cache;
      cache.ignore_formulas = true;
    }

    // получаем элемент, на котором ручка и длину элемента
    const elm = this.profile_by_furn_side(handle_side, cache);
    if (!elm) {
      return;
    }

    const {len} = elm._row;
    let handle_height;

    function set_handle_height(row) {
      const {handle_height_base, fix_ruch} = row;
      if (handle_height_base < 0) {
        // если fix_ruch - устанавливаем по центру
        if (fix_ruch || _row.fix_ruch != -3) {
          _row.fix_ruch = fix_ruch ? -2 : -1;
          return handle_height = (len / 2).round();
        }
      }
      else if (handle_height_base > 0) {
        // если fix_ruch - устанавливаем по базовой высоте
        if (fix_ruch || _row.fix_ruch != -3) {
          _row.fix_ruch = fix_ruch ? -2 : -1
          return handle_height = handle_height_base;
        }
      }
    }

    // бежим по спецификации набора в поисках строки про ручку
    furn.furn_set.specification.find_rows({dop: 0}, (row) => {

      // проверяем, проходит ли строка
      if (!row.quantity || !row.check_restrictions(this, cache)) {
        return;
      }
      if (set_handle_height(row)) {
        return false;
      }
      const {nom} = row;
      if (nom && row.is_set_row) {
        let ok = false;
        nom.get_spec(this, cache, true).each((sub_row) => {
          if (set_handle_height(sub_row)) {
            return !(ok = true);
          }
        });
        if (ok) {
          return false;
        }
      }
    });

    if(handle_height && !from_setter && _row.h_ruch != handle_height){
      _row.h_ruch = handle_height;
      project._dp._manager.emit('update', this, {h_ruch: true});
    }
    return handle_height;
  }

  /**
   * Высота ручки
   */
  get h_ruch() {
    const {layer, _row} = this;
    return layer ? _row.h_ruch : 0;
  }
  set h_ruch(v) {
    const {layer, _row, project} = this;

    if (layer) {
      const old_fix_ruch = _row.fix_ruch;
      if (old_fix_ruch == -3) {
        _row.fix_ruch = -1;
      }
      const h_ruch = this.update_handle_height(null, true);
      if(h_ruch && (old_fix_ruch != -3 || v == 0)){
        _row.h_ruch = h_ruch;
      }

      // Высота ручки по умолчению
      // >0: фиксированная высота
      // =0: Высоту задаёт оператор
      // <1: Ручка по центру, можно ли редактировать, зависит от реквизита fix_ruch
      if (v != 0 && [0, -1, -3].indexOf(_row.fix_ruch) != -1) {
        _row.h_ruch = v;
        if (_row.fix_ruch == -1 && v != h_ruch) {
          _row.fix_ruch = -3;
        }
      }
      project.register_change();
    }
    else {
      _row.h_ruch = 0;
    }
    project._dp._manager.emit('update', this, {h_ruch: true});
  }

  /**
   * Дополнительные свойства json
   * @return {Object}
   */
  get dop() {
    return this._row.dop;
  }
  set dop(v) {
    this._row.dop = v;
  }

  /**
   * Элемент, вокруг образующей которого повёрнут слой
   * @return {BuilderElement}
   */
  get rotation_elm() {
    const {dop, project} = this;
    return dop.rotation_elm ? project.getItem({class: BuilderElement, elm: dop.rotation_elm}) : null;
  }
  set rotation_elm(v) {
    if(v instanceof BuilderElement) {
      this.dop = {rotation_elm: v.elm};
    }
    else {
      this.dop = {rotation_elm: v};
    }
  }

  /**
   * Угол поворота в пространстве
   * @return {Number}
   */
  get angle3d() {
    return this.dop.angle3d || 0;
  }
  set angle3d(v) {
    this.dop = {angle3d: v};
  }

  /**
   * Перевёрнутость слоя (штапик наружу)
   * (0) - авто, (1) - перевёрнут, (-1) - не перевёрнут
   * @returns {boolean}
   */
  get flipped() {
    const {flipped} = this._row;
    if(!flipped) {
      // TODO: алгоритм расчёта перевёртутости по вставкам и уровню
      return false;
    }
    return flipped > 0;
  }
  set flipped(v) {
    this._row.flipped = v;
    this.project.register_change(true);
  }

  /**
   * Количество сторон контура
   */
  get side_count() {
    const {Импост} = $p.enm.elm_types;
    let res = 0;
    this.profiles.forEach((v) => v.elm_type != Импост && res++);
    return res;
  }

  /**
   * Ширина контура по фальцу
   */
  get w() {
    const {is_rectangular, bounds} = this;
    const {left, right} = this.profiles_by_side();
    return bounds && left && right ? bounds.width - left.nom.sizefurn - right.nom.sizefurn : 0;
  }

  /**
   * Высота контура по фальцу
   */
  get h() {
    const {is_rectangular, bounds} = this;
    const {top, bottom} = this.profiles_by_side();
    return bounds && top && bottom ? bounds.height - top.nom.sizefurn - bottom.nom.sizefurn : 0;
  }

  /**
   * Cлужебная группа текстовых комментариев
   */
  get l_text() {
    const {_attr} = this;
    return _attr._txt || (_attr._txt = new paper.Group({parent: this}));
  }

  /**
   * Cлужебная группа визуализации допов,  петель и ручек
   */
  get l_visualization() {
    const {_attr} = this;
    if (!_attr._visl) {
      _attr._visl = new paper.Group({parent: this, guide: true});
      _attr._visl._by_insets = new paper.Group({parent: _attr._visl});
      _attr._visl._by_spec = new paper.Group({parent: _attr._visl});
    }
    return _attr._visl;
  }

  /**
   * ### Непрозрачность без учета вложенных контуров
   * В отличии от прототипа `opacity`, затрагивает только элементы текущего слоя
   */
  get opacity() {
    return this.children.length ? this.children[0].opacity : 1;
  }
  set opacity(v) {
    this.children.forEach((elm) => {
      if (elm instanceof BuilderElement)
        elm.opacity = v;
    });
  }

  /**
   * Признак наличия цветных профилей
   * @return {boolean}
   */
  is_clr() {
    const white = $p.cat.clrs.predefined('Белый');
    return this.profiles.some(({clr}) => !clr.empty() && clr !== white);
  }

  /**
   * Обработчик события при удалении элемента
   */
  on_remove_elm(elm) {
    // при удалении любого профиля, удаляем размрные линии импостов
    if (this.parent) {
      this.parent.on_remove_elm(elm);
    }
    if (elm instanceof Profile && !this.project._attr._loading) {
      this.l_dimensions.clear();
    }
  }

  /**
   * Обработчик события при вставке элемента
   */
  on_insert_elm(elm) {
    // при вставке любого профиля, удаляем размрные линии импостов
    if (this.parent) {
      this.parent.on_remove_elm(elm);
    }
    if (elm instanceof Profile && !this.project._attr._loading) {
      this.l_dimensions.clear();
    }
  }

  /**
   * Обработчик при изменении системы
   @param [refill] {Boolean}
   */
  on_sys_changed(refill) {
    const {enm: {elm_types, cnn_types}, cat: {cnns, inserts}} = $p;
    this.profiles.forEach((elm) => elm.default_inset(true, refill));

    this.glasses().forEach((elm) => {
      if (elm instanceof Contour) {
        elm.on_sys_changed(refill);
      }
      else {
        // заполнения проверяем с учетом правила системы - по толщине, массиву толщин или явному вхождению вставки
        const {thickness, project} = elm;
        if(!refill) {
          const {thicknesses, glass_thickness} = this.sys;
          if(glass_thickness === 0) {
            refill = !thicknesses.includes(thickness);
          }
          else if(glass_thickness === 1) {
            refill = !this.sys.glasses({elm, layer: this}).includes(inserts.get(elm.inset));
          }
          else if(glass_thickness === 2) {
            refill = thickness < thicknesses[0] || thickness > thicknesses[thicknesses.length - 1];
          }
        }
        if(refill) {
          let {elm_type} = elm.nom; // тип элемента номенклатуры, чтобы выявить непрозрачные заполнения
          if(!elm_types.glasses.includes(elm_type)) {
            elm_type = elm_types.Стекло;
          }
          elm.set_inset(project.default_inset({elm_type: [elm_type]}));
        }
        // проверяем-изменяем соединения заполнений с профилями
        elm.profiles.forEach((curr) => {
          if(!curr.cnn || !curr.cnn.check_nom2(curr.profile)) {
            curr.cnn = cnns.elm_cnn(elm, curr.profile, cnn_types.acn.ii);
          }
        });
      }
    });
  }

  apply_mirror() {
    // прячем визуализацию
    const {l_visualization, profiles, contours, project: {_attr}} = this;
    if(_attr._reflected) {
      l_visualization._by_spec.removeChildren();
    }
    // обновляем отображение составных цветов
    for(const profile of this.profiles) {
      const {clr} = profile;
      if(clr.is_composite()) {
        profile.path.fillColor = BuilderElement.clr_by_clr.call(profile, clr);
      }
    }

     // обновляем отображение составных цветов заполнений
    for (const fill of this.fillings) {
      fill.path.fillColor = BuilderElement.clr_by_clr.call(fill, fill.clr);
      // обновляем отображение составных цветов раскладок
      for (const onlay of fill.imposts) {
        onlay.path.fillColor = BuilderElement.clr_by_clr.call(onlay, onlay.clr);
      }
    }

    for(const layer of this.contours) {
      layer.apply_mirror();
      if(_attr._reflected) {
        layer.sendToBack();
      }
      else {
        layer.bringToFront();
      }
    }
  }

}

GlassSegment.fn_sort = function sort_segments(a, b) {
  const da = this.getOffsetOf(a.point);
  const db = this.getOffsetOf(b.point);
  if (da < db) {
    return -1;
  }
  else if (da > db) {
    return 1;
  }
  return 0;
};

// возвращает массив сегментов, которые могут следовать за текущим
GlassSegment.next = function next_segments(curr, nodes, segments) {
  if (!curr.anext) {
    curr.anext = [];
    for(const segm of segments) {
      if (segm === curr || segm.profile === curr.profile){
        continue;
      }
      // если конец нашего совпадает с началом следующего...
      // и если существует соединение нашего со следующим
      if (curr.has_cnn(segm, nodes, segments)) {
        const angle = curr.e.subtract(curr.b).getDirectedAngle(segm.e.subtract(segm.b));
        if (segments.length < 3 || angle >= 0 || Math.abs(angle + 180) < 1)
          curr.anext.push(segm);
      }
    }
  }
  return curr.anext;
}

EditorInvisible.Contour = Contour;
EditorInvisible.GlassSegment = GlassSegment;


/**
 * ### Вложенное изделие в родительском
 * https://github.com/oknosoft/windowbuilder/issues/564
 *
 * @module contour_nested
 *
 * Created by Evgeniy Malyarov on 20.04.2020.
 * Содержит виртуальные профили, в которые служат внешним, неизменяемым слоев вложенного изделия
 */

class ContourNested extends Contour {

  constructor(attr) {
    super(attr);

    // добавляем в проект элементы вложенного изделия
    const {project, _ox} = this;
    const row = _ox.constructions.find({parent: 1});
    Contour.create({project, row, parent: this, ox: _ox});
  }

  get ProfileConstructor() {
    return ProfileNested;
  }

  presentation(bounds) {
    const text = super.presentation(bounds);
    return text.replace('Створка', 'Вложение');
  }

  /**
   * Продукция текущего слоя
   * Для вложенных, отличается от изделия проекта
   * @return {CatCharacteristics}
   */
  get _ox() {
    const {_attr} = this;
    if(!_attr._ox) {
      const {cat: {templates}, job_prm, utils} = $p;
      const {project, cnstr} = this;
      const {ox} = project;
      for(const {characteristic} of ox.calc_order.production) {
        if(characteristic.leading_product === ox && characteristic.leading_elm === -cnstr) {
          _attr._ox = characteristic;
          break;
        }
      }
      if(!_attr._ox) {
        _attr._ox = ox._manager.create({
          ref: utils.generate_guid(),
          calc_order: ox.calc_order,
          leading_product: ox,
          leading_elm: -cnstr,
          constructions: [
            {kind: 3, cnstr: 1},
            {parent: 1, cnstr: 2},
          ],
        }, false, true);
        _attr._ox._data._is_new = false;
        ox.calc_order.create_product_row({create: true, cx: Promise.resolve(_attr._ox)})
          .then((row) => {
            _attr._ox.product = row.row;
          });

        // после первичного заполнения, попробуем натянуть на вложенное изделие типовой блок
        this.subscribe_load_stamp(_attr._ox);
        const {sys, params} = templates._select_template;
        sys.refill_prm(_attr._ox, 0, 1, this, params);
      }
    }
    return _attr._ox;
  }

  /**
   * Бит, может ли данный слой иметь собственную систему
   * @return {boolean}
   */
  get own_sys() {
    return true;
  }

  get hidden() {
    return !this.visible;
  }
  set hidden(v) {
    this.visible = !v;
  }

  get content() {
    return this.contours[0];
  }

  get l_dimensions() {
    return ContourNested._dimlns;
  }

  /**
   * Перезаполняет из типового блока
   */
  load_stamp() {

    const {cat: {templates, characteristics}, enm: {elm_types}, job_prm, EditorInvisible} = $p;

    return Promise.resolve().then(() => {
      const {base_block} = templates._select_template;
      if(base_block.calc_order === templates._select_template.calc_order) {

        const {_ox, project: {_attr}} = this;

        // останавливаем перерисовку
        _attr._lock = true;

        // создаём новое пустое изделие
        const tx = characteristics.create({calc_order: _ox.calc_order}, false, true);
        // заполняем его из шаблона устанавливаем систему и параметры
        const teditor = new EditorInvisible();
        const tproject = teditor.create_scheme();

        const fin = () => {
          // возобновляем перерисовку
          _attr._lock = false;

          // выгружаем временный проект
          const {calc_order_row} = tx;
          calc_order_row && tx.calc_order.production.del(calc_order_row);
          teditor.unload();
          tx.unload();
        };

        return tproject.load(tx, true, _ox.calc_order)
          .then(() => {
            return tproject.load_stamp(base_block, false, true, true);
          })
          .then(() => {
            const {lbounds} = this;
            const contour = tproject.contours[0];
            if(!contour || !contour.contours.length) {
              throw new Error(`Нет слоёв в шаблоне ${base_block.name}`);
            }

            // подгоняем размеры под проём
            const {bottom, right} = tproject.l_dimensions;
            const dx = lbounds.width - bottom.size;
            const dy = lbounds.height - right.size;

            dx && bottom._move_points({size: lbounds.width - dx / 2, name: 'left'}, 'x');
            dy && right._move_points({size: lbounds.height - dy / 2, name: 'bottom'}, 'y');
            contour.redraw();
            dx && bottom._move_points({size: lbounds.width, name: 'right'}, 'x');
            dy && right._move_points({size: lbounds.height, name: 'top'}, 'y');
            contour.redraw();

            // пересчитываем, не записываем
            contour.refresh_prm_links(true);
            tproject.zoom_fit();
            if(tproject._scope.eve._async?.move_points?.timer) {
              clearTimeout(tproject._scope.eve._async.move_points.timer);
              delete tproject._scope.eve._async.move_points.timer;
            }
            while (tproject._ch.length) {
              tproject.redraw();
            }
            return tproject.save_coordinates({svg: false, no_recalc: true});
          })
          .then(() => {
            const {lbounds, content} = this;
            // чистим наше
            while (content.children.length) {
              content.children[0].remove();
            }
            for (const elm of this.profiles) {
              elm.save_coordinates();
            }

            // перезаполняем сырыми данными временного изделия
            _ox.specification.clear();
            _ox.sys = base_block.sys;
            const map = new Map();
            const {_row} = content;
            const elm0 = _ox.coordinates.aggregate([], ['elm'], 'max') || 0;
            let elm = elm0;
            for(const trow of tx.constructions) {
              if(trow.parent === 1) {
                for(const fld in trow._obj) {
                  if(fld !== 'row' && !fld.startsWith('_')) {
                    _row[fld] = trow._obj[fld];
                  }
                }
              }
              else if(trow.parent > 1) {
                _ox.constructions.add(Object.assign({}, trow._obj));
              }
            }
            // заполняем соответствие номенов элементов
            for(const trow of tx.coordinates) {
              if(trow.cnstr > 1) {
                elm += 1;
                map.set(trow.elm, elm);
              }
            }

            // грузим cnn_elmnts;
            const adel = [];
            for(const trow of _ox.cnn_elmnts) {
              if(trow.elm1 > elm0 || trow.elm2 > elm0) {
                adel.push(trow);
              }
            }
            for(const trow of adel) {
              _ox.cnn_elmnts.del(trow);
            }
            for(const trow of tx.cnn_elmnts) {
              const row1 = tx.coordinates.find({elm: trow.elm1});
              const row2 = tx.coordinates.find({elm: trow.elm2});
              if(row1.cnstr > 1 && row2.cnstr > 1) {
                const proto = Object.assign({}, trow._obj);
                proto.elm1 = map.get(proto.elm1);
                proto.elm2 = map.get(proto.elm2);
                _ox.cnn_elmnts.add(proto);
              }
            }
            // грузим params;
            _ox.params.clear();
            for(const trow of tx.params) {
              const proto = Object.assign({}, trow._obj);
              if(proto.cnstr < 0) {
                proto.cnstr = -map.get(-proto.cnstr);
              }
              _ox.params.add(proto);
            }
            // грузим inserts;
            _ox.inserts.clear();
            for(const trow of tx.inserts) {
              const proto = Object.assign({}, trow._obj);
              if(proto.cnstr < 0) {
                proto.cnstr = -map.get(-proto.cnstr);
              }
              _ox.inserts.add(proto);
            }

            const contour = tproject.contours[0];
            const {lbounds: tlbounds} = contour;
            content.load_stamp({
              contour: contour.contours[0],
              delta: [lbounds.x - tlbounds.x, lbounds.y - tlbounds.y],
              map,
            });
            fin();
          })
          .catch((err) => {
            fin();
            $p.record_log(err);
            $p.ui.dialogs.alert({title: 'Вставка вложенного изделия', text: err.message});
          });
      }

    });
  }

  /**
   * Планирует перезаполнение из типового блока после создания слоя
   */
  subscribe_load_stamp(_ox) {
    const {cat: {templates}, job_prm} = $p;
    const {templates_nested} = job_prm.builder;
    if(templates_nested && templates_nested.includes(templates._select_template.calc_order)) {
      const {eve} = this.project._scope;
      const fin = (tx, fields) => {
        if(tx === _ox && fields.constructions) {
          templates._select_template.refill = false;
          eve.off('rows', fin);
          this.load_stamp();
        }
      }
      eve.on('rows', fin);
    }
  }

  /**
   * Вычисляемые поля в таблицах конструкций и координат
   * @method save_coordinates
   * @param short {Boolean} - короткий вариант - только координаты контура
   */
  save_coordinates(short, save, close) {

    return Promise.resolve()
      .then(() => {
        if (!short) {
          // запись в таблице координат для виртуальных профилей
          for (const elm of this.profiles) {
            elm.save_coordinates();
          }
        }

        // ответственность за строку в таблице конструкций лежит на контуре
        const {bounds, w, h, is_rectangular, content, _row, project} = this;
        _row.x = bounds ? bounds.width.round(4) : 0;
        _row.y = bounds ? bounds.height.round(4) : 0;
        _row.is_rectangular = is_rectangular;
        _row.w = w.round(4);
        _row.h = h.round(4);

        // пересчитаем вложенное изделие
        if(content) {
          content._row._owner._owner.glasses.clear();
          return content.save_coordinates(short)
            .then(() => {
              return save && this._ox.recalc({save: 'recalc', svg: true, silent: true}, null, project._scope);
            })
            .then(() => {
              return save && !close && content.draw_visualization();
            });
        }
      });
  }

  set path(attr) {
    super.path = attr;
    // перерисовываем вложенные контуры
    const {content, profiles} = this
    if(content) {
      content.path = profiles.map((p) => new GlassSegment(p, p.b, p.e, false));
    }
  }

  /**
   * При изменении системы внешнего изделия, с внутренним почти ничего делать не надо
   */
  on_sys_changed() {
    this.profiles.forEach((elm) => elm.rays.clear('with_neighbor'));
    this.contours.forEach((contour) => contour.on_sys_changed());
  }

  /**
   * Перерисовывает элементы контура
   * @method redraw
   * @for Contour
   */
  redraw() {

    if(!this.visible || this.hidden) {
      return;
    }

    // сбрасываем кеш габаритов
    this._attr._bounds = null;

    // сначала перерисовываем все профили контура
    for(const elm of this.profiles) {
      elm.redraw();
    }

    // затем - вложенное изделие
    for(const elm of this.contours) {
      elm.redraw();
    }
  }

  /**
   * Удаляет контур из иерархии проекта
   * Одновлеменно, удаляет вложенное изделие из заказа
   * @method remove
   */
  remove() {
    const {_ox} = this;
    // стандартные действия по удалению слоёв
    super.remove();
    // удаляем вложенное изделие из заказа
    const {calc_order_row: row} = _ox;
    if(row) {
      row._owner.del(row);
    }
    _ox.unload();
  }

}

ContourNested._dimlns = {
  redraw() {

  },
  clear() {

  }
};
EditorInvisible.ContourNested = ContourNested;


/**
 * Рендер содержимого вложенного изделия
 *
 * @module contour_nested_content
 *
 * Created by Evgeniy Malyarov on 24.12.2020.
 */

class ContourNestedContent extends Contour {

  constructor(attr) {
    super(attr);

    // добавляем вложенные слои
    const {_ox: ox, project} = this;
    if(ox) {
      ox.constructions.find_rows({parent: this.cnstr}, (row) => {
        Contour.create({project, row, parent: this, ox});
      });
    }

  }

  get ProfileConstructor() {
    return ProfileNestedContent;
  }

  /**
   * Загружает слои из прототипа
   * @param contour {Contour} - слой внешнего изделия (из другой рисовалки)
   * @param delta {Point} - на сколько смещать
   * @param map {Map} - соответствие номеров элементов
   */
  load_stamp({contour, delta, map}) {
    const {_ox: ox, project} = this;
    project._scope.activate();

    for(const proto of contour.profiles) {
      const generatrix = proto.generatrix.clone({insert: false});
      generatrix.translate(delta);
      new ProfileNestedContent({
        parent: this,
        generatrix,
        proto: {inset: proto.inset, clr: proto.clr},
        elm: map.get(proto.elm),
      });
    }

    for(const proto of contour.glasses(false, true)) {
      const path = proto.generatrix.clone({insert: false});
      path.translate(delta);
      new Filling({
        parent: this,
        path,
        proto: {inset: proto.inset, clr: proto.clr},
        elm: map.get(proto.elm),
      });
    }

    for(const proto of contour.contours) {
      const row = ox.constructions.find({cnstr: proto.cnstr});
      if(row && row.parent === this.cnstr) {
        const sub = Contour.create({project, row, parent: this, ox});
        sub.load_stamp({contour: proto, delta, map})
      };
    }
  }

  get key() {
    return `${this.layer.key}-${this.cnstr}`;
  }

  get _ox() {
    return this.layer._ox;
  }

  get lbounds() {
    return this.layer.lbounds;
  }

  get l_dimensions() {
    return ContourNested._dimlns;
  }

  /**
   * При изменении системы внешнего изделия, с внутренним почти ничего делать не надо
   */
  on_sys_changed() {
    this.profiles.forEach((elm) => elm.rays.clear('with_neighbor'));
    this.contours.forEach((contour) => contour.on_sys_changed());
  }

}

EditorInvisible.ContourNestedContent = ContourNestedContent;


/**
 * ### Родительский слой вложенного изделия
 * https://github.com/oknosoft/windowbuilder/issues/564
 *
 * @module contour_nested
 *
 * Created by Evgeniy Malyarov on 20.04.2020.
 */

class ContourParent extends Contour {

  get ProfileConstructor() {
    return ProfileParent;
  }

  /**
   * Объект характеристики родительского изделия
   * @return {CatCharacteristics}
   */
  get leading_product() {
    const {_attr, project: {ox}} = this;
    if(!_attr._ox) {
      for(const {characteristic} of ox.calc_order.production) {
        if(ox.leading_product === characteristic) {
          _attr._ox = characteristic;
        }
      }
    }
    return _attr._ox;
  }


  /**
   * Ошибки соединений в виртуальном слое не нужны
   */
  draw_cnn_errors() {

  }

  /**
   * Удаляет контур из иерархии проекта
   * Одновлеменно, удаляет вложенное изделие из заказа
   * @method remove
   */
  remove() {
    //удаляем детей

    // стандартные действия по удалению слоёв
    super.remove();
  }

}

EditorInvisible.ContourParent = ContourParent;


/**
 * ### Виртуальный слой
 * https://github.com/oknosoft/windowbuilder/issues/563
 *
 * @module contour_virtual
 *
 * Created by Evgeniy Malyarov on 20.04.2020.
 */


class ContourVirtual extends Contour {

  constructor(attr) {
    super(attr);
    if(!this._row.kind) {
      this._row.kind = 1;
    }
  }

  get ProfileConstructor() {
    return ProfileVirtual;
  }

  /**
   * Система виртуального слоя - можем переопределить
   * @return {CatProduction_params}
   */
  get sys() {
    const {_row: {dop}, layer: {sys}} = this;
    return dop.sys ? sys._manager.get(dop.sys) : sys;
  }
  set sys(v) {
    const {_row, layer: {sys}, _ox: {params}, cnstr, project} = this;
    const inset = $p.utils.blank.guid;
    if(!v || v == sys) {
      if(_row.dop.sys) {
        _row.dop = {sys: null};
        params.clear({cnstr, inset});
      }
    }
    else {
      _row.dop = {sys: v.valueOf()};
      this.refill_prm();
    }
    project.register_change(true);
  }

  /**
   * Бит, может ли данный слой иметь собственную систему
   * @return {boolean}
   */
  get own_sys() {
    return true;
  }

  refill_prm() {
    const {_ox: {params}, cnstr, sys: {product_params}} = this;
    const inset = $p.utils.blank.guid;
    // чистим
    const rm = [];
    params.find_rows({cnstr, inset}, (row) => {
      if(!product_params.find({param: row.param})) {
        rm.push(row);
      }
    });
    for(const row of rm) {
      params.del(row);
    }
    // добавляем
    for(const row of product_params) {
      let has;
      params.find_rows({cnstr: {in: [0, cnstr]}, param: row.param, inset}, () => {
        has = true;
        return false;
      });
      if(!has) {
        params.add({
          cnstr,
          inset,
          region: 0,
          param: row.param,
          hide: row.hide,
          value: row.value,
        });
      }
    }
  }

  get hidden() {
    return !!this._hidden;
  }
  set hidden(v) {
    if (this.hidden != v) {
      this._hidden = v;
      this.children.forEach((elm) => {
        if (elm instanceof BuilderElement) {
          elm.opacity = v ? 0.2 : 1;
        }
      });
    }
  }

  /**
   * Виртуальный слой не добавляет вложенности
   * @return {number}
   */
  get level() {
    return this.layer.level;
  }

  presentation(bounds) {
    const text = super.presentation(bounds);
    return text.replace('Створка', 'Виртуал');
  }

  save_coordinates(...args) {
    return super.save_coordinates(...args);
  }

  /**
   * Перерисовывает элементы контура
   * @method redraw
   * @for Contour
   */
  redraw() {

    if(!this.visible || this.hidden) {
      return;
    }

    // сбрасываем кеш габаритов
    this._attr._bounds = null;

    // сначала перерисовываем все профили контура
    for(const elm of this.profiles) {
      elm.redraw();
    }

    // затем, создаём и перерисовываем заполнения, которые перерисуют свои раскладки
    this.glass_recalc();

    // затем - вложенное изделие
    for(const elm of this.contours) {
      elm.redraw();
    }

    // информируем мир о новых размерах нашего контура
    this.notify(this, 'contour_redrawed', this._attr._bounds);
  }

}

EditorInvisible.ContourVirtual = ContourVirtual;


/**
 * ### Вспомогательные классы для формирования размерных линий
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
 * ### Служебный слой размерных линий
 * Унаследован от [paper.Layer](http://paperjs.org/reference/layer/)
 *
 * @class DimensionLayer
 * @extends paper.Layer
 * @param attr
 * @constructor
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

}

/**
 * ### Построитель авторазмерных линий
 *
 * @class DimensionDrawer
 * @extends paper.Group
 * @param attr
 * @param attr.parent - {paper.Item}, родитель должен иметь свойства profiles_by_side(), is_pos(), profiles, imposts
 * @constructor
 */
class DimensionDrawer extends paper.Group {

  constructor(attr) {
    super(attr);
    this.bringToFront();
  }

  /**
   * ### Стирает размерные линии
   *
   * @method clear
   */
  clear() {

    this.ihor && this.ihor.clear();
    this.ivert && this.ivert.clear();

    for (let pos of ['bottom', 'top', 'right', 'left']) {
      if(this[pos]) {
        this[pos].removeChildren();
        this[pos].remove();
        this[pos] = null;
      }
    }

    this.layer && this.layer.parent && this.layer.parent.l_dimensions.clear();
  }

  /**
   * формирует авторазмерные линии
   */
  redraw(forse) {

    const {parent, project: {builder_props}} = this;

    if(forse || !builder_props.auto_lines) {
      this.clear();
    }

    // сначала, перерисовываем размерные линии вложенных контуров, чтобы получить отступы
    for (let chld of parent.contours) {
      chld.l_dimensions.redraw();
    }

    // для внешних контуров строим авторазмерные линии
    if(builder_props.auto_lines && (!parent.parent || forse)) {

      const {ihor, ivert, by_side} = this.imposts();
      if(!Object.keys(by_side).length) {
        return this.clear();
      }

      // подмешиваем импосты вложенных контуров
      const profiles = new Set(parent.profiles);
      parent.imposts.forEach((elm) => elm.visible && profiles.add(elm));

      for (let elm of profiles) {

        // получаем точки начала и конца элемента
        const our = !elm.parent || elm.parent === parent;
        const eb = our ? (elm instanceof GlassSegment ? elm._sub.b : elm.b) : elm.rays.b.npoint;
        const ee = our ? (elm instanceof GlassSegment ? elm._sub.e : elm.e) : elm.rays.e.npoint;

        this.push_by_point({ihor, ivert, eb, ee, elm});
      }

      // для ihor добавляем по вертикали
      if(ihor.length > 2) {
        ihor.sort((a, b) => b.point - a.point);
        if(parent.is_pos('right')) {
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
        if(parent.is_pos('bottom')) {
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
        p: 'b'
      });
    }
    if(ee && ihor.every((v) => v.point != ee.y.round())) {
      ihor.push({
        point: ee.y.round(),
        elm: elm,
        p: 'e'
      });
    }
    if(eb && ivert.every((v) => v.point != eb.x.round())) {
      ivert.push({
        point: eb.x.round(),
        elm: elm,
        p: 'b'
      });
    }
    if(ee && ivert.every((v) => v.point != ee.x.round())) {
      ivert.push({
        point: ee.x.round(),
        elm: elm,
        p: 'e'
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

    for(const filling of parent.fillings) {
      if(!filling.visible) {
        continue;
      }
      const {path} = filling;
      for(const elm of filling.imposts) {
        let {b: eb, e: ee} = elm;
        // если точка не на границе заполнения
        if(path.is_nearest(eb)) {
          eb = null;
        }
        if(path.is_nearest(ee)) {
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
   * ### Формирует размерные линии импоста
   */
  by_imposts(arr, collection, pos) {
    const {base_offset, dop_offset} = consts;
    const offset = (pos == 'right' || pos == 'bottom') ? -dop_offset : base_offset;
    for (let i = 0; i < arr.length - 1; i++) {
      if(!collection[i]) {
        let shift = Math.abs(arr[i].point - arr[i + 1].point) < 60 ? 70 : 0;
        if(shift && collection[i - 1] && collection[i - 1].offset !== offset) {
          shift += 70;
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
      }
    }
  }

  /**
   * ### Формирует размерные линии от габарита
   */
  by_base(arr, collection, pos) {
    const {base_offset, dop_offset} = consts;
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
   * ### Формирует размерные линии контура
   */
  by_contour(ihor, ivert, forse, by_side) {

    const {project, parent} = this;
    const {bounds} = parent;
    const {base_offset, dop_offset} = consts;

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
   * ### Формирует размерные линии контура по фальцу
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

  get owner_bounds() {
    return this.parent.bounds;
  }

  get dimension_bounds() {
    return this.parent.dimension_bounds;
  }

  get ihor() {
    return this._ihor || (this._ihor = new DimensionGroup());
  }

  get ivert() {
    return this._ivert || (this._ivert = new DimensionGroup());
  }
}

EditorInvisible.DimensionDrawer = DimensionDrawer;
EditorInvisible.DimensionLayer = DimensionLayer;


/**
 * ### Размерные линии на эскизе
 *
 * Created 21.08.2015
 *
 * @module geometry
 * @submodule dimension_line
 */

/**
 * ### Размерная линия на эскизе
 * Унаследована от [paper.Group](http://paperjs.org/reference/group/)<br />
 * См. так же, {{#crossLink "DimensionLineCustom"}}{{/crossLink}} - размерная линия, устанавливаемая пользователем
 *
 * @class DimensionLine
 * @extends paper.Group
 * @param attr {Object} - объект с указанием на строку координат и родительского слоя
 * @constructor
 * @menuorder 46
 * @tooltip Размерная линия
 */

class DimensionLine extends paper.Group {

  constructor(attr) {

    super({parent: attr.parent, project: attr.project});

    const _attr = this._attr = {};

    this._row = attr.row;

    if(this._row && this._row.path_data){
      attr._mixin(JSON.parse(this._row.path_data));
      if(attr.elm1){
        attr.elm1 = this.project.getItem({elm: attr.elm1});
      }
      if(attr.elm2){
        attr.elm2 = this.project.getItem({elm: attr.elm2});
      }
    }
    if(!attr.elm2) {
      attr.elm2 = attr.elm1;
    }
    if(!attr.p1) {
      attr.p1 = 'b';
    }
    if(!attr.p2) {
      attr.p2 = 'e';
    }
    Object.assign(_attr, attr);

    if(attr.contour){
      _attr.contour = true;
    }

    if(!_attr.pos && (!_attr.elm1 || !_attr.elm2)){
      this.remove();
      return;
    }

    // создаём детей
    new paper.Path({parent: this, name: 'callout1', strokeColor: 'black', guide: true});
    new paper.Path({parent: this, name: 'callout2', strokeColor: 'black', guide: true});
    new paper.Path({parent: this, name: 'scale', strokeColor: 'black', guide: true});
    new paper.PointText({
      parent: this,
      name: 'text',
      justification: 'center',
      fillColor: 'black',
      fontFamily: consts.font_family,
      fontSize: this._font_size()});

    !this.project._attr._from_service && this.on({
      mouseenter: this._mouseenter,
      mouseleave: this._mouseleave,
      click: this._click
    });

  }

  _font_size() {
    const {width, height} = this.project.bounds;
    const {cutoff, font_size} = consts;
    const size = Math.max(width - cutoff, height - cutoff) / 60;
    return font_size + (size > 0 ? size : 0);
  }

  // виртуальные метаданные для автоформ
  _metadata(fld) {
    return $p.dp.builder_size.metadata(fld);
  }

  // виртуальный датаменеджер для автоформ
  get _manager() {
    return $p.dp.builder_size;
  }

  /**
   *
   * @return {boolean}
   */
  is_disabled() {
    const {project, layer, _attr: {elm1, elm2}} = this;
    if(project._attr.elm_fragment > 0 || (layer instanceof DimensionLayer && project.rootLayer() instanceof ContourParent)) {
      return true;
    }
    if(elm1 instanceof ProfileParent && elm2 instanceof ProfileParent) {
      return true;
    }
    return false;
  }

  _mouseenter() {
    const {children: {text}, project: {_scope}} = this;
    const dis = this.is_disabled();
    _scope.canvas_cursor(`cursor-arrow-ruler${dis ? '-dis' : ''}`);
    if(!dis) {
      text.fontWeight = 'bold';
      text.shadowBlur = 10;
      text.shadowOffset = 10;
    }
  }

  _mouseleave() {
    const {text} = this.children;
    text.fontWeight = 'normal';
    text.shadowBlur = 0;
    text.shadowOffset = 0;
  }

  _click(event) {
    event.stop();
    if(!this.is_disabled() && typeof EditorInvisible.RulerWnd === 'function') {
      this.wnd = new EditorInvisible.RulerWnd(null, this);
      this.wnd.size = this.size;
    }
  }

  correct_move_name({event, p1, p2}) {
    const {pos, _attr: {elm1, elm2}} = this;
    const e1 = elm1 instanceof ProfileParent;
    const e2 = elm2 instanceof ProfileParent;
    if(!e1 && !e2) {
      return;
    }

    if(pos == 'top' || pos == 'bottom') {
      const dir = p1.x < p2.x;
      if(event.name == 'left' && dir && e1) {
        event.name = 'right';
      }
      if(event.name == 'right' && dir && e2) {
        event.name = 'left';
      }
    }
    else {
      const dir = p1.y > p2.y;
      if(event.name == 'bottom' && dir && e1) {
        event.name = 'top';
      }
      if(event.name == 'top' && dir && e2) {
        event.name = 'bottom';
      }
    }
  }

  _move_points(event, xy) {

    let _bounds, delta;

    const {_attr, pos, project} = this;
    const {Point} = project._scope;

    // получаем дельту - на сколько смещать
    if(_attr.elm1){

      // в _bounds[event.name] надо поместить координату по x или у (в зависисмости от xy), которую будем двигать
      _bounds = {};

      const p1 = (_attr.elm1._sub || _attr.elm1)[_attr.p1];
      const p2 = (_attr.elm2._sub || _attr.elm2)[_attr.p2];
      this.correct_move_name({event, p1, p2, _attr});

      if(pos == 'top' || pos == 'bottom') {
        const size = Math.abs(p1.x - p2.x);
        if(event.name == 'right') {
          delta = new Point(event.size - size, 0);
          _bounds[event.name] = Math.max(p1.x, p2.x);
        }
        else {
          delta = new Point(size - event.size, 0);
          _bounds[event.name] = Math.min(p1.x, p2.x);
        }
      }
      else{
        const size = Math.abs(p1.y - p2.y);
        if(event.name == 'bottom') {
          delta = new Point(0, event.size - size);
          _bounds[event.name] = Math.max(p1.y, p2.y);
        }
        else {
          delta = new Point(0, size - event.size);
          _bounds[event.name] = Math.min(p1.y, p2.y);
        }
      }
    }
    else {
      _bounds = this.layer.bounds;
      if(pos == 'top' || pos == 'bottom') {
        if(event.name == 'right') {
          delta = new Point(event.size - _bounds.width, 0);
        }
        else {
          delta = new Point(_bounds.width - event.size, 0);
        }
      }
      else{
        if(event.name == 'bottom') {
          delta = new Point(0, event.size - _bounds.height);
        }
        else {
          delta = new Point(0, _bounds.height - event.size);
        }
      }
    }

    if(delta.length){
      const {project} = this;
      project.deselect_all_points();
      project.getItems({class: ProfileItem})
        .forEach(({b, e, generatrix, width}) => {
          width = width / 2 + 1;
          if(Math.abs(b[xy] - _bounds[event.name]) < width && Math.abs(e[xy] - _bounds[event.name]) < width){
            generatrix.segments.forEach((segm) => segm.selected = true)
          }
          else if(Math.abs(b[xy] - _bounds[event.name]) < width){
            generatrix.firstSegment.selected = true;
          }
          else if(Math.abs(e[xy] - _bounds[event.name]) < width){
            generatrix.lastSegment.selected = true;
          }
      });
      delta._dimln = true;
      project.move_points(delta, false);
      project.deselect_all_points(true);
      project.register_update();
    }

  }

  /**
   * Обрабатывает сообщение окна размеров
   * @param event
   */
  sizes_wnd(event) {

    if(event.wnd == this || (this.wnd && event.wnd == this.wnd.wnd)){

      switch (event.name) {
      case 'close':
        if(this.children.text) {
          this.children.text.selected = false;
        }
        this.wnd = null;
        break;

      case 'left':
      case 'right':
        if(this.pos == 'top' || this.pos == 'bottom') {
          this._move_points(event, 'x');
        }
        break;

      case 'top':
      case 'bottom':
        if(this.pos == 'left' || this.pos == 'right') {
          this._move_points(event, 'y');
        }
        break;

      case 'auto':
        const {_attr: {impost, pos, elm1, elm2}, project, layer}  = this;
        const {positions} = $p.enm;
        if(pos == 'top' || pos == 'bottom') {
          event.name = 'right';
          if(impost && elm2.pos === positions.right) {
            event.name = 'left';
          }
          else if(project.contours.length > 1 && layer.is_pos && layer.is_pos('left')) {
            event.name = 'left';
          }
          this._move_points(event, 'x');
        }
        if(pos == 'left' || pos == 'right') {
          event.name = 'top';
          if(impost && elm2.pos === positions.top) {
            event.name = 'bottom';
          }
          else if(project.contours.length > 1) {
            const other = project.contours.find((v) => v !== layer);
            if(layer.bounds.top === other.bounds.top || layer.bounds.height < other.bounds.height) {
              event.name = 'bottom';
            }
          }
          this._move_points(event, 'y');
        }
        break;

      }
    }
  }

  redraw() {

    const {children, path, align, project: {builder_props}} = this;
    if(!children.length){
      return;
    }
    if(!path){
      this.visible = false;
      return;
    }

    // прячем крошечные размеры
    const length = path.length;
    if(length < 1){
      this.visible = false;
      return;
    }
    this.visible = true;

    const b = path.firstSegment.point;
    const e = path.lastSegment.point;
    const normal = path.getNormalAt(0).multiply(this.offset + path.offset);
    const nl = normal.length;
    const ns = nl > 30 ? normal.normalize(nl - 10) : normal;
    const bs = b.add(ns);
    const es = e.add(ns);

    if(children.callout1.segments.length){
      children.callout1.firstSegment.point = b;
      children.callout1.lastSegment.point = b.add(normal);
    }
    else{
      children.callout1.addSegments([b, b.add(normal)]);
    }

    if(children.callout2.segments.length){
      children.callout2.firstSegment.point = e;
      children.callout2.lastSegment.point = e.add(normal);
    }
    else{
      children.callout2.addSegments([e, e.add(normal)]);
    }

    if(children.scale.segments.length){
      children.scale.firstSegment.point = bs;
      children.scale.lastSegment.point = es;
    }
    else{
      children.scale.addSegments([bs, es]);
    }

    children.callout1.visible = !this.hide_c1;
    children.callout2.visible = !this.hide_c2;
    children.scale.visible = !this.hide_line;

    children.text.content = length.round(builder_props.rounding).toString();
    children.text.rotation = e.subtract(b).angle;
    children.text.justification = align.ref;

    const font_size = this._font_size();
    const {isNode} = $p.wsql.alasql.utils;
    children.text.fontSize = font_size;
    if(align == $p.enm.text_aligns.left) {
      children.text.position = bs
        .add(path.getTangentAt(0).multiply(font_size))
        .add(path.getNormalAt(0).multiply(font_size / (isNode ? 1.9 : 2)));
    }
    else if(align == $p.enm.text_aligns.right) {
      children.text.position = es
        .add(path.getTangentAt(0).multiply(-font_size))
        .add(path.getNormalAt(0).multiply(font_size / (isNode ? 1.9 : 2)));
    }
    else {
      children.text.position = bs.add(es).divide(2).add(path.getNormalAt(0).multiply(font_size / (isNode ? 1.9 : 2)));
      if(length < 20) {
        children.text.position = children.text.position.add(path.getTangentAt(0).multiply(font_size / 3));
      }
    }
  }

  get path() {

    const {parent, children, _attr, pos} = this;
    if(!children.length){
      return;
    }
    const {owner_bounds, dimension_bounds} = parent;
    let offset = 0, b, e;

    if(!pos){
      b = typeof _attr.p1 == "number" ? _attr.elm1.corns(_attr.p1) : _attr.elm1[_attr.p1];
      e = typeof _attr.p2 == "number" ? _attr.elm2.corns(_attr.p2) : _attr.elm2[_attr.p2];
    }
    else if(pos == "top"){
      b = owner_bounds.topLeft;
      e = owner_bounds.topRight;
      offset = owner_bounds[pos] - dimension_bounds[pos];
    }
    else if(pos == "left"){
      b = owner_bounds.bottomLeft;
      e = owner_bounds.topLeft;
      offset = owner_bounds[pos] - dimension_bounds[pos];
    }
    else if(pos == "bottom"){
      b = owner_bounds.bottomLeft;
      e = owner_bounds.bottomRight;
      offset = owner_bounds[pos] - dimension_bounds[pos];
    }
    else if(pos == "right"){
      b = owner_bounds.bottomRight;
      e = owner_bounds.topRight;
      offset = owner_bounds[pos] - dimension_bounds[pos];
    }

    // если точки профиля еще не нарисованы - выходим
    if(!b || !e){
      return;
    }

    const path = new paper.Path({ insert: false, segments: [b, e] });

    if(_attr.elm1 && pos){
      b = path.getNearestPoint(_attr.elm1[_attr.p1]);
      e = path.getNearestPoint(_attr.elm2[_attr.p2]);
      if(path.getOffsetOf(b) > path.getOffsetOf(e)){
        [b, e] = [e, b]
      }
      path.firstSegment.point = b;
      path.lastSegment.point = e;
    }
    if(_attr.faltz) {
      b = path.getPointAt(_attr.faltz);
      e = path.getPointAt(path.length - _attr.faltz);
      path.firstSegment.point = b;
      path.lastSegment.point = e;
    }
    path.offset = offset;

    return path;
  }

  get eve() {
    return this.project._scope.eve;
  }

  // размер
  get size() {
    return (this.children.text && parseFloat(this.children.text.content)) || 0;
  }
  set size(v) {
    this.children.text.content = parseFloat(v).round(1);
  }

  // расположение относительно контура $p.enm.pos
  get pos() {
    return this._attr.pos || "";
  }
  set pos(v) {
    this._attr.pos = v;
    this.redraw();
  }

  // отступ от внешней границы изделия
  get offset() {
    return this._attr.offset || 90;
  }
  set offset(v) {
    const offset = (parseInt(v) || 90).round();
    if(this._attr.offset != offset){
      this._attr.offset = offset;
      this.project.register_change(true);
    }
  }

  // расположение надписи
  get align() {
    return (!this._attr.align || this._attr.align == '_') ? $p.enm.text_aligns.center : this._attr.align;
  }
  set align(v) {
    this._attr.align = v;
    this.redraw();
  }

  // сокрытие первой выноски
  get hide_c1() {
    return !!this._attr.hide_c1;
  }
  set hide_c1(v) {
    const {children, _attr} = this
    _attr.hide_c1 = v;
    v && children.callout1.setSelection(false);
    this.redraw();
  }

  // сокрытие второй выноски
  get hide_c2() {
    return !!this._attr.hide_c2;
  }
  set hide_c2(v) {
    const {children, _attr} = this
    _attr.hide_c2 = v;
    v && children.callout2.setSelection(false);
    this.redraw();
  }

  // сокрытие линии
  get hide_line() {
    return !!this._attr.hide_line;
  }
  set hide_line(v) {
    const {children, _attr} = this
    _attr.hide_line = v;
    v && children.scale.setSelection(false);
    this.redraw();
  }

  /**
   * Удаляет элемент из контура и иерархии проекта
   * Одновлеменно, удаляет строку из табчасти табчасти _Координаты_
   * @method remove
   */
  remove() {
    if(this._row){
      this._row._owner.del(this._row);
      this._row = null;
      this.project.register_change();
    }
    super.remove();
  }
}


/**
 * ### Размерные линии, определяемые пользователем
 * @class DimensionLineCustom
 * @extends DimensionLine
 * @param attr
 * @constructor
 */
class DimensionLineCustom extends DimensionLine {

  constructor(attr) {

    if(!attr.row){
      attr.row = attr.parent.project.ox.coordinates.add();
    }

    // слой, которому принадлежит размерная линия
    if(!attr.row.cnstr){
      attr.row.cnstr = attr.parent.layer.cnstr;
    }

    // номер элемента
    if(!attr.row.elm){
      attr.row.elm = attr.parent.project.ox.coordinates.aggregate([], ["elm"], "max") + 1;
    }

    super(attr);

  }

  /**
   * Возвращает тип элемента (размерная линия)
   */
  get elm_type() {
    return $p.enm.elm_types.Размер;
  }

  /**
   * Вычисляемые поля в таблице координат
   * @method save_coordinates
   */
  save_coordinates() {
    const {_row, _attr, elm_type, pos, offset, size, align} = this;

    // сохраняем размер
    _row.len = size;

    // устанавливаем тип элемента
    _row.elm_type = elm_type;

    // сериализованные данные
    const path_data = {
      pos: pos,
      elm1: _attr.elm1.elm,
      elm2: _attr.elm2.elm,
      p1: _attr.p1,
      p2: _attr.p2,
      offset: offset
    };
    if(_attr.fix_angle) {
      path_data.fix_angle = true;
      path_data.angle = _attr.angle;
    }
    if(align == $p.enm.text_aligns.left || align == $p.enm.text_aligns.right) {
      path_data.align = align.ref || align;
    }
    if(_attr.hide_c1) {
      path_data.hide_c1 = true;
    }
    if(_attr.hide_c2) {
      path_data.hide_c2 = true;
    }
    if(_attr.hide_line) {
      path_data.hide_line = true;
    }
    if(_attr.by_curve) {
      path_data.by_curve = true;
    }
    _row.path_data = JSON.stringify(path_data);
  }

  get is_ruler() {
    const {_scope} = this._project;
    const {constructor: {ToolRuler}, tool} = _scope;
    return typeof ToolRuler === 'function' && tool instanceof ToolRuler;
  }

  // выделяем подключаем окно к свойствам
  setSelection(selection) {
    super.setSelection(selection);
    const {project, children, hide_c1, hide_c2, hide_line, is_ruler} = this
    const {tool} = project._scope;
    if(selection) {
      hide_c1 && children.callout1.setSelection(false);
      hide_c2 && children.callout2.setSelection(false);
      hide_line && children.scale.setSelection(false);
    }
    is_ruler && tool.wnd.attach(this);
  }

  // выделяем только при активном инструменте
  _click(event) {
    event.stop();
    if(this.is_ruler){
      this.selected = true;
    }
  }

  _mouseenter() {
    const {project: {_scope}, is_ruler} = this;
    if(is_ruler){
      _scope.canvas_cursor('cursor-arrow-ruler');
    }
    else{
      _scope.canvas_cursor('cursor-arrow-ruler-dis');
    }
  }

  // угол к горизонту в направлении размера
  get angle() {
    if(this.fix_angle) {
      return this._attr.angle || 0;
    }
    const {firstSegment, lastSegment} = this.path;
    return lastSegment.point.subtract(firstSegment.point).angle.round(1);
  }
  set angle(v) {
    this._attr.angle = parseFloat(v).round(1);
    this.project.register_change(true);
  }

  // использование фикс угла
  get fix_angle() {
    return !!this._attr.fix_angle;
  }
  set fix_angle(v) {
    this._attr.fix_angle = v;
    this.project.register_change(true);
  }

  get path() {
    if(this.fix_angle) {
      // рисум линию под требуемым углом из точки 1
      // ищем на линии ближайшую от точки 2
      // рисуем остатки, смещаем на offset

      const {children, _attr} = this;
      if(!children.length){
        return;
      }
      let b = typeof _attr.p1 == "number" ? _attr.elm1.corns(_attr.p1) : _attr.elm1[_attr.p1];
      let e = typeof _attr.p2 == "number" ? _attr.elm2.corns(_attr.p2) : _attr.elm2[_attr.p2];
      // если точки профиля еще не нарисованы - выходим
      if(!b || !e){
        return;
      }

      // дельта
      const d = e.subtract(b);
      // касательная
      const t = d.clone();
      t.angle = this.angle;
      // путь по углу
      const path = new paper.Path({insert: false, segments: [b, b.add(t)]});
      // удлиненный путь
      path.lastSegment.point.add(t.multiply(10000));
      // обрезаем ближайшей точкой к 'e'
      path.lastSegment.point = path.getNearestPoint(e);
      path.offset = 0;
      return path;
    }
    else {
      // если угол не задан, рисуем стандартную линию
      return super.path;
    }
  }
}

EditorInvisible.DimensionLine = DimensionLine;
EditorInvisible.DimensionLineCustom = DimensionLineCustom;


/**
 *
 *
 * @module dimension_line_impost
 *
 * Created by Evgeniy Malyarov on 25.05.2018.
 */


class DimensionLineImpost extends DimensionLineCustom {

  constructor(attr) {

    attr.row = {
      cnstr: 1,
      elm: 1,
      _owner: {
        del() {}
      }
    }

    super(attr);

    new paper.PointText({
      parent: this,
      name: 'dx1',
      justification: 'center',
      fontFamily: consts.font_family,
      fillColor: 'black',
      fontSize: consts.font_size});

    new paper.PointText({
      parent: this,
      name: 'dx2',
      justification: 'center',
      fontFamily: consts.font_family,
      fillColor: 'black',
      fontSize: consts.font_size});

  }

  get path() {

    // рисум линию между точками dx1 и dx2 и смещаем на offset

    const {children, _attr: {elm1: {generatrix}, p1, p2, dx1, dx2}} = this;
    if(!children.length){
      return;
    }

    let b = generatrix.getPointAt(typeof p1 == 'number' ? dx2 : dx1);
    let e = generatrix.getPointAt(typeof p1 == 'number' ? dx1 : dx2);
    // если точки профиля еще не нарисованы - выходим
    if(!b || !e){
      return;
    }
    const path = new paper.Path({insert: false, segments: [b, e]});
    path.offset = 0;
    return path;
  }

  redraw() {

    const {children, path, offset, _attr: {elm1, p1, p2, dx1, dx2, outer}} = this;
    if(!children.length){
      return;
    }
    if(!path){
      this.visible = false;
      return;
    }

    this.visible = true;

    const b = path.firstSegment.point;
    const e = path.lastSegment.point;
    const normal = path.getNormalAt(0).multiply((outer ? -1 : 1) * (offset + path.offset));
    const tangent = path.getTangentAt(0);
    const ns = normal.normalize(normal.length - 20);
    const bs = b.add(ns);
    const es = e.add(ns);
    // ищем дальнее ребро соседнего профиля в точке b
    let offsetB = 0;
    const elmB = elm1.cnn_point('b').profile;
    if(elmB) {
      const gen = elm1.generatrix.clone({insert: false}).elongation(200);
      const po = elmB.rays.outer.intersect_point(gen, elm1.b);
      const pi = elmB.rays.inner.intersect_point(gen, elm1.b);
      if(po && pi) {
        const ob = gen.getOffsetOf(elm1.b);
        const oo = gen.getOffsetOf(po);
        const oi = gen.getOffsetOf(pi);
        offsetB = Math.min(oo - ob, oi - ob);
      }
    }

    if(children.callout1.segments.length){
      children.callout1.firstSegment.point = b;
      children.callout1.lastSegment.point = b.add(normal);
    }
    else{
      children.callout1.addSegments([b, b.add(normal)]);
    }

    if(children.callout2.segments.length){
      children.callout2.firstSegment.point = e;
      children.callout2.lastSegment.point = e.add(normal);
    }
    else{
      children.callout2.addSegments([e, e.add(normal)]);
    }

    if(children.scale.segments.length){
      children.scale.firstSegment.point = bs;
      children.scale.lastSegment.point = es;
    }
    else{
      children.scale.addSegments([bs, es]);
    }
    children.scale.elongation(200);

    children.text.rotation = children.dx1.rotation = children.dx2.rotation = 0;
    children.text.content = ((typeof p1 == 'number' ? p1 : p2) - offsetB).toFixed(0);
    children.dx1.content = (dx1 - offsetB).toFixed(0);
    children.dx2.content = (dx2 - offsetB).toFixed(0);
    const bdx1 = children.dx1.bounds;
    const bdx2 = children.dx2.bounds;
    if(offset > 0) {
      children.dx1.justification = 'left';
      children.dx2.justification = 'right';
      children.dx1.position = bs
        .add(tangent.normalize(-Math.sign(offset) * ((consts.font_size + bdx1.width) / 2)))
        .add(normal.normalize(-consts.font_size * 0.6));
      children.dx2.position = es
        .add(tangent.normalize(Math.sign(offset) * ((consts.font_size + bdx1.width) / 2)))
        .add(normal.normalize(-consts.font_size * 0.6));
    }
    else {
      children.dx1.justification = 'right';
      children.dx2.justification = 'left';
      children.dx1.position = es
        .add(tangent.normalize(-Math.sign(offset) * ((consts.font_size + bdx1.width) / 2)))
        .add(normal.normalize(-consts.font_size * 0.6));
      children.dx2.position = bs
        .add(tangent.normalize(Math.sign(offset) * ((consts.font_size + bdx1.width) / 2)))
        .add(normal.normalize(-consts.font_size * 0.6));
    }
    children.text.rotation = children.dx1.rotation = children.dx2.rotation = e.subtract(b).angle;

    children.text.position = bs.add(es).divide(2).add(normal.normalize(consts.font_size * 0.8));
  }

}

EditorInvisible.DimensionLineImpost = DimensionLineImpost;


/**
 * ### Размерная линия радиуса
 *
 * @module dimension_radius
 *
 * Created by Evgeniy Malyarov on 01.05.2018.
 */

class DimensionRadius extends DimensionLineCustom {

  /**
   * Возвращает тип элемента (размерная линия радиуса)
   */
  get elm_type() {
    return $p.enm.elm_types.Радиус;
  }

  get path() {
    // ищем точку 1 на пути профиля
    // строим нормаль - это и будет наш путь

    const {children, _attr} = this;
    if(!children.length){
      return;
    }
    const {path} = _attr.elm1;
    // если точки профиля еще не нарисованы - выходим
    if(!path){
      return;
    }

    // точка начала
    let b = path.getPointAt(_attr.p1);
    // нормаль
    const n = path.getNormalAt(_attr.p1).normalize(100);
    // путь
    const res = new paper.Path({insert: false, segments: [b, b.add(n)]});
    res.offset = 0;
    return res;
  }

  redraw() {
    const {children, _attr, path, align} = this;
    if(!path){
      this.visible = false;
      return;
    }
    this.visible = true;

    const b = path.firstSegment.point;
    const e = path.lastSegment.point;
    const c = path.getPointAt(50);
    const n = path.getNormalAt(0).multiply(10);
    const c1 = c.add(n);
    const c2 = c.subtract(n);

    if(children.callout1.segments.length){
      children.callout1.firstSegment.point = b;
      children.callout1.lastSegment.point = c1;
    }
    else{
      children.callout1.addSegments([b, c1]);
    }

    if(children.callout2.segments.length){
      children.callout2.firstSegment.point = b;
      children.callout2.lastSegment.point = c2;
    }
    else{
      children.callout2.addSegments([b, c2]);
    }

    if(children.scale.segments.length){
      children.scale.firstSegment.point = b;
      children.scale.lastSegment.point = e;
    }
    else{
      children.scale.addSegments([b, e]);
    }

    children.text.rotation = e.subtract(b).angle;
    children.text.justification = 'left';
    if(_attr.by_curve) {
      const curv = Math.abs(_attr.elm1.path.getCurvatureAt(_attr.p1));
      if(curv) {
        children.text.content = `R${(1 / curv).round(0)}`;
      }
    }
    else {
      const {path, _attr: {_corns}} = _attr.elm1;
      const sub = _attr.p1 > _attr.elm1.length ? path.get_subpath(_corns[3], _corns[4]) : path.get_subpath(_corns[1], _corns[2])
      children.text.content = `R${sub.ravg().round(0)}`;
    }

    children.text.position = e.add(path.getTangentAt(0).multiply(consts.font_size * 1.4));
  }

}

EditorInvisible.DimensionRadius = DimensionRadius;


/**
 * ### Заполнение
 * - Инкапсулирует поведение элемента заполнения
 * - У заполнения есть коллекция рёбер, образующая путь контура
 * - Путь всегда замкнутый, образует простой многоугольник без внутренних пересечений, рёбра могут быть гнутыми
 *
 * @class Filling
 * @param attr {Object} - объект со свойствами создаваемого элемента
 * @constructor
 * @extends BuilderElement
 * @menuorder 45
 * @tooltip Заполнение
 */

class Filling extends AbstractFilling(BuilderElement) {

  constructor(attr) {

    const {path} = attr;
    if(path){
      delete attr.path;
    }

    super(attr);

    if(path){
      attr.path = path;
    }

    // initialize
    this.initialize(attr);

  }

  initialize(attr) {

    // узлы и рёбра раскладок заполнения
    this._skeleton = new Skeleton(this);

    const _row = attr.row;
    const {_attr, project, layer} = this;
    const {bounds: pbounds} = project;

    if(_row.path_data){
      if(layer instanceof ContourNestedContent) {
        const {bounds: lbounds} = layer;
        const x = lbounds.x + pbounds.x;
        const y = lbounds.y + pbounds.y;
        const path = new paper.Path({pathData: _row.path_data, insert: false});
        path.translate([x, y]);
        _row.path_data = path.pathData;
      }
      _attr.path = new paper.Path(_row.path_data);
    }

    else if(attr.path){
      _attr.path = new paper.Path();
      this.path = attr.path;
    }
    else{
      const h = pbounds.height + pbounds.y;
      _attr.path = new paper.Path([
        [_row.x1, h - _row.y1],
        [_row.x1, h - _row.y2],
        [_row.x2, h - _row.y2],
        [_row.x2, h - _row.y1]
      ]);
    }

    _attr.path.closePath(true);
    _attr.path.reduce();
    _attr.path.strokeWidth = 0;

    // для нового устанавливаем вставку по умолчанию
    const {enm: {elm_types}, utils} = $p;
    if(_row.inset.empty()){
      _row.inset = project.default_inset({elm_type: elm_types.glasses, elm: this});
    }

    // для нового устанавливаем цвет по умолчанию
    if(_row.clr.empty()){
      layer.sys.elmnts.find_rows({nom: _row.inset}, (row) => {
        _row.clr = row.clr;
        return false;
      });
    }
    if(_row.clr.empty()){
      layer.sys.elmnts.find_rows({elm_type: {in: elm_types.glasses}}, (row) => {
        _row.clr = row.clr;
        return false;
      });
    }
    this.clr = _row.clr;

    if(_row.elm_type.empty()){
      _row.elm_type = elm_types.Стекло;
    }

    _attr.path.visible = false;

    this.addChild(_attr.path);

    // раскладки текущего заполнения
    _row._owner.find_rows({
      cnstr: this.layer.cnstr,
      parent: this.elm,
      elm_type: elm_types.Раскладка
    }, (row) => new Onlay({row, parent: this}));

    // спецификация стеклопакета прототипа
    if (attr.proto) {
      const {glass_specification, _data} = this.ox;
      const {_loading} = _data;
      const tmp = [];
      glass_specification.find_rows({elm: attr.proto.elm}, ({clr, inset, dop}) => {
        tmp.push({elm: this.elm, clr, inset, dop: utils._clone(dop)});
      });
      _data._loading = true;
      glass_specification.clear({elm: this.elm});
      tmp.forEach((row) => glass_specification.add(row));
      _data._loading = _loading;
    }

  }

  get elm_type() {
    const {elm_types} = $p.enm;
    const {nom} = this;
    return nom.elm_type == elm_types.Заполнение ? nom.elm_type : elm_types.Стекло;
  }

  /**
   * Вычисляемые поля в таблице координат
   * @method save_coordinates
   * @for Filling
   */
  save_coordinates() {

    const {_row, project, layer, profiles, bounds, imposts, area, thickness, nom, ox: {cnn_elmnts: cnns, glasses}} = this;
    const h = project.bounds.height + project.bounds.y;
    const {length} = profiles;

    // строка в таблице заполнений продукции
    glasses.add({
      elm: _row.elm,
      nom: nom,
      formula: this.formula(),
      width: bounds.width,
      height: bounds.height,
      s: area,
      is_rectangular: this.is_rectangular,
      is_sandwich: nom.elm_type == $p.enm.elm_types.Заполнение,
      thickness,
    });

    let curr, prev,	next

    // координаты bounds
    _row.x1 = (bounds.bottomLeft.x - project.bounds.x).round(3);
    _row.y1 = (h - bounds.bottomLeft.y).round(3);
    _row.x2 = (bounds.topRight.x - project.bounds.x).round(3);
    _row.y2 = (h - bounds.topRight.y).round(3);
    _row.s = area;
    if(layer instanceof ContourNestedContent) {
      const {lbounds} = layer.layer;
      const path = this.path.clone({insert: false});
      path.translate([-lbounds.x, -lbounds.y]);
      _row.path_data = path.pathData;
      _row.x1 -= lbounds.x;
      _row.y1 -= lbounds.y;
      _row.x2 -= lbounds.x;
      _row.y2 -= lbounds.y;
    }
    else {
      _row.path_data = this.path.pathData;
    }

    // получаем пути граней профиля
    for(let i=0; i<length; i++ ){

      curr = profiles[i];

      if(!curr.profile || !curr.profile._row || !curr.cnn){
        if($p.job_prm.debug) {
          throw new ReferenceError('Не найдено ребро заполнения');
        }
        else {
          return;
        }
      }

      curr.aperture_path = curr.profile.generatrix.get_subpath(curr.b, curr.e)._reversed ?
        curr.profile.rays.outer : curr.profile.rays.inner;
    }

    // получам пересечения
    for(let i=0; i<length; i++ ){

      prev = i === 0 ? profiles[length-1] : profiles[i-1];
      curr = profiles[i];
      next = i === length-1 ? profiles[0] : profiles[i+1];

      const pb = curr.aperture_path.intersect_point(prev.aperture_path, curr.b, true);
      const pe = curr.aperture_path.intersect_point(next.aperture_path, curr.e, true);

      if(!pb || !pe) {
        if($p.job_prm.debug) {
          throw 'Filling:path';
        }
        else {
          return;
        }
      }

      // соединения с профилями
      cnns.add({
        elm1: _row.elm,
        elm2: curr.profile._row.elm,
        node1: '',
        node2: '',
        cnn: curr.cnn.ref,
        aperture_len: curr.aperture_path.get_subpath(pb, pe).length.round(1)
      });

    }

    // удаляем лишние ссылки
    for(let i=0; i<length; i++ ){
      delete profiles[i].aperture_path;
    }

    // дочерние раскладки
    imposts.forEach((onlay) => onlay.save_coordinates());
  }

  /**
   * Создаёт створку в текущем заполнении
   */
  create_leaf(furn, direction) {

    const {project, layer, _row, ox, elm: elm1} = this;

    // прибиваем соединения текущего заполнения
    ox.cnn_elmnts.clear({elm1});

    // создаём пустой новый слой
    let kind = 0;
    if(typeof furn === 'string') {
      if(furn.includes('nested')) {
        kind = 2;
      }
      else if(furn.includes('virtual')) {
        kind = 1;
      }
    }
    const cattr = {project, kind, parent: this.parent};
    // фурнитура и параметры по умолчанию
    if(direction) {
      cattr.direction = direction;
    }
    const {utils} = $p;
    if(kind === 0) {
      if((utils.is_data_obj(furn) && !furn.empty()) || (utils.is_guid(furn) && furn !== utils.blank.guid)) {
        cattr.furn = furn;
      }
      else {
        cattr.furn = layer.default_furn;
      }
    }
    const contour = Contour.create(cattr);

    // задаём его путь - внутри будут созданы профили
    contour.path = this.profiles;

    // помещаем себя вовнутрь нового слоя
    if(kind === 2) {
      this.remove();
    }
    else {
      this.parent = contour;
      _row.cnstr = contour.cnstr;
      // дочерние раскладки
      this.imposts.forEach(({_row}) => _row.cnstr = contour.cnstr);
    }

    // оповещаем мир о новых слоях
    project.notify(contour, 'rows', {constructions: true});

    // делаем створку текущей
    contour.activate();
    return contour;
  }

  /**
   * Возвращает сторону соединения заполнения с профилем раскладки
   */
  cnn_side() {
    return $p.enm.cnn_sides.inner;
  }

  /**
   * Примыкающий внешний элемент - для заполнений всегда null
   */
  nearest() {
    return null;
  }

  select_node(v) {
    let point, segm, delta = Infinity;
    if(v === "b"){
      point = this.bounds.bottomLeft;
    }else{
      point = this.bounds.topRight;
    }
    this._attr.path.segments.forEach((curr) => {
      curr.selected = false;
      if(point.getDistance(curr.point) < delta){
        delta = point.getDistance(curr.point);
        segm = curr;
      }
    });
    if(segm){
      segm.selected = true;
      this.view.update();
    }
  }

  setSelection(selection) {
    super.setSelection(selection);
    if(selection){
      const {path} = this;
      for(let elm of this.children){
        if(elm != path){
          elm.selected = false;
        }
      }
    }
  }

  /**
   * Перерисовывает раскладки текущего заполнения
   */
  redraw() {

    this.sendToBack();

    const {path, imposts, _attr, is_rectangular} = this;
    const {elm_font_size, font_family} = consts;
    const fontSize = elm_font_size * (2 / 3);
    const maxTextWidth = 600;
    path.visible = true;
    imposts.forEach((elm) => elm.redraw());

    // прочистим пути
    this.purge_paths();

    // если текст не создан - добавляем
    if(!_attr._text){
      _attr._text = new paper.PointText({
        parent: this,
        fillColor: 'black',
        fontFamily: font_family,
        fontSize,
        guide: true,
        visible: true,
      });
    }

    // Задаем надпись формулы
    const {bounds} = path;
    _attr._text.content = this.formula();

    const textBounds = bounds.scale(0.88);
    textBounds.width = textBounds.width > maxTextWidth ? maxTextWidth : textBounds.width;
    textBounds.height = textBounds.height > maxTextWidth ? maxTextWidth : textBounds.height;

    if(is_rectangular){
      const turn = textBounds.width * 1.5 < textBounds.height;
      if(turn){
        textBounds.width = elm_font_size;
        _attr._text.rotation = 270;
      }
      else{
        textBounds.height = elm_font_size;
        _attr._text.rotation = 0;
      }
      _attr._text.fitBounds(textBounds);
      _attr._text.point = turn
        ? bounds.bottomRight.add([-fontSize, -fontSize * 0.6])
        : bounds.bottomLeft.add([fontSize * 0.6, -fontSize]);
    }
    else{
      textBounds.height = elm_font_size;
      _attr._text.rotation = 0;
      _attr._text.fitBounds(textBounds);
      // Поиск самой длинной кривой пути
      const maxCurve = path.curves.reduce((curv, item) => item.length > curv.length ? item : curv, path.curves[0]);
      if(maxCurve) {
        const {angle, angleInRadians} = maxCurve.line.vector;
        const {PI} = Math;
        _attr._text.rotation = angle;
        const biasPoint = new paper.Point(Math.cos(angleInRadians + PI / 4), Math.sin(angleInRadians + PI / 4)).multiply(3 * elm_font_size);
        _attr._text.point = maxCurve.point1.add(biasPoint);
        // Перевернуть с головы на ноги
        if(Math.abs(angle) >= 85 && Math.abs(angle) <= 185){
          _attr._text.point = _attr._text.bounds.rightCenter;
          _attr._text.rotation += 180;
        }
      }
    }
  }

  /**
   * ### Рисует заполнение отдельным элементом
   */
  draw_fragment(no_zoom) {
    const {l_dimensions, layer, path, imposts} = this;
    this.visible = true;
    path.set({
      strokeColor: 'black',
      strokeWidth: 1,
      strokeScaling: false,
      opacity: 0.6,
    });
    imposts.forEach((elm) => elm.redraw());
    l_dimensions.redraw(true);
    layer.draw_visualization();
    const {l_visualization: lv} = layer;
    lv._by_insets && lv._by_insets.removeChildren();
    lv._cnn && lv._cnn.removeChildren();
    lv._opening && lv._opening.removeChildren();
    lv.visible = true;
    !no_zoom && layer.zoom_fit();
  }

  reset_fragment() {
    const {_attr, layer, path} = this;
    if(_attr._dimlns) {
      _attr._dimlns.remove();
      delete _attr._dimlns;
    }
    path.set({
      strokeColor: null,
      strokeWidth: 0,
      strokeScaling: true,
      opacity: 1,
    });
    this.visible = !layer.hidden;
  }

  /**
   * Сеттер вставки с учетом выделенных элементов
   * @param v {CatInserts}
   * @param [ign_select] {Boolean}
   * @param [force] {Boolean}
   */
  set_inset(v, ign_select, force) {

    if(!force && this.inset == v) {
      return;
    }

    const inset = $p.cat.inserts.get(v);
    const {insert_type} = inset;

    const {project, elm, _row, _attr, ox: {glass_specification}} = this;
    _row.inset = inset;
    delete _attr.nom;

    if(!ign_select){

      // проверим доступность цветов, при необходимости обновим
      inset.clr_group.default_clr(this);

      // если для заполнения был определён состав - очищаем
      glass_specification.clear({elm});
      // если тип стеклопакет - заполняем по умолчанию
      if(insert_type === insert_type._manager.Стеклопакет) {
        for(const row of inset.specification) {
          row.quantity && glass_specification.add({elm, inset: row.nom});
        }
      }

      // транслируем изменения на остальные выделенные заполнения
      project.selected_glasses().forEach((selm) => {
        if(selm !== this){
          // копируем вставку
          selm.set_inset(inset, true, force);
          // сбрасываем состав заполнения
          glass_specification.clear({elm: selm.elm});
          // если тип стеклопаке - заполняем по умолчанию
          if(insert_type === insert_type._manager.Стеклопакет) {
            for(const row of inset.specification) {
              row.quantity && glass_specification.add({elm: selm.elm, inset: row.nom});
            }
          }
          // устанавливаем цвет, как у нас
          selm.clr = this.clr;
        }
      });
    }

    project.register_change();
    project._scope.eve.emit('set_inset', this);
  }

  /**
   * Сеттер цвета элемента
   * @param v {CatClrs}
   * @param ign_select {Boolean}
   */
  set_clr(v, ign_select) {
    if(!ign_select && this.project.selectedItems.length > 1){
      this.project.selected_glasses().forEach((elm) => {
        if(elm !== this){
          elm.set_clr(v, true);
        }
      });
    }
    super.set_clr(v);
  }

  /**
   * Прочищает паразитные пути
   */
  purge_paths() {
    const paths = this.children.filter((child) => child instanceof paper.Path);
    const {path} = this;
    paths.forEach((p) => p !== path && p.remove());
  }

  /**
   * Заливка красным с градиентом
   */
  fill_error() {
    const {path} = this;
    path.fillColor = new paper.Color({
      stops: ['#fee', '#faa', '#fcc'],
      origin: path.bounds.bottomLeft,
      destination: path.bounds.topRight
    });
  }

  /**
   * Возвращает формулу (код состава) заполнения
   * @type String
   */
  formula(by_art) {
    const {elm, inset, ox} = this;
    const {utils: {blank}, cch: {properties}} = $p;
    let res;
    ox.glass_specification.find_rows({elm, inset: {not: blank.guid}}, ({inset, clr, dop: {params}}) => {
      let {name, article, clr_group} = inset;
      const aname = name.split(' ');
      if(by_art && article){
        name = article;
      }
      else if(aname.length){
        name = aname[0];
      }
      if(!res){
        res = name;
      }
      else{
        res += (by_art ? '*' : 'x') + name;
      }
      // подмешаем цвет, если он отличается от умолчания
      if(!clr_group.empty() && !clr.empty() && clr_group.clrs()[0] != clr) {
        res += clr.machine_tools_clr || clr.name;
      }

      // подмешаем параметры с битом 'включать в наименование'
      if(params) {
        for(const ref in params) {
          const param = properties.get(ref);
          if(param.include_to_name) {
            const pname = param.predefined_name || param.name.split(' ')[0];
            if(param.type.types[0] == 'boolean') {
              if(params[ref]) {
                res += pname;
              }
              continue;
            }
            const v = param.fetch_type(params[ref]);
            if(v != undefined) {
              res += `${pname}:${v.toString()}`;
            }
          }
        }
      }

    });
    return res || (by_art ? inset.article || inset.name : inset.name);
  }

  /**
   * сбрасывает выделение с точек раскладки
   */
  deselect_onlay_points() {
    for(const {generatrix} of this.imposts) {
      generatrix.segments.forEach((segm) => {
        if(segm.selected) {
          segm.selected = false;
        }
      });
      if(generatrix.selected) {
        generatrix.selected = false;
      }
    }
  }

  /**
   * Массив раскладок
   */
  get imposts() {
    return this.getItems({class: Onlay});
  }

  get profiles() {
    return this._attr._profiles || [];
  }

  /**
   * Удаляет все раскладки заполнения
   */
  remove_onlays() {
    for(let onlay of this.imposts){
      onlay.remove();
    }
  }

  /**
   * При удалении заполнения, не забываем про вложенные раскладки
   * @method remove
   */
  remove() {
    //удаляем детей
    this.remove_onlays();

    // стандартные действия по удалению элемента paperjs
    super.remove();
  }


  /**
   * Габаритная площадь заполнения
   * @return {number}
   */
  get area() {
    return (this.bounds.area / 1e6).round(5);
  }

  /**
   * площадь заполнения с учетом наклонов-изгибов сегментов
   * @return {number}
   */
  get form_area() {
    return (this.path.area/1e6).round(5);
  }

  /**
   * ### Точка внутри пути
   * Возвращает точку, расположенную гарантированно внутри заполнения
   *
   * @property interiorPoint
   * @type paper.Point
   */
  interiorPoint() {
    return this.path.interiorPoint;
  }

  /**
   * Признак прямоугольности
   */
  get is_rectangular() {
    const {profiles, path} = this;
    return profiles.length === 4 && !path.hasHandles() && !profiles.some(({profile}) => !(Math.abs(profile.angle_hor % 90) < 0.2));
  }

  get generatrix() {
    return this.path;
  }

  /**
   * путь элемента - состоит из кривых, соединяющих вершины элемента
   * @property path
   * @type paper.Path
   */
  get path() {
    return this._attr.path;
  }
  set path(attr) {
    let {_attr, path, project} = this;

    // чистим старый путь
    if(path){
      path.removeSegments();
    }
    else{
      path = _attr.path = new paper.Path({parent: this});
    }

    // чистим старые сегменты
    if(Array.isArray(_attr._profiles)){
      _attr._profiles.length = 0;
    }
    else{
      _attr._profiles = [];
    }

    if(attr instanceof paper.Path){
      path.addSegments(attr.segments);
    }
    else if(Array.isArray(attr)){
      let {length} = attr;
      if(length > 1) {
        let prev, curr, next;
        const {cat: {cnns}, enm: {cnn_types}, job_prm} = $p;
        // получам эквидистанты сегментов, смещенные на размер соединения
        for (let i = 0; i < length; i++) {
          curr = attr[i];
          next = i === length - 1 ? attr[0] : attr[i + 1];
          const sub_path = curr.profile.generatrix.get_subpath(curr.b, curr.e, true);
          curr.cnn = cnns.elm_cnn(this, curr.profile, cnn_types.acn.ii, project.elm_cnn(this, curr.profile), false, curr.outer);
          curr.sub_path = sub_path.equidistant((sub_path._reversed ? -curr.profile.d1 : curr.profile.d2) + (curr.cnn ? curr.cnn.size(this) : 20));
        }
        // получам пересечения
        for (let i = 0; i < length; i++) {
          prev = i === 0 ? attr[length-1] : attr[i-1];
          curr = attr[i];
          next = i === length-1 ? attr[0] : attr[i+1];
          if(!curr.pb) {
            curr.pb = curr.sub_path.intersect_point(prev.sub_path, curr.b, consts.sticking);
            if(prev !== next) {
              prev.pe = curr.pb;
            }
          }
          if(!curr.pe) {
            curr.pe = curr.sub_path.intersect_point(next.sub_path, curr.e, consts.sticking);
            if(prev !== next) {
              next.pb = curr.pe;
            }
          }
        }
        for (let i = 0; i < length; i++) {
          curr = attr[i];
          if(curr.pb && curr.pe){
            curr.sub_path = curr.sub_path.get_subpath(curr.pb, curr.pe, true);
          }
          else if(job_prm.debug) {
            throw 'Filling:path';
          }
        }

        // прочищаем для пересечений
        if(length > 2) {
          const remove = [];
          for (let i = 0; i < length; i++) {
            prev = i === 0 ? attr[length-1] : attr[i-1];
            next = i === length-1 ? attr[0] : attr[i+1];
            const crossings =  prev.sub_path.getCrossings(next.sub_path);
            if(crossings.length){
              if((prev.e.getDistance(crossings[0].point) < prev.profile.width * 2) ||  (next.b.getDistance(crossings[0].point) < next.profile.width * 2)) {
                remove.push(attr[i]);
                prev.sub_path.splitAt(crossings[0]);
                const nloc = next.sub_path.getLocationOf(crossings[0].point);
                next.sub_path = next.sub_path.splitAt(nloc);
              }
            }
          }
          for(const segm of remove) {
            attr.splice(attr.indexOf(segm), 1);
            length--;
          }
        }

        // формируем путь
        for (let i = 0; i < length; i++) {
          curr = attr[i];
          path.addSegments(curr.sub_path.segments.filter((v, index) => {
            if(index || !path.segments.length || v.hasHandles()) {
              return true;
            }
            return !path.lastSegment.point.is_nearest(v.point, 1);
          }));
          ['anext', 'pb', 'pe'].forEach((prop) => delete curr[prop]);
          _attr._profiles.push(curr);
        }
      }
    }

    if(path.segments.length && !path.closed){
      path.closePath(true);
    }

    // прочищаем самопересечения
    const intersections = path.self_intersections();
    if(intersections.length) {

      // ищем лишние рёбра
      const {curves, segments} = path;
      const purge = new Set();
      for(const {point} of intersections) {
        for(const rib of attr) {
          rib._sub.b.is_nearest(point, true) && rib._sub.e.is_nearest(point, true) && purge.add(rib);
        }
      }
      if(purge.size) {
        purge.forEach((rib) => {
          const ind = attr.indexOf(rib);
          attr.splice(ind, 1);
        });

        // пересоздаём путь по новому массиву профилей
        return this.path = attr;
      }
    }
    path.reduce();

    // прочищаем от колинеарных кусочков
    for (let i = 0; i < path.segments.length;) {
      const prev = i === 0 ? path.segments[path.segments.length - 1] : path.segments[i - 1];
      const curr = path.segments[i];
      const next = i === (path.segments.length - 1) ? path.segments[0] : path.segments[i + 1];
      if(!prev.hasHandles() && !curr.hasHandles() && !next.hasHandles()) {
        const tmp = new paper.Path({insert: false, segments: [prev, next]});
        if(tmp.is_nearest(curr.point, 1)) {
          curr.remove();
          continue;
        }
      }
      i++;
    }
  }

  // возвращает текущие (ранее установленные) узлы заполнения
  get nodes() {
    let res = this.profiles.map((curr) => curr.b);
    if(!res.length){
      const {path, parent} = this;
      if(path){
        res = parent.glass_nodes(path);
      }
    }
    return res;
  }

  /**
   * Возвращает массив внешних примыкающих профилей текущего заполнения
   */
  get outer_profiles() {
    return this.profiles;
  }

  /**
   * Массив с рёбрами периметра
   */
  get perimeter() {
    const res = [];
    const {profiles} = this;
    profiles.forEach((curr, index) => {
      const next = profiles[index === profiles.length - 1 ? 0 : index + 1];
      const tmp = {
        b: curr.b,
        e: curr.e,
        len: curr.sub_path.length,
        angle: curr.e.subtract(curr.b).angle,
        profile: curr.profile,
        next: next.profile,
        angle_next: curr.profile.generatrix.angle_to(next.profile.generatrix, curr.e, true, 0),
      }
      res.push(tmp);
      if(tmp.angle < 0){
        tmp.angle += 360;
      }
    });
    return res;
  }

  get bounds() {
    const {path} = this;
    return path ? path.bounds : new paper.Rectangle();
  }

  /**
   * Массив с рёбрами периметра по внутренней стороне профилей
   * @return {Array}
   */
  perimeter_inner(size = 0) {
    // накопим в res пути внутренних рёбер профилей
    const {center} = this.bounds;
    const res = this.outer_profiles.map((curr) => {
      const profile = curr.profile || curr.elm;
      const {inner, outer} = profile.rays;
      const sub_path = inner.getNearestPoint(center).getDistance(center, true) < outer.getNearestPoint(center).getDistance(center, true) ?
        inner.get_subpath(inner.getNearestPoint(curr.b), inner.getNearestPoint(curr.e)) :
        outer.get_subpath(outer.getNearestPoint(curr.b), outer.getNearestPoint(curr.e));
      let angle = curr.e.subtract(curr.b).angle.round(1);
      if(angle < 0) angle += 360;
      return {
        profile,
        sub_path,
        angle,
        b: curr.b,
        e: curr.e,
      };
    });
    const ubound = res.length - 1;
    return res.map((curr, index) => {
      let sub_path = curr.sub_path.equidistant(size);
      const prev = !index ? res[ubound] : res[index - 1];
      const next = (index == ubound) ? res[0] : res[index + 1];
      const b = sub_path.intersect_point(prev.sub_path.equidistant(size), curr.b, true);
      const e = sub_path.intersect_point(next.sub_path.equidistant(size), curr.e, true);
      if (b && e) {
        sub_path = sub_path.get_subpath(b, e);
      }
      return {
        profile: curr.profile,
        angle: curr.angle,
        len: sub_path.length,
        sub_path,
      };
    });
  }

  /**
   * Габариты по световому проему
   * @param size
   * @return {Rectangle}
   */
  bounds_light(size = 0) {
    const path = new paper.Path({insert: false});
    for (const {sub_path} of this.perimeter_inner(size)) {
      path.addSegments(sub_path.segments);
    }
    if (path.segments.length && !path.closed) {
      path.closePath(true);
    }
    path.reduce();
    return path.bounds;
  }

  /**
   * Координата x левой границы (только для чтения)
   */
  get x1() {
    return (this.bounds.left - this.project.bounds.x).round(1);
  }

  /**
   * Координата x правой границы (только для чтения)
   */
  get x2() {
    return (this.bounds.right - this.project.bounds.x).round(1);
  }

  /**
   * Координата y нижней границы (только для чтения)
   */
  get y1() {
    return (this.project.bounds.height + this.project.bounds.y - this.bounds.bottom).round(1);
  }

  /**
   * Координата y верхней (только для чтения)
   */
  get y2() {
    return (this.project.bounds.height + this.project.bounds.y - this.bounds.top).round(1);
  }

  /**
   * информация для редактора свойста
   */
  get info() {
    const {elm, bounds: {width, height}, thickness, weight, layer} = this;
    return `№${layer instanceof ContourNestedContent ?
      `${layer.layer.cnstr}-${elm}` : elm} ${width.toFixed()}х${height.toFixed()}, ${thickness.toFixed()}мм, ${weight.toFixed()}кг`;
  }

  /**
   * Описание полей диалога свойств элемента
   */
  get oxml() {
    const oxml = {
      ' ': [
        {id: 'info', path: 'o.info', type: 'ro'},
        'inset',
        'clr'
      ],
      Начало: [
        {id: 'x1', path: 'o.x1', synonym: 'X1', type: 'ro'},
        {id: 'y1', path: 'o.y1', synonym: 'Y1', type: 'ro'}
      ],
      Конец: [
        {id: 'x2', path: 'o.x2', synonym: 'X2', type: 'ro'},
        {id: 'y2', path: 'o.y2', synonym: 'Y2', type: 'ro'}
      ]
    };
    if(this.selected_cnn_ii()) {
      oxml.Примыкание = ['cnn3'];
    }
    const props = this.elm_props();
    if(props.length) {
      oxml.Свойства = props.map(({ref}) => ref);
    }
    return oxml;
  }

  get default_clr_str() {
    return "#def,#d0ddff,#eff";
  }

  // виртуальная ссылка для заполнений равна толщине
  get ref() {
    return this.thickness.toFixed();
  }

  // переопределяем геттер вставки
  get inset() {
    const {_attr, _row, ox} = this;
    if(!_attr._ins_proxy || _attr._ins_proxy.ref != _row.inset){
      _attr._ins_proxy = new Proxy(_row.inset, {
        get: (target, prop) => {
          switch (prop) {
          case 'presentation':
            return this.formula();
          case 'thickness':
            return this._thickness;
          case 'target':
            return target;
          default:
            return target[prop];
          }
        }
      });
    }
    return _attr._ins_proxy;
  }
  set inset(v) {
    this.set_inset(v);
  }

  _thickness(elm) {
    let res = 0;
    elm.ox.glass_specification.find_rows({elm: elm.elm}, ({inset}) => {
      res += inset.thickness(elm);
    });
    return res || this.target.thickness(elm);
  }

  /**
   * Proxy-обёртка над заполнением
   * @param row
   * @return {Proxy.<Filling>}
   */
  region(row) {
    const {utils, cch} = $p;
    const _metadata = this.__metadata(false);
    return new Proxy(this, {
      get(target, prop, receiver) {
        switch (prop){
        case 'rnum':
          return row.row;
        case 'irow':
          return row;
        case 'inset':
          return row.inset;
        case 'clr':
          return row.clr;
        case '_metadata':
          return _metadata;
        default:
          let pvalue;
          if(utils.is_guid(prop)) {
            const param = cch.properties.get(prop);
            if(!param.empty()) {
              const {params} = row.dop;
              pvalue = param.fetch_type(params ? params[prop] : '');
            }
          }
          return pvalue === undefined ? target[prop] : pvalue;
        }
      },

      set(target, prop, val, receiver) {
        switch (prop) {
        case 'clr':
          row.clr = val;
          break;
        default:
          if(utils.is_guid(prop)) {
            const param = cch.properties.get(prop);
            if(!param.empty()) {
              let {params} = row.dop;
              if(!params) {
                params = {};
              }
              params[prop] = typeof val === 'undefined' ? '' : val.valueOf();
              row.dop = {params};
            }
          }
          else {
            target[prop] = val;
          }
        }
        target.project.register_change(true);
        return true;
      }
    });
  }

}

EditorInvisible.Filling = Filling;


/**
 *
 * Created 21.08.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2018
 * @author    Evgeniy Malyarov
 *
 * @module geometry
 * @submodule freetext
 */

/**
 * ### Произвольный текст на эскизе
 *
 * @class FreeText
 * @param attr {Object} - объект с указанием на строку координат и родительского слоя
 * @param attr.parent {BuilderElement} - элемент, к которому привязывается комментарий
 * @constructor
 * @extends paper.PointText
 * @menuorder 46
 * @tooltip Текст на эскизе
 */
class FreeText extends paper.PointText {

  constructor(attr) {

    if(!attr.fontSize){
      attr.fontSize = consts.font_size;
      if(attr.parent) {
        const {width, height} = attr.parent.project.bounds;
        const {cutoff, font_size} = consts;
        const size = Math.max(width - cutoff, height - cutoff) / 60;
        attr.fontSize += (size > 0 ? size : 0).round();
      }
    }
    attr.fontFamily = consts.font_family;

    super(attr);

    if(attr.row){
      this._row = attr.row;
    }
    else{
      this._row = attr.row = this.project.ox.coordinates.add();
    }

    const {_row} = this;

    if(!_row.cnstr){
      _row.cnstr = attr.parent ? attr.parent.layer.cnstr : this.project.activeLayer.cnstr;
    }

    if(!_row.elm){
      _row.elm = this.project.ox.coordinates.aggregate([], ["elm"], "max") + 1;
    }

    if(attr.point){
      if(attr.point instanceof paper.Point)
        this.point = attr.point;
      else
        this.point = new paper.Point(attr.point);
    }
    else{

      this.clr = _row.clr;
      this.angle = _row.angle_hor;

      if(_row.path_data){
        var path_data = JSON.parse(_row.path_data);
        this.x = _row.x1 + path_data.bounds_x || 0;
        this.y = _row.y1 - path_data.bounds_y || 0;
        this._mixin(path_data, null, ["bounds_x","bounds_y"]);
      }else{
        this.x = _row.x1;
        this.y = _row.y1;
      }
    }

    this.bringToFront();

  }

  /**
   * Удаляет элемент из контура и иерархии проекта
   * Одновлеменно, удаляет строку из табчасти табчасти _Координаты_
   * @method remove
   */
  remove() {
    if(this._row) {
      this._row._owner.del(this._row);
      this._row = null;
    }
    paper.PointText.prototype.remove.call(this);
  }

  /**
   * Вычисляемые поля в таблице координат
   * @method save_coordinates
   */
  save_coordinates() {
    const {_row} = this;

    _row.x1 = this.x;
    _row.y1 = this.y;
    _row.angle_hor = this.angle;

    // устанавливаем тип элемента
    _row.elm_type = this.elm_type;

    // сериализованные данные
    _row.path_data = JSON.stringify({
      text: this.text,
      font_family: this.font_family,
      font_size: this.font_size,
      bold: this.bold,
      align: this.align.ref,
      bounds_x: this.project.bounds.x,
      bounds_y: this.project.bounds.y
    });
  }

  /**
   * ### Перемещает элемент и информирует об этом наблюдателя
   * @method move_points
   */
  move_points(point) {
    this.point = point;
    this.project.notify(this, 'update', {x: true, y: true});
  }

  /**
   * Возвращает тип элемента (Текст)
   * @property elm_type
   * @for FreeText
   */
  get elm_type() {
    return $p.enm.elm_types.Текст;
  }

  // виртуальные метаданные для автоформ
  _metadata(fld) {
    return $p.dp.builder_text.metadata(fld);
  }

  // виртуальный датаменеджер для автоформ
  get _manager() {
    return $p.dp.builder_text;
  }

  // транслирует цвет из справочника в строку и обратно
  get clr() {
    return this._row ? this._row.clr : $p.cat.clrs.get();
  }
  set clr(v) {
    this._row.clr = v;
    if(this._row.clr.clr_str.length == 6)
      this.fillColor = "#" + this._row.clr.clr_str;
    this.project.register_update();
  }

  // семейство шрифта
  get font_family() {
    return this.fontFamily || "";
  }
  set font_family(v) {
    this.fontFamily = v;
    this.project.register_update();
  }

  // размер шрифта
  get font_size() {
    return this.fontSize || consts.font_size;
  }
  set font_size(v) {
    this.fontSize = v;
    this.project.register_update();
  }

  // жирность шрифта
  get bold() {
    return this.fontWeight != 'normal';
  }
  set bold(v) {
    this.fontWeight = v ? 'bold' : 'normal';
  }

  // координата x
  get x() {
    return (this.point.x - this.project.bounds.x).round(1);
  }
  set x(v) {
    this.point.x = parseFloat(v) + this.project.bounds.x;
    this.project.register_update();
  }

  // координата y
  get y() {
    const {bounds} = this.project;
    return (bounds.height + bounds.y - this.point.y).round(1);
  }
  set y(v) {
    const {bounds} = this.project;
    this.point.y = bounds.height + bounds.y - parseFloat(v);
  }

  // текст элемента - при установке пустой строки, элемент удаляется
  get text() {
    return this.content;
  }
  set text(v) {
    if(!v){
      v = ' ';
    }
    this.content = v;
    this.project.register_update();
  }

  // угол к горизонту
  get angle() {
    return Math.round(this.rotation);
  }
  set angle(v) {
    this.rotation = v;
    this.project.register_update();
  }

  // выравнивание текста
  get align() {
    return $p.enm.text_aligns.get(this.justification);
  }
  set align(v) {
    this.justification = $p.utils.is_data_obj(v) ? v.ref : v;
    this.project.register_update();
  }

}

EditorInvisible.FreeText = FreeText;



/**
 * ### Элемент c образующей
 * Виртуальный класс - BuilderElement, у которго есть образующая
 *
 * @class GeneratrixElement
 * @extends BuilderElement
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @constructor
 * @menuorder 41
 * @tooltip Элемент c образующей
 */
class GeneratrixElement extends BuilderElement {

  constructor(attr = {}) {
    const {generatrix} = attr;
    if (generatrix) {
      delete attr.generatrix;
    }
    super(attr);
    if (generatrix) {
      attr.generatrix = generatrix;
    }
    this.initialize(attr);
  }

  /**
   * ### Координаты начала элемента
   * @property b
   * @type paper.Point
   */
  get b() {
    const {generatrix} = this._attr;
    return generatrix && generatrix.firstSegment.point;
  }
  set b(v) {
    const {_rays, generatrix} = this._attr;
    _rays.clear();
    if(generatrix) generatrix.firstSegment.point = v;
  }

  /**
   * Координаты конца элемента
   * @property e
   * @type Point
   */
  get e() {
    const {generatrix} = this._attr;
    return generatrix && generatrix.lastSegment.point;
  }
  set e(v) {
    const {_rays, generatrix} = this._attr;
    _rays.clear();
    if(generatrix) generatrix.lastSegment.point = v;
  }

  /**
   * ### Координата x начала профиля
   *
   * @property x1
   * @type Number
   */
  get x1() {
    const {bounds} = this.project;
    return bounds ? (this.b.x - bounds.x).round(1) : 0;
  }
  set x1(v) {
    const {bounds} = this.project;
    if(bounds && (v = parseFloat(v) + bounds.x - this.b.x)) {
      this.select_node('b');
      this.move_points(new paper.Point(v, 0));
    }
  }

  /**
   * ### Координата y начала профиля
   *
   * @property y1
   * @type Number
   */
  get y1() {
    const {bounds} = this.project;
    return bounds ? (bounds.height + bounds.y - this.b.y).round(1) : 0;
  }
  set y1(v) {
    const {bounds} = this.project;
    if(bounds && (v = bounds.height + bounds.y - parseFloat(v) - this.b.y)) {
      this.select_node('b');
      this.move_points(new paper.Point(0, v));
    }
  }

  /**
   * ###Координата x конца профиля
   *
   * @property x2
   * @type Number
   */
  get x2() {
    const {bounds} = this.project;
    return bounds ? (this.e.x - bounds.x).round(1) : 0;
  }
  set x2(v) {
    const {bounds} = this.project;
    if(bounds && (v = parseFloat(v) + bounds.x - this.e.x)) {
      this.select_node('e');
      this.move_points(new paper.Point(v, 0));
    }
  }

  /**
   * ### Координата y конца профиля
   *
   * @property y2
   * @type Number
   */
  get y2() {
    const {bounds} = this.project;
    return bounds ? (bounds.height + bounds.y - this.e.y).round(1) : 0;
  }
  set y2(v) {
    const {bounds} = this.project;
    if(bounds && (v = bounds.height + bounds.y - parseFloat(v) - this.e.y)) {
      this.select_node('e');
      this.move_points(new paper.Point(0, v));
    }
  }

  /**
   * ### Выделяет начало или конец профиля
   *
   * @method select_node
   * @param node {String} b, e - начало или конец элемента
   */
  select_node(node) {
    const {generatrix, project, _attr, view} = this;
    project.deselect_all_points();
    if(_attr.path) {
      _attr.path.selected = false;
    }
    if(node == 'b') {
      generatrix.firstSegment.selected = true;
    }
    else {
      generatrix.lastSegment.selected = true;
    }
    view.update();
  }

  /**
   * Двигает элемент за один такт
   * Синхронно тянет импосты и угловые соединения
   * @param delta
   */
  move_gen(delta) {

    // сразу получаем сегменты примыкающих импостов и створок
    const imposts = this.joined_imposts ? this.joined_imposts() : {inner: [], outer: []};
    const isegments = [];
    imposts.inner.concat(imposts.outer).forEach(({profile}) => {
      const {b, e} = profile.rays;
      if(b.profile === this) {
        isegments.push({profile, node: 'b'});
      }
      if(e.profile === this) {
        isegments.push({profile, node: 'e'});
      }
    });
    const nearests = this.joined_nearests();

    // угловые соединения b, e
    const {generatrix, rays, project} = this;
    generatrix.translate(delta);
    for(const {profile, profile_point, point} of [rays.b, rays.e]) {
      if(profile && profile_point) {
        profile.generatrix.segments.forEach((segm) => segm.selected = false);
        profile[profile_point].selected = true;
        profile.move_points(point.subtract(profile[profile_point]));
        profile[profile_point].selected = false;
      }
    }

    // ранняя привязка импостов
    rays.clear();
    isegments.forEach(({profile, node}) => {
      profile.do_sub_bind(this, node);
      profile.rays.clear();
    });

    // ранняя привязка створок
    for(const profile of nearests) {
      profile.move_gen(delta);
    }

    rays.clear();
    project.register_change();
  }

  /**
   * ### Двигает узлы
   * Обрабатывает смещение выделенных сегментов образующей профиля
   *
   * @method move_points
   * @param delta {paper.Point} - куда и насколько смещать
   * @param [all_points] {Boolean} - указывает двигать все сегменты пути, а не только выделенные
   * @param [start_point] {paper.Point} - откуда началось движение
   */
  move_points(delta, all_points, start_point) {

    if(!delta.length){
      return;
    }

    const	other = [];
    const noti = {type: consts.move_points, profiles: [this], points: []};

    let changed;

    // если не выделено ни одного сегмента, двигаем все сегменты
    if(!all_points){
      all_points = !this.generatrix.segments.some((segm) => {
        if (segm.selected)
          return true;
      });
    }

    // сразу получаем сегменты примыкающих импостов
    const imposts = this.joined_imposts ? this.joined_imposts() : {inner: [], outer: []};
    const isegments = [];
    imposts.inner.concat(imposts.outer).forEach(({profile}) => {
      const {b, e} = profile.rays;
      if(b.profile === this) {
        isegments.push({profile, node: 'b'});
      }
      if(e.profile === this) {
        isegments.push({profile, node: 'e'});
      }
    });

    this.generatrix.segments.forEach((segm) => {

      let cnn_point;

      if (segm.selected || all_points){

        const noti_points = {old: segm.point.clone(), delta: delta};

        // собственно, сдвиг узлов
        const free_point = segm.point.add(delta);

        if(segm.point == this.b){
          cnn_point = this.rays.b;
          if(!cnn_point.profile_point || paper.Key.isDown('control')) {
            cnn_point = this.cnn_point('b', free_point);
          }
        }
        else if(segm.point == this.e){
          cnn_point = this.rays.e;
          if(!cnn_point.profile_point || paper.Key.isDown('control')){
            cnn_point = this.cnn_point('e', free_point);
          }
        }

        let {profile, profile_point} = cnn_point || {};

        if(cnn_point && cnn_point.cnn_types == $p.enm.cnn_types.acn.t && (segm.point == this.b || segm.point == this.e)){
          if(cnn_point.point.is_nearest(free_point, 0)){
            segm.point = cnn_point.point;
          }
          else{
            // при сдвигах примыканий к наклонным элементам, ищем точку на луче
            const ppath = (profile.nearest(true) ? profile.rays.outer : profile.generatrix).clone({insert: false});
            const {bounds} = ppath;
            if(Math.abs(delta.y) < consts.epsilon){
              // режем вертикальным лучом
              const ray = new paper.Path({
                insert: false,
                segments: [[free_point.x, bounds.top], [free_point.x, bounds.bottom]]
              });
              segm.point = ppath.intersect_point(ray, free_point, true) || free_point;
            }
            else if(Math.abs(delta.x) < consts.epsilon){
              // режем горизонтальным лучом
              const ray = new paper.Path({
                insert: false,
                segments: [[bounds.left, free_point.y], [bounds.right, free_point.y]]
              });
              segm.point = ppath.intersect_point(ray, free_point, true) || free_point;
            }
            else {
              segm.point = free_point;
            }
          }
        }
        else{
          segm.point = free_point;
          // если соединение угловое, тянем тянем соседние узлы сразу
          if(cnn_point && !paper.Key.isDown('control')){

            if(profile && profile_point && !profile[profile_point].is_nearest(free_point)){
              if(this instanceof Onlay){
                this.move_nodes(noti_points.old, free_point);
              }
              else{
                other.push(profile_point == 'b' ? profile.generatrix.firstSegment : profile.generatrix.lastSegment);
                noti.profiles.push(profile);
                // если разрыв, тянем третий профиль
                if(cnn_point.is_cut) {
                  this.layer.profiles.some((p) => {
                    if(p !== profile && p !== this) {
                      if(profile[profile_point].is_nearest(p.b)) {
                        p.b = free_point;
                        other.push(p.generatrix.firstSegment);
                        noti.profiles.push(p);
                        return true;
                      }
                      else if(profile[profile_point].is_nearest(p.e)) {
                        p.e = free_point;
                        other.push(p.generatrix.lastSegment);
                        noti.profiles.push(p);
                        return true;
                      }
                    }
                  });
                }
                profile[profile_point] = free_point;
              }
            }
          }
        }

        // накапливаем точки в нотификаторе
        noti_points.new = segm.point;
        if(start_point){
          noti_points.start = start_point;
        }
        noti.points.push(noti_points);

        changed = true;
      }

    });


    // информируем систему об изменениях
    if(changed){
      const {_attr: {_rays}, layer, project} = this;

      // ранняя привязка импостов
      _rays.clear();
      isegments.forEach(({profile, node}) => {
        profile.do_sub_bind(this, node);
        profile.rays.clear();
        other.push(profile.generatrix[node === 'b' ? 'firstSegment' : 'lastSegment']);
        !noti.profiles.includes(profile) && noti.profiles.push(profile);
      });
      _rays.clear();

      layer && layer.notify && layer.notify(noti);
      project.notify(this, 'update', {x1: true, x2: true, y1: true, y2: true});
    }

    return other;
  }

  /**
   * Вспомогательная функция do_bind, привязка импостов
   * @param profile {ProfileItem} - к которому примыкает текущий импост
   * @param node {String} - b,e
   * @return {boolean|Point|undefined}
   */
  do_sub_bind(profile, node) {
    const ppath = (profile.nearest(true) ? profile.rays.outer : profile.generatrix).clone({insert: false});
    let mpoint = ppath.getNearestPoint(this[node]);
    if(!mpoint.is_nearest(this[node], 0)) {
      const gen = this.generatrix.clone({insert: false}).elongation(3000);
      mpoint = ppath.intersect_point(gen, mpoint, true);
      this[node] = mpoint;
      return true;
    }
  }

  get carcass() {
    return this.skeleton.carcass;
  }

  set carcass(v) {
    const {generatrix, path} = this;
    if(v) {
      generatrix.strokeWidth = 5;
      path.clear();
    }
    else {
      generatrix.strokeWidth = 1;
    }
  }
}

EditorInvisible.GeneratrixElement = GeneratrixElement;


/**
 * ### Визкализация таблицы координат
 *
 * @module grid_coordinates
 *
 * Created by Evgeniy Malyarov on 08.09.2018.
 */

class GridCoordinates extends paper.Group {

  constructor(attr) {
    super(attr);
    this.parent = this.project.l_dimensions;

    const points_color = new paper.Color(0, 0.7, 0, 0.8);
    const sel_color = new paper.Color(0.1, 0.4, 0, 0.9);
    const lines_color = new paper.Color(0, 0, 0.7, 0.8);

    // создаём детей
    this._attr = {
      lines_color,
      points_color,
      sel_color,
      step: attr.step,
      offset: attr.offset,
      angle: attr.angle,
      bind: attr.bind,
      line: new paper.Path({
        parent: this,
        strokeColor: new paper.Color(0, 0, 0.7),
        strokeWidth: 2,
        strokeScaling: false,
      }),
      point: new paper.Path.Circle({
        parent: this,
        guide: true,
        radius: 22,
        fillColor: points_color,
      }),
      lines: new paper.Group({
        parent: this,
        guide: true,
        strokeColor: lines_color,
        strokeScaling: false
      }),
    };

  }

  get path() {
    return this._attr.path;
  }
  set path(v) {
    this._attr.path = v;
    this._attr.angle = 0;
    this.set_bind();
    this.set_line();
  }

  set_line() {
    const {bind, offset, path, line, angle} = this._attr;
    let {firstSegment: {point: b}, lastSegment: {point: e}} = path;
    if(bind === 'e') {
      [b, e] = [e, b];
    }
    if(line.segments.length) {
      line.segments[0].point = b;
      line.segments[1].point = e;
    }
    else {
      line.addSegments([b, e]);
    }

    // повернём линию при необходимости
    const langle = e.subtract(b).angle.round(2);
    let dangle = Infinity;
    if(angle) {
      for(const a of [angle, angle - 180, angle + 180]) {
        if(Math.abs(a - langle) < Math.abs(dangle)) {
          dangle = a - langle;
        }
      }
    }
    else {
      for(let a = -180; a <= 180; a += 45) {
        if(Math.abs(a - langle) < Math.abs(dangle)) {
          dangle = a - langle;
        }
      }
    }
    if(dangle) {
      line.rotate(dangle);
      line.elongation(3000);
      line.firstSegment.point = line.getNearestPoint(b);
      line.lastSegment.point = line.getNearestPoint(e);
    }

    const n0 = line.getNormalAt(0).multiply(offset);
    line.firstSegment.point = line.firstSegment.point.subtract(n0);
    line.lastSegment.point = line.lastSegment.point.subtract(n0);
  }

  set_bind() {
    const {point, path, bind} = this._attr;
    switch (bind) {
    case 'b':
      point.position = path.firstSegment.point;
      break;
    case 'e':
      point.position = path.lastSegment.point;
      break;
    case 'product':
      point.position = this.project.bounds.bottomLeft;
      break;
    case 'contour':
      point.position = path.layer.bounds.bottomLeft;
      break;
    }
  }

  get bind() {
    return this._attr.bind;
  }
  set bind(v) {
    this._attr.bind = v;
    this.set_bind();
    this.set_line();
  }

  get step() {
    return this._attr.step;
  }
  set step(v) {
    this._attr.step = v;
    this.set_line();
  }

  get angle() {
    return this._attr.angle;
  }
  set angle(v) {
    if(this._attr.angle !== v) {
      this._attr.angle = v;
      this.set_line();
    }
  }

  get offset() {
    return this._attr.offset;
  }
  set offset(v) {
    this._attr.offset = v;
    this.set_line();
  }

  /**
   * Возвращает точки пути, попутно, добавляя визуализацию
   * @return {Array}
   */
  grid_points(sel_x) {
    const {path, line, lines, lines_color, sel_color, step, bind, point: {position}} = this._attr;
    const res = [];
    const n0 = line.getNormalAt(0).multiply(10000);
    let do_break;
    let prev;

    function add(tpath, x, tpoint, point) {

      let pt;

      if(position.getDistance(point) > 20) {
        pt = new paper.Path.Circle({
          parent: lines,
          guide: true,
          radius: 22,
          center: point,
          fillColor: lines_color,
        });
      }

      const pth = new paper.Path({
        parent: lines,
        guide: true,
        strokeColor: lines_color,
        strokeScaling: false,
        segments: [tpoint, point],
      })

      const d1 = tpath.getOffsetOf(tpoint);
      const d2 = tpath.getOffsetOf(point);
      res.push({x: x.round(1), y: (d2 - d1).round(1)});

      if(Math.abs(x - sel_x) < 10) {
        if(pt) {
          pt.fillColor = sel_color;
        }
        pth.strokeColor = sel_color;
      }
    }

    lines.removeChildren();

    // движемся по пути и вычисляем расстояние
    for (let x = 0; x < line.length + step; x += step) {
      if(x >= line.length) {
        if(do_break) {
          break;
        }
        do_break = true;
        x = line.length;
      }
      if(prev && (x - prev) < (step / 4)) {
        break;
      }
      prev = x;
      const tpoint = x < line.length ? line.getPointAt(x) : line.lastSegment.point;
      const tpath = new paper.Path({
        segments: [tpoint.subtract(n0), tpoint.add(n0)],
        insert: false
      });
      const intersections = path.getIntersections(tpath);
      if(intersections.length) {
        add(tpath, x, tpoint, intersections[0].point);
      }
      else if(x < step / 2) {
        add(tpath, x, tpoint, bind === 'e' ? path.lastSegment.point : path.firstSegment.point);
      }
      else if(x > line.length - step / 2) {
        add(tpath, x, tpoint, bind === 'e' ? path.firstSegment.point : path.lastSegment.point);
      }
    }

    return res;
  }

}

EditorInvisible.GridCoordinates = GridCoordinates;


/**
 * Расширения объектов paper.js
 *
 * &copy; http://www.oknosoft.ru 2014-2018
 * @author	Evgeniy Malyarov
 *
 * @module geometry
 * @submodule paper_ex
 */

/**
 * Расширение класса Path
 */
Object.defineProperties(paper.Path.prototype, {

  /**
     * Вычисляет направленный угол в точке пути
     * @param point
     * @return {number}
     */
  getDirectedAngle: {
    value: function getDirectedAngle(point) {
      if(!point) {
        point = this.interiorPoint;
      }
      const np = this.getNearestPoint(point);
      const offset = this.getOffsetOf(np);
      return this.getTangentAt(offset).getDirectedAngle(point.add(np.negate()));
    }
  },

  /**
   * Возвращает массив самопересечений
   * @param first
   * @return {Array}
   */
  self_intersections: {
    value: function self_intersections(first) {
      const {curves} = this;
      const res = [];
      curves.some((crv1, i1) => {
        return curves.some((crv2, i2) => {
          if(i2 <= i1) {
            return;
          }
          const intersections = crv1.getIntersections(crv2);
          if(intersections.length) {
            const {point} = intersections[0];
            if(intersections.length > 1) {
              res.push({crv1, crv2, point});
              if(first) {
                return true;
              }
            }
            if(crv2.point1.is_nearest(crv1.point2, 0) && point.is_nearest(crv1.point2, 0)) {
              return;
            }
            if(crv1.point1.is_nearest(crv2.point2, 0) && point.is_nearest(crv1.point1, 0)) {
              return;
            }
            res.push({crv1, crv2, point});
            if(first) {
              return true;
            }
          }
        });
      });
      return res;
    }
  },

  /**
   * Является ли путь самопересекающимся
   */
  is_self_intersected: {
    value: function is_self_intersected() {
      return this.self_intersections(true).length > 0;
    }
  },

  /**
     * Угол по отношению к соседнему пути _other_ в точке _point_
     */
  angle_to: {
      value : function angle_to(other, point, interior, round){
        const p1 = this.getNearestPoint(point),
          p2 = other.getNearestPoint(point),
          t1 = this.getTangentAt(this.getOffsetOf(p1)),
          t2 = other.getTangentAt(other.getOffsetOf(p2));
        let res = t2.angle - t1.angle;
        if(res < 0){
          res += 360;
        }
        if(interior && res > 180){
          res = 180 - (res - 180);
        }
        return typeof round === 'number' ? res.round(round) : res.round(1);
      }
    },

  /**
   * Угол между путями в точке _point_
   */
  angle_between: {
    value : function angle_between(other, point, interior, round){
      let res = 180 - this.angle_to(other, point, interior, round);
      if(res < 0){
        res += 360;
      }
      return res;
    }
  },

  /**
     * Выясняет, является ли путь прямым
     * @return {Boolean}
     */
  is_linear: {
    value: function is_linear() {
      const {curves, firstCurve} = this;
      // если в пути единственная кривая и она прямая - путь прямой
      if(curves.length === 1 && (!firstCurve.hasHandles() || firstCurve.isLinear())) {
        return true;
      }
      // если в пути есть искривления, путь кривой
      else if(this.hasHandles()) {
        return false;
      }
      else {
        // если у всех кривых пути одинаковые направленные углы - путь прямой
        const da = firstCurve.point2.subtract(firstCurve.point1).angle;
        for (let i = 1; i < curves.length; i++) {
          const dc = curves[i].point2.subtract(curves[i].point1).angle;
          if(Math.abs(dc - da) > consts.epsilon) {
            return false;
          }
        }
      }
      return true;
    }
  },

  /**
   * Выясняет, расположена ли точка в окрестности пути
   * @param point {paper.Point}
   * @param [sticking] {Boolean|Number}
   * @return {Boolean}
   */
  is_nearest: {
    value: function is_nearest(point, sticking) {
      return point.is_nearest(this.getNearestPoint(point), sticking);
    }
  },

  /**
     * возвращает фрагмент пути между точками
     * @param point1 {paper.Point}
     * @param point2 {paper.Point}
     * @param [strict] {Boolean}
     * @return {paper.Path}
     */
  get_subpath: {
      value: function get_subpath(point1, point2, strict) {
        let tmp;
        const {project} = this;

        if(!this.length || !point1 || !point2 || (!strict && point1.is_nearest(this.firstSegment.point) && point2.is_nearest(this.lastSegment.point))){
          tmp = this.clone({insert: false, deep: false});
        }
        else if(!strict && point2.is_nearest(this.firstSegment.point) && point1.is_nearest(this.lastSegment.point)){
          tmp = this.clone({insert: false, deep: false});
          tmp.reverse();
          tmp._reversed = true;
        }
        else{
          const loc1 = this.getLocationOf(point1) || this.getNearestLocation(point1);
          const loc2 = this.getLocationOf(point2) || this.getNearestLocation(point2);
          const offset1 = loc1.offset;
          const offset2 = loc2.offset;

          if(this.is_linear()){
            // для прямого формируем новый путь из двух точек
            tmp = new paper.Path({
              project,
              segments: [loc1.point, loc2.point],
              insert: false
            });
          }
          else{
            // для кривого строим по точкам, наподобие эквидистанты
            const step = (offset2 - offset1) * 0.02;

            tmp = new paper.Path({
              project,
              segments: [loc1.point],
              insert: false
            });

            if(step < 0){
              tmp._reversed = true;
              for(let i = offset1 + step; i > offset2; i+= step){
                tmp.add(this.getPointAt(i));
              }
            }
            else if(step > 0){
              for(let i = offset1 + step; i < offset2; i+= step){
                tmp.add(this.getPointAt(i));
              }
            }
            tmp.add(loc2.point);
            tmp.simplify(0.8);
          }

          if(offset1 > offset2){
            tmp._reversed = true;
          }
        }

        return tmp;
      }
    },

  /**
     * возвращает путь, равноотстоящий от текущего пути
     * @param delta {number} - расстояние, на которое будет смещен новый путь
     * @param elong {number} - удлинение нового пути с каждого конца
     * @return {paper.Path}
     */
  equidistant: {
      value: function equidistant(delta, elong) {

        const {project, firstSegment, lastSegment} = this;
        let normal = this.getNormalAt(0);
        const res = new paper.Path({
          project,
          segments: [firstSegment.point.add(normal.multiply(delta))],
          insert: false
        });

        if(this.is_linear()) {
          // добавляем последнюю точку
          res.add(lastSegment.point.add(normal.multiply(delta)));
        }
        else{

          if(firstSegment.handleIn.length){
            res.firstSegment.handleIn = firstSegment.handleIn.clone();
          }
          if(firstSegment.handleOut.length){
            res.firstSegment.handleOut = firstSegment.handleOut.clone();
          }

          // для кривого бежим по точкам
          let len = this.length, step = len * 0.02, point;
          if(step < 20) {
            step = len * 0.04;
          }
          else if(step > 90) {
            step = len * 0.014;
          }

          for(let i = step; i < len; i += step) {
            point = this.getPointAt(i);
            if(!point)
              continue;
            normal = this.getNormalAt(i);
            res.add(point.add(normal.multiply(delta)));
          }

          // добавляем последнюю точку
          normal = this.getNormalAt(len);
          res.add(lastSegment.point.add(normal.multiply(delta)));

          if(lastSegment.handleIn.length){
            res.lastSegment.handleIn = lastSegment.handleIn.clone();
          }
          if(lastSegment.handleOut.length){
            res.lastSegment.handleOut = lastSegment.handleOut.clone();
          }

          res.simplify(0.8);
        }

        return res.elongation(elong);
      }
    },

  /**
     * Удлиняет путь касательными в начальной и конечной точках
     */
  elongation: {
      value: function elongation(delta) {

        if(delta){
          if(this.is_linear()) {
            let tangent = this.getTangentAt(0);
            this.firstSegment.point = this.firstSegment.point.add(tangent.multiply(-delta));
            this.lastSegment.point = this.lastSegment.point.add(tangent.multiply(delta));
          }else{
            const {length} = this;
            let tangent = this.getTangentAt(length * 0.01);
            this.insert(0, this.firstSegment.point.add(tangent.multiply(-delta)));
            tangent = this.getTangentAt(length * 0.99);
            this.add(this.lastSegment.point.add(tangent.multiply(delta)));
          }
        }
        return this;
      }
    },

  /**
     * Находит координату пересечения путей в окрестности точки
     * @method intersect_point
     * @for Path
     * @param path {paper.Path}
     * @param point {paper.Point|String} - точка или имя узла (b,e)
     * @param [elongate] {Boolean|Number} - если истина, пути будут продолжены до пересечения
     * @return [other_point] {paper.Point} - если указано, контролируем вектор пересечения
     * @return [clone] {Boolean} - если указано, не удлиняем текущие пути
     */
  intersect_point: {
      value: function intersect_point(path, point, elongate, other_point, clone) {
        const intersections = this.getIntersections(path);
        let delta = Infinity, tdelta, tpoint;

        if(intersections.length === 1){
          if(!point || typeof elongate !== 'number' || point.is_nearest(intersections[0].point, elongate * elongate)) {
            return intersections[0].point;
          }
        }
        if(intersections.length > 1){

          if(typeof point === 'string' && this.parent) {
            point = this.parent[point];
          }

          if(!point){
            point = this.getPointAt(this.length /2);
          }

          // здесь надо учесть не только близость пересечения к точке, но в первую очередь, вектор пересечения
          intersections.forEach((o) => {
            tdelta = o.point.getDistance(point, true);
            if(other_point) {
              const d2 = o.point.getDistance(other_point, true);
              if(d2 < tdelta) {
                return;
              }
            }
            if(tdelta < delta){
              delta = tdelta;
              tpoint = o.point;
            }
          });
          return tpoint;
        }
        else if(elongate == "nearest"){

          // ищем проекцию ближайшей точки на path на наш путь
          return this.getNearestPoint(path.getNearestPoint(point));

        }
        else if(elongate){

          if(!this.length || !path.length) {
            return null;
          }

          const path1 = clone ? this.clone({insert: false, deep: false}) : this;
          const path2 = clone ? path.clone({insert: false, deep: false}) : path;

          let p1 = path1.getNearestPoint(point),
            p2 = path2.getNearestPoint(point),
            p1f = path1.firstSegment.point.getDistance(p1),
            p1l = path1.lastSegment.point.getDistance(p1),
            p2f = path2.firstSegment.point.getDistance(p2),
            p2l = path2.lastSegment.point.getDistance(p2),
            p1last = p1f > p1l,
            p2last = p2f > p2l,
            p4 = 4, tg;

          if(p1.getDistance(p2) < 0.8) {
            if((p1f < p4 || p1l < p4) && (p2f < p4 || p2l < p4)) {
              return p1.add(p2).divide(2);
            }
          }

          // продлеваем пути до пересечения

          if(!path1.closed) {
            tg = (p1last ? path1.getTangentAt(path1.length) : path1.getTangentAt(0).negate()).multiply(typeof elongate === 'number' ? elongate : 100);
            if(path1.is_linear()){
              if(p1last) {
                path1.lastSegment.point = path1.lastSegment.point.add(tg);
              }
              else {
                path1.firstSegment.point = path1.firstSegment.point.add(tg);
              }
            }
            else {
              if(p1last) {
                path1.add(path1.lastSegment.point.add(tg));
              }
              else {
                path1.insert(0, path1.firstSegment.point.add(tg));
              }
            }
          }

          if(!path2.closed) {
            tg = (p2last ? path2.getTangentAt(path2.length) : path2.getTangentAt(0).negate()).multiply(typeof elongate === 'number' ? elongate : 100);
            if(path2.is_linear()){
              if(p2last) {
                path2.lastSegment.point = path2.lastSegment.point.add(tg);
              }
              else {
                path2.firstSegment.point = path2.firstSegment.point.add(tg);
              }
            }
            else {
              if(p2last) {
                path2.add(path2.lastSegment.point.add(tg));
              }
              else {
                path2.insert(0, path2.firstSegment.point.add(tg));
              }
            }
          }

          return path1.intersect_point(path2, point, false, other_point);

        }
      }
    },

  /**
   * Определяет положение точки относительно пути в окрестности interior
   */
  point_pos: {
    value: function point_pos(point, interior) {
      if(!point) {
        return 0;
      }
      const np = this.getNearestPoint(interior);
      const offset = this.getOffsetOf(np);
      const line = new paper.Line(np, np.add(this.getTangentAt(offset)));
      return line.getSide(point, true);
    }
  },

  /**
   * ### Минимальный радиус, высисляемый по кривизне пути
   * для прямых = 0
   */
  rmin: {
    value() {
      if(!this.hasHandles()){
        return 0;
      }
      const {length} = this;
      const step = length / 9;
      let max = 0;
      for(let pos = 0; pos < length; pos += step){
        const curv = Math.abs(this.getCurvatureAt(pos));
        if(curv > max){
          max = curv;
        }
      }
      return max === 0 ? 0 : 1 / max;
    }
  },

  /**
   * ### Максимальный радиус, высисляемый по кривизне пути
   * для прямых = 0
   */
  rmax: {
    value() {
      if(!this.hasHandles()){
        return 0;
      }
      const {length} = this;
      const step = length / 9;
      let min = Infinity;
      for(let pos = 0; pos < length; pos += step){
        const curv = Math.abs(this.getCurvatureAt(pos));
        if(curv < min){
          min = curv;
        }
      }
      return min === 0 ? 0 : 1 / min;
    }
  },

  /**
   * ### Cредний радиус пути по трём точкам
   */
  ravg: {
    value() {
      if(!this.hasHandles()){
        return 0;
      }
      const b = this.firstSegment.point;
      const e = this.lastSegment.point;
      const ph0 = b.add(e).divide(2);
      const ph1 = this.getPointAt(this.length / 2);
      return ph0.arc_r(b.x, b.y, e.x, e.y, ph0.getDistance(ph1));
    }
  }

});

/**
 * Расширение класса Point
 */
Object.defineProperties(paper.Point.prototype, {

	/**
	 * Выясняет, расположена ли точка в окрестности точки
	 * @param point {paper.Point}
	 * @param [sticking] {Boolean|Number}
	 * @return {Boolean}
	 */
	is_nearest: {
		value: function is_nearest(point, sticking) {
		  if(sticking === 0){
        return Math.abs(this.x - point.x) < consts.epsilon && Math.abs(this.y - point.y) < consts.epsilon;
      }
			return this.getDistance(point, true) < (typeof sticking === 'number' ? sticking : (sticking ? consts.sticking2 : 16));
		}
	},

	/**
	 * ПоложениеТочкиОтносительноПрямой
	 * @param x1 {Number}
	 * @param y1 {Number}
	 * @param x2 {Number}
	 * @param y2 {Number}
	 * @return {number}
	 */
	point_pos: {
		value: function point_pos(x1,y1, x2,y2){
			if (Math.abs(x1-x2) < 0.2){
				// вертикаль  >0 - справа, <0 - слева,=0 - на линии
				return (this.x-x1)*(y1-y2);
			}
			if (Math.abs(y1-y2) < 0.2){
				// горизонталь >0 - снизу, <0 - сверху,=0 - на линии
				return (this.y-y1)*(x2-x1);
			}
			// >0 - справа, <0 - слева,=0 - на линии
			return (this.y-y1)*(x2-x1)-(y2-y1)*(this.x-x1);
		}
	},

	/**
	 * ### Рассчитывает координаты центра окружности по точкам и радиусу
	 * @param x1 {Number}
	 * @param y1 {Number}
	 * @param x2 {Number}
	 * @param y2 {Number}
	 * @param r {Number}
	 * @param arc_ccw {Boolean}
	 * @param more_180 {Boolean}
	 * @return {Point}
	 */
	arc_cntr: {
    value(x1, y1, x2, y2, r0, ccw) {
      let a, b, p, r, q, yy1, xx1, yy2, xx2;
      if(ccw) {
        const tmpx = x1, tmpy = y1;
        x1 = x2;
        y1 = y2;
        x2 = tmpx;
        y2 = tmpy;
      }
      if(x1 != x2) {
        a = (x1 * x1 - x2 * x2 - y2 * y2 + y1 * y1) / (2 * (x1 - x2));
        b = ((y2 - y1) / (x1 - x2));
        p = b * b + 1;
        r = -2 * ((x1 - a) * b + y1);
        q = (x1 - a) * (x1 - a) - r0 * r0 + y1 * y1;
        yy1 = (-r + Math.sqrt(r * r - 4 * p * q)) / (2 * p);
        xx1 = a + b * yy1;
        yy2 = (-r - Math.sqrt(r * r - 4 * p * q)) / (2 * p);
        xx2 = a + b * yy2;
      }
      else {
        a = (y1 * y1 - y2 * y2 - x2 * x2 + x1 * x1) / (2 * (y1 - y2));
        b = ((x2 - x1) / (y1 - y2));
        p = b * b + 1;
        r = -2 * ((y1 - a) * b + x1);
        q = (y1 - a) * (y1 - a) - r0 * r0 + x1 * x1;
        xx1 = (-r - Math.sqrt(r * r - 4 * p * q)) / (2 * p);
        yy1 = a + b * xx1;
        xx2 = (-r + Math.sqrt(r * r - 4 * p * q)) / (2 * p);
        yy2 = a + b * xx2;
      }

      if(new paper.Point(xx1, yy1).point_pos(x1, y1, x2, y2) > 0) {
        return {x: xx1, y: yy1};
      }
      else {
        return {x: xx2, y: yy2};
      }
    }
  },

	/**
	 * ### Рассчитывает координаты точки, лежащей на окружности
	 * @param x1
	 * @param y1
	 * @param x2
	 * @param y2
	 * @param r
	 * @param arc_ccw
	 * @param more_180
	 * @return {{x: number, y: number}}
	 */
	arc_point: {
    value(x1, y1, x2, y2, r, arc_ccw, more_180) {
      const point = {x: (x1 + x2) / 2, y: (y1 + y2) / 2};
      if(r > 0) {
        let dx = x1 - x2, dy = y1 - y2, dr = r * r - (dx * dx + dy * dy) / 4, l, h;
        if(dr >= 0) {
          const centr = this.arc_cntr(x1, y1, x2, y2, r, arc_ccw);
          dx = point.x - centr.x;
          dy = point.y - centr.y;	// т.к. Y перевернут
          l = Math.sqrt(dx * dx + dy * dy);

          if(more_180) {
            h = r + Math.sqrt(dr);
          }
          else {
            h = r - Math.sqrt(dr);
          }

          point.x += dx * h / l;
          point.y += dy * h / l;
        }
      }
      return point;
    }
	},

  /**
   * Рассчитывает радиус окружности по двум точкам и высоте
   */
  arc_r: {
    value(x1, y1, x2, y2, h) {
      if(!h) {
        return 0;
      }
      const [dx, dy] = [(x1 - x2), (y1 - y2)];
      return (h / 2 + (dx * dx + dy * dy) / (8 * h)).round(3);
    }
  },

	/**
	 * ### Привязка к углу
	 * Сдвигает точку к ближайшему лучу с углом, кратным snapAngle
	 *
	 * @param [snapAngle] {Number} - шаг угла, по умолчанию 45°
	 * @return {Point}
	 */
	snap_to_angle: {
		value: function snap_to_angle(snapAngle, shift) {

			if(!snapAngle){
        snapAngle = Math.PI*2/8;
      }

			let angle = Math.atan2(this.y, this.x);
			angle = Math.round(angle/snapAngle) * snapAngle;

			const dirx = Math.cos(angle),
				diry = Math.sin(angle),
				d = dirx*this.x + diry*this.y;

			return shift || paper.Key.isDown('shift') ?
        new paper.Point(dirx*d, diry*d) :
        new paper.Point((dirx*d / 10).round() * 10, (diry*d / 10).round() * 10);
		}
	},

  /**
   * Выясняет одинаковость направлений векторов
   */
  some_angle: {
    value: function some_angle(point) {
      const delta = Math.abs(this.angle - point.angle);
      return delta < 1 || (delta > 179 && delta < 181);
    }
  },

  bind_to_nodes: {
	  value: function bind_to_nodes(sticking, {activeLayer}) {
      return activeLayer && activeLayer.nodes.some((point) => {
        if(point.is_nearest(this, sticking)){
          this.x = point.x;
          this.y = point.y;
          return true;
        }
      });
    }
  },

});

class PathUnselectable extends paper.Path {

  setSelection(selection) {
    const {parent, project: {_scope}} = this;
    if(parent) {
      _scope.Item.prototype.setSelection.call(parent, selection);
    }
  }
}

class TextUnselectable extends paper.PointText {

  setSelection(selection) {
    const {parent, project: {_scope}} = this;
    if(parent) {
      _scope.Item.prototype.setSelection.call(parent, selection);
    }
  }
}

EditorInvisible.PathUnselectable = PathUnselectable;
EditorInvisible.TextUnselectable = TextUnselectable;







/**
 * Базовые классы профиля
 *
 * Created by Evgeniy Malyarov on 24.07.2015.
 */

/**
 * Объект, описывающий геометрию соединения
 * @class CnnPoint
 * @constructor
 */
class CnnPoint {

  constructor(parent, node) {

    this._parent = parent;

    /**
     * Имя точки соединения (b или e)
     * @type String
     */
    this.node = node;

    this.initialize();
  }

  /**
   * Проверяет, является ли соединение в точке Т-образным.
   * L для примыкающих рассматривается, как Т
   */
  get is_t() {
    const {cnn, parent, profile, profile_point} = this;
    const {cnn_types, orientations} = $p.enm;

    // если примыкание не в углу, это точно Т
    if(profile && !profile_point) {
      return true;
    }

    // если это угол, то точно не T
    if(!cnn || cnn.cnn_type == cnn_types.ad) {
      return false;
    }

    // если это Ʇ, или † то без вариантов T
    if(cnn.cnn_type == cnn_types.t) {
      return true;
    }

    // если это Ꞁ или └─, то может быть T в разрыв - проверяем
    if(cnn.cnn_type == cnn_types.av && parent.orientation != orientations.vert) {
      return true;
    }
    if(cnn.cnn_type == cnn_types.ah && parent.orientation != orientations.hor) {
      return true;
    }

    return false;
  }

  /**
   * Строгий вариант is_t: Ꞁ и └ не рассматриваются, как T
   */
  get is_tt() {
    // если это угол, то точно не T
    const {profile_point, profile, point} = this;
    if(this.is_i || profile_point === 'b' || profile_point === 'e' || profile === this.parent) {
      return false;
    }
    if(!profile_point && profile && profile.b.is_nearest(point) || profile.e.is_nearest(point)) {
      return false;
    }
    return true;
  }

  /**
   * Проверяет, является ли соединение в точке L-образным
   * Соединения Т всегда L-образные
   */
  get is_l() {
    const {cnn} = this;
    const {cnn_types} = $p.enm;
    return this.is_t || !!(cnn && (cnn.cnn_type === cnn_types.av || cnn.cnn_type === cnn_types.ah));
  }

  /**
   * Вариант is_l - по удаленности от узла
   */
  get is_ll() {
    const {point, profile, parent} = this;
    if(!parent._attr.sticking) {
      parent._attr.sticking = Math.pow(parent.width * 2 / 3, 2);
    }
    return profile && (profile.b.is_nearest(point, parent._attr.sticking) || profile.e.is_nearest(point, parent._attr.sticking));
  }

  /**
   * Проверяет, является ли соединение в точке соединением с пустотой
   */
  get is_i() {
    return !this.profile && !this.is_cut;
  }

  /**
   * Проверяет, является ли соединение в точке соединением крест в стык
   */
  get is_x() {
    const {cnn} = this;
    return cnn && cnn.cnn_type === $p.enm.cnn_types.xx;
  }

  /**
   * Профиль, которому принадлежит точка соединения
   * @type Profile
   */
  get parent() {
    return this._parent;
  }

  clear(mode) {
    const {_attr} = this._parent;
    if(mode === 'with_neighbor') {
      _attr._corns.length = 0;
      delete _attr.d0;
      delete _attr.nom;
      if(this.profile && this.cnn) {
        this.cnn = $p.cat.cnns.elm_cnn(this._parent, this.profile, this.cnn_types, this.cnn, 0, undefined, this);
      }
      return;
    }
    if(this.profile_point) {
      this.profile_point = '';
    }
    if(this.is_cut) {
      this.is_cut = false;
    }
    this.profile = null;
    this.err = null;
    this.distance = Infinity;
    this.cnn_types = $p.enm.cnn_types.acn.i;
    if(this.cnn && this.cnn.cnn_type != $p.enm.cnn_types.i) {
      this.cnn = null;
    }
    if(_attr._corns.length > 5) {
      _attr._corns.length = 5;
    };
  }

  /**
   * Массив ошибок соединения
   * @type Array
   */
  get err() {
    return this._err;
  }

  set err(v) {
    if(!v) {
      this._err.length = 0;
    }
    else if(this._err.indexOf(v) == -1) {
      this._err.push(v);
    }
  }

  /**
   * Проверяет ошибки в узле профиля
   * @param style
   */
  check_err(style) {
    const {node, _parent} = this;
    const {_corns, _rays} = _parent._attr;
    if(!_corns.length) {
      return;
    }
    const len = node == 'b' ? _corns[1].getDistance(_corns[4]) : _corns[2].getDistance(_corns[3]);
    const angle = _parent.angle_at(node);
    const {cnn} = this;

    let aerr;
    if(cnn && cnn.amin && cnn.amax) {
      if(angle > 180) {
        angle = 360 - angle;
      }
      if(cnn.amin < 0 && cnn.amax < 0) {
        if(-cnn.amin <= angle && -cnn.amax >= angle) {
          aerr = true;
        }
      }
      else {
        if(cnn.amin > angle || cnn.amax < angle) {
          aerr = true;
        }
      }
    }

    if(aerr || !cnn || (cnn.lmin && cnn.lmin > len) || (cnn.lmax && cnn.lmax < len)) {
      if(style) {
        Object.assign(new paper.Path.Circle({
          center: node == 'b' ? _corns[4].add(_corns[1]).divide(2) : _corns[2].add(_corns[3]).divide(2),
          radius: style.radius || 70,
        }), style);
      }
      else {
        const {job_prm: {nom}, msg} = $p;
        _parent.err_spec_row(nom.critical_error, cnn ? msg.err_seam_len : msg.err_no_cnn, cnn || _parent.inset);
      }
    }
  }

  /**
   * Профиль, с которым пересекается наш элемент в точке соединения
   * @property profile
   * @type Profile
   */
  get profile() {
    const {_profile, _row} = this;
    if(!_profile && _row && _row.elm2) {
      this._profile = this.parent.layer.getItem({class: ProfileItem, elm: _row.elm2});
    }
    return this._profile;
  }

  set profile(v) {
    this._profile = v;
  }

  get npoint() {
    const point = this.point || this.parent[this.node];
    if(!this.is_tt) {
      return point;
    }
    const {profile} = this;
    if(!profile || !profile.nearest(true)) {
      return point;
    }
    return profile.nearest(true).generatrix.getNearestPoint(point) || point;
  }

  /**
   * Возвращает профиль и узел, если есть соединение с outer-стороны профиля
   *
   * @return {{node: string, profile: ProfileItem}}
   */
  find_other() {

    const {parent, profile, point}  = this;
    const {rays, layer} = parent;
    const {outer} = $p.enm.cnn_sides;

    // ищем концы профилей в окрестности нас
    for(const elm of layer.profiles) {
      if(elm === parent) {
        continue;
      }
      for(const node of 'be') {
        if(elm[node].is_nearest(point, 1) && parent.cnn_side(elm, null, rays) === outer) {
          return {profile: elm, node};
        }
      }
    }
  }

  /**
   * При наличии соединения с другой стороны, исправляет ссылки на основной профиль и profile_point
   * @param other
   */
  correct_profile({profile}, cnn) {
    const {parent, point}  = this;
    const {rays, layer} = parent;
    const {outer} = $p.enm.cnn_sides;

    // ищем концы профилей в окрестности нас
    for(const elm of layer.profiles) {
      if(elm === parent || elm === profile) {
        continue;
      }
      for(const node of 'be') {
        if(elm[node].is_nearest(point, 1) && parent.cnn_side(elm, null, rays) !== outer) {
          this._profile = elm;
          this.profile_point = node;
          this._row = parent.ox.cnn_elmnts.add({
            elm1: parent.elm,
            node1: this.node,
            elm2: elm.elm,
            node2: node,
            cnn,
          });
          return;
        }
      }
    }
  }

  /**
   * Возвращает соединение с обратной стороны конца профиля
   * @param other
   * @return {CatCnns}
   */
  cnno(other) {
    // ищем концы профилей в окрестности e
    if(!other) {
      other = this.find_other();
    }
    if(other) {
      const {parent, node} = this;
      const {cnn_elmnts} = parent.ox;
      let row = cnn_elmnts.find({elm1: parent.elm, elm2: other.profile.elm, node1: node, node2: other.node});
      if(!row) {
        row = cnn_elmnts.find({elm1: other.profile.elm, elm2: parent.elm, node1: other.node});
      }
      else if(row === this._row) {
        this.correct_profile(other, row.cnn);
      }
      if(row) {
        this._cnno = {
          elm2: other.profile.elm,
          node2: other.node,
          cnn: row.cnn,
        };
        return row.cnn;
      }
    }
    else if(this._cnno) {
      delete this._cnno;
    }
  }

  set_cnno(v) {
    const other = this.find_other();
    if(other) {
      const {parent, node} = this;
      const {cnn_elmnts} = parent.ox;
      const attr = {elm1: parent.elm, elm2: other.profile.elm, node1: node, node2: other.node};
      let row = cnn_elmnts.find(attr);
      if(!row) {
        row = cnn_elmnts.add(attr);
      }
      else if(row === this._row) {
        this.correct_profile(other, row.cnn);
      }
      row.cnn = v;

      this._cnno = {
        elm2: other.profile.elm,
        node2: other.node,
        cnn: row.cnn,
      };

      parent.project.register_change();
    }
  }

  /**
   * fake-структура для расчета спецификации
   * @return {{art2: boolean, art1: boolean, angle: number}}
   */
  len_angl() {
    const {is_t, cnn} = this;
    const invert = cnn && cnn.cnn_type === $p.enm.cnn_types.av;
    return {
      angle: 90,
      art1: invert ? !is_t : is_t,
      art2: invert ? is_t : !is_t,
    };
  }

  initialize() {

    const {_parent, node} = this;

    //  массив ошибок соединения
    this._err = [];

    // строка в таблице соединений
    _parent.ox.cnn_elmnts.find_rows({elm1: _parent.elm, node1: node}, (row) => {
      if(this._row) {
        // строк больше одной - проверим, не other ли предыдущая с если что - поменяем
        const elm = _parent.layer.getItem({class: ProfileItem, elm: row.elm2});
        if(elm) {

        }
        else if(row.node2 !== node) {
          this._row = row;
        }
      }
      else {
        this._row = row;
      }
    });

    const {acn} = $p.enm.cnn_types;
    if(this._row) {

      /**
       * Текущее соединение - объект справочника соединения
       * @type CatCnns
       */
      this.cnn = this._row.cnn;
      this.profile_point = this._row.node2;
      if(['b', 'e', 't'].includes(this.profile_point)) {
        this.distance = 0;
      }

      /**
       * Массив допустимых типов соединений
       * По умолчанию - соединение с пустотой
       * @type Array
       */
      if(acn.a.includes(this.cnn.cnn_type)) {
        this.cnn_types = acn.a;
      }
      else if(acn.t.includes(this.cnn.cnn_type)) {
        this.cnn_types = acn.t;
      }
      else {
        this.cnn_types = acn.i;
      }
    }
    else {
      this.cnn = null;
      this.cnn_types = acn.i;
      this.profile_point = '';
    }

    /**
     * Расстояние до ближайшего профиля
     * @type Number
     */
    if(!this.hasOwnProperty('distance')) {
      this.distance = Infinity;
    }
    this.point = null;

  }
}

/**
 * Объект, описывающий лучи пути профиля
 * @class ProfileRays
 * @constructor
 */
class ProfileRays {

  constructor(parent) {
    this.parent = parent;
    this.b = new CnnPoint(this.parent, 'b');
    this.e = new CnnPoint(this.parent, 'e');
    this.inner = new paper.Path({insert: false});
    this.outer = new paper.Path({insert: false});
  }

  clear_segments() {
    if(this.inner.segments.length) {
      this.inner.removeSegments();
    }
    if(this.outer.segments.length) {
      this.outer.removeSegments();
    }
  }

  clear(with_cnn) {
    this.clear_segments();
    if(with_cnn) {
      this.b.clear(with_cnn);
      this.e.clear(with_cnn);
    }
    if(with_cnn === 'with_neighbor') {
      const {enm: {cnn_types}, cat: {cnns}} = $p;
      const {parent} = this;

      // прибиваем соединения в точках b и e
      const nodes = ['b', 'e'];
      for(const node of nodes) {
        const {profile, profile_point} = parent.cnn_point(node);
        const other = node === 'b' ? 'e' : 'b';
        if(profile && profile_point == other) {
          const {_rays, _corns} = profile._attr;
          if(_rays) {
            _rays.clear();
            _corns.length = 0;
            const cnn_point = _rays[other];
            cnn_point.cnn = cnns.elm_cnn(profile, parent, cnn_point.cnn_types, cnn_point.cnn, 0, undefined, cnn_point);
          }
        }
      }

      // прибиваем соединения примыкающих к текущему импостов
      const {inner, outer} = parent.joined_imposts();
      const elm2 = parent.elm;
      const {cnn_elmnts} = parent.ox;
      const {cnn_nodes} = ProductsBuilding;
      for (const {profile} of inner.concat(outer)) {
        for(const node of nodes) {
          const cnn_point = profile.rays[node];
          if(cnn_point.profile == parent && cnn_point.cnn) {
            const cnn = cnns.elm_cnn(profile, parent, cnn_point.cnn_types, cnn_point.cnn, 0, undefined, cnn_point);
            if(cnn !== cnn_point.cnn) {
              cnn_elmnts.clear({elm1: profile, node1: cnn_nodes, elm2: parent});
              cnn_point.cnn = cnn;
            }
          }
        }
      }

      // для соединительных профилей и элементов со створками, пересчитываем соседей
      for (const {_attr, elm} of parent.joined_nearests()) {
        _attr._rays && _attr._rays.clear(with_cnn);
        _attr._nearest_cnn = null;
      }

      // так же, пересчитываем соединения с примыкающими заполнениями
      parent.layer.glasses(false, true).forEach((glass) => {
        cnn_elmnts.clear({elm1: glass.elm, node1: cnn_nodes, elm2});
      });
    }
  }

  recalc() {

    const {parent} = this;
    const gen = parent.generatrix;
    const len = gen.length;

    this.clear();

    if(!len) {
      return;
    }

    const {d1, d2, width} = parent;
    const ds = 3 * (width > 20 ? width : 20);
    const step = len * 0.02;

    // первая точка эквидистанты. аппроксимируется касательной на участке (from < начала пути)
    let point_b = gen.firstSegment.point,
      tangent_b = gen.getTangentAt(0),
      normal_b = gen.getNormalAt(0),
      point_e = gen.lastSegment.point,
      tangent_e, normal_e;

    // добавляем первые точки путей
    this.outer.add(point_b.add(normal_b.multiply(d1)).add(tangent_b.multiply(-ds)));
    this.inner.add(point_b.add(normal_b.multiply(d2)).add(tangent_b.multiply(-ds)));

    // для прямого пути, строим в один проход
    if(gen.is_linear()) {
      this.outer.add(point_e.add(normal_b.multiply(d1)).add(tangent_b.multiply(ds)));
      this.inner.add(point_e.add(normal_b.multiply(d2)).add(tangent_b.multiply(ds)));
    }
    else {

      this.outer.add(point_b.add(normal_b.multiply(d1)));
      this.inner.add(point_b.add(normal_b.multiply(d2)));

      for (let i = step; i < len; i += step) {
        point_b = gen.getPointAt(i);
        normal_b = gen.getNormalAt(i);
        this.outer.add(point_b.add(normal_b.normalize(d1)));
        this.inner.add(point_b.add(normal_b.normalize(d2)));
      }

      normal_e = gen.getNormalAt(len);
      this.outer.add(point_e.add(normal_e.multiply(d1)));
      this.inner.add(point_e.add(normal_e.multiply(d2)));

      tangent_e = gen.getTangentAt(len);
      this.outer.add(point_e.add(normal_e.multiply(d1)).add(tangent_e.multiply(ds)));
      this.inner.add(point_e.add(normal_e.multiply(d2)).add(tangent_e.multiply(ds)));

    }

    this.inner.reverse();
  }

}


/**
 * ### Элемент профиля
 * Виртуальный класс описывает общие свойства профиля и раскладки
 *
 * @class ProfileItem
 * @extends BuilderElement
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @constructor
 * @menuorder 41
 * @tooltip Элемент профиля
 */
class ProfileItem extends GeneratrixElement {

  /**
   * Расстояние от узла до внешнего ребра элемента
   * для рамы, обычно = 0, для импоста 1/2 ширины, зависит от `d0` и `sizeb`
   * @property d1
   * @type Number
   */
  get d1() {
    return -(this.d0 - this.sizeb);
  }

  /**
   * Расстояние от узла до внутреннего ребра элемента
   * зависит от ширины элементов и свойств примыкающих соединений
   * @property d2
   * @type Number
   */
  get d2() {
    return this.d1 - this.width;
  }

  get offset() {
    const {_row} = this;
    return (_row && _row.offset) || 0;
  }

  set offset(v) {
    const {_row, _attr, selected} = this;
    v = parseFloat(v) || 0;
    if(_row && _row.offset !== v) {
      _row.offset = v;
      if(selected) {
        this.selected = false;
      }
      const nearests = this.joined_nearests ? this.joined_nearests() : [];
      if(this.joined_imposts) {
        const imposts = this.joined_imposts();
        nearests.push.apply(nearests, imposts.inner.map((v) => v.profile).concat(imposts.outer.map((v) => v.profile)));
      }
      for(const profile of nearests) {
        profile._attr._rays && profile._attr._rays.clear();
      }
      _attr._rays && _attr._rays.clear();
      this.project.register_change(true);
      if(selected) {
        this.selected = true;
      }
    }
  }

  /**
   * ### Точка проекции высоты ручки на ребро профиля
   *
   * @param side
   * @return Point|undefined
   */
  hhpoint(side) {
    const {layer, rays} = this;
    const {h_ruch, furn} = layer;
    const {furn_set, handle_side} = furn;
    if(!h_ruch || !handle_side || furn_set.empty()) {
      return;
    }
    // получаем элемент, на котором ручка и длину элемента
    if(layer.profile_by_furn_side(handle_side) == this) {
      return rays[side].intersect_point(layer.handle_line(this));
    }
  }

  /**
   * ### Точка проекции высоты ручки на внутреннее ребро профиля
   *
   * @property hhi
   * @type Point|undefined
   */
  get hhi() {
    return this.hhpoint('inner');
  }

  /**
   * ### Точка проекции высоты ручки на внешнее ребро профиля
   *
   * @property hho
   * @type Point|undefined
   */
  get hho() {
    return this.hhpoint('outer');
  }

  /**
   * ### Соединение в точке 'b' для диалога свойств
   *
   * @property cnn1
   * @type CatCnns
   * @private
   */
  get cnn1() {
    return this.getcnnn('b');
  }

  set cnn1(v) {
    this.setcnnn(v, 'b');
  }

  /**
   * ### Соединение в точке 'b' c обратной стороны
   *
   * @property cnn1o
   * @type CatCnns
   * @private
   */
  get cnn1o() {
    return this.rays.b.cnno();
  }

  set cnn1o(v) {
    this.rays.b.set_cnno(v);
  }

  /**
   * Соединение в точке 'e' для диалога свойств
   *
   * @property cnn2
   * @type CatCnns
   * @private
   */
  get cnn2() {
    return this.getcnnn('e');
  }

  set cnn2(v) {
    this.setcnnn(v, 'e');
  }

  /**
   * Соединение в точке 'e' c обратной стороны
   *
   * @property cnn2o
   * @type CatCnns
   * @private
   */
  get cnn2o() {
    return this.rays.e.cnno();
  }

  set cnn2o(v) {
    this.rays.e.set_cnno(v);
  }

  getcnnn(n) {
    return this.cnn_point(n).cnn || $p.cat.cnns.get();
  }

  setcnnn(v, n) {
    const {rays} = this;
    const cnn = $p.cat.cnns.get(v);
    if(rays[n].cnn != cnn) {
      rays[n].cnn = cnn;
      this.project.register_change();
    }
  }

  /**
   * Проекция точки b на образующую родительского элемента
   * Для рам и створок, совпадает с 'b', для импостов - отличается
   */
  get gb() {
    return this.gn('b');
  }

  /**
   * Проекция точки e на образующую родительского элемента
   * Для рам и створок, совпадает с 'e', для импостов - отличается
   */
  get ge() {
    return this.gn('e');
  }

  gn(n) {
    if(this.layer.layer) {
      const {profile, is_t} = this.cnn_point(n);
      if(is_t && profile) {
        return profile.generatrix.getNearestPoint(this[n]);
      }
    }
    return this[n];
  }

  /**
   * Угол к соседнему элементу
   * @param node {string}
   * @return {number}
   */
  angle_at(node) {
    const {profile, point} = this.rays[node] || this.cnn_point(node);
    if(!profile || !point) {
      return 90;
    }
    const g1 = this.generatrix;
    const g2 = profile.generatrix;
    let offset1 = g1.getOffsetOf(g1.getNearestPoint(point)),
      offset2 = g2.getOffsetOf(g2.getNearestPoint(point));
    if(offset1 < 10){
      offset1 = 10;
    }
    else if(Math.abs(offset1 - g1.length) < 10){
      offset1 = g1.length - 10;
    }
    if(offset2 < 10){
      offset2 = 10;
    }
    else if(Math.abs(offset2 - g2.length) < 10){
      offset2 = g2.length - 10;
    }
    const t1 = g1.getTangentAt(offset1) || new paper.Point();
    const t2 = g2.getTangentAt(offset2) || new paper.Point();
    const a = t2.negate().getDirectedAngle(t1).round(1);
    return a > 180 ? a - 180 : (a < 0 ? -a : a);
  }

  /**
   * Угол к соседнему элементу в точке 'b'
   */
  get a1() {
    return this.angle_at('b');
  }

  /**
   * Угол к соседнему элементу в точке 'e'
   */
  get a2() {
    return this.angle_at('e');
  }

  /**
   * информация для диалога свойств
   *
   * @property info
   * @type String
   * @final
   * @private
   */
  get info() {
    const {elm, angle_hor, length, layer} = this;
    return `№${layer instanceof ContourNestedContent ? `${layer.layer.cnstr}-${elm}` : elm}  α:${angle_hor.toFixed(0)}° l: ${length.toFixed(0)}`;
  }

  /**
   * ### Радиус сегмента профиля
   *
   * @property r
   * @type Number
   */
  get r() {
    return this._row.r;
  }

  set r(v) {
    const {_row, _attr} = this;
    if(_row.r != v) {
      _attr._rays.clear();
      _row.r = v;
      this.set_generatrix_radius();
      this.project.notify(this, 'update', {r: true, arc_h: true, arc_ccw: true});
    }
  }

  /**
   * ### Минимальный радиус, высисляемый по кривизне элемента
   * для прямых = 0
   */
  get rmin() {
    return this.generatrix.rmin();
  }

  /**
   * ### Максимальный радиус, высисляемый по кривизне элемента
   * для прямых = 0
   */
  get rmax() {
    return this.generatrix.rmax();
  }

  /**
   * ### Средний радиус, высисляемый по трём точкам
   * для прямых = 0
   */
  get ravg() {
    return this.generatrix.ravg();
  }

  /**
   * ### Направление дуги сегмента профиля против часовой стрелки
   *
   * @property arc_ccw
   * @type Boolean
   */
  get arc_ccw() {
    return this._row.arc_ccw;
  }

  set arc_ccw(v) {
    const {_row, _attr} = this;
    if(_row.arc_ccw != v) {
      _attr._rays.clear();
      _row.arc_ccw = v;
      this.set_generatrix_radius();
      this.project.notify(this, 'update', {r: true, arc_h: true, arc_ccw: true});
    }
  }

  /**
   * ### Высота дуги сегмента профиля
   *
   * @property arc_ccw
   * @type Boolean
   */
  get arc_h() {
    const {_row, b, e, generatrix} = this;
    if(_row.r) {
      const p = generatrix.getPointAt(generatrix.length / 2);
      return paper.Line.getSignedDistance(b.x, b.y, e.x, e.y, p.x, p.y).round(1);
    }
    return 0;
  }

  set arc_h(v) {
    const {_row, _attr, b, e, arc_h} = this;
    v = parseFloat(v);
    if(arc_h != v) {
      _attr._rays.clear();
      if(v < 0) {
        v = -v;
        _row.arc_ccw = true;
      }
      else {
        _row.arc_ccw = false;
      }
      _row.r = b.arc_r(b.x, b.y, e.x, e.y, v);
      this.set_generatrix_radius(v);
      this.project.notify(this, 'update', {r: true, arc_h: true, arc_ccw: true});
    }
  }

  /**
   * ### Угол к горизонту
   * Рассчитывается для прямой, проходящей через узлы
   *
   * @property angle_hor
   * @type Number
   * @final
   */
  get angle_hor() {
    const {b, e} = this;
    const res = (new paper.Point(e.x - b.x, b.y - e.y)).angle.round(2);
    return res < 0 ? res + 360 : res;
  }

  /**
   * ### Длина профиля с учетом соединений
   *
   * @property length
   * @type Number
   * @final
   */
  get length() {
    const {b, e, outer} = this.rays;
    const {cnn_types, elm_types, angle_calculating_ways: {СоединениеПополам: a2}} = $p.enm;
    const ppoints = {};
    let gen = this.elm_type == elm_types.Импост ? this.generatrix : outer;

    // находим проекции четырёх вершин на образующую
    for (let i = 1; i <= 4; i++) {
      ppoints[i] = gen.getNearestPoint(this.corns(i));
    }

    // находим точки, расположенные ближе к концам
    let pt = this.corns(7);
    if(pt) {
      gen = gen.clone({insert: false}).elongation(this.width * 2);
      ppoints.b = gen.getNearestPoint(pt);
    }
    else {
      ppoints.b = gen.getOffsetOf(ppoints[1]) < gen.getOffsetOf(ppoints[4]) ? ppoints[1] : ppoints[4];
    }

    pt = this.corns(8);
    if(pt) {
      if(gen.isInserted()) {
        gen = gen.clone({insert: false}).elongation(this.width * 2);
      }
      ppoints.e = gen.getNearestPoint(pt);
    }
    else {
      ppoints.e = gen.getOffsetOf(ppoints[2]) > gen.getOffsetOf(ppoints[3]) ? ppoints[2] : ppoints[3];
    }

    // получаем фрагмент образующей
    const sub_gen = gen.get_subpath(ppoints.b, ppoints.e);
    const res = sub_gen.length + (b.cnn ? b.cnn.size(this) : 0) + (e.cnn ? e.cnn.size(this) : 0);
    sub_gen.remove();

    return res;
  }

  /**
   * ### Ориентация профиля
   * Вычисляется по гулу к горизонту.
   * Если угол в пределах `orientation_delta`, элемент признаётся горизонтальным или вертикальным. Иначе - наклонным
   *
   * @property orientation
   * @type EnmOrientations
   * @final
   */
  get orientation() {
    let {angle_hor} = this;
    if(angle_hor > 180) {
      angle_hor -= 180;
    }
    const {orientations} = $p.enm;
    if((angle_hor > -consts.orientation_delta && angle_hor < consts.orientation_delta) ||
      (angle_hor > 180 - consts.orientation_delta && angle_hor < 180 + consts.orientation_delta)) {
      return orientations.hor;
    }
    if((angle_hor > 90 - consts.orientation_delta && angle_hor < 90 + consts.orientation_delta) ||
      (angle_hor > 270 - consts.orientation_delta && angle_hor < 270 + consts.orientation_delta)) {
      return orientations.vert;
    }
    return orientations.incline;
  }

  /**
   * ### Опорные точки и лучи
   *
   * @property rays
   * @type ProfileRays
   * @final
   */
  get rays() {
    const {_rays} = this._attr;
    if(!_rays.inner.segments.length || !_rays.outer.segments.length) {
      _rays.recalc();
    }
    return _rays;
  }

  /**
   * ### Доборы текущего профиля
   *
   * @property addls
   * @type Array.<ProfileAddl>
   * @final
   */
  get addls() {
    return this.children.filter((elm) => elm instanceof ProfileAddl);
  }

  /**
   * ### Сегменты текущей связки
   *
   * @property segms
   * @type Array.<ProfileSegment>
   * @final
   */
  get segms() {
    return this.children.filter((elm) => elm instanceof ProfileSegment);
  }

  /**
   * ### Примыкания текущего профиля
   *
   * @property adjoinings
   * @type Array.<ProfileAddl>
   * @final
   */
  get adjoinings() {
    return this.children.filter((elm) => elm instanceof ProfileAdjoining);
  }

  /**
   * Описание полей диалога свойств элемента
   */
  get oxml() {
    const oxml = {
      ' ': [
        {id: 'info', path: 'o.info', type: 'ro'},
        'inset',
        'clr',
        this instanceof Onlay ? 'region' : 'offset',
      ],
      'Начало': ['x1','y1','a1','cnn1'],
      'Конец': ['x2','y2','a2','cnn2']
    };
    if(this.selected_cnn_ii()) {
      oxml.Примыкание = ['cnn3'];
    }
    const props = this.elm_props();
    if(props.length) {
      oxml.Свойства = props.map(({ref}) => ref);
    }
    return oxml;
  }

  /**
   * Строка цвета по умолчанию для эскиза
   */
  get default_clr_str() {
    return 'FEFEFE';
  }

  /**
   * ### Непрозрачность профиля
   * В отличии от прототипа `opacity`, не изменяет прозрачость образующей
   */
  get opacity() {
    return this.path ? this.path.opacity : 1;
  }
  set opacity(v) {
    this.path && (this.path.opacity = v);
  }

  /**
   * Припуск для соединения "сварной шов"
   */
  get dx0() {
    const {cnn} = this.rays.b;
    const main_row = cnn && cnn.main_row(this);
    return main_row && main_row.angle_calc_method == $p.enm.angle_calculating_ways.СварнойШов ? -main_row.sz : 0;
  }

  /**
   * Структура примыкающих заполнений
   * @return {Object}
   */
  get nearest_glasses() {
    const res = {
      all: [],    // все
      inner: [],  // изнутри по отношению к образующей
      outer: [],  // снаружи по отношению к образующей
      left: [],   // слева от элемента
      right: [],  // справа от элемента
      top: [],    // сверху
      bottom: [], // снизу
    };
    const {layer, generatrix, orientation} = this;
    for(const glass of layer.glasses(false, true)) {
      for(const curr of glass.profiles) {
        if(curr.profile === this) {
          res.all.push(glass);
          if(curr.outer) {
            res.outer.push(glass);
          }
          else {
            res.inner.push(glass);
          }
          const glpoint = glass.interiorPoint();
          const vector = generatrix.getNearestPoint(glpoint).subtract(glpoint);
          if(orientation === orientation._manager.hor) {
            if(vector.y > 0) {
              res.top.push(glass);
            }
            else {
              res.bottom.push(glass);
            }
          }
          else if (orientation === orientation._manager.vert) {
            if(vector.x < 0) {
              res.right.push(glass);
            }
            else {
              res.left.push(glass);
            }
          }
          break;
        }
      }
    }
    return res;
  }

  setSelection(selection) {
    super.setSelection(selection);

    const {generatrix, path} = this._attr;

    generatrix.setSelection(selection);
    this.ruler_line_select(false);

    if(selection) {

      const {inner, outer} = this.rays;

      if(this._hatching) {
        this._hatching.removeChildren();
      }
      else {
        this._hatching = new paper.CompoundPath({
          parent: this,
          guide: true,
          strokeColor: 'grey',
          strokeScaling: false
        });
      }

      path.setSelection(0);
      for(const item of this.segms) {
        item.setSelection(0);
      }
      for(const item of this.addls) {
        item.setSelection(0);
      }

      for (let t = 0; t < inner.length; t += 50) {
        const ip = inner.getPointAt(t);
        const np = inner.getNormalAt(t).multiply(400).rotate(-35).negate();
        const fp = new paper.Path({
          insert: false,
          segments: [ip, ip.add(np)]
        });
        const op = fp.intersect_point(outer, ip);

        if(ip && op) {
          const cip = path.getNearestPoint(ip);
          const cop = path.getNearestPoint(op);
          const nip = cip.is_nearest(ip);
          const nop = cop.is_nearest(op);
          if(nip && nop) {
            this._hatching.moveTo(cip);
            this._hatching.lineTo(cop);
          }
          else if(nip && !nop) {
            const pp = fp.intersect_point(path, op);
            if(pp) {
              this._hatching.moveTo(cip);
              this._hatching.lineTo(pp);
            }
          }
          else if(!nip && nop) {
            const pp = fp.intersect_point(path, ip);
            if(pp) {
              this._hatching.moveTo(pp);
              this._hatching.lineTo(cop);
            }
          }
        }
      }

    }
    else {
      if(this._hatching) {
        this._hatching.remove();
        this._hatching = null;
      }
    }
  }

  // выделяет внутреннее или внешнее ребро профиля
  ruler_line_select(mode) {

    const {_attr} = this;

    if(_attr.ruler_line_path) {
      _attr.ruler_line_path.remove();
      delete _attr.ruler_line_path;
    }

    if(mode) {
      switch (_attr.ruler_line = mode) {

      case 'inner':
        _attr.ruler_line_path = this.path.get_subpath(this.corns(3), this.corns(4));
        _attr.ruler_line_path.parent = this;
        _attr.ruler_line_path.selected = true;
        break;

      case 'outer':
        _attr.ruler_line_path = this.path.get_subpath(this.corns(1), this.corns(2));
        _attr.ruler_line_path.parent = this;
        _attr.ruler_line_path.selected = true;
        break;

      default:
        this.generatrix.selected = true;
        break;
      }
    }
    else if(_attr.ruler_line) {
      delete _attr.ruler_line;
    }
  }

  // координата стороны или образующей профиля
  ruler_line_coordin(xy) {
    switch (this._attr.ruler_line) {
    case 'inner':
      return (this.corns(3)[xy] + this.corns(4)[xy]) / 2;
    case 'outer':
      return (this.corns(1)[xy] + this.corns(2)[xy]) / 2;
    default:
      return (this.b[xy] + this.e[xy]) / 2;
    }
  }

  /**
   * ### Вычисляемые поля в таблице координат
   * @method save_coordinates
   */
  save_coordinates() {

    const {_attr, _row, ox: {cnn_elmnts}, rays: {b, e}, generatrix} = this;

    if(!generatrix) {
      return;
    }
    else if(!_attr._corns.length) {
      this.redraw();
    }

    _row.x1 = this.x1;
    _row.y1 = this.y1;
    _row.x2 = this.x2;
    _row.y2 = this.y2;
    _row.path_data = generatrix.pathData;
    _row.nom = this.nom;

    // радиус, как дань традиции - вычисляем для внешнего ребра профиля
    if(generatrix.is_linear()) {
      _row.r = 0;
    }
    else {
      const {path} = this;
      const r1 = path.get_subpath(_attr._corns[1], _attr._corns[2]).ravg();
      const r2 = path.get_subpath(_attr._corns[3], _attr._corns[4]).ravg();
      _row.r = Math.max(r1, r2);
    }

    // добавляем припуски соединений
    _row.len = this.length.round(1);

    // получаем углы между элементами и к горизонту
    _row.angle_hor = this.angle_hor;

    if(this instanceof ProfileNested || this instanceof ProfileParent) {
      _row.alp1 = _row.alp2 = 0;
      _row.inset = this.inset;
      _row.clr = this.clr;
    }
    else {

      const row_b = cnn_elmnts.add({
        elm1: _row.elm,
        node1: 'b',
        cnn: b.cnn,
        aperture_len: this.corns(1).getDistance(this.corns(4)).round(1)
      });
      const row_e = cnn_elmnts.add({
        elm1: _row.elm,
        node1: 'e',
        cnn: e.cnn,
        aperture_len: this.corns(2).getDistance(this.corns(3)).round(1)
      });

      // сохраняем информацию о соединениях
      if(b.profile) {
        row_b.elm2 = b.profile.elm;
        if(b.profile.e.is_nearest(b.point)) {
          row_b.node2 = 'e';
        }
        else if(b.profile.b.is_nearest(b.point)) {
          row_b.node2 = 'b';
        }
        else {
          row_b.node2 = 't';
        }
      }
      if(e.profile) {
        row_e.elm2 = e.profile.elm;
        if(e.profile.b.is_nearest(e.point)) {
          row_e.node2 = 'b';
        }
        else if(e.profile.e.is_nearest(e.point)) {
          row_e.node2 = 'e';
        }
        else {
          row_e.node2 = 't';
        }
      }


      if(!(this instanceof ProfileSegment)) {

        // в том числе - о соединениях с другой стороны
        if(b._cnno && row_b.elm2 !== b._cnno.elm2) {
          cnn_elmnts.add({
            elm1: _row.elm,
            node1: 'b',
            elm2: b._cnno.elm2,
            node2: b._cnno.node2,
            cnn: b._cnno.cnn,
            aperture_len: row_b.aperture_len,
          });
        }
        if(e._cnno && row_e.elm2 !== e._cnno.elm2) {
          cnn_elmnts.add({
            elm1: _row.elm,
            node1: 'e',
            elm2: e._cnno.elm2,
            node2: e._cnno.node2,
            cnn: e._cnno.cnn,
            aperture_len: row_e.aperture_len,
          });
        }

        // для створочных и доборных профилей добавляем соединения с внешними элементами
        const nrst = this.nearest();
        if(nrst) {
          cnn_elmnts.add({
            elm1: _row.elm,
            elm2: nrst.elm,
            cnn: _attr._nearest_cnn,
            aperture_len: _row.len
          });
        }
      }

      _row.alp1 = Math.round((this.corns(4).subtract(this.corns(1)).angle - generatrix.getTangentAt(0).angle) * 10) / 10;
      if(_row.alp1 < 0) {
        _row.alp1 = _row.alp1 + 360;
      }

      _row.alp2 = Math.round((generatrix.getTangentAt(generatrix.length).angle - this.corns(2).subtract(this.corns(3)).angle) * 10) / 10;
      if(_row.alp2 < 0) {
        _row.alp2 = _row.alp2 + 360;
      }
    }

    // устанавливаем тип элемента
    _row.elm_type = this.elm_type;

    // TODO: Рассчитать положение и ориентацию
    _row.orientation = this.orientation;
    _row.pos = this.pos;

    // координаты доборов и прочих детей
    this.children.forEach((addl) => addl.save_coordinates && addl.save_coordinates());
  }

  /**
   * Вызывается из конструктора - создаёт пути и лучи
   * @method initialize
   * @private
   */
  initialize(attr) {

    const {project, _attr, _row} = this;
    const h = project.bounds.height + project.bounds.y;
    const {job_prm, utils} = $p;

    if(attr.r) {
      _row.r = attr.r;
    }

    if(attr.generatrix) {
      _attr.generatrix = attr.generatrix;
      if(_attr.generatrix._reversed) {
        delete _attr.generatrix._reversed;
      }
    }
    else {
      if(_row.path_data) {
        _attr.generatrix = new paper.Path(_row.path_data);
      }
      else {
        const first_point = new paper.Point([_row.x1, h - _row.y1]);
        _attr.generatrix = new paper.Path(first_point);
        if(_row.r) {
          _attr.generatrix.arcTo(
            first_point.arc_point(_row.x1, h - _row.y1, _row.x2, h - _row.y2, _row.r + 0.001, _row.arc_ccw, false), [_row.x2, h - _row.y2]);
        }
        else {
          _attr.generatrix.lineTo([_row.x2, h - _row.y2]);
        }
      }
    }

    // точки пересечения профиля с соседями с внутренней стороны
    _attr._corns = [];

    // кеш лучей в узлах профиля
    _attr._rays = new ProfileRays(this);

    _attr.generatrix.strokeColor = 'gray';

    _attr.path = new paper.Path();
    Object.assign(_attr.path, ProfileItem.path_attr);
    this.clr = _row.clr.empty() ? job_prm.builder.base_clr : _row.clr;

    this.addChild(_attr.path);
    this.addChild(_attr.generatrix);

  }

  /**
   * Возвращает скелетон родителя
   * @return {Skeleton}
   */
  get skeleton() {
    return this.parent.skeleton;
  }

  /**
   * ### Обсервер
   * Наблюдает за изменениями контура и пересчитывает путь элемента при изменении соседних элементов
   *
   * @method observer
   * @private
   */
  observer(an) {
    const {profiles} = an;
    if(profiles) {
      let binded;
      if(!profiles.includes(this)) {
        // если среди профилей есть такой, к которму примыкает текущий, пробуем привязку
        for(const profile of profiles) {
          if(profile instanceof Onlay && !(this instanceof Onlay)) {
            continue;
          }
          binded = true;
          this.do_bind(profile, this.cnn_point('b'), this.cnn_point('e'), an);
        }
        binded && profiles.push(this);
      }
    }
    else if(an instanceof Profile || an instanceof ProfileConnective) {
      this.do_bind(an, this.cnn_point('b'), this.cnn_point('e'));
    }
  }

  /**
   * Вспомогательная функция обсервера, выполняет привязку узлов
   */
  do_bind(profile, bcnn, ecnn, moved) {

    const {acn, ad} = $p.enm.cnn_types;
    let moved_fact;

    if(profile instanceof ProfileConnective) {
      const gen = profile.generatrix.clone({insert: false}).elongation(3000);
      this._attr._rays.clear();
      const b = gen.getNearestPoint(this.b);
      const e = gen.getNearestPoint(this.e);
      const db = b.subtract(this.b);
      const de = e.subtract(this.e);
      if(db.length || de.length) {
        const selected = this.project.deselect_all_points(true);
        if(db.subtract(de).length < consts.epsilon) {
          this.move_points(de, true);
        }
        else {
          this.select_node('b');
          this.move_points(db);
          this.project.deselectAll();
          this.select_node('e');
          this.move_points(de);
        }
        this.project.deselectAll();
        for(const el of selected) {
          el.selected = true;
        }
      }
    }
    else {
      if(bcnn.cnn && bcnn.profile == profile) {
        // обрабатываем угол
        if(bcnn.profile_point && bcnn.profile_point !== 't' && !bcnn.is_x) {
          const pp = profile[bcnn.profile_point];
          if(!this.b.is_nearest(pp, 0)) {
            if(bcnn.is_t || bcnn.cnn.cnn_type == ad) {
              if(paper.Key.isDown('control')) {
                console.log('control');
              }
              else {
                if(this.b.getDistance(pp, true) < consts.sticking2) {
                  this.b = pp;
                }
                moved_fact = true;
              }
            }
            // отрываем привязанный ранее профиль
            else {
              bcnn.clear();
              this._attr._rays.clear();
            }
          }
        }
        // обрабатываем T
        else if(acn.t.indexOf(bcnn.cnn.cnn_type) != -1 && this.do_sub_bind(profile, 'b')) {
          moved_fact = true;
        }
      }

      if(ecnn.cnn && ecnn.profile == profile) {
        // обрабатываем угол
        if(ecnn.profile_point && ecnn.profile_point !== 't' && !ecnn.is_x) {
          const pp = profile[ecnn.profile_point];
          if(!this.e.is_nearest(pp, 0)) {
            if(ecnn.is_t || ecnn.cnn.cnn_type == ad) {
              if(paper.Key.isDown('control')) {
                console.log('control');
              }
              else {
                if(this.e.getDistance(pp, true) < consts.sticking2) {
                  this.e = pp;
                }
                moved_fact = true;
              }
            }
            else {
              // отрываем привязанный ранее профиль
              ecnn.clear();
              this._attr._rays.clear();
            }
          }
        }
        // обрабатываем T
        else if(acn.t.indexOf(ecnn.cnn.cnn_type) != -1 && this.do_sub_bind(profile, 'e')) {
          moved_fact = true;
        }
      }
    }

    // если мы в обсервере и есть T и в массиве обработанных есть примыкающий T - пересчитываем
    if(moved && moved_fact) {
      const imposts = this.joined_imposts();
      imposts.inner.concat(imposts.outer).forEach((impost) => {
        if(moved.profiles.indexOf(impost) == -1) {
          impost.profile.observer(this);
        }
      });
    }
  }

  /**
   * Возвращает сторону соединения текущего профиля с указанным
   */
  cnn_side(profile, interior, rays) {
    if(!interior) {
      interior = profile.interiorPoint();
    }
    if(!rays) {
      rays = this.rays;
    }
    const {Изнутри, Снаружи} = $p.enm.cnn_sides;
    if(!rays || !interior || !rays.inner.length || ! rays.outer.length) {
      return Изнутри;
    }
    return rays.inner.getNearestPoint(interior).getDistance(interior, true) <
      rays.outer.getNearestPoint(interior).getDistance(interior, true) ? Изнутри : Снаружи;
  }

  /**
   * Искривляет образующую в соответствии с радиусом
   */
  set_generatrix_radius(height) {
    const {generatrix, _row, layer, selected} = this;
    const b = generatrix.firstSegment.point.clone();
    const e = generatrix.lastSegment.point.clone();
    const min_radius = b.getDistance(e) / 2;

    generatrix.removeSegments(1);
    generatrix.firstSegment.handleIn = null;
    generatrix.firstSegment.handleOut = null;

    let full;
    if(_row.r && _row.r <= min_radius) {
      _row.r = min_radius + 0.0001;
      full = true;
    }
    // if(height && height > min_radius) {
    //   height = min_radius;
    // }

    if(selected) {
      this.selected = false;
    }

    if(_row.r) {
      let p = new paper.Point(b.arc_point(b.x, b.y, e.x, e.y, _row.r, _row.arc_ccw, false));
      if(p.point_pos(b.x, b.y, e.x, e.y) > 0 && !_row.arc_ccw || p.point_pos(b.x, b.y, e.x, e.y) < 0 && _row.arc_ccw) {
        p = new paper.Point(b.arc_point(b.x, b.y, e.x, e.y, _row.r, !_row.arc_ccw, false));
      }
      if(full || height) {
        const start = b.add(e).divide(2);
        const vector = p.subtract(start);
        vector.length = (height || min_radius);
        p = start.add(vector);
      }
      generatrix.arcTo(p, e);
    }
    else {
      generatrix.lineTo(e);
    }

    layer.notify({
      type: consts.move_points,
      profiles: [this],
      points: []
    });

    if(selected) {
      setTimeout(() => this.selected = selected, 100);
    }
  }

  /**
   * Сеттер вставки с учетом выделенных элементов
   * @param v {CatInserts}
   * @param ign_select {Boolean}
   * @param ign_rays {Boolean}
   */
  set_inset(v, ign_select, ign_rays) {

    const {_row, _attr, project} = this;
    const profiles = [];

    if(!ign_select && project.selectedItems.length > 1) {
      project.selected_profiles(true).forEach((elm) => {
        if(elm != this && elm.elm_type == this.elm_type) {
          profiles.push(elm);
          elm.set_inset(v, true, true);
        }
      });
    }

    if(_row.inset != v) {

      _row.inset = v;

      // для уже нарисованных элементов...
      if(_attr && _attr._rays) {
        delete _attr.nom;
        _attr._rays.clear(ign_rays ? undefined : 'with_neighbor');
      }

      // если в новой вставке не разрешены текущие вставки в элемент - удаляем
      const rm = [];
      const {inset: {inserts}, _owner: {_owner}} = _row;
      _owner.inserts.find_rows({cnstr: -this.elm}, (row) => {
        if(!inserts.find({inset: row.inset})) {
          rm.push(row);
        }
      });
      for(const row of rm) {
        _owner.inserts.del(row);
      }

      project.register_change();
      project._scope.eve.emit('set_inset', this);
    }

    for(const {_attr} of profiles) {
      _attr && _attr._rays && _attr._rays.clear('with_neighbor');
    }
  }

  /**
   * Сеттер цвета элемента
   * @param v {CatClrs}
   * @param ignore_select {Boolean}
   */
  set_clr(v, ignore_select) {
    if(!ignore_select && this.project.selectedItems.length > 1) {
      this.project.selected_profiles(true).forEach((elm) => {
        if(elm != this) {
          elm.set_clr(v, true);
        }
      });
    }
    BuilderElement.prototype.set_clr.call(this, v);
  }

  /**
   * ### Дополняет cnn_point свойствами соединения
   *
   * @method postcalc_cnn
   * @param node {String} b, e - начало или конец элемента
   * @return CnnPoint
   */
  postcalc_cnn(node) {
    const cnn_point = this.cnn_point(node);
    cnn_point.cnn = $p.cat.cnns.elm_cnn(this, cnn_point.profile, cnn_point.cnn_types, cnn_point.cnn, false, undefined, cnn_point);
    if(!cnn_point.point) {
      cnn_point.point = this[node];
    }
    return cnn_point;
  }

  /**
   * ### Пересчитывает вставку после пересчета соединений
   * Контроль пока только по типу элемента
   *
   * @method postcalc_inset
   * @chainable
   */
  postcalc_inset() {
    // если слева и справа T - и тип не импост или есть не T и тпи импост
    this.set_inset(this.project.check_inset({elm: this}), true);
    return this;
  }

  /**
   * ### Пересчитывает вставку при смене системы или добавлении створки
   * Контроль пока только по типу элемента
   *
   * @method default_inset
   * @param all {Boolean} - пересчитывать для любых (не только створочных) элементов
   * @param [refill] {Boolean} - принудительно устанавливать вставку из системы
   */
  default_inset(all, refill) {
    let {orientation, project, layer, _attr, elm_type, inset} = this;
    const {sys} = layer;
    const nearest = this.nearest(true);
    const {cat: {cnns}, enm: {positions, orientations, elm_types, cnn_types}} = $p;

    if(nearest || all) {
      // импост может оказаться штульпом
      if(elm_type === elm_types.impost){
        if (this.is_shtulp()) {
          if(sys.elmnts.find({nom: inset, elm_type: elm_types.impost})) {
            elm_type = [elm_types.impost, elm_types.shtulp];
          }
          else {
            elm_type = elm_types.shtulp;
          }
        }
      }
      let pos = nearest && sys.flap_pos_by_impost && elm_type == elm_types.flap ? nearest.pos : this.pos;
      if(pos == positions.Центр) {
        if(orientation == orientations.vert) {
          pos = [pos, positions.ЦентрВертикаль];
          if(layer.furn.shtulp_kind() === 2) {
            elm_type = [elm_type, elm_types.flap0];
          }
        }
        if(orientation == orientations.hor) {
          pos = [pos, positions.ЦентрГоризонталь];
        }
      }
      this.set_inset(project.default_inset({elm_type, pos, inset: refill ? null : inset, elm: this}), true);
    }
    if(nearest) {
      _attr._nearest_cnn = cnns.elm_cnn(this, _attr._nearest, cnn_types.acn.ii, _attr._nearest_cnn || project.elm_cnn(this, nearest));
    }
  }

  /**
   * ### Рассчитывает точки пути
   * на пересечении текущего и указанного профилей
   *
   * @method path_points
   * @param cnn_point {CnnPoint}
   * @param [profile_point] {String}
   */
  path_points(cnn_point, profile_point) {

    const {cnn_types, cnn_sides, angle_calculating_ways: {СоединениеПополам: a2}} = $p.enm;
    const {_attr, rays, generatrix} = this;
    if(!generatrix.curves.length) {
      return cnn_point;
    }
    const {_corns} = _attr;

    // ищет точку пересечения открытых путей
    // если указан индекс, заполняет точку в массиве _corns. иначе - возвращает расстояние от узла до пересечения
    function intersect_point(path1, path2, index, ipoint = cnn_point.point) {
      const intersections = path1.getIntersections(path2);
      let delta = Infinity, tdelta, point, tpoint;

      if(intersections.length == 1) {
        if(index) {
          _corns[index] = intersections[0].point;
        }
        else {
          return intersections[0].point.getDistance(ipoint, true);
        }
      }
      else if(intersections.length > 1) {
        intersections.forEach((o) => {
          tdelta = o.point.getDistance(ipoint, true);
          if(tdelta < delta) {
            delta = tdelta;
            point = o.point;
          }
        });
        if(index) {
          _corns[index] = point;
        }
        else {
          return delta;
        }
      }
      return delta;
    }

    // если пересечение в узлах, используем лучи профиля
    const other = cnn_point.profile;
    const prays = other instanceof ProfileItem ? other.rays : (other instanceof Filling ? {inner: other.path, outer: other.path} : undefined);
    const is_b = profile_point === 'b';
    const is_e = profile_point === 'e';
    const {cnn_type} = cnn_point.cnn || {};

    if(prays) {
      const side = other.cnn_side(this, null, prays) === cnn_sides.outer ? 'outer' : 'inner';
      const oinner = prays[side];
      const oouter = prays[side === 'inner' ? 'outer' : 'inner'];

      // импосты рисуем с учетом стороны примыкания
      if(cnn_point.is_t || (cnn_type == cnn_types.xx && !cnn_point.profile_point)) {

        // при необходимости, перерисовываем ведущий элемент
        if(!other.path.segments.length) {
          const {_attr, row} = other;
          if(_attr.force_redraw) {
            if(other.generatrix && other.generatrix.segments.length) {
              other.path.addSegments(other.generatrix.segments);
              _attr.force_redraw = false;
            }
            else if(other.row && other.row.path_data) {
              other.path.pathData = other.row.path_data;
              _attr.force_redraw = false;
            }
            else {
              throw new Error('cycle redraw');
            }
          }
          else {
            _attr.force_redraw = true;
            other.redraw();
            _attr.force_redraw = false;
          }
        }

        const nodes = new Set();
        let profile2;
        cnn_point.point && !(this instanceof Onlay) && this.layer.profiles.forEach((profile) => {
          if(profile !== this){
            if(cnn_point.point.is_nearest(profile.b, true)) {
              const cp = profile.rays.b.profile;
              if(cp !== this) {
                if(cp !== other || other.cnn_side(this) === other.cnn_side(profile)) {
                  nodes.add(profile);
                }
              }
            }
            else if(cnn_point.point.is_nearest(profile.e, true)) {
              const cp = profile.rays.e.profile;
              if(cp !== this) {
                if(cp !== other || other.cnn_side(this) === other.cnn_side(profile)) {
                  nodes.add(profile);
                }
              }
            }
            else if(profile.generatrix.is_nearest(cnn_point.point, true)) {
              nodes.add(profile);
            }
          }
        });
        // убираем из nodes тех, кто соединяется с нами в окрестности cnn_point.point
        nodes.forEach((p2) => {
          if(p2 !== other) {
            profile2 = p2;
          }
        });

        if(profile2) {
          const interior = generatrix.getPointAt(generatrix.length/2)
          const {rays: prays2} = profile2;
          const side2 = profile2.cnn_side(this, null, prays2) === cnn_sides.outer ? 'outer' : 'inner';
          const pt1 = intersect_point(oinner, rays.outer, 0, interior);
          const pt2 = intersect_point(oinner, rays.inner, 0, interior);
          const pt3 = intersect_point(prays2[side2], rays.outer, 0, interior);
          const pt4 = intersect_point(prays2[side2], rays.inner, 0, interior);

          if(is_b) {
            pt1 < pt3 ? intersect_point(oinner, rays.outer, 1) : intersect_point(prays2[side2], rays.outer, 1);
            pt2 < pt4 ? intersect_point(oinner, rays.inner, 4) : intersect_point(prays2[side2], rays.inner, 4);
            intersect_point(prays2[side2], oinner, 5);
            if(rays.inner.point_pos(_corns[5]) >= 0 || rays.outer.point_pos(_corns[5]) >= 0) {
              delete _corns[5];
            }
          }
          else if(is_e) {
            pt1 < pt3 ? intersect_point(oinner, rays.outer, 2) : intersect_point(prays2[side2], rays.outer, 2);
            pt2 < pt4 ? intersect_point(oinner, rays.inner, 3) : intersect_point(prays2[side2], rays.inner, 3);
            intersect_point(prays2[side2], oinner, 6);
            if(rays.inner.point_pos(_corns[6]) >= 0 || rays.outer.point_pos(_corns[6]) >= 0) {
              delete _corns[6];
            }
          }
        }
        else {
          // для Т-соединений сначала определяем, изнутри или снаружи находится наш профиль
          if(is_b) {
            // в зависимости от стороны соединения
            intersect_point(oinner, rays.outer, 1);
            intersect_point(oinner, rays.inner, 4);
            delete _corns[5];
          }
          else if(is_e) {
            // в зависимости от стороны соединения
            intersect_point(oinner, rays.outer, 2);
            intersect_point(oinner, rays.inner, 3);
            delete _corns[6];
          }
        }

      }

      // крест в стык
      else if(cnn_type == cnn_types.xx) {

        // для раскладок, отступаем ширину профиля
        if(other instanceof Onlay) {
          const width = this.width * 0.7;
          const l = is_b ? width : generatrix.length - width;
          const p = generatrix.getPointAt(l);
          const n = generatrix.getNormalAt(l).normalize(width);
          const np = new paper.Path({
            insert: false,
            segments: [p.subtract(n), p.add(n)],
          });
          if(is_b) {
            intersect_point(np, rays.outer, 1);
            intersect_point(np, rays.inner, 4);
          }
          else if(is_e) {
            intersect_point(np, rays.outer, 2);
            intersect_point(np, rays.inner, 3);
          }
        }
        else {
          // получаем второй примыкающий профиль
          const cnn_point2 = other.cnn_point(cnn_point.profile_point);
          const profile2 = cnn_point2 && cnn_point2.profile;
          if(profile2) {
            const prays2 = profile2 && profile2.rays;
            const pt1 = intersect_point(oinner, rays.outer);
            const pt2 = intersect_point(oinner, rays.inner);
            const pt3 = intersect_point(prays2.inner, rays.outer);
            const pt4 = intersect_point(prays2.inner, rays.inner);

            if(is_b) {
              intersect_point(prays2.inner, oinner, 5);
              pt1 > pt3 ? intersect_point(oinner, rays.outer, 1) : intersect_point(prays2.inner, rays.outer, 1);
              pt2 > pt4 ? intersect_point(oinner, rays.inner, 4) : intersect_point(prays2.inner, rays.inner, 4);
            }
            else if(is_e) {
              pt1 > pt3 ? intersect_point(oinner, rays.outer, 2) : intersect_point(prays2.inner, rays.outer, 2);
              pt2 > pt4 ? intersect_point(oinner, rays.inner, 3) : intersect_point(prays2.inner, rays.inner, 3);
              intersect_point(prays2.inner, oinner, 6);
            }
          }
          else{
            if(is_b) {
              delete _corns[1];
              delete _corns[4];
            }
            else if(is_e) {
              delete _corns[2];
              delete _corns[3];
            }
          }
        }

      }

      // соединение с пустотой
      else if(!cnn_point.profile_point || !cnn_point.cnn || cnn_type == cnn_types.i) {
        // точки рассчитаются автоматически, как для ненайденных
        if(is_b) {
          delete _corns[1];
          delete _corns[4];
        }
        else if(is_e) {
          delete _corns[2];
          delete _corns[3];
        }
      }

      // варианты угловых соединений
      else {
        // если есть соединение с обратной стороны, его надо учитывать при отрисовке узла
        const cnn_other = cnn_point.find_other();
        const cnno = cnn_other && cnn_point.cnno(cnn_other);

        // угловое диагональное
        if(cnno && cnno.cnn_type == cnn_types.ad && (cnn_type != cnn_types.ad || other.width < cnn_other.profile.width)) {
          const other = cnn_other.profile;
          const prays = other.rays;
          const side = other.cnn_side(this, null, prays) === cnn_sides.outer ? 'outer' : 'inner';
          const oinner = prays[side];
          const oouter = prays[side === 'inner' ? 'outer' : 'inner'];
          // если профили разной ширины и угол соединение/2, добавляем pt5, pt6
          const tw = this.width, ow = other.width;
          let check_a2 = tw !== ow && cnno.main_row(this);
          if(check_a2 && check_a2.angle_calc_method == a2) {
            const wprofile = tw > ow ? this : other;
            const winner = wprofile === this ? rays.outer : oinner;
            if(is_b) {
              intersect_point(oinner, rays.outer, 1);
              const pt = _corns[1];
              const tg = winner.getTangentAt(winner.getOffsetOf(pt)).rotate((this.a1 / 2) * (wprofile === this ? -1 : 1));
              const median = new paper.Path({insert: false, segments: [pt, pt.add(tg)]}).elongation(Math.max(tw, ow) * 3);

              if(wprofile === this) {
                intersect_point(oouter, median, 5);
                intersect_point(rays.inner, median, 7);
                intersect_point(oouter, rays.inner, 4);
              }
              else {
                intersect_point(rays.inner, median, 4);
                delete _corns[5];
                delete _corns[7];
              }
            }

            else if(is_e) {
              intersect_point(oinner, rays.outer, 2);

              const pt = _corns[2];
              const tg = winner.getTangentAt(winner.getOffsetOf(pt)).rotate((this.a2 / 2) * (wprofile === this ? 1 : -1));
              const median = new paper.Path({insert: false, segments: [pt, pt.add(tg)]}).elongation(Math.max(tw, ow) * 3);

              if(wprofile === this) {
                intersect_point(oouter, median, 6);
                intersect_point(rays.inner, median, 8);
                intersect_point(oouter, rays.inner, 3);
              }
              else {
                intersect_point(rays.inner, median, 3);
                delete _corns[6];
                delete _corns[8];
              }
            }
          }
          else {
            if(is_b) {
              if(this.is_collinear(other, 1)) {
                delete _corns[1];
                delete _corns[4];
              }
              else {
                intersect_point(oouter, rays.inner, 4);
                intersect_point(oinner, rays.outer, 1);
              }
            }
            else if(is_e) {
              if(this.is_collinear(other, 1)) {
                delete _corns[2];
                delete _corns[3];
              }
              else {
                intersect_point(oouter, rays.inner, 3);
                intersect_point(oinner, rays.outer, 2);
              }
            }
          }
        }
        else if(cnn_type == cnn_types.ad) {
          // если профили разной ширины и угол соединение/2, добавляем pt5, pt6
          const tw = this.width, ow = other.width;
          let check_a2 = tw !== ow && cnn_point.cnn.main_row(this);
          if(check_a2 && check_a2.angle_calc_method == a2) {
            const wprofile = tw > ow ? this : other;
            const winner = wprofile === this ? rays.inner : oinner;
            if(is_b) {
              intersect_point(oinner, rays.inner, 4);
              const pt = _corns[4];
              const tg = winner.getTangentAt(winner.getOffsetOf(pt)).rotate((this.a1 / 2) * (wprofile === this ? 1 : -1));
              const median = new paper.Path({insert: false, segments: [pt, pt.add(tg)]}).elongation(Math.max(tw, ow) * 3);

              if(wprofile === this) {
                intersect_point(oouter, median, 5);
                intersect_point(rays.outer, median, 7);
                intersect_point(oouter, rays.outer, 1);
              }
              else {
                intersect_point(rays.outer, median, 1);
                delete _corns[5];
                delete _corns[7];
              }
            }

            else if(is_e) {
              intersect_point(oinner, rays.inner, 3);

              const pt = _corns[3];
              const tg = winner.getTangentAt(winner.getOffsetOf(pt)).rotate((this.a2 / 2) * (wprofile === this ? -1 : 1));
              const median = new paper.Path({insert: false, segments: [pt, pt.add(tg)]}).elongation(Math.max(tw, ow) * 3);

              if(wprofile === this) {
                intersect_point(oouter, median, 6);
                intersect_point(rays.outer, median, 8);
                intersect_point(oouter, rays.outer, 2);
              }
              else {
                intersect_point(rays.outer, median, 2);
                delete _corns[6];
                delete _corns[8];
              }
            }
          }
          else {
            if(is_b) {
              if(this.is_collinear(other, 1)) {
                delete _corns[1];
                delete _corns[4];
              }
              else {
                intersect_point(oouter, rays.outer, 1);
                intersect_point(oinner, rays.inner, 4);
              }
            }
            else if(is_e) {
              if(this.is_collinear(other, 1)) {
                delete _corns[2];
                delete _corns[3];
              }
              else {
                intersect_point(oouter, rays.outer, 2);
                intersect_point(oinner, rays.inner, 3);
              }
            }
          }
        }

        // угловое к вертикальной
        else if(cnn_type == cnn_types.av) {
          if(this.orientation == $p.enm.orientations.vert) {
            if(is_b) {
              intersect_point(oouter, rays.outer, 1);
              intersect_point(oouter, rays.inner, 4);
            }
            else if(is_e) {
              intersect_point(oouter, rays.outer, 2);
              intersect_point(oouter, rays.inner, 3);
            }
          }
          else if(this.orientation == $p.enm.orientations.hor) {
            if(is_b) {
              intersect_point(oinner, rays.outer, 1);
              intersect_point(oinner, rays.inner, 4);
            }
            else if(is_e) {
              intersect_point(oinner, rays.outer, 2);
              intersect_point(oinner, rays.inner, 3);
            }
          }
          else {
            cnn_point.err = 'orientation';
          }
        }

        // угловое к горизонтальной
        else if(cnn_type == cnn_types.ah) {
          if(this.orientation == $p.enm.orientations.vert) {
            if(is_b) {
              intersect_point(oinner, rays.outer, 1);
              intersect_point(oinner, rays.inner, 4);
            }
            else if(is_e) {
              intersect_point(oinner, rays.outer, 2);
              intersect_point(oinner, rays.inner, 3);
            }
          }
          else if(this.orientation == $p.enm.orientations.hor) {
            if(is_b) {
              intersect_point(oouter, rays.outer, 1);
              intersect_point(oouter, rays.inner, 4);
            }
            else if(is_e) {
              intersect_point(oouter, rays.outer, 2);
              intersect_point(oouter, rays.inner, 3);
            }
          }
          else {
            cnn_point.err = 'orientation';
          }
        }

        // короткое
        else if(cnn_type == cnn_types.short) {
          if(is_b) {
            intersect_point(oinner, rays.outer, 1);
            intersect_point(oinner, rays.inner, 4);
          }
          else if(is_e) {
            intersect_point(oinner, rays.outer, 2);
            intersect_point(oinner, rays.inner, 3);
          }
        }

        // длинное
        else if(cnn_type == cnn_types.long) {
          if(is_b) {
            intersect_point(oouter, rays.outer, 1);
            intersect_point(oouter, rays.inner, 4);
          }
          else if(is_e) {
            intersect_point(oouter, rays.outer, 2);
            intersect_point(oouter, rays.inner, 3);
          }
        }
      }
    }
    // если точка не рассчиталась - рассчитываем по умолчанию - как с пустотой
    if(is_b) {
      if(!_corns[1]) {
        _corns[1] = this.b.add(generatrix.firstCurve.getNormalAt(0, true).normalize(this.d1));
      }
      if(!_corns[4]) {
        _corns[4] = this.b.add(generatrix.firstCurve.getNormalAt(0, true).normalize(this.d2));
      }
    }
    else if(is_e) {
      if(!_corns[2]) {
        _corns[2] = this.e.add(generatrix.lastCurve.getNormalAt(1, true).normalize(this.d1));
      }
      if(!_corns[3]) {
        _corns[3] = this.e.add(generatrix.lastCurve.getNormalAt(1, true).normalize(this.d2));
      }
    }

    return cnn_point;
  }

  /**
   * ### Точка внутри пути
   * Возвращает точку, расположенную гарантированно внутри профиля
   *
   * @property interiorPoint
   * @type paper.Point
   */
  interiorPoint() {
    const {generatrix, d1, d2} = this;
    const igen = generatrix.curves.length == 1 ? generatrix.firstCurve.getPointAt(0.5, true) : (
      generatrix.curves.length == 2 ? generatrix.firstCurve.point2 : generatrix.curves[1].point2
    );
    const normal = generatrix.getNormalAt(generatrix.getOffsetOf(igen));
    return igen.add(normal.multiply(d1).add(normal.multiply(d2)).divide(2));
  }


  /**
   * ### Выделяет сегмент пути профиля, ближайший к точке
   *
   * @method select_corn
   * @param point {paper.Point}
   */
  select_corn(point) {

    const res = this.corns(point);

    this.path.segments.forEach((segm) => {
      if(segm.point.is_nearest(res.point)) {
        res.segm = segm;
      }
    });

    if(!res.segm && res.point == this.b) {
      res.segm = this.generatrix.firstSegment;
    }

    if(!res.segm && res.point == this.e) {
      res.segm = this.generatrix.lastSegment;
    }

    if(res.segm && res.dist < consts.sticking0) {
      this.project.deselectAll();
      res.segm.selected = true;
    }

    return res;
  }

  /**
   * ### Признак прямолинейности
   * Вычисляется, как `is_linear()` {{#crossLink "BuilderElement/generatrix:property"}}образующей{{/crossLink}}
   *
   * @method is_linear
   * @return Boolean
   */
  is_linear() {
    const {generatrix} = this;
    return generatrix ? generatrix.is_linear() : true;
  }

  /**
   * ### Выясняет, примыкает ли указанный профиль к текущему
   * Вычисления делаются на основании близости координат концов текущего профиля образующей соседнего
   *
   * @param p {ProfileItem}
   * @return Boolean
   */
  is_nearest(p) {
    const {b, e, generatrix} = this;
    return (b.is_nearest(p.b, true) || generatrix.is_nearest(p.b)) && (e.is_nearest(p.e, true) || generatrix.is_nearest(p.e));
  }

  /**
   * ### Выясняет, параллельны ли профили
   * в пределах `consts.orientation_delta`
   *
   * @param profile {ProfileItem}
   * @return Boolean
   */
  is_collinear(profile, delta = 0) {
    let angl = profile.e.subtract(profile.b).getDirectedAngle(this.e.subtract(this.b));
    if(angl < -180) {
      angl += 180;
    }
    return Math.abs(angl) < (delta || consts.orientation_delta);
  }

  /**
   * ### Выясняет, перпендикулярны ли профили
   * @param profile {ProfileItem}
   * @param point {paper.Point}
   * @param delta {Number}
   */
  is_orthogonal(profile, point, delta) {
    const offset1 = this.generatrix.getOffsetOf(this.generatrix.getNearestPoint(point));
    const offset2 = profile.generatrix.getOffsetOf(profile.generatrix.getNearestPoint(point));
    const v1 = this.generatrix.getNormalAt(offset1);
    const v2 = profile.generatrix.getTangentAt(offset2);
    let angl = v1.getDirectedAngle(v2);
    if(angl < -180) {
      angl += 180;
    }
    return Math.abs(angl) < (delta || consts.orientation_delta);
  }

  /**
   * Возвращает массив примыкающих профилей
   */
  joined_nearests() {
    return [];
  }

  /**
   * Считаем профиль штульпом, если к нему примыкает хотя бы одна штульповая фурнитура
   * @return {boolean}
   */
  is_shtulp() {
    const {orientations: {vert}, elm_types: {impost}} = $p.enm;
    if(this.elm_type === impost && this.orientation === vert) {
      for(const profile of this.joined_nearests()) {
        const {layer} = profile;
        for(const {shtulp_available, shtulp_fix_here, side} of layer.furn.open_tunes) {
          if((shtulp_available || shtulp_fix_here) && layer.profile_by_furn_side(side) === profile) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * ### Формирует путь сегмента профиля
   * Пересчитывает соединения с соседями и стоит путь профиля на основании пути образующей
   * - Сначала, вызывает {{#crossLink "ProfileItem/postcalc_cnn:method"}}postcalc_cnn(){{/crossLink}} для узлов `b` и `e`
   * - Внутри `postcalc_cnn`, выполняется {{#crossLink "ProfileItem/cnn_point:method"}}cnn_point(){{/crossLink}} для пересчета соединений на концах профиля
   * - Внутри `cnn_point`:
   *    + {{#crossLink "ProfileItem/check_distance:method"}}check_distance(){{/crossLink}} - проверяет привязку, если вернулось false, `cnn_point` завершает свою работы
   *    + цикл по всем профилям и поиск привязки
   * - {{#crossLink "ProfileItem/postcalc_inset:method"}}postcalc_inset(){{/crossLink}} - проверяет корректность вставки, заменяет при необходимости
   * - {{#crossLink "ProfileItem/path_points:method"}}path_points(){{/crossLink}} - рассчитывает координаты вершин пути профиля
   *
   * @method redraw
   * @chainable
   */
  redraw() {
    // получаем узлы
    const bcnn = this.postcalc_cnn('b');
    const ecnn = this.postcalc_cnn('e');
    const {path, generatrix, rays} = this;

    // получаем соединения концов профиля и точки пересечения с соседями
    this.path_points(bcnn, 'b');
    this.path_points(ecnn, 'e');

    // очищаем существующий путь
    path.removeSegments();

    // TODO отказаться от повторного пересчета и задействовать клоны rays-ов
    this.corns(5) && path.add(this.corns(5));
    path.add(this.corns(1));

    if(generatrix.is_linear()) {
      path.add(this.corns(2));
      this.corns(6) && path.add(this.corns(6));
      path.add(this.corns(3));
    }
    else {

      let tpath = new paper.Path({insert: false});
      let offset1 = rays.outer.getNearestLocation(this.corns(1)).offset;
      let offset2 = rays.outer.getNearestLocation(this.corns(2)).offset;
      let step = (offset2 - offset1) / 50;

      for (let i = offset1 + step; i < offset2; i += step) {
        tpath.add(rays.outer.getPointAt(i));
      }
      tpath.simplify(0.8);
      path.join(tpath);
      path.add(this.corns(2));
      this.corns(6) && path.add(this.corns(6));
      path.add(this.corns(3));

      tpath = new paper.Path({insert: false});
      offset1 = rays.inner.getNearestLocation(this.corns(3)).offset;
      offset2 = rays.inner.getNearestLocation(this.corns(4)).offset;
      step = (offset2 - offset1) / 50;
      for (let i = offset1 + step; i < offset2; i += step) {
        tpath.add(rays.inner.getPointAt(i));
      }
      tpath.simplify(0.8);
      path.join(tpath);

    }

    path.add(this.corns(4));
    path.closePath();
    path.reduce();

    for(const chld of this.children) {
      if(chld instanceof ProfileItem) {
        chld.observer && chld.observer(this);
        chld.redraw();
      }
    }

    return this;
  }

  /**
   * рисует стрелочку направления элемента
   */
  mark_direction() {
    const {generatrix, rays: {inner, outer}} = this;
    const gb = generatrix.getPointAt(130);
    const ge = generatrix.getPointAt(230);
    const ib = inner.getNearestPoint(gb);
    const ie = inner.getNearestPoint(ge);
    const ob = outer.getNearestPoint(gb);
    const oe = outer.getNearestPoint(ge);

    const b = ib.add(ob).divide(2);
    const e = ie.add(oe).divide(2);
    const c = b.add(e).divide(2);
    const n = e.subtract(b).rotate(90).normalize(10);
    const c1 = c.add(n);
    const c2 = c.subtract(n);

    const path = new paper.Path({
      parent: this,
      segments: [b, e, c1, c2, e],
      strokeColor: 'darkblue',
      strokeCap: 'round',
      strokeWidth: 2,
      strokeScaling: false,
    })
  }

  /**
   * ### Координаты вершин (cornx1...corny4)
   *
   * @method corns
   * @param corn {String|Number} - имя или номер вершины
   * @return {Point|Number} - координата или точка
   */
  corns(corn) {
    const {_corns} = this._attr;
    if(typeof corn == 'number') {
      return corn < 10 ? _corns[corn] : this.generatrix.getPointAt(corn);
    }
    else if(corn instanceof paper.Point) {

      const res = {dist: Infinity, profile: this};
      let dist;

      for (let i = 1; i < 5; i++) {
        dist = _corns[i].getDistance(corn);
        if(dist < res.dist) {
          res.dist = dist;
          res.point = _corns[i];
          res.point_name = i;
        }
      }

      const {hhi} = this;
      if(hhi) {
        dist = hhi.getDistance(corn);
        if(dist <= res.dist) {
          res.dist = hhi.getDistance(corn);
          res.point = hhi;
          res.point_name = 'hhi';
        }
        const {hho} = this;
        dist = hho.getDistance(corn);
        if(dist <= res.dist) {
          res.dist = hho.getDistance(corn);
          res.point = hho;
          res.point_name = 'hho';
        }
      }

      dist = this.b.getDistance(corn);
      if(dist <= res.dist) {
        res.dist = this.b.getDistance(corn);
        res.point = this.b;
        res.point_name = 'b';
      }
      else {
        dist = this.e.getDistance(corn);
        if(dist <= res.dist) {
          res.dist = this.e.getDistance(corn);
          res.point = this.e;
          res.point_name = 'e';
        }
      }

      return res;
    }
    else {
      const index = corn.substr(corn.length - 1, 1);
      const axis = corn.substr(corn.length - 2, 1);
      return _corns[index][axis];
    }
  }

  /**
   * Выясняет, имеет ли текущий профиль соединение с `profile` в окрестности точки `point`
   */
  has_cnn(profile, point) {

    let t = this;
    while (t.parent instanceof ProfileItem) {
      t = t.parent;
    }
    while (profile.parent instanceof ProfileItem) {
      profile = profile.parent;
    }

    if(
      (t.b.is_nearest(point, true) && t.cnn_point('b').profile == profile) ||
      (t.e.is_nearest(point, true) && t.cnn_point('e').profile == profile) ||
      (profile.b.is_nearest(point, true) && profile.cnn_point('b').profile == t) ||
      (profile.e.is_nearest(point, true) && profile.cnn_point('e').profile == t)
    ) {
      return true;
    }

    return false;
  }

  /**
   * Выясняет по таблице соединений, являются ли соединения на концах угловыми
   */
  is_corner() {
    const {ox, elm} = this;
    const {_obj} = ox.cnn_elmnts;
    const rows = _obj.filter(({elm1, elm2, node1, node2}) =>
      (elm1 === elm && node1 === 'b' && (node2 === 'b' || node2 === 'e')) || (elm1 === elm && node1 === 'e' && (node2 === 'b' || node2 === 'e'))
    );
    return {
      ab: rows.find(({node1}) => node1 === 'b'),
      ae: rows.find(({node1}) => node1 === 'e')
    }
  }

  /**
   * Вызывает одноименную функцию _scheme в контексте текущего профиля
   */
  check_distance(element, res, point, check_only) {
    return this.project.check_distance(element, this, res, point, check_only);
  }

  /**
   * Дополняет и сортирует массив свойств примыкающих профилей
   * @param ares
   * @return {boolean}
   */
  max_right_angle(ares) {
    const {generatrix} = this;
    let has_a = true;
    ares.forEach((res) => {
      res._angle = generatrix.angle_to(res.profile.generatrix, res.point);
      if(res._angle > 180) {
        res._angle = 360 - res._angle;
      }
    });
    ares.sort((a, b) => {
      const aa = Math.abs(a._angle - 90);
      const ab = Math.abs(b._angle - 90);
      return aa - ab;
    });
    return has_a;
  }

  /**
   * Выводит текст с номером элемента
   * @param show
   */
  show_number(show = true) {
    let {elm_number} = this.children;
    if(!show) {
      return elm_number && elm_number.remove();
    }
    if(elm_number) {
      elm_number.position = this.path.interiorPoint;
    }
    else {
      elm_number = new paper.PointText({
        parent: this,
        guide: true,
        name: 'elm_number',
        justification: 'center',
        fillColor: 'darkblue',
        fontFamily: consts.font_family,
        fontSize: consts.font_size * 1.1,
        fontWeight: 'bold',
        content: this.elm,
        position: this.interiorPoint().add(this.generatrix.getTangentAt(this.generatrix.length / 1).multiply(consts.font_size * 2)),
      });
    }
  }

}

ProfileItem.path_attr = {
  strokeColor: 'black',
  strokeWidth: 1,
  strokeScaling: false,

  onMouseEnter(event) {
    const {fillColor, parent: {_attr}, project} = this;
    if(project._attr._from_service || !fillColor) {
      return;
    }
    _attr.fillColor = fillColor.clone();
    const {red, green, blue, alpha} = fillColor;
    fillColor.alpha = 0.9;
    fillColor.red = red > 0.7 ? red - 0.1 : red + 0.1;
    fillColor.green = green > 0.7 ? green - 0.06 : green + 0.06;
    fillColor.blue = blue > 0.7 ? blue - 0.08 : blue + 0.08;
  },

  onMouseLeave(event) {
    const {_attr, project} = this.parent;
    if(project._attr._from_service) {
      return;
    }
    this.fillColor = _attr.fillColor;
    delete _attr.fillColor;
  }
};

EditorInvisible.ProfileItem = ProfileItem;
EditorInvisible.ProfileRays = ProfileRays;
EditorInvisible.CnnPoint = CnnPoint;


/**
 * Сегмент (кусочек) связки
 *
 * Created 26.07.2021.
 */

class ProfileSegment extends ProfileItem {

  // elm_type такой же, как у обычного профиля
  get elm_type() {
    return this.parent.elm_type;
  }

  // Расстояние от узла до опорной линии
  get d0() {
    return this.parent.d0;
  }

  // Расстояние от узла до внешнего ребра элемента
  get d1() {
    return this.parent.d1;
  }

  // Расстояние от узла до внутреннего ребра элемента
  get d2() {
    return this.parent.d2;
  }

  /**
   * ### Координаты начала элемента
   * @property b
   * @type paper.Point
   */
  get b() {
    return super.b;
  }
  set b(v) {
    super.b = v;
    this._attr._rays.b.point = this.b;
  }

  /**
   * Координаты конца элемента
   * @property e
   * @type Point
   */
  get e() {
    return super.e;
  }
  set e(v) {
    super.e = v;
    this._attr._rays.e.point = this.e;
  }

  // вставка - внешний профиль
  get inset() {
    return this.parent.inset;
  }
  set inset(v) {}

  set_inset(v) {

  }

  get nom() {
    return this.parent.nom;
  }

  get pos() {
    return this.parent.pos;
  }

  /**
   * информация для диалога свойств
   *
   * @property info
   * @type String
   * @final
   * @private
   */
  get info() {
    const {elm, angle_hor, length, layer} = this;
    return `№${layer instanceof ContourNestedContent ? `${
      layer.layer.cnstr}-${elm}` : elm} сегм. α:${angle_hor.toFixed(0)}° l: ${length.toFixed(0)}`;
  }

  cnn_point(node, point) {

    const res = this.rays[node];
    const {parent} = this;

    const check_distance = (elm) => {

      if(elm == this || elm == parent){
        return;
      }

      const gp = elm.generatrix.getNearestPoint(point);
      let distance;

      if(gp && (distance = gp.getDistance(point)) < consts.sticking){
        if(distance <= res.distance){
          res.point = gp;
          res.distance = distance;
          res.profile = elm;

          if(elm.generatrix.firstSegment.point.is_nearest(gp)) {
            res.profile_point = 'b';
          }
          else if(elm.generatrix.lastSegment.point.is_nearest(gp)) {
            res.profile_point = 'e';
          }
        }
      }

    };

    if(!point){
      point = this[node];
    }

    // Если привязка не нарушена, возвращаем предыдущее значение
    if(res.profile && res.profile.children.length){
      if(!res.cnn) {
        res.cnn = $p.cat.cnns.elm_cnn(res.parent, res.profile, res.cnn_types, res.cnn, true, false, res);
      }
      return res;
    }

    // TODO вместо полного перебора профилей контура, реализовать анализ текущего соединения и успокоиться, если соединение корректно
    res.clear();
    res.cnn_types = [$p.enm.cnn_types.ad];

    parent.segms.forEach((segm) => check_distance(segm, true));

    if(!res.profile || !res.profile_point) {
      const {rays, generatrix} = parent;
      if(generatrix.firstSegment.point.is_nearest(res.point)) {
        res.profile = rays.b.profile;
        res.profile_point = rays.b.profile_point;
        res.cnn = $p.cat.cnns.elm_cnn(res.parent, res.profile, res.cnn_types, res.cnn, true, false, res);
      }
      else if(generatrix.lastSegment.point.is_nearest(res.point)) {
        res.profile = rays.e.profile;
        res.profile_point = rays.e.profile_point;
        res.cnn = $p.cat.cnns.elm_cnn(res.parent, res.profile, res.cnn_types, res.cnn, true, false, res);
      }
    }

    return res;
  }

  cnn_side(profile, interior, rays) {
    return profile instanceof ProfileSegment ? $p.enm.cnn_sides.inner : this.parent.cnn_side(profile, interior, rays);
  }

  save_coordinates() {
    super.save_coordinates();
    const {_row, parent} = this;
    _row.elm_type = $p.enm.elm_types.bundle;
    _row.parent = parent.elm;
  }

  path_points(cnn_point, profile_point) {
    const {_attr: {_corns}, parent} = this;
    if(parent.b.is_nearest(cnn_point.point)) {
      _corns[1] = parent.corns(1);
      _corns[4] = parent.corns(4);
      _corns[5] = parent.corns(5);
      _corns[7] = parent.corns(7);
    }
    else if(parent.e.is_nearest(cnn_point.point)) {
      _corns[2] = parent.corns(2);
      _corns[3] = parent.corns(3);
      _corns[6] = parent.corns(6);
      _corns[8] = parent.corns(8);
    }
    else {
      const {rays} = parent;
      const inner = rays.inner.getNearestPoint(cnn_point.point);
      const outer = rays.outer.getNearestPoint(cnn_point.point);
      if(profile_point === 'b') {
        _corns[1] = outer;
        _corns[4] = inner;
      }
      else {
        _corns[2] = outer;
        _corns[3] = inner;
      }
    }
    return cnn_point;
  }

  nearest() {
    return this.parent;
  }

  move_points(delta) {
    const {b, e, rays, parent: {generatrix}} = this;

    for(const segm of this.generatrix.segments) {
      if (segm.selected){
        const free_point = generatrix.getNearestPoint(segm.point.add(delta));
        if(segm.point === b){
          if(b.is_nearest(generatrix.firstSegment.point)) {
            continue;
          }
          rays.b.point = free_point;
          if(rays.b.profile_point && rays.b.profile) {
            rays.b.profile[rays.b.profile_point] = free_point;
          }
        }
        else if(segm.point === e){
          if(e.is_nearest(generatrix.lastSegment.point)) {
            continue;
          }
          rays.e.point = free_point;
          if(rays.e.profile_point && rays.e.profile) {
            rays.e.profile[rays.e.profile_point] = free_point;
          }
        }

        // собственно, сдвиг узлов
        segm.point = free_point;
      }
    }
  }

  do_bind() {
    const {b, e, rays, parent: {generatrix}} = this;
    if(generatrix.is_linear()) {
      if(!generatrix.is_nearest(b, 0)) {
        let pb = generatrix.getNearestPoint(b);
        if(pb.is_nearest(generatrix.firstSegment.point, this.widht) && !pb.equals(generatrix.firstSegment.point)) {
          pb = generatrix.firstSegment.point;
        }
        if(!b.is_nearest(pb, 0)) {
          this.b = pb;
        }
        if(pb !== generatrix.firstSegment.point) {
          const cp = this.cnn_point('b');
          if(cp.profile instanceof ProfileSegment && cp.profile_point) {
            cp.profile[cp.profile_point] = pb;
          }
        }
      }
      if(!generatrix.is_nearest(e, 0)) {
        let pe = generatrix.getNearestPoint(e);
        if(pe.is_nearest(generatrix.lastSegment.point, this.widht) && !pe.equals(generatrix.lastSegment.point)) {
          pe = generatrix.lastSegment.point;
        }
        if(!e.is_nearest(pe, 0)) {
          this.e = pe;
        }
        if(pe !== generatrix.lastSegment.point) {
          const cp = this.cnn_point('e');
          if(cp.profile instanceof ProfileSegment && cp.profile_point) {
            cp.profile[cp.profile_point] = pe;
          }
        }
      }
    }
  }

  observer(p) {
    if(p === this.parent) {
      this.do_bind();
    }
  }

  joined_imposts() {
    const {b, e, parent, generatrix} = this;
    const tmp = parent.joined_imposts();
    const filter = ({point}) => {
      const pt = generatrix.getNearestPoint(point);
      return !(b.is_nearest(pt) || e.is_nearest(pt));
    };
    return {inner: tmp.inner.filter(filter), outer: tmp.outer.filter(filter)};
  }

  /**
   * ### У сегмента нет доборов
   */
  get addls() {
    return [];
  }

  /**
   * ### У сегмента нет сегментов
   */
  get segms() {
    return [];
  }

  remove(force) {
    if(force !== true) {
      const {parent: {segms, e}, rays} = this;
      // если сегментов 2 - просто чистим
      if(segms.length <= 2) {
        for(const segm of segms) {
          segm.remove(true);
        }
        return;
      }
      // последний сегмент удаляем иначе
      if(this.e.is_nearest(e)) {
        const {profile} = rays.b;
        const pe = profile.cnn_point('e');
        pe.profile = rays.e.profile;
        pe.profile_point = rays.e.profile_point;
        pe.cnn = rays.e.cnn;
        profile.e = rays.e.point;
      }
    }
    this.selected = false;
    super.remove();
  }

}

EditorInvisible.ProfileSegment = ProfileSegment;


/**
 * Created 24.07.2015
 *
 * @module geometry
 * @submodule profile
 */

/**
 * ### Профиль
 * Класс описывает поведение сегмента профиля (створка, рама, импост)<br />
 * У профиля есть координаты конца и начала, есть путь образующей - прямая или кривая линия
 *
 * @class Profile
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @constructor
 * @extends ProfileItem
 * @menuorder 42
 * @tooltip Профиль
 *
 * @example
 *
 *     // Создаём элемент профиля на основании пути образующей
 *     // одновременно, указываем контур, которому будет принадлежать профиль, вставку и цвет
 *     new Profile({
 *       generatrix: new paper.Path({
 *         segments: [[1000,100], [0, 100]]
 *       }),
 *       proto: {
 *         parent: _contour,
 *         inset: _inset
 *         clr: _clr
 *       }
 *     });
 */
class Profile extends ProfileItem {

  constructor(attr) {

    const fromCoordinates = attr.row && attr.row.elm;

    super(attr);

    if(this.parent) {
      const {project: {_scope}, observer} = this;

      // Подключаем наблюдателя за событиями контура с именем _consts.move_points_
      this.observer = observer.bind(this);
      _scope.eve.on(consts.move_points, this.observer);

      // Информируем контур о том, что у него появился новый ребёнок
      this.layer.on_insert_elm(this);

      // ищем и добавляем доборные профили
      if(fromCoordinates){
        const {cnstr, elm, _owner} = attr.row;
        const {elm_types} = $p.enm;
        _owner.find_rows({cnstr, parent: {in: [elm, -elm]}}, (row) => {
          // добор
          if(row.elm_type === elm_types.addition) {
            new ProfileAddl({row, parent: this});
          }
          // примыкание
          else if(row.elm_type === elm_types.adjoining) {
            new ProfileAdjoining({row, parent: this});
          }
          // связка (чулок)
          else if(row.elm_type === elm_types.bundle) {
            new ProfileSegment({row, parent: this});
          }
        });
      }
    }
  }

  /**
   * Расстояние от узла до опорной линии
   * для сегментов створок и вложенных элементов зависит от ширины элементов и свойств примыкающих соединений
   * @property d0
   * @type Number
   */
  get d0() {
    const {_attr} = this;
    if(!_attr.hasOwnProperty('d0')) {
      _attr.d0 = this.offset;
      const nearest = this.nearest();
      if(nearest) {
        _attr.d0 -= nearest.d2 + (_attr._nearest_cnn ? _attr._nearest_cnn.size(this, nearest) : 20);
      }
    }
    return _attr.d0;
  }

  /**
   * Возвращает тип элемента (рама, створка, импост)
   */
  get elm_type() {
    const {_rays, _nearest} = this._attr;
    const {elm_types} = $p.enm;

    // если начало или конец элемента соединены с соседями по Т, значит это импост
    if(_rays && !_nearest && (_rays.b.is_tt || _rays.e.is_tt)) {
      return elm_types.impost;
    }

    // Если вложенный контур, значит это створка
    if(this.layer?.parent instanceof Contour) {
      return elm_types.flap;
    }

    return elm_types.rama;
  }

  /**
   * Является ли текущий элемент связкой
   * @returns {boolean}
   */
  get is_bundle() {
    return Boolean(this.children.find((elm) => elm instanceof ProfileSegment));
  }

  /**
   * Положение элемента в контуре
   */
  get pos() {
    const {top, bottom, left, right} = this.layer.profiles_by_side();
    const {Верх, Низ, Лев, Прав, Центр} = $p.enm.positions;
    if(top === this) {
      return Верх;
    }
    if(bottom === this) {
      return Низ;
    }
    if(left === this) {
      return Лев;
    }
    if(right === this) {
      return Прав;
    }
    const {x1, x2, y1, y2} = this;
    const delta = 60;
    if(Math.abs(top.y1 + top.y2 - y1 - y2) < delta) {
      return Верх;
    }
    if(Math.abs(bottom.y1 + bottom.y2 - y1 - y2) < delta) {
      return Низ;
    }
    if(Math.abs(left.x1 + left.x2 - x1 - x2) < delta) {
      return Лев;
    }
    if(Math.abs(right.x1 + right.x2 - x1 - x2) < delta) {
      return Прав;
    }
    // TODO: рассмотреть случай с выносом стоек и разрывами
    return Центр;
  }

  /**
   * Примыкающий внешний элемент - имеет смысл для сегментов створок, доборов и рам с внешними соединителями
   * @property nearest
   * @type Profile
   */
  nearest(ign_cnn) {

    const {b, e, _attr, layer, project} = this;
    let {_nearest, _nearest_cnn} = _attr;

    if(!ign_cnn && this.inset.empty()) {
      ign_cnn = true;
    }

    const check_nearest = (elm) => {
      if(!(elm instanceof Profile || elm instanceof ProfileConnective) || !elm.isInserted()) {
        return;
      }
      let {generatrix} = elm;
      if(elm.elm_type === $p.enm.elm_types.Импост) {
        const pb = elm.cnn_point('b').profile;
        const pe = elm.cnn_point('e').profile;
        if(pb && pb.nearest(true) || pe && pe.nearest(true)) {
          generatrix = generatrix.clone({insert: false}).elongation(100);
        }
      }
      let is_nearest = [];
      if(generatrix.is_nearest(b)) {
        is_nearest.push(b);
      }
      if(generatrix.is_nearest(e)) {
        is_nearest.push(e);
      }
      if(is_nearest.length < 2 && elm instanceof ProfileConnective) {
        if(this.generatrix.is_nearest(elm.b)) {
          if(is_nearest.every((point) => !point.is_nearest(elm.b))) {
            is_nearest.push(elm.b);
          }
        }
        if(this.generatrix.is_nearest(elm.e)) {
          if(is_nearest.every((point) => !point.is_nearest(elm.e))) {
            is_nearest.push(elm.e);
          }
        }
      }

      if(is_nearest.length > 1) {
        if(!ign_cnn) {
          if(!_nearest_cnn) {
            _nearest_cnn = project.elm_cnn(this, elm);
          }
          // выясним сторону соединения
          let outer;
          if(elm.is_linear()) {
            outer = Math.abs(elm.angle_hor - this.angle_hor) > 60;
          }
          else {
            const ob = generatrix.getOffsetOf(generatrix.getNearestPoint(b));
            const oe = generatrix.getOffsetOf(generatrix.getNearestPoint(e));
            outer = ob > oe;
          }
          _attr._nearest_cnn = $p.cat.cnns.elm_cnn(this, elm, $p.enm.cnn_types.acn.ii, _nearest_cnn, false, outer);
        }
        _attr._nearest = elm;
        return true;
      }

      _attr._nearest = null;
      _attr._nearest_cnn = null;
    };

    const find_nearest = (children) => children.some((elm) => {
      if(_nearest == elm || !elm.generatrix) {
        return;
      }
      if(check_nearest(elm)) {
        return true;
      }
      else {
        _attr._nearest = null;
      }
    });

    if(layer && !check_nearest(_attr._nearest)) {
      if(layer.layer) {
        find_nearest(layer.layer.profiles);
      }
      else {
        find_nearest(project.l_connective.children);
      }
    }

    return _attr._nearest;
  }

  /**
   * Добавляет сегменты
   * @param [count] {Number} - на сколько сегментов резать
   */
  split_by(count) {
    const {generatrix, segms, inset, clr, project} = this;
    if(!count || typeof count !== 'number' || count < 2) {
      count = 2;
    }
    const len = generatrix.length / count;
    let first = generatrix.clone({insert: false});
    for(let i=1; i<count; i++) {
      const loc = first.getLocationAt(len);
      const second = first.splitAt(loc);
      new ProfileSegment({generatrix: first, proto: {inset, clr}, parent: this, project});
      first = second;
    }
    new ProfileSegment({generatrix: first, proto: {inset, clr}, parent: this, project});
  }

  /**
   * Возвращает массив примыкающих ипостов
   */
  joined_imposts(check_only) {

    const {rays, generatrix, layer} = this;
    const tinner = [];
    const touter = [];

    // точки, в которых сходятся более 2 профилей
    const candidates = {b: [], e: []};

    const {Снаружи} = $p.enm.cnn_sides;
    const add_impost = (ip, curr, point) => {
      const res = {point: generatrix.getNearestPoint(point), profile: curr};
      if(this.cnn_side(curr, ip, rays) === Снаружи) {
        touter.push(res);
      }
      else {
        tinner.push(res);
      }
    };

    if(layer.profiles.some((curr) => {
      if(curr != this) {
        for(const pname of ['b', 'e']) {
          const cpoint = curr.rays[pname];
          if(cpoint.profile == this && cpoint.cnn) {
            if(!cpoint.profile_point) {
              if(check_only) {
                return true;
              }
              add_impost(curr.corns(1), curr, cpoint.point);
            }
            else {
              candidates[pname].push(curr.corns(1));
            }
          }
        }
      }
    })) {
      return true;
    }

    // если в точке примыкает более 1 профиля...
    ['b', 'e'].forEach((node) => {
      if(candidates[node].length > 1) {
        candidates[node].some((ip) => {
          if(ip && this.cnn_side(null, ip, rays) === Снаружи) {
            //this.cnn_point(node).is_cut = true;
            this.rays[node].is_cut = true;
            return true;
          }
        });
      }
    });

    return check_only ? false : {inner: tinner, outer: touter};

  }

  /**
   * Возвращает массив примыкающих створочных элементов
   */
  joined_nearests() {
    const res = [];

    this.layer.contours.forEach((contour) => {
      contour.profiles.forEach((profile) => {
        if(profile.nearest(true) === this) {
          res.push(profile);
        }
      });
    });

    return res;
  }

  /**
   * Возвращает массив примыкающих заполнений и вложенных контуров
   * @param [glasses]
   * @return {[]}
   */
  joined_glasses(glasses) {
    if(!glasses) {
      glasses = this.layer.glasses();
    }
    const res = [];
    for(const glass of glasses) {
      const is_layer = glass instanceof Contour;
      if(glass.profiles.some((profile) => is_layer ? profile === this || this.is_nearest(profile) : profile.profile === this)) {
        res.push(glass);
      }
    }
    return res;
  }

  /**
   * ### Соединение конца профиля
   * С этой функции начинается пересчет и перерисовка профиля
   * Возвращает объект соединения конца профиля
   * - Попутно проверяет корректность соединения. Если соединение не корректно, сбрасывает его в пустое значение и обновляет ограничитель типов доступных для узла соединений
   * - Попутно устанавливает признак `is_cut`, если в точке сходятся больше двух профилей
   * - Не делает подмену соединения, хотя могла бы
   * - Не делает подмену вставки, хотя могла бы
   *
   * @method cnn_point
   * @param node {String} - имя узла профиля: "b" или "e"
   * @param [point] {paper.Point} - координаты точки, в окрестности которой искать
   * @return {CnnPoint} - объект {point, profile, cnn_types}
   */
  cnn_point(node, point) {
    const {project, parent, rays} = this;
    const res = rays[node];
    const {cnn, profile, profile_point} = res;

    if(!point) {
      point = this[node];
    }

    // Если привязка не нарушена, возвращаем предыдущее значение
    let ok;
    if(profile?.children.length) {
      if(!project.has_changes()) {
        ok = true;
      }
      else if(this.check_distance(profile, res, point, true) === false || res.distance < consts.epsilon) {
        ok = true;
      }
    }

    // TODO вместо полного перебора профилей контура, реализовать анализ текущего соединения и успокоиться, если соединение корректно
    if(!ok) {
      res.clear();
      if(parent) {
        const ares = [];

        for(const profile of parent.profiles) {
          if(this.check_distance(profile, res, point, false) === false || (res.distance < ((res.is_t || !res.is_l) ? consts.sticking : consts.sticking_l))) {
            ares.push({
              profile_point: res.profile_point,
              profile: profile,
              cnn_types: res.cnn_types,
              point: res.point
            });
            res.clear();
          }
        }

        if(ares.length === 1) {
          res._mixin(ares[0]);
        }
        // если в точке сходятся 3 и более профиля, ищем тот, который смотрит на нас под максимально прямым углом
        else if(ares.length >= 2) {
          if(this.max_right_angle(ares)) {
            res._mixin(ares[0]);
            // если установленное ранее соединение проходит по типу, нового не ищем
            if(cnn && res.cnn_types && res.cnn_types.includes(cnn.cnn_type)) {
              res.cnn = cnn;
            }
          }
          // и среди соединений нет углового диагонального, вероятно, мы находимся в разрыве - выбираем соединение с пустотой
          else {
            res.clear();
          }
          res.is_cut = true;
        }
      }
    }

    return res;
  }

  /**
   * тот, к кому примыкает импост
   * @return {BuilderElement}
   */
  t_parent(be) {
    if(this.elm_type != $p.enm.elm_types.Импост) {
      return this;
    }
    const {_rays} = this._attr;
    if(be === 'b') {
      return _rays && _rays.b.profile;
    }
    if(be === 'e') {
      return _rays && _rays.e.profile;
    }
    return _rays && (_rays.b.profile || _rays.e.profile);
  }

  /**
   * Пересчитывает путь элемента, если изменились параметры, влияющие на основной материал вставки
   * @param param {CchProperties}
   */
  refresh_inset_depends(param, with_neighbor) {
    const {inset, _attr: {_rays, _nearest_cnn}} = this;
    if(_rays && (inset.is_depend_of(param) || _nearest_cnn?.is_depend_of?.(param))) {
      _rays.clear(with_neighbor ? 'with_neighbor' : true);
    }
  }

  /**
   * Возвращает виртуальный профиль ряда, вставка и соединения которого, заданы в отдельных свойствах
   * DataObj, транслирующий свойства допвставки через свойства элемента
   * @param num {Number}
   * @return {Profile}
   */
  region(num) {
    const {_attr, rays, layer: {_ox}, elm} = this;
    const {cat: {cnns, inserts}, utils} = $p;

    // параметры выбора для ряда
    function cnn_choice_links(elm1, o, cnn_point) {
      const nom_cnns = cnns.nom_cnn(elm1, cnn_point.profile, cnn_point.cnn_types, false, undefined, cnn_point);
      return nom_cnns.some((cnn) => {
        return o.ref == cnn;
      });
    }

    // возаращает строку соединяемых элементов для ряда
    function cn_row(prop, add) {
      let node1 = prop === 'cnn1' ? 'b' : (prop === 'cnn2' ? 'e' : '');
      const cnn_point = rays[node1] || {};
      const {profile, profile_point} = cnn_point;
      node1 += num;
      const node2 = profile_point ? (profile_point + num) : `t${num}`;
      const elm2 = profile ? profile.elm : 0;
      let row = _ox.cnn_elmnts.find({elm1: elm, elm2, node1, node2});
      if(!row && add) {
        row = _ox.cnn_elmnts.add({elm1: elm, elm2, node1, node2});
      }
      return add === 0 ? {row, cnn_point} : row;
    }

    if(!_attr._ranges) {
      _attr._ranges = new Map();
    }
    if(!_attr._ranges.get(num)) {
      _attr._ranges.set(num, new Proxy(this, {
        get(target, prop, receiver) {
          switch (prop){
          case 'cnn1':
          case 'cnn2':
          case 'cnn3':
            if(!_attr._ranges.get(`cnns${num}`)) {
              _attr._ranges.set(`cnns${num}`, {});
            }
            const cn = _attr._ranges.get(`cnns${num}`);
            if(!cn[prop]) {
              const row = cn_row(prop);
              cn[prop] = row ? row.cnn : cnns.get();
            }
            return cn[prop];

          case 'cnn1_row':
          case 'cnn2_row':
          case 'cnn3_row':
            return cn_row(prop.substr(0, 4), 0);

          case 'rnum':
            return num;

          case 'irow':
            return _ox.inserts.find({cnstr: -elm, region: num});

          case 'inset':
            const {irow} = receiver;
            return irow ? irow.inset : inserts.get();

          case 'nom':
            return receiver.inset.nom(receiver);

          case 'ref':
            const {nom} = receiver;
            return nom && !nom.empty() ? nom.ref : receiver.inset.ref;

          case '_metadata':
            const meta = target.__metadata(false);
            const {fields} = meta;
            const {cnn1, cnn2} = fields;
            const {b, e} = rays;
            delete cnn1.choice_links;
            delete cnn2.choice_links;
            cnn1.list = cnns.nom_cnn(receiver, b.profile, b.cnn_types, false, undefined, b);
            cnn2.list = cnns.nom_cnn(receiver, e.profile, e.cnn_types, false, undefined, e);
            return meta;

          case 'parent_elm':
            return target;

          default:
            let prow;
            if(utils.is_guid(prop)) {
              prow = _ox.params.find({param: prop, cnstr: -elm, region: num});
            }
            return prow ? prow.value : target[prop];
          }
        },

        set(target, prop, val, receiver) {
          switch (prop){
          case 'cnn1':
          case 'cnn2':
          case 'cnn3':
            const cn = _attr._ranges.get(`cnns${num}`);
            cn[prop] = cnns.get(val);
            const row = cn_row(prop, true);
            if(row.cnn !== cn[prop]) {
              row.cnn = cn[prop];
            }
            break;

          default:
            if(utils.is_guid(prop)) {
              const prow = _ox.params.find({param: prop, cnstr: -elm, region: num}) || _ox.params.add({param: prop, cnstr: -elm, region: num});
              prow.value = val;
            }
            else {
              target[prop] = val;
            }
          }
          target.project.register_change(true, ({_scope}) => _scope.eve.emit_async('region_change', receiver, prop));
          return true;
        },
      }));
    }
    return _attr._ranges.get(num);
  }
}

EditorInvisible.Profile = Profile;


/**
 * Виртуальный профиль для вложенных изделий (не путать с виртуальными слоями)
 *
 * @module profile_nested
 *
 * Created by Evgeniy Malyarov on 21.04.2020.
 */

class ProfileNested extends Profile {

  constructor(attr) {
    const from_editor = !attr.row && attr._nearest;
    if(from_editor) {
      attr.row = attr._nearest.ox.coordinates.add({parent: attr._nearest.elm});
    }
    super(attr);
    if(from_editor) {
      // при добавлении из рисовалки, ProfileParent подчиненного изделия, создаём сразу
      const {coordinates} = this.layer._ox;
      const prow = coordinates.add({cnstr: 1, elm: attr.row.parent});
    }
    const nearest = attr._nearest || attr.parent.layer.getItem({elm: attr.row.parent});
    Object.defineProperties(this._attr, {
      _nearest: {
        get() {return nearest;},
        set(v) {}
      },
      _nearest_cnn: {
        get() {return ProfileNested.nearest_cnn;},
        set(v) {}
      }
    });
    this.path.strokeColor = 'darkgreen';
    this.path.dashArray = [8, 4, 2, 4];
  }

  // ведущий элемент получаем в лоб
  nearest() {
    return this._attr._nearest;
  }

  // пересчет вставок и соединений не делаем
  default_inset(all) {

  }

  /**
   * Возвращает тип элемента (Вложение)
   */
  get elm_type() {
    return $p.enm.elm_types.attachment;
  }

  // вставка - внешний профиль
  get inset() {
    return this.nearest().inset;
  }
  set inset(v) {}

  // цвет внешнего элемента
  get clr() {
    return this.nearest(true).clr;
  }
  set clr(v) {}

  get sizeb() {
    return 0;
  }

  /**
   * Запрещаем редактировать элемент из интерфейса
   * @return {boolean}
   */
  get locked() {
    return true;
  }

  /**
   * Элемент не делает вклада в спецификацию
   * @returns {boolean}
   */
  get virtual() {
    return true;
  }

  get info() {
    return `влож ${super.info}`;
  }

  cnn_point(node, point) {
    return ProfileParent.prototype.cnn_point.call(this, node, point);
  }

  path_points(cnn_point, profile_point) {

    const {_attr: {_corns}, generatrix, layer: {bounds}} = this;
    if(!generatrix.curves.length) {
      return cnn_point;
    }
    const {rays} = this.nearest();
    const prays = cnn_point.profile.nearest().rays;

    // ищет точку пересечения открытых путей
    // если указан индекс, заполняет точку в массиве _corns. иначе - возвращает расстояние от узла до пересечения
    function intersect_point(path1, path2, index, ipoint = cnn_point.point) {
      const intersections = path1.getIntersections(path2);
      let delta = Infinity, tdelta, point, tpoint;

      if(intersections.length == 1) {
        if(index) {
          _corns[index] = intersections[0].point;
        }
        else {
          return intersections[0].point.getDistance(ipoint, true);
        }
      }
      else if(intersections.length > 1) {
        intersections.forEach((o) => {
          tdelta = o.point.getDistance(ipoint, true);
          if(tdelta < delta) {
            delta = tdelta;
            point = o.point;
          }
        });
        if(index) {
          _corns[index] = point;
        }
        else {
          return delta;
        }
      }
      return delta;
    }

    const pinner = prays.inner.getNearestPoint(bounds.center).getDistance(bounds.center, true) >
      prays.outer.getNearestPoint(bounds.center).getDistance(bounds.center, true) ? prays.inner : prays.outer;

    const inner = rays.inner.getNearestPoint(bounds.center).getDistance(bounds.center, true) >
    rays.outer.getNearestPoint(bounds.center).getDistance(bounds.center, true) ? rays.inner : rays.outer;

    const offset = -2;
    if(profile_point == 'b') {
      intersect_point(pinner.equidistant(offset), inner.equidistant(offset), 1);
      intersect_point(pinner, inner, 4);
    }
    else if(profile_point == 'e') {
      intersect_point(pinner.equidistant(offset), inner.equidistant(offset), 2);
      intersect_point(pinner, inner, 3);
    }

    return cnn_point;
  }

  save_coordinates() {
    super.save_coordinates();
    const {project: {bounds: pbounds}, layer: {content, lbounds}, _row, generatrix} = this;
    const {coordinates} = content._ox;
    const key = {cnstr: 1, elm: _row.parent};
    const prow = coordinates.find(key) || coordinates.add(key);
    ['nom','inset','clr','r','len','angle_hor','orientation','pos','elm_type','alp1','alp1'].forEach((name) => prow[name] = _row[name]);

    const path = generatrix.clone({insert: false});
    path.translate([-lbounds.x, -lbounds.y]);
    const {firstSegment: {point: b}, lastSegment: {point: e}} = path;
    prow.x1 = (b.x).round(1);
    prow.y1 = (lbounds.height - b.y).round(1);
    prow.x2 = (e.x).round(1);
    prow.y2 = (lbounds.height - e.y).round(1);
    prow.path_data = path.pathData;
  }

  redraw() {
    // получаем узлы
    const bcnn = this.cnn_point('b');
    const ecnn = this.cnn_point('e');
    const {rays} = this.nearest();
    const {path, generatrix} = this;

    // получаем соединения концов профиля и точки пересечения с соседями
    this.path_points(bcnn, 'b');
    this.path_points(ecnn, 'e');

    // очищаем существующий путь
    path.removeSegments();

    path.add(this.corns(1));

    // if(generatrix.is_linear()) {
      path.add(this.corns(2));
      path.add(this.corns(3));
    // }
    // else {
    //
    //   let tpath = new paper.Path({insert: false});
    //   let offset1 = rays.outer.getNearestLocation(this.corns(1)).offset;
    //   let offset2 = rays.outer.getNearestLocation(this.corns(2)).offset;
    //   let step = (offset2 - offset1) / 50;
    //
    //   for (let i = offset1 + step; i < offset2; i += step) {
    //     tpath.add(rays.outer.getPointAt(i));
    //   }
    //   tpath.simplify(0.8);
    //   path.join(tpath);
    //   path.add(this.corns(2));
    //   this.corns(6) && path.add(this.corns(6));
    //   path.add(this.corns(3));
    //
    //   tpath = new paper.Path({insert: false});
    //   offset1 = rays.inner.getNearestLocation(this.corns(3)).offset;
    //   offset2 = rays.inner.getNearestLocation(this.corns(4)).offset;
    //   step = (offset2 - offset1) / 50;
    //   for (let i = offset1 + step; i < offset2; i += step) {
    //     tpath.add(rays.inner.getPointAt(i));
    //   }
    //   tpath.simplify(0.8);
    //   path.join(tpath);
    //
    // }

    path.add(this.corns(4));
    path.closePath();
    path.reduce();

    return this;
  }
}

ProfileNested.nearest_cnn = {
  size(profile) {
    return profile.nearest().width;
  },
  empty() {
    return false;
  },
  get cnn_type() {
    return $p.enm.cnn_types.ii;
  },
  specification: [],
  selection_params: [],
  filtered_spec() {
    return [];
  },
}

EditorInvisible.ProfileNested = ProfileNested;


/**
 * Виртуальный профиль для виртуальных слоёв (не путать с вложенными изделиями)
 *
 * @module profile_virtual
 *
 * Created by Evgeniy Malyarov on 21.04.2020.
 */

class ProfileVirtual extends Profile {

  constructor(attr) {
    super(attr);
    const nearest = super.nearest(true);
    Object.defineProperties(this._attr, {
      _nearest: {
        get() {return nearest;},
        set(v) {}
      },
      _nearest_cnn: {
        get() {return ProfileNested.nearest_cnn;},
        set(v) {}
      }
    });
    this.path.strokeColor = 'darkgreen';
    this.path.dashArray = [8, 4, 2, 4];
  }

  // ведущий элемент получаем в лоб
  nearest() {
    return this._attr._nearest;
  }

  // пересчет вставок и соединений не делаем
  default_inset(all) {

  }

  refresh_inset_depends(param, with_neighbor) {
    const {inset, _attr: {_rays}} = this;
    if(_rays && inset.is_depend_of(param)) {
      _rays.clear(with_neighbor ? 'with_neighbor' : true);
    }
  }

  /**
   * Возвращает тип элемента (Створка, виртуальнвя)
   */
  get elm_type() {
    return $p.enm.elm_types.flap;
  }

  // вставка - внешний профиль
  get inset() {
    return this.nearest().inset;
  }
  set inset(v) {}

  get nom() {
    return this.nearest().nom;
  }

  // цвет внешнего элемента
  get clr() {
    return this.nearest().clr;
  }
  set clr(v) {}

  get sizeb() {
    return 0;
  }

  /**
   * Запрещаем редактировать элемент из интерфейса
   * @return {boolean}
   */
  get locked() {
    return true;
  }

  /**
   * Элемент не делает вклада в спецификацию
   * @returns {boolean}
   */
  get virtual() {
    return true;
  }

  get info() {
    return `вирт ${super.info}`;
  }

  cnn_point(node, point) {
    return ProfileParent.prototype.cnn_point.call(this, node, point);
  }

  path_points(cnn_point, profile_point) {

    const {_attr: {_corns}, generatrix, layer: {bounds}} = this;
    if(!generatrix.curves.length) {
      return cnn_point;
    }
    const {rays} = this.nearest();
    const prays = cnn_point.profile.nearest().rays;

    // ищет точку пересечения открытых путей
    // если указан индекс, заполняет точку в массиве _corns. иначе - возвращает расстояние от узла до пересечения
    function intersect_point(path1, path2, index, ipoint = cnn_point.point) {
      const intersections = path1.getIntersections(path2);
      let delta = Infinity, tdelta, point, tpoint;

      if(intersections.length == 1) {
        if(index) {
          _corns[index] = intersections[0].point;
        }
        else {
          return intersections[0].point.getDistance(ipoint, true);
        }
      }
      else if(intersections.length > 1) {
        intersections.forEach((o) => {
          tdelta = o.point.getDistance(ipoint, true);
          if(tdelta < delta) {
            delta = tdelta;
            point = o.point;
          }
        });
        if(index) {
          _corns[index] = point;
        }
        else {
          return delta;
        }
      }
      return delta;
    }

    const pinner = prays.inner.getNearestPoint(bounds.center).getDistance(bounds.center, true) >
      prays.outer.getNearestPoint(bounds.center).getDistance(bounds.center, true) ? prays.inner : prays.outer;

    const inner = rays.inner.getNearestPoint(bounds.center).getDistance(bounds.center, true) >
    rays.outer.getNearestPoint(bounds.center).getDistance(bounds.center, true) ? rays.inner : rays.outer;

    const offset = -2;
    if(profile_point == 'b') {
      intersect_point(pinner.equidistant(offset), inner.equidistant(offset), 1);
      intersect_point(pinner, inner, 4);
    }
    else if(profile_point == 'e') {
      intersect_point(pinner.equidistant(offset), inner.equidistant(offset), 2);
      intersect_point(pinner, inner, 3);
    }

    return cnn_point;
  }

  redraw() {
    // получаем узлы
    const bcnn = this.cnn_point('b');
    const ecnn = this.cnn_point('e');
    const {rays} = this.nearest();
    const {path, generatrix} = this;

    // получаем соединения концов профиля и точки пересечения с соседями
    this.path_points(bcnn, 'b');
    this.path_points(ecnn, 'e');

    // очищаем существующий путь
    path.removeSegments();

    path.add(this.corns(1));

    // if(generatrix.is_linear()) {
      path.add(this.corns(2));
      path.add(this.corns(3));
    // }
    // else {
    //
    //   let tpath = new paper.Path({insert: false});
    //   let offset1 = rays.outer.getNearestLocation(this.corns(1)).offset;
    //   let offset2 = rays.outer.getNearestLocation(this.corns(2)).offset;
    //   let step = (offset2 - offset1) / 50;
    //
    //   for (let i = offset1 + step; i < offset2; i += step) {
    //     tpath.add(rays.outer.getPointAt(i));
    //   }
    //   tpath.simplify(0.8);
    //   path.join(tpath);
    //   path.add(this.corns(2));
    //   this.corns(6) && path.add(this.corns(6));
    //   path.add(this.corns(3));
    //
    //   tpath = new paper.Path({insert: false});
    //   offset1 = rays.inner.getNearestLocation(this.corns(3)).offset;
    //   offset2 = rays.inner.getNearestLocation(this.corns(4)).offset;
    //   step = (offset2 - offset1) / 50;
    //   for (let i = offset1 + step; i < offset2; i += step) {
    //     tpath.add(rays.inner.getPointAt(i));
    //   }
    //   tpath.simplify(0.8);
    //   path.join(tpath);
    //
    // }

    path.add(this.corns(4));
    path.closePath();
    path.reduce();

    this.children.forEach((elm) => {
      if(elm instanceof ProfileAddl) {
        elm.redraw();
      }
    });

    return this;
  }
}

EditorInvisible.ProfileVirtual = ProfileVirtual;


/**
 * ### Опорная линия
 * Вспомогательная линия для привязки узлов и уравнивания
 *
 * - у линии есть координаты конца и начала
 * - есть путь образующей - прямая или кривая линия, такая же, как у {{#crossLink "Profile"}}{{/crossLink}}
 * - живут линии в слое соединителей изделия
 * - никаких соединений у линии нет
 *
 * @class Baseline
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @constructor
 * @extends GeneratrixElement
 * @menuorder 45
 * @tooltip Линия
 */
class BaseLine extends ProfileItem {

  constructor(attr) {
    super(attr);
    if(!attr.preserv_parent) {
      this.parent = this.project.l_connective;
    }
    Object.assign(this.generatrix, {
      strokeColor: 'brown',
      fillColor: new paper.Color(1, 0.1),
      strokeScaling: false,
      strokeWidth: 2,
      dashOffset: 4,
      dashArray: [4, 4],
    });
  }

  get d0() {
    return 0;
  }

  get d1() {
    return 0;
  }

  get d2() {
    return 0;
  }

  /**
   * Путь линии равен образующей
   * @return {paper.Path}
   */
  get path() {
    return this.generatrix;
  }
  set path(v) {
  }

  setSelection(selection) {
    paper.Item.prototype.setSelection.call(this, selection);
  }

  /**
   * Описание полей диалога свойств элемента
   */
  get oxml() {
    return BaseLine.oxml;
  }

  /**
   * Возвращает тип элемента (линия)
   */
  get elm_type() {
    return $p.enm.elm_types.Линия;
  }

  get length() {
    return this.generatrix.length;
  }

  /**
   * У линии не бывает ведущих элементов
   */
  nearest() {
    return null;
  }

  /**
   * Возвращает массив примыкающих рам
   */
  joined_nearests() {

    const res = [];

    this.project.contours.forEach((contour) => {
      contour.profiles.forEach((profile) => {
        if(profile.nearest(true) === this){
          res.push(profile);
        }
      });
    });

    return res;

  }

  /**
   * К линиям ипосты не крепятся
   */
  joined_imposts(check_only) {
    const tinner = [];
    const touter = [];
    return check_only ? false : {inner: tinner, outer: touter};
  }

  /**
   * Вычисляемые поля в таблице координат
   */
  save_coordinates() {

    if(!this._attr.generatrix){
      return;
    }

    const {_row} = this;

    _row.x1 = this.x1;
    _row.y1 = this.y1;
    _row.x2 = this.x2;
    _row.y2 = this.y2;
    _row.path_data = this.generatrix.pathData;
    _row.parent = 0;
    _row.len = this.length;
    _row.angle_hor = this.angle_hor;
    _row.elm_type = this.elm_type;
    _row.orientation = this.orientation;
  }

  cnn_point(node) {
    return this.rays[node];
  }

  /**
   * Для перерисовки линии, накаих вычислений не требуется
   */
  redraw() {

  }

}

BaseLine.oxml = {
  ' ': [
    {id: 'info', path: 'o.info', type: 'ro'},
  ],
  'Начало': ['x1', 'y1'],
  'Конец': ['x2', 'y2']
};

EditorInvisible.BaseLine = BaseLine;



/**
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * Created 16.05.2016
 *
 * @module geometry
 * @submodule profile_addl
 */


/**
 * ### Дополнительный профиль
 * Класс описывает поведение доборного и расширительного профилей
 *
 * - похож в поведении на сегмент створки, но расположен в том же слое, что и ведущий элемент
 * - у дополнительного профиля есть координаты конца и начала, такие же, как у Profile
 * - в случае внутреннего добора, могут быть Т - соединения, как у импоста
 * - в случае внешнего, концы соединяются с пустотой
 * - имеет одно ii примыкающее соединение
 * - есть путь образующей - прямая или кривая линия, такая же, как у створки
 * - длина дополнительного профиля может отличаться от длины ведущего элемента
 *
 * @class ProfileAddl
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @constructor
 * @extends ProfileItem
 * @menuorder 43
 * @tooltip Дополнительный профиль
 */
class ProfileAddl extends ProfileItem {

  constructor(attr) {

    const fromCoordinates = !!attr.row;

    super(attr);

    const {project, _attr, _row} = this;

    _attr.generatrix.strokeWidth = 0;

    if(!attr.side && _row.parent < 0) {
      attr.side = 'outer';
    }

    _attr.side = attr.side || 'inner';

    if(!_row.parent){
      _row.parent = this.parent.elm;
      if(this.outer){
        _row.parent = -_row.parent;
      }
    }

    // ищем и добавляем доборы к доборам
    if(fromCoordinates){
      const {cnstr, elm} = attr.row;
      project.ox.coordinates.find_rows({cnstr, parent: {in: [elm, -elm]}, elm_type: $p.enm.elm_types.Добор}, (row) => new ProfileAddl({row, parent: this}));
    }

  }

  /**
   * Расстояние от узла до опорной линии, для соединителей и раскладок == 0
   * @property d0
   * @type Number
   */
  get d0() {
    const nearest = this.nearest();
    return this._attr._nearest_cnn ? -this._attr._nearest_cnn.size(this, nearest) : 0;
  }

  /**
   * Возвращает истина, если соединение с наружной стороны
   */
  get outer() {
    return this._attr.side == 'outer';
  }

  /**
   * Возвращает тип элемента (Добор)
   */
  get elm_type() {
    return $p.enm.elm_types.Добор;
  }

  /**
   * Примыкающий внешний элемент
   * @property nearest
   * @type Profile
   */
  nearest() {
    const {_attr, parent, project} = this;
    const _nearest_cnn = _attr._nearest_cnn || project.elm_cnn(this, parent);
    _attr._nearest_cnn = $p.cat.cnns.elm_cnn(this, parent, $p.enm.cnn_types.acn.ii, _nearest_cnn, true);
    return parent;
  }

  /**
   * С этой функции начинается пересчет и перерисовка сегмента добора
   * Возвращает объект соединения конца профиля
   * - Попутно проверяет корректность соединения. Если соединение не корректно, сбрасывает его в пустое значение и обновляет ограничитель типов доступных для узла соединений
   * - Не делает подмену соединения, хотя могла бы
   * - Не делает подмену вставки, хотя могла бы
   *
   * @method cnn_point
   * @for ProfileAddl
   * @param node {String} - имя узла профиля: "b" или "e"
   * @param [point] {paper.Point} - координаты точки, в окрестности которой искать
   * @return {CnnPoint} - объект {point, profile, cnn_types}
   */
  cnn_point(node, point) {

    const res = this.rays[node];

    const check_distance = (elm, with_addl) => {

        if(elm == this || elm == this.parent){
          return;
        }

        const gp = elm.generatrix.getNearestPoint(point);
        let distance;

        if(gp && (distance = gp.getDistance(point)) < consts.sticking){
          if(distance <= res.distance){
            res.point = gp;
            res.distance = distance;
            res.profile = elm;
          }
        }

        if(with_addl){
          elm.getItems({class: ProfileAddl, parent: elm}).forEach((addl) => {
            check_distance(addl, with_addl);
          });
        }

      };

    if(!point){
      point = this[node];
    }

    // Если привязка не нарушена, возвращаем предыдущее значение
    if(res.profile && res.profile.children.length){
      check_distance(res.profile);
      if(res.distance < consts.sticking){
        return res;
      }
    }

    // TODO вместо полного перебора профилей контура, реализовать анализ текущего соединения и успокоиться, если соединение корректно
    res.clear();
    res.cnn_types = $p.enm.cnn_types.acn.t;

    this.layer.profiles.forEach((addl) => check_distance(addl, true));

    return res;
  }

  /**
   * Рассчитывает точки пути на пересечении текущего и указанного профилей
   * @method path_points
   * @param cnn_point {CnnPoint}
   */
  path_points(cnn_point, profile_point) {

    const {generatrix, rays} = this;
    const interior = generatrix.getPointAt(generatrix.length/2);

    const _profile = this;
    const _corns = this._attr._corns;

    if(!generatrix.curves.length){
      return cnn_point;
    }

    // ищет точку пересечения открытых путей
    // если указан индекс, заполняет точку в массиве _corns. иначе - возвращает расстояние от узла до пересечения
    function intersect_point(path1, path2, index){
      var intersections = path1.getIntersections(path2),
        delta = Infinity, tdelta, point, tpoint;

      if(intersections.length == 1)
        if(index)
          _corns[index] = intersections[0].point;
        else
          return intersections[0].point.getDistance(cnn_point.point, true);

      else if(intersections.length > 1){
        intersections.forEach((o) => {
          tdelta = o.point.getDistance(cnn_point.point, true);
          if(tdelta < delta){
            delta = tdelta;
            point = o.point;
          }
        });
        if(index)
          _corns[index] = point;
        else
          return delta;
      }
      return delta;
    }

    // если пересечение в узлах, используем лучи профиля
    const {profile} = cnn_point;
    if(profile){
      const prays = profile.rays;

      // добор всегда Т. сначала определяем, изнутри или снаружи находится наш профиль
      if(!profile.path.segments.length){
        profile.redraw();
      }

      if(profile_point == 'b') {
        // в зависимости от стороны соединения
        if(profile.cnn_side(this, interior, prays) == $p.enm.cnn_sides.outer) {
          intersect_point(prays.outer, rays.outer, 1);
          intersect_point(prays.outer, rays.inner, 4);
        }
        else {
          intersect_point(prays.inner, rays.outer, 1);
          intersect_point(prays.inner, rays.inner, 4);
        }
      }
      else if(profile_point == 'e') {
        // в зависимости от стороны соединения
        if(profile.cnn_side(this, interior, prays) == $p.enm.cnn_sides.outer) {
          intersect_point(prays.outer, rays.outer, 2);
          intersect_point(prays.outer, rays.inner, 3);
        }
        else {
          intersect_point(prays.inner, rays.outer, 2);
          intersect_point(prays.inner, rays.inner, 3);
        }
      }
    }

    // если точка не рассчиталась - рассчитываем по умолчанию - как с пустотой
    if(profile_point == 'b') {
      if(!_corns[1]) {
        _corns[1] = this.b.add(generatrix.firstCurve.getNormalAt(0, true).normalize(this.d1));
      }
      if(!_corns[4]) {
        _corns[4] = this.b.add(generatrix.firstCurve.getNormalAt(0, true).normalize(this.d2));
      }
    }
    else if(profile_point == 'e') {
      if(!_corns[2]) {
        _corns[2] = this.e.add(generatrix.lastCurve.getNormalAt(1, true).normalize(this.d1));
      }
      if(!_corns[3]) {
        _corns[3] = this.e.add(generatrix.lastCurve.getNormalAt(1, true).normalize(this.d2));
      }
    }
    return cnn_point;
  }

  /**
   * Вспомогательная функция обсервера, выполняет привязку узлов добора
   */
  do_bind(p, bcnn, ecnn, moved) {

    let imposts, moved_fact;

    const bind_node = (node, cnn) => {

      if(!cnn.profile) {
        return;
      }

      const gen = this.outer ? this.parent.rays.outer : this.parent.rays.inner;
      const mpoint = cnn.profile.generatrix.intersect_point(gen, cnn.point, 'nearest');
      if(!mpoint.is_nearest(this[node], 0)) {
        this[node] = mpoint;
        moved_fact = true;
      }

    };

    // при смещениях родителя, даигаем образующую
    if(this.parent == p) {
      bind_node('b', bcnn);
      bind_node('e', ecnn);
    }

    if(bcnn.cnn && bcnn.profile == p) {
      bind_node('b', bcnn);
    }
    if(ecnn.cnn && ecnn.profile == p) {
      bind_node('e', ecnn);
    }

  }

  glass_segment() {

  }

}

EditorInvisible.ProfileAddl = ProfileAddl;


/**
 * ### Соединительный профиль
 * Класс описывает поведение соединительного профиля
 *
 * - у соединительного профиля есть координаты конца и начала, такие же, как у Profile
 * - концы соединяются с пустотой
 * - имеет как минимум одно ii примыкающее соединение
 * - есть путь образующей - прямая или кривая линия, такая же, как у Profile
 * - слвиг и искривление пути передаются примыкающим профилям
 * - соединительный профиль живёт в слое одного из рамных контуров изделия, но может оказывать влияние на соединёные с ним контуры
 * - длина соединительного профиля может отличаться от длин профилей, к которым он примыкает
 *
 * @class ProfileConnective
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @constructor
 * @extends ProfileItem
 */
class ProfileConnective extends ProfileItem {

  /**
   * Расстояние от узла до опорной линии, для соединителей и раскладок == 0
   * @property d0
   * @type Number
   */
  get d0() {
    return 0;
  }

  /**
   * Возвращает тип элемента (соединитель)
   */
  get elm_type() {
    return $p.enm.elm_types.Соединитель;
  }

  /**
   * С этой функции начинается пересчет и перерисовка соединительного профиля
   * т.к. концы соединителя висят в пустоте и не связаны с другими профилями, возвращаем голый cnn_point
   *
   * @method cnn_point
   * @for ProfileConnective
   * @param node {String} - имя узла профиля: "b" или "e"
   * @return {CnnPoint} - объект {point, profile, cnn_types}
   */
  cnn_point(node) {
    return this.rays[node];
  }

  /**
   * ### Двигает узлы
   * Обрабатывает смещение выделенных сегментов образующей профиля
   *
   * @method move_points
   * @for ProfileItem
   * @param delta {paper.Point} - куда и насколько смещать
   * @param [all_points] {Boolean} - указывает двигать все сегменты пути, а не только выделенные
   * @param [start_point] {paper.Point} - откуда началось движение
   */
  move_points(delta, all_points, start_point) {

    super.move_points(delta, all_points, start_point);

    // двигаем примыкающие
    if(all_points !== false && !paper.Key.isDown('control')) {
      const moved = {profiles: []};
      for (const np of this.joined_nearests()) {
        np.do_bind(this, null, null, moved);
        // двигаем связанные с примыкающими
        for(const node of ['b', 'e']) {
          const cp = np.cnn_point(node);
          if(cp.profile) {
            cp.profile.do_bind(np, cp.profile.cnn_point('b'), cp.profile.cnn_point('e'), moved);
          }
        }
      }
    }

    this._attr._corns.length = 0;
    this.project.register_change();
  }

  /**
   * Возвращает массив примыкающих рам
   */
  joined_nearests() {

    const res = [];

    this.project.contours.forEach((contour) => {
      contour.profiles.forEach((profile) => {
        if(profile.nearest(true) === this){
          res.push(profile);
        }
      });
    });

    return res;

  }

  /**
   * К соединителям ипосты не крепятся
   */
  joined_imposts(check_only) {
    const tinner = [];
    const touter = [];
    return check_only ? false : {inner: tinner, outer: touter};
  }

  /**
   * Примыкающий внешний элемент - для соединителя всегда пусто
   * @property nearest
   */
  nearest() {
    return null;
  }

  /**
   * Вычисляемые поля в таблице координат
   * @method save_coordinates
   * @for ProfileConnective
   */
  save_coordinates() {

    if(!this._attr.generatrix){
      return;
    }

    const {_row, generatrix} = this;

    _row.x1 = this.x1;
    _row.y1 = this.y1;
    _row.x2 = this.x2;
    _row.y2 = this.y2;
    _row.nom = this.nom;
    _row.path_data = generatrix.pathData;
    _row.parent = 0;

    // добавляем припуски соединений
    _row.len = this.length.round(1);

    // получаем углы между элементами и к горизонту
    _row.angle_hor = this.angle_hor;

    _row.alp1 = Math.round((this.corns(4).subtract(this.corns(1)).angle - generatrix.getTangentAt(0).angle) * 10) / 10;
    if(_row.alp1 < 0){
      _row.alp1 = _row.alp1 + 360;
    }

    _row.alp2 = Math.round((generatrix.getTangentAt(generatrix.length).angle - this.corns(2).subtract(this.corns(3)).angle) * 10) / 10;
    if(_row.alp2 < 0){
      _row.alp2 = _row.alp2 + 360;
    }

    // устанавливаем тип элемента
    _row.elm_type = this.elm_type;

  }

  /**
   * ### Удаляет элемент из контура и иерархии проекта
   * Одновлеменно, инициирует обновление путей примыкающих элементов
   * @method remove
   */
  remove() {
    this.joined_nearests().forEach((rama) => {

      const {inner, outer} = rama.joined_imposts();
      for (const {profile} of inner.concat(outer)) {
        profile.rays.clear();
      }
      for (const {_attr, elm} of rama.joined_nearests()) {
        _attr._rays && _attr._rays.clear();
      }

      const {_attr, layer} = rama;
      _attr._rays && _attr._rays.clear();
      if(_attr._nearest){
        _attr._nearest = null;
      }
      if(_attr._nearest_cnn){
        _attr._nearest_cnn = null;
      }

      layer && layer.notify && layer.notify({profiles: [rama], points: []}, consts.move_points);

    });
    super.remove();
  }

}


/**
 * ### Служебный слой соединительных профилей
 * Унаследован от [paper.Layer](http://paperjs.org/reference/layer/)
 *
 * @class ConnectiveLayer
 * @extends paper.Layer
 * @constructor
 */
class ConnectiveLayer extends paper.Layer {

  constructor(attr) {
    super(attr);
    this._errors = new paper.Group({parent: this});
  }

  presentation() {
    return 'Соединители';
  }

  get info() {
    return this.presentation;
  }

  get skeleton() {
    return this.project._skeleton;
  }

  get cnstr() {
    return null;
  }

  get flipped() {
    return false;
  }
  set flipped(v) {
    return false;
  }

  get hidden() {
    return !this.visible;
  }
  set hidden(v) {
    this.visible = !v;
  }


  /**
   * Продукция слоя соединителей
   * Совпадает с продукцией проекта
   * @return {CatCharacteristics}
   */
  get _ox() {
    return this.project.ox;
  }

  /**
   * Система слоя соединителей
   * @return {CatProduction_params}
   */
  get sys() {
    return this.project._dp.sys;
  }

  redraw() {
    const {_errors, children} = this;
    children.forEach((elm) => elm !== _errors && elm.redraw());
    _errors.removeChildren();
    _errors.bringToFront();
  }

  save_coordinates() {
    return this.children.reduce((accumulator, elm) => {
      return elm?.save_coordinates ?  accumulator.then(() => elm.save_coordinates()) : accumulator;
    }, Promise.resolve());
  }

  /**
   * Заглушка
   */
  glasses() {
    return [];
  }

  /**
   * Заглушка
   */
  get contours() {
    return [];
  }

  /**
   * Заглушка
   */
  refresh_prm_links() {

  }

  get _manager() {
    return this.project._dp._manager;
  }

  _metadata(fld) {
    return Contour.prototype._metadata.call(this, fld);
  }


  /**
   * Возвращает массив профилей текущего слоя
   * @property profiles
   * @returns {Array.<ProfileItem>}
   */
  get profiles() {
    return this.children.filter((elm) => elm instanceof ProfileItem);
  }

  /**
   * Обработчик при изменении системы
   */
  on_sys_changed() {
    this.profiles.forEach((elm) => elm.default_inset(true));
  }

  /**
   * Возвращает значение параметра с учётом наследования
   */
  extract_pvalue({param, cnstr, elm, origin, prm_row}) {
    return param.extract_pvalue({ox: this._ox, cnstr, elm, origin, prm_row});
  }

  /**
   * Формирует оповещение для тех, кто следит за this._noti
   * @param obj
   */
  notify(obj, type = 'update') {
    //Contour.prototype.notify.call(this, obj, type);
  }
}

EditorInvisible.ProfileConnective = ProfileConnective;
EditorInvisible.ConnectiveLayer = ConnectiveLayer;


/**
 * Сечение фрагмена изделия
 *
 * Created by Evgeniy Malyarov on 28.08.2021.
 */


class ProfileCut extends BaseLine {

  constructor(attr) {
    super(attr);
    if(!attr.preserv_parent) {
      this.parent = this.project.l_connective;
    }
    Object.assign(this.generatrix, {
      strokeColor: 'grey',
      fillColor: '',
      strokeScaling: false,
      dashOffset: 0,
      dashArray: [],
    });

    // создаём детей
    const content = this.text_content();
    new PathUnselectable({parent: this, name: 'callout1', strokeColor: 'black', guide: true, strokeScaling: false});
    new PathUnselectable({parent: this, name: 'callout2', strokeColor: 'black', guide: true, strokeScaling: false});
    new PathUnselectable({parent: this, name: 'thick1', strokeColor: 'black', strokeScaling: false, strokeWidth: 5});
    new PathUnselectable({parent: this, name: 'thick2', strokeColor: 'black', strokeScaling: false, strokeWidth: 5});
    new TextUnselectable({
      parent: this,
      name: 'text1',
      //justification: 'center',
      fillColor: 'black',
      fontFamily: consts.font_family,
      fontSize: consts.font_size,
      content,
    });
    new TextUnselectable({
      parent: this,
      name: 'text2',
      //justification: 'center',
      fillColor: 'black',
      fontFamily: consts.font_family,
      fontSize: consts.font_size,
      content,
    });
  }

  /**
   * Возвращает тип элемента (сечение)
   */
  get elm_type() {
    return $p.enm.elm_types.Сечение;
  }

  setSelection(selection) {
    paper.Item.prototype.setSelection.call(this.generatrix, selection);
  }

  text_content() {
    const letters = ['A','B','C','D','E','F','G','H','I','J','K'];
    const {elm, layer: {_ox}, elm_type} = this;
    let index = 0;
    for(const row of _ox.coordinates) {
      if(row.elm_type !== elm_type) {
        continue;
      }
      if(row.elm === elm) {
        break;
      }
      index++;
    }
    return (index + 1) >= letters.length ? `X${elm}` : letters[index];
  }

  redraw() {
    const {children: {thick1, thick2, callout1, callout2, text1, text2}, generatrix, length} = this;
    const tlength = length > 200 ? 90 : (length/2 - 10);
    thick1.removeSegments();
    thick2.removeSegments();
    callout1.removeSegments();
    callout2.removeSegments();
    if(tlength > 0) {
      thick1.addSegments([generatrix.firstSegment.point, generatrix.getPointAt(tlength)]);
      thick2.addSegments([generatrix.getPointAt(length - tlength), generatrix.lastSegment.point]);
      const pt1 = thick1.getPointAt(tlength / 2);
      const pt2 = thick2.getPointAt(tlength / 2);
      const tnormal = thick1.getNormalAt(0);
      const ttangent = thick1.getTangentAt(0);
      text1.position = pt1.add(tnormal.multiply(tlength + 30));
      text2.position = pt2.add(tnormal.multiply(tlength + 30));

      const c1base = pt1.subtract(ttangent.multiply(20)).add(tnormal.multiply(20));
      callout1.moveTo(c1base.add(tnormal.multiply(60)));
      callout1.lineTo(c1base);
      callout1.lineTo(c1base.add(tnormal.multiply(24)).add(ttangent.multiply(6)));
      callout1.lineTo(c1base.add(tnormal.multiply(24)).subtract(ttangent.multiply(6)));
      callout1.lineTo(c1base);

      const c2base = pt2.add(ttangent.multiply(20)).add(tnormal.multiply(20));
      callout2.moveTo(c2base.add(tnormal.multiply(60)));
      callout2.lineTo(c2base);
      callout2.lineTo(c2base.add(tnormal.multiply(24)).add(ttangent.multiply(6)));
      callout2.lineTo(c2base.add(tnormal.multiply(24)).subtract(ttangent.multiply(6)));
      callout2.lineTo(c2base);
    }

  }

}

EditorInvisible.ProfileCut = ProfileCut;


/**
 *
 *
 * @module profile_connective_adjoining
 *
 * Created by Evgeniy Malyarov on 18.03.2021.
 */

/**
 * ### Виртуальный профиль примыкания
 * Класс описывает поведение внешнего примыкания к рамам изделия
 *
 * - у примыкания есть координаты конца и начала, такие же, как у Profile
 * - концы соединяются с пустотой
 * - имеет как минимум одно ii примыкающее соединение
 * - есть путь образующей - прямая или кривая линия, такая же, как у Profile
 * - слвиг и искривление пути передаются примыкающим профилям
 * - живёт в том же слое, что и рамные профили
 * - длина может отличаться от длин профилей, к которым он примыкает
 *
 * @class ProfileAdjoining
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @constructor
 * @extends ProfileConnectiveOuter
 */
class ProfileAdjoining extends BaseLine {

  constructor({row, parent, proto, b, e, side, project}) {
    const generatrix = b && e && parent.rays[side].get_subpath(e.elm[e.point], b.elm[b.point]);
    super({row, generatrix, parent, proto, preserv_parent: true, project});
    Object.assign(this.generatrix, {
      strokeColor: 'black',
      strokeOpacity: 0.7,
      strokeWidth: 10,
      dashArray: [],
      dashOffset: 0,
      strokeScaling: true,
    });
    Object.assign(this.path, {
      strokeColor: 'white',
      strokeOpacity: 1,
      strokeWidth: 0,
      fillColor: 'grey',
      opacity: 0.1,
    });
    this.selected_cnn_ii();
  }

  /**
   * Возвращает тип элемента (соединитель)
   */
  get elm_type() {
    return $p.enm.elm_types.Примыкание;
  }

  /**
   * Описание полей диалога свойств элемента
   */
  get oxml() {
    return ProfileAdjoining.oxml;
  }

  /**
   * Возвращает массив примыкающих рам
   */
  joined_nearests() {
    return [this.parent];
  }

  /**
   * У примыкания, внешний равен родителю
   */
  nearest() {
    return this.parent;
  }

  selected_cnn_ii() {
    const {parent, elm, ox, _attr} = this;
    const find = {elm1: parent.elm, elm2: elm, node1: '', node2: ''};
    const row = ox.cnn_elmnts.find(find) || ox.cnn_elmnts.add(find);
    if(!_attr._nearest_cnn || _attr._nearest_cnn.empty()) {
      if(row.cnn.empty()) {
        const {enm: {cnn_types}, cat: {cnns}} = $p;
        _attr._nearest_cnn = cnns.elm_cnn(parent, this, cnn_types.acn.ii, null, true);
      }
      else {
        _attr._nearest_cnn = row.cnn;
      }
    }
    if(row.cnn.empty() && _attr._nearest_cnn) {
      row.cnn = _attr._nearest_cnn;
    }
    return {elm: parent, row};
  }

  save_coordinates() {
    super.save_coordinates();
    const {_row, parent} = this;
    const {row} = this.selected_cnn_ii();
    _row.parent = parent.elm;
    row.aperture_len = this.generatrix.length.round(1);
  }

  setSelection(selection) {
    super.setSelection(selection);
    const {generatrix, path, children} = this;
    for(const child of children) {
      if(child !== generatrix && child !== path) {
        child.setSelection(0);
      }
    }
  }

  redraw(mode) {
    const {generatrix, path, children} = this;
    for(const child of [].concat(children)) {
      if(child !== generatrix && child !== path) {
        child.remove();
      }
    }
    const {length} = generatrix;
    for(let pos = 25; pos < length - 75; pos += 90) {
      const pt = generatrix.getPointAt(pos);
      const pn = generatrix.getNormalAt(pos).rotate(30).multiply(120);
      const ln = new paper.Path({
        segments: [pt, pt.add(pn)],
        strokeColor: 'black',
        strokeOpacity: 0.7,
        strokeWidth: 2,
        strokeScaling: true,
        guide: true,
        parent: this,
      });
    }
    if(mode !== 'compact') {
      let proto = generatrix.clone({insert: false}).equidistant(10);
      const outer = path.clone();
      //outer.parent = this;
      outer.addSegments(proto.segments)
      proto = proto.equidistant(80);
      proto.reverse();
      outer.addSegments(proto.segments);
      outer.closePath();
    }
  }
}

ProfileAdjoining.oxml = {
  ' ': [
    {id: 'info', path: 'o.info', type: 'ro'},
    'inset',
    //'clr',
  ],
  Начало: ['x1', 'y1'],
  Конец: ['x2', 'y2'],
  Соединение: ['cnn3'],
};

EditorInvisible.ProfileAdjoining = ProfileAdjoining;


/**
 *
 *
 * @module profile_nested_content
 *
 * Created by Evgeniy Malyarov on 24.12.2020.
 */

class ProfileNestedContent extends Profile {

  constructor(attr) {


    const {row, parent, generatrix, proto, _nearest} = attr;
    if(generatrix && proto) {
      super(attr);
      this._attr._nearest = _nearest;
    }
    else {
      const {layer, project: {bounds: pbounds}} = parent;
      const {profiles, bounds: lbounds} = layer;

      const x = lbounds.x + pbounds.x;
      const y = lbounds.y + pbounds.y;

      if(row.path_data) {
        const path = new paper.Path({pathData: row.path_data, insert: false});
        path.translate([x, y]);
        row.path_data = path.pathData;
      }
      else {
        row.x1 += x;
        row.x2 += x;
        row.y1 -= y;
        row.y2 -= y;
      }

      let pelm;
      if(row.elm_type != 'Импост') {
        const h = pbounds.height + pbounds.y;
        const dir = new paper.Point(row.x2, h - row.y2).subtract(new paper.Point(row.x1, h - row.y1));
        for(const elm of profiles) {
          const {b, e, _row} = elm;
          const pdir = e.subtract(b);
          if(Math.abs(pdir.angle - dir.angle) < 0.1) {
            pelm = elm;
            break;
          }
        }
      }

      super(attr);
      this._attr._nearest = pelm;
    }
  }


  move_points(delta, all_points, start_point) {
    if(delta && delta._dimln) {
      return super.move_points(delta, all_points, start_point);
    }
  }

  save_coordinates() {
    super.save_coordinates();
    const {layer: {layer: {lbounds}}, _row, generatrix} = this;

    const path = generatrix.clone({insert: false});
    path.translate([-lbounds.x, -lbounds.y]);
    const {firstSegment: {point: b}, lastSegment: {point: e}} = path;
    _row.x1 = (b.x).round(1);
    _row.y1 = (lbounds.height - b.y).round(1);
    _row.x2 = (e.x).round(1);
    _row.y2 = (lbounds.height - e.y).round(1);
    _row.path_data = path.pathData;
  }

  selected_cnn_ii() {
    const {elm, ox} = this;
    const nelm = this.nearest();
    const {parent} = nelm._row;

    for(const row of ox.cnn_elmnts) {
      if(row.node1 || row.node2) {
        continue;
      }
      if((row.elm1 == elm && row.elm2 == parent) || (row.elm1 == parent && row.elm2 == elm)) {
        if(row.cnn.empty()) {
          const {enm: {cnn_types}, cat: {cnns}} = $p;
          row.cnn = cnns.elm_cnn(this, nelm, cnn_types.acn.ii, null, true);
        }
        return {elm: nelm, row};
      }
    }
  }

}

EditorInvisible.ProfileNestedContent = ProfileNestedContent;


/**
 * ### Раскладка
 * Класс описывает поведение элемента раскладки
 *
 * - у раскладки есть координаты конца и начала
 * - есть путь образующей - прямая или кривая линия, такая же, как у {{#crossLink "Profile"}}{{/crossLink}}
 * - владелец типа {{#crossLink "Filling"}}{{/crossLink}}
 * - концы могут соединяться не только с пустотой или другими раскладками, но и с рёбрами заполнения
 *
 * @class Onlay
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @constructor
 * @extends ProfileItem
 * @menuorder 44
 * @tooltip Раскладка
 */
class Onlay extends ProfileItem {

  constructor(attr) {
    super(attr);
    // Подключаем наблюдателя за событиями контура с именем _consts.move_points_
    if(this.parent) {
      const {project: {_scope}, observer} = this;
      this.observer = observer.bind(this);
      _scope.eve.on(consts.move_points, this.observer);
    }
    if(attr.region) {
      this.region = attr.region;
    }
  }

  /**
   * Расстояние от узла до опорной линии, для соединителей и раскладок == 0
   * @property d0
   * @type Number
   */
  get d0() {
    return 0;
  }

  /**
   * Возвращает тип элемента (раскладка)
   */
  get elm_type() {
    return $p.enm.elm_types.Раскладка;
  }

  /**
   * Слой раскладки в стеклопакете
   * @return {EnmLay_regions}
   */
  get region() {
    const {_row, parent} = this;
    let region = _row && _row.region;
    return region && !region.empty() ? region : $p.enm.lay_regions.r2;
  }

  set region(v) {
    this.set_region(v);
  }

  set_region(v, ignore_select) {
    if(!ignore_select) {
      const {selectedItems} = this.project;
      if(selectedItems.length > 1) {
        selectedItems.forEach((elm) => {
          if(elm instanceof Onlay && elm != this) {
            elm.set_region(v, true);
          }
        });
      }
    }
    const {_row} = this;
    if(_row && _row.region !== v) {
      _row.region = v;
    }
  }

  /**
   * У раскладки не бывает ведущих элементов
   */
  nearest() {

  }

  /**
   * Возвращает массив примыкающих ипостов
   */
  joined_imposts(check_only) {

    const {rays, generatrix, parent} = this;
    const tinner = [];
    const touter = [];

    // точки, в которых сходятся более 2 профилей
    const candidates = {b: [], e: []};

    const add_impost = (ip, curr, point) => {
      const res = {point: generatrix.getNearestPoint(point), profile: curr};
      if(this.cnn_side(curr, ip, rays) === $p.enm.cnn_sides.outer) {
        touter.push(res);
      }
      else {
        tinner.push(res);
      }
    };

    if(parent.imposts.some((curr) => {
        if(curr != this) {
          for(const pn of ['b', 'e']) {
            const p = curr.cnn_point(pn);
            if(p.profile == this && p.cnn) {

              if(p.cnn.cnn_type == $p.enm.cnn_types.t) {
                if(check_only) {
                  return true;
                }
                add_impost(curr.corns(1), curr, p.point);
              }
              else {
                candidates[pn].push(curr.corns(1));
              }
            }
          }
        }
      })) {
      return true;
    }

    // если в точке примыкает более 1 профиля...
    ['b', 'e'].forEach((node) => {
      if(candidates[node].length > 1) {
        candidates[node].some((ip) => {
          if(ip && this.cnn_side(null, ip, rays) == $p.enm.cnn_sides.outer) {
            this.cnn_point(node).is_cut = true;
            return true;
          }
        });
      }
    });

    return check_only ? false : {inner: tinner, outer: touter};

  }

  /**
   * Вычисляемые поля в таблице координат
   * @method save_coordinates
   * @for Onlay
   */
  save_coordinates() {

    if(!this._attr.generatrix){
      return;
    }

    const {_row, rays, generatrix, ox} = this;
    const cnns = ox.cnn_elmnts;
    const {b, e} = rays;
    const row_b = cnns.add({
      elm1: _row.elm,
      node1: 'b',
      cnn: b.cnn ? b.cnn.ref : '',
      aperture_len: this.corns(1).getDistance(this.corns(4))
    });
    const row_e = cnns.add({
      elm1: _row.elm,
      node1: 'e',
      cnn: e.cnn ? e.cnn.ref : '',
      aperture_len: this.corns(2).getDistance(this.corns(3))
    });

    _row.x1 = this.x1;
    _row.y1 = this.y1;
    _row.x2 = this.x2;
    _row.y2 = this.y2;
    _row.path_data = generatrix.pathData;
    _row.nom = this.nom;
    _row.parent = this.parent.elm;


    // добавляем припуски соединений
    _row.len = this.length;

    // сохраняем информацию о соединениях
    if(b.profile) {
      row_b.elm2 = b.profile.elm;
      if(b.profile instanceof Filling) {
        row_b.node2 = 't';
      }
      else if(b.profile.e.is_nearest(b.point)) {
        row_b.node2 = 'e';
      }
      else if(b.profile.b.is_nearest(b.point)) {
        row_b.node2 = 'b';
      }
      else {
        row_b.node2 = 't';
      }
    }
    if(e.profile) {
      row_e.elm2 = e.profile.elm;
      if(e.profile instanceof Filling) {
        row_e.node2 = 't';
      }
      else if(e.profile.b.is_nearest(e.point)) {
        row_e.node2 = 'b';
      }
      else if(e.profile.e.is_nearest(e.point)) {
        row_e.node2 = 'e';
      }
      else {
        row_e.node2 = 't';
      }
    }

    // получаем углы между элементами и к горизонту
    _row.angle_hor = this.angle_hor;

    _row.alp1 = Math.round((this.corns(4).subtract(this.corns(1)).angle - generatrix.getTangentAt(0).angle) * 10) / 10;
    if(_row.alp1 < 0)
      _row.alp1 = _row.alp1 + 360;

    _row.alp2 = Math.round((generatrix.getTangentAt(generatrix.length).angle - this.corns(2).subtract(this.corns(3)).angle) * 10) / 10;
    if(_row.alp2 < 0)
      _row.alp2 = _row.alp2 + 360;

    // устанавливаем тип элемента
    _row.elm_type = this.elm_type;
  }

  /**
   * С этой функции начинается пересчет и перерисовка сегмента раскладки
   * Возвращает объект соединения конца профиля
   * - Попутно проверяет корректность соединения. Если соединение не корректно, сбрасывает его в пустое значение и обновляет ограничитель типов доступных для узла соединений
   * - Не делает подмену соединения, хотя могла бы
   * - Не делает подмену вставки, хотя могла бы
   *
   * @method cnn_point
   * @for Onlay
   * @param node {String} - имя узла профиля: "b" или "e"
   * @param [point] {paper.Point} - координаты точки, в окрестности которой искать
   * @return {CnnPoint} - объект {point, profile, cnn_types}
   */
  cnn_point(node, point) {

    const res = this.rays[node];

    if(!point){
      point = this[node];
    }

    // Если привязка не нарушена, возвращаем предыдущее значение
    if(res.profile && res.profile.children.length){

      if(res.profile instanceof Filling){
        const np = res.profile.path.getNearestPoint(point);
        if(np.getDistance(point) < consts.sticking_l){
          res.point = np;
          return res;
        }
      }
      else{
        if(this.check_distance(res.profile, res, point, true) === false || res.distance < consts.epsilon){
          return res;
        }
      }
    }

    // TODO вместо полного перебора профилей контура, реализовать анализ текущего соединения и успокоиться, если соединение корректно
    res.clear();
    if(this.parent){
      const res_bind = this.bind_node(point);
      if(res_bind.binded){
        res._mixin(res_bind, ["point","profile","cnn_types","profile_point"]);
        if(!this[res.node].is_nearest(res.point, 0)) {
          this[res.node] = res.point;
        }
      }
    }
    return res;
  }

  /**
   * Пытается привязать точку к рёбрам и раскладкам
   * @param point {paper.Point}
   * @param glasses {Array.<Filling>}
   * @return {Object}
   */
  bind_node(point, glasses) {

    if(!glasses){
      glasses = [this.parent];
    }

    let res = {distance: Infinity, is_l: true};

    // сначала, к образующим заполнений
    glasses.some((glass) => {
      const np = glass.path.getNearestPoint(point);
      let distance = np.getDistance(point);

      if(distance < res.distance){
        res.distance = distance;
        res.point = np;
        res.profile = glass;
        res.cnn_types = $p.enm.cnn_types.acn.t;
      }

      if(distance < consts.sticking_l){
        res.binded = true;
        return true;
      }

      // затем, если не привязалось - к сегментам раскладок текущего заполнения
      res.cnn_types = $p.enm.cnn_types.acn.t;
      const ares = [];
      for(let elm of glass.imposts){
        if (elm !== this && elm.project.check_distance(elm, null, res, point, "node_generatrix") === false ){
          ares.push({
            profile_point: res.profile_point,
            profile: res.profile,
            cnn_types: res.cnn_types,
            point: res.point});
        }
      }

      if(ares.length == 1){
        res._mixin(ares[0]);
      }
      // если в точке сходятся 3 и более профиля, ищем тот, который смотрит на нас под максимально прямым углом
      else if(ares.length >= 2){
        if(this.max_right_angle(ares)){
          res._mixin(ares[0]);
        }
        res.is_cut = true;
      }

    });

    if(!res.binded && res.point && res.distance < consts.sticking){
      res.binded = true;
    }

    return res;
  }

  move_nodes(from, to) {
    for(let elm of this.parent.imposts){
      if(elm == this){
        continue;
      }
      if(elm.b.is_nearest(from)){
        elm.b = to;
      }
      if(elm.e.is_nearest(from)){
        elm.e = to;
      }
    }
  }

}

EditorInvisible.Onlay = Onlay;



/**
 * Виртуальный родительский профиль для вложенных слоёв
 *
 * @module profile_parent
 *
 * Created by Evgeniy Malyarov on 21.04.2020.
 */

class ProfileParent extends Profile {

  constructor(attr) {
    const {parent: {leading_product}, row} = attr;
    super(attr);
  }

  // пересчет вставок и соединений не делаем
  default_inset(all) {

  }

  /**
   * Возвращает тип элемента (Вложение)
   */
  get elm_type() {
    return $p.enm.elm_types.Вложение;
  }

  // вставка - внешний профиль
  set_inset(v) {

  }

  // цвет внешнего элемента
  set_clr(v) {

  }

  /**
   * Запрещаем редактировать элемент из интерфейса
   * @return {boolean}
   */
  get locked() {
    return true;
  }

  /**
   * Элемент не делает вклада в спецификацию
   * @returns {boolean}
   */
  get virtual() {
    return true;
  }

  // характеристика, из которой брать значения параметров
  get prm_ox() {
    return this.ox.leading_product;
  }

  cnn_point(node, point) {
    const {project, parent, rays} = this;
    const res = rays[node];
    if(!res.profile) {
      if(!point) {
        point = this[node];
      }
      const pp = node === 'b' ? 'e' : 'b';
      for(const profile of parent.profiles) {
        if(profile !== this && profile[pp].is_nearest(point, true)) {
          res.profile = profile;
          res.profile_point = pp;
          res.point = point;
          res.cnn_types = $p.enm.cnn_types.acn.a;
          break;
        }
      }
    }
    if(!res.cnn) {
      res.cnn = $p.cat.cnns.elm_cnn(this, res.profile, res.cnn_types);
    }
    return res;
  }

  path_points(cnn_point, profile_point) {

    const {_attr: {_corns}, generatrix, layer: {bounds}} = this;
    if(!generatrix.curves.length) {
      return cnn_point;
    }
    const {rays} = this;
    const prays = cnn_point.profile.rays;

    // ищет точку пересечения открытых путей
    // если указан индекс, заполняет точку в массиве _corns. иначе - возвращает расстояние от узла до пересечения
    function intersect_point(path1, path2, index, ipoint = cnn_point.point) {
      const intersections = path1.getIntersections(path2);
      let delta = Infinity, tdelta, point, tpoint;

      if(intersections.length == 1) {
        if(index) {
          _corns[index] = intersections[0].point;
        }
        else {
          return intersections[0].point.getDistance(ipoint, true);
        }
      }
      else if(intersections.length > 1) {
        intersections.forEach((o) => {
          tdelta = o.point.getDistance(ipoint, true);
          if(tdelta < delta) {
            delta = tdelta;
            point = o.point;
          }
        });
        if(index) {
          _corns[index] = point;
        }
        else {
          return delta;
        }
      }
      return delta;
    }

    const pinner = prays.inner.getNearestPoint(bounds.center).getDistance(bounds.center, true) >
      prays.outer.getNearestPoint(bounds.center).getDistance(bounds.center, true) ? prays.inner : prays.outer;

    const inner = rays.inner.getNearestPoint(bounds.center).getDistance(bounds.center, true) >
    rays.outer.getNearestPoint(bounds.center).getDistance(bounds.center, true) ? rays.inner : rays.outer;

    const offset = -2;
    if(profile_point == 'b') {
      intersect_point(pinner.equidistant(offset), inner.equidistant(offset), 1);
      intersect_point(pinner, inner, 4);
    }
    else if(profile_point == 'e') {
      intersect_point(pinner.equidistant(offset), inner.equidistant(offset), 2);
      intersect_point(pinner, inner, 3);
    }

    return cnn_point;
  }

  redraw() {
    // получаем узлы
    const bcnn = this.cnn_point('b');
    const ecnn = this.cnn_point('e');
    const {path, generatrix} = this;

    // получаем соединения концов профиля и точки пересечения с соседями
    this.path_points(bcnn, 'b');
    this.path_points(ecnn, 'e');

    // очищаем существующий путь
    path.removeSegments();

    path.add(this.corns(1));

    // if(generatrix.is_linear()) {
      path.add(this.corns(2));
      path.add(this.corns(3));
    // }
    // else {
    //
    //   let tpath = new paper.Path({insert: false});
    //   let offset1 = rays.outer.getNearestLocation(this.corns(1)).offset;
    //   let offset2 = rays.outer.getNearestLocation(this.corns(2)).offset;
    //   let step = (offset2 - offset1) / 50;
    //
    //   for (let i = offset1 + step; i < offset2; i += step) {
    //     tpath.add(rays.outer.getPointAt(i));
    //   }
    //   tpath.simplify(0.8);
    //   path.join(tpath);
    //   path.add(this.corns(2));
    //   this.corns(6) && path.add(this.corns(6));
    //   path.add(this.corns(3));
    //
    //   tpath = new paper.Path({insert: false});
    //   offset1 = rays.inner.getNearestLocation(this.corns(3)).offset;
    //   offset2 = rays.inner.getNearestLocation(this.corns(4)).offset;
    //   step = (offset2 - offset1) / 50;
    //   for (let i = offset1 + step; i < offset2; i += step) {
    //     tpath.add(rays.inner.getPointAt(i));
    //   }
    //   tpath.simplify(0.8);
    //   path.join(tpath);
    //
    // }

    path.add(this.corns(4));
    path.closePath();
    path.reduce();

    return this;
  }
}

EditorInvisible.ProfileParent = ProfileParent;


/**
 * ### Изделие
 * - Расширение [paper.Project](http://paperjs.org/reference/project/)
 * - Стандартные слои (layers) - это контуры изделия, в них живут элементы
 * - Размерные линии, фурнитуру и визуализацию располагаем в отдельных слоях
 *
 * @class Scheme
 * @constructor
 * @extends paper.Project
 * @param _canvas {HTMLCanvasElement} - канвас, в котором будет размещено изделие
 * @menuorder 20
 * @tooltip Изделие
 */

class Scheme extends paper.Project {

  constructor(_canvas, _editor, _silent) {

    // создаём объект проекта paperjs
    super(_canvas);

    _editor.project = this;

    const _attr = this._attr = {
      _silent,
      _bounds: null,
      _calc_order_row: null,
      _update_timer: 0,
      _vis_timer: 0,
    };

    // массив с моментами времени изменений изделия
    this._ch = [];

    // массив с функциями, ожидающими redraw
    this._deffer = [];

    // узлы и рёбра
    this._skeleton = new Skeleton(this);

    // объект обработки с табличными частями
    this._dp = $p.dp.buyers_order.create();

    // бит, что мы в браузере
    this.isBrowser = typeof requestAnimationFrame === 'function';

    // биндим redraw
    this.redraw = this.redraw.bind(this);

    // начинаем следить за _dp, чтобы обработать изменения цвета и параметров
    if(!_attr._silent) {
      // наблюдатель за изменениями свойств изделия
      this._dp_listener = this._dp_listener.bind(this);
      this._dp._manager.on('update', this._dp_listener);
    }

    // начинаем следить за событиями контуров для перерисовки допвизуализации
    _editor.eve.on('contour_redrawed', () => {
      clearTimeout(_attr._vis_timer);
      _attr._vis_timer = setTimeout(this.draw_visualization.bind(this), 300);
    });

  }

  /**
   * Обновляет связи параметров в иерархии слоёв
   * @param contour {Contour}
   * @param isBrowser {Boolean}
   */
  refresh_recursive(contour, isBrowser) {
    const {contours, l_dimensions, layer} = contour;
    contour.save_coordinates(true);
    isBrowser && layer && contour.refresh_prm_links();
    !layer && l_dimensions.redraw();
    contours.forEach((contour) => this.refresh_recursive(contour, isBrowser));
  }

  /**
   * Устанавливает цвет всех профилей изделия
   * @param clr {CatClrs}
   */
  set_clr(clr) {
    const {ox, _dp} = this;
    ox._obj.clr = _dp._obj.clr = clr.valueOf();
    this.getItems({class: ProfileItem}).forEach((elm) => {
      if(!(elm instanceof Onlay) && !(elm instanceof ProfileNestedContent)) {
        elm.clr = clr;
      }
    });
  }

  /**
   * Освежает отбор в метаданных доступных цветов и при необходимости, цвет изделия
   */
  check_clr() {
    const {ox, _dp} = this;
    const {cat, utils} = $p;
    const cmeta = _dp._metadata('clr');
    const {clr_group} = _dp.sys;
    const clrs = [...clr_group.clrs()];

    cat.clrs.selection_exclude_service(cmeta, _dp);
    if(cmeta.choice_params.length > 2) {
      const all = clrs.length ? clrs.splice(0) : cat.clrs;
      for (const clr of all) {
        if(cmeta.choice_params.every(({name, path}) => {
          return utils._selection(clr, {[name]: path});
        })) {
          clrs.push(clr);
        }
      }
    }
    if (!clr_group.contains(ox.clr, clrs)){
      const {default_clr} = _dp.sys;
      this.set_clr((default_clr.empty() || !clrs.includes(default_clr)) ? clrs[0] : default_clr);
    }
  }

  /**
   * наблюдатель за изменениями свойств изделия
   * @param obj
   * @param fields
   * @private
   */
  _dp_listener(obj, fields) {

    const {_attr, ox} = this;

    if(_attr._loading || _attr._snapshot || obj != this._dp) {
      return;
    }

    const scheme_changed_names = ['clr', 'sys'];
    const row_changed_names = ['quantity', 'discount_percent', 'discount_percent_internal'];

    if(scheme_changed_names.some((name) => fields.hasOwnProperty(name))) {
      // информируем мир об изменениях
      this.notify(this, 'scheme_changed');
      const {_select_template: st} = ox._manager._owner.templates;
      if(st) {
        if(st.sys != obj.sys) {
          st.sys = obj.sys;
        }
        if(st.clr != obj.clr) {
          st.clr = obj.clr;
        }
      }
    }

    if(fields.hasOwnProperty('clr')) {
      this.set_clr(obj.clr);
    }

    if(fields.hasOwnProperty('sys') && !obj.sys.empty()) {

      obj.sys.refill_prm(ox, 0, true, this);

      // cменить на цвет по умолчанию если не входит в список доступных
      this.check_clr();

      // обновляем свойства изделия и створки
      obj._manager.emit_async('rows', obj, {extra_fields: true});

      // информируем контуры о смене системы, чтобы пересчитать материал профилей и заполнений
      this.l_connective.on_sys_changed();
      for (const contour of this.contours) {
        contour.on_sys_changed();
      }

      if(obj.sys != $p.wsql.get_user_param('editor_last_sys')) {
        $p.wsql.set_user_param('editor_last_sys', obj.sys.ref);
      }

      this.register_change(true);
    }

    for (const name of row_changed_names) {
      if(_attr._calc_order_row && fields.hasOwnProperty(name)) {
        _attr._calc_order_row[name] = obj[name];
        this.register_change(true);
      }
    }

  }

  /**
   * устанавливает систему
   * @param sys
   * @param [defaults] {TabularSection}
   * @param [refill] {Boolean}
   */
  set_sys(sys, defaults, refill) {

    const {_dp, ox} = this;

    if(_dp.sys === sys && !defaults) {
      return;
    }

    _dp.sys = sys;
    ox.sys = sys;

    _dp.sys.refill_prm(ox, 0, 1, this, defaults);

    // информируем контуры о смене системы, чтобы пересчитать материал профилей и заполнений
    this.l_connective.on_sys_changed(refill);
    for (const contour of this.contours) {
      contour.on_sys_changed(refill);
    }

    if(ox.clr.empty()) {
      ox.clr = _dp.sys.default_clr;
    }

  }

  /**
   * Меняет вставку прозрачных заполнений
   * @param inset
   */
  set_glasses(inset) {
    const {Заполнение} = $p.enm.elm_types;
    for(const glass of this.getItems({class: Filling})) {
      if(glass.nom.elm_type != Заполнение) {
        glass.set_inset(inset, true);
      }
    }
  }

  /**
   * Устанавливает фурнитуру в створках изделия
   * @param furn
   */
  set_furn(furn, fprops) {
    for (const rama of this.contours) {
      for (const contour of rama.contours) {
        const props = fprops && fprops.get(contour.cnstr);
        if(props || !contour.furn.empty()) {
          contour.furn = props && props.furn ? props.furn : furn;
        }
      }
    }
  }

  /**
   * наблюдатель за изменениями параметров створки
   * @param obj
   * @param fields
   * @private
   */
  _papam_listener(obj, fields) {
    const {_attr, _ch, ox} = this;
    if(_attr._loading || _attr._snapshot) {
      return;
    }
    const is_row = obj._owner === ox.params;
    if(is_row || (obj === ox && fields.hasOwnProperty('params'))) {
      !_ch.length && this.register_change();
      const {job_prm: {builder}, cat: {templates}} = $p;
      const {_select_template: st} = templates;
      if(st && builder.base_props && builder.base_props.includes(obj.param)) {
        let prow = st.params.find({param: obj.param});
        if(!prow) {
          prow = st.params.add({param: obj.param, value: obj.value});
        }
        prow.value = obj.value;
      }
    }
    if(is_row && obj.inset.empty()) {
      for(const contour of this.contours) {
        contour.refresh_inset_depends(obj.param);
      }
    }
  }

  /**
   * Возвращает соединение между элементами
   * @param elm1
   * @param elm2
   * @return {*}
   */
  elm_cnn(elm1, elm2) {
    const {elm: e1, _row: {_owner: o1}} = elm1;
    const {elm: e2, _row: {_owner: o2}} = elm2;
    if(o1 === o2) {
      const res = o1._owner.cnn_elmnts._obj.find((row) => row.elm1 === e1 && row.elm2 === e2);
      return res && res._row.cnn;
    }
  }

  /**
   * Алиас к табчасти соединений текущей продукции
   */
  get cnns() {
    return this.ox.cnn_elmnts;
  }

  /**
   * ХарактеристикаОбъект текущего изделия
   * @property ox
   * @type CatCharacteristics
   */
  get ox() {
    return this._dp.characteristic;
  }

  set ox(v) {
    const {_dp, _attr, _scope} = this;
    let setted;

    // пытаемся отключить обсервер от табчасти
    if(!_attr._silent) {
      if(!this.hasOwnProperty('_papam_listener')){
        this._papam_listener = this._papam_listener.bind(this);
      }
      _dp.characteristic._manager.off('update', this._papam_listener);
      _dp.characteristic._manager.off('rows', this._papam_listener);
    }

    // устанавливаем в _dp характеристику
    _dp.characteristic = v;

    const ox = _dp.characteristic;

    _dp.len = ox.x;
    _dp.height = ox.y;
    _dp.s = ox.s;
    _dp.sys = ox.sys;
    _dp.clr = ox.clr;

    // устанавливаем строку заказа
    _attr._calc_order_row = ox.calc_order_row;

    // устанавливаем в _dp свойства строки заказа
    if(_attr._calc_order_row) {
      'quantity,price_internal,discount_percent_internal,discount_percent,price,amount,note'.split(',').forEach((fld) => _dp[fld] = _attr._calc_order_row[fld]);
    }
    else {
      // TODO: установить режим только просмотр, если не найдена строка заказа
      if(ox.empty()) {
        return;
      }
    }

    // устанавливаем в _dp систему профилей
    if(_dp.sys.empty()) {
      if(ox.owner.empty()) {
        _dp.sys = $p.wsql.get_user_param('editor_last_sys');
        setted = !_dp.sys.empty();
      }
      // иначе, ищем первую подходящую систему
      else {
        $p.cat.production_params.find_rows({is_folder: false}, (o) => {
          if(setted) {
            return false;
          }
          o.production.find_rows({nom: ox.owner}, () => {
            _dp.sys = o;
            setted = true;
            return false;
          });
        });
      }
    }

    // пересчитываем параметры изделия, если изменилась система
    if(setted) {
      _dp.sys.refill_prm(ox, 0, true, this);
    }

    // устанавливаем в _dp цвет по умолчанию
    if(_dp.clr.empty()) {
      _dp.clr = _dp.sys.default_clr;
    }

    // оповещаем о новых слоях и свойствах изделия
    if(!_attr._silent) {
      _scope.eve.emit_async('rows', ox, {constructions: true});
      _dp._manager.emit_async('rows', _dp, {extra_fields: true});

      // начинаем следить за ox, чтобы обработать изменения параметров фурнитуры
      _dp.characteristic._manager.on({
        update: this._papam_listener,
        rows: this._papam_listener,
      });
    }

  }

  /**
   * ### Допсвойства, например, скрыть размерные линии
   * при рендеринге может переопределяться или объединяться с параметрами рендеринга
   */
  get builder_props() {
    const {ox, _attr} = this;
    return _attr._builder_props || ox.builder_props;
  }

  /**
   * Методы сдвига узлов и элементов
   * @return {*}
   */
  get mover() {
    return this._scope._mover;
  }

  set_carcass(v) {
    const contours = this.getItems({class: Contour});
    contours.forEach(({skeleton}) => skeleton.carcass = v);
    this.redraw();
  }

  /**
   * Загружает пользовательские размерные линии
   * Этот код нельзя выполнить внутри load_contour, т.к. линия может ссылаться на элементы разных контуров
   */
  load_dimension_lines() {
    const {Размер, Радиус} = $p.enm.elm_types;
    this.ox.coordinates.find_rows({elm_type: {in: [Размер, Радиус]}}, (row) => {
      const layer = this.getItem({cnstr: row.cnstr});
      const Constructor = row.elm_type === Размер ? DimensionLineCustom : DimensionRadius;
      layer && new Constructor({
        parent: layer.l_dimensions,
        row: row
      });
    });
  }

  /**
   * Рекурсивно создаёт контуры изделия
   * @param [parent] {Contour}
   */
  load_contour(parent) {
    // создаём семейство конструкций
    this.ox.constructions.find_rows({parent: parent ? parent.cnstr : 0}, (row) => {
      // и вложенные створки
      this.load_contour(Contour.create({project: this, parent, row}));
    });
  }

  /**
   * ### Читает изделие по ссылке или объекту продукции
   * Выполняет следующую последовательность действий:
   * - Если передана ссылка, получает объект из базы данных
   * - Удаляет все слои и элементы текущего графического контекста
   * - Рекурсивно создаёт контуры изделия по данным табличной части конструкций текущей продукции
   * - Рассчитывает габариты эскиза
   * - Згружает пользовательские размерные линии
   * - Делает начальный снапшот для {{#crossLink "UndoRedo"}}{{/crossLink}}
   * - Рисует автоматические размерные линии
   * - Активирует текущий слой в дереве слоёв
   * - Рисует дополнительные элементы визуализации
   *
   * @method load
   * @param id {String|CatObj} - идентификатор или объект продукции
   * @param from_service {Boolean} - вызов произведен из сервиса, визуализацию перерисовываем сразу и делаем дополнительный zoom_fit
   * @async
   */
  load(id, from_service, order) {
    const {_attr} = this;
    const _scheme = this;
    const {enm: {elm_types}, cat: {templates, characteristics}, doc, utils} = $p;

    function load_object(o) {

      if(!_scheme._scope) {
        return Promise.resolve();
      }
      _scheme.ox = o;

      // включаем перерисовку
      _attr._opened = true;
      _attr._bounds = new paper.Rectangle({point: [0, 0], size: [o.x, o.y]});

      // первым делом создаём соединители и опорные линии
      o.coordinates.forEach((row) => {
        if(row.elm_type === elm_types.Соединитель) {
          new ProfileConnective({row, parent: _scheme.l_connective});
        }
        else if(row.elm_type === elm_types.Линия) {
          new BaseLine({row});
        }
        else if(row.elm_type === elm_types.Сечение) {
          new ProfileCut({row});
        }
      });

      // если указаны внешние builder_props, установим их для текущего проекта
      if(typeof from_service === 'object') {
        _attr._builder_props = Object.assign({}, o.constructor.builder_props_defaults, from_service);
      }
      else {
        delete _attr._builder_props;
      }

      o = null;

      // создаём семейство конструкций
      _scheme.load_contour(null);

      // перерисовываем каркас
      _scheme.redraw({from_service});

      // ограничиваем список систем в интерфейсе
      !from_service && templates._select_template && templates._select_template.permitted_sys_meta(_scheme.ox);
      _scheme.check_clr();

      // запускаем таймер, чтобы нарисовать размерные линии и визуализацию
      return new Promise((resolve, reject) => {

        _attr._bounds = null;

        // згружаем пользовательские размерные линии
        _scheme.load_dimension_lines();

        setTimeout(() => {

          _attr._bounds = null;
          _scheme.zoom_fit();

          const {_scope} = _scheme;

          // заставляем UndoRedo сделать начальный снапшот, одновременно, обновляем заголовок
          if(!_attr._snapshot) {
            _scope._undo.clear();
            _scope._undo.save_snapshot(_scheme);
            _scope.set_text();
          }

          // регистрируем изменение, чтобы отрисовались размерные линии
          _scheme.register_change(true);

          // виртуальное событие, чтобы активировать слой в дереве слоёв
          if(_scheme.contours.length) {
            _scheme.notify(_scheme.contours[0], 'layer_activated', true);
          }

          delete _attr._loading;

          // при необходимости загружаем типовой блок
          ((_scheme.ox.base_block.empty() || !_scheme.ox.base_block.is_new() || _scheme.ox.obj_delivery_state == 'Шаблон')
            ?
            Promise.resolve()
            :
            _scheme.ox.base_block.load().catch(() => null))
            .then(() => {
              if(_scheme.ox.coordinates.count()) {
                if(_scheme.ox.specification.count() || from_service) {
                  _scheme.draw_visualization();
                  if(from_service){
                    _scheme.zoom_fit();
                    return resolve();
                  }
                }
                else {
                  // если нет спецификации при заполненных координатах, скорее всего, прочитали типовой блок или снапшот - запускаем пересчет
                  $p.products_building.recalc(_scheme, {});
                }
              }
              else {
                if(from_service){
                  return resolve();
                }
                _scope.load_stamp && _scope.load_stamp();
              }
              delete _attr._snapshot;

              (!from_service || !_scheme.ox.specification.count()) && resolve();
            });
        });
      })
        .then(() => {
          // при необходимости, перезаполним параметры изделия и фурнитуры
          if(_scheme.ox._data.refill_props) {
            _scheme._dp.sys.refill_prm(_scheme.ox, 0, true, _scheme);
            _scheme._scope._acc && _scheme._scope._acc.props.reload();
            delete _scheme.ox._data.refill_props;
          }
          _scheme.notify(_scheme, 'loaded');
        });
    }

    _attr._loading = true;

    if(from_service) {
      _attr._from_service = true;
    }

    this.ox = null;
    this.clear();

    if(utils.is_data_obj(id) && id.calc_order && (order === id.calc_order || !id.calc_order.is_new())) {
      return load_object(id);
    }
    else if(utils.is_guid(id) || utils.is_data_obj(id)) {
      return characteristics.get(id, true, true)
        .then((ox) => {
          return doc.calc_order.get((utils.is_guid(order) || utils.is_data_obj(order)) ? order : ox.calc_order, true, true)
            .then((calc_order) => {
              if(ox.is_new() || (order && ox.calc_order != order)) {
                ox.calc_order = order;
              }
              return calc_order.load_templates();
            })
            .then(() => load_object(ox));
        });
    }
  }

  /**
   * ### Рисует фрагмент загруженного изделия
   * @param attr {Object}
   * @param [attr.elm] {Number} - Элемент или Контур
   *        = 0, формируется эскиз изделия,
   *        > 0, эскиз элемента (заполнения или палки)
   *        < 0, эскиз контура (рамы или створки)
   * @param [attr.width] {Number} - если указано, эскиз будет вписан в данную ширину (по умолчению - 600px)
   * @param [attr.height] {Number} - если указано, эскиз будет вписан в данную высоту (по умолчению - 600px)
   * @param [attr.sz_lines] {enm.ТипыРазмерныхЛиний} - правила формирования размерных линий (по умолчению - Обычные)
   * @param [attr.txt_cnstr] {Boolean} - выводить текст, привязанный к слоям изделия (по умолчению - Да)
   * @param [attr.txt_elm] {Boolean} - выводить текст, привязанный к элементам (например, формулы заполнений, по умолчению - Да)
   * @param [attr.visualisation] {Boolean} - выводить визуализацию (по умолчению - Да)
   * @param [attr.opening] {Boolean} - выводить направление открывания (по умолчению - Да)
   * @param [attr.select] {Number} - выделить на эскизе элемент по номеру (по умолчению - 0)
   * @param [attr.format] {String} - [svg, png, pdf] - (по умолчению - png)
   * @param [attr.children] {Boolean} - выводить вложенные контуры (по умолчению - Нет)
   */
  draw_fragment(attr = {}) {

    const {l_dimensions, l_connective, _attr} = this;

    // скрываем все слои
    const contours = this.getItems({class: Contour});

    if(attr.elm) {
      contours.forEach((l) => l.hidden = true);
      l_dimensions.visible = false;
      l_connective.visible = false;
    }

    let elm;
    _attr.elm_fragment = attr.elm;
    if(attr.elm > 0) {
      elm = this.getItem({class: BuilderElement, elm: attr.elm});
      if(elm && elm.draw_fragment) {
        elm.selected = false;
        elm.draw_fragment();
      }
    }
    else if(attr.elm < 0) {
      const cnstr = -attr.elm;
      contours.some((l) => {
        if(l.cnstr == cnstr) {
          l.hidden = false;
          l.hide_generatrix();
          l.l_dimensions.redraw(attr.faltz || true);
          l.zoom_fit();
          return true;
        }
      });
    }
    else {
      const glasses = this.selected_glasses();
      if(glasses.length) {
        attr.elm = glasses[0].elm;
        this.deselectAll();
        return this.draw_fragment(attr);
      }
      else {
        const {activeLayer} = this;
        if(activeLayer.cnstr) {
          attr.elm = -activeLayer.cnstr;
          return this.draw_fragment(attr);
        }
      }
    }
    this.view.update();
    return elm;
  }

  reset_fragment() {
    const {l_dimensions, l_connective, _attr, view} = this;

    if(_attr.elm_fragment > 0) {
      const elm = this.getItem({class: BuilderElement, elm: _attr.elm_fragment});
      elm && elm.reset_fragment && elm.reset_fragment();
    }
    _attr.elm_fragment = 0;

    // показываем серытые слои
    const contours = this.getItems({class: Contour});
    contours.forEach((l) => l.hidden = false);
    l_dimensions.visible = true;
    l_connective.visible = true;
    view.update();
    this.zoom_fit();
  }

  /**
   * Перерисовывает все контуры изделия. Не занимается биндингом.
   * Предполагается, что взаимное перемещение профилей уже обработано
   */
  redraw(attr = {}) {

    const {_attr, _ch, contours, isBrowser, _scope, _deffer} = this;
    const {length} = _ch;

    _attr._opened && !_attr._silent && _scope && isBrowser && requestAnimationFrame(this.redraw);

    if(_attr._lock || !_scope?.eve || (isBrowser && _scope.eve._async?.move_points?.timer)) {
      return;
    }

    if(!_attr._opened || _attr._saving || !length) {
      _deffer.length = 0;
      return;
    }

    if(contours.length) {

      if(_attr.elm_fragment > 0) {
        const elm = this.getItem({class: BuilderElement, elm: _attr.elm_fragment});
        elm && elm.draw_fragment && elm.draw_fragment(true);
      }
      else {
        // перерисовываем соединительные профили
        this.l_connective.redraw();

        // TODO: обновляем связи параметров изделия
        isBrowser && !_attr._silent && contours[0].refresh_prm_links(true);

        // перерисовываем все контуры
        for (let contour of contours) {
          contour.redraw();
          if(_ch.length > length) {
            return;
          }
        }
      }

      // если перерисованы все контуры, перерисовываем их размерные линии
      _attr._bounds = null;
      contours.forEach((contour) => this.refresh_recursive(contour, isBrowser));

      // перерисовываем габаритные размерные линии изделия
      this.draw_sizes();

      // обновляем изображение на экране
      this.view.update();

    }
    else {
      this.draw_sizes();
    }

    // сбрасываем счетчик изменений
    _ch.length = 0;

    // выполняем отложенные подписки
    for(const deffer of _deffer) {
      deffer(this);
    }
    _deffer.length = 0;
  }

  /**
   * информирует о наличии изменений
   */
  has_changes() {
    return this._ch.length > 0;
  }

  /**
   * Регистрирует необходимость обновить изображение
   */
  register_update() {
    const {_attr} = this;
    if(_attr._update_timer) {
      clearTimeout(_attr._update_timer);
    }
    _attr._update_timer = setTimeout(() => {
      this.view && this.view.update();
      _attr._update_timer = 0;
    }, 100);
  }

  /**
   * Регистрирует факты изменения элемнтов
   */
  register_change(with_update, deffer) {

    const {_attr, _ch, _deffer} = this;

    if(!_attr._loading) {

      // сбрасываем габариты
      _attr._bounds = null;

      // сбрасываем d0 для всех профилей
      this.getItems({class: Profile}).forEach((p) => {
        delete p._attr.d0;
        delete p._attr.nom;
      });

      // регистрируем изменённость характеристики
      this.ox._data._modified = true;
      this.notify(this, 'scheme_changed');
    }
    _ch.push(Date.now());
    deffer && _deffer.push(deffer);

    if(with_update) {
      this.register_update();
    }
  }

  /**
   * Габариты изделия. Рассчитываются, как объединение габаритов всех слоёв типа Contour
   * @property bounds
   * @type Rectangle
   */
  get bounds() {
    const {_attr} = this;
    if(!_attr._bounds) {
      this.contours.forEach((l) => {
        if(!_attr._bounds) {
          _attr._bounds = l.bounds;
        }
        else {
          _attr._bounds = _attr._bounds.unite(l.bounds);
        }
      });
    }
    return _attr._bounds;
  }

  /**
   * Габариты с учетом пользовательских размерных линий, чтобы рассчитать отступы автолиний
   */
  get dimension_bounds() {
    let {bounds} = this;
    this.getItems({class: DimensionLine}).forEach((dl) => {
      if(dl instanceof DimensionLineCustom || dl._attr.impost || dl._attr.contour) {
        bounds = bounds.unite(dl.bounds);
      }
    });
    this.contours.forEach(({l_visualization}) => {
      const ib = l_visualization._by_insets.bounds;
      if(ib.height && ib.bottom > bounds.bottom) {
        const delta = ib.bottom - bounds.bottom + 10;
        bounds = bounds.unite(
          new paper.Rectangle(bounds.bottomLeft, bounds.bottomRight.add([0, delta < 250 ? delta * 1.1 : delta * 1.2]))
        );
      }
    });
    return bounds;
  }

  /**
   * ### Габариты эскиза со всеми видимыми дополнениями
   * В свойстве `strokeBounds` учтены все видимые дополнения - размерные линии, визуализация и т.д.
   *
   * @property strokeBounds
   */
  get strokeBounds() {
    let bounds = this.l_dimensions.strokeBounds;
    this.contours.forEach((l) => bounds = bounds.unite(l.strokeBounds));
    return bounds;
  }

  /**
   * Строка табчасти продукция текущего заказа, соответствующая редактируемому изделию
   */
  get _calc_order_row() {
    const {_attr, ox} = this;
    if(!_attr._calc_order_row && !ox.empty()) {
      _attr._calc_order_row = ox.calc_order_row;
    }
    return _attr._calc_order_row;
  }

  /**
   * Отдел абонента текущего изделия
   * По умолчанию, равен отделу абонента автора заказа, но может быть переопределён
   * @type {CatBranches}
   */
  get branch() {
    const {ox} = this;
    const param = $p.job_prm.properties.branch;
    return param ? param.calculated._data._formula({ox}, $p) : ox.calc_order.manager.branch;
  }

  /**
   * Формирует оповещение для тех, кто следит за this._noti
   * @param obj
   * @param type {String}
   * @param fields {Array}
   */
  notify(obj, type = 'update', fields) {
    if(obj.type) {
      type = obj.type;
    }
    this?._scope?.eve.emit_async(type, obj, fields);
  }

  /**
   * Чистит изображение
   */
  clear() {
    const {_attr} = this;
    const pnames = '_bounds,_update_timer,_loading,_snapshot,_silent,_from_service';
    for (let fld in _attr) {
      if(!pnames.match(fld)) {
        delete _attr[fld];
      }
    }

    super.clear();
    new paper.Layer();
  }

  /**
   * Деструктор
   */
  unload() {
    const {_dp, _attr, _calc_order_row, _deffer} = this;
    _deffer.length = 0;
    const pnames = ['_loading', '_saving'];
    for (let fld in _attr) {
      if(pnames.includes(fld)) {
        _attr[fld] = true;
      }
      else {
        if(fld === '_vitrazh') {
          _attr[fld].unload();
        }
        delete _attr[fld];
      }
    }

    if(this.hasOwnProperty('_dp_listener')){
      _dp._manager.off('update', this._dp_listener);
      this._dp_listener = null;
    }

    const ox = _dp.characteristic;
    if(this.hasOwnProperty('_papam_listener')){
      ox._manager.off('update', this._papam_listener);
      ox._manager.off('rows', this._papam_listener);
      this._papam_listener = null;
    }
    let revert = Promise.resolve();
    if(ox && ox._modified) {
      if(ox.is_new()) {
        if(_calc_order_row) {
          ox.calc_order.production.del(_calc_order_row);
        }
        ox.unload();
      }
      else {
        revert = revert.then(() => {
          ox._data._loading = false;
          return ox.load();
        });
      }
    }
    this.getItems({class: ContourNested}).forEach(({_ox}) => {
      if(_ox._modified) {
        revert = revert.then(() => {
          _ox._data._loading = false;
          return _ox.load();
        });
      }
    });

    this.remove();
    return revert;
  }

  /**
   * Двигает выделенные точки путей либо все точки выделенных элементов
   * @method move_points
   * @param delta {paper.Point}
   * @param [all_points] {Boolean}
   */
  move_points(delta, all_points) {

    const other = [];
    const layers = [];
    const profiles = new Set();
    const selected = new Set();
    const nearests = new Map();
    const {auto_align, _dp} = this;

    // добавляем в selected вложенные створки, совпадающие по узлам с рамами
    for (const item of this.selectedItems) {
      const {parent} = item;
      if(item instanceof paper.Path && parent instanceof GeneratrixElement && !(parent instanceof Sectional)) {
        selected.add(item);
        if(all_points === false) {
          continue;
        }
        if(!nearests.has(parent)) {
          nearests.set(parent, parent.joined_nearests());
        }
        for (const {generatrix} of nearests.get(parent)) {
          let check_selected;
          item.segments.forEach((segm) => {
            if(segm.selected) {
              check_selected = true;
              generatrix.segments.forEach((gs) => {
                if(gs.point.is_nearest(segm.point)) {
                  gs.selected = true;
                  selected.add(generatrix);
                }
              });
            }
          });
          if(!check_selected) {
            //  item.parent.generatrix
            selected.add(generatrix);
          }
        }
      }
      else if(parent instanceof Sectional) {
        selected.add(parent.generatrix);
      }
    }

    const {Импост} = $p.enm.elm_types;
    for (const item of selected) {
      if(!item) {
        continue;
      }
      const {parent, layer} = item;

      if(!profiles.has(parent)) {

        profiles.add(parent);

        if(parent._hatching) {
          parent._hatching.remove();
          parent._hatching = null;
        }

        if(layer instanceof ConnectiveLayer) {
          // двигаем и накапливаем связанные
          other.push.apply(other, parent.move_points(delta, all_points));
        }
        else if(!parent.nearest || !parent.nearest() || parent instanceof ProfileSegment) {

          // автоуравнивание $p.enm.align_types.Геометрически для импостов внешнего слоя
          if(auto_align && parent.elm_type === Импост && !parent.layer.layer && Math.abs(delta.x) > 1) {
            continue;
          }

          let check_selected;
          item.segments.forEach((segm) => {
            if(segm.selected && other.indexOf(segm) != -1) {
              check_selected = !(segm.selected = false);
            }
          });

          // если уже двигали и не осталось ни одного выделенного - выходим
          if(check_selected && !item.segments.some((segm) => segm.selected)) {
            continue;
          }

          // двигаем и накапливаем связанные
          other.push.apply(other, parent.move_points(delta, all_points));

          if(layers.indexOf(layer) == -1) {
            layers.push(layer);
            layer.l_dimensions.clear();
          }
        }
      }
      else if(item instanceof Filling) {
        item.purge_paths();
      }
    }

    // при необходимости двигаем импосты
    if(other.length && Math.abs(delta.x) > 1) {
      this.do_align(auto_align, profiles);
    }
    // иначе перерисовываем контуры
    else if(!this._attr._from_service) {
      this.register_change(true);
    }

    _dp._manager.emit_async('update', {}, {x1: true, x2: true, y1: true, y2: true, a1: true, a2: true, cnn1: true, cnn2: true, info: true});

    // TODO: возможно, здесь надо подвигать примыкающие контуры
  }

  /**
   * Сохраняет координаты и пути элементов в табличных частях характеристики
   * @method save_coordinates
   */
  save_coordinates(attr) {

    const {_attr, bounds, ox, contours} = this;

    _attr._saving = true;
    ox._data._loading = true;

    // чистим табчасти, которые будут перезаполнены
    const {cnn_nodes} = ProductsBuilding;
    const {inserts} = ox;
    ox.cnn_elmnts.clear(({elm1, node1}) => {
      return cnn_nodes.includes(node1) || !inserts.find_rows({cnstr: -elm1, region: {gt: 0}}).length;
    });
    ox.glasses.clear();

    let res = Promise.resolve();
    const push = (contour) => {
      res = res.then(() => contour.save_coordinates(false, attr?.save, attr?.close))
    };

    if(bounds) {
      // устанавливаем размеры в характеристике
      ox.x = bounds.width.round(1);
      ox.y = bounds.height.round(1);
      ox.s = this.area;

      // вызываем метод save_coordinates в дочерних слоях
      contours.forEach((contour) => {
        if(attr?.save && contours.length > 1 && !contour.getItem({class: BuilderElement})) {
          if(this.activeLayer === contour) {
            const other = contours.find((el) => el !== contour);
            other && other.activate();
          }
          contour.remove();
          this._scope.eve.emit_async('rows', ox, {constructions: true});
        }
        else {
          push(contour);
        }
      });

      // вызываем метод save_coordinates в слое соединителей
      push(this.l_connective);
    }
    else {
      ox.x = 0;
      ox.y = 0;
      ox.s = 0;
    }

    // пересчет спецификации и цен
    return res
      .then(() => attr?.no_recalc ? this : $p.products_building.recalc(this, attr))
      .catch((err) => {
        const {msg, ui} = $p;
        ui && ui.dialogs.alert({text: err.message, title: msg.bld_title});
        throw err;
      });

  }

  /**
   * ### Изменяет центр и масштаб, чтобы изделие вписалось в размер окна
   * Используется инструментом {{#crossLink "ZoomFit"}}{{/crossLink}}, вызывается при открытии изделия и после загрузки типового блока
   *
   * @method zoom_fit
   */
  zoom_fit(bounds, isNode) {

    if(!bounds) {
      bounds = this.strokeBounds;
    }

    if (bounds) {
      if(!isNode) {
        isNode = $p.wsql.alasql.utils.isNode;
      }
      const space = isNode ? 160 : 320;
      const min = 900;
      let {width, height, center} = bounds;
      if (width < min) {
        width = min;
      }
      if (height < min) {
        height = min;
      }
      width += space;
      height += space;
      const {view} = this;
      const zoom = Math.min(view.viewSize.height / height, view.viewSize.width / width);
      const {scaling} = view._decompose();
      view.scaling = [Math.sign(scaling.x) * zoom, Math.sign(scaling.y) * zoom];

      const dx = view.viewSize.width - width * zoom;
      if(isNode) {
        const dy = view.viewSize.height - height * zoom;
        view.center = center.add([Math.sign(scaling.y) * dx, -Math.sign(scaling.y) * dy]);
      }
      else {
        view.center = center.add([Math.sign(scaling.y) * dx / 2, 50]);
      }
    }
  }

  /**
   * ### Возвращает строку svg эскиза изделия
   * Вызывается при записи изделия. Полученный эскиз сохраняется во вложении к характеристике
   *
   * @method get_svg
   * @param [attr] {Object} - указывает видимость слоёв и элементов, используется для формирования эскиза части изделия
   */
  get_svg(attr = {}) {
    this.deselectAll();
    const options = attr.export_options || {};
    if(!options.precision) {
      options.precision = 1;
    }
    // в шаблонах скрываем размерные линии
    const hidden = new Set();
    if(this.ox.calc_order.obj_delivery_state == 'Шаблон') {
      for(const el of this.getItems({class: DimensionLine})) {
        el.visible = false;
        hidden.add(el);
      }
      for(const el of this.getItems({class: paper.PointText})) {
        el.visible = false;
        hidden.add(el);
      }
      for(const el of this.getItems({class: Contour})) {
        if(el.l_visualization._opening) {
          el.l_visualization._opening.strokeScaling = false;
          el.l_visualization._opening.opacity = 0.8;
          el.l_visualization._by_spec.opacity = 0.5;
        }
      }
      this.zoom_fit();

      const {ownerDocument} = this.view.element;
      if(ownerDocument) {
        options.onExport = function (item, node, options) {
          if(!item.visible) {
            return ownerDocument.createElement('g');
          }
        }
      }
    }
    const svg = this.exportSVG(options);
    const bounds = this.strokeBounds.unite(this.l_dimensions.strokeBounds);

    svg.setAttribute('x', bounds.x);
    svg.setAttribute('y', bounds.y);
    svg.setAttribute('width', bounds.width + 40);
    svg.setAttribute('height', bounds.height);
    svg.querySelector('g').removeAttribute('transform');

    options.onExport = null;
    if(hidden.size) {
      for(const el of hidden) {
        el.visible = true;
      }
      for(const el of this.getItems({class: Contour})) {
        if(el.l_visualization._opening) {
          el.l_visualization._opening.strokeScaling = true;
          el.l_visualization._opening.opacity = 1;
          el.l_visualization._by_spec.opacity = 1;
        }
      }
      this.zoom_fit();
    }

    return svg.outerHTML;
  }

  /**
   * ### Перезаполняет изделие данными типового блока или снапшота
   * Вызывается, обычно, из формы выбора типового блока, но может быть вызван явно в скриптах тестирования или групповых обработках
   *
   * @method load_stamp
   * @param obx {String|CatObj|Object} - идентификатор или объект-основание (характеристика продукции либо снапшот)
   * @param [is_snapshot] {Boolean}
   * @param [no_refill] {Boolean}
   * @param [from_service] {Boolean}
   */
  load_stamp(obx, is_snapshot, no_refill, from_service) {

    const do_load = (obx) => {

      const {ox} = this;

      // если отложить очитску на потом - получим лажу, т.к. будут стёрты новые хорошие строки
      this.clear();

      // переприсваиваем номенклатуру, цвет и размеры
      const src = Object.assign({_not_set_loaded: true}, is_snapshot ? obx : obx._obj);
      ox._mixin(src, null,
        'ref,name,calc_order,product,leading_product,leading_elm,origin,base_block,note,partner,_not_set_loaded,obj_delivery_state,_rev'.split(','),
        true);

      const {obj_delivery_states: {Шаблон}, inserts_types: {Заполнение, Стеклопакет}} = $p.enm;

      // сохраняем ссылку на типовой блок
      if(!is_snapshot) {
        ox.base_block = (obx.base_block.empty() || obx.base_block.obj_delivery_state === Шаблон ||
          obx.base_block.calc_order.obj_delivery_state === Шаблон) ? obx : obx.base_block;
        if(!no_refill && obx.calc_order.refill_props) {
          ox._data.refill_props = true;
        }
      }

      // параметры составных пакетов
      for(const {elm, inset} of ox.coordinates) {
        if(inset.insert_type === Заполнение) {
          ox.glass_specification.clear({elm});
        }
        else if(inset.insert_type === Стеклопакет && !ox.glass_specification.find({elm})) {
          for(const row of inset.specification) {
            row.quantity && ox.glass_specification.add({elm, inset: row.nom});
          }
        }
      }

      return this.load(ox, from_service)
        .then(() => ox._data._modified = true);

    };

    this._attr._loading = true;

    if(is_snapshot) {
      this._attr._snapshot = true;
      return do_load(obx);
    }
    else {
      return $p.cat.characteristics.get(obx, true, true)
        .then(do_load);
    }
  }

  /**
   * ### Выясняет, надо ли автоуравнивать изделие при сдвиге точек
   * @return {boolean}
   */
  get auto_align() {
    const {calc_order, base_block} = this.ox;
    const {enm: {obj_delivery_states: st}, job_prm: {properties}} = $p;

    if(base_block.empty() || calc_order.obj_delivery_state == st.Шаблон || base_block.calc_order.obj_delivery_state != st.Шаблон) {
      return false;
    }

    let align;
    if(properties.auto_align) {
      base_block.params.find_rows({param: properties.auto_align, cnstr: 0}, (row) => {
        align = row.value;
        return false;
      });
    }
    return align && align != '_' && align;
  }

  /**
   * ### Уравнивает геометрически или по заполнениям
   * сюда попадаем из move_points, когда меняем габариты
   * @param auto_align {Boolean}
   * @param profiles {Set}
   */
  do_align(auto_align, profiles) {

    if(!auto_align || !profiles.size) {
      return;
    }

    // получаем слои, в которых двигались элементы
    const layers = new Set();
    for (const profile of profiles) {
      profile.layer.fillings && layers.add(profile.layer);
    }

    if(this._attr._align_timer) {
      clearTimeout(this._attr._align_timer);
    }

    this._attr._align_timer = setTimeout(() => {

      this._attr._align_timer = 0;

      // получаем массив заполнений изменённых контуров
      const glasses = [];
      for (const layer of layers) {
        for(const filling of layer.fillings){
          glasses.indexOf(filling) == -1 && glasses.push(filling);
        }
      }

      // TODO: понять, что хотел автор
      // if(auto_align == $p.enm.align_types.ПоЗаполнениям) {
      //
      // }
      this._scope.glass_align('width', glasses);

    }, 100);

  }

  /**
   * ### Вписывает канвас в указанные размеры
   * Используется при создании проекта и при изменении размеров области редактирования
   *
   * @method resize_canvas
   * @param w {Number} - ширина, в которую будет вписан канвас
   * @param h {Number} - высота, в которую будет вписан канвас
   */
  resize_canvas(w, h) {
    const {viewSize} = this.view;
    viewSize.width = w;
    viewSize.height = h;
  }

  /**
   * Возвращает массив РАМНЫХ контуров текущего изделия
   * @property contours
   * @type Array
   */
  get contours() {
    return this.layers.filter((l) => l instanceof Contour);
  }

  /**
   * ### Габаритная площадь изделия
   * Сумма габаритных площадей рамных контуров
   *
   * @property area
   * @type Number
   * @final
   */
  get area() {
    return this.contours.reduce((sum, {area}) => sum + area, 0).round(3);
  }

  /**
   * ### Площадь изделия с учетом наклонов-изгибов профиля
   * Сумма площадей рамных контуров
   *
   * @property area
   * @type Number
   * @final
   */
  get form_area() {
    return this.contours.reduce((sum, {form_area}) => sum + form_area, 0).round(3);
  }

  /**
   * ### Цвет текущего изделия
   *
   * @property clr
   * @type CatClrs
   */
  get clr() {
    return this.ox.clr;
  }
  set clr(v) {
    this.ox.clr = v;
  }

  /**
   * ### Служебный слой размерных линий
   *
   * @property l_dimensions
   * @type DimensionLayer
   * @final
   */
  get l_dimensions() {
    const {activeLayer, _attr} = this;

    if(!_attr.l_dimensions) {
      _attr.l_dimensions = new DimensionLayer();
    }
    if(!_attr.l_dimensions.isInserted()) {
      this.addLayer(_attr.l_dimensions);
    }
    if(activeLayer) {
      this._activeLayer = activeLayer;
    }

    return _attr.l_dimensions;
  }

  /**
   * ### Служебный слой соединительных профилей
   *
   * @property l_connective
   * @type ConnectiveLayer
   * @final
   */
  get l_connective() {
    const {activeLayer, _attr} = this;

    if(!_attr.l_connective) {
      _attr.l_connective = new ConnectiveLayer();
    }
    if(!_attr.l_connective.isInserted()) {
      this.addLayer(_attr.l_connective);
    }
    if(activeLayer) {
      this._activeLayer = activeLayer;
    }

    return _attr.l_connective;
  }

  /**
   * ### Создаёт и перерисовавает габаритные линии изделия
   * Отвечает только за габариты изделия.<br />
   * Авторазмерные линии контуров и пользовательские размерные линии, контуры рисуют самостоятельно
   *
   * @method draw_sizes
   */
  draw_sizes() {

    const {bounds, l_dimensions, builder_props} = this;

    if(bounds && builder_props.auto_lines) {

      if(!l_dimensions.bottom) {
        l_dimensions.bottom = new DimensionLine({
          pos: 'bottom',
          parent: l_dimensions,
          offset: -120
        });
      }
      else {
        l_dimensions.bottom.offset = -120;
      }

      if(!l_dimensions.right) {
        l_dimensions.right = new DimensionLine({
          pos: 'right',
          parent: l_dimensions,
          offset: -120
        });
      }
      else {
        l_dimensions.right.offset = -120;
      }


      // если среди размеров, сформированных контурами есть габарит - второй раз не выводим

      if(this.contours.some((l) => l.l_dimensions.children.some((dl) =>
          dl.pos == 'right' && Math.abs(dl.size - bounds.height) < consts.sticking_l))) {
        l_dimensions.right.visible = false;
      }
      else {
        l_dimensions.right.redraw();
      }

      if(this.contours.some((l) => l.l_dimensions.children.some((dl) =>
          dl.pos == 'bottom' && Math.abs(dl.size - bounds.width) < consts.sticking_l))) {
        l_dimensions.bottom.visible = false;
      }
      else {
        l_dimensions.bottom.redraw();
      }
    }
    else {
      if(l_dimensions.bottom) {
        l_dimensions.bottom.visible = false;
      }
      if(l_dimensions.right) {
        l_dimensions.right.visible = false;
      }
    }
  }

  /**
   * Перерисовавает визуализацию контуров изделия
   */
  draw_visualization() {
    if(this.view){
      this._scope.activate();
      for (let contour of this.contours) {
        contour.draw_visualization();
      }
      this.view.update();
    }
  }

  /**
   * ### Вставка по умолчанию
   * Возвращает вставку по умолчанию с учетом свойств системы и положения элемента
   *
   * @method default_inset
   * @param [attr] {Object}
   * @param [attr.elm] {BuilderElement}
   * @param [attr.pos] {EnmPositions} - положение элемента
   * @param [attr.elm_type] {EnmElm_types} - тип элемента
   * @returns {Array.<ProfileItem>}
   */
  default_inset(attr) {
    const {positions, elm_types} = $p.enm;
    let rows;
    const sys = attr.elm ? attr.elm.layer.sys : this._dp.sys;
    if(!attr.pos) {
      rows = sys.inserts(attr.elm_type, true, attr.elm);
      // если доступна текущая, возвращаем её
      if(attr.inset && rows.some((row) => attr.inset == row)) {
        return attr.inset;
      }
      return rows[0];
    }

    rows = sys.inserts(attr.elm_type, 'rows', attr.elm);

    // если без вариантов, возвращаем без вариантов
    if(rows.length == 1) {
      return rows[0].nom;
    }

    const pos_array = Array.isArray(attr.pos);

    function check_pos(pos) {
      if(pos_array) {
        return attr.pos.some((v) => v == pos);
      }
      return attr.pos == pos;
    }

    // если подходит текущая, возвращаем текущую
    if(pos_array && attr.pos.includes(positions.ЦентрВертикаль) && Array.isArray(attr.elm_type) && attr.elm_type.includes(elm_types.СтворкаБИ)) {
      if(attr.inset && rows.some((row) => attr.inset == row.nom && check_pos(row.pos))) {
        return attr.inset;
      }
    }
    else if(attr.inset && rows.some((row) => attr.inset == row.nom && (check_pos(row.pos) || row.pos == positions.Любое))) {
      return attr.inset;
    }

    let inset;
    // ищем по умолчанию + pos
    rows.some((row) => {
      if(check_pos(row.pos) && row.by_default) {
        return inset = row.nom;
      }
    });
    // ищем по pos без умолчания
    if(!inset) {
      rows.some((row) => {
        if(check_pos(row.pos)) {
          return inset = row.nom;
        }
      });
    }
    // ищем по умолчанию + любое
    if(!inset) {
      rows.some((row) => {
        if(row.pos == positions.Любое && row.by_default) {
          return inset = row.nom;
        }
      });
    }
    // ищем любое без умолчаний
    if(!inset) {
      // если не нашлось штульпа, ищем импост
      if(attr.elm_type === elm_types.Штульп) {
        attr.elm_type = elm_types.Импост;
        return this.default_inset(attr);
      }
      rows.some((row) => {
        if(row.pos == positions.Любое) {
          return inset = row.nom;
        }
      });
    }

    return inset;
  }

  /**
   * ### Контроль вставки
   * Проверяет, годится ли текущая вставка для данного типа элемента и положения
   */
  check_inset(attr) {
    const inset = attr.inset ? attr.inset : attr.elm.inset;
    const elm_type = attr.elm ? attr.elm.elm_type : attr.elm_type;
    const rows = [];

    // получаем список вставок с той же номенклатурой, что и наша
    let finded;
    this._dp.sys.elmnts.forEach((row) => {
      if((elm_type ? row.elm_type == elm_type : true)) {
        if(row.nom === inset) {
          finded = true;
          return false;
        }
        rows.push(row);
      }
    });

    // TODO: отфильтровать по положению attr.pos

    if(finded) {
      return inset;
    }
    if(rows.length) {
      return rows[0].nom;
    }

  }

  /**
   * Находит точку на примыкающем профиле и проверяет расстояние до неё от текущей точки
   * !! Изменяет res - CnnPoint
   * @param element {Profile} - профиль, расстояние до которого проверяем
   * @param profile {Profile|null} - текущий профиль - используется, чтобы не искать соединения с самим собой
   * TODO: возможно, имеет смысл разрешить змее кусать себя за хвост
   * @param res {CnnPoint} - описание соединения на конце текущего профиля
   * @param point {paper.Point} - точка, окрестность которой анализируем
   * @param check_only {Boolean|String} - указывает, выполнять только проверку или привязывать точку к узлам или профилю или к узлам и профилю
   * @returns {Boolean|undefined}
   */
  check_distance(element, profile, res, point, check_only) {

    const {elm_types, cnn_types: {acn, av, ah, long}, orientations} = $p.enm;

    let distance, cnns, addls,
      bind_node = typeof check_only == 'string' && check_only.indexOf('node') != -1,
      bind_generatrix = typeof check_only == 'string' ? check_only.indexOf('generatrix') != -1 : check_only,
      node_distance;

    // Проверяет дистанцию в окрестности начала или конца соседнего элемента
    function check_node_distance(node) {
      distance = element[node].getDistance(point)
      if(distance < parseFloat(consts.sticking_l)) {

        if(typeof res.distance == 'number' && res.distance < distance) {
          res.profile = element;
          res.profile_point = node;
          return 1;
        }

        if(check_only === true && res.profile === element && res.cnn && acn.a.includes(res.cnn.cnn_type)) {
          if(res.distance > distance) {
            res.distance = distance;
          }
          res.profile_point = node;
          res.point = point;
          return 2;
        }

        if(profile && (!res.cnn || res.cnn.empty())) {

          // а есть ли подходящее?
          cnns = $p.cat.cnns.nom_cnn(profile, element, acn.a);
          if(!cnns || !cnns.length) {
            return 1;
          }

          // если в точке сходятся 2 профиля текущего контура - ок

          // если сходятся > 2 и разрешены разрывы TODO: учесть не только параллельные

        }
        else if(res.cnn && acn.t.includes(res.cnn.cnn_type)) {
          return 1;
        }

        res.point = bind_node ? element[node] : point;
        res.distance = distance;
        res.profile = element;
        res.profile_point = node;
        res.cnn_types = acn.a;
        if(cnns && cnns.length && !res.cnn) {
          res.cnn = cnns[0];
        }
        // if(cnns && cnns.length && acn.t.includes(cnns[0].cnn_type)) {
        //   res.profile_point = '';
        //   res.cnn_types = acn.t;
        //   if(!res.cnn) {
        //     res.cnn = cnns[0];
        //   }
        // }
        // else {
        //   res.profile_point = node;
        //   res.cnn_types = acn.a;
        // }

        return 2;
      }

    }

    const b = res.profile_point === 'b' ? 'b' : 'e';
    const e = b === 'b' ? 'e' : 'b';

    if(element === profile) {
      if(profile.is_linear()) {
        return;
      }
      else {
        // проверяем другой узел, затем - Т
      }
      return;
    }
    // если мы находимся в окрестности начала соседнего элемента
    else if((node_distance = check_node_distance(b)) || (node_distance = check_node_distance(e))) {
      if(res.cnn_types !== acn.a && res.profile_point){
        res.cnn_types = acn.a;
        res.distance = distance;
      }
      return node_distance == 2 ? false : void(0);
    }

    // это соединение с пустотой или T
    res.profile_point = '';

    // // если возможна привязка к добору, используем её
    // element.addls.forEach(function (addl) {
    // 	gp = addl.generatrix.getNearestPoint(point);
    // 	distance = gp.getDistance(point);
    //
    // 	if(distance < res.distance){
    // 		res.point = addl.rays.outer.getNearestPoint(point);
    // 		res.distance = distance;
    // 		res.point = gp;
    // 		res.profile = addl;
    // 		res.cnn_types = acn.t;
    // 	}
    // });
    // if(res.distance < ((res.is_t || !res.is_l)  ? consts.sticking : consts.sticking_l)){
    // 	return false;
    // }

    // если к доборам не привязались - проверяем профиль
    //const gp = element.generatrix.getNearestPoint(point);
    const gp = element._attr._nearest && (!profile || !profile._attr._nearest) ?
      (element.rays.outer.getNearestPoint(point) || element.generatrix.getNearestPoint(point)) :
      element.generatrix.getNearestPoint(point);
    distance = gp.getDistance(point);

    if(distance < ((res.is_t || !res.is_l) ? consts.sticking : consts.sticking_l)) {

      if(distance < res.distance || bind_generatrix) {
        if(element.d0 != 0 && element.rays.outer) {
          // для вложенных створок и смещенных рам учтём смещение
          res.point = element.rays.outer.getNearestPoint(point);
          res.distance = 0;
        }
        else {
          res.point = gp;
          res.distance = distance;
        }
        res.profile = element;
        // if(element.generatrix.firstSegment.point.is_nearest(gp)) {
        //   res.profile_point = 'b';
        // }
        // else if(element.generatrix.lastSegment.point.is_nearest(gp)) {
        //   res.profile_point = 'e';
        // }

        if(res.cnn && (
          res.cnn.cnn_type === long ||
          res.cnn.cnn_type === av && res.parent.orientation === orientations.vert ||
          res.cnn.cnn_type === ah && res.parent.orientation === orientations.hor
        )) {
          ;
        }
        else {
          res.cnn_types = acn.t;
        }
      }
      if(bind_generatrix) {
        return false;
      }
    }
  }

  /**
   * ### Цвет по умолчанию
   * Возвращает цвет по умолчанию с учетом свойств системы и элемента
   *
   * @property default_clr
   * @final
   */
  default_clr(attr) {
    return this.ox.clr;
  }

  /**
   * ### Выделенные профили
   * Возвращает массив выделенных профилей. Выделенным считаем профиль, у которого выделены `b` и `e` или выделен сам профиль при невыделенных узлах
   *
   * @method selected_profiles
   * @param [all] {Boolean} - если true, возвращает все выделенные профили. Иначе, только те, которе можно двигать
   * @returns {Array.<ProfileItem>}
   */
  selected_profiles(all) {
    const res = [];
    const {selectedItems} = this;
    const {length} = selectedItems;
    for(const item of selectedItems) {
      const {parent} = item;
      if(parent instanceof ProfileItem) {
        if(all || !item.layer.parent || !parent.nearest || !parent.nearest(true)) {
          if(res.includes(parent)) {
            continue;
          }
          if(length < 2 || !(parent._attr.generatrix.firstSegment.selected ^ parent._attr.generatrix.lastSegment.selected)) {
            res.push(parent);
          }
        }
      }
    }
    return res;
  }

  /**
   * ### Выделенные заполнения
   *
   * @method selected_glasses
   * @returns {Array.<Filling>}
   */
  selected_glasses() {
    return this.selected_elements.filter((item) => item instanceof Filling);
  }

  /**
   * ### Выделенный элемент
   * Возвращает первый из найденных выделенных элементов
   *
   * @property selected_elm
   * @returns {BuilderElement}
   */
  get selected_elm() {
    const {selected_elements} = this;
    return selected_elements.length && selected_elements[0];
  }

  /**
   * ### Выделенные элементы
   * Возвращает массив выделенных элементов
   *
   * @property selected_elements
   * @returns {Array.<BuilderElement>}
   */
  get selected_elements() {
    const res = new Set();
    for(const item of this.selectedItems) {
      if(item instanceof BuilderElement) {
        res.add(item);
      }
      else if(item.parent instanceof BuilderElement) {
        res.add(item.parent);
      }
    }
    return Array.from(res);
  }

  /**
   * Ищет точки в выделенных элементах. Если не находит, то во всём проекте
   * @param point {paper.Point}
   * @returns {*}
   */
  hitPoints(point, tolerance, selected_first, with_onlays) {
    let item, hit;
    let dist = Infinity;

    function check_corns(elm) {
      const corn = elm.corns(point);
      if(corn.dist < dist) {
        dist = corn.dist;
        if(corn.dist < consts.sticking) {
          hit = {
            item: elm.generatrix,
            point: corn.point
          };
        }
      }
    }

    // отдаём предпочтение сегментам выделенных путей
    if(selected_first) {
      this.selectedItems.some((item) => hit = item.hitTest(point, {segments: true, tolerance: tolerance || 8}));
      // если нет в выделенных, ищем во всех
      if(!hit) {
        hit = this.hitTest(point, {segments: true, tolerance: tolerance || 6});
      }
    }
    else {
      for (let elm of this.activeLayer.profiles) {
        check_corns(elm);
        for (let addl of elm.addls) {
          check_corns(addl);
        }
      }
      if(with_onlays) {
        for (let elm of this.activeLayer.onlays) {
          check_corns(elm);
        }
      }
    }

    return hit;
  }

  /**
   * Корневой слой для текущего слоя
   */
  rootLayer(layer) {
    if(!layer) {
      layer = this.activeLayer;
    }
    while (layer.parent) {
      layer = layer.parent;
    }
    return layer;
  }

  /**
   * Снимает выделение со всех узлов всех путей
   * В отличии от deselectAll() сами пути могут оставаться выделенными
   * учитываются узлы всех путей, в том числе и не выделенных
   */
  deselect_all_points(with_items) {
    const res = [];
    this.getItems({class: paper.Path}).forEach((item) => {
      item.segments.forEach((segm) => {
        if(segm.selected) {
          segm.selected = false;
          res.push(segm);
        }
      });
      if(with_items && item.selected) {
        item.selected = false;
        res.push(item);
      }
    });
    return res;
  }

  /**
   * Массив с рёбрами периметра
   */
  get perimeter() {
    let res = [],
      contours = this.contours,
      tmp;

    // если в изделии один рамный контур - просто возвращаем его периметр
    if(contours.length == 1) {
      return contours[0].perimeter;
    }

    // находим самый нижний правый контур

    // бежим по всем контурам, находим примыкания, исключаем их из результата

    return res;
  }

  /**
   * Возвращает массив заполнений изделия
   */
  get glasses() {
    return this.getItems({class: Filling});
  }

  get skeleton() {
    return this._skeleton;
  }

  set skeleton(v) {
    const {_skeleton} = this;
    _skeleton.skeleton = !!v;
  }

  /**
   * Зеркалирует эскиз
   * @param v
   * @return {boolean}
   */
  async mirror(v, animate) {
    const {_attr, view} = this;
    const {_from_service, _reflected} = _attr;
    if(typeof v === 'undefined') {
      return _reflected;
    }
    if(_from_service) {
      animate = false;
    }
    v = Boolean(v);
    if(v !== Boolean(_reflected)) {
      const {utils} = $p;
      const {scaling} = view._decompose();
      if(animate) {
        for(let i=0.8; i>0; i-=0.3) {
          view.scaling = [scaling.x * i, scaling.y];
          await utils.sleep(30);
        }
      }
      view.scaling = [-scaling.x, scaling.y];
      for(const txt of this.getItems({class: paper.PointText})) {
        const {scaling} = txt._decompose();
        txt.scaling = [-scaling.x, scaling.y];
      }
      _attr._reflected = v;
      for(const layer of this.contours) {
        layer.apply_mirror();
      }
      for(const profile of this.l_connective.profiles) {
        const {clr} = profile;
        if(clr.is_composite()) {
          profile.path.fillColor = BuilderElement.clr_by_clr.call(profile, clr);
        }
      }
      if(v) {
        this._scope.select_tool?.('pan');
      }
      else {
        this.register_change(true);
      }
    }
    return _attr._reflected;
  }

}

EditorInvisible.Scheme = Scheme;


/**
 * fake-элемент для допвставок и параметров
 *
 * Created 26.11.2021.
 */

class FakePrmElm {
  constructor(project) {
    this.project = project;
    this.inserts = $p.cat.inserts.find_rows({insert_type: 'Изделие', available: true});
  }

  get inset() {
    const {inserts} = this;
    return {
      inserts: {
        count() {
          return inserts.length;
        },
        unload_column() {
          return inserts;
        }
      },
      valueOf() {
        return this.ref;
      },
      get ref() {
        return $p.utils.blank.guid;
      }
    };
  }

  get ox() {
    return this.project.ox;
  }

  get elm() {
    return 0;
  }

  get _metadata() {
    return {fields: FakePrmElm.fields};
  }

  region(row) {
    return FakePrmElm.region(row, this.project);
  }

}

FakePrmElm.fields = new Proxy({}, {
  get(target, prop) {
    const param = $p.cch.properties.get(prop);
    if(param) {
      const mf = {
        type: param.type,
        synonym: param.name,
      };
      if(param.Editor) {
        mf.Editor = param.Editor;
      }
      if(param.type.types.includes('cat.property_values')) {
        mf.choice_params = [{
          name: 'owner',
          path: param.ref,
        }];
      }
      return mf;
    }
  }
});

/**
 * Proxy-обёртка над строкой допвставок
 * @param row {CatCharacteristicsInsertsRow}
 * @param target {Scheme}
 * @return {Proxy}
 */
FakePrmElm.region = function region(row, target) {
  const {utils, cch: {properties}, enm} = $p;
  return new Proxy(target, {
    get(target, prop, receiver) {
      switch (prop){
      case 'rnum':
        return row.row;
      case 'irow':
        return row;
      case 'inset':
        return row.inset;
      case 'clr':
        return row.clr;
      default:
        let prow;
        if(utils.is_guid(prop)) {
          const param = properties.get(prop);
          if(!param.empty()) {
            return param.extract_pvalue({
              ox: target.ox,
              cnstr: 0,
              elm: {elm: 0},
              origin: row.inset,
              prm_row: {origin: enm.plan_detailing.get()},
            });
          }
          //prow = target.ox.params.find({param: prop, cnstr: 0, region: 0, inset: row.inset});
        }
        return target[prop];
      }
    },

    set(target, prop, val, receiver) {
      switch (prop) {
      case 'clr':
        row.clr = val;
        break;
      default:
        if(utils.is_guid(prop)) {
          const param = properties.get(prop);
          if(!param.empty() && param.set_pvalue) {
            param.set_pvalue({
              ox: target.ox,
              cnstr: 0,
              elm: {elm: 0},
              origin: row.inset,
              value: val,
            });
          }
          else {
            const {params} = target.ox;
            const prow = params.find({param: prop, cnstr: 0, region: 0, inset: row.inset}) || params.add({param: prop, inset: row.inset});
            prow.value = val;
          }
        }
        else {
          target[prop] = val;
        }
      }
      const project = target instanceof Scheme ? target : target.project;
      project.register_change(true);
      return true;
    }
  });
};

Scheme.FakePrmElm = FakePrmElm;


/**
 * ### Разрез
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * Created 24.07.2015
 *
 * @module geometry
 * @submodule sectional
 */

class EditableText extends paper.PointText {

  constructor(props) {
    props.justification = 'center';
    props.fontFamily = consts.font_family;
    super(props);
    this._edit = null;
    this._owner = props._owner;

    !this.project._attr._from_service && this.on({
      mouseenter: this.mouseenter,
      mouseleave: this.mouseleave,
      click: this.click,
    })
  }

  mouseenter(event) {
    this.project._scope.canvas_cursor('cursor-arrow-ruler-light');
  }

  mouseleave(event) {
    this.project._scope.canvas_cursor('cursor-arrow-white');
  }

  click(event) {
    if(!this._edit) {
      const {view, bounds} = this;
      const point = view.projectToView(bounds.topLeft);
      const edit = this._edit = document.createElement('INPUT');
      view.element.parentNode.appendChild(edit);
      edit.style = `left: ${(point.x - 4).toFixed()}px; top: ${(point.y).toFixed()}px; width: 60px; border: none; position: absolute;`;
      edit.onblur = () => setTimeout(() => this.edit_remove());
      edit.onkeydown = this.edit_keydown.bind(this);
      edit.value = this.content.replace(/\D$/, '');
      setTimeout(() => {
        edit.focus();
        edit.select();
      });
    }
  }

  edit_keydown(event) {
    switch (event.code) {
    case 'Escape':
    case 'Tab':
      return this.edit_remove();
    case 'Enter':
    case 'NumpadEnter':
      this.apply(parseFloat(this._edit.value));
      return this.edit_remove();
    case 'Digit0':
    case 'Digit1':
    case 'Digit2':
    case 'Digit3':
    case 'Digit4':
    case 'Digit5':
    case 'Digit6':
    case 'Digit7':
    case 'Digit8':
    case 'Digit9':
    case 'Numpad0':
    case 'Numpad1':
    case 'Numpad2':
    case 'Numpad3':
    case 'Numpad4':
    case 'Numpad5':
    case 'Numpad6':
    case 'Numpad7':
    case 'Numpad8':
    case 'Numpad9':
    case '.':
    case 'Period':
    case 'NumpadDecimal':
    case 'ArrowRight':
    case 'ArrowLeft':
    case 'Delete':
    case 'Backspace':
      break;
    case 'Comma':
    case ',':
      event.code = '.';
      break;
    default:
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }

  edit_remove() {
    if(this._edit){
      this._edit.parentNode && this._edit.parentNode.removeChild(this._edit);
      this._edit = null;
    }
  }

  remove() {
    this.edit_remove();
    super.remove();
  }
}

class AngleText extends EditableText {

  constructor(props) {
    props.fillColor = 'blue';
    super(props);
    this._ind = props._ind;
  }

  apply(value) {

    const {project, generatrix, _attr} = this._owner;
    const {zoom} = _attr;
    const {curves, segments} = generatrix;
    const c1 = curves[this._ind - 1];
    const c2 = curves[this._ind];
    const loc1 = c1.getLocationAtTime(0.9);
    const loc2 = c2.getLocationAtTime(0.1);
    const center = c1.point2;
    let angle = loc2.tangent.angle - loc1.tangent.negate().angle;
    if(angle < 0){
      angle += 360;
    }
    const invert = angle > 180;
    if(invert){
      angle = 360 - angle;
    }
    const ray0 = new paper.Point([c2.point2.x - c2.point1.x, c2.point2.y - c2.point1.y]);
    const ray1 = ray0.clone();
    ray1.angle += invert ? angle - value : value - angle;
    const delta = ray1.subtract(ray0);

    let start;
    for(const segment of segments) {
      if(segment.point.equals(c2.point2)) {
        start = true;
      }
      if(start) {
        segment.point = segment.point.add(delta);
      }
    }
    project.register_change(true);

  }
}

class LenText extends EditableText {

  constructor(props) {
    props.fillColor = 'black';
    super(props);
  }

  apply(value) {
    const {path, segment1, segment2, length} = this._owner;
    const {parent: {_attr, project}, segments} = path;
    const {zoom} = _attr;
    const delta = segment1.curve.getTangentAtTime(1).multiply(value * zoom - length);
    let start;
    for(const segment of segments) {
      if(segment === segment2) {
        start = true;
      }
      if(start) {
        segment.point = segment.point.add(delta);
      }
    }
    project.register_change(true);
  }
}

/**
 * Вид в разрезе. например, водоотливы
 * @param attr {Object} - объект со свойствами создаваемого элемента
 * @constructor
 * @extends BuilderElement
 */
class Sectional extends GeneratrixElement {

  /**
   * Вызывается из конструктора - создаёт пути и лучи
   * @method initialize
   * @private
   */
  initialize(attr) {

    const {project, _attr, _row} = this;
    const h = project.bounds.height + project.bounds.y;

    _attr._rays = {
      b: {},
      e: {},
      clear() {},
    };

    _attr.children = [];

    _attr.zoom = 5;
    _attr.radius = 50;

    if(attr.generatrix) {
      _attr.generatrix = attr.generatrix;
    }
    else {
      if(_row.path_data) {
        _attr.generatrix = new paper.Path(_row.path_data);
      }
      else{
        const first_point = new paper.Point([_row.x1, h - _row.y1]);
        _attr.generatrix = new paper.Path(first_point);
        if(_row.r){
          _attr.generatrix.arcTo(
            first_point.arc_point(_row.x1, h - _row.y1, _row.x2, h - _row.y2,
              _row.r + 0.001, _row.arc_ccw, false), [_row.x2, h - _row.y2]);
        }
        else{
          _attr.generatrix.lineTo([_row.x2, h - _row.y2]);
        }
      }
    }

    _attr.generatrix.strokeColor = 'black';
    _attr.generatrix.strokeWidth = 1;
    _attr.generatrix.strokeScaling = false;
    this.clr = _row.clr.empty() ? $p.job_prm.builder.base_clr : _row.clr;

    this.addChild(_attr.generatrix);

  }

  /**
   * ### Формирует путь разреза
   *
   * @method redraw
   * @return {Sectional}
   * @chainable
   */
  redraw() {
    const {layer, generatrix, _attr, radius} = this;
    const {children, zoom} = _attr;
    const {segments, curves} = generatrix;

    // чистим углы и длины
    for(let child of children){
      child.remove();
    }

    // рисуем углы
    for(let i = 1; i < segments.length - 1; i++){
      this.draw_angle(i);
    }

    // рисуем длины
    for(let curve of curves){
      const loc = curve.getLocationAtTime(0.5);
      const normal = loc.normal.normalize(radius);
      children.push(new LenText({
        point: loc.point.add(normal).add([0, normal.y < 0 ? 0 : normal.y / 2]),
        content: (curve.length / zoom).toFixed(0),
        fontSize: radius * 1.4,
        parent: layer,
        _owner: curve
      }));
    }


    return this;
  }

  /**
   * Рисует дуги и текст в углах
   * @param ind
   */
  draw_angle(ind) {
    const {layer, generatrix, _attr, radius} = this;
    let {children, zoom} = _attr;
    const {curves} = generatrix;
    const c1 = curves[ind - 1];
    const c2 = curves[ind];
    const loc1 = c1.getLocationAtTime(0.9);
    const loc2 = c2.getLocationAtTime(0.1);
    const center = c1.point2;
    let angle = loc2.tangent.angle - loc1.tangent.negate().angle;
    if(angle < 0){
      angle += 360;
    }
    if(angle > 180){
      angle = 360 - angle;
    }

    // радиус зависит от габаритов


    if (c1.length < radius || c2.length < radius || 180 - angle < 1){
      return;
    }

    const from = c1.getLocationAt(c1.length - radius).point;
    const to = c2.getLocationAt(radius).point;
    const end = center.subtract(from.add(to).divide(2)).normalize(radius).negate();
    children.push(new paper.Path.Arc({
      from,
      through: center.add(end),
      to,
      strokeColor: 'grey',
      guide: true,
      parent: layer,
    }));

    // Angle Label
    children.push(new AngleText({
      point: center.add(end.multiply(-2.2)), //.add([0, -end.y / 2])
      content: angle.toFixed(0) + '°',
      fontSize: radius * 1.4,
      parent: layer,
      _owner: this,
      _ind: ind,
    }));

  }

  /**
   * ### Вычисляемые поля в таблице координат
   * @method save_coordinates
   */
  save_coordinates() {

    const {_row, generatrix} = this;

    if(!generatrix){
      return;
    }

    _row.x1 = this.x1;
    _row.y1 = this.y1;
    _row.x2 = this.x2;
    _row.y2 = this.y2;
    _row.path_data = generatrix.pathData;
    _row.nom = this.nom;


    // добавляем припуски соединений
    _row.len = this.length.round(1);

    // устанавливаем тип элемента
    _row.elm_type = this.elm_type;

  }

  /**
   * заглушка для совместимости с профилем
   */
  cnn_point() {

  }

  /**
   * Длина разреза
   * @return {number}
   */
  get length() {
    const {generatrix, zoom} = this._attr;
    return generatrix.length / zoom;
  }

  /**
   * Виртуальные лучи для совместимости с профилем
   * @return {{b: {}, e: {}, clear: (function())}|*|ProfileRays}
   */
  get rays() {
    return this._attr._rays;
  }

  /**
   * Возвращает тип элемента (Водоотлив)
   */
  get elm_type() {
    return $p.enm.elm_types.drainage;
  }

  /**
   * радиус с учетом габаритов
   */
  get radius() {
    let {generatrix, radius} = this._attr;
    const {height, width} = generatrix.bounds;
    const size = Math.max(width - consts.cutoff, height - consts.cutoff);
    if(size > 0) {
      radius += size / 60;
    }
    return radius;
  }
}

EditorInvisible.Sectional = Sectional;
EditorInvisible.EditableText = EditableText;
EditorInvisible.AngleText = AngleText;


/**
 * Болванка пустого класса, чтобы файлы двух веток меньше отличались
 *
 * @module Skeleton
 *
 * Created by Evgeniy Malyarov on 02.05.2020.
 */

class Skeleton {

};



/**
 * ### Модуль Ценообразование
 * Аналог УПзП-шного __ЦенообразованиеСервер__
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 * @module  glob_pricing
 */

/**
 * ### Ценообразование
 *
 * @class Pricing
 * @param $p {MetaEngine} - контекст
 * @static
 */
class Pricing {

  constructor({md, adapters, job_prm}) {

    // подписываемся на событие после загрузки из pouchdb-ram и готовности предопределенных
    md.once('predefined_elmnts_inited', () => {
      const {pouch} = adapters;
      if(pouch.props.user_node || job_prm.use_ram) {
        this.load_prices();
      }
    });

  }

  // грузит в ram цены номенклатуры
  load_prices() {

    const {adapters: {pouch}, job_prm} = $p;
    if(job_prm.use_ram === false) {
      return Promise.resolve();
    }

    // читаем цены из документов установки цен
    return this.by_range({})
      .then(() => {
        // излучаем событие "можно открывать формы"
        pouch.emit('pouch_complete_loaded');
      });
  }

  /**
   * Грузит после паузы при изменении документа установки цен
   * пауза нужна, чтобы не создавать водопад при пакетном изменении документов
   * индекс в этом случае, надо пересчитывать один наз, а не на каждый документ
   * @param [force] {Boolean}
   */
  deffered_load_prices(log, force) {
    const {job_prm: {server}, cat: {nom}, adapters: {pouch}} = $p;
    if(this.prices_timeout) {
      clearTimeout(this.prices_timeout);
      this.prices_timeout = 0;
    }
    if(!force) {
      const defer = (server ? server.defer : 180000) + Math.random() * 10000;
      this.prices_timeout = setTimeout(this.deffered_load_prices.bind(this, log, true), defer);
      return;
    }

    // новые цены пишем в кеш, чтобы на время загрузки не портить номенклатуру
    const cache = new Map();
    return this.by_range({log, cache})
      .then(() => {
        // заменяем старые цены новыми
        for(const onom of nom) {
          if (onom._data) {
            if(onom._data._price) {
              for(const cx in onom._data._price) {
                delete onom._data._price[cx];
              }
            }
            onom._data._price = cache.get(onom);
          }
        }
      })
      .then(() => pouch.emit('nom_price'));
  }

  /**
   * Перестраивает кеш цен номенклатуры по длинному ключу
   * @param startkey
   * @return {Promise.<TResult>|*}
   */
  by_range({bookmark, step=1, limit=60, log=null, cache=null}) {
    const {utils, adapters: {pouch}} = $p;

    (log || console.log)(`load prices: page №${step}`);

    return utils.sleep(40)
      .then(() => pouch.remote.ram.find({
        selector: {
          class_name: 'doc.nom_prices_setup',
          posted: true,
        },
        limit,
        bookmark,
      }))
      .then((res) => {
        step++;
        bookmark = res.bookmark;
        for (const doc of res.docs) {
          this.by_doc(doc, cache);
        }
        return res.docs.length === limit ? this.by_range({bookmark, step, limit, log, cache}) : 'done';
      });
  }

  /**
   * Перестраивает кеш цен номенклатуры по табчасти текущего документа
   * @param goods
   * @param date
   * @param currency
   * @param cache {Map}
   */
  by_doc({goods, date, currency}, cache) {
    const {cat: {nom, currencies}, utils} = $p;
    date = utils.fix_date(date, true);
    currency = currencies.get(currency);
    for(const row of goods) {
      const onom = nom.get(row.nom, true);

      // если в озу нет подходящей номенклатуры или в строке не задан тип цен - уходим
      if (!onom || !onom._data || !row.price_type){
        continue;
      }

      let _price;
      if(cache) {
        if(!cache.has(onom)) {
          cache.set(onom, {})
        }
        _price = cache.get(onom);
      }
      else {
        if (!onom._data._price) {
          onom._data._price = {};
        }
        _price = onom._data._price;
      }

      const key1 = (row.nom_characteristic || utils.blank.guid).valueOf();
      if (!_price[key1]) {
        _price[key1] = {};
      }
      const key2 = row.price_type.valueOf();
      if (!_price[key1][key2]) {
        _price[key1][key2] = [];
      }
      _price[key1][key2].push({currency, date, price: row.price});

      // сразу сортируем массив по датам, т.к. порядок используется в других местах
      _price[key1][key2].sort((a, b) => b.date - a.date);
    }
  }

  /**
   * Возвращает цену номенклатуры по типу цен из регистра пзМаржинальныеКоэффициентыИСкидки
   * Если в маржинальных коэффициентах или номенклатуре указана формула - выполняет
   *
   * Аналог УПзП-шного __ПолучитьЦенуНоменклатуры__
   * @method nom_price
   * @param nom {CatNom}
   * @param characteristic {CatCharacteristics}
   * @param price_type {CatNom_prices_types}
   * @param prm {Object}
   * @param row {Object}
   * @param [clr] {CatClrs}
   * @param [formula] {CatFormulas}
   */
  nom_price(nom, characteristic, price_type, prm, row, clr, formula, date) {

    if (row && prm) {
      const {_owner} = prm.calc_order_row._owner,
        price_prm = {
          price_type: price_type,
          characteristic: characteristic,
          date: date || new Date(),
          currency: _owner.doc_currency
        };

      if (formula && !formula.empty()) {
        price_prm.formula = formula;
      }

      if(clr && !clr.empty()) {
        price_prm.clr = clr;
      }
      else if(!characteristic.clr.empty()){
        price_prm.clr = characteristic.clr;
      }
      price_prm.prm = prm;

      row.price = nom._price(price_prm);
      return row.price;
    }
  }

  /**
   * Возвращает структуру типов цен и КМарж
   * Аналог УПзП-шного __ПолучитьТипЦенНоменклатуры__
   * @method price_type
   * @param prm {Object}
   * @param prm.calc_order_row {TabularSectionRow.doc.calc_order.production}
   */
  price_type(prm) {

    // Рез = Новый Структура("КМарж, КМаржМин, КМаржВнутр, Скидка, СкидкаВнешн, НаценкаВнешн, ТипЦенСебестоимость, ТипЦенПрайс, ТипЦенВнутр,
    // 				|Формула, ФормулаПродажа, ФормулаВнутр, ФормулаВнешн",
    // 				1.9, 1.2, 1.5, 0, 10, 0, ТипЦенПоУмолчанию, ТипЦенПоУмолчанию, ТипЦенПоУмолчанию, "", "", "",);
    const {utils, job_prm, enm, ireg, cat} = $p;
    const empty_formula = cat.formulas.get();
    const empty_price_type = cat.nom_prices_types.get();

    prm.price_type = {
      marginality: 1.9,
      marginality_min: 1.2,
      marginality_internal: 1.5,
      discount: 0,
      discount_external: 10,
      extra_charge_external: 0,
      price_type_first_cost: empty_price_type,
      price_type_sale: empty_price_type,
      price_type_internal: empty_price_type,
      formula: empty_formula,
      sale_formula: empty_formula,
      internal_formula: empty_formula,
      external_formula: empty_formula
    };

    const {calc_order_row} = prm;
    const {nom, characteristic, _owner: {_owner}} = calc_order_row;
    const {partner} = _owner;
    const filter = nom.price_group.empty() ?
        {price_group: nom.price_group} :
        {price_group: {in: [nom.price_group, cat.price_groups.get()]}};
    const ares = [];

    // фильтруем по параметрам
    ireg.margin_coefficients.find_rows(filter, (row) => {
      if(row.key.check_condition({ox: characteristic, calc_order_row})){
        ares.push(row);
      }
    });

    // сортируем по приоритету и ценовой группе
    if(ares.length){
      ares.sort((a, b) => {

        if ((!a.key.empty() && b.key.empty()) || (a.key.priority > b.key.priority)) {
          return -1;
        }
        if ((a.key.empty() && !b.key.empty()) || (a.key.priority < b.key.priority)) {
          return 1;
        }

        if (a.price_group.ref > b.price_group.ref) {
          return -1;
        }
        if (a.price_group.ref < b.price_group.ref) {
          return 1;
        }

        return 0;
      });
      Object.keys(prm.price_type).forEach((key) => {
        prm.price_type[key] = ares[0][key];
      });
    }

    // если для контрагента установлена индивидуальная наценка, подмешиваем её в prm
    partner.extra_fields.find_rows({
      property: job_prm.pricing.dealer_surcharge
    }, (row) => {
      const val = parseFloat(row.value);
      if(val){
        prm.price_type.extra_charge_external = val;
      }
      return false;
    });

    return prm.price_type;
  }

  /**
   * Рассчитывает плановую себестоимость строки документа Расчет
   * Если есть спецификация, расчет ведется по ней. Иначе - по номенклатуре строки расчета
   *
   * Аналог УПзП-шного __РассчитатьПлановуюСебестоимость__
   * @param prm {Object}
   * @param prm.calc_order_row {TabularSectionRow.doc.calc_order.production}
   */
  calc_first_cost(prm) {

    const {marginality_in_spec, price_grp_in_spec} = $p.job_prm.pricing;
    const fake_row = {};
    const {calc_order_row, spec, date} = prm;
    const price_grp = new Map();

    if(!spec) {
      return;
    }

    // пытаемся рассчитать по спецификации
    if(spec.count()){
      spec.forEach((row) => {

        const {_obj, nom, characteristic, clr} = row;

        if(price_grp_in_spec) {
          const {price_group} = nom;
          if(!price_grp.has(price_group)) {
            const pprm = {
              calc_order_row: {
                nom,
                characteristic: calc_order_row.characteristic,
                _owner: calc_order_row._owner,
              }
            };
            this.price_type(pprm);
            price_grp.set(price_group, {
              marginality: pprm.price_type.marginality || 1,
              price_type: pprm.price_type.price_type_first_cost,
              formula: pprm.price_type.formula,
            });
          }
          const {marginality, price_type, formula} = price_grp.get(price_group);
          this.nom_price(nom, characteristic, price_type, prm, _obj, clr, formula, date);
          _obj.amount = _obj.price * _obj.totqty1;
          _obj.amount_marged = _obj.amount * marginality;
        }
        else {
          this.nom_price(nom, characteristic, prm.price_type.price_type_first_cost, prm, _obj, null, prm.price_type.formula, date);
          _obj.amount = _obj.price * _obj.totqty1;
          if(marginality_in_spec){
            fake_row.nom = nom;
            const tmp_price = this.nom_price(
              nom, characteristic, prm.price_type.price_type_sale, prm, fake_row, null, prm.price_type.sale_formula, date);
            _obj.amount_marged = tmp_price * _obj.totqty1;
          }
        }
      });
      calc_order_row.first_cost = spec.aggregate([], ["amount"]).round(2);
    }
    else {
      // расчет себестомиости по номенклатуре строки расчета
      fake_row.nom = calc_order_row.nom;
      fake_row.characteristic = calc_order_row.characteristic;
      calc_order_row.first_cost = this.nom_price(
        fake_row.nom, fake_row.characteristic, prm.price_type.price_type_first_cost, prm, fake_row, null, prm.price_type.formula, date);
    }

    // себестоимость вытянутых строк спецификации в заказ
    prm.order_rows && prm.order_rows.forEach((value) => {
      const fake_prm = {
        spec: value.characteristic.specification,
        calc_order_row: value
      };
      this.price_type(fake_prm);
      this.calc_first_cost(fake_prm);
    });
  }

  /**
   * Рассчитывает стоимость продажи в строке документа Расчет
   *
   * Аналог УПзП-шного __РассчитатьСтоимостьПродажи__
   * @param prm {Object}
   * @param prm.calc_order_row {TabularSectionRow.doc.calc_order.production}
   */
  calc_amount(prm) {

    const {calc_order_row, price_type, first_cost, date} = prm;
    const {marginality_in_spec, not_update} = $p.job_prm.pricing;
    const {rounding, manager} = calc_order_row._owner._owner;

    // если цена уже задана и номенклатура в группе "не обновлять цены" - не обновляем
    if(calc_order_row.price && not_update && (not_update.includes(calc_order_row.nom) || not_update.includes(calc_order_row.nom.parent))) {
      ;
    }
    else {
      const price_cost = marginality_in_spec && prm.spec.count() ?
        prm.spec.aggregate([], ['amount_marged']) :
        this.nom_price(calc_order_row.nom, calc_order_row.characteristic, price_type.price_type_sale, prm, {},null, price_type.sale_formula, date);

      // цена продажи
      if(price_cost) {
        calc_order_row.price = price_cost.round(rounding);
      }
      else if(marginality_in_spec && !first_cost) {
        calc_order_row.price = this.nom_price(
          calc_order_row.nom, calc_order_row.characteristic, price_type.price_type_sale, prm, {},null, price_type.sale_formula, date);
      }
      else {
        calc_order_row.price = (calc_order_row.first_cost * price_type.marginality).round(rounding);
      }
    }

    // КМарж в строке расчета
    calc_order_row.marginality = calc_order_row.first_cost ?
      calc_order_row.price * ((100 - calc_order_row.discount_percent) / 100) / calc_order_row.first_cost : 0;


    // Рассчитаем цену и сумму ВНУТР или ДИЛЕРСКУЮ цену и скидку
    let extra_charge = calc_order_row.extra_charge_external || $p.wsql.get_user_param('surcharge_internal', 'number');
    // если пересчет выполняется менеджером, используем наценку по умолчанию
    if(!manager.partners_uids.length || !extra_charge) {
      extra_charge = price_type.extra_charge_external || 0;
    }

    // TODO: учесть формулу
    calc_order_row.price_internal = (calc_order_row.price * (100 - calc_order_row.discount_percent) / 100 * (100 + extra_charge) / 100).round(rounding);

    // Эмулируем событие окончания редактирования, чтобы единообразно пересчитать строку табчасти
    !prm.hand_start && calc_order_row.value_change('price', {}, calc_order_row.price, true);

    // Цены и суммы вытянутых строк спецификации в заказ
    prm.order_rows && prm.order_rows.forEach((value) => {
      const fake_prm = {
        spec: value.characteristic.specification,
        calc_order_row: value,
        date,
      };
      this.price_type(fake_prm);
      this.calc_amount(fake_prm);
    });

  }

  /**
   * В случае нулевых цен, дополняет в спецификацию строку ошибки
   * @param prm
   */
  check_prices({calc_order_row}) {
    const {pricing: {marginality_in_spec}, nom: {empty_price}} = $p.job_prm;
    let err;

    calc_order_row.characteristic.specification.forEach((row) => {
      const {_obj, nom, characteristic} = row;
      if(_obj.totqty1 && !nom.is_procedure && !nom.is_service) {
        // проверяем цену продужи или себестоимости
        if((marginality_in_spec && !_obj.amount_marged) || (!marginality_in_spec && !_obj.price)){
          err = row;
          return false;
        }
      }
    });
    return err;
  }

  /**
   * Пересчитывает сумму из валюты в валюту
   * @param amount {Number} - сумма к пересчету
   * @param date {Date} - дата курса
   * @param from - исходная валюта
   * @param [to] - конечная валюта
   * @return {Number}
   */
  from_currency_to_currency (amount, date, from, to) {
    return from.to_currency(amount, date, to);
  }


}


/**
 * ### Модуль Ценообразование
 * Аналог УПзП-шного __ЦенообразованиеСервер__ в контексте MetaEngine
 */
$p.pricing = new Pricing($p);


/**
 * Аналог УПзП-шного __ПостроительИзделийСервер__
 *
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module  glob_products_building
 * Created 26.05.2015
 */

class ProductsBuilding {

  constructor(listen) {

    let added_cnn_spec,
      ox,
      spec,
      constructions,
      coordinates,
      cnn_elmnts,
      glass_specification,
      params;

    //this._editor_invisible = null;


    /**
     * СтрокаСоединений
     * @param elm1
     * @param elm2
     * @return {Number|DataObj}
     */
    function cnn_row(elm1, elm2) {
      const {cnn_nodes} = ProductsBuilding;
      let res = cnn_elmnts.find_rows({elm1: elm1, elm2: elm2, node1: cnn_nodes, node2: cnn_nodes});
      if(res.length) {
        return res[0].row;
      }
      res = cnn_elmnts.find_rows({elm1: elm2, elm2: elm1, node1: cnn_nodes, node2: cnn_nodes});
      if(res.length) {
        return res[0].row;
      }
      return 0;
    }

    /**
     * НадоДобавитьСпецификациюСоединения
     * @param cnn
     * @param elm1
     * @param elm2
     */
    function cnn_need_add_spec(cnn, elm1, elm2, point) {
      const {short, long, t, xx} = $p.enm.cnn_types;
      const cnn_type = cnn && cnn.cnn_type;
      // соединения крест в стык обрабатываем по координатам, остальные - по паре элементов
      if(cnn_type === xx) {
        if(!added_cnn_spec.points) {
          added_cnn_spec.points = [];
        }
        for (let p of added_cnn_spec.points) {
          if(p.is_nearest(point, true)) {
            return false;
          }
        }
        added_cnn_spec.points.push(point);
        return true;
      }
      else if(cnn_type === t || cnn_type === long || cnn_type === short) {
        return true;
      }
      else if(!cnn || !elm1 || !elm2 || added_cnn_spec[elm1] == elm2 || added_cnn_spec[elm2] == elm1) {
        return false;
      }
      added_cnn_spec[elm1] = elm2;
      return true;
    }


    /**
     * ДополнитьСпецификациюСпецификациейСоединения
     * @method cnn_add_spec
     * @param cnn {_cat.Cnns}
     * @param elm {BuilderElement}
     * @param len_angl {Object}
     */
    function cnn_add_spec(cnn, elm, len_angl, cnn_other, elm2) {
      if(!cnn) {
        return;
      }
      const {enm: {predefined_formulas: {gb_short, gb_long, w2}, cnn_types}, CatInserts, utils} = $p;
      const sign = cnn.cnn_type == cnn_types.ii ? -1 : 1;
      const {new_spec_row, calc_count_area_mass} = ProductsBuilding;

      cnn.filtered_spec({elm, elm2, len_angl, ox}).forEach((row_base) => {

        const {nom} = row_base;

        // TODO: nom может быть вставкой - в этом случае надо разузловать
        if(nom instanceof CatInserts) {
          if(![gb_short, gb_long].includes(row_base.algorithm) && len_angl && (row_base.sz || row_base.coefficient)) {
            const tmp_len_angl = Object.assign({}, len_angl);
            tmp_len_angl.len = (len_angl.len - sign * 2 * row_base.sz) * (row_base.coefficient || 0.001);
            if(row_base.algorithm === w2 && elm2) {

            }
            nom.calculate_spec({elm, elm2, len_angl: tmp_len_angl, own_row: row_base, ox, spec});
          }
          else {
            nom.calculate_spec({elm, elm2, len_angl, own_row: row_base, ox, spec});
          }
        }
        else {

          const row_spec = new_spec_row({row_base, origin: len_angl.origin || cnn, elm, nom, spec, ox, len_angl});

          // рассчитаем количество
          if(nom.is_pieces) {
            if(!row_base.coefficient) {
              row_spec.qty = row_base.quantity;
            }
            else {
              row_spec.qty = ((len_angl.len - sign * 2 * row_base.sz) * row_base.coefficient * row_base.quantity - 0.5)
                .round(nom.rounding_quantity);
            }
          }
          else {
            row_spec.qty = row_base.quantity;

            // если указано cnn_other, берём не размер соединения, а размеры предыдущего и последующего
            if(![gb_short, gb_long].includes(row_base.algorithm) && (row_base.sz || row_base.coefficient)) {
              let sz = row_base.sz, finded, qty;
              if(cnn_other) {
                cnn_other.specification.find_rows({nom}, (row) => {
                  sz += row.sz;
                  qty = row.quantity;
                  return !(finded = true);
                });
              }
              if(!finded) {
                if(row_base.algorithm === w2 && elm2) {

                }
                else {
                  sz *= 2;
                }
              }
              if(!row_spec.qty && finded && len_angl.art1) {
                row_spec.qty = qty;
              }
              row_spec.len = (len_angl.len - sign * sz) * (row_base.coefficient || 0.001);
            }
          }

          // если указана формула - выполняем
          if(!row_base.formula.empty()) {
            const qty = row_base.formula.execute({
              ox,
              elm,
              len_angl,
              cnstr: 0,
              inset: utils.blank.guid,
              row_cnn: row_base,
              row_spec: row_spec
            });
            // если формула является формулой условия, используем результат, как фильтр
            if(row_base.formula.condition_formula && !qty){
              row_spec.qty = 0;
            }
          }

          // визуализация svg-dx
          if(row_spec.dop === -1 && len_angl.curr && nom.visualization.mode === 3) {
            const {sub_path, outer, profile: {generatrix}} = len_angl.curr;
            const pt = generatrix.getNearestPoint(sub_path[outer ? 'lastSegment' : 'firstSegment'].point);
            row_spec.width = generatrix.getOffsetOf(pt) / 1000;
            if(outer) {
              row_spec.alp1 = -1;
            }
          }
          else {
            calc_count_area_mass(row_spec, spec, len_angl, row_base.angle_calc_method);
          }
        }

      });
    }

    /**
     * Спецификации фурнитуры
     * @param contour {Contour}
     */
    function furn_spec(contour) {

      const {ContourNested} = EditorInvisible;
      // у рамных контуров и вложенных изделий, фурнитуры не бывает
      if(!contour.parent || contour instanceof ContourNested || contour.parent instanceof ContourNested || contour._ox !== spec._owner) {
        return false;
      }

      // кеш сторон фурнитуры
      const {furn_cache, furn} = contour;
      const {new_spec_row, calc_count_area_mass} = ProductsBuilding;

      // проверяем, подходит ли фурнитура под геометрию контура
      if(!furn_cache.profiles.length || !furn_check_opening_restrictions(contour, furn_cache)) {
        return;
      }

      // уточняем высоту ручки, т.к. от неё зависят координаты в спецификации
      contour.update_handle_height(furn_cache);

      // получаем спецификацию фурнитуры и переносим её в спецификацию изделия
      const blank_clr = $p.cat.clrs.get();
      const {cnstr} = contour;
      furn.furn_set.get_spec(contour, furn_cache).forEach((row) => {
        const elm = {elm: -cnstr, clr: blank_clr};
        const row_spec = new_spec_row({elm, row_base: row, origin: row.origin, specify: row.specify, spec, ox});

        if(row.is_procedure_row) {
          row_spec.elm = row.handle_height_min;
          row_spec.len = row.coefficient / 1000;
          row_spec.qty = 0;
          if(row.quantity && row.nom.demand.count()) {
            row_spec.totqty = row.quantity;
            row_spec.totqty1 = row.quantity;
          }
          else {
            row_spec.totqty = 1;
            row_spec.totqty1 = 1;
          }
        }
        else if((!row.contraction_option.empty() || row.contraction || row.coefficient) && !row.nom.is_pieces) {
          const {ФиксированнаяДлина, ОтВысотыРучки, ОтДлиныСтороныМинусВысотыРучки, Выражение} = row.contraction_option._manager;
          const profile = contour.profile_by_furn_side(row.side, furn_cache);
          const len = profile ? profile._row.len : 0;
          const coefficient = row.coefficient || 0.001;

          switch (row.contraction_option) {
          case ФиксированнаяДлина:
            row_spec.len = row.contraction * coefficient;
            break;
          case ОтВысотыРучки:
            row_spec.len = (contour.h_ruch - row.contraction) * coefficient;
            break;
          case ОтДлиныСтороныМинусВысотыРучки:
            row_spec.len = (len - contour.h_ruch - row.contraction) * coefficient;
            break;
          case Выражение:
            if(typeof row.contraction === 'string') {
              try {
                row_spec.len = eval(row.contraction) * coefficient;
                break;
              }
              catch (e) {}
            }
          default:
            row_spec.len = (len - row.contraction) * coefficient;
          }
          row_spec.qty = row.quantity;
          calc_count_area_mass(row_spec, spec);
        }
        else {
          row_spec.qty = row.quantity * (!row.coefficient ? 1 : row.coefficient);
          calc_count_area_mass(row_spec, spec);
        }
      });

      // если задано ограничение по массе - проверяем
      if(furn.furn_set.flap_weight_max && ox.elm_weight(-cnstr) > furn.furn_set.flap_weight_max) {
        // Визуализируем все стороны
        const row_base = {clr: blank_clr, nom: $p.job_prm.nom.flap_weight_max};
        contour.profiles.forEach(elm => {
          new_spec_row({elm, row_base, origin: furn, spec, ox});
        });
      }

      // ограничения размеров по графикам
      // const checks = ox.sys.graph_restrictions(new paper.Point(contour.bounds.width, contour.bounds.height).divide(10), contour.is_clr());
      // if(Object.keys(checks)) {
      //   console.table(checks);
      // }
    }

    /**
     * Проверяет ограничения открывания, добавляет визуализацию ошибок
     * @param contour {Contour}
     * @param cache {Object}
     * @return {boolean}
     */
    function furn_check_opening_restrictions(contour, cache) {
      const err = contour.open_restrictions_err({cache});
      if(err.length) {
        const {new_spec_row} = ProductsBuilding;
        const {cat: {clrs}, job_prm: {nom}} = $p;
        const row_base = {clr: clrs.get(), nom: nom.furn_error};
        err.forEach(elm => {
          new_spec_row({elm, row_base, origin: contour.furn, spec, ox});
        });
        return false;
      }
      return true;
    }

    /**
     * Спецификации соединений примыкающих профилей
     * @param elm {Profile}
     */
    function cnn_spec_nearest(elm) {
      const nearest = elm.nearest();
      if(nearest && nearest._row.clr != $p.cat.clrs.ignored() && elm._attr._nearest_cnn) {
        cnn_add_spec(elm._attr._nearest_cnn, elm, {
          angle: 0,
          alp1: 0,
          alp2: 0,
          len: elm._attr._len || elm.length,
          origin: cnn_row(elm.elm, nearest.elm)
        }, null, nearest);
      }
    }

    /**
     * Спецификация профиля
     * @param elm {Profile}
     */
    function base_spec_profile(elm, totqty0) {

      const {_row, rays, layer, segms} = elm;
      const {enm: {angle_calculating_ways, cnn_types, predefined_formulas: {w2}}, cat, utils: {blank}} = $p;
      if(_row.nom.empty() || _row.nom.is_service || _row.nom.is_procedure || _row.clr == cat.clrs.ignored()) {
        return;
      }

      if(segms?.length) {
        // если профиль разбит на связки, добавляем их спецификации, вместо спецификации самого профиля
        segms.forEach(base_spec_profile);
      }
      else {
        const {b, e} = rays;

        if(!b.cnn || !e.cnn) {
          return;
        }
        b.check_err();
        e.check_err();

        const prev = b.profile;
        const next = e.profile;
        const row_cnn_prev = b.cnn && b.cnn.main_row(elm);
        const row_cnn_next = e.cnn && e.cnn.main_row(elm);
        const {new_spec_row, calc_count_area_mass} = ProductsBuilding;

        let row_spec;

        // добавляем строку спецификации
        const row_cnn = row_cnn_prev || row_cnn_next;
        if(row_cnn) {

          row_spec = new_spec_row({elm, row_base: row_cnn, nom: _row.nom, origin: cnn_row(_row.elm, prev ? prev.elm : 0), spec, ox});
          row_spec.qty = row_cnn.quantity;

          // уточняем размер
          const seam = angle_calculating_ways.СварнойШов;
          const d45 = Math.sin(Math.PI / 4);
          const dprev = row_cnn_prev ? (
            row_cnn_prev.angle_calc_method == seam && _row.alp1 > 0 ? row_cnn_prev.sz * d45 / Math.sin(_row.alp1 / 180 * Math.PI) : row_cnn_prev.sz
          ) : 0;
          const dnext = row_cnn_next ? (
            row_cnn_next.angle_calc_method == seam && _row.alp2 > 0 ? row_cnn_next.sz * d45 / Math.sin(_row.alp2 / 180 * Math.PI) : row_cnn_next.sz
          ) : 0;

          const k001 = 0.001;
          row_spec.len = (_row.len - dprev - dnext)
            * ((row_cnn_prev ? row_cnn_prev.coefficient : k001) + (row_cnn_next ? row_cnn_next.coefficient : k001)) / 2;
          if(row_cnn_prev && row_cnn_prev.algorithm === w2) {
            row_spec.len += prev.width * k001;
          }
          if(row_cnn_next && row_cnn_next.algorithm === w2) {
            row_spec.len += next.width * k001;
          }

          // profile._len - то, что получится после обработки
          // row_spec.len - сколько взять (отрезать)
          elm._attr._len = _row.len;
          _row.len = (_row.len
              - (!row_cnn_prev || row_cnn_prev.angle_calc_method == seam ? 0 : row_cnn_prev.sz)
              - (!row_cnn_next || row_cnn_next.angle_calc_method == seam ? 0 : row_cnn_next.sz))
            * 1000 * ( (row_cnn_prev ? row_cnn_prev.coefficient : k001) + (row_cnn_next ? row_cnn_next.coefficient : k001)) / 2;

          // припуск для гнутых элементов
          if(!elm.is_linear()) {
            row_spec.len = row_spec.len + _row.nom.arc_elongation * k001;
          }

          // дополнительная корректировка формулой - здесь можно изменить размер, номенклатуру и вообще, что угодно в спецификации
          if(row_cnn_prev && !row_cnn_prev.formula.empty()) {
            row_cnn_prev.formula.execute({
              ox: ox,
              elm: elm,
              cnstr: 0,
              inset: blank.guid,
              row_cnn: row_cnn_prev,
              row_spec: row_spec
            });
          }
          else if(row_cnn_next && !row_cnn_next.formula.empty()) {
            row_cnn_next.formula.execute({
              ox: ox,
              elm: elm,
              cnstr: 0,
              inset: blank.guid,
              row_cnn: row_cnn_next,
              row_spec: row_spec
            });
          }

          // РассчитатьКоличествоПлощадьМассу
          const angle_calc_method_prev = row_cnn_prev ? row_cnn_prev.angle_calc_method : null;
          const angle_calc_method_next = row_cnn_next ? row_cnn_next.angle_calc_method : null;
          const {СоединениеПополам: s2, Соединение: s1} = angle_calculating_ways;
          calc_count_area_mass(
            row_spec,
            spec,
            _row,
            angle_calc_method_prev,
            angle_calc_method_next,
            angle_calc_method_prev == s2 || angle_calc_method_prev == s1 ? prev.generatrix.angle_between(elm.generatrix, b.point) : 0,
            angle_calc_method_next == s2 || angle_calc_method_next == s1 ? elm.generatrix.angle_between(next.generatrix, e.point) : 0,
            totqty0,
          );
        }

        // добавляем спецификации соединений
        const len_angl = {
          angle: 0,
          alp1: prev ? prev.generatrix.angle_between(elm.generatrix, elm.b) : 90,
          alp2: next ? elm.generatrix.angle_between(next.generatrix, elm.e) : 90,
          len: row_spec ? row_spec.len * 1000 : _row.len,
          art1: false,
          art2: true,
          node: 'e',
        };
        const sl_types = [cnn_types.long, cnn_types.short];
        const other_side_types = [cnn_types.t, cnn_types.i, cnn_types.xx, ...sl_types];
        if(cnn_need_add_spec(b.cnn, _row.elm, prev ? prev.elm : 0, b.point)) {

          len_angl.angle = len_angl.alp2;

          // для ТОбразного, Незамкнутого контура и short-long, надо рассчитать еще и с другой стороны
          if(e.cnn && sl_types.includes(e.cnn.cnn_type)) {
            cnn_add_spec(e.cnn, elm, len_angl, b.cnn, next);
          }
          else if(other_side_types.includes(b.cnn.cnn_type)) {
            if(!other_side_types.includes(e.cnn.cnn_type) || cnn_need_add_spec(e.cnn, next ? next.elm : 0, _row.elm, e.point)) {
              cnn_add_spec(e.cnn, elm, len_angl, b.cnn, next);
            }
          }
          else {
            // для угловых, добавляем из e.cnn строки с {art2: true}, а для внешних с {art2: false}
            if(!e.profile_point || (next.rays[e.profile_point] && next.rays[e.profile_point].profile !== elm)) {
              len_angl.art2 = false;
              len_angl.art1 = true;
            }
            cnn_add_spec(e.cnn, elm, len_angl, b.cnn, next);
          }

          // спецификацию с предыдущей стороны рассчитваем всегда
          len_angl.angle = len_angl.alp1;
          len_angl.art2 = false;
          len_angl.art1 = true;
          len_angl.node = 'b';
          cnn_add_spec(b.cnn, elm, len_angl, e.cnn, prev);
        }

        // спецификация вставки
        elm.inset.calculate_spec({elm, ox, spec});
      }

      // если у профиля есть примыкающий родительский элемент, добавим спецификацию II соединения
      cnn_spec_nearest(elm);

      // если у профиля есть доборы, добавляем их спецификации
      elm.addls.forEach(base_spec_profile);

      // если у профиля есть примыкания, добавляем их спецификации
      elm.adjoinings.forEach((elm) => {
        elm.inset.calculate_spec({elm, ox, spec});
        cnn_spec_nearest(elm);
      });

      // спецификация вложенных в элемент вставок
      // во время расчетов возможна подмена объекта спецификации
      const spec_tmp = spec;
      ox.inserts.find_rows({cnstr: -elm.elm}, ({inset, clr, region}) => {

        // если во вставке указано создавать продукцию, создаём
        if(inset.is_order_row_prod({ox, elm})) {
          const cx = Object.assign(ox.find_create_cx(elm.elm, inset.ref), inset.contour_attrs(elm.layer));
          ox._order_rows.push(cx);
          spec = cx.specification.clear();
        }
        else {
          spec = spec_tmp;
        }

        len_angl.origin = inset;
        len_angl.angle = elm.angle_hor;
        len_angl.cnstr = -elm.elm;
        delete len_angl.art1;
        delete len_angl.art2;
        delete len_angl.node;
        if(region) {
          inset.region_spec({elm, len_angl, ox, spec, region});
        }
        else {
          inset.calculate_spec({elm, len_angl, ox, spec});
        }


      });
      spec = spec_tmp;
    }

    /**
     * Спецификация сечения (водоотлива)
     * @param elm {Sectional}
     */
    function base_spec_sectional(elm) {

      const {_row, _attr, inset, layer} = elm;

      if(_row.nom.empty() || _row.nom.is_service || _row.nom.is_procedure || _row.clr == $p.cat.clrs.ignored()) {
        return;
      }

      // спецификация вставки
      inset.calculate_spec({elm, ox});

      // спецификация вложенных в элемент вставок
      // во время расчетов возможна подмена объекта спецификации
      const spec_tmp = spec;
      ox.inserts.find_rows({cnstr: -elm.elm}, ({inset, clr}) => {

        // если во вставке указано создавать продукцию, создаём
        if(inset.is_order_row_prod({ox, elm})) {
          const cx = Object.assign(ox.find_create_cx(elm.elm, inset.ref), inset.contour_attrs(layer));
          ox._order_rows.push(cx);
          spec = cx.specification.clear();
        }
        else {
          spec = spec_tmp;
        }

        // рассчитаем спецификацию вставки
        const len_angl = {
          angle: 0,
          alp1: 0,
          alp2: 0,
          len: 0,
          origin: inset,
          cnstr: -elm.elm
        };
        inset.calculate_spec({elm, len_angl, ox, spec});

      });

      // восстанавливаем исходную ссылку объекта спецификации
      spec = spec_tmp;

    }

    /**
     * Спецификация заполнения
     * @param elm {Filling}
     */
    function base_spec_glass(elm) {

      const {profiles, imposts, _row} = elm;
      const {utils: {blank}, cat: {clrs}, cch} = $p;

      if(_row.clr == clrs.ignored()) {
        return;
      }

      const glength = profiles.length;

      // для всех рёбер заполнения
      for (let i = 0; i < glength; i++) {
        const curr = profiles[i];

        if(curr.profile && curr.profile._row.clr == clrs.ignored()) {
          return;
        }

        const prev = (i == 0 ? profiles[glength - 1] : profiles[i - 1]);
        const next = (i == glength - 1 ? profiles[0] : profiles[i + 1]);
        const row_cnn = cnn_elmnts.find({elm1: _row.elm, elm2: curr.profile.elm});

        let angle_hor = (new paper.Point(curr.e.x - curr.b.x, curr.b.y - curr.e.y)).angle.round(2);
        if(angle_hor < 0) {
          angle_hor += 360;
        }

        const len_angl = {
          angle_hor,
          angle: 0,
          alp1: prev.profile.generatrix.angle_between(curr.profile.generatrix, curr.b),
          alp2: curr.profile.generatrix.angle_between(next.profile.generatrix, curr.e),
          len: row_cnn ? row_cnn.aperture_len : 0,
          origin: cnn_row(_row.elm, curr.profile.elm),
          prev,
          next,
          curr,
        };

        // добавляем спецификацию соединения рёбер заполнения с профилем
        (len_angl.len > 3) && cnn_add_spec(curr.cnn, curr.profile, len_angl, null, elm);

      }

      // во время расчетов возможна подмена объекта спецификации
      const spec_tmp0 = spec;
      let spec_tmp = spec;
      if(elm.inset.is_order_row_prod({ox, elm})) {
        const {bounds} = elm;
        const attrs = {
          calc_order: ox.calc_order,
          owner: elm.nom,
          clr: elm.clr,
          s: elm.area,
          x: bounds.width,
          y: bounds.height,
        };
        const cx = Object.assign(ox.find_create_cx(elm.elm, blank.guid), attrs);
        ox._order_rows.push(cx);
        spec = cx.specification.clear();
      }

      // учтём параметр without_glasses
      const param = cch.properties.predefined('without_glasses');
      const totqty0 = Boolean(param && ox.params.find({param, value: true}));

      // добавляем спецификацию вставки в заполнение
      elm.inset.calculate_spec({elm, ox, spec, totqty0});

      // для всех раскладок заполнения
      for(const lay of imposts) {
        base_spec_profile(lay, totqty0)
      }

      // спецификация вложенных в элемент вставок
      ox.inserts.find_rows({cnstr: -elm.elm}, ({inset, clr}) => {
        // если во вставке указано создавать продукцию, создаём
        const len_angl = {
          angle: 0,
          alp1: 0,
          alp2: 0,
          len: 0,
          origin: inset,
          cnstr: -elm.elm
        };
        if(inset.is_order_row_prod({ox, elm})) {
          const cx = Object.assign(ox.find_create_cx(elm.elm, inset.ref), inset.contour_attrs(elm.layer));
          ox._order_rows.push(cx);
          spec = cx.specification.clear();
        }
        else {
          spec = spec_tmp;
        }
        inset.calculate_spec({elm, len_angl, ox, spec, totqty0});
      });

      // возвращаем указатель на спецификацию на место
      spec = spec_tmp0;
    }


    /**
     * Спецификация вставок в контур
     * @param contour
     */
    function inset_contour_spec(contour) {

      // во время расчетов возможна подмена объекта спецификации
      const spec_tmp = spec;

      ox.inserts.find_rows({cnstr: contour.cnstr}, ({inset, clr}) => {

        // если во вставке указано создавать продукцию, создаём
        if(inset.is_order_row_prod({ox, contour})) {
          const cx = Object.assign(ox.find_create_cx(-contour.cnstr, inset.ref), inset.contour_attrs(contour));
          ox._order_rows.push(cx);
          spec = cx.specification.clear();
        }
        else {
          spec = spec_tmp;
        }

        // рассчитаем спецификацию вставки
        const elm = {
          _row: {},
          elm: 0,
          clr: clr,
          layer: contour,
        };
        const len_angl = {
          angle: 0,
          alp1: 0,
          alp2: 0,
          len: 0,
          origin: inset,
          cnstr: contour.cnstr
        };
        inset.calculate_spec({elm, len_angl, ox, spec});

      });

      // восстанавливаем исходную ссылку объекта спецификации
      spec = spec_tmp;
    }

    /**
     * Основная cпецификация по соединениям и вставкам таблицы координат
     * @param scheme {Scheme}
     */
    function base_spec(scheme) {

      const {Contour, Filling, Sectional, Profile, ProfileParent, ProfileConnective} = $p.Editor;

      // сбрасываем структуру обработанных соединений
      added_cnn_spec = {};

      // во время расчетов возможна подмена объекта спецификации
      const spec_tmp = spec;
      function prod_row(contour) {
        // если текущий слой должен формировать виртуальное изделие - создаём
        const layer = contour.prod_layer();
        if(layer) {
          const cx = ox.find_create_cx(-layer.cnstr, null, true, ox._order_rows);
          spec = cx.specification;
          if(!spec.count()) {
            cx.sys = ox.sys;
            cx.clr = ox.clr;
            const {bounds} = layer;
            cx.x = bounds.width;
            cx.y = bounds.height;
            cx.s = (bounds.area / 1e6).round(3);
            cx.calc_order_row.nom = cx.prod_nom;
            cx.calc_order_row.ordn = ox;
            cx.prod_name();
            if(contour === layer) {
              cx.svg = layer.get_svg();
            }
          }
        }
      }

      // для всех контуров изделия
      const contours = scheme.getItems({class: Contour});
      for (const contour of contours.reverse()) {

        // пропускаем слои вложенных изделий
        if(contour._ox !== ox) {
          continue;
        }

        prod_row(contour);

        // для всех профилей контура
        for (const elm of contour.profiles) {
          !elm.virtual && base_spec_profile(elm);
        }

        for (const elm of contour.children) {
          if(elm instanceof Filling) {
            // для всех заполнений контура
            base_spec_glass(elm);
          }
          else if(elm instanceof Sectional) {
            // для всех разрезов (водоотливов)
            base_spec_sectional(elm);
          }
          else if(elm instanceof Compound) {
            // для всех поверхностей (составных путей)
            //base_spec_glass(elm);
          }
        }

        // спецификация вставок в контур
        inset_contour_spec(contour);

        // восстанавливаем исходную ссылку объекта спецификации
        spec = spec_tmp;
      }

      // фурнитуру обсчитываем в отдельном цикле, т.к. могут потребоваться свойства соседних слоёв
      for (const contour of contours) {
        prod_row(contour);
        furn_spec(contour);
        // восстанавливаем исходную ссылку объекта спецификации
        spec = spec_tmp;
      }

      // для всех соединительных профилей
      for (const elm of scheme.l_connective.children) {
        if(elm instanceof ProfileConnective) {
          base_spec_profile(elm);
        }
      }

      // спецификация вставок в изделие
      inset_contour_spec({
        cnstr: 0,
        project: scheme,
        get perimeter() {
          return this.project.perimeter;
        },
        glasses() {
          return this.project.glasses;
        }
      });

    }

    this.cnn_add_spec = cnn_add_spec;

    /**
     * Пересчет спецификации при записи изделия
     */
    this.recalc = function recalc(scheme, attr) {

      // console.time('base_spec');
      // console.profile();

      // ссылки для быстрого доступа к свойствам объекта продукции
      ox = scheme.ox;
      spec = ox.specification;
      constructions = ox.constructions;
      coordinates = ox.coordinates;
      cnn_elmnts = ox.cnn_elmnts;
      glass_specification = ox.glass_specification;
      params = ox.params;

      // чистим спецификацию
      spec.clear();

      // массив продукций к добавлению в заказ
      ox._order_rows = [];

      // рассчитываем базовую сецификацию
      base_spec(scheme);

      // сворачиваем
      spec.group_by('nom,clr,characteristic,len,width,s,elm,alp1,alp2,origin,specify,dop', 'qty,totqty,totqty1');


      // console.timeEnd('base_spec');
      // console.profileEnd();

      // информируем мир об окончании расчета координат
      scheme.draw_visualization();
      Promise.resolve().then(() => scheme._scope && !attr.silent && scheme._scope.eve.emit('coordinates_calculated', scheme, attr));


      // производим корректировку спецификации с возможным вытягиванием строк в заказ и удалением строк из заказа
      // внутри корректировки будут рассчитаны цены продажи и плановой себестоимости
      if(ox.calc_order_row) {
        $p.spec_building.specification_adjustment({
          scheme: scheme,
          calc_order_row: ox.calc_order_row,
          spec: spec,
        }, true);
        if(attr.save) {
          ox.calc_order_row.s = ox.s;
        }
        // взводим в заказе признак изменённости продукции, чтобы пересчитать перед записью заказа вставки в заказ
        ox.calc_order._data._sub_recalc = true;
      }

      // информируем мир о завершении пересчета
      if(attr.snapshot) {
        scheme.notify(scheme, 'scheme_snapshot', attr);
      }

      function finish() {
        delete scheme._attr._saving;
        ox._data._loading = false;
      }

      // информируем мир о записи продукции
      if(attr.save) {

        // сохраняем картинку вместе с изделием
        if(attr.svg !== false) {
          ox.svg = scheme.get_svg();
        }

        return this.saver({ox, scheme, attr, finish})
          .catch((err) => {

            finish();

            if(err.msg && err.msg._shown) {
              return;
            }

            let text = err.message || err;
            if(ox._data && ox._data._err) {
              if(typeof ox._data._err === 'object') {
                !attr.silent && $p.md.emit('alert', Object.assign({obj: ox}, ox._data._err));
                delete ox._data._err;
                return;
              }
              text += `\n${ox._data._err}`;
              delete ox._data._err;
            }

            !attr.silent && $p.md.emit('alert', {type: 'alert-error', obj: ox, text});

          });
      }
      else {
        return Promise.resolve(finish());
      }

    };

  }

  /**
   * Выделяем сохранялку продукции в отдельный метод
   * чтобы его было проще переопределить снаружи
   */
  saver({ox, scheme, attr, finish}) {
    const {calc_order} = ox;
    calc_order.characteristic_saved(scheme, attr);
    return (attr.save === 'recalc' ? Promise.resolve() : calc_order.save())
      .then(() => {
        finish();
        scheme._scope && !attr.silent && scheme._scope.eve.emit('characteristic_saved', scheme, attr);
      })
      .then(() => ox);
  }

  /**
   * Проверяет соответствие параметров отбора параметрам изделия
   * @param params {TabularSection} - табчасть параметров вставки или соединения
   * @param row_spec {TabularSectionRow}
   * @param [count_calc_method] {EnumObj.<count_calculating_ways>} - способ расчёта количества
   * @param elm {BuilderElement}
   * @param [cnstr] {Number} - номер конструкции или элемента
   * @return {boolean}
   */
  static check_params({params, row_spec, count_calc_method, ...other}) {

    let ok = true;

    // режем параметры по элементу сначала строим Map ИЛИ
    let {_or} = row_spec;
    if(!_or) {
      _or = new Map();
      const relm = row_spec.elm;
      for(const {_row} of params._obj.filter((row) => row.elm === relm)) {
        if(!_or.has(_row.area)) {
          _or.set(_row.area, []);
        }
        _or.get(_row.area).push(_row);
      }
      row_spec._or = _or;
    }

    for(const grp of _or.values()) {
      let grp_ok = true;
      for (const prm_row of grp) {

        // перед проверкой условий выясняем, примерима ли проверка к данному способу расчёта
        const {use} = prm_row.param;
        if(count_calc_method && !use.find({count_calc_method})) {
          continue;
        }
        if(!count_calc_method && use.count() && !use.find({count_calc_method: $p.enm.count_calculating_ways.get()})) {
          continue;
        }

        // выполнение условия рассчитывает объект CchProperties
        grp_ok = prm_row.param.check_condition({row_spec, prm_row, ...other});
        // если строка условия в ключе не выполняется, то дальше проверять его условия смысла нет
        if (!grp_ok) {
          break;
        }
      }
      ok = grp_ok;
      if(ok) {
        break;
      }
    }

    return ok;
  }

  /**
   * Добавляет или заполняет строку спецификации
   * @param row_spec
   * @param elm
   * @param row_base
   * @param spec
   * @param [nom]
   * @param [origin]
   * @return {TabularSectionRow.cat.characteristics.specification}
   */
  static new_spec_row({row_spec, elm, row_base, nom, origin, specify, spec, ox, len_angl}) {
    if(!row_spec) {
      // row_spec = this.ox.specification.add();
      row_spec = spec.add();
    }
    row_spec.nom = nom || row_base.nom;
    if(row_base.relm) {
      elm = row_base.relm;
    }

    const {
      utils: {blank},
      cat: {clrs, characteristics},
      enm: {predefined_formulas: {cx_clr, clr_prm, gb_short, gb_long, clr_in, clr_out}, comparison_types: ct},
      cch: {properties},
    } = $p;

    if(!row_spec.nom.visualization.empty()) {
      row_spec.dop = -1;
    }
    else if(row_spec.nom.is_procedure) {
      row_spec.dop = -2;
    }

    row_spec.clr = clrs.by_predefined(row_base ? row_base.clr : elm.clr, elm.clr, ox.clr, elm, spec, row_spec);
    row_spec.elm = elm.elm;
    if(origin) {
      row_spec.origin = origin;
    }
    if(specify) {
      row_spec.specify = specify;
    }

    // если алгоритм = характеристика по цвету
    if(row_base.algorithm === cx_clr) {
      const {ref} = properties.predefined('clr_elm');
      const clr = row_spec.clr.ref;
      // перебираем характеристики текущей номенклатуры
      characteristics.find_rows({owner: row_spec.nom, clr: row_spec.clr}, (cx) => {
        row_spec.characteristic = cx;
        return false;
      });
    }
    else {
      row_spec.characteristic = row_base.nom_characteristic;
      if(!row_spec.characteristic.empty() && row_spec.characteristic.owner != row_spec.nom) {
        row_spec.characteristic = blank.guid;
      }

      // цвет по параметру
      if(row_base.algorithm === clr_prm && origin && elm.elm > 0) {
        const ctypes = [ct.get(), ct.eq];
        origin.selection_params.find_rows({elm: row_base.elm}, (prm_row) => {
          if(ctypes.includes(prm_row.comparison_type) && prm_row.param.type.types.includes('cat.clrs') && (!prm_row.value || prm_row.value.empty())) {
            row_spec.clr = ox.extract_value({cnstr: [0, -elm.elm], param: prm_row.param});
          }
        });
      }
      else if(row_base.algorithm === clr_in) {
        const clr = clrs.by_predefined({predefined_name: 'КакЭлементИзнутри'}, elm.clr, ox.clr, elm);
        if(clr.empty()) {
          row_spec.clr = row_base.clr;
        }
        else if(row_base.clr.empty()) {
          row_spec.clr = clr;
        }
        else {
          row_spec.clr = `${clr.valueOf()}${row_base.clr,valueOf()}`;
        }
      }
      else if(row_base.algorithm === clr_out) {
        const clr = clrs.by_predefined({predefined_name: 'КакЭлементСнаружи'}, elm.clr, ox.clr, elm);
        if(clr.empty()) {
          row_spec.clr = row_base.clr;
        }
        else if(row_base.clr.empty()) {
          row_spec.clr = clr;
        }
        else {
          row_spec.clr = `${clr.valueOf()}${row_base.clr,valueOf()}`;
        }
      }
      // длина штапика
      else if([gb_short, gb_long].includes(row_base.algorithm) && len_angl) {
        const {curr, next, prev} = len_angl;
        if(curr && next && prev) {
          // строим эквидистанты от рёбер заполнения
          const curr0 = curr.sub_path.equidistant(row_base.sz, 100);
          const curr1 = curr.sub_path.equidistant(row_base.sz - row_base.nom.width, 100);
          const prev0 = prev.sub_path.equidistant(row_base.sz, 100);
          const next0 = next.sub_path.equidistant(row_base.sz, 100);
          const pp0 = curr0.intersect_point(prev0, curr.b, true);
          const pp1 = curr1.intersect_point(prev0, curr.b, true);
          const pn0 = curr0.intersect_point(next0, curr.e, true);
          const pn1 = curr1.intersect_point(next0, curr.e, true);
          const fin0 = curr0.get_subpath(pp0, pn0);
          const fin1 = curr1.get_subpath(pp1, pn1);
          row_spec.len = (Math.max(fin0.length, fin1.length) * (row_base.coefficient || 0.001)).round(4);
        }
      }
    }

    return row_spec;
  }

  /**
   * РассчитатьQtyLen
   * @param row_spec
   * @param row_base
   * @param len
   */
  static calc_qty_len(row_spec, row_base, len) {

    const {nom} = row_spec;

    if(nom.cutting_optimization_type == $p.enm.cutting_optimization_types.Нет ||
      nom.cutting_optimization_type.empty() || nom.is_pieces) {
      if(!row_base.coefficient || !len) {
        row_spec.qty = row_base.quantity;
      }
      else {
        if(!nom.is_pieces) {
          row_spec.qty = row_base.quantity;
          row_spec.len = (len - row_base.sz) * (row_base.coefficient || 0.001);
          if(nom.rounding_quantity) {
            row_spec.qty = (row_spec.qty * row_spec.len).round(nom.rounding_quantity);
            row_spec.len = 0;
          }
          ;
        }
        else if(!nom.rounding_quantity) {
          row_spec.qty = Math.round((len - row_base.sz) * row_base.coefficient * row_base.quantity - 0.5);
        }
        else {
          row_spec.qty = ((len - row_base.sz) * row_base.coefficient * row_base.quantity).round(nom.rounding_quantity);
        }
      }
    }
    else {
      row_spec.qty = row_base.quantity;
      row_spec.len = (len - row_base.sz) * (row_base.coefficient || 0.001);
    }
  }

  /**
   * РассчитатьКоличествоПлощадьМассу
   *
   * @param row_spec
   * @param spec
   * @param row_coord
   * @param angle_calc_method_prev
   * @param angle_calc_method_next
   * @param alp1
   * @param alp2
   * @param totqty0
   */
  static calc_count_area_mass(row_spec, spec, row_coord, angle_calc_method_prev, angle_calc_method_next, alp1, alp2, totqty0) {

    if(!row_spec.qty) {
      // dop=-1 - визуализация, dop=-2 - техоперация,
      if(row_spec.dop >= 0) {
        spec.del(row_spec.row - 1, true);
      }
      return;
    }

    // если свойства уже рассчитаны в формуле, пересчет не выполняем
    if(row_spec.totqty1 && row_spec.totqty) {
      return;
    }

    //TODO: учесть angle_calc_method
    if(!angle_calc_method_next) {
      angle_calc_method_next = angle_calc_method_prev;
    }

    if(angle_calc_method_prev && !row_spec.nom.is_pieces) {

      const {Основной, СварнойШов, СоединениеПополам, Соединение, _90} = $p.enm.angle_calculating_ways;

      if((angle_calc_method_prev == Основной) || (angle_calc_method_prev == СварнойШов)) {
        row_spec.alp1 = row_coord.alp1;
      }
      else if(angle_calc_method_prev == _90) {
        row_spec.alp1 = 90;
      }
      else if(angle_calc_method_prev == СоединениеПополам) {
        row_spec.alp1 = (alp1 || row_coord.alp1) / 2;
      }
      else if(angle_calc_method_prev == Соединение) {
        row_spec.alp1 = (alp1 || row_coord.alp1);
      }

      if((angle_calc_method_next == Основной) || (angle_calc_method_next == СварнойШов)) {
        row_spec.alp2 = row_coord.alp2;
      }
      else if(angle_calc_method_next == _90) {
        row_spec.alp2 = 90;
      }
      else if(angle_calc_method_next == СоединениеПополам) {
        row_spec.alp2 = (alp2 || row_coord.alp2) / 2;
      }
      else if(angle_calc_method_next == Соединение) {
        row_spec.alp2 = (alp2 || row_coord.alp2);
      }
    }

    if(row_spec.len) {
      if(row_spec.width && !row_spec.s) {
        row_spec.s = row_spec.len * row_spec.width;
      }
    }
    else {
      row_spec.s = 0;
    }

    if(row_spec.s) {
      row_spec.totqty = row_spec.qty * row_spec.s;
    }
    else if(row_spec.len) {
      row_spec.totqty = row_spec.qty * row_spec.len;
    }
    else {
      row_spec.totqty = row_spec.qty;
    }

    row_spec.totqty1 = totqty0 ? 0 : Math.max(row_spec.nom.min_volume, row_spec.totqty * row_spec.nom.loss_factor);

    ['len', 'width', 's', 'qty', 'alp1', 'alp2'].forEach((fld) => row_spec[fld] = row_spec[fld].round(4));
    ['totqty', 'totqty1'].forEach((fld) => row_spec[fld] = row_spec[fld].round(6));
  }

}

ProductsBuilding.cnn_nodes = ['b', 'e', 't', ''];
if(typeof global !== 'undefined'){
  global.ProductsBuilding = ProductsBuilding;
}
$p.ProductsBuilding = ProductsBuilding;
$p.products_building = new ProductsBuilding(true);


/* eslint-disable no-multiple-empty-lines,space-infix-ops */
/**
 * Аналог УПзП-шного __ФормированиеСпецификацийСервер__
 * Содержит методы расчета спецификации без привязки к построителю. Например, по регистру корректировки спецификации
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module  glob_spec_building
 * Created 26.05.2015
 */

class SpecBuilding {

  constructor($p) {

  }

  /**
   * Рассчитывает спецификацию в строке документа Расчет
   * Аналог УПзП-шного __РассчитатьСпецификациюСтроки__
   * @param prm
   * @param cancel
   */
  calc_row_spec (prm, cancel) {

  }

  /**
   * Аналог УПзП-шного РассчитатьСпецификацию_ПривязкиВставок
   * Синхронный метод, но возвращает массив промисов
   * @param attr {Object}
   * @param with_price {Boolean}
   */
  specification_adjustment (attr, with_price) {

    const {cat, pricing} = $p;
    const {scheme, calc_order_row, spec} = attr;
    const calc_order = calc_order_row._owner._owner;
    const order_rows = new Map();
    const adel = [];
    const ox = calc_order_row.characteristic;
    const nom = ox.empty() ? calc_order_row.nom : (calc_order_row.nom = ox.owner);

    // типы цен получаем заранее, т.к. они могут пригодиться при расчете корректировки спецификации
    pricing.price_type(attr);

    // подмешаем в параметры дату цены
    attr.date = calc_order.price_date;

    // удаляем из спецификации строки, добавленные предыдущими корректировками
    spec.find_rows({ch: {in: [-1, -2]}}, (row) => adel.push(row));
    adel.forEach((row) => spec.del(row, true));

    // находим привязанные к продукции вставки и выполняем
    // здесь может быть как расчет допспецификации, так и доппроверки корректности параметров и геометрии
    cat.insert_bind.deposit({ox, scheme, spec});

    // синхронизируем состав строк - сначала удаляем лишние
    if(!ox.empty()){
      adel.length = 0;
      calc_order.production.forEach((row) => {
        if (row.ordn === ox){
          if (ox._order_rows.indexOf(row.characteristic) === -1){
            adel.push(row);
          }
          else {
            order_rows.set(row.characteristic, row);
          }
        }
      });
      adel.forEach((row) => calc_order.production.del(row.row-1));
    }

    const ax = [];

    // затем, добавляем в заказ строки, назначенные к вытягиванию
    ox._order_rows && ox._order_rows.forEach((cx) => {
      const row = order_rows.get(cx) || calc_order.production.add({nom: cx.owner, characteristic: cx});
      row.nom = cx.owner;
      row.unit = row.nom.storage_unit;
      row.ordn = ox;
      row.len = cx.x;
      row.width = cx.y;
      row.s = cx.s;
      row.qty = calc_order_row.qty;
      row.quantity = calc_order_row.quantity;

      ax.push(cx);
      order_rows.set(cx, row);
    });
    if(order_rows.size){
      attr.order_rows = order_rows;
    }

    if(with_price){
      // рассчитываем плановую себестоимость
      pricing.calc_first_cost(attr);

      // рассчитываем стоимость продажи
      pricing.calc_amount(attr);
    }

    ax.push(ox);

    return ax;
  }

}

// Экспортируем экземпляр модуля
$p.spec_building = new SpecBuilding($p);


/**
 * Составной тип в поле trans документов оплаты и отгрузки
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module glob_value_mgr
 *
 * Created 10.10.2016
 */

(function ({classes: {DataManager, CatObj}, cat}) {
  const {value_mgr} = DataManager.prototype;
  DataManager.prototype.value_mgr = function(row, f, mf, array_enabled, v) {
		const tmp = value_mgr.call(this, row, f, mf, array_enabled, v);
		if(tmp){
      return tmp;
    }
		if(f == 'trans'){
      return $p.doc.calc_order;
    }
		else if(f == 'partner'){
      return $p.cat.partners;
    }
	}
})($p);


/**
 * Дополнительные методы перечисления Типы соединений
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * Created 23.12.2015
 *
 * @module enm_cnn_types
 */

(function(_mgr){

  const {ad, av, ah, long, short, t, ii, i, xt, xx} = _mgr;

  /**
   * Массивы Типов соединений
   * @type Array.<EnumObj>
   */
	Object.defineProperties(_mgr, {
    acn: {
      value: {
        ii: [ii],
        i: [i],
        a: [av, ad, ah, t, xx, long, short],
        t: [t, xx],
        xsl: [t, xx, long, short],
      }
    },
  });

})($p.enm.cnn_types);

/**
 * Дополнительные методы перечисления 'Способы расчёта количества'
 *
 * @module enm_count_calculating_ways
 *
 * Created 01.05.2022.
 */

(function({enm, cat: {clrs}, cch}){

  const {coloring, len_prm, area} = enm.count_calculating_ways;
  const {new_spec_row, calc_qty_len, calc_count_area_mass} = ProductsBuilding;

  const is_side = (side) => ['_in', '_out'].includes(side);

  coloring.calculate = function ({inset, elm, row_spec, row_ins_spec, spec, ox}) {
    let {_clr, _clr_side, quantity, sz, coefficient, angle_calc_method, formula} = row_ins_spec;
    if(!_clr) {
      _clr = elm.clr;
    }
    const prefix = _clr.area_src.valueOf();
    if(prefix) {
      const {_row} = elm;
      const nom = elm.inset === inset ? elm.nom : inset.nom(elm);
      row_spec.clr = clrs.by_predefined(row_ins_spec.clr, _clr, ox.clr, elm, spec);

      if(is_side(_clr_side)) {
        row_spec.width = nom._extra(prefix + _clr_side);
      }
      else {
        const areas = [nom._extra(prefix) || 0, nom._extra(prefix + '_in') || 0, nom._extra(prefix + '_out') || 0];
        row_spec.width = areas[0] || (areas[1] + areas[2]);
      }
      if(row_spec.width) {
        row_spec.qty = quantity;
        row_spec.len = (elm.length / 1000).round(3);
        row_spec.s = row_spec.len * row_spec.width * (coefficient || 1);
      }
    }
    if(!row_spec.width) {
      row_spec.qty = 0;
    }
    return row_spec;
  };

  area.calculate = function ({inset, elm, row_spec, row_ins_spec}) {
    const {_row} = elm;
    const {quantity, sz, coefficient} = row_ins_spec;
    row_spec.qty = quantity;
    if(inset.insert_type == enm.inserts_types.mosquito) {
      const bounds = elm.layer.bounds_inner(sz);
      row_spec.len = bounds.height * coefficient;
      row_spec.width = bounds.width * coefficient;
      row_spec.s = (row_spec.len * row_spec.width).round(4);
    }
    else if(inset.insert_type == enm.inserts_types.jalousie) {
      if(elm.bounds_light) {
        const bounds = elm.bounds_light();
        row_spec.len = (bounds.height + offsets) * coefficient;
        row_spec.width = (bounds.width + sz) * coefficient;
      }
      else {
        row_spec.len = elm.len * coefficient;
        row_spec.width = elm.height * coefficient;
      }
      row_spec.s = (row_spec.len * row_spec.width).round(4);
    }
    else if(inset.insert_type == enm.inserts_types.product) {
      const {project} = elm;
      const {width, height} = project.bounds;
      row_spec.len = width / 1000;
      row_spec.width = height / 1000;
      row_spec.s = (project.form_area - sz) * coefficient;
    }
    else if(inset.insert_type == enm.inserts_types.layer) {
      const {layer} = elm;
      const {width, height} = layer.bounds;
      row_spec.len = width / 1000;
      row_spec.width = height / 1000;
      row_spec.s = (layer.form_area - sz) * coefficient;
    }
    else {
      row_spec.len = (_row.y2 - _row.y1 - sz) * coefficient;
      row_spec.width = (_row.x2 - _row.x1 - sz) * coefficient;
      row_spec.s = _row.s;
    }
    return row_spec;
  };

  len_prm.calculate = function ({inset, elm, row_spec, row_ins_spec, origin}) {
    let len = 0;

    inset.selection_params.find_rows({elm: row_ins_spec.elm}, (prm_row) => {
      const {param} = prm_row;
      if(param.type.digits) {
        len = elm.layer.extract_pvalue({param, cnstr: 0, elm, origin, prm_row})
      }
      if(len) return false;
    });
    const {quantity, sz, coefficient} = row_ins_spec;
    row_spec.qty = quantity;
    row_spec.len = len ? (len - sz) * coefficient : 0;
    row_spec.width = 0;
    row_spec.s = 0;
    return row_spec;
  };

})($p);


/**
 * Дополнительные методы перечисления Типы элементов
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module enm_elm_types
 */

(function(_mgr){

	const cache = {};

  /**
   * Массивы Типов элементов
   * @type Object
   */
	_mgr.__define({

		profiles: {
			get(){
				return cache.profiles || (cache.profiles = [_mgr.rama, _mgr.flap, _mgr.impost, _mgr.shtulp]);
			}
		},

		profile_items: {
			get(){
				return cache.profile_items
					|| ( cache.profile_items = [
						_mgr.Рама,
						_mgr.Створка,
						_mgr.Импост,
						_mgr.Штульп,
						_mgr.Добор,
						_mgr.Соединитель,
						_mgr.Раскладка,
            _mgr.Связка,
					] );
			}
		},

		rama_impost: {
			get(){
				return cache.rama_impost || (cache.rama_impost = [_mgr.rama, _mgr.impost, _mgr.shtulp]);
			}
		},

		impost_lay: {
			get(){
        return cache.impost_lay || (cache.impost_lay = [_mgr.Импост, _mgr.Раскладка]);
			}
		},

		stvs: {
			get(){
        return cache.stvs || (cache.stvs = [_mgr.Створка]);
			}
		},

		glasses: {
			get(){
        return cache.glasses || (cache.glasses = [_mgr.Стекло, _mgr.Заполнение]);
			}
		}

	});


})($p.enm.elm_types);


/**
 * Дополнительные методы перечисления Типы вставок
 *
 * Created 22.02.2018.
 *
 * @module enm_inserts_types
 */


(function(_mgr){

  /**
   * ### Список групп, задействованных в CalcOrderAdditions
   * - можно изменить состав и порядок
   * - в теории, здесь же можно создать новые значения перечислений и добавить их в состав (эксперимент)
   */
  _mgr.additions_groups = [_mgr.Подоконник, _mgr.Водоотлив, _mgr.МоскитнаяСетка, _mgr.Жалюзи, _mgr.Откос, _mgr.Профиль, _mgr.Монтаж, _mgr.Доставка, _mgr.Набор];


})($p.enm.inserts_types);



/**
 * ### Модификаторы перечислений
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module enmums
 *
 * Created 22.04.2016
 */

(function({enm}){

  /**
   * Синонимы в приход/расход
   */
  enm.debit_credit_kinds.__define({
    debit: {
      get() {
        return this.Приход;
      }
    },
    credit: {
      get() {
        return this.Расход;
      }
    },
  });

	/**
	 * Дополнительные методы перечисления Типы открывания
	 */
	enm.open_types.__define({
    is_opening: {
      value(v) {
        if(!v || v.empty() || v == this.Глухое || v == this.Неподвижное) {
          return false;
        }
        return true;
      }
    }

  });

  enm.plan_detailing.__define({
    eq_product: {
      value: [enm.plan_detailing.get(), enm.plan_detailing.product, enm.plan_detailing.algorithm]
    }
  })


})($p);


/**
 * ### Модуль объекта справочника ХарактеристикиНоменклатуры
 * Обрботчики событий after_create, after_load, before_save, after_save, value_change
 * Методы выполняются в контексте текущего объекта this = DocObj
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module cat_characteristics
 *
 * Created 16.03.2016
 */

// переопределяем value_mgr
(function({cat: {characteristics, nom}}){
  const {value_mgr} = characteristics.constructor.prototype;
  characteristics.value_mgr = function(_obj, f, mf, array_enabled, v) {
    if(f === 'owner') {
      return nom;
    }
    if(f === 'value' && _obj.param && nom.by_ref[_obj.param]){
      return characteristics;
    }
    return value_mgr.call(characteristics, _obj, f, mf, array_enabled, v);
  };
  characteristics.extra_fields = function() {
    return [];
  };
  characteristics._direct_ram = true;
})($p);

// при старте приложения, загружаем в ОЗУ обычные характеристики (без ссылок на заказы)
!$p.job_prm.is_node && $p.md.once('predefined_elmnts_inited', () => {
  const _mgr = $p.cat.characteristics;

  // грузим характеристики
  ($p.job_prm.use_ram === false ? Promise.resolve() : _mgr.adapter.load_view(_mgr, 'linked', {
    limit: 10000,
    include_docs: true,
    startkey: [$p.utils.blank.guid, 'cat.characteristics'],
    endkey: [$p.utils.blank.guid, 'cat.characteristics\u0fff']
  }))
    .then(() => {
      // и корректируем метаданные формы спецификации с учетом ролей пользователя
      const {current_user} = $p;
      if(current_user && (
          current_user.role_available('СогласованиеРасчетовЗаказов') ||
          current_user.role_available('ИзменениеТехнологическойНСИ') ||
          current_user.role_available('РедактированиеЦен')
        )) {
        return;
      }
      const {form} = _mgr.metadata();
      if(form && form.obj && form.obj.tabular_sections) {
        form.obj.tabular_sections.specification.widths = "50,*,70,*,50,70,70,80,70,70,70,0,0,0";
      }
    });
});

// свойства объекта характеристики
$p.CatCharacteristics = class CatCharacteristics extends $p.CatCharacteristics {

  // перед записью надо пересчитать наименование и рассчитать итоги
  before_save(attr) {

    // уточняем номенклатуру системы
    const {prod_nom, calc_order, _data} = this;

    // контроль прав на запись характеристики
    if(!attr.force && calc_order.is_read_only) {
      _data._err = {
        title: 'Права доступа',
        type: 'alert-error',
        text: `Запрещено изменять заказ в статусе ${calc_order.obj_delivery_state}`
      };
      return false;
    }

    // для шаблонов, ссылка на типовой блок не нужна
    if(calc_order.obj_delivery_state == 'Шаблон' && !this.base_block.empty()) {
      this.base_block = '';
    }

    // пересчитываем наименование
    const name = this.prod_name();
    if(name) {
      this.name = name;
    }

    // дублируем контрагента для целей RLS
    this.partner = calc_order.partner;

    return this;

  }

  // шаблоны читаем из ram
  load(attr = {}) {
    if(this.obj_delivery_state == 'Шаблон') {
      attr.db = this._manager.adapter.db({cachable: 'ram'});
    }
    return super.load(attr);
  }

  // шаблоны сохраняем в базу ram
  save(post, operational, attachments, attr = {}) {
    if(this.obj_delivery_state == 'Шаблон') {
      attr.db = this._manager.adapter.db({cachable: 'ram'});
    }
    return super.save(post, operational, attachments, attr);
  }

  // при удалении строки вставок, удаляем параметры и соединения
  del_row(row) {
    if(row instanceof $p.CatCharacteristicsInsertsRow) {
      const {cnstr, inset, region, _owner} = row;
      const {params, cnn_elmnts} = _owner._owner;
      if(!inset.empty()) {
        params.del({cnstr, inset});
      }
      if(region) {
        params.del({cnstr, region});
        cnn_elmnts.clear(({elm1, node1}) => {
          return elm1 === -cnstr && node1.endsWith(region.toString());
        });
      }
    }
  }

  // при добавлении строки вставок, устанавливаем ряд
  add_row(row, attr) {
    if(row instanceof $p.CatCharacteristicsInsertsRow) {
      if(attr.inset && !attr.region) {
        attr.region = $p.cat.inserts.get(attr.inset).region;
      }
    }
  }

  /**
   * Добавляет параметры вставки, пересчитывает признак hide
   * @param inset
   * @param cnstr
   * @param [blank_inset]
   * @param [region]
   */
  add_inset_params(inset, cnstr, blank_inset, region) {
    const ts_params = this.params;
    const params = new Set();
    const filter = region ? {cnstr, region} : {cnstr, inset: blank_inset || inset};

    ts_params.find_rows(filter, ({param}) => params.add(param));

    const {product_params} = inset;
    inset.used_params().forEach((param) => {
      if((!param.is_calculated || param.show_calculated) && !params.has(param)) {
        const def = product_params.find({param});
        ts_params.add(region ? {cnstr, region, param, value: (def && def.value) || ""} :
          {cnstr, inset: blank_inset || inset, param, value: (def && def.value) || ""});
        params.add(param);
      }
    });

    ts_params.find_rows(filter, (row) => {
      const links = row.param.params_links({grid: {selection: {cnstr}}, obj: row});
      row.hide = links.some((link) => link.hide);
    });
  }

  /**
   * Рассчитывает наименование продукции
   */
  prod_name(short) {
    const {calc_order_row, calc_order, leading_product, sys, clr, origin} = this;
    let name = '';
    if(calc_order_row) {

      if(calc_order.number_internal) {
        name = calc_order.number_internal.trim();
      }
      else {
        // убираем нули из середины номера
        let num0 = calc_order.number_doc, part = '';
        for (let i = 0; i < num0.length; i++) {
          if(isNaN(parseInt(num0[i]))) {
            name += num0[i];
          }
          else {
            break;
          }
        }
        for (let i = num0.length - 1; i > 0; i--) {
          if(isNaN(parseInt(num0[i]))) {
            break;
          }
          part = num0[i] + part;
        }
        name += parseInt(part || 0).toFixed(0);
      }

      name += '/' + calc_order_row.row.pad();

      // для подчиненных, номер строки родителя
      if(!leading_product.empty() && !leading_product.calc_order.empty()) {
        const {calc_order_row} = leading_product;
        name += ':' + (calc_order_row ? calc_order_row.row.pad() : '0');
      }

      // добавляем название системы или вставки
      if(!sys.empty()) {
        name += '/' + sys.name;
      }
      else if(origin && !origin.empty()) {
        name += '/' + (origin instanceof $p.DocPurchase_order ? this.note : (origin.name || origin.number_doc));
      }

      if(!short) {

        // добавляем название цвета
        if(!clr.empty()) {
          name += '/' + this.clr.name;
        }

        // добавляем размеры
        if(this.x && this.y) {
          name += '/' + this.x.toFixed(0) + 'x' + this.y.toFixed(0);
        }
        else if(this.x) {
          name += '/' + this.x.toFixed(0);
        }
        else if(this.y) {
          name += '/' + this.y.toFixed(0);
        }

        if(this.z) {
          if(this.x || this.y) {
            name += 'x' + this.z.toFixed(0);
          }
          else {
            name += '/' + this.z.toFixed(0);
          }
        }

        if(this.s) {
          name += '/S:' + this.s.toFixed(3);
        }

        // подмешиваем значения параметров
        let sprm = '';
        this.params.find_rows({cnstr: 0}, ({param, value}) => {
          if(param.include_to_name && sprm.indexOf(String(value)) == -1) {
            sprm && (sprm += ';');
            sprm += String(value);
          }
        });
        if(sprm) {
          name += '|' + sprm;
        }
      }
    }
    return name;
  }

  /**
   * Открывает форму происхождения строки спецификации
   */
  open_origin(row_id) {
    try {
      let {origin} = this.specification.get(row_id);
      if(typeof origin == 'number') {
        origin = this.cnn_elmnts.get(origin - 1).cnn;
      }
      if(!origin || origin.is_new()) {
        return $p.msg.show_msg({
          type: 'alert-warning',
          text: `Пустая ссылка на настройки в строке №${row_id + 1}`,
          title: o.presentation
        });
      }
      origin.form_obj();
    }
    catch (err) {
      $p.record_log(err);
    }
  }

  /**
   * Ищет характеристику в озу, в indexeddb не лезет, если нет в озу - создаёт
   * @param elm {Number} - номер элемента или контура
   * @param [origin] {CatInserts} - порождающая вставка
   * @param [modify] {Boolean} - если false - не изменяем - только поиск
   * @param [_order_rows] {Array} - если указано и есть в массиве - не перезаполняем
   * @return {CatCharacteristics}
   */
  find_create_cx(elm, origin, modify, _order_rows) {
    const {_manager, calc_order, params, inserts} = this;
    const {job_prm, utils, cat} = $p;
    if(!origin) {
      origin = cat.inserts.get();
    }
    let cx;
    _manager.find_rows({leading_product: this, leading_elm: elm, origin}, (obj) => {
      if(!obj._deleted) {
        cx = obj;
        return false;
      }
    });
    if(!cx) {
      cx = cat.characteristics.create({
        calc_order,
        leading_product: this,
        leading_elm: elm,
        origin
      }, false, true)._set_loaded();
    }
    if(_order_rows) {
      if(_order_rows.includes(cx)) {
        return cx;
      }
      _order_rows.push(cx);
      cx.specification.clear();
      if(!cx.calc_order_row) {
        calc_order.production.add({characteristic: cx});
      }
    }

    if(modify !== false) {
      // переносим в cx параметры
      cx.params.clear();
      if(elm > 0 || !utils.is_empty_guid(origin.valueOf())) {
        const {length, width} = job_prm.properties;
        params.find_rows({cnstr: -elm, inset: origin}, (row) => {
          if(row.param != length && row.param != width) {
            cx.params.add({param: row.param, value: row.value});
          }
        });
      }
      else {
        params.find_rows({cnstr: 0, inset: origin}, (row) => cx.params.add(row));
      }

      if(elm > 0 || !utils.is_empty_guid(origin.valueOf())) {
        // переносим в cx цвет
        inserts.find_rows({cnstr: -elm, inset: origin}, (row) => {
          cx.clr = row.clr;
        });
        cx.name = cx.prod_name();
      }
      else if(utils.is_empty_guid(origin.valueOf())) {
        // если это продукция слоя, переносим в cx всё, что можно
        cx.constructions.clear();
        cx.inserts.clear();
        cx.coordinates.clear();
        cx.glasses.clear();
        cx.cnn_elmnts.clear();
        cx.cpy_recursive(this, -elm);
      }

    }
    return cx;
  }

  /**
   * Копирует табчасти структуры изделия, начиная со слоя cnstr
   * @param src {CatCharacteristics}
   * @param cnstr {Number}
   */
  cpy_recursive(src, cnstr) {
    const {params, inserts, coordinates, cnn_elmnts, glasses} = this;
    this.constructions.add(src.constructions.find({cnstr}));
    src.params.find_rows({cnstr}, (row) => params.add(row));
    src.inserts.find_rows({cnstr}, (row) => inserts.add(row));
    src.coordinates.find_rows({cnstr}, (row) => {
      coordinates.add(row);
      for(const srow of src.cnn_elmnts) {
        if(srow.elm1 === row.elm || srow.elm2 === row.elm) {
          cnn_elmnts.add(srow);
        }
      }
      const grow = src.glasses.find({elm: row.elm});
      grow && this.glasses.add(grow);
    });

    src.constructions.find_rows({parent: cnstr}, (row) => this.cpy_recursive(src, row.cnstr));
  }

  /**
   * Возврвщает строку заказа, которой принадлежит продукция
   */
  get calc_order_row() {
    return this.calc_order.production.find({characteristic: this});
  }

  /**
   * Возвращает номенклатуру продукции по системе
   */
  get prod_nom() {
    const {sys, params, calc_order, calc_order_row} = this;
    if(!sys.empty()) {

      let setted;

      if(sys.production.count() === 1) {
        this.owner = sys.production.get(0).nom;
      }
      else {
        for(const row of sys.production) {
          if(row.param && !row.param.empty()) {
            if(row.param.check_condition({prm_row: row, ox: this, calc_order})) {
              setted = true;
              this.owner = row.nom;
              break;
            }
          }
        }
        if(!setted) {
          for(const row of sys.production) {
            if(!row.param || row.param.empty()) {
              setted = true;
              this.owner = row.nom;
              break;
            }
          }
        }
        if(!setted) {
          const prow = sys.production.get(0);
          if(prow) {
            this.owner = prow.nom;
          }
        }
      }
    }

    if(calc_order_row && !this.owner.empty() && calc_order_row.nom !== this.owner) {
      calc_order_row.nom = this.owner;
    }

    return this.owner;
  }

  /**
   * Дополнительные свойства изделия для рисовалки
   */
  get builder_props() {
    const defaults = this.constructor.builder_props_defaults;
    const props = {};
    let tmp;
    try {
      tmp = typeof this._obj.builder_props === 'object' ? this._obj.builder_props : JSON.parse(this._obj.builder_props || '{}');
    }
    catch(e) {
      tmp = props;
    }
    for(const prop in defaults){
      if(tmp.hasOwnProperty(prop)) {
        props[prop] = typeof tmp[prop] === 'number' ? tmp[prop] : !!tmp[prop];
      }
      else {
        props[prop] = defaults[prop];
      }
    }
    return props;
  }
  set builder_props(v) {
    if(this.empty()) {
      return;
    }
    let _modified;
    const {_obj, _data} = this;
    const name = 'builder_props';
    const symplify = () => {
      if(typeof v === 'string') {
        v = JSON.parse(v);
      }
      const props = this.builder_props;
      for(const prop in v){
        if(prop < 'a') {
          continue;
        }
        if(props[prop] !== v[prop]) {
          props[prop] = v[prop];
          _modified = true;
        }
      }
      return props;
    };

    if(_data && _data._loading) {
      if(v.length > 200) {
        v = JSON.stringify(symplify());
      }
      _obj[name] = v;
      return;
    }

    if(!_obj[name] || typeof _obj[name] !== 'string'){
      _obj[name] = JSON.stringify(this.constructor.builder_props_defaults);
      _modified = true;
    }

    const props = symplify();
    if(_modified) {
      _obj[name] = JSON.stringify(props);
      this.__notify(name);
    }
  }

  /**
   * Выполняет замену системы, цвета и фурниутры
   * если текущее изделие помечено в обработке
   * @param engine {Scheme|CatInserts} - экземпляр рисовалки или вставки (соответственно, для изделий построителя и параметрика)
   * @param dp {DpBuyers_order} - экземпляр обработки в реквизитах и табчастях которой, правила перезаполнения
   * @return {Scheme|CatInserts}
   */
  apply_props(engine, dp) {
    // если в dp взведён флаг, выполняем подмену
    if(dp && dp.production.find({use: true, characteristic: this})) {
      const {Scheme, Filling, Contour} = $p.EditorInvisible;
      if(engine instanceof Scheme) {
        const {length} = engine._ch;
        // цвет
        if(dp.use_clr && engine._dp.clr !== dp.clr) {
          engine._dp.clr = dp.clr;
          engine._dp_listener(engine._dp, {clr: true});
        }
        // система
        if(dp.use_sys) {
          engine.set_sys(dp.sys);
        }
        // вставки заполнений
        if(dp.use_inset) {
          engine.set_glasses(dp.inset);
        }
        // подмена фурнитуры
        for(const contour of engine.getItems({class: Contour})) {
          const {furn} = contour;
          if(!furn.empty()) {
            dp.sys_furn.find_rows({elm1: furn}, ({elm2}) => {
              if(!elm2.empty() && elm2 !== furn) {
                contour.furn = elm2;
              }
            });
          }
        }
        if(engine._ch.length > length) {
          engine.redraw();
        }
      }
      // подмена параметров - одинаково для рисовалки и параметрика
      dp.product_params.forEach(({param, value, _ch}) => {
        _ch && this.params.find_rows({param}, (row) => {
          row.value = value;
        });
      });
    }
    return engine;
  }

  /**
   * Пересчитывает изделие по тем же правилам, что и визуальная рисовалка
   * @param attr {Object} - параметры пересчёта
   * @param [editor] {EditorInvisible}
   * @param [restore] {Scheme}
   */
  recalc(attr = {}, editor, restore) {

    // сначала, получаем объект заказа и продукции заказа в озу, т.к. пересчет изделия может приводить к пересчету соседних продукций

    // загружаем изделие в редактор
    const remove = !editor;
    if(remove) {
      editor = new $p.EditorInvisible();
    }
    const project = editor.create_scheme();
    return project.load(this, true)
      .then(() => {
        // выполняем пересчет
        return project.save_coordinates(Object.assign({save: true, svg: false}, attr));
      })
      .then(() => {
        project.ox = '';
        return remove ? editor.unload() : project.unload();
      })
      .then(() => {
        restore?.activate();
        return this;
      })
      .catch((err) => {
        restore?.activate();
        throw err;
      });
  }

  /**
   * Рисует изделие или фрагмент изделия в Buffer в соответствии с параметрами attr
   * @param attr
   * @param editor
   */
  draw(attr = {}, editor) {
    const link = {imgs: {}};

    if(attr.res instanceof Map) {
      attr.res.set(this, link);
    }
    else {
      if(!attr.res) {
        attr.res = {};
      }
      attr.res[$p.utils.snake_ref(this.ref)] = link;
    }

    // загружаем изделие в редактор
    const remove = !editor;
    if(remove) {
      editor = new $p.EditorInvisible();
    }
    const project = editor.create_scheme();
    return project.load(this, attr.builder_props || true)
      .then(() => {
        const {_obj: {glasses, constructions, coordinates}} = this;
        // формируем эскиз(ы) в соответствии с attr
        if(attr.elm) {
          const elmnts = Array.isArray(attr.elm) ? attr.elm : [attr.elm];
          for(const elm of elmnts) {
            const item = project.draw_fragment({elm});
            const num = elm > 0 ? `g${elm}` : `l${elm}`;
            if(attr.format === 'png') {
              link.imgs[num] = project.view.element.toDataURL('image/png').substr(22);
            }
            else {
              link.imgs[num] = project.get_svg(attr);
            }
            if(item){
              item.visible = false;
            }
          }
        }
        else if(attr.glasses) {
          link.glasses = glasses.map((glass) => Object.assign({}, glass));
          link.glasses.forEach((row) => {
            const glass = project.draw_fragment({elm: row.elm});
            // подтянем формулу стеклопакета
            if(attr.format === 'png') {
              link.imgs[`g${row.elm}`] = project.view.element.toDataURL('image/png').substr(22);
            }
            else {
              link.imgs[`g${row.elm}`] = project.get_svg(attr);
            }
            if(glass){
              row.formula_long = glass.formula(true);
              glass.visible = false;
            }
          });
        }
        else {
          if(attr.format === 'png') {
            link.imgs[`l0`] = project.view.element.toDataURL('image/png').substr(22);
          }
          else {
            link.imgs[`l0`] = project.get_svg(attr);
          }
          if(attr.glasses !== false) {
            constructions.forEach(({cnstr}) => {
              project.draw_fragment({elm: -cnstr});
              if(attr.format === 'png') {
                link.imgs[`l${cnstr}`] = project.view.element.toDataURL('image/png').substr(22);
              }
              else {
                link.imgs[`l${cnstr}`] = project.get_svg(attr);
              }
            });
          }
        }
      })
      .then(() => {
        project.ox = '';
        return remove ? editor.unload() : project.unload();
      })
      .then(() => attr.res);
  }

  /**
   * Значение параметра для текущего слоя или вставки
   * @param cnstr
   * @param inset
   * @param param
   * @return {*}
   */
  extract_value({cnstr, inset, param}) {
    const {utils: {blank}, CatNom, cat} = $p;
    const is_nom = param instanceof CatNom;
    inset = inset ? inset.valueOf() : blank.guid;
    param = param ? param.valueOf() : blank.guid;
    if(!Array.isArray(cnstr)) {
      cnstr = [cnstr];
    }
    const row = this.params._obj.find((row) =>
      cnstr.includes(row.cnstr) && (!row.inset && inset === blank.guid || row.inset === inset) && row.param === param);
    return is_nom ? cat.characteristics.get(row && row.value) : row && row.value;
  }

  /**
   * Рассчитывает массу фрагмента изделия
   * @param [elmno] {number} - номер элемента (с полюсом) или слоя (с минусом)
   * @return {number}
   */
  elm_weight(elmno) {
    const {coordinates, specification} = this;
    const map = new Map();
    let weight = 0;
    specification.forEach(({elm, nom, totqty}) => {
      // отбрасываем лишние строки
      if(elmno !== undefined && elm !== elmno) {
        if(elmno < 0 && elm > 0) {
          if(!map.get(elm)) {
            const crow = coordinates.find({elm});
            map.set(elm, crow ? -crow.cnstr : Infinity);
          }
          if(map.get(elm) !== elmno) return;
        }
        else {
          return;
        }
      }
      weight += nom.density * totqty;
    });
    // элементы внутри слоя могут быть вынесены в отдельные строки заказа
    if(elmno < 0) {
      const contour = {cnstr: -elmno};
      coordinates.find_rows(contour, ({elm, inset}) => {
        if(inset.is_order_row_prod({ox: this, elm: {elm}, contour})) {
          const cx = this.find_create_cx(elm, $p.utils.blank.guid, false);
          weight += cx.elm_weight();
        }
      });
    }
    return weight;
  }

  /**
   * Выясняет, есть ли в спецификации номенклатура из константы cname
   * @param cname {String}
   * @return {boolean}
   */
  has_nom(cname) {
    let noms = $p.job_prm.nom[cname];
    let res = false;
    if(noms) {
      if(!Array.isArray(noms)) {
        noms = [noms];
      }
      for(const {nom} of this.specification) {
        if(noms.some((curr) => curr === nom || curr.is_folder && nom._hierarchy(curr))) {
          res = true;
          break;
        }
      }
    }
    return res;
  }

};

$p.CatCharacteristics.builder_props_defaults = {
  auto_lines: true,
  custom_lines: true,
  cnns: true,
  visualization: true,
  txts: true,
  rounding: 0,
  mosquito: true,
  jalousie: true,
  grid: 50,
  carcass: false,
  mirror: false,
  articles: 0,
};

// при изменении реквизита табчасти вставок
$p.CatCharacteristicsInsertsRow.prototype.value_change = function (field, type, value) {
  // для вложенных вставок перезаполняем параметры
  if(field == 'inset') {
    if (value != this.inset) {
      const {_owner} = this._owner;
      const {cnstr, region} = this;
      const {blank} = $p.utils;

      //Проверяем дубли вставок (их не должно быть, иначе параметры перезаписываются)
      if (value != blank.guid) {
        const res = _owner.params.find_rows({cnstr, region, inset: value, row: {not: this.row}});
        if (res.length) {
          $p.md.emit('alert', {
            obj: _owner,
            row: this,
            title: $p.msg.data_error,
            type: 'alert-error',
            text: 'Нельзя добавлять две одинаковые вставки в один элемент или слой'
          });
          return false;
        }
      }

      // удаляем параметры старой вставки
      !this.inset.empty() && _owner.params.clear({inset: this.inset, cnstr});

      // устанавливаем значение новой вставки
      this._obj.inset = value.valueOf();

      // устанавливаем ряд по умолчанию
      if(!region && this.inset.region) {
        this._obj.region = this.inset.region;
      }

      // при необходимости, обновим цвет по данным доступных цветов вставки
      this.inset.clr_group.default_clr(this);

      // заполняем параметры по умолчанию
      _owner.add_inset_params(this.inset, cnstr, null, region);
    }
  }
};

// при изменении реквизита табчасти состава заполнения
$p.CatCharacteristicsGlass_specificationRow.prototype.value_change = function (field, type, value) {
  // для вставок состава, перезаполняем параметры
  const {_obj} = this;
  if(field === 'inset' && value != this.inset) {
    _obj.inset = value ? value.valueOf() : $p.utils.blank.guid;
    const {inset, clr, dop, _owner: {_owner}} = this;
    const {product_params} = inset;
    const own_row = _owner.coordinates.find({elm: _obj.elm});
    const own_params = own_row && own_row.inset.product_params;

    const params = {};
    inset.used_params().forEach((param) => {
      if((!param.is_calculated || param.show_calculated)) {
        const def = product_params.find({param}) || (own_params && own_params.find({param}));
        if(def) {
          params[param.valueOf()] = param.fetch_type(def.value);
        }
      }
    });
    const clrs = inset.clr_group.clrs();
    if(clrs.length && !clrs.includes(clr)) {
      _obj.clr = clrs[0].valueOf();
    }
    this.dop = Object.assign(dop, {params});
  }
};



/**
 * ### Дополнительные методы справочника _Соединения_
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 * @module cat_cnns
 * Created 23.12.2015
 */

$p.cat.cnns.__define({

  sql_selection_list_flds: {
    value(initial_value){
      return "SELECT _t_.ref, _t_.`_deleted`, _t_.is_folder, _t_.id, _t_.name as presentation, _k_.synonym as cnn_type," +
        " case when _t_.ref = '" + initial_value + "' then 0 else 1 end as is_initial_value FROM cat_cnns AS _t_" +
        " left outer join enm_cnn_types as _k_ on _k_.ref = _t_.cnn_type %3 %4 LIMIT 300";
    }
  },

});



/**
 * ### Дополнительные методы справочника _Договоры контрагентов_
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module cat_contracts
 *
 * Created 23.12.2015
 */

$p.cat.contracts.__define({

	sql_selection_list_flds: {
		value(initial_value){
			return "SELECT _t_.ref, _t_.`_deleted`, _t_.is_folder, _t_.id, _t_.name as presentation, _k_.synonym as contract_kind, _m_.synonym as mutual_settlements, _o_.name as organization, _p_.name as partner," +
				" case when _t_.ref = '" + initial_value + "' then 0 else 1 end as is_initial_value FROM cat_contracts AS _t_" +
				" left outer join cat_organizations as _o_ on _o_.ref = _t_.organization" +
				" left outer join cat_partners as _p_ on _p_.ref = _t_.owner" +
				" left outer join enm_mutual_contract_settlements as _m_ on _m_.ref = _t_.mutual_settlements" +
				" left outer join enm_contract_kinds as _k_ on _k_.ref = _t_.contract_kind %3 %4 LIMIT 300";
		}
	},

	by_partner_and_org: {
    value(partner, organization, contract_kind = $p.enm.contract_kinds.СПокупателем) {

      const {main_contract} = $p.cat.partners.get(partner);

      //Если у контрагента есть основной договор, и он подходит по виду договора и организации,
      // возвращаем его, не бегая по массиву
      if(main_contract && main_contract.contract_kind == contract_kind && main_contract.organization == organization){
        return main_contract;
      }

      const res = this.find_rows({owner: partner, organization: organization, contract_kind: contract_kind});
      res.sort((a, b) => a.date > b.date);
      return res.length ? res[0] : this.get();
    }
	}


});

// перед записью, устанавливаем код, родителя и наименование
// _mgr.on("before_save", function (attr) {
//
//
//
// });


/**
 * Дополнительные методы справочника Фурнитура
 *
 * Created 23.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2018
 * @author Evgeniy Malyarov
 * @module cat_furns
 */

/**
 * корректируем метаданные табчастей фурнитуры
 */
(({md}) => {
  const {specification_restrictions, specification} = md.get('cat.furns').tabular_sections;
  // индексы
  specification.index = 'elm';
  specification_restrictions.index = 'elm';
  // устаревшее поле nom_set для совместимости
  const {fields} = specification;
  fields.nom_set = fields.nom;
})($p);

/**
 * Методы объекта фурнитуры
 */
$p.CatFurns = class CatFurns extends $p.CatFurns {

  /**
   * Перезаполняет табчасть параметров указанного контура
   */
  refill_prm(layer, force=false) {

    const {project, furn, cnstr, sys} = layer;
    const fprms = project.ox.params;
    const {CatNom, job_prm: {properties: {direction, opening}}, utils} = $p;

    // формируем массив требуемых параметров по задействованным в contour.furn.furn_set
    const aprm = furn.furn_set.used_params();
    aprm.sort(utils.sort('presentation'));

    // дозаполняем и приклеиваем значения по умолчанию
    aprm.forEach((v) => {

      // направления в табчасть не добавляем
      if(v == direction || v == opening){
        return;
      }

      let prm_row, forcibly = true;
      fprms.find_rows({param: v, cnstr: cnstr}, (row) => {
        prm_row = row;
        return forcibly = force;
      });
      if(!prm_row){
        prm_row = fprms.add({param: v, cnstr: cnstr}, true);
      }

      // умолчания и скрытость по табчасти системы
      const {param} = prm_row;
      const drow = sys.prm_defaults(param, cnstr);
      if(drow && (drow.forcibly || forcibly)) {
        prm_row.value = drow.value;
      }
      prm_row.hide = (drow && drow.hide) || (param.is_calculated && !param.show_calculated);

      // умолчания по связям параметров
      param.linked_values(param.params_links({
        grid: {selection: {cnstr: cnstr}},
        obj: {_owner: {_owner: project.ox}},
        layer,
      }), prm_row);

    });

    // удаляем лишние строки, сохраняя параметры допвставок
    const adel = [];
    fprms.find_rows({cnstr: cnstr, inset: utils.blank.guid}, (row) => {
      if(aprm.indexOf(row.param) == -1){
        adel.push(row);
      }
    });
    adel.forEach((row) => fprms.del(row, true));

  }

  /**
   * Вытягивает массив используемых фурнитурой и вложенными наборами параметров
   * @return {Array}
   */
  used_params() {

    const {_data} = this;
    // если параметры этого набора уже обработаны - пропускаем
    if(_data.used_params) {
      return _data.used_params;
    }

    const sprms = [];
    const {order, product, nearest} = $p.enm.plan_detailing;

    this.selection_params.forEach(({param, origin}) => {
      if(param.empty() || origin === product || origin === order || origin === nearest) {
        return;
      }
      if((!param.is_calculated || param.show_calculated) && !sprms.includes(param)){
        sprms.push(param);
      }
    });

    const {CatFurns, CatNom, enm: {predefined_formulas: {cx_prm}}} = $p;
    this.specification.forEach(({nom, algorithm}) => {
      if(nom instanceof CatFurns) {
        for(const param of nom.used_params()) {
          !sprms.includes(param) && sprms.push(param);
        }
      }
      else if(algorithm === cx_prm && nom instanceof CatNom && !sprms.includes(nom)) {
        sprms.push(nom);
      }
    });

    return _data.used_params = sprms;

  }

  /**
   * Аналог УПзП-шного _ПолучитьСпецификациюФурнитурыСФильтром_
   * @param contour {Contour}
   * @param cache {Object}
   * @param [exclude_dop] {Boolean}
   */
  get_spec(contour, cache, exclude_dop) {

    // тихий режим для спецификации
    const res = $p.dp.buyers_order.create({specification: []}, true).specification;
    const {_ox: ox} = contour;
    const {transfer_operations_options: {НаПримыкающий: nea, ЧерезПримыкающий: through, НаПримыкающийОтКонца: inverse},
      open_directions, offset_options} = $p.enm;

    // бежим по всем строкам набора
    this.specification.find_rows({dop: 0}, (row_furn) => {

      // проверяем, проходит ли строка
      if(!row_furn.check_restrictions(contour, cache)){
        return;
      }

      // ищем строки дополнительной спецификации
      if(!exclude_dop){
        this.specification.find_rows({elm: row_furn.elm, dop: {not: 0}}, (dop_row) => {

          if(!dop_row.check_restrictions(contour, cache)){
            return;
          }

          // расчет координаты и (или) визуализации
          if(dop_row.is_procedure_row){

            // для правого открывания, инвертируем координату
            const invert = contour.direction == open_directions.Правое;
            // получаем элемент через сторону фурнитуры
            const elm = contour.profile_by_furn_side(dop_row.side, cache);
            // profile._len - то, что получится после обработки
            // row_spec.len - сколько взять (отрезать)
            // len - геометрическая длина без учета припусков на обработку
            const {len} = elm._row;
            // свойство номенклатуры размер до фурнпаза
            const {sizefurn} = elm.nom;
            // в зависимости от значения константы add_d, вычисляем dx1
            const dx1 = $p.job_prm.builder.add_d ? sizefurn : 0;
            // длина с поправкой на фурнпаз
            const faltz = len - 2 * sizefurn;

            let coordin = 0;

            if(dop_row.offset_option == offset_options.Формула){
              if(!dop_row.formula.empty()){
                coordin = dop_row.formula.execute({ox, elm, contour, len, sizefurn, dx1, faltz, invert, dop_row});
              }
            }
            else if(dop_row.offset_option == offset_options.РазмерПоФальцу){
              coordin = faltz + dop_row.contraction;
            }
            else if(dop_row.offset_option == offset_options.ОтРучки){
              // строим горизонтальную линию от нижней границы контура, находим пересечение и offset
              const {generatrix} = elm;
              const hor = contour.handle_line(elm);
              coordin = generatrix.getOffsetOf(generatrix.intersect_point(hor)) -
                generatrix.getOffsetOf(generatrix.getNearestPoint(elm.corns(1))) +
                (invert ? dop_row.contraction : -dop_row.contraction);
            }
            else if(dop_row.offset_option == offset_options.ОтСередины){
              // не мудрствуя, присваиваем половину длины
              coordin = len / 2 + (invert ? dop_row.contraction : -dop_row.contraction);
            }
            else{
              if(invert){
                if(dop_row.offset_option == offset_options.ОтКонцаСтороны){
                  coordin = dop_row.contraction;
                }
                else{
                  coordin = len - dop_row.contraction;
                }
              }
              else{
                if(dop_row.offset_option == offset_options.ОтКонцаСтороны){
                  coordin = len - dop_row.contraction;
                }
                else{
                  coordin = dop_row.contraction;
                }
              }
            }

            const proc_row = res.add(dop_row);
            proc_row.origin = this;
            proc_row.specify = row_furn.nom;
            proc_row.handle_height_max = contour.cnstr;
            if([nea, through, inverse].includes(dop_row.transfer_option)){
              let nearest = elm.nearest();
              if(dop_row.transfer_option == through){
                const joined = nearest.joined_nearests().reduce((acc, cur) => {
                  if(cur !== elm){
                    acc.push(cur);
                  }
                  return acc;
                }, []);
                if(joined.length){
                  nearest = joined[0];
                }
              }
              const {outer} = elm.rays;
              const nouter = nearest.rays.outer;
              const point = outer.getPointAt(outer.getOffsetOf(outer.getNearestPoint(elm.corns(1))) + coordin);
              proc_row.handle_height_min = nearest.elm;
              if(dop_row.transfer_option == inverse){
                proc_row.coefficient = nouter.getOffsetOf(nouter.getNearestPoint(nearest.corns(2))) - nouter.getOffsetOf(nouter.getNearestPoint(point));
              }
              else {
                proc_row.coefficient = nouter.getOffsetOf(nouter.getNearestPoint(point)) - nouter.getOffsetOf(nouter.getNearestPoint(nearest.corns(1)));
              }
              // если сказано учесть припуск - добавляем dx0
              if(dop_row.overmeasure){
                proc_row.coefficient +=  nearest.dx0;
              }
            }
            else{
              proc_row.handle_height_min = elm.elm;
              proc_row.coefficient = coordin;
              // если сказано учесть припуск - добавляем dx0
              if(dop_row.overmeasure){
                proc_row.coefficient +=  elm.dx0;
              }
            }

            return;
          }
          else if(!dop_row.quantity){
            return;
          }

          // в зависимости от типа строки, добавляем саму строку или её подчиненную спецификацию
          if(dop_row.is_set_row){
            const {nom} = dop_row;
            nom && nom.get_spec(contour, cache).forEach((sub_row) => {
              if(sub_row.is_procedure_row){
                res.add(sub_row);
              }
              else if(sub_row.quantity) {
                const row_spec = this.add_with_algorithm(res, ox, contour, sub_row);
                row_spec.quantity = (row_furn.quantity || 1) * (dop_row.quantity || 1) * sub_row.quantity;
              }
            });
          }
          else{
            const row_spec = this.add_with_algorithm(res, ox, contour, dop_row);
            row_spec.specify = row_furn.nom;
          }
        });
      }

      // в зависимости от типа строки, добавляем саму строку или её подчиненную спецификацию
      if(row_furn.is_set_row){
        const {nom} = row_furn;
        nom && nom.get_spec(contour, cache, exclude_dop).forEach((sub_row) => {
          if(sub_row.is_procedure_row) {
            res.add(sub_row);
          }
          else if(sub_row.quantity) {
            const row_spec = this.add_with_algorithm(res, ox, contour, sub_row);
            row_spec.quantity = (row_furn.quantity || 1) * sub_row.quantity;
          }
        });
      }
      else{
        if(row_furn.quantity) {
          this.add_with_algorithm(res, ox, contour, row_furn);
        }
      }
    });

    return res;
  }

  /**
   * Добавляет строку в спецификацию с учетом алгоритма
   * @param res {TabularSection}
   * @param ox {CatCharacteristics}
   * @param contour {Contour}
   * @param row_furn {CatFurnsSpecificationRow}
   * @return {DpBuyers_orderSpecificationRow}
   */
  add_with_algorithm(res, ox, contour, row_furn) {
    const {algorithm, formula, elm, dop} = row_furn;
    const {comparison_types: {eq}, predefined_formulas: {cx_prm, clr_prm}} = $p.enm;
    let cx;
    if(algorithm === cx_prm) {
      cx = ox.extract_value({cnstr: contour.cnstr, param: row_furn.nom});
      if(cx.toString().toLowerCase() === 'нет') {
        return;
      }
    }
    const row_spec = res.add(row_furn);
    row_spec.origin = this;
    if(algorithm === cx_prm) {
      row_spec.nom_characteristic = cx;
    }
    else if(algorithm === clr_prm) {
      this.selection_params.find_rows({elm, dop}, (prm_row) => {
        if((prm_row.comparison_type.empty() || prm_row.comparison_type === eq) &&
          prm_row.param.type.types.includes('cat.clrs') &&
          (!prm_row.value || prm_row.value.empty())) {
          row_spec.clr = ox.extract_value({cnstr: contour.cnstr, param: prm_row.param});
        }
      });
    }
    if(!formula.empty() && !formula.condition_formula){
      formula.execute({ox, contour, row_furn, row_spec});
    }
    return row_spec;
  }

  /**
   * Вычисляет штульповость фурнитуры
   * 0 - не штульповая, 1 - активная, 2 - пассивная
   * @return {number}
   */
  shtulp_kind() {
    let res = 0;
    this.open_tunes.forEach(({shtulp_available, shtulp_fix_here}) => {
      if(shtulp_available && !res) {
        res = 1;
      }
      if(shtulp_fix_here) {
        res = 2;
      }
    });
    return res;
  }

};

/**
 * Методы строки спецификации
 */
$p.CatFurnsSpecificationRow = class CatFurnsSpecificationRow extends $p.CatFurnsSpecificationRow {

  /**
   * Проверяет ограничения строки фурнитуры
   * @param contour {Contour}
   * @param cache {Object}
   */
  check_restrictions(contour, cache) {
    const {elm, dop, handle_height_min, handle_height_max, formula, side, flap_weight_min: mmin, flap_weight_max: mmax} = this;
    const {direction, h_ruch, cnstr} = contour;

    // проверка по высоте ручки
    if(h_ruch < handle_height_min || (handle_height_max && h_ruch > handle_height_max)){
      return false;
    }

    // проверка по формуле
    if(!cache.ignore_formulas && !formula.empty() && formula.condition_formula && !formula.execute({ox: cache.ox, contour, row_furn: this})) {
      return false;
    }

    // по моменту на петлях (в текущей реализации - просто по массе)
    if(mmin || (mmax && mmax < 1000)) {
      if(!cache.hasOwnProperty('weight')) {
        if(contour.sys.flap_weight_max) {
          const weights = [];
          for(const cnt of contour.layer.contours) {
            weights.push(Math.ceil(cache.ox.elm_weight(-cnt.cnstr)));
          }
          cache.weight = Math.max(...weights);
        }
        else {
          cache.weight = Math.ceil(cache.ox.elm_weight(-cnstr));
        }
      }
      if(mmin && cache.weight < mmin || mmax && cache.weight > mmax) {
        return false;
      }
    }

    // получаем связанные табличные части
    const {selection_params, specification_restrictions} = this._owner._owner;
    const prop_direction = $p.job_prm.properties.direction;


    // по таблице параметров сначала строим Map ИЛИ
    let {_or} = this;
    if(!_or) {
      _or = new Map();
      for(const {_row} of selection_params._obj.filter((row) => row.elm === elm && row.dop === dop)) {
        if(!_or.has(_row.area)) {
          _or.set(_row.area, []);
        }
        _or.get(_row.area).push(_row);
      }
      this._or = _or;
    }

    let res = true;
    const profile = contour.profile_by_furn_side(side, cache);
    for(const grp of _or.values()) {
      let grp_ok = true;
      for (const prm_row of grp) {
        // выполнение условия рассчитывает объект CchProperties
        grp_ok = (prop_direction == prm_row.param) ?
          direction == prm_row.value : prm_row.param.check_condition({
            row_spec: this,
            prm_row,
            elm: profile,
            cnstr,
            ox: cache.ox,
            layer: contour,
          });
        // если строка условия в ключе не выполняется, то дальше проверять его условия смысла нет
        if (!grp_ok) {
          break;
        }
      }
      res = grp_ok;
      if(res) {
        break;
      }
    }

    // по таблице ограничений
    if(res) {

      specification_restrictions.find_rows({elm, dop}, (row) => {
        const {lmin, lmax, amin, amax, side, for_direct_profile_only} = row;
        const elm = contour.profile_by_furn_side(side, cache);

        // Проверка кривизны
        if(for_direct_profile_only === -1 && elm.is_linear()) {
          return res = false;
        }
        if(for_direct_profile_only === 1 && !elm.is_linear()) {
          return res = false;
        }

        // Проверка длины
        const { side_count } = contour;
        const prev = contour.profile_by_furn_side(row.side === 1 ? side_count : row.side - 1, cache);
        const next = contour.profile_by_furn_side(row.side === side_count ? 1 : row.side + 1, cache);
        const len = (elm._row.len - prev.nom.sizefurn - next.nom.sizefurn).round();
        if (len < lmin || len > lmax) {
          return res = false;
        }

        // Проверка угла
        const angle = direction == $p.enm.open_directions.Правое ?
          elm.generatrix.angle_to(prev.generatrix, elm.e) :
          prev.generatrix.angle_to(elm.generatrix, elm.b);
        if (angle < amin || angle > amax) {
          return res = false;
        }
      });
    }

    return res;
  }

  get nom() {
    return this._getter('nom') || this._getter('nom_set');
  }
  set nom(v) {
    if(v !== '') {
      this._setter('nom', v);
    }
  }

  get nom_set() {
    return this.nom;
  }
  set nom_set (v) {
    this.nom = v;
  }

};




/**
 * Дополнительные методы справочника Вставки
 *
 * Created 23.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2018
 * @author Evgeniy Malyarov
 * @module cat_inserts
 */

// подписываемся на событие после загрузки из pouchdb-ram и готовности предопределенных
(($p) => {

  const {md, cat, enm, cch, dp, utils, adapters: {pouch}, job_prm, CatFormulas, CatInsertsSpecificationRow, EditorInvisible} = $p;

  const {inserts_types} = enm;

  if(job_prm.use_ram !== false){
    md.once('predefined_elmnts_inited', () => {
      cat.scheme_settings && cat.scheme_settings.find_schemas('dp.buyers_order.production');
    });
  }

  cat.inserts.__define({

    _types_filling: {
      value: [
        inserts_types.Заполнение,
        inserts_types.Стеклопакет,
      ]
    },

    _types_main: {
      value: [
        inserts_types.Профиль,
        inserts_types.Заполнение,
        inserts_types.Стеклопакет,
      ]
    },

    /**
     * возвращает возможные параметры вставок данного типа
     */
    _prms_by_type: {
      value(insert_type) {
        const prms = new Set();
        this.find_rows({available: true, insert_type}, (inset) => {
          inset.used_params().forEach((param) => {
            !param.is_calculated && prms.add(param);
          });
        });
        return prms;
      }
    },

    ItemData: {
      value: class ItemData {

        constructor(item, Renderer) {

          this.Renderer = Renderer;
          this.count = 0;
          const idata = this;

          // индивидуальные классы строк
          class ItemRow extends $p.DpBuyers_orderProductionRow {

            // корректирует метаданные полей свойств через связи параметров выбора
            tune(ref, mf, column) {

              const {inset} = this;
              const prm = cch.properties.get(ref);

              // удаляем все связи, кроме владельца
              if(mf.choice_params) {
                const adel = new Set();
                for(const choice of mf.choice_params) {
                  if(choice.name !== 'owner' && choice.path != prm) {
                    adel.add(choice);
                  }
                }
                for(const choice of adel) {
                  mf.choice_params.splice(mf.choice_params.indexOf(choice), 1);
                }
              }
              else {
                mf.choice_params = [];
              }

              // если параметр не используется в текущей вставке, делаем ячейку readonly
              const prms = new Set();
              inset.used_params().forEach((param) => {
                !param.is_calculated && prms.add(param);
              });
              mf.read_only = !prms.has(prm);

              // находим связи параметров
              if(!mf.read_only) {
                const links = prm.params_links({grid: {selection: {}}, obj: this});
                const hide = links.some((link) => link.hide);
                if(hide && !mf.read_only) {
                  mf.read_only = true;
                }

                // проверим вхождение значения в доступные и при необходимости изменим
                if(links.length) {
                  // TODO: подумать про установку умолчаний
                  //prm.linked_values(links, this);
                  const filter = {}
                  prm.filter_params_links(filter, null, links);
                  filter.ref && mf.choice_params.push({
                    name: 'ref',
                    path: filter.ref,
                  });
                }

              }
            }

            get_row(param) {
              const {product_params} = this._owner._owner;
              return product_params.find({elm: this.row, param}) || product_params.add({elm: this.row, param});
            }

            value_change(field, type, value) {
              if(field === 'inset') {
                value = cat.inserts.get(value);
                if(value.insert_type == inserts_types.Параметрик) {
                  idata.tune_meta(value, this);
                }
              }
              super.value_change(field, type, value);
            }

            get elm() {
              return this.row;
            }
          }

          this.ProductionRow = ItemRow;

          // отбор по типу вставки
          this.meta = utils._clone(dp.buyers_order.metadata('production'));
          this.meta.fields.inset.choice_params[0].path = item;
          this.meta.fields.inset.disable_clear = true;

          // получаем возможные параметры вставок данного типа
          if(item !== inserts_types.Параметрик) {
            const changed = this.tune_meta(item);
            const {current_user} = $p;
            for(const scheme of changed) {
              if(pouch.local.doc.adapter === 'http' && !scheme.user) {
                current_user && current_user.roles.includes('doc_full') && scheme.save();
              }
              else {
                scheme.save();
              }
            }
          }

        }

        tune_meta(item, prototype) {
          const changed = new Set();
          let params, with_scheme, meta;

          if(!prototype) {
            prototype = this.ProductionRow.prototype;
            params = cat.inserts._prms_by_type(item);
            with_scheme = true;
            meta = this.meta;
          }
          else {
            params = new Set();
            item.product_params.forEach(({param}) => params.add(param));
            if(!prototype._meta) {
              Object.defineProperty(prototype, '_meta', {value: utils._clone(this.meta)});
            }
            meta = prototype._meta;
          }

          // прибиваем лишние параметры прежней вставки
          if(!with_scheme) {
            for(const fld in prototype) {
              if(utils.is_guid(fld) && !Array.from(params).some(({ref}) => ref === fld)) {
                delete prototype[fld];
                delete meta.fields[fld];
                if(prototype._owner && prototype._owner._owner) {
                  const {product_params} = prototype._owner._owner;
                  for(const rm of product_params.find_rows({elm: prototype.row, fld})) {
                    product_params.del(rm);
                  }
                }
              }
            }
          }

          for (const param of params) {

            // корректируем схему
            if(with_scheme) {
              cat.scheme_settings.find_rows({obj: 'dp.buyers_order.production', name: item.name}, (scheme) => {
                if(!scheme.fields.find({field: param.ref})) {
                  // добавляем строку с новым полем
                  const row = scheme.fields.add({
                    field: param.ref,
                    caption: param.caption,
                    use: true,
                  });
                  const note = scheme.fields.find({field: 'note'});
                  note && scheme.fields.swap(row, note);

                  changed.add(scheme);
                }
              });
            }

            // корректируем метаданные
            if(!meta.fields[param.ref]) {
              meta.fields[param.ref] = {
                synonym: param.caption,
                type: param.type,
              };
            }
            const mf = meta.fields[param.ref];

            // отбор по владельцу
            if(param.type.types.some(type => type === 'cat.property_values')) {
              mf.choice_params = [{name: 'owner', path: param}];
            }

            // учтём дискретный ряд
            const drow = item.product_params && item.product_params.find({param});
            if(drow && drow.list) {
              try{
                mf.list = JSON.parse(drow.list);
              }
              catch (e) {
                delete mf.list;
              }
            }
            else {
              delete mf.list;
            }

            // корректируем класс строки
            if(!prototype.hasOwnProperty(param.ref)){
              Object.defineProperty(prototype, param.ref, {
                get() {
                  return this.get_row(param).value;
                },
                set(v) {
                  this.get_row(param).value = v;
                },
                configurable: true,
                enumerable: true,
              });
            }
          }

          return changed;
        }

      }
    },

    /**
     * Возвращает массив заполнений в заданном диапазоне толщин
     * @param min {Number|Array|CatProduction_params}
     * @param max {Number|undefined}
     * @return {Array.<CatInserts>}
     */
    by_thickness: {
      value(min, max) {
        const res = [];

        if(!this._by_thickness) {
          this._by_thickness = new Map();
          this.find_rows({insert_type: {in: this._types_filling}, _top: 10000}, (ins) => {
            const thickness = ins.thickness();
            if(thickness) {
              if(!this._by_thickness.has(thickness)) {
                this._by_thickness.set(thickness, []);
              }
              this._by_thickness.get(thickness).push(ins);
            }
          });
        }

        if(min instanceof $p.CatProduction_params) {
          const {thicknesses, glass_thickness} = min;
          max = 0;

          if(glass_thickness === 0) {
            min = thicknesses;
          }
          else if(glass_thickness === 1) {
            const {Заполнение, Стекло} = $p.enm.elm_types;
            min.elmnts.find_rows({elm_type: {in: [Заполнение, Стекло]}}, ({nom}) => res.push(nom));
            return res;
          }
          else if(glass_thickness === 2) {
            const min_in_sys = thicknesses[0];
            const max_in_sys = thicknesses[thicknesses.length - 1];
            for (const [thin, arr] of this._by_thickness) {
              if(thin >= min_in_sys && thin <= max_in_sys) {
                Array.prototype.push.apply(res, arr);
              }
            }
            return res;
          }
          else if(glass_thickness === 3) {
            for (const obj of this._by_thickness) {
              Array.prototype.push.apply(res, obj[1]);
            }
            return res;
          }
        }

        for (const [thin, arr] of this._by_thickness) {
          if(!max && Array.isArray(min)) {
            if(min.includes(thin)) {
              Array.prototype.push.apply(res, arr);
            }
          }
          else {
            if(thin >= min && thin <= max) {
              Array.prototype.push.apply(res, arr);
            }
          }
        }

        return res;
      }
    },

    sql_selection_list_flds: {
      value(initial_value) {
        return "SELECT _t_.ref, _t_.`_deleted`, _t_.is_folder, _t_.id,_t_.note as note,_t_.priority as priority ,_t_.name as presentation, _k_.synonym as insert_type," +
          " case when _t_.ref = '" + initial_value + "' then 0 else 1 end as is_initial_value FROM cat_inserts AS _t_" +
          " left outer join enm_inserts_types as _k_ on _k_.ref = _t_.insert_type %3 ORDER BY is_initial_value, priority desc, presentation LIMIT 2000 ";
      }
    },

    sql_selection_where_flds: {
      value(filter){
        return ` OR _t_.note LIKE '${filter}' OR _t_.id LIKE '${filter}' OR _t_.name LIKE '${filter}'`;
      }
    },

  });

  cat.inserts.metadata('specification').index = 'is_main_elm';

  // переопределяем прототип
  class CatInserts extends $p.CatInserts {

    /**
     * Возвращает строки спецификации основной номенклатуры
     * @param [elm] {BuilderElement}
     * @param [strict] {Boolean}
     * @return {Array.<CatInsertsSpecificationRow>}
     */
    main_rows(elm, strict) {

      const {_data} = this;
      let main_rows;

      if(strict) {
        if(!_data.main_rows_strict) {
          _data.main_rows_strict = this.specification._obj.filter(({is_main_elm}) => is_main_elm).map(({_row}) => _row);
        }
        main_rows = _data.main_rows_strict;
      }
      else {
        if(!_data.main_rows) {
          _data.main_rows = this.specification._obj.filter(({is_main_elm}) => is_main_elm).map(({_row}) => _row);
          if(!_data.main_rows.length && this.specification.count()){
            _data.main_rows.push(this.specification.get(0));
          }
        }
        main_rows = _data.main_rows;
      }

      if(!elm || main_rows.length < 2) {
        return main_rows;
      }
      const {check_params} = ProductsBuilding;
      const ox = elm.prm_ox || elm.ox;
      return main_rows.filter((row) => {
        return this.check_base_restrictions(row, elm) && check_params({
          params: this.selection_params,
          ox,
          elm,
          row_spec: row,
          cnstr: 0,
          origin: elm.fake_origin || 0,
        });
      });
    }

    /**
     * Выясняет, зависит ли номенклатура вставки от текущего параметра
     * @param param {CchProperties}
     * @return {Boolean}
     */
    is_depend_of(param) {
      const {_data: {main_rows}, selection_params} = this;
      if(!main_rows || main_rows.length === 1) {
        return false;
      }
      for(const row of main_rows) {
        if(selection_params.find({elm: row.elm, param: param.ref})) {
          return true;
        }
      }
    }

    /**
     * Выясняет, надо ли вытягивать данную вставку в продукцию
     *
     * @example
     * // Пример формулы:
     * let {elm, contour} = obj;
     * if(!contour && elm) {
     *  contour = elm.layer;
     * }
     * const {specification_order_row_types: types} = $p.enm;
     * return contour ? types.Продукция : types.Нет;
     *
     * @param ox {CatCharacteristics}
     * @param elm {BuilderElement}
     * @param [contour] {Contour}
     * @return {Boolean}
     */
    is_order_row_prod({ox, elm, contour}) {
      const {Продукция} = enm.specification_order_row_types;
      const {params} = ox;
      let {is_order_row, insert_type, _manager: {_types_filling}} = this;

      // заполнения в продукцию не выносим, если бит "без заполнений"
      if(_types_filling.includes(insert_type)) {
        const param = cch.properties.predefined('without_glasses');
        if(param && params?.find({cnstr: 0, param})?.value) {
          return false;
        }
      }

      if(_types_filling.includes(insert_type)) {
        const param = cch.properties.predefined('glass_separately');
        param && params?.find_rows({param}, ({cnstr, value}) => {
          if(elm && (cnstr === -elm.elm)) {
            is_order_row = value ? Продукция : '';
            return false;
          }
          if(!cnstr || (contour && cnstr === contour.cnstr)) {
            is_order_row = value ? Продукция : '';
          }
        });
      }

      if(is_order_row instanceof CatFormulas) {
        is_order_row = is_order_row.execute({ox, elm, contour});
      }
      return is_order_row === Продукция;
    }

    /**
     * Возвращает номенклатуру вставки в завсисмости от свойств элемента
     * @param elm {BuilderElement}
     * @param [strict] {Boolean} - строгий режим
     */
    nom(elm, strict) {

      const {_data} = this;

      if(!strict && !elm && _data.nom) {
        return _data.nom;
      }

      let _nom;
      const main_rows = this.main_rows(elm, strict);

      if(main_rows.length && main_rows[0].nom instanceof CatInserts){
        if(main_rows[0].nom == this) {
          _nom = cat.nom.get();
        }
        else {
          _nom = main_rows[0].nom.nom(elm, strict);
        }
      }
      else if(main_rows.length){
        if(elm && !main_rows[0].formula.empty()) {
          try {
            _nom = main_rows[0].formula.execute({elm});
            if(!_nom) {
              _nom = main_rows[0].nom;
            }
          } catch (e) {
            _nom = main_rows[0].nom;
          }
        }
        else {
          _nom = main_rows[0].nom;
        }
      }
      else {
        _nom = cat.nom.get();
      }

      if(main_rows.length < 2){
        _data.nom = typeof _nom == 'string' ? cat.nom.get(_nom) : _nom;
      }
      else{
        // TODO: реализовать фильтр
        _data.nom = _nom;
      }

      return _data.nom;
    }

    /**
     * Ширина основной номенклатуры вставки
     * @param elm {BuilderElement}
     * @param [strict] {Boolean} - строгий режим
     * @return {*|number}
     */
    width(elm, strict) {
      return this.nom(elm, strict).width || 80;
    }

    /**
     * Возвращает атрибуты характеристики виртуальной продукции по вставке в контур
     */
    contour_attrs(contour) {

      const main_rows = [];
      const res = {calc_order: contour.project.ox.calc_order};

      this.specification.find_rows({is_main_elm: true}, (row) => {
        main_rows.push(row);
        return false;
      });

      if(main_rows.length){
        const irow = main_rows[0],
          sizes = {},
          sz_keys = {},
          sz_prms = ['length', 'width', 'thickness']
            .map((name) => {
              const prm = job_prm.properties[name];
              if(prm) {
                sz_keys[prm.ref] = name;
                return prm;
              }
            })
            .filter((prm) => prm);

        // установим номенклатуру продукции
        res.owner = irow.nom instanceof CatInserts ? irow.nom.nom() : irow.nom;

        // если в параметрах вставки задействованы свойства длина и или ширина - габариты получаем из свойств
        contour.project.ox.params.find_rows({
          cnstr: contour.cnstr,
          inset: this,
          param: {in: sz_prms}
        }, (row) => {
          sizes[sz_keys[row.param.ref]] = row.value
        });

        if(Object.keys(sizes).length > 0){
          res.x = sizes.length ? (sizes.length + irow.sz) * (irow.coefficient * 1000 || 1) : 0;
          res.y = sizes.width ? (sizes.width + irow.sz) * (irow.coefficient * 1000 || 1) : 0;
          res.s = ((res.x * res.y) / 1e6).round(3);
          res.z = sizes.thickness * (irow.coefficient * 1000 || 1);
        }
        else{
          if(irow.count_calc_method == enm.count_calculating_ways.formulas && !irow.formula.empty()){
            irow.formula.execute({
              ox: contour.project.ox,
              contour: contour,
              inset: this,
              row_ins: irow,
              res: res
            });
          }
          if(irow.count_calc_method == enm.count_calculating_ways.area && this.insert_type == inserts_types.МоскитнаяСетка){
            // получаем габариты смещенного периметра
            const bounds = contour.bounds_inner(irow.sz, this);
            res.x = bounds.width.round(1);
            res.y = bounds.height.round(1);
            res.s = ((res.x * res.y) / 1e6).round(3);
          }
          else{
            res.x = contour.w + irow.sz;
            res.y = contour.h + irow.sz;
            res.s = ((res.x * res.y) / 1e6).round(3);
          }
        }
      }

      return res;

    }

    /**
     * Проверяет ограничения вставки параметрика
     * @param elm {BuilderElement}
     * @param len_angl {Object}
     * @param params {Array}
     */
    check_prm_restrictions({elm, len_angl, params}) {
      const {lmin, lmax, hmin, hmax} = this;
      const {len, height, s} = elm;

      let name = this.name + ':', err = false;

      if(lmin && len < lmin) {
        err = true;
        name += `\nдлина ${len} < ${lmin}`;
      }
      if(lmax && len > lmax) {
        err = true;
        name += `\nдлина ${len} > ${lmax}`;
      }
      if(hmin && height < hmin) {
        err = true;
        name += `\nвысота ${height} < ${hmin}`;
      }
      if(hmax && height > hmax) {
        err = true;
        name += `\nвысота ${height} > ${hmax}`;
      }

      // получаем набор параметров, используемых текущей вставкой
      const used_params = this.used_params();

      // добавляем параметр в характеристику, если используется в текущей вставке
      params.forEach(({param, value}) => {
        if(used_params.includes(param) && param.mandatory && (!value || value.empty())) {
          err = true;
          name += `\nне заполнен обязательный параметр '${param.name}'`;
        }
      });

      if(err) {
        throw new Error(name);
      }
    }

    /**
     * Проверяет ограничения вставки или строки вставки
     * @param row {CatInserts|CatInsertsSpecificationRow}
     * @param elm {BuilderElement}
     * @param [by_perimetr] {Boolean}
     * @param [len_angl] {Object}
     * @return {Boolean}
     */
    check_restrictions(row, elm, by_perimetr, len_angl) {

      if(!this.check_base_restrictions(row, elm)) {
        return false;
      }

      const {_row} = elm;
      const is_row = !utils.is_data_obj(row);

      // Главный элемент с нулевым количеством не включаем
      if(is_row && row.is_main_elm && !row.quantity){
        return false;
      }

      if (by_perimetr || row.count_calc_method !== enm.count_calculating_ways.perim) {
        if(!(elm instanceof EditorInvisible.Filling)) {
          const len = len_angl ? len_angl.len : _row.len;
          if (row.lmin > len || (row.lmax < len && row.lmax > 0)) {
            return false;
          }
        }
        if (is_row) {
          const angle_hor = len_angl && len_angl.hasOwnProperty('angle_hor') ? len_angl.angle_hor : _row.angle_hor;
          if (row.ahmin > angle_hor || row.ahmax < angle_hor) {
            return false;
          }
        }
      }

      //// Включить проверку размеров и углов, поля "Устанавливать с..." и т.д.

      return true;
    }

    /**
     * Проверяет базовые ограничения вставки или строки вставки
     * @param row
     * @param elm
     * @return {boolean}
     */
    check_base_restrictions(row, elm) {
      const {_row} = elm;

      if(elm instanceof EditorInvisible.Filling) {
        // проверяем площадь
        if(row.smin > _row.s || (_row.s && row.smax && row.smax < _row.s)){
          return false;
        }
        // и фильтр по габаритам
        if(row instanceof CatInserts) {
          const {width, height} = elm.bounds;
          const {lmin, lmax, hmin, hmax, can_rotate} = row;
          // Если можно вращать то проверим 2 направления
          if (can_rotate) {
            const w1 = width > lmin && width < lmax;
            const h1 = height > hmin && height < hmax;
            const w2 = height > lmin && height < lmax;
            const h2 = width > hmin && width < hmax;
            if (!((w1 && h1) || (w2 && h2))) {
              return false;
            }
          }
          else if ((lmin > width) || (lmax && lmax < width) || (hmin > height) || (hmax && hmax < height)) {
            return false;
          }
        }
      }
      else {
        const is_linear = elm.is_linear ? elm.is_linear() : true;
        // только для прямых или только для кривых профилей
        if((row.for_direct_profile_only > 0 && !is_linear) || (row.for_direct_profile_only < 0 && is_linear)){
          return false;
        }
      }

      if(row.rmin > _row.r || (_row.r && row.rmax && row.rmax < _row.r)){
        return false;
      }

      return true;
    }

    /**
     * Возвращает спецификацию вставки с фильтром
     * @method filtered_spec
     * @param elm {BuilderElement|Object} - элемент, к которому привязана вставка
     * @param elm2 {BuilderElement|Object} - соседний элемент, имеет смысл, когда вставка вызвана из соединения
     * @param ox {CatCharacteristics} - текущая продукция
     * @param [is_high_level_call] {Boolean} - вызов верхнего уровня - специфично для стеклопакетов
     * @param [len_angl] {Object} - контекст размеров элемента
     * @param [own_row] {CatInsertsSpecificationRow|CatCnnsSpecificationRow} - родительская строка для вложенных вставок
     * @return {Array}
     */
    filtered_spec({elm, elm2, eclr, is_high_level_call, len_angl, own_row, ox}) {

      const res = [];

      if(this.empty()){
        return res;
      }

      const {insert_type, _manager: {_types_filling, _types_main}} = this;
      const {inserts_types: {profile, coloring}, angle_calculating_ways: {Основной}, count_calculating_ways: {parameters}} = enm;
      const {check_params} = ProductsBuilding;

      function fake_row(sub_row, row) {
        const fakerow = {};
        if(sub_row._metadata) {
          for (let fld in sub_row._metadata().fields) {
            fakerow[fld] = sub_row[fld];
          }
        }
        else {
          Object.assign(fakerow, sub_row);
        }
        fakerow._owner = sub_row._owner;

        // количество по параметру
        if(sub_row instanceof CatInsertsSpecificationRow && sub_row.count_calc_method === parameters) {
          fakerow._owner._owner.selection_params.find_rows({elm: sub_row.elm, origin: 'algorithm'}, (prm_row) => {
            const {rnum} = elm;
            fakerow.quantity = (rnum ? elm[prm_row.param.valueOf()] : ox.extract_value({cnstr: [0, -elm.elm], param: prm_row.param})) || 0;
            return false;
          });
        }

        if(row) {
          fakerow.quantity = (fakerow.quantity || (sub_row.count_calc_method === parameters ? 0 : 1)) * (row.quantity || 1);
          fakerow.coefficient = (fakerow.coefficient || row.coefficient) ? fakerow.coefficient * (row.coefficient || 1) : 0;
          if(fakerow.clr.empty()) {
            fakerow.clr = row.clr;
          }
          if(fakerow.angle_calc_method === Основной) {
            fakerow.angle_calc_method = row.angle_calc_method;
          }
          if(!fakerow.sz) {
            fakerow.sz = row.sz;
          }
        }

        return fakerow;
      }

      // для заполнений, можно переопределить состав верхнего уровня
      if(is_high_level_call && _types_filling.includes(insert_type)){

        const glass_rows = [];
        ox.glass_specification.find_rows({elm: elm.elm, inset: {not: utils.blank.guid}}, (row) => {
          glass_rows.push(row);
        });

        // если спецификация верхнего уровня задана в изделии, используем её, параллельно формируем формулу
        if(glass_rows.length){
          glass_rows.forEach((row) => {
            const relm = elm.region(row);
            for(const srow of row.inset.filtered_spec({elm: relm, len_angl, ox, own_row: {clr: row.clr}})) {
              const frow = srow instanceof CatInsertsSpecificationRow ? fake_row(srow) : srow;
              frow.relm = relm;
              frow.origin = row.inset;
              res.push(frow);
            }
          });
          return res;
        }
      }

      const {flipped} = elm.layer || {};
      this.specification.forEach((row) => {

        // Проверяем ограничения строки вставки
        if(!this.check_restrictions(row, elm, insert_type === profile, len_angl)){
          return;
        }

        // Проверяем параметры изделия, контура или элемента
        if(own_row && row.clr.empty() && !own_row.clr.empty()){
          row = fake_row(row);
          row.clr = own_row.clr;
        }
        if(!check_params({
          params: this.selection_params,
          ox,
          elm,
          elm2,
          row_spec: row,
          cnstr: len_angl && len_angl.cnstr,
          origin: len_angl && len_angl.origin,
        })){
          return;
        }

        // Добавляем или разузловываем дальше
        if(row.nom instanceof CatInserts){
          if(row.nom.insert_type === coloring) {
            // добавляем одну или две строки
            if(!eclr) {
              eclr = elm.clr;
            }
            const selector = {
              params: this.selection_params,
              ox,
              elm,
              elm2,
              row_spec: row,
              cnstr: len_angl && len_angl.cnstr,
              origin: len_angl && len_angl.origin,
              eclr,
            };
            if(eclr.is_composite()) {
              let {clr_in, clr_out} = eclr;
              if(flipped) {
                [clr_in, clr_out] = [clr_out, clr_in];
              }
              selector.eclr = clr_in;
              if(check_params(selector)) {
                row.nom.filtered_spec({elm, elm2, eclr: clr_in, len_angl, ox, own_row: own_row || row}).forEach((subrow) => {
                  const fakerow = fake_row(subrow, row);
                  fakerow._origin = row.nom;
                  fakerow._clr_side = '_in';
                  fakerow._clr = clr_in;
                  res.push(fakerow);
                });
              }
              selector.eclr = clr_out;
              if(check_params(selector)) {
                row.nom.filtered_spec({elm, elm2, eclr: clr_out, len_angl, ox, own_row: own_row || row}).forEach((subrow) => {
                  const fakerow = fake_row(subrow, row);
                  fakerow._origin = row.nom;
                  fakerow._clr_side = '_out';
                  fakerow._clr = clr_out;
                  res.push(fakerow);
                });
              }
            }
            else {
              row.nom.filtered_spec({elm, elm2, eclr, len_angl, ox, own_row: own_row || row}).forEach((subrow) => {
                const fakerow = fake_row(subrow, row);
                fakerow._origin = row.nom;
                fakerow._clr = eclr;
                res.push(fakerow);
              });
            }
          }
          else {
            row.nom.filtered_spec({elm, elm2, len_angl, ox, own_row: own_row || row}).forEach((subrow) => {
              const fakerow = fake_row(subrow, row);
              fakerow._origin = row.nom;
              res.push(fakerow);
            });
          }
        }
        else{
          res.push(row);
        }

      });

      // контроль массы, размеров основной вставки
      if(_types_main.includes(insert_type) && !this.check_restrictions(this, elm, insert_type == profile, len_angl)){
        elm.err_spec_row(job_prm.nom.critical_error, this);
      }

      return res;
    }

    /**
     * Дополняет спецификацию изделия спецификацией текущей вставки
     * @method calculate_spec
     * @param elm {BuilderElement}
     * @param [elm2] {BuilderElement}
     * @param [len_angl] {Object}
     * @param ox {CatCharacteristics}
     * @param own_row {CatCnnsSpecificationRow}
     * @param spec {TabularSection}
     * @param clr {CatClrs}
     * @param totqty0 {Boolean} - если взведён, в totqty1 пишем 0 (например, для реализации параметра "Без заполнений")
     */
    calculate_spec({elm, elm2, len_angl, own_row, ox, spec, clr, totqty0}) {

      const {_row} = elm;
      const {
        perim,
        steps,
        formulas,
        element,
        parameters,
        area,
        len_prm,
        dimensions,
        cnns,
        fillings,
        coloring,
      } = enm.count_calculating_ways;
      const {profile_items} = enm.elm_types;
      const {new_spec_row, calc_qty_len, calc_count_area_mass} = ProductsBuilding;

      if(!spec){
        spec = ox.specification;
      }

      this.filtered_spec({elm, elm2, is_high_level_call: true, len_angl, own_row, ox, clr}).forEach((row_ins_spec) => {

        const origin = row_ins_spec._origin || this;
        let {count_calc_method, angle_calc_method, sz, offsets, coefficient, formula} = row_ins_spec;
        if(!coefficient) {
          coefficient = 0.001;
        }

        let row_spec;

        // добавляем строку спецификации, если профиль или не про шагам
        if(![perim, steps, fillings].includes(count_calc_method) || profile_items.includes(_row.elm_type)){
          if(!row_ins_spec.quantity) {
            return;
          }
          row_spec = new_spec_row({elm, row_base: row_ins_spec, origin, spec, ox, len_angl});
        }

        if(count_calc_method === formulas && !formula.empty()){
          // если строка спецификации не добавлена на предыдущем шаге, делаем это сейчас
          row_spec = new_spec_row({row_spec, elm, row_base: row_ins_spec, origin, spec, ox, len_angl});
        }
        else if(count_calc_method === coloring) {
          count_calc_method.calculate({inset: this, elm, row_spec, row_ins_spec, spec, ox});
        }
        // для вставок в профиль способ расчета количества не учитывается
        else if(profile_items.includes(_row.elm_type) || [element, parameters].includes(count_calc_method)){
          calc_qty_len(row_spec, row_ins_spec, len_angl ? len_angl.len : _row.len);
          // размер может уточняться по соединениям
          if(count_calc_method == cnns){
            const {b, e} = elm.rays;
            for(const node of [b, e]) {
              const {cnn} = node;
              if(cnn) {
                row_spec.len -= cnn.nom_size({nom: row_spec.nom, elm, len_angl: node.len_angl(), ox}) * coefficient;
              }
            }
          }
        }
        else{

          if(count_calc_method === area) {
            count_calc_method.calculate({inset: this, elm, row_spec, row_ins_spec});
          }
          else if(count_calc_method === perim){
            let {perimeter} = elm;
            if(!perimeter) {
              if(this.insert_type === enm.inserts_types.mosquito) {
                perimeter = elm.layer.perimeter_inner(sz, row_ins_spec.nom);
                Object.defineProperty(elm, 'perimeter', {value: perimeter});
              }
              else {
                perimeter = elm.layer.perimeter;
              }
            }
            const row_prm = {_row: {len: 0, angle_hor: 0, s: _row.s}};
            const {check_params} = ProductsBuilding;
            perimeter.forEach((rib) => {
              row_prm._row._mixin(rib);
              row_prm.is_linear = () => rib.profile ? rib.profile.is_linear() : true;
              if(this.check_restrictions(row_ins_spec, row_prm, true) && check_params({
                params: (row_ins_spec.origin || this).selection_params,
                ox,
                elm: row_prm,
                row_spec: row_ins_spec,
                origin: row_ins_spec.origin || this,
                count_calc_method,
              })){
                row_spec = new_spec_row({elm, row_base: row_ins_spec, origin, spec, ox, len_angl});
                // при расчете по периметру, выполняем формулу для каждого ребра периметра
                const fqty = !formula.empty() && formula.execute({
                  ox,
                  clr,
                  row_spec,
                  elm: rib.profile || rib,
                  elm2,
                  cnstr: len_angl && len_angl.cnstr || 0,
                  inset: (len_angl && len_angl.hasOwnProperty('cnstr')) ? len_angl.origin : utils.blank.guid,
                  row_ins: row_ins_spec,
                  len: rib.len
                });
                // если формула не вернула значение, устанавливаем qty_len стандартным способом
                if(fqty) {
                  if(!row_spec.qty) {
                    row_spec.qty = fqty;
                  }
                }
                else {
                  calc_qty_len(row_spec, row_ins_spec, rib.len);
                }
                calc_count_area_mass(row_spec, spec, len_angl && len_angl.hasOwnProperty('alp1') ? len_angl : _row,
                  angle_calc_method, angle_calc_method, 0, 0, totqty0);
              }
              row_spec = null;
            });

          }
          else if(count_calc_method === steps){

            const bounds = this.insert_type == enm.inserts_types.МоскитнаяСетка ?
              elm.layer.bounds_inner(sz) : {height: _row.y2 - _row.y1, width: _row.x2 - _row.x1};

            const h = (!row_ins_spec.step_angle || row_ins_spec.step_angle == 180 ? bounds.height : bounds.width);
            const w = !row_ins_spec.step_angle || row_ins_spec.step_angle == 180 ? bounds.width : bounds.height;
            if(row_ins_spec.step){
              let qty = 0;
              let pos;
              if(row_ins_spec.do_center && h >= row_ins_spec.step ){
                pos = h / 2;
                if(pos >= offsets &&  pos <= h - offsets){
                  qty++;
                }
                for(let i = 1; i <= Math.ceil(h / row_ins_spec.step); i++){
                  pos = h / 2 + i * row_ins_spec.step;
                  if(pos >= offsets &&  pos <= h - offsets){
                    qty++;
                  }
                  pos = h / 2 - i * row_ins_spec.step;
                  if(pos >= offsets &&  pos <= h - offsets){
                    qty++;
                  }
                }
              }
              else{
                for(let i = 1; i <= Math.ceil(h / row_ins_spec.step); i++){
                  pos = i * row_ins_spec.step;
                  if(pos >= offsets &&  pos <= h - offsets){
                    qty++;
                  }
                }
              }

              if(qty){
                row_spec = new_spec_row({elm, row_base: row_ins_spec, origin, spec, ox, len_angl});

                const fqty = !formula.empty() && formula.execute({
                  ox,
                  clr,
                  row_spec,
                  elm,
                  elm2,
                  cnstr: len_angl && len_angl.cnstr || 0,
                  row_ins: row_ins_spec,
                  len: len_angl ? len_angl.len : _row.len
                });
                // TODO: непонятно, надо ли здесь учитывать fqty
                calc_qty_len(row_spec, row_ins_spec, w);
                row_spec.qty *= qty;
                calc_count_area_mass(row_spec, spec, len_angl && len_angl.hasOwnProperty('alp1') ? len_angl : _row,
                  angle_calc_method, angle_calc_method, 0, 0, totqty0);
              }
              row_spec = null;
            }
          }
          else if(count_calc_method === len_prm) {
            count_calc_method.calculate({inset: this, elm, row_spec, row_ins_spec, origin});
          }
          else if(count_calc_method === dimensions){
            let len = 0, width = 0;
            this.selection_params.find_rows({elm: row_ins_spec.elm}, ({param}) => {
              if(param.type.digits) {
                ox.params.find_rows({cnstr: 0, param}, ({value}) => {
                  if(!len) {
                    len = value;
                  }
                  else if(!width) {
                    width = value;
                  }
                  return false;
                });
              }
              if(len && width) return false;
            });
            row_spec.qty = row_ins_spec.quantity;
            row_spec.len = (len - sz) * coefficient;
            row_spec.width = (width - sz) * coefficient;
            row_spec.s = (row_spec.len * row_spec.width).round(3);
          }
          else if(count_calc_method === fillings){
            (elm.layer ? elm.layer.glasses(false, true) : []).forEach((glass) => {
              const {bounds} = glass;
              row_spec = new_spec_row({elm, row_base: row_ins_spec, origin, spec, ox, len_angl});
              // виртуальный номер элемента для данного способа расчета количества
              row_spec.elm = 11000 + glass.elm;
              row_spec.qty = row_ins_spec.quantity;
              row_spec.len = (bounds.height - sz) * coefficient;
              row_spec.width = (bounds.width - sz) * coefficient;
              row_spec.s = (row_spec.len * row_spec.width).round(3);
              calc_count_area_mass(row_spec, spec, len_angl && len_angl.hasOwnProperty('alp1') ? len_angl : _row, null, null, 0, 0, totqty0);

              const qty = !formula.empty() && formula.execute({
                ox: ox,
                elm: glass,
                cnstr: len_angl && len_angl.cnstr || 0,
                inset: (len_angl && len_angl.hasOwnProperty('cnstr')) ? len_angl.origin : utils.blank.guid,
                row_ins: row_ins_spec,
                row_spec: row_spec,
                clr,
              });

              row_spec = null;
            });
          }
          else{
            throw new Error(`count_calc_method: ${count_calc_method}`);
          }
        }

        if(row_spec){
          // выполняем формулу
          if(!formula.empty()){
            const qty = formula.execute({
              ox: ox,
              elm: elm,
              elm2,
              cnstr: len_angl && len_angl.cnstr || 0,
              inset: (len_angl && len_angl.hasOwnProperty('cnstr')) ? len_angl.origin : utils.blank.guid,
              row_ins: row_ins_spec,
              row_spec: row_spec,
              clr,
              len: len_angl ? len_angl.len : _row.len
            });
            if(count_calc_method == formulas) {
              row_spec.qty = qty;
            }
            else if(formula.condition_formula && !qty) {
              row_spec.qty = 0;
            }
          }
          calc_count_area_mass(row_spec, spec, len_angl?.hasOwnProperty('alp1') ? len_angl : _row,
            angle_calc_method, angle_calc_method, 0, 0, totqty0);
        }
      });

      // скорректируем габариты вытягиваемой конструкции
      if(spec !== ox.specification && this.insert_type == enm.inserts_types.Жалюзи) {
        const bounds = {x: 0, y: 0};
        spec.forEach(({len, width}) => {
          if(len && width) {
            if(bounds.x < len) {
              bounds.x = len;
            }
            if(bounds.y < width) {
              bounds.y = width;
            }
          }
        });
        const {_owner} = spec;
        _owner.x = bounds.y * 1000;
        _owner.y = bounds.x * 1000;
        _owner.s = (bounds.x * bounds.y).round(3);
      }
    }

    /**
     * Дополняет спецификацию изделия спецификацией текущего ряда
     * @method region_spec
     * @param elm {BuilderElement}
     * @param [len_angl] {Object}
     * @param ox {CatCharacteristics}
     * @param spec {TabularSection}
     * @param region {Number}
     */
    region_spec({elm, len_angl, ox, spec, region, totqty0}) {
      const {cat: {cnns}, enm: {angle_calculating_ways: {СоединениеПополам: s2, Соединение: s1}, predefined_formulas: {w2}}, products_building} = $p;
      const relm = elm.region(region);
      const {cnn1_row: {row: row1, cnn_point: b}, cnn2_row: {row: row2, cnn_point: e}, nom, _row} = relm;
      const cnn1 = row1 && !row1.cnn.empty() ? row1.cnn : cnns.nom_cnn(relm, b.profile, b.cnn_types, false, undefined, b)[0];
      const cnn2 = row2 && !row2.cnn.empty() ? row2.cnn : cnns.nom_cnn(relm, e.profile, e.cnn_types, false, undefined, e)[0];
      if(cnn1 && cnn2) {
        const row_cnn_prev = cnn1.main_row(relm);
        const row_cnn_next = cnn2.main_row(relm);
        const {new_spec_row, calc_count_area_mass} = ProductsBuilding;
        const row_base = row_cnn_prev || row_cnn_next;
        if(row_base) {
          const row_spec = new_spec_row({elm: relm, row_base, nom, origin: cnn1, spec, ox});
          row_spec.qty = row_base.quantity;

          // длина с учетом соединений
          const k001 = 0.001;
          const len = row_cnn_prev && row_cnn_prev.algorithm === w2 && row_cnn_next && row_cnn_next.algorithm === w2 ?
            elm.generatrix.length : _row.len;
          row_spec.len = (len - row_cnn_prev.sz - row_cnn_next.sz) * (row_cnn_prev.coefficient + row_cnn_next.coefficient) / 2;

          // припуск для гнутых элементов
          if(!elm.is_linear()) {
            row_spec.len = row_spec.len + row_spec.nom.arc_elongation * k001;
          }

          // дополнительная корректировка формулой - здесь можно изменить размер, номенклатуру и вообще, что угодно в спецификации
          if(!row_cnn_prev.formula.empty()) {
            row_cnn_prev.formula.execute({
              ox,
              elm: relm,
              inset: this,
              row_cnn: row_cnn_prev || row_cnn_next,
              row_spec
            });
          }
          else if(!row_cnn_next.formula.empty()) {
            row_cnn_next.formula.execute({
              ox,
              elm: relm,
              inset: this,
              row_cnn: row_cnn_next|| row_cnn_prev,
              row_spec
            });
          }

          // РассчитатьКоличествоПлощадьМассу
          const angle_calc_method_prev = row_cnn_prev ? row_cnn_prev.angle_calc_method : null;
          const angle_calc_method_next = row_cnn_next ? row_cnn_next.angle_calc_method : null;
          calc_count_area_mass(
            row_spec,
            spec,
            _row,
            angle_calc_method_prev,
            angle_calc_method_next,
            angle_calc_method_prev == s2 || angle_calc_method_prev == s1 ? b.profile.generatrix.angle_between(elm.generatrix, b.point) : 0,
            angle_calc_method_next == s2 || angle_calc_method_next == s1 ? elm.generatrix.angle_between(e.profile.generatrix, e.point) : 0,
            totqty0,
          );

          // добавляем спецификации соединений
          const len_angl = {
            angle: 0,
            alp1: b.profile ? b.profile.generatrix.angle_between(elm.generatrix, elm.b) : 90,
            alp2: e.profile ? elm.generatrix.angle_between(e.profile.generatrix, elm.e) : 90,
            len: row_spec ? row_spec.len * 1000 : _row.len,
            art1: false,
            art2: true,
            node: 'e',
          };
          len_angl.angle = len_angl.alp2;
          products_building.cnn_add_spec(cnn2, relm, len_angl, cnn1, e.profile);
          // с дрйгой стороны
          len_angl.angle = len_angl.alp1;
          len_angl.art2 = false;
          len_angl.art1 = true;
          len_angl.node = 'b';
          products_building.cnn_add_spec(cnn1, relm, len_angl, cnn2, b.profile);
        }
      }
      // спецификация вставки
      this.calculate_spec({elm: relm, len_angl, ox, spec});
    }

    /**
     * Возвращает толщину вставки
     * @param {elm} {BuilderElement}
     * @param [strict] {Number}
     * @return {number}
     */
    thickness(elm, strict) {

      if(elm) {
        const nom = this.nom(elm, true);
        if(nom && !nom.empty() && !nom._hierarchy(job_prm.nom.products)) {
          return nom.thickness;
        }
        const {check_params} = ProductsBuilding;
        const {_ox} = elm.layer;
        let thickness = 0;
        for(const row of this.specification) {
          if(row.quantity && this.check_base_restrictions(row, elm) && check_params({
            params: this.selection_params,
            ox: _ox,
            elm,
            row_spec: row,
            cnstr: 0,
            origin: elm.fake_origin || 0,
          })) {
            const {nom} = row;
            if(nom) {
              thickness += nom instanceof CatInserts ? nom.thickness(elm) : nom.thickness;
            }
          }
        }
        return thickness;
      }

      const {_data} = this;
      if(!_data.hasOwnProperty('thickness')) {
        _data.thickness = 0;
        const nom = this.nom(elm, true);
        if(nom && !nom.empty() && !nom._hierarchy(job_prm.nom.products)) {
          _data.thickness = nom.thickness;
        }
        else {
          for(const {nom, quantity} of this.specification) {
            if(nom && quantity) {
              _data.thickness += nom instanceof CatInserts ? nom.thickness(elm) : nom.thickness;
            }
          }
        }
      }

      return _data.thickness;
    }

    /**
     * Возвращает массив задействованных во вставке параметров
     * @return {Array}
     */
    used_params() {
      const {_data} = this;
      // если параметры этого набора уже обработаны - пропускаем
      if(_data.used_params) {
        return _data.used_params;
      }

      const sprms = [];
      const {order, product, nearest} = enm.plan_detailing;

      this.selection_params.forEach(({param, origin}) => {
        if(param.empty() || origin === product || origin === order || origin === nearest) {
          return;
        }
        if((!param.is_calculated || param.show_calculated) && !sprms.includes(param)){
          sprms.push(param);
        }
      });

      this.product_params.forEach(({param}) => {
        if(!param.empty() && (!param.is_calculated || param.show_calculated) && !sprms.includes(param)){
          sprms.push(param);
        }
      });

      const {cx_prm} = enm.predefined_formulas;
      this.specification.forEach(({nom, algorithm}) => {
        if(nom instanceof CatInserts) {
          for(const param of nom.used_params()) {
            !sprms.includes(param) && sprms.push(param);
          }
        }
        else if(algorithm === cx_prm && !sprms.includes(nom)) {
          sprms.push(nom);
        }
      });

      return _data.used_params = sprms;
    }

    get split_type(){
      let {split_type} = this._obj;
      if(!split_type) {
        split_type = [];
      }
      else if(split_type.startsWith('[')) {
        split_type = JSON.parse(split_type).map((ref) => enm.lay_split_types.get(ref));
      }
      else {
        split_type = [enm.lay_split_types.get(split_type)];
      }
      return split_type;
    }
    set split_type(v){this._setter('split_type',v)}

  }
  $p.CatInserts = CatInserts;

})($p);


/**
 * Дополнительные методы справочника Номенклатура
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 * @module cat_nom
 * Created 23.12.2015
 */

// определяем модификаторы
$p.cat.nom.__define({

	sql_selection_list_flds: {
		value(initial_value){
			return "SELECT _t_.ref, _t_.`_deleted`, _t_.is_folder, _t_.id, _t_.article, _t_.name as presentation, _u_.name as nom_unit, _k_.name as nom_kind, _t_.thickness," +
				" case when _t_.ref = '" + initial_value + "' then 0 else 1 end as is_initial_value FROM cat_nom AS _t_" +
				" left outer join cat_units as _u_ on _u_.ref = _t_.base_unit" +
				" left outer join cat_nom_kinds as _k_ on _k_.ref = _t_.nom_kind %3 %4 LIMIT 300";
		}
	},

	sql_selection_where_flds: {
		value(filter){
			return " OR _t_.article LIKE '" + filter + "' OR _t_.id LIKE '" + filter + "' OR _t_.name LIKE '" + filter + "'";
		}
	},

});



/**
 * ### Дополнительные методы справочника Контрагенты
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module cat_partners
 */

$p.cat.partners.__define({

	sql_selection_where_flds: {
		value(filter){
			return " OR inn LIKE '" + filter + "' OR name_full LIKE '" + filter + "' OR name LIKE '" + filter + "'";
		}
	}
});

$p.CatPartners.prototype.__define({

	addr: {
		get() {

			return this.contact_information._obj.reduce(function (val, row) {

				if(row.kind == $p.cat.contact_information_kinds.predefined("ЮрАдресКонтрагента") && row.presentation)
					return row.presentation;

				else if(val)
					return val;

				else if(row.presentation && (
						row.kind == $p.cat.contact_information_kinds.predefined("ФактАдресКонтрагента") ||
						row.kind == $p.cat.contact_information_kinds.predefined("ПочтовыйАдресКонтрагента")
					))
					return row.presentation;

			}, "")

		}
	},

	phone: {
		get() {

			return this.contact_information._obj.reduce(function (val, row) {

				if(row.kind == $p.cat.contact_information_kinds.predefined("ТелефонКонтрагента") && row.presentation)
					return row.presentation;

				else if(val)
					return val;

				else if(row.kind == $p.cat.contact_information_kinds.predefined("ТелефонКонтрагентаМобильный") && row.presentation)
					return row.presentation;

			}, "")
		}
	},

	// полное наименование с телефоном, адресом и банковским счетом
	long_presentation: {
		get() {
		  const {addr, phone, inn, kpp} = this;
			let res = this.name_full || this.name;

			if(inn){
        res+= ", ИНН" + inn;
      }
			if(kpp){
        res+= ", КПП" + kpp;
      }
			if(addr){
        res+= ", " + addr;
      }
			if(phone){
        res+= ", " + phone;
      }
			return res;
		}
	}
});


/**
 * Предопределенное поведение параметров
 *
 * Created 05.12.2021.
 */

$p.adapters.pouch.once('pouch_doc_ram_loaded', () => {
  const {cch: {properties}, cat: {formulas, clrs}, enm: {orientations, positions, comparison_types: ect}, EditorInvisible, utils} = $p;

  // стандартная часть создания fake-формулы
  function formulate(name) {
    const prm = properties.predefined(name);
    if(prm) {
      // fake-формула
      if(prm.calculated.empty()) {
        prm.calculated = formulas.create({ref: prm.ref, name: `predefined-${name}`}, false, true);
      }
      if(!prm.calculated._data._formula) {
        switch (name) {

        case 'clr_product':
          prm.calculated._data._formula = function (obj) {
            return obj?.ox?.clr || clrs.get();
          };
          break;

        case 'clr_inset':
          prm.calculated._data._formula = function ({elm, cnstr, ox}) {
            let clr;
            if(elm instanceof $p.DpBuyers_orderProductionRow || elm instanceof $p.DocCalc_order.FakeElm) {
              clr = elm.clr;
            }
            else {
              ox.inserts.find_rows({cnstr}, row => (clr = row.clr));
            }
            return clr;
          };
          break;

        case 'width':
          prm.calculated._data._formula = function (obj) {
            return obj?.ox?.y || 0;
          };
          break;

        case 'inset':
          prm.calculated._data._formula = function ({elm, prm_row, ox, row}) {

            // если запросили вставку соседнего элемента состава заполнения, возвращаем массив
            if(prm_row && prm_row.origin === prm_row.origin._manager.nearest && elm instanceof EditorInvisible.Filling){
              const res = new Set();
              ox.glass_specification.find_rows({elm: elm.elm}, ({inset}) => {
                if(row && row._owner && inset !== row._owner._owner) {
                  res.add(inset);
                }
              });
              return Array.from(res);
            }

            return elm?.inset;
          };
          break;

        case 'elm_weight':
          prm.calculated._data._formula = function (obj) {
            const {elm} = obj || {};
            return elm ? elm.weight : 0;
          };
          break;

        case 'elm_orientation':
          prm.calculated._data._formula = function ({elm, elm2}) {
            return elm?.orientation || elm2?.orientation || orientations.get();
          };
          break;

        case 'elm_pos':
          prm.calculated._data._formula = function ({elm}) {
            return elm?.pos || positions.get();
          };
          break;

        case 'elm_rectangular':
          prm.calculated._data._formula = function ({elm}) {
            const {is_rectangular} = elm;
            return typeof is_rectangular === 'boolean' ? is_rectangular : true;
          };
          break;

        case 'branch':
          prm.calculated._data._formula = function ({elm, layer, ox, calc_order}) {
            if(!calc_order && ox) {
              calc_order = ox.calc_order;
            }
            else if(!calc_order && layer) {
              calc_order = layer._ox.calc_order;
            }
            else if(!calc_order && elm) {
              calc_order = elm.ox.calc_order;
            }

            const prow = (ox || layer?._ox || elm?.ox).params.find({param});
            return prow && !prow.value.empty() ? prow.value : calc_order.manager.branch;
          };
          break;

        default:
          prm.calculated._data._formula = function () {};
        }
      }
    }
    return prm;
  }

  // создаём те, где нужна только формула со стандартным check_condition
  for(const name of [
    'clr_product',      // цвет изделия
    'elm_weight',       // масса элемента
    'elm_orientation',  // ориентация элемента
    'elm_pos',          // положение элемента
    'elm_rectangular',  // прямоугольность элемента
    'branch',           // отдел абонента текущего контекста
    'width',            // ширина из параметра
    'inset',            // вставка текущего элемента
    'clr_inset',        // цвет вставки в элемент
  ]) {
    formulate(name);
  }

  // угол к следующему
  ((name) => {
    const prm = formulate(name);
    if(prm) {
      // fake-признак использования
      if(!prm.use.count()) {
        prm.use.add({count_calc_method: 'ПоПериметру'});
      }
      // проверка условия
      prm.check_condition = function ({row_spec, prm_row, elm, elm2, cnstr, origin, ox}) {
        if(elm && elm._row && elm._row.hasOwnProperty(name)) {
          return utils.check_compare(elm._row.angle_next, prm_row.value, prm_row.comparison_type, prm_row.comparison_type._manager)
        }
        return Object.getPrototypeOf(this).check_condition.call(this, {row_spec, prm_row, elm, elm2, cnstr, origin, ox});
      }
    }
  })('angle_next');

  // уровень слоя
  ((name) => {
    const prm = formulate(name);
    if(prm) {
      // проверка условия
      prm.check_condition = function ({layer, prm_row}) {
        if(layer) {
          const {level} = layer;
          return utils.check_compare(level, prm_row.value, prm_row.comparison_type, prm_row.comparison_type._manager);
        }
        return true;
      }
    }
  })('layer_level');

  // вхождение элемента в габариты
  ((name) => {
    const prm = formulate(name);
    if(prm) {
      // проверка условия
      const ne = [ect.ne, ect.nin, ect.ninh, ect.nfilled];

      prm.check_condition = function ({elm, layer, prm_row}) {
        if(!prm_row._bounds) {
          try {
            prm_row._bounds = JSON.parse(prm_row.txt_row);
          }
          catch (e) {
            return true;
          }
        }
        const bounds = elm ? elm.bounds : layer?.bounds;
        if(!bounds) {
          return true;
        }
        let ok = bounds.width >= prm_row._bounds.xmin && bounds.width <= prm_row._bounds.xmax &&
          bounds.height >= prm_row._bounds.ymin && bounds.height <= prm_row._bounds.ymax;
        if(!ok && prm_row._bounds.rotate) {
          ok = bounds.height >= prm_row._bounds.xmin && bounds.height <= prm_row._bounds.xmax &&
            bounds.width >= prm_row._bounds.ymin && bounds.width <= prm_row._bounds.ymax;
        }
        return ne.includes(prm_row.comparison_type) ? !ok : ok;
      }
    }
  })('bounds_contains');

  // способ придания цвета
  ((name) => {
    const prm = formulate(name);
    if(prm) {
      // проверка условия
      prm.check_condition = function ({elm, eclr, row_spec, prm_row}) {
        const ct = prm_row.comparison_type || ect.eq;

        // если не задан eclr, используем цвет элемента
        const no_eclr = !eclr;
        if(no_eclr) {
          eclr = elm.clr;
        }

        const value = this.extract_value(prm_row);
        if(eclr.is_composite()) {
          const {clr_in, clr_out} = eclr;
          return utils.check_compare(clr_in.area_src, value, ct, ect) ||
              utils.check_compare(clr_out.area_src, value, ct, ect);
        }

        // если в "системе" задан список цветов, не требующих покраски, смотрим на него, иначе - не белый
        if(eclr.area_src.empty()) {
          return false;
        }
        if(no_eclr) {
          const {colors} = elm.layer.sys;
          if(colors.count()) {
            if(colors.find({clr: eclr})) {
              return false;
            }
          }
          else if(eclr === clrs.predefined('Белый')) {
            return false;
          }
        }

        return utils.check_compare(eclr.area_src, value, ct, ect);
      }
    }
  })('coloring_kind');

});


/**
 * ### Модуль объекта документа Расчет-заказ
 * Обрботчики событий after_create, after_load, before_save, after_save, value_change
 * Методы выполняются в контексте текущего объекта this = DocObj
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module doc_calc_order
 */

class FakeLenAngl {

  constructor({len, inset}) {
    this.len = len;
    this.origin = inset;
  }

  get angle() {
    return 0;
  }

  get alp1() {
    return 0;
  }

  get alp2() {
    return 0;
  }

  get cnstr() {
    return 0;
  }

}

class FakeElm {

  constructor(row_spec) {
    this.row_spec = row_spec;
  }

  get elm() {
    return 0;
  }

  get angle_hor() {
    return 0;
  }

  get _row() {
    return this;
  }

  get clr() {
    const {row_spec} = this;
    return row_spec instanceof $p.DocCalc_orderProductionRow ? row_spec.characteristic.clr : row_spec.clr;
  }

  get len() {
    return this.row_spec.len;
  }

  get height() {
    const {height, width} = this.row_spec;
    return height === undefined ? width : height;
  }

  get depth() {
    return this.row_spec.depth || 0;
  }

  get s() {
    return this.row_spec.s;
  }

  get perimeter() {
    const {len, height, width} = this.row_spec;
    return [{len, angle: 0}, {len: height === undefined ? width : height, angle: 90}];
  }

  get x1() {
    return 0;
  }

  get y1() {
    return 0;
  }

  get x2() {
    return this.height;
  }

  get y2() {
    return this.len;
  }

  get ox() {
    const {project, row_spec} = this;
    return project ? project.ox : row_spec._owner._owner;
  }

}

// свойства и методы объекта
$p.DocCalc_order = class DocCalc_order extends $p.DocCalc_order {

  // подписки на события

  // после создания надо заполнить реквизиты по умолчанию: контрагент, организация, договор
  after_create(user) {

    const {enm, cat, job_prm, DocCalc_order} = $p;
    let current_user;
    if(job_prm.is_node) {
      if(user) {
        current_user = user;
      }
      else {
        return Promise.resolve(this);
      }
    }
    else {
      current_user = this.manager;
    }

    if(!current_user || current_user.empty()) {
      current_user = $p.current_user;
    }
    if(!current_user || current_user.empty()) {
      return Promise.resolve(this);
    }

    const {acl_objs} = current_user;

    //Менеджер
    this.manager = current_user;

    //Организация
    acl_objs.find_rows({by_default: true, type: cat.organizations.class_name}, (row) => {
      this.organization = row.acl_obj;
      return false;
    });

    //Подразделение
    DocCalc_order.set_department.call(this);

    //Контрагент
    acl_objs.find_rows({by_default: true, type: cat.partners.class_name}, (row) => {
      this.partner = row.acl_obj;
      return false;
    });

    //Склад
    acl_objs.find_rows({by_default: true, type: cat.stores.class_name}, (row) => {
      this.warehouse = row.acl_obj;
      return false;
    });

    //Договор
    this.contract = cat.contracts.by_partner_and_org(this.partner, this.organization);

    //СостояниеТранспорта
    this.obj_delivery_state = enm.obj_delivery_states.Черновик;

    //Номер документа
    return this.number_doc ? Promise.resolve(this) : this.new_number_doc();

  }

  // перед записью надо присвоить номер для нового и рассчитать итоги
  before_save(attr) {

    const {msg, utils: {blank, moment}, adapters: {pouch}, wsql, job_prm, md, cat, enm: {
      obj_delivery_states: {Отклонен, Отозван, Шаблон, Подтвержден, Отправлен},
      elm_types: {ОшибкаКритическая, ОшибкаИнфо},
    }} = $p;

    //Для шаблонов, отклоненных и отозванных проверки выполнять не будем, чтобы возвращалось всегда true
    //при этом, просто сразу вернуть true не можем, т.к. надо часть кода выполнить - например, сумму документа пересчитать
    const {obj_delivery_state, _obj, _manager, class_name, category, rounding, timestamp} = this;
    const must_be_saved = ![Подтвержден, Отправлен].includes(obj_delivery_state);

    // если установлен признак проведения, проверим состояние транспорта
    if(this.posted) {
      if([Отклонен, Отозван, Шаблон].includes(obj_delivery_state)) {
        msg.show_msg && msg.show_msg({
          type: 'alert-warning',
          text: 'Нельзя провести заказ со статусом<br/>"Отклонён", "Отозван" или "Шаблон"',
          title: this.presentation
        });
        return false;
      }
      else if(obj_delivery_state != Подтвержден) {
        this.obj_delivery_state = Подтвержден;
      }
    }
    else if(obj_delivery_state == Подтвержден) {
      this.obj_delivery_state = Отправлен;
    }

    // проверим заполненность подразделения
    if(obj_delivery_state == Шаблон) {
      this.department = blank.guid;
      this.partner = blank.guid;
    }
    else {
      if(this.department.empty()) {
        msg.show_msg && msg.show_msg({
          type: 'alert-warning',
          text: 'Не заполнен реквизит "офис продаж" (подразделение)',
          title: this.presentation
        });
        return false || must_be_saved;
      }
      if(this.partner.empty()) {
        msg.show_msg && msg.show_msg({
          type: 'alert-warning',
          text: 'Не указан контрагент (дилер)',
          title: this.presentation
        });
        return false || must_be_saved;
      }

      const err_prices = this.check_prices();
      if(err_prices) {
        msg.show_msg && msg.show_msg({
          type: 'alert-warning',
          title: 'Ошибки в заказе',
          text: `Пустая цена ${err_prices.nom.toString()}<br/>Обратитесь к куратору номенклатуры`,
        });
        if (!must_be_saved) {
          if(obj_delivery_state == Отправлен) {
            this.obj_delivery_state = 'Черновик';
          }
          return false;
        }
      }
    }

    // рассчитаем итоговые суммы документа и проверим наличие обычных и критических ошибок
    let doc_amount = 0, internal = 0;
    const errors = this._data.errors = new Map();
    if(!job_prm.debug) {
      this.production.forEach(({amount, amount_internal, characteristic}) => {
        doc_amount += amount;
        internal += amount_internal;
        characteristic.specification.forEach(({nom, elm}) => {
          if([ОшибкаКритическая, ОшибкаИнфо].includes(nom.elm_type)) {
            if(!errors.has(characteristic)){
              errors.set(characteristic, new Map());
            }
            if(!errors.has(nom.elm_type)){
              errors.set(nom.elm_type, new Set());
            }
            // накапливаем ошибки в разрезе критичности и в разрезе продукций - отдельные массивы
            if(!errors.get(characteristic).has(nom)){
              errors.get(characteristic).set(nom, new Set());
            }
            errors.get(characteristic).get(nom).add(elm);
            errors.get(nom.elm_type).add(nom);
          }
        });
      });
    }

    this.doc_amount = doc_amount.round(rounding);
    this.amount_internal = internal.round(rounding);
    this.amount_operation = this.doc_currency.to_currency(doc_amount, this.date).round(rounding);

    if (errors.size) {
      let critical, text = '';
      errors.forEach((errors, characteristic) => {
        if (characteristic instanceof $p.CatCharacteristics) {
          text += `<b>${characteristic.name}:</b><br/>`;
          errors.forEach((elms, nom) => {
            text += `${nom.name} - элементы:${Array.from(elms)}<br/>`;
            if(nom.elm_type == ОшибкаКритическая) {
              critical = true;
            }
          });
        }
      });

      if (critical && !must_be_saved) {
        if(obj_delivery_state == 'Отправлен') {
          this.obj_delivery_state = 'Черновик';
        }
        throw new Error(text);
      }
      else {
        msg.show_msg && msg.show_msg({
          type: 'alert-warning',
          title: 'Ошибки в заказе',
          text,
        });
      }
    }

    // фильтр по статусу
    if(obj_delivery_state == 'Шаблон') {
      _obj.state = 'template';
      // Шаблоны имеют дополнительное свойство, в котором можно задать доступные системы
      const permitted_sys = $p.cch.properties.predefined('permitted_sys');
      if(permitted_sys) {
        if(!this.extra_fields.find({property: permitted_sys})) {
          this.extra_fields.add({property: permitted_sys});
        }
      }
    }
    else if(category == 'service') {
      _obj.state = 'service';
    }
    else if(category == 'complaints') {
      _obj.state = 'complaints';
    }
    else if(obj_delivery_state == 'Отправлен') {
      _obj.state = 'sent';
    }
    else if(obj_delivery_state == 'Отклонен') {
      _obj.state = 'declined';
    }
    else if(obj_delivery_state == 'Подтвержден') {
      _obj.state = 'confirmed';
    }
    else if(obj_delivery_state == 'Архив') {
      _obj.state = 'zarchive';
    }
    else {
      _obj.state = 'draft';
    }

    // проверка заполненности полей теперь вызывает runtime-error
    this.check_mandatory();

    // массив сырых данных изменённых характеристик
    const sobjs = this.product_rows(true, attr);

    // если изменился hash заказа, добавим его в sobjs
    if(this._modified || this.is_new()) {
      const hash = this._hash();
      if(timestamp && timestamp.hash === hash) {
        this._modified = false;
      }
      else {
        const tmp = Object.assign({_id: `${class_name}|${_obj.ref}`, class_name}, _obj);
        delete tmp.ref;
        tmp.timestamp = {
          moment: moment().format('YYYY-MM-DDTHH:mm:ss ZZ'),
          user: wsql.get_user_param('user_name'),
          hash,
        };
        if (this._attachments) {
          tmp._attachments = this._attachments;
        }
        if(_manager.build_search) {
          _manager.build_search(tmp, this);
        }
        else {
          tmp.search = ((_obj.number_doc || '') + (_obj.note ? ' ' + _obj.note : '')).toLowerCase();
        }
        sobjs.push(tmp);
      }
    }

    const db = attr?.db || (obj_delivery_state == 'Шаблон' ?  pouch.remote.ram : pouch.db(_manager));

    // пометим на удаление неиспользуемые характеристики
    // этот кусок не влияет на возвращаемое before_save значение и выполняется асинхронно
    const unused = () => db.query('linked', {startkey: [this.ref, 'cat.characteristics'], endkey: [this.ref, 'cat.characteristics\u0fff']})
      .then(({rows}) => {
        let res = Promise.resolve();
        let deleted = 0;
        for (const {id} of rows) {
          const ref = id.substr(20);
          if(this.production.find({characteristic: ref})) {
            continue;
          }
          deleted ++;
          res = res
            .then(() => cat.characteristics.get(ref, 'promise'))
            .then((ox) => !ox.is_new() && !ox._deleted && ox.mark_deleted(true));
        }
        return res.then(() => deleted);
      })
      .then((res) => {
        res && _manager.emit_async('svgs', this);
        // null из before_save, прерывает стандартную обработку
        return null;
      })
      .catch((err) => null);

    const save_error = (reason, obj) => {
      const note = `Ошибка при записи ${this.presentation}, ${reason}`
      $p.record_log({
        class: 'save_error',
        obj,
        note,
      });
      throw new Error(note);
    };

    const bulk = () => {
      const _id = `${class_name}|${_obj.ref}`;
      // обычные заказы пишем честно - с текущими версиями, версии шаблонов не учитываем
      const rev = Promise.resolve().then(() => {
        if(obj_delivery_state == 'Шаблон') {
          return db.allDocs({keys: sobjs.map(({_id}) => _id)})
            .then(({rows}) => {
              for(const doc of rows) {
                if(doc.value && doc.value.rev) {
                  sobjs.some((o) => {
                    if(o._id === doc.id) {
                      o._rev = doc.value.rev;
                      return true;
                    }
                  });
                }
              }
            });
        }
        else {
          if(!this.is_new() && !_obj._rev) {
            return db.get(_id)
              .then(({_rev}) => sobjs.some((o) => {
                if(o._id === _id) {
                  o._rev = _rev;
                  return true;
                }
              }));
          }
        }
      })
        .catch(() => null);

      return rev.then(() => db.bulkDocs(sobjs));
    };

    return !sobjs.length ? unused() : bulk()
      .then((bres) => {
        // освежаем ревизии, проверяем успешность записи и вызываем after_save
        for(const row of bres) {
          const [cname, ref] = row.id.split('|');
          const mgr = md.mgr_by_class_name(cname);
          const o = mgr.get(ref, true);
          if(row.ok) {
            if(mgr) {
              if(o) {
                o._obj._rev = row.rev;
                o.after_save();
                mgr.emit_promise('after_save', o)
                  .then(() => o._modified = false);
              }
            }
          }
          else {
            const err = new Error(row.error === 'conflict' ?
              'вероятно, объект изменён другим пользователем, перечитайте заказ и продукции с сервера' :
              `${row.reason} ${o && o !== this ? o.presentation : ''} повторите попытку записи через минуту`);
            err.obj = {
              docs: sobjs.map(v => ({id: v._id, rev: v._rev, timestamp: v.timestamp})),
              bres,
            };
            throw err;
          }
        }
        // null из before_save, прерывает стандартную обработку
        return unused();
      })
      .catch((err) => {
        if(err.obj) {
          save_error(err.message, err.obj);
        }
        else {
          save_error(`${err.message} повторите попытку записи через минуту`);
        }
      });
  }

  // шаблоны читаем из ram
  load(attr = {}) {
    if(this.obj_delivery_state == 'Шаблон') {
      attr.db = this._manager.adapter.db({cachable: 'ram'});
    }
    return super.load(attr);
  }

  // шаблоны сохраняем в базу ram
  save(post, operational, attachments, attr = {}) {
    if(this.obj_delivery_state == 'Шаблон') {
      attr.db = this._manager.adapter.db({cachable: 'ram'});
    }
    return super.save(post, operational, attachments, attr);
  }

  // проверяет заполненность цен
  check_prices() {
    const {job_prm, pricing} = $p;
    if(job_prm.pricing.skip_empty_in_spec) {
      return ;
    }
    let err;
    this.production.forEach((calc_order_row) => {
      err = pricing.check_prices({calc_order_row});
      if(err) {
        return false;
      }
    });
    return err;
  }

  // при изменении реквизита
  value_change(field, type, value) {
    if(field === 'organization') {
      this.organization = value;
      if(this.contract.organization != value) {
        this.contract = $p.cat.contracts.by_partner_and_org(this.partner, value);
        !this.constructor.prototype.hasOwnProperty('new_number_doc') && this.new_number_doc();
      }
    }
    else if(field === 'partner' && this.contract.owner != value) {
      this.contract = $p.cat.contracts.by_partner_and_org(value, this.organization);
    }
    // если изменение инициировано человеком, дополним список изменённых полей
    const ads = ['contract'];
    if(field === 'obj_delivery_state' && this.clear_templates_props) {
      ads.push('extra_fields');
      if(value != 'Шаблон') {
        this.clear_templates_props();
      }
    }
    this._manager.emit_add_fields(this, ads);

  }

  // удаление строки
  del_row(row) {
    if(row instanceof $p.DocCalc_orderProductionRow) {
      const {characteristic} = row;
      if(!characteristic.empty() && !characteristic.calc_order.empty()) {
        const {production, orders, presentation, _data} = this;

        // запрет удаления подчиненной продукции
        const {msg} = $p;
        const {leading_elm, leading_product, origin} = characteristic;
        if(!leading_product.empty() && leading_product.calc_order_row && (
          // если в изделии присутствует порождающая вставка
          leading_product.inserts.find({cnstr: -leading_elm, inset: origin}) ||
          // если это виртуальное изделие слоя
          [10, 11].includes(leading_product.constructions.find({cnstr: -leading_elm})?.kind)
        )) {
          msg.show_msg && msg.show_msg({
            type: 'alert-warning',
            text: `Изделие <i>${characteristic.prod_name(true)}</i> не может быть удалено<br/><br/>Для удаления, пройдите в <i>${
              leading_product.prod_name(true)}</i> и отредактируйте доп. вставки и свойства слоёв`,
            title: presentation
          });
          return false;
        }

        // циклическое удаление ведомых при удалении основного изделия
        const {_loading} = _data;
        _data._loading = true;
        production.find_rows({ordn: characteristic}).forEach(({_row}) => {
          production.del(_row.row - 1);
        });
        orders.forEach(({invoice}) => {
          if(!invoice.empty()) {
            invoice.goods.find_rows({nom_characteristic: characteristic}).forEach(({_row}) => {
              invoice.goods.del(_row.row - 1);
            });
          }
        });
        _data._loading = _loading;
      }
    }
    return this;
  }


  // при удалении строки
  after_del_row(name) {
    name === 'production' && this.product_rows();
    return this;
  }

  // вместе с заказом выгружаем продукцию
  unload() {
    this.production.forEach(({characteristic}) => {
      if(!characteristic.empty() && characteristic.calc_order === this) {
        characteristic.unload();
      }
    });
    return super.unload();
  }


  /**
   * Возвращает валюту документа
   */
  get doc_currency() {
    const currency = this.contract.settlements_currency;
    return currency.empty() ? $p.job_prm.pricing.main_currency : currency;
  }

  set doc_currency(v) {

  }

  /**
   * Число знаков округления
   * @return {Number}
   */
  get rounding() {
    const {pricing} = $p.job_prm;
    if(!pricing.hasOwnProperty('rounding')) {
      const parts = this.doc_currency ? this.doc_currency.parameters_russian_recipe.split(',') : [2];
      pricing.rounding = parseInt(parts[parts.length - 1]);
      if(isNaN(pricing.rounding)) {
        pricing.rounding = 2;
      }
    }
    return pricing.rounding;
  }

  /**
   * Дата прайса с учётом константы valid_days (Счет действителен N дней)
   * @return {Date}
   */
  get price_date() {
    const {utils, job_prm: {pricing}} = $p;
    const {date} = this;
    const fin = utils.moment(date).add(pricing.valid_days || 0, 'days').endOf('day').toDate();
    const curr = new Date();
    return curr > fin ? curr : date;
  }

  /**
   * При установке договора, синхронно устанавливаем параметры НДС
   */
  get contract() {
    return this._getter('contract');
  }
  set contract(v) {
    this._setter('contract', v);
    this.vat_consider = this.contract.vat_consider;
    this.vat_included = this.contract.vat_included;
  }

  /**
   * Пересчитывает номера изделий в продукциях,
   * обновляет контрагента, состояние транспорта и подразделение
   * @param [save] {Boolean} - если указано, выполняет before_save характеристик
   * @return {Array<Object>}
   */
  product_rows(save, attr) {
    let res = [];
    const {production, partner, obj_delivery_state, department} = this;
    const {utils, wsql} = $p;
    const user = wsql.get_user_param('user_name');
    this.production.forEach(({row, characteristic}) => {
      if(!characteristic.empty() && characteristic.calc_order === this) {
        if(characteristic.product !== row || characteristic._modified ||
          characteristic.partner !== partner ||
          characteristic.obj_delivery_state !== obj_delivery_state ||
          characteristic.department !== department) {

          characteristic.product = row;
          characteristic.obj_delivery_state = obj_delivery_state;
          characteristic.partner = partner;
          characteristic.department = department;

          if(!characteristic.owner.empty()) {
            if(save) {
              if(characteristic.before_save(attr) === false) {
                const {_err} = characteristic._data;
                throw new Error(_err ? _err.text : `Ошибка при записи продукции ${characteristic.prod_name()}`);
              }
              else {
                characteristic.check_mandatory();
                const hash = characteristic._hash();
                const {ref, class_name, _obj} = characteristic;
                if(characteristic.timestamp && characteristic.timestamp.hash === hash) {
                  characteristic._modified = false;
                }
                else {
                  const tmp = Object.assign({_id: `${class_name}|${ref}`, class_name}, _obj);
                  delete tmp.ref;
                  tmp.timestamp = {moment: utils.moment().format('YYYY-MM-DDTHH:mm:ss ZZ'), user, hash};
                  if (characteristic._attachments) {
                    tmp._attachments = characteristic._attachments;
                  }
                  res.push(tmp);
                }
              }
            }
            else {
              characteristic.name = characteristic.prod_name();
            }
          }
        }
      }
    });
    return res;
  }

  /**
   * рассчитывает итоги диспетчеризации
   * @return {Promise}
   */
  dispatching_totals() {
    const options = {
      reduce: true,
      limit: 10000,
      group: true,
      keys: []
    };
    this.production.forEach(({nom, characteristic}) => {
      if(!characteristic.empty() && !nom.is_procedure && !nom.is_service && !nom.is_accessory) {
        options.keys.push([characteristic.ref, '305e374b-3aa9-11e6-bf30-82cf9717e145', 1, 0]);
      }
    });
    return $p.adapters.pouch.remote.doc.query('server/dispatching', options)
      .then(function ({rows}) {
        const res = {};
        rows && rows.forEach(function ({key, value}) {
          if(value.plan) {
            value.plan = moment(value.plan).format('L');
          }
          if(value.fact) {
            value.fact = moment(value.fact).format('L');
          }
          res[key[0]] = value;
        });
        return res;
      });
  }

  /**
   * Возвращает данные для печати
   */
  print_data(attr = {}) {
    const {organization, bank_account, partner, contract, manager} = this;
    const {individual_person} = manager;
    const our_bank_account = bank_account && !bank_account.empty() ? bank_account : organization.main_bank_account;
    const get_imgs = [];
    const {cat: {contact_information_kinds}, utils: {blank, blob_as_text, snake_ref}} = $p;

    // заполняем res теми данными, которые доступны синхронно
    const res = {
      АдресДоставки: this.shipping_address,
      ВалютаДокумента: this.doc_currency.presentation,
      ДатаЗаказаФорматD: moment(this.date).format('L'),
      ДатаЗаказаФорматDD: moment(this.date).format('LL'),
      ДатаТекущаяФорматD: moment().format('L'),
      ДатаТекущаяФорматDD: moment().format('LL'),
      ДоговорДатаФорматD: moment(contract.date.valueOf() == blank.date.valueOf() ? this.date : contract.date).format('L'),
      ДоговорДатаФорматDD: moment(contract.date.valueOf() == blank.date.valueOf() ? this.date : contract.date).format('LL'),
      ДоговорНомер: contract.number_doc ? contract.number_doc : this.number_doc,
      ДоговорСрокДействия: moment(contract.validity).format('L'),
      ЗаказНомер: this.number_doc,
      Контрагент: partner.presentation,
      КонтрагентОписание: partner.long_presentation,
      КонтрагентДокумент: '',
      КонтрагентКЛДолжность: '',
      КонтрагентКЛДолжностьРП: '',
      КонтрагентКЛИмя: '',
      КонтрагентКЛИмяРП: '',
      КонтрагентКЛК: '',
      КонтрагентКЛОснованиеРП: '',
      КонтрагентКЛОтчество: '',
      КонтрагентКЛОтчествоРП: '',
      КонтрагентКЛФамилия: '',
      КонтрагентКЛФамилияРП: '',
      КонтрагентИНН: partner.inn,
      КонтрагентКПП: partner.kpp,
      КонтрагентЮрФизЛицо: '',
      КратностьВзаиморасчетов: this.settlements_multiplicity,
      КурсВзаиморасчетов: this.settlements_course,
      ЛистКомплектацииГруппы: '',
      ЛистКомплектацииСтроки: '',
      Организация: organization.presentation,
      ОрганизацияГород: organization.contact_information._obj.reduce((val, row) => val || row.city, '') || 'Москва',
      ОрганизацияАдрес: organization.contact_information._obj.reduce((val, row) => {
        if(row.kind == contact_information_kinds.predefined('ЮрАдресОрганизации') && row.presentation) {
          return row.presentation;
        }
        else if(val) {
          return val;
        }
        else if(row.presentation && (
            row.kind == contact_information_kinds.predefined('ФактАдресОрганизации') ||
            row.kind == contact_information_kinds.predefined('ПочтовыйАдресОрганизации')
          )) {
          return row.presentation;
        }
      }, ''),
      ОрганизацияТелефон: organization.contact_information._obj.reduce((val, row) => {
        if(row.kind == contact_information_kinds.predefined('ТелефонОрганизации') && row.presentation) {
          return row.presentation;
        }
        else if(val) {
          return val;
        }
        else if(row.kind == contact_information_kinds.predefined('ФаксОрганизации') && row.presentation) {
          return row.presentation;
        }
      }, ''),
      ОрганизацияБанкБИК: our_bank_account.bank.id,
      ОрганизацияБанкГород: our_bank_account.bank.city,
      ОрганизацияБанкКоррСчет: our_bank_account.bank.correspondent_account,
      ОрганизацияБанкНаименование: our_bank_account.bank.name,
      ОрганизацияБанкНомерСчета: our_bank_account.account_number,
      ОрганизацияИндивидуальныйПредприниматель: organization.individual_entrepreneur.presentation,
      ОрганизацияИНН: organization.inn,
      ОрганизацияКПП: organization.kpp,
      ОрганизацияСвидетельствоДатаВыдачи: organization.certificate_date_issue,
      ОрганизацияСвидетельствоКодОргана: organization.certificate_authority_code,
      ОрганизацияСвидетельствоНаименованиеОргана: organization.certificate_authority_name,
      ОрганизацияСвидетельствоСерияНомер: organization.certificate_series_number,
      ОрганизацияЮрФизЛицо: organization.individual_legal.presentation,
      Офис: this.department.presentation,
      ПродукцияЭскизы: {},
      Проект: this.project.presentation,
      СистемыПрофилей: this.sys_profile,
      СистемыФурнитуры: this.sys_furn,
      Сотрудник: manager.presentation,
      СотрудникКомментарий: manager.note,
      СотрудникДолжность: individual_person.Должность || 'менеджер',
      СотрудникДолжностьРП: individual_person.ДолжностьРП,
      СотрудникИмя: individual_person.Имя,
      СотрудникИмяРП: individual_person.ИмяРП,
      СотрудникОснованиеРП: individual_person.ОснованиеРП,
      СотрудникОтчество: individual_person.Отчество,
      СотрудникОтчествоРП: individual_person.ОтчествоРП,
      СотрудникФамилия: individual_person.Фамилия,
      СотрудникФамилияРП: individual_person.ФамилияРП,
      СотрудникФИО: individual_person.Фамилия +
      (individual_person.Имя ? ' ' + individual_person.Имя[0].toUpperCase() + '.' : '' ) +
      (individual_person.Отчество ? ' ' + individual_person.Отчество[0].toUpperCase() + '.' : ''),
      СотрудникФИОРП: individual_person.ФамилияРП + ' ' + individual_person.ИмяРП + ' ' + individual_person.ОтчествоРП,
      СотрудникТелефон: manager.contact_information._obj.reduce((val, row) => {
        if(row.type == 'Телефон' && row.presentation) {
          return row.presentation;
        }}, ''),
      СотрудникEmail: manager.contact_information._obj.reduce((val, row) => {
        if(row.type == 'АдресЭлектроннойПочты' && row.presentation) {
          return row.presentation;
        }}, ''),
      СуммаДокумента: this.doc_amount.toFixed(2),
      СуммаДокументаПрописью: this.doc_amount.in_words(),
      СуммаДокументаБезСкидки: this.production._obj.reduce((val, row) => val + row.quantity * row.price, 0).toFixed(2),
      СуммаСкидки: this.production._obj.reduce((val, row) => val + row.discount, 0).toFixed(2),
      СуммаНДС: this.production._obj.reduce((val, row) => val + row.vat_amount, 0).toFixed(2),
      ТекстНДС: this.vat_consider ? (this.vat_included ? 'В том числе НДС 20%' : 'НДС 20% (сверху)') : 'Без НДС',
      ТелефонПоАдресуДоставки: this.phone,
      СуммаВключаетНДС: contract.vat_included,
      УчитыватьНДС: contract.vat_consider,
      ВсегоНаименований: this.production.count(),
      ВсегоИзделий: 0,
      ВсегоПлощадьИзделий: 0,
      ВсегоМасса: 0,
      ВсегоМассаЗаполнений: 0,
      Продукция: [],
      Аксессуары: [],
      Услуги: [],
      Материалы: [],
      НомерВнутр: this.number_internal,
      КлиентДилера: this.client_of_dealer,
      Комментарий: this.note,
    };

    // дополняем значениями свойств
    this.extra_fields.forEach((row) => {
      res['Свойство' + row.property.name.replace(/\s/g, '')] = String(row.value);
    });

    // TODO: дополнить датами доставки и монтажа
    res.МонтажДоставкаСамовывоз = !this.shipping_address ? 'Самовывоз' : 'Монтаж по адресу: ' + this.shipping_address;

    // получаем логотип организации
    for (let key in organization._attachments) {
      if(key.indexOf('logo') != -1) {
        get_imgs.push(organization.get_attachment(key)
          .then((blob) => {
            return blob_as_text(blob, blob.type.indexOf('svg') == -1 ? 'data_url' : '');
          })
          .then((data_url) => {
            res.ОрганизацияЛоготип = data_url;
          })
          .catch($p.record_log));
        break;
      }
    }

    return this.load_linked_refs().then(() => {

      // получаем эскизы продукций, параллельно накапливаем количество и площадь изделий
      let editor, imgs = Promise.resolve();
      const builder_props = attr.builder_props && Object.assign({}, $p.CatCharacteristics.builder_props_defaults, attr.builder_props);
      this.production.forEach((row) => {
        if(!row.characteristic.empty() && !row.nom.is_procedure && !row.nom.is_service && !row.nom.is_accessory) {

          const description = this.row_description(row);
          res.Продукция.push(description);

          res.ВсегоИзделий += row.quantity;
          res.ВсегоПлощадьИзделий += row.quantity * row.characteristic.s;
          res.ВсегоМасса += row.quantity * description.Масса;
          res.ВсегоМассаЗаполнений += row.quantity * description.МассаЗаполнений;

          // если запросили эскиз без размерных линий или с иными параметрами...
          if(builder_props) {
            if(!editor) {
              editor = new $p.EditorInvisible();
            }
            imgs = imgs.then(() => {
              return row.characteristic.draw(attr, editor)
                .then((img) => {
                  res.ПродукцияЭскизы[row.characteristic.ref] = img[snake_ref(row.characteristic.ref)].imgs.l0;
                });
            });
          }
          else {
            if(row.characteristic.svg) {
              res.ПродукцияЭскизы[row.characteristic.ref] = row.characteristic.svg;
            }
          }
        }
        else if(!row.nom.is_procedure && !row.nom.is_service && row.nom.is_accessory) {
          res.Аксессуары.push(this.row_description(row));
        }
        else if(!row.nom.is_procedure && row.nom.is_service && !row.nom.is_accessory) {
          res.Услуги.push(this.row_description(row));
        }
        else if(!row.nom.is_procedure && !row.nom.is_service && !row.nom.is_accessory) {
          res.Материалы.push(this.row_description(row));
        }
      });
      res.ВсегоПлощадьИзделий = res.ВсегоПлощадьИзделий.round(3);

      res.qrcode = () => {
        // https://github.com/soldair/node-qrcode
        return Promise.resolve().then(() => {
          if(typeof QRCode === 'object') {
            const text = `ST00012|Name=${res.Организация}|PersonalAcc=${res.ОрганизацияБанкНомерСчета}|BIC=${res.ОрганизацияБанкБИК}|PayeeINN=${res.ОрганизацияИНН}|Purpose=Заказ №${res.ЗаказНомер} от ${res.ДатаЗаказаФорматD} ${res.ТекстНДС}|KPP=${res.ОрганизацияКПП}|Sum=${res.СуммаДокумента}${res.АдресДоставки ? `|payerAddress=${res.АдресДоставки}` : ''}`;
            return QRCode.toString(text, {type: 'svg'});
          }
        });
      };

      return imgs
        .then(() => {
          editor && editor.unload();
          return Promise.all(get_imgs);
        })
        .then(() => res);

    });

  }

  /**
   * Возвращает струклуру с описанием строки продукции для печати
   */
  row_description(row) {

    if(!(row instanceof $p.DocCalc_orderProductionRow) && row.characteristic) {
      this.production.find_rows({characteristic: row.characteristic}, (prow) => {
        row = prow;
        return false;
      });
    }
    const {characteristic, nom, s, quantity, note} = row;
    let m = 0, gm = 0, skip = new Set();
    characteristic.specification.forEach(({elm, nom, totqty}) => {
      m += nom.density * totqty;
      if(elm > 0 && !skip.has(elm)) {
        if(characteristic.glasses.find({elm})) {
          gm += nom.density * totqty;
        }
        else {
          skip.add(elm);
        }
      }
    });

    const res = {
      ref: characteristic.ref,
      НомерСтроки: row.row,
      Количество: quantity,
      Ед: row.unit.name || 'шт',
      Цвет: characteristic.clr.name,
      Размеры: row.len + 'x' + row.width + ', ' + s + 'м²',
      Площадь: s,
      //Отдельно размеры, общая площадь позиции и комментарий к позиции
      Длина: row.len,
      Ширина: row.width,
      ВсегоПлощадь: s * quantity,
      Масса: m,
      ВсегоМасса: m * quantity,
      МассаЗаполнений: gm,
      ВсегоМассаЗаполнений: gm * quantity,
      Примечание: note,
      Комментарий: note,
      СистемаПрофилей: characteristic.sys.name,
      Номенклатура: nom.name_full || nom.name,
      Характеристика: characteristic.name,
      Заполнения: '',
      ЗаполненияФормулы: '',
      Фурнитура: '',
      Параметры: [],
      Цена: row.price,
      ЦенаВнутр: row.price_internal,
      СкидкаПроцент: row.discount_percent,
      СкидкаПроцентВнутр: row.discount_percent_internal,
      Скидка: row.discount.round(2),
      Сумма: row.amount.round(2),
      СуммаВнутр: row.amount_internal.round(2)
    };

    // формируем описание заполнений
    characteristic.glasses.forEach(({nom, formula}) => {
      const {name} = nom;
      if(!res.Заполнения.includes(name)) {
        if(res.Заполнения) {
          res.Заполнения += ', ';
        }
        res.Заполнения += name;
      }
      if(!res.ЗаполненияФормулы.includes(formula)) {
        if(res.ЗаполненияФормулы) {
          res.ЗаполненияФормулы += ', ';
        }
        res.ЗаполненияФормулы += formula;
      }
    });

    // наименования фурнитур
    characteristic.constructions.forEach((row) => {
      const {name} = row.furn;
      if(name && res.Фурнитура.indexOf(name) == -1) {
        if(res.Фурнитура) {
          res.Фурнитура += ', ';
        }
        res.Фурнитура += name;
      }
    });



    // параметры, помеченные к включению в описание
    const params = new Map();
    characteristic.params.forEach((row) => {
      if(row.param.include_to_description) {
        params.set(row.param, row.value);
      }
    });
    for (let [param, value] of params) {
      res.Параметры.push({
        param: param.presentation,
        value: value.presentation || value
      });
    }

    return res;
  }

  /**
   * Заполняет табчасть планирования запросом к сервису windowbuilder-planning
   */
  fill_plan() {

    // чистим не стесняясь - при записи всё равно перезаполнять
    this.planning.clear();

    // получаем url сервиса
    const {wsql, aes, adapters: {pouch}, msg, utils} = $p;
    const url = (wsql.get_user_param('windowbuilder_planning', 'string') || '/plan/') + `doc.calc_order/${this.ref}`;

    // сериализуем документ и характеристики
    const post_data = utils._clone(this._obj);
    post_data.characteristics = {};

    // получаем объекты характеристик и подклеиваем их сериализацию к post_data
    this.load_production()
      .then((prod) => {
        for (const cx of prod) {
          post_data.characteristics[cx.ref] = utils._clone(cx._obj);
        }
      })
      // выполняем запрос к сервису
      .then(() => {
        pouch.fetch(url, {method: 'POST', body: JSON.stringify(post_data)})
          .then(response => response.json())
          // заполняем табчасть
          .then(json => {
            if (json.rows) {
              this.planning.load(json.rows);
            }
            else{
              console.log(json);
            }
          })
          .catch(err => {
            msg.show_msg({
              type: "alert-warning",
              text: err.message,
              title: "Сервис планирования"
            });
            $p.record_log(err);
          });
      });
  }

  /**
   * Выясняет, можно ли редактировать данный объект
   */
  get is_read_only() {
    const {obj_delivery_state, posted, _data} = this;
    let {current_user, cat: {abonents}, enm} = $p;
    const {Черновик, Шаблон, Отозван, Отправлен} = enm.obj_delivery_states;
    if(!current_user) {
      current_user = this.manager;
    }

    let ro = false;
    // технолог может изменять шаблоны
    if(obj_delivery_state == Шаблон) {
      const {no_mdm} = abonents.current;
      ro = !no_mdm || !current_user.role_available('ИзменениеТехнологическойНСИ');
    }
    // ведущий менеджер может изменять проведенные
    else if(posted || _data._deleted) {
      ro = !current_user.role_available('СогласованиеРасчетовЗаказов');
    }
    else if(obj_delivery_state == Отправлен) {
      ro = !_data._saving_trans && !current_user.role_available('СогласованиеРасчетовЗаказов');
    }
    else if(!obj_delivery_state.empty()) {
      ro = obj_delivery_state != Черновик && obj_delivery_state != Отозван && !current_user.role_available('СогласованиеРасчетовЗаказов');
    }
    return ro;
  }

  /**
   * Загружает в RAM данные характеристик продукций заказа
   * @return {Promise}
   */
  load_production(forse, db) {
    const prod = [];
    const {cat: {characteristics}, enm: {obj_delivery_states}} = $p;
    this.production.forEach(({characteristic}) => {
      if(!characteristic.empty() && (forse || characteristic.is_new())) {
        prod.push(characteristic.ref);
      }
    });
    return characteristics.adapter.load_array(characteristics, prod, false, db)
      .then(() => {
        prod.length = 0;
        this.production.forEach(({nom, characteristic}) => {
          if(!characteristic.empty()) {
            if((!nom.is_procedure && !nom.is_accessory) || characteristic.specification.count() || characteristic.constructions.count() || characteristic.coordinates.count()){
              prod.push(characteristic);
            }
          }
        });
        return prod;
      });
  }

  /**
   * Обработчик события _ЗаписанаХарактеристикаПостроителя_
   * @param scheme
   * @param sattr
   */
  characteristic_saved(scheme, sattr) {
    const {ox, _dp} = scheme;
    const row = ox.calc_order_row;

    if(!row || ox.calc_order != this) {
      return;
    }

    //nom,characteristic,note,quantity,unit,qty,len,width,s,first_cost,marginality,price,discount_percent,discount_percent_internal,
    //discount,amount,margin,price_internal,amount_internal,vat_rate,vat_amount,ordn,changed

    row._data._loading = true;
    row.nom = ox.owner;
    row.note = _dp.note;
    row.quantity = _dp.quantity || 1;
    row.len = ox.x;
    row.width = ox.y;
    row.s = ox.s;
    row.discount_percent = _dp.discount_percent;
    row.discount_percent_internal = _dp.discount_percent_internal;
    if(row.unit.owner != row.nom) {
      row.unit = row.nom.storage_unit;
    }
    row._data._loading = false;
  }

  /**
   * Создаёт строку заказа с уникальной характеристикой
   * @param [row_spec] {DpBuyers_orderProductionRow} - строка - генератор параметрика
   * @param [elm]
   * @param [len_angl]
   * @param [params]
   * @param [create]
   * @param [grid]
   * @param [cx] {Promise.<CatCharacteristics>}
   * @return {Promise.<DocCalc_orderProductionRow>}
   */
  create_product_row({row_spec, elm, len_angl, params, create, grid, cx}) {

    const row = row_spec instanceof $p.DpBuyers_orderProductionRow && !row_spec.characteristic.empty() && row_spec.characteristic.calc_order === this ?
      row_spec.characteristic.calc_order_row :
      this.production.add({
        qty: 1,
        quantity: 1,
        discount_percent_internal: $p.wsql.get_user_param('discount_percent_internal', 'number')
      });

    if(grid) {
      this.production.sync_grid(grid);
      grid.selectRowById(row.row);
    }

    if(!create) {
      return row;
    }

    // ищем объект продукции в RAM или берём из строки заказа
    const mgr = $p.cat.characteristics;
    function fill_cx(ox) {
      if(ox._deleted){
        return;
      }
      for (let ts in mgr.metadata().tabular_sections) {
        ox[ts].clear();
      }
      ox.leading_elm = 0;
      ox.leading_product = '';
      cx = Promise.resolve(ox);
      return false;
    }
    if(!cx && !row.characteristic.empty() && !row.characteristic._deleted){
      fill_cx(row.characteristic);
    }

    // если не нашли в RAM, создаём объект продукции, но из базы не читаем и пока не записываем
    return (cx || mgr.create({
      ref: $p.utils.generate_guid(),
      calc_order: this,
      product: row.row
    }, true))
      .then((ox) => {
        // если указана строка-генератор, заполняем реквизиты
        if(row_spec instanceof $p.DpBuyers_orderProductionRow) {

          if(params) {

            // получаем набор параметров, используемых текущей вставкой
            const used_params = row_spec.inset.used_params();

            // добавляем параметр в характеристику, если используется в текущей вставке
            params.find_rows({elm: row_spec.row}, (prow) => {
              if(used_params.includes(prow.param)) {
                ox.params.add(prow, true).inset = row_spec.inset;
              }
            });
          }

          elm.project = {ox};
          elm.fake_origin = row_spec.inset;

          ox.owner = row_spec.inset.nom(elm);
          ox.origin = row_spec.inset;
          ox.x = row_spec.len;
          ox.y = row_spec.height;
          ox.z = row_spec.depth;
          ox.s = (row_spec.s || row_spec.len * row_spec.height / 1e6).round(3);
          ox.clr = row_spec.clr;
          ox.note = row_spec.note;

        }

        // устанавливаем свойства в строке заказа
        Object.assign(row._obj, {
          characteristic: ox.ref,
          nom: ox.owner.ref,
          unit: ox.owner.storage_unit.ref,
          len: ox.x,
          width: ox.y,
          s: ox.s,
          qty: (row_spec && row_spec.quantity) || 1,
          quantity: (row_spec && row_spec.quantity) || 1,
          note: ox.note,
        });

        ox.name = ox.prod_name();

        // записываем расчет, если не сделали этого ранее, чтобы не погибла ссылка на расчет в характеристике
        return this.is_new() && !$p.wsql.alasql.utils.isNode ? this.save().then(() => row) : row;
      });

  }

  /**
   * ### Создаёт продукции заказа по массиву строк и параметров
   * если в dp.production заполнены уникальные характеристики - перезаполняет их, а новые не создаёт
   * @method process_add_product_list
   * @param dp {DpBuyers_order} - экземпляр обработки с заполненными табличными частями
   */
  process_add_product_list(dp) {

    let res = Promise.resolve();

    dp.production.forEach((row_dp) => {
      let row_prod;

      if(row_dp.inset.empty()) {
        row_prod = this.production.add(row_dp);
        row_prod.unit = row_prod.nom.storage_unit;
        if(!row_dp.clr.empty()) {
          // ищем цветовую характеристику
          $p.cat.characteristics.find_rows({owner: row_dp.nom}, (ox) => {
            if(ox.clr == row_dp.clr) {
              row_prod.characteristic = ox;
              return false;
            }
          });
        }
        res = res.then(() => row_prod);
      }
      else {
        // рассчитываем спецификацию по текущей вставке
        const len_angl = new FakeLenAngl(row_dp);
        const elm = new FakeElm(row_dp);
        // создаём или получаем строку заказа с уникальной харктеристикой
        res = res
          .then(() => row_dp.inset.check_prm_restrictions({elm, len_angl,
            params: dp.product_params.find_rows({elm: row_dp.elm}).map(({_row}) => _row)}))
          .then(() => this.create_product_row({row_spec: row_dp, elm, len_angl, params: dp.product_params, create: true}))
          .then((row_prod) => {
            // рассчитываем спецификацию
            row_dp.inset.calculate_spec({elm, len_angl, ox: row_prod.characteristic});
            // сворачиваем
            row_prod.characteristic.specification.group_by('nom,clr,characteristic,len,width,s,elm,alp1,alp2,origin,dop', 'qty,totqty,totqty1');
            // помещаем характеристику в текущую строку обработки dp
            row_dp.characteristic = row_prod.characteristic;
            return row_prod;
          });
      }

      // производим дополнительную корректировку спецификации и рассчитываем цены
      res = res.then((row_prod) => {
        return $p.spec_building.specification_adjustment({
          calc_order_row: row_prod,
          spec: row_prod.characteristic.specification,
        }, true);
      });
    });

    return res;
  }

  /**
   * Пересчитывает все изделия заказа по тем же правилам, что и визуальная рисовалка
   * @param attr {Object} - параметры пересчёта
   * @param [editor] {EditorInvisible}
   * @param [restore] {EditorInvisible}
   */
  recalc(attr = {}, editor, restore) {

    // при необходимости, создаём редактор
    const {EditorInvisible, CatInserts} = $p;
    const remove = !editor;
    if(remove) {
      editor = new EditorInvisible();
    }
    let {project} = editor;
    if(!(project instanceof EditorInvisible.Scheme)) {
      project = editor.create_scheme();
    }
    let tmp = Promise.resolve();

    // если передали ссылку dp, меняем при пересчете свойства в соответствии с полями обработки
    const {dp} = attr;

    // получаем массив продукций в озу
    return this.load_linked_refs()
      .then(() => {
        // бежим по табчасти, если продукция, пересчитываем в рисовалке, если материал или paramrtric - пересчитываем строку
        this.production.forEach((row) => {
          const {characteristic: cx} = row;
          if(cx.empty() || cx.calc_order !== this) {
            // это материал
            row.value_change('quantity', '', row.quantity);
          }
          else if(cx.leading_product.calc_order === this) {
            // это виртуальное изделие TODO: некоторые из таких, надо пересчитывать
            return;
          }
          else if(cx.coordinates.count()) {
            // это изделие рисовалки
            tmp = tmp.then(() => {
              return project.load(cx, true, this)                                                     // читаем изделие в невизуальную рисовалку
                .then(() => cx.apply_props(project, dp).save_coordinates({svg: false, save: false}))  // выполняем пересчет спецификации
                .then(() => this.characteristic_saved(project));                                      // выполняем пересчет строки заказа
            });
          }
          else {
            const {origin} = cx;
            if(origin instanceof CatInserts && !origin.empty() && !origin.slave) {
              // это paramrtric
              cx.specification.clear();
              // выполняем пересчет
              cx.apply_props(origin, dp).calculate_spec({
                elm: new FakeElm(row),
                len_angl: new FakeLenAngl({len: row.len, inset: origin}),
                ox: cx
              });
              row.value_change('quantity', '', row.quantity);
            }
            else {
              row.value_change('quantity', '', row.quantity);
            }
          }
        });
        return tmp;
      })
      .then(() => {
        project.ox = '';
        return remove ? editor.unload() : project.unload();
      })
      .then(() => {
        restore?.activate();
        return attr.save ? this.save(undefined, undefined, undefined, attr) : this;
      })
      .catch((err) => {
        restore?.activate();
        throw err;
      });
  }

  /**
   * Рисует изделия или фрагмент изделий заказа в Buffer в соответствии с параметрами attr
   * @param attr
   * @param editor
   */
  draw(attr = {}, editor) {

    // при необходимости, создаём редактор
    const {EditorInvisible} = $p;
    const remove = !editor;
    if(remove) {
      editor = new EditorInvisible();
    }
    let {project} = editor;
    if(!(project instanceof EditorInvisible.Scheme)) {
      project = editor.create_scheme();
    }

    attr.res = {number_doc: this.number_doc};

    let tmp = Promise.resolve();

    // получаем массив продукций в озу
    return this.load_production()
      .then((prod) => {
        for(let ox of prod){
          if(ox.coordinates.count()) {
            tmp = tmp.then(() => ox.draw(attr, editor));
          }
        }
        return tmp.then((res) => {
          project.ox = '';
          if(remove) {
            editor.unload();
          }
          else {
            project.remove();
          }
          return res;
        });
      });

  }

  /**
   * Загружает продукции шаблона из mdm-cache
   * @return {Promise}
   */
  load_templates() {
    if(this._data._templates_loaded) {
      return Promise.resolve();
    }
    if(this._data._templates_loading) {
      return this._data._templates_loading;
    }
    else if(this.obj_delivery_state == 'Шаблон') {
      const {adapters, job_prm, cat} = $p;
      this._data._templates_loading = adapters.pouch.fetch(`/couchdb/mdm/${job_prm.session_zone}/templates/${this.ref}`)
        .then((res) => res.json())
        .then(({rows}) => {
          if(rows) {
            cat.characteristics.load_array(rows);
            this._data._templates_loaded = true;
            delete this._data._templates_loading;
            return this;
          }
          throw null;
        })
        .catch((err) => {
          err && console.log(err);
          delete this._data._templates_loading;
          return this.load_production()
            .then(() => {
              this._data._templates_loaded = true;
              return this;
            })
        });
      return this._data._templates_loading;
    }
    return this.load_production();
  }

  /**
   * Устанавливает подразделение по умолчанию
   */
  static set_department() {
    const {wsql, cat} = $p
    const department = wsql.get_user_param('current_department');
    if(department) {
      this.department = department;
    }
    if(this.department.empty() || this.department.is_new()) {
      let {manager} = this;
      if(!manager || manager.empty()) {
        manager = $p.current_user;
      }
      manager && manager.acl_objs && manager.acl_objs.find_rows({by_default: true, type: cat.divisions.class_name}, (row) => {
        if(this.department != row.acl_obj) {
          this.department = row.acl_obj;
        }
        return false;
      });
    }
  }

};

$p.DocCalc_order.FakeElm = FakeElm;

$p.DocCalc_order.FakeLenAngl = FakeLenAngl;

// свойства и методы табчасти продукции
$p.DocCalc_orderProductionRow = class DocCalc_orderProductionRow extends $p.DocCalc_orderProductionRow {

  // при изменении реквизита
  value_change(field, type, value, no_extra_charge) {

    let {_obj, _owner, nom, characteristic, unit} = this;
    let recalc;
    const {rounding, _slave_recalc, manager} = _owner._owner;
    const {DocCalc_orderProductionRow, DocPurchase_order, utils, wsql, pricing, enm} = $p;
    const rfield = DocCalc_orderProductionRow.rfields[field];

    if(rfield) {

      _obj[field] = rfield === 'n' ? parseFloat(value) : '' + value;

      nom = this.nom;
      characteristic = this.characteristic;

      // проверим владельца характеристики
      if(!characteristic.empty()) {
        if(!characteristic.calc_order.empty() && characteristic.owner != nom) {
          characteristic.owner = nom;
        }
        else if(characteristic.owner != nom) {
          _obj.characteristic = utils.blank.guid;
          characteristic = this.characteristic;
        }
      }

      // проверим единицу измерения
      if(unit.owner != nom) {
        _obj.unit = nom.storage_unit.ref;
      }

      // если это следящая вставка, рассчитаем спецификацию
      const {origin} = characteristic;
      if(origin && !origin.empty() && origin.slave) {
        characteristic.specification.clear();
        characteristic.x = this.len;
        characteristic.y = this.width;
        characteristic.s = (this.s || this.len * this.width / 1e6).round(3);
        const len_angl = new FakeLenAngl({len: this.len, inset: origin});
        const elm = new FakeElm(this);
        origin.calculate_spec({elm, len_angl, ox: characteristic});
        recalc = true;
      }

      // рассчитаем цены
      const fake_prm = {
        calc_order_row: this,
        spec: characteristic.specification
      };
      const {price} = _obj;
      pricing.price_type(fake_prm);
      if(origin instanceof DocPurchase_order) {
        fake_prm.first_cost = _obj.first_cost;
      }
      else {
        pricing.calc_first_cost(fake_prm);
      }
      pricing.calc_amount(fake_prm);
      if(price && !_obj.price) {
        _obj.price = price;
        recalc = true;
      }
    }

    if(DocCalc_orderProductionRow.pfields.includes(field) || recalc) {

      if(!recalc) {
        _obj[field] = parseFloat(value);
      }

      isNaN(_obj.price) && (_obj.price = 0);
      isNaN(_obj.extra_charge_external) && (_obj.extra_charge_external = 0);
      isNaN(_obj.price_internal) && (_obj.price_internal = 0);
      isNaN(_obj.discount_percent) && (_obj.discount_percent = 0);
      isNaN(_obj.discount_percent_internal) && (_obj.discount_percent_internal = 0);

      _obj.amount = (_obj.price * ((100 - _obj.discount_percent) / 100) * _obj.quantity).round(rounding);

      // если есть внешняя цена дилера, получим текущую дилерскую наценку
      if(!no_extra_charge) {
        const prm = {calc_order_row: this};
        let extra_charge = wsql.get_user_param('surcharge_internal', 'number');

        // если пересчет выполняется менеджером, используем наценку по умолчанию
        if(!manager.partners_uids.length || !extra_charge) {
          pricing.price_type(prm);
          extra_charge = prm.price_type.extra_charge_external;
        }
        // если есть наценка в строке применим ее
        if (_obj.extra_charge_external !== 0) {
          extra_charge = _obj.extra_charge_external;
        }
        if(field != 'price_internal' && _obj.price) {
          _obj.price_internal = (_obj.price * (100 - _obj.discount_percent) / 100 * (100 + extra_charge) / 100).round(rounding);
        }
      }

      _obj.amount_internal = (_obj.price_internal * ((100 - _obj.discount_percent_internal) / 100) * _obj.quantity).round(rounding);

      // ставка и сумма НДС
      const doc = _owner._owner;
      if(doc.vat_consider) {
        const {НДС18, НДС18_118, НДС10, НДС10_110, НДС20, НДС20_120, НДС0, БезНДС} = enm.vat_rates;
        _obj.vat_rate = (nom.vat_rate.empty() ? НДС18 : nom.vat_rate).ref;
        switch (this.vat_rate) {
        case НДС18:
        case НДС18_118:
          _obj.vat_amount = (_obj.amount * 18 / 118).round(2);
          break;
        case НДС10:
        case НДС10_110:
          _obj.vat_amount = (_obj.amount * 10 / 110).round(2);
          break;
        case НДС20:
        case НДС20_120:
          _obj.vat_amount = (_obj.amount * 20 / 120).round(2);
          break;
        case НДС0:
        case БезНДС:
        case '_':
        case '':
          _obj.vat_amount = 0;
          break;
        }
        if(!doc.vat_included) {
          _obj.amount = (_obj.amount + _obj.vat_amount).round(2);
        }
      }
      else {
        _obj.vat_rate = '';
        _obj.vat_amount = 0;
      }


      // пересчитываем спецификации и цены в следящих вставках
      if(!_slave_recalc){
        _owner._owner._slave_recalc = true;
        _owner.forEach((row) => {
          if(row === this) return;
          const {origin} = row.characteristic;
          if(origin && !origin.empty() && origin.slave) {
            row.value_change('quantity', 'update', row.quantity, no_extra_charge);
          }
        });
        _owner._owner._slave_recalc = false;
      }

      // TODO: учесть валюту документа, которая может отличаться от валюты упр. учета и решить вопрос с amount_operation

      // подчиненные строки
      if(field === 'quantity' && !characteristic.empty() && !characteristic.calc_order.empty()) {
        this._owner.find_rows({ordn: characteristic}, (row) => {
          row.value_change('quantity', type, _obj.quantity, no_extra_charge);
        });
      }
      const amount = _owner.aggregate([], ['amount', 'amount_internal']);
      amount.doc_amount = amount.amount.round(rounding);
      amount.amount_internal = amount.amount_internal.round(rounding);
      delete amount.amount;
      Object.assign(doc, amount);
      doc._manager.emit_async('update', doc, amount);

      return false;
    }
  }

};

$p.DocCalc_orderProductionRow.rfields = {
  nom: 's',
  characteristic: 's',
  quantity: 'n',
  len: 'n',
  width: 'n',
  s: 'n',
};

$p.DocCalc_orderProductionRow.pfields = 'price,price_internal,quantity,discount_percent_internal,extra_charge_external';


/**
 * Предопределенные дополнительные реквизиты
 *
 * @module predefined_props
 *
 * Created by Evgeniy Malyarov on 01.06.2019.
 */

$p.md.once('predefined_elmnts_inited', () => {
  const {DocCalc_order, doc: {calc_order}, cat: {destinations}, cch: {properties}, enm: {obj_delivery_states}, job_prm} = $p;
  const dst = destinations.predefined('Документ_Расчет');
  if(!dst) {
    return;
  }
  const predefined = [
    {
      class_name: 'cch.properties',
      ref: '198ac4ac-8453-11e9-bc71-873e65ad9246',
      name: 'Параметры из системы',
      caption: 'Параметры из системы',
      sorting_field: 1143,
      available: true,
      list: 0,
      destination: dst.ref,
      type: {types: ['boolean']}
    },
    {
      class_name: 'cch.properties',
      ref: '28278e46-8453-11e9-bc71-873e65ad9246',
      name: 'Уточнять систему',
      caption: 'Уточнять систему',
      sorting_field: 1144,
      available: true,
      list: 0,
      destination: dst.ref,
      type: {types: ['boolean']}
    },
    {
      class_name: 'cch.properties',
      ref: '323b3eaa-8453-11e9-bc71-873e65ad9246',
      name: 'Уточнять фурнитуру',
      caption: 'Уточнять фурнитуру',
      sorting_field: 1145,
      available: true,
      list: 0,
      destination: dst.ref,
      type: {types: ['boolean']}
    }
  ];
  properties.load_array(predefined);

  const templates_props = predefined.map(({ref}) => properties.get(ref));

  Object.defineProperties(DocCalc_order.prototype, {
    refill_props: {
      get() {
        const row = this.extra_fields.find({property: templates_props[0]});
        return row ? row.value : job_prm.builder.refill_props;
      }
    },
    specify_sys: {
      get() {
        const row = this.extra_fields.find({property: templates_props[1]});
        return row ? row.value : false;
      }
    },
    specify_furn: {
      get() {
        const row = this.extra_fields.find({property: templates_props[2]});
        return row ? row.value : false;
      }
    },
    clear_templates_props: {
      value() {
        this.extra_fields.clear({property: {in: templates_props}});
      }
    }
  });

  const {extra_fields} = Object.getPrototypeOf(calc_order);
  calc_order.extra_fields = function (obj) {
    const res = extra_fields.call(calc_order, obj);
    return obj.obj_delivery_state === obj_delivery_states.Шаблон ? res.concat(templates_props) : res;
  }
});

 
return EditorInvisible;
}