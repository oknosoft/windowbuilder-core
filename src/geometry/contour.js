
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

/* global paper, $p */

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

    super({parent: attr.parent});

    this._attr = {};

    // узлы и рёбра текущего слоя
    //this._skeleton = new Skeleton(this);

    const {project} = this;

    // строка в таблице конструкций
    this._row = attr.row;

    if(attr.direction) {
      this.direction = attr.direction;
    }
    if(attr.furn && typeof attr.furn !== 'string') {
      this.furn = attr.furn || project.default_furn;
    }

    // добавляем элементы контура
    const ox = attr.ox || project.ox;
    this.create_children({coordinates: ox.coordinates, cnstr: this.cnstr});

    project.l_connective.bringToFront();

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

    coordinates.find_rows({cnstr, region: 0}, (row) => {
      const attr = {row, parent: this};
      // профили и доборы
      if(row.elm_type === elm_types.Связка) {
        new ProfileBundle(attr);
      }
      else if(row.elm_type === elm_types.Вложение) {
        this instanceof ContourParent ? new ProfileParent(attr) : new ProfileNested(attr);
      }
      else if(elm_types.profiles.includes(row.elm_type)) {
        this instanceof ContourNestedContent ? new ProfileNestedContent(attr) : new Profile(attr);
      }
      // заполнения
      else if(elm_types.glasses.includes(row.elm_type)) {
        new Filling(attr)
      }
      // разрезы
      else if(row.elm_type === elm_types.Водоотлив) {
        new Sectional(attr)
      }
      // остальные элементы (текст)
      else if(row.elm_type === elm_types.Текст) {
        new FreeText({row, parent: this.l_text})
      }
    });
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
    project._scope.eve.emit_async('rows', project.ox, {constructions: true});
    return contour;
  }

  presentation(bounds) {
    if(!bounds){
      bounds = this.bounds;
    }
    return (this.parent ? 'Створка №' : 'Рама №') + this.cnstr +
      (bounds ? ` ${bounds.width.toFixed()}х${bounds.height.toFixed()}` : '');
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
    const {_row} = this;
    if (_row.furn == v) {
      return;
    }

    _row.furn = v;

    // при необходимости устанавливаем направление открывания
    if (this.direction.empty()) {
      this.project._dp.sys.furn_params.find_rows({
        param: $p.job_prm.properties.direction,
      }, ({value}) => {
        _row.direction = value;
        return false;
      });
    }

    // перезаполняем параметры фурнитуры
    _row.furn.refill_prm(this);

    this.project.register_change(true);

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
        if (this.calck_rating(glcontour, glass) > 2) {
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
    //удаляем детей
    const {children, _row, cnstr, project: {ox}} = this;
    while (children.length) {
      children[0].remove();
    }

    if (_row && ox === _row._owner._owner) {
      ox.coordinates.clear({cnstr});
      ox.params.clear({cnstr});
      ox.inserts.clear({cnstr});
      _row._owner.del(_row);
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

    const {tabular_sections} = this.project.ox._metadata();
    const {fields} = tabular_sections.constructions;

    return fld ? (fields[fld] || tabular_sections[fld]) : {
      fields: {
        furn: fields.furn,
        direction: fields.direction,
        h_ruch: fields.h_ruch,
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
    const {project, l_visualization} = this;

    if(!project.ox.sys.check_static) {
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

    const {l_visualization} = this;

    if (l_visualization._cnn) {
      l_visualization._cnn.removeChildren();
    }
    else {
      l_visualization._cnn = new paper.Group({parent: l_visualization});
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
      glass.profiles.forEach(({cnn, sub_path}) => {
        if (!cnn) {
          Object.assign(sub_path, err_attrs);
          err = true;
        }
      });
      if (err || glass.path.is_self_intersected()) {
        glass.fill_error();
      }
      else {
        const {form_area, inset: {smin, smax}} = glass;
        if((smin && smin > form_area) || (smax && smax < form_area)) {
          glass.fill_error();
        }
        else {
          glass.path.fillColor = BuilderElement.clr_by_clr.call(glass, glass._row.clr, false);
        }
      }
      // Ошибки соединений Onlay в этом заполнении
      glass.imposts.forEach((impost) => {
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
        Object.assign(elm.path.get_subpath(_corns[1], _corns[2]), err_attrs);
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
    const {l_visualization, project} = this;
    if(project.builder_props.mosquito === false) {
      return;
    }
    project.ox.inserts.find_rows({cnstr: this.cnstr}, (row) => {
      if (row.inset.insert_type == $p.enm.inserts_types.МоскитнаяСетка) {
        const props = {
          parent: new paper.Group({parent: l_visualization._by_insets}),
          strokeColor: 'grey',
          strokeWidth: 3,
          dashArray: [6, 4],
          strokeScaling: false,
        };
        let sz, imposts;
        row.inset.specification.forEach((rspec) => {
          if (!sz && rspec.count_calc_method == $p.enm.count_calculating_ways.ПоПериметру && rspec.nom.elm_type == $p.enm.elm_types.Рама) {
            sz = rspec.sz;
          }
          if (!imposts && rspec.count_calc_method == $p.enm.count_calculating_ways.ПоШагам && rspec.nom.elm_type == $p.enm.elm_types.Импост) {
            imposts = rspec;
          }
        });

        // рисуем контур
        const perimetr = [];
        if (typeof sz != 'number') {
          sz = 20;
        }
        this.outer_profiles.forEach((curr) => {
          // получаем внешнюю палку, на которую будет повешена москитка
          const profile = curr.profile || curr.elm;
          const is_outer = Math.abs(profile.angle_hor - curr.elm.angle_hor) > 60;
          const ray = is_outer ? profile.rays.outer : profile.rays.inner;
          const segm = ray.get_subpath(curr.b, curr.e).equidistant(sz);
          perimetr.push(Object.assign(segm, props));
        });

        const count = perimetr.length - 1;
        perimetr.forEach((curr, index) => {
          const prev = index == 0 ? perimetr[count] : perimetr[index - 1];
          const next = index == count ? perimetr[0] : perimetr[index + 1];
          const b = curr.getIntersections(prev);
          const e = curr.getIntersections(next);
          if (b.length) {
            curr.firstSegment.point = b[0].point;
          }
          if (e.length) {
            curr.lastSegment.point = e[0].point;
          }
        });

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
    const {l_visualization, project} = this;
    if(project.builder_props.jalousie === false) {
      return;
    }
    project.ox.inserts.find_rows({cnstr: -glass.elm}, ({inset, clr}) => {
      if(inset.insert_type == $p.enm.inserts_types.Жалюзи) {

        let control, type, shift, step, steps, pos;
        project.ox.params.find_rows({inset, cnstr: -glass.elm}, ({param, value}) => {
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
          fillColor: BuilderElement.clr_by_clr(clr),
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
          if (count_calc_method == $p.enm.count_calculating_ways.ПоПлощади && sz && offsets) {
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
          strokeWidth: 1,
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
          strokeWidth: 1,
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
    const {l_visualization, project, cnstr} = this;
    const {ox} = project;
    const {properties} = $p.job_prm;
    if (!properties) {
      return;
    }
    // указатели на параметры длина и ширина
    const {length, width} = properties;

    ox.inserts.find_rows({cnstr}, (row) => {
      if (row.inset.insert_type == $p.enm.inserts_types.Подоконник) {

        const bottom = this.profiles_by_side('bottom');
        let vlen, vwidth;
        ox.params.find_rows({cnstr: cnstr, inset: row.inset}, (prow) => {
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
          fillColor: BuilderElement.clr_by_clr(row.clr),
          shadowColor: 'grey',
          shadowBlur: 20,
          shadowOffset: [10, 20],
          opacity: 0.7,
          strokeWidth: 1,
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

    const _contour = this;
    const {l_visualization, furn} = this;

    if (!this.parent || !$p.enm.open_types.is_opening(furn.open_type)) {
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
    function rotary_folding() {

      const {_opening} = l_visualization;
      const {side_count} = _contour;

      furn.open_tunes.forEach((row) => {

        if (row.rotation_axis) {
          const axis = _contour.profile_by_furn_side(row.side, cache);
          const other = _contour.profile_by_furn_side(
            row.side + 2 <= side_count ? row.side + 2 : row.side - 2, cache);

          _opening.moveTo(axis.corns(3));
          _opening.lineTo(other.rays.inner.getPointAt(other.rays.inner.length / 2));
          _opening.lineTo(axis.corns(4));

        }
      });
    }

    // рисует линии открывания на раздвижке
    function sliding() {
      // находим центр
      const {center} = _contour.bounds;
      const {_opening} = l_visualization;

      if (_contour.direction == $p.enm.open_directions.Правое) {
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
    }

    // подготавливаем слой для рисования
    if (!l_visualization._opening) {
      l_visualization._opening = new paper.CompoundPath({
        parent: _contour.l_visualization,
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

    const {profiles, l_visualization, contours} = this;
    const glasses = this.glasses(false, true).filter(({visible}) => visible);
    l_visualization._by_spec.removeChildren();

    // если кеш строк визуализации пустой - наполняем
    if(!rows){
      rows = [];
      this.project.ox.specification.find_rows({dop: -1}, (row) => rows.push(row));
    }

    function draw (elm) {
      if (this.elm === elm.elm && elm.visible) {
        this.nom.visualization.draw(elm, l_visualization, this.len * 1000);
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
    for(const row of rows){
      // визуализация для текущего профиля
      if(!profiles.some(draw.bind(row))){
        // визуализация для текущего заполнения
        glasses.some((elm) => {
          if (row.elm === elm.elm) {
            row.nom.visualization.draw(elm, l_visualization, [row.len * 1000, row.width * 1000]);
            return true;
          }
          // визуализация для текущей раскладки
          return elm.imposts.some(draw.bind(row));
        })
      }
    }

    // перерисовываем вложенные контуры
    for(const contour of contours){
      contour.draw_visualization(rows);
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
      const {b, e} = elm.rays;
      return b.is_tt || e.is_tt || b.is_i || e.is_i;
    });
  }

  /**
   * виртуальная табличная часть параметров фурнитуры
   */
  get params() {
    return this.project.ox.params;
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
        if (noti.profiles.indexOf(elm) == -1) {
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
      const ProfileConstructor = this instanceof ContourVirtual ? ProfileNested : Profile;
      for (let i = 0; i < attr.length; i++) {
        curr = attr[i];
        if (curr.binded) {
          continue;
        }
        elm = new ProfileConstructor({
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
    this.profiles.forEach((p) => p.default_inset());

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
   * @return {Array}
   */
  perimeter_inner(size) {
    // накопим в res пути внутренних рёбер профилей
    const {center} = this.bounds;
    const res = this.outer_profiles.map((curr) => {
      const profile = curr.profile || curr.elm;
      const {inner, outer} = profile.rays;
      const sub_path = inner.getNearestPoint(center).getDistance(center, true) < outer.getNearestPoint(center).getDistance(center, true) ?
        inner.get_subpath(inner.getNearestPoint(curr.b), inner.getNearestPoint(curr.e)) : outer.get_subpath(outer.getNearestPoint(curr.b), outer.getNearestPoint(curr.e));
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
   * Габариты по рёбрам периметра внутренней стороны профилей
   * @param size
   * @return {Rectangle}
   */
  bounds_inner(size) {
    const path = new paper.Path({insert: false});
    for (let curr of this.perimeter_inner(size)) {
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

  refresh_prm_links(root) {

    const cnstr = root ? 0 : this.cnstr || -9999;
    const {_dp} = this.project;
    const {sys} = _dp;
    let notify;

    // пробегаем по всем строкам
    this.params.find_rows({cnstr, inset: $p.utils.blank.guid}, (prow) => {
      const {param} = prow;
      const links = param.params_links({grid: {selection: {cnstr}}, obj: prow});

      // сокрытие по умолчаниям или связям
      let hide = (!param.show_calculated && param.is_calculated) || links.some((link) => link.hide);
      if(!hide) {
        const drow = sys.prm_defaults(param, cnstr);
        if(drow && drow.hide) {
          hide = true;
        }
      }

      // проверим вхождение значения в доступные и при необходимости изменим
      if (links.length && param.linked_values(links, prow)) {
        notify = true;
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
      }
    };

  }

  /**
   * Вычисляемые поля в таблицах конструкций и координат
   * @method save_coordinates
   * @param short {Boolean} - короткий вариант - только координаты контура
   */
  save_coordinates(short) {

    if (!short) {
      // если контур не скрыт, удаляем скрытые заполнения
      if(!this.hidden) {
        this.glasses(false, true).forEach((glass) => !glass.visible && glass.remove());
      }

      // запись в таблице координат, каждый элемент пересчитывает самостоятельно
      const {l_text, l_dimensions} = this;
      for (let elm of this.children) {
        if (elm.save_coordinates) {
          elm.save_coordinates();
        }
        else if (elm === l_text || elm === l_dimensions) {
          elm.children.forEach((elm) => elm.save_coordinates && elm.save_coordinates());
        }
      }
    }

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
   * Кеш используется при расчете спецификации фурнитуры
   * @return {Object}
   */
  get furn_cache() {
    return {
      profiles: this.outer_nodes,
      bottom: this.profiles_by_side('bottom'),
      ox: this.project.ox,
      w: this.w,
      h: this.h,
    };
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
   * Элемент, вокруг образующей которого повёрнут слой
   * @return {BuilderElement}
   */
  get rotation_elm() {
    const {_row, project} = this;
    return _row.rotation_elm ? project.getItem({class: BuilderElement, elm: _row.rotation_elm}) : null;
  }
  set rotation_elm(v) {
    const {_row, project} = this;
    if(v instanceof BuilderElement) {
      _row.rotation_elm = v.elm;
    }
    else if(typeof v === 'number') {
      const elm = project.getItem({class: BuilderElement, elm: v});
      if(v) {
        _row.rotation_elm = v;
      }
    }
  }

  /**
   * Угол поворота в пространстве
   * @return {Number}
   */
  get angle3d() {
    return this._row.angle3d;
  }
  set angle3d(v) {
    return this._row.angle3d = v;
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
   */
  on_sys_changed() {
    this.profiles.forEach((elm) => elm.default_inset(true));

    this.glasses().forEach((elm) => {
      if (elm instanceof Contour) {
        elm.on_sys_changed();
      }
      else {
        // заполнения проверяем по толщине
        if (elm.thickness < elm.project._dp.sys.tmin || elm.thickness > elm.project._dp.sys.tmax)
          elm._row.inset = elm.project.default_inset({elm_type: [$p.enm.elm_types.Стекло, $p.enm.elm_types.Заполнение]});
        // проверяем-изменяем соединения заполнений с профилями
        elm.profiles.forEach((curr) => {
          if (!curr.cnn || !curr.cnn.check_nom2(curr.profile))
            curr.cnn = $p.cat.cnns.elm_cnn(elm, curr.profile, $p.enm.cnn_types.acn.ii);
        });
      }
    });
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
