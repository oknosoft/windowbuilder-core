
/**
 * @summary Раскладка
 * @desc Класс описывает поведение элемента раскладки
 *
 * - у раскладки есть координаты конца и начала
 * - есть путь образующей - прямая или кривая линия, такая же, как у {@link ProfileItem}
 * - владелец типа {@link Filling}
 * - концы могут соединяться не только с пустотой или другими раскладками, но и с рёбрами заполнения
 *
 * @extends ProfileItem
 */
class Onlay extends ProfileItem {

  /**
   * @inheritdoc
   */
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
   * Возвращает тип элемента (раскладка)
   * @type EnmElm_types
   */
  get elm_type() {
    return $p.enm.elm_types.layout;
  }

  /**
   * Слой раскладки в стеклопакете
   * @type {EnmLay_regions}
   */
  get region() {
    let region = this._row?.region;
    if(!region || region.empty?.()) {
      region = this.inset?.region;
    }
    return region && !region.empty?.() ? region : $p.enm.lay_regions.r1;
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
   * У раскладки не бывает примыкающих параллельных элементов
   * @override
   * @return {void}
   */
  nearest() {}

  /**
   * Возвращает массив примыкающих ипостов
   * @param {Boolean} [check_only]
   * @return {Boolean|JoinedProfiles}
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
   * @override
   * @return {void}
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
   * @override
   * @return {CnnPoint}
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

    
    res.clear();
    if(this.parent){
      const res_bind = this.bind_node(point, [this.parent], node);
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
   * @param {paper.Point} point
   * @param {Array.<Filling>} [glasses]
   * @param {NodeBE} [node]
   * @return {Object}
   */
  bind_node(point, glasses, node) {

    let res = {distance: Infinity, is_l: true};
    
    if(!this.is_linear()) {
      return res;
    }

    if(!glasses){
      glasses = [this.parent];
    }

    // сначала, к образующим заполнений
    for(const glass of glasses) {
      const {b, e, generatrix } = this;
      const other = node === 'b' ? e : b;
      const line = generatrix.clone({insert: false}).elongation(3000);
      for(const {sub_path} of glass.profiles) {
        const np = sub_path.intersect_point(line);
        const angle = np && Math.abs(np.subtract(other).angle - point.subtract(other).angle);
        if(np && (angle < consts.epsilon || Math.abs(angle - 360) < consts.epsilon)) {
          let distance = np.getDistance(point);

          if(distance < res.distance){
            res.distance = distance;
            res.point = np;
            res.profile = glass;
            res.cnn_types = $p.enm.cnn_types.acn.t;
          }

          if(distance < consts.sticking_l){
            res.binded = true;
            return res;
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
        }
      }
    }

    if(!res.binded && res.point && res.distance < consts.sticking){
    //if(!res.binded && res.point && res.distance < Infinity){
      res.binded = true;
    }

    return res;
  }

  /**
   * Сдвигает узлы к точкам from и to
   * @param {paper.Point} from
   * @param {paper.Point} to
   * @return {void}
   */
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

