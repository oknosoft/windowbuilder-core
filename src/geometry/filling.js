
/**
 * Заполнение
 * - Инкапсулирует поведение элемента заполнения
 * - У заполнения есть коллекция рёбер, образующая путь контура
 * - Путь всегда замкнутый, образует простой многоугольник без внутренних пересечений, рёбра могут быть гнутыми
 *
 * @extends AbstractFilling
 */
class Filling extends AbstractFilling(BuilderElement) {

  /**
   *
   * @param attr {Object} - объект со свойствами создаваемого элемента
   */
  constructor(attr) {

    const {path, proto} = attr;
    if(path){
      delete attr.path;
    }

    super(attr);

    if(path){
      attr.path = path;
    }
    if(proto){
      attr.proto = proto;
    }
    
    this.create_groups();

    // initialize
    this.initialize(attr);

  }

  create_groups() {
    super.create_groups();
    new GroupLayers({parent: this, name: 'tearings'});
    new GroupText({parent: this, name: 'text'});
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
      elm_type: elm_types.layout
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
   */
  save_coordinates() {

    const {_row, project, layer, profiles, bounds, form_area, thickness, nom, ox: {cnn_elmnts: cnns, glasses}} = this;
    const h = project.bounds.height + project.bounds.y;
    const {length} = profiles;

    // строка в таблице заполнений продукции
    glasses.add({
      elm: _row.elm,
      nom: nom,
      formula: this.formula(),
      width: bounds.width,
      height: bounds.height,
      s: form_area,
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
    _row.s = form_area;
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

      if(!curr.profile || !curr.profile._row){
        if($p.job_prm.debug) {
          console.error('Не найдено ребро заполнения');
        }
        return;
      }
      if(!curr.cnn){
        if($p.job_prm.debug) {
          console.error(`Не найдено примыкающее соединение для заполнения №${_row.elm}`);
        }
        return;
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

    // дочерние раскладки и разрывы заполнений
    for(const child of this.imposts.concat(this.children.tearings.children)) {
      child.save_coordinates?.();
    }
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
    const cattr = {project, kind, parent: layer.children.topLayers};
    // фурнитура и параметры по умолчанию
    if(direction) {
      cattr.direction = direction;
    }
    const {utils, enm: {elm_types}} = $p;
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
      this.parent = contour.children.fillings;
      _row.cnstr = contour.cnstr;
      // проверим вставку
      this.set_inset(project.default_inset({
        inset: this.inset,
        elm: this,
        elm_type: elm_types.glasses,
      }), true);      
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
   * @summary Примыкающий внешний элемент
   * @description если указан point, ищет ближайшее ребро, иначе - пусто
   * @override
   * @param {paper.Point} [point]
   * @return {void|BuilderElement}
   */
  nearest(point) {
    if(point && point !== true) {
      let distance = Infinity;
      let profile;
      for(const curr of this.profiles) {
        const td = curr.sub_path.getNearestPoint(point).getDistance(point, true);
        if(td < distance) {
          distance = td;
          profile = curr.profile;
        }
      }
      return profile;
    }
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

    //this.sendToBack();

    const {path, imposts, glbeads, _attr, is_rectangular, elm, project: {bounds: pbounds, ox}, visible} = this;
    const {elm_font_size, font_family} = consts;
    const {builder_props} = ox;
    const max = Math.max(pbounds.width, pbounds.height);
    let fontSize = elm_font_size * (2 / 3);
    if(max > 3000) {
      fontSize += fontSize * (max - 3000) / 3000;
    }
    const maxTextWidth = 900;
    path.visible = true;
    imposts.forEach((elm) => {
      elm.redraw();
      elm.visible = visible && !(builder_props.onlay_regions && elm.region != builder_props.onlay_regions);
    });

    // прочистим пути
    this.purge_paths();

    // если текст не создан - добавляем
    if(!_attr._text){
      _attr._text = new paper.PointText({
        parent: this.children.text,
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
    
    // Заполнения отдельно
    const param = $p.cch.properties.predefined('glass_separately');
    if(param?.extract_pvalue({ox, cnstr: -elm, elm: this})) {
      if(!_attr._text_sep){
        _attr._text_sep = new paper.Path.Circle({
          parent: this.children.text,
          center: [0, 0],
          radius: fontSize * 0.8,
          strokeColor: 'green',
          strokeWidth: fontSize / 2,
        });
        _attr._text_sep.strokeColor.alpha = 0.8;
      }
      _attr._text_sep.position = bounds.bottomRight.add([-fontSize * 1.6, -fontSize * 1.6]);
    }
    else if(_attr._text_sep){
      _attr._text_sep.remove();
      _attr._text_sep = null;
    }

    for(const glbead of glbeads) {
      glbead.redraw();
    }

    return this.draw_regions();
  }

  /**
   * Рисует заполнение отдельным элементом
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
    lv.by_insets && lv.by_insets.removeChildren();
    lv._cnn && lv._cnn.removeChildren();
    lv._opening && lv._opening.removeChildren();
    lv.visible = true;
    !no_zoom && layer.zoom_fit();
  }

  /**
   * Рисует при необходимости ряды
   */
  draw_regions() {
    const {inset, elm, layer, _attr: {paths, _text}, project: {builder_props}} = this;
    if(inset.region && !(layer instanceof ContourTearing)) {
      this.ox.glass_specification.find_rows({elm}, (row) => {
        // 0 - не ряд
        // 1 - ряд внутри элемента
        // >1 - за элементом
        // <0 - перед элементом
        if([1, 2, 3, -1, -2].includes(row.region)) {
          const {profiles, path} = this;
          const nom = row.inset.nom(this);
          const interior = this.interiorPoint();
          if(!paths.has(row.region)) {
            const parent = row.region === 1 ? this : (row.region < 0 ? layer.children.topLayers : layer.children.bottomLayers)
            paths.set(row.region, new paper.Path({parent, strokeColor: 'gray', opacity: 0.88}));
          }
          const rpath = paths.get(row.region);
          rpath.fillColor = path.fillColor;
          rpath._owner = this;
          rpath.removeSegments();
          // получаем периметр ряда
          const {enm: {cnn_types}, cat: {cnns}, job_prm: {nom: {strip}}} = $p;
          const outer_profiles = profiles.map((v) => {
            let profile = v.profile.nearest() || v.profile;
            let side = profile.cnn_side(this, interior);
            const elm2 = [{profile, side}];
            if(v.profile !== profile) {
              elm2.push({profile: v.profile, side: v.profile.cnn_side(this, interior)});              
            }
            const cnn = cnns.region_cnn({
              region: row.region,
              elm1: this,
              nom1: nom,
              elm2,
              art1glass: true,
              cnn_types: cnn_types.acn.ii,
            });
            if(cnn?.sd2) {
              if(!side.is('outer')) {
                side = side._manager.outer;
              }
              profile = v.profile;
            }
            const size = cnn?.size(this, profile, row.region) || 0;
            const sub_path = profile
              .rays[side.is('outer') ? 'outer' : 'inner']
              .get_subpath(v.b, v.e)
              .equidistant(size, 100);
            const sz = cnn?.specification?.find?.({nom: strip})?.sz;
            const strip_path = sz ? sub_path.equidistant(-sz) : sub_path.clone({insert: false});
            return {profile, sub_path, strip_path, cnn, size, b: v.b, e: v.e};
          });
          const {length} = outer_profiles;
          for (let i = 0; i < length; i++) {
            const prev = i === 0 ? outer_profiles[length-1] : outer_profiles[i-1];
            const curr = outer_profiles[i];
            const next = i === length-1 ? outer_profiles[0] : outer_profiles[i+1];
            if(!curr.pb) {
              curr.pb = curr.sub_path.intersect_point(prev.sub_path, curr.b);
              if(prev !== next) {
                prev.pe = curr.pb;
              }
            }
            if(!curr.pe) {
              curr.pe = curr.sub_path.intersect_point(next.sub_path, curr.e);
              if(prev !== next) {
                next.pb = curr.pe;
              }
            }
            if(!curr.sb) {
              curr.sb = curr.strip_path.intersect_point(prev.strip_path, curr.b);
              if(prev !== next) {
                prev.se = curr.sb;
              }
            }
            if(!curr.se) {
              curr.se = curr.strip_path.intersect_point(next.strip_path, curr.e);
              if(prev !== next) {
                next.sb = curr.se;
              }
            }
          }
          for (const curr of outer_profiles) {
            if(curr.pb && curr.pe){
              curr.sub_path = curr.sub_path.get_subpath(curr.pb, curr.pe, true);
            }
            else if(job_prm.debug) {
              throw 'Filling:path';
            }
            if(curr.sb && curr.se){
              curr.strip_path = curr.strip_path.get_subpath(curr.sb, curr.se, true);
            }
          }
          // формируем пути внешнего заполнения и полосы
          let strip_path = new paper.Path({insert: false});
          rpath.removeChildren();
          for (const curr of outer_profiles) {
            rpath.addSegments(curr.sub_path.segments.filter((v, index) => {
              if(index || !rpath.segments.length || v.hasHandles()) {
                return true;
              }
            }));
            if(curr.strip_path) {
              strip_path.addSegments(curr.strip_path.segments.filter((v, index) => {
                if(index || !strip_path.segments.length || v.hasHandles()) {
                  return true;
                }
              }));
            }
          }
          if(rpath.segments.length && !rpath.closed){
            rpath.closePath(true);
          }
          if(strip_path.segments.length && !strip_path.closed){
            strip_path.closePath(true);
          }
          if(row.region < 0) {
            _text?.insertAbove(rpath);
            rpath.opacity = 0.7;  
          }
          if(strip_path.segments.length){
            strip_path = rpath.exclude(strip_path);
            strip_path.fillColor = 'grey';
            strip_path._owner = this;
            const old = paths.get(`s${row.region}`); 
            if(old && old !== strip_path) {
              old.remove();
            }
            paths.set(`s${row.region}`, strip_path);
          }
          if(row.region > 0) {
            strip_path.opacity = 0.08;
            rpath.opacity = 0.16;
          }
        }
      });
      for(const [region, elm] of paths) {
        if(elm?.isInserted()){
          elm.visible = builder_props.glass_regions;
        }
      }
    }
    else if(paths.size) {
      for(const [region, elm] of paths) {
        elm?.remove?.();
      }
      paths.clear();
    }
    return this;
  }
  
  reset_fragment() {
    const {children, layer, path} = this;
    children.dimlns.clear(true);
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
      if(insert_type.is('composite')) {
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
          // если тип стеклопакет - заполняем по умолчанию
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
   * Произвольный комментарий
   * @type {String}
   */
  get note() {
    return this.dop.note || '';
  }
  set note(v) {
    this.project.selected_glasses().forEach(elm => elm.dop = {note: v});
  }

  /**
   * Прочищает паразитные пути
   */
  purge_paths() {
    const {path, children, _attr: {paths}} = this;
    const {Path, CompoundPath} = paper;
    const rpaths = Array.from(paths.values());
    for(const p of children.filter((child) => child instanceof Path || child instanceof CompoundPath)) {
      if(p !== path && !rpaths.includes(p)) {
        p.remove();
      }
    }
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
    const {elm, inset, ox, note} = this;
    if(note) {
      return note;
    }
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
   * Создаёт-удаляет дополнительные свойства элемента в зависимости от их наличия в системе или параметрах параметра
   * [inset] {CatInserts} - указываем для дополнительных вставок
   * @override
   * @return {Array}
   */
  elm_props(inset) {
    const res = super.elm_props(inset);
    let {ox: {params}, layer: {sys}} = this;
    
    const {glass_separately} = $p.job_prm.properties; 
    if([1, 2].includes(glass_separately?.inheritance)) {
      const prow = sys.product_params.find({param: glass_separately});
      if(!prow?.hide) {
        res.unshift(glass_separately);
      }
    }
    return res;
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
  
  get glbeads() {
    return this.layer.getItems({class: ProfileGlBead, glass: this}); 
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
   */
  remove() {
    //удаляем детей
    this.remove_onlays();

    // стандартные действия по удалению элемента paperjs
    super.remove();
  }


  /**
   * Габаритная площадь заполнения
   * @type {Number}
   */
  get area() {
    return (this.bounds.area / 1e6).round(5);
  }

  /**
   * Площадь заполнения с учетом наклонов-изгибов сегментов
   * @type {Number}
   */
  get form_area() {
    return (this.path.area/1e6).round(5);
  }

  /**
   * Точка внутри пути
   * Возвращает точку, расположенную гарантированно внутри заполнения
   *
   * @type {paper.Point}
   */
  interiorPoint() {
    return this.path.interiorPoint;
  }

  /**
   * Признак прямоугольности
   * @type {Boolean}
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
   * @type paper.Path
   */
  get path() {
    return this._attr.path;
  }
  set path(attr) {
    let {_attr, path, project, children} = this;

    // чистим старый путь
    if(path){
      path.removeSegments();
    }
    else{
      path = _attr.path = new paper.Path({parent: this});
    }
    if(children.tearings.isBelow(path)) {
      path.insertBelow(children.tearings);
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
        const nominate = (i) => {
          prev = i === 0 ? attr[length-1] : attr[i-1];
          curr = attr[i];
          next = i === length-1 ? attr[0] : attr[i+1];
        };
        const {cat: {cnns}, enm: {cnn_types}, job_prm} = $p;
        // получаем эквидистанты сегментов, смещенные на размер соединения
        for (let i = 0; i < length; i++) {
          nominate(i);
          const sub_path = curr.profile.generatrix.get_subpath(curr.b, curr.e, true);
          curr.cnn = cnns.elm_cnn(this, curr.profile, cnn_types.acn.ii, project.elm_cnn(this, curr.profile), false, curr.outer);
          curr.sub_path = sub_path.equidistant((sub_path._reversed ? -curr.profile.d1 : curr.profile.d2) + (curr.cnn ? curr.cnn.size(this, curr.profile) : 20));
        }
        // получаем пересечения
        for (let i = 0; i < length; i++) {
          nominate(i);
          if(!curr.pb) {
            curr.pb = curr.sub_path.intersect_point(prev.sub_path, curr.b, consts.sticking + Math.abs(curr.profile.d2));
            if(prev !== curr && !prev.pe) {
              prev.pe = curr.pb;
            }
          }
          if(!curr.pe) {
            curr.pe = curr.sub_path.intersect_point(next.sub_path, curr.e, consts.sticking + Math.abs(curr.profile.d2));
            if(next !== curr && !next.pb) {
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
            nominate(i);
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
          const segments = curr.sub_path.segments.filter((v, index) => {
            if(index || !path.segments.length || v.hasHandles()) {
              return true;
            }
            return !path.lastSegment.point.is_nearest(v.point, .5);
          });
          path.addSegments(segments);
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
      const {path, layer} = this;
      if(path){
        res = layer.glass_nodes(path);
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
        angle: curr.e.subtract(curr.b).angle.round(1),
        profile: curr.profile,
        next: next.profile,
        angle_next: curr.profile.generatrix.angle_to(next.profile.generatrix, curr.e, true, 0).round(1),
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
      if (b && e && !b.equals(e)) {
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
              const {type} = param;
              if(param.type.digits) {
                params[prop] = parseFloat(val || 0);  
              }
              else {
                params[prop] = typeof val === 'undefined' ? '' : val.valueOf();
              }
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

// свойство `Заполнения отдельно`
$p.md.once('predefined_elmnts_inited', () => {
  const {glass_separately} = $p.job_prm.properties;
  if([1, 2].includes(glass_separately?.inheritance)) {
    Object.defineProperty(Filling.prototype, glass_separately.ref, {
      get() {
        const {ox, elm} = this;
        return glass_separately?.extract_pvalue({ox, cnstr: -elm, elm: this});
      },
      set(v) {
        const {ox, elm} = this;
        let row = ox.params.find({param: glass_separately, cnstr: -elm});
        const row0 = ox.params.find({param: glass_separately, cnstr: 0});
        if(row0?.value == Boolean(v)) {
          if(row) {
            ox.params.del(row);
          }
        }
        else {
          if(!row) {
            row = ox.params.add({param: glass_separately, cnstr: -elm});
          }
          row.value = Boolean(v);
        }
      }
    })
  }
});
