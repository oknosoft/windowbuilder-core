
import paper from 'paper/dist/paper-core';
import {Scheme} from '../Scheme';
import {History} from './History';
import {StableZoom} from './StableZoom';
import tools from '../tools';

export class EditorInvisible extends paper.PaperScope {
  
  constructor(...attr) {
    super(...attr);
    this.history = new History(this);
    this.stableZoom = new StableZoom(this);
  }
  
  get eve() {
    return this.project?.root?.md;
  }

  /**
   * Создаёт проект с заданным типом канваса
   * @param {HTMLCanvasElement} canvas
   * @param {MetaEngine} root - ссылка на $p
   * @return {Scheme}
   */
  createScheme(canvas, root) {
    const {view, projects, tools} = this;
    if(!canvas) {
      canvas = document.createElement('CANVAS');
      canvas.height = 480;
      canvas.width = 480;
    }
    while(projects.length && !(projects[0] instanceof Scheme)) {
      projects[0].remove();
    }
    const project = projects.length ? projects[0] : new Scheme(canvas, root);
    if(!tools.length) {
      this.refreshTools();
    }
    return project;
  }
  
  refreshTools() {
    while (this.tools.length) {
      this.tools[0].remove();
    }
    for(const Tool of Object.values(tools)) {
      new Tool();
    }
    this.tools[0].activate();
  }
  
  cmd(name, attr) {
    this.history[name](attr);
  }
}