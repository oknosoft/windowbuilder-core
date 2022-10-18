
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
