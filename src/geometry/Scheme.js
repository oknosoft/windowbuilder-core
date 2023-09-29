
import paper from 'paper/dist/paper-core';

class Scheme extends paper.Project {

  /**
   * @summary Вписывает канвас в указанные размеры
   * @desc Используется при создании проекта и при изменении размеров области редактирования
   *
   * @param w {Number} - ширина, в которую будет вписан канвас
   * @param h {Number} - высота, в которую будет вписан канвас
   */
  resizeCanvas(w, h) {
    const {viewSize} = this.view;
    viewSize.width = w;
    viewSize.height = h;
  }
  
}

export default Scheme;
