
import paper from 'paper/dist/paper-core';

class EditorInvisible extends paper.PaperScope {

  constructor(...attr) {

    super(...attr);

    // /**
    //  * fake-undo
    //  * @private
    //  */
    // this._undo = new EditorInvisible.History(this);
    //
    // /**
    //  * Собственный излучатель событий для уменьшения утечек памяти
    //  */
    // this.eve = new (Object.getPrototypeOf($p.md.constructor))();
    //
    // consts.tune_paper(this);
  }

  /**
   * Возвращает элемент по номеру
   * @param num
   */
  elm(num) {
    return this.project.getItem({class: BuilderElement, elm: num});
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


}

