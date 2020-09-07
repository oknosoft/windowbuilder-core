
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
