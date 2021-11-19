
module.exports = function ($p, log) {

  const paper = require('paper/dist/paper-core');
  global.paper = paper;
  $p.patchCatUsers && $p.patchCatUsers();


  /**
   * Невизуальный редактор на сервере
   */
  const EditorInvisible = require('./drawer')({$p, paper});
  class Editor extends EditorInvisible {

    constructor(format = 'png') {
      super();
      // создаём экземпляр проекта Scheme
      this.create_scheme(format);
    }


    /**
     * Создаёт проект с заданным типом канваса
     * @param format
     */
    create_scheme(format = 'png') {
      const _canvas = paper.createCanvas(480, 480, format); // собственно, канвас
      _canvas.style.backgroundColor = '#f9fbfa';
      new EditorInvisible.Scheme(_canvas, this, true);
      const {view} = this.project;
      view._element = _canvas;
      if(!view._countItemEvent) {
        view._countItemEvent = function () {};
      }
      return this.project;
    }
  }
  $p.Editor = Editor;
  $p.EditorInvisible = Editor;

  log('paper: required, inited & modified');

};
