import paper from 'paper/dist/paper-core';
import {ToolElement} from './ToolElement';
import {DimensionLine} from '../DimensionLine';

const {Point} = paper;

export class ToolGrid extends ToolElement {

  constructor() {
    super();
    Object.assign(this, {
      name: 'grid',
      dp: $p.dp.builderGrid.create({
        split: 'ДелениеГоризонтальных',
        w: 5000,
        h: 5000,
        align_by_x: 'left',
        align_by_y: 'bottom',
      }),
    });
    this.on({
      activate() {
        let {workLayer} = this.project;
        while (workLayer.layer) {
          workLayer = workLayer.layer;
        }
        workLayer.activate();
        this.onActivate('cursor-lay-impost');
        this.project.redraw();
      },
      
      deactivate() {
      },

      mouseup: this.mouseup,
      
      keydown: this.keydown,
    });
  }

  mouseup(event) {
    this.createProfiles();
  }

  keydown(event) {
    const {project: {contours, activeLayer}} = this;
    const rootLayer = activeLayer && !activeLayer.layer ? activeLayer : contours[0];
    switch (event.key) {
      case 'left':
        rootLayer.move(new Point(-10, 0));
        break;
      case 'right':
        rootLayer.move(new Point(10, 0));
        break;
      case 'up':
        rootLayer.move(new Point(0, -10));
        break;
      case 'down':
        rootLayer.move(new Point(0, 10));
        break;
    }
  }

  createProfiles() {
    const {project, dp: {h, align_by_x, align_by_y, sizes}} = this;
    const {activeLayer} = project;
    activeLayer.clear(true);
    if(!h) {
      return;
    }
    // стойки
    const byX = sizes.filter(row => row.elm === 1 && row.sz > 0);
    if(byX.length) {
      const profiles = [];
      // стойки
      const xMap = new Map();
      let x = 0;
      for(let i = 0; i <= byX.length; i++) {
        if(i) {
          x += byX[i - 1].sz;
        }
        const attr = i ? {b: [x, h], e: [x, 0]} : {e: [x, h], b: [x, 0]};
        const profile = activeLayer.createProfile(attr);
        profiles.push(profile);
        xMap.set(x, profile);

        if(i) {
          new DimensionLine({
            project,
            owner: activeLayer,
            parent: project.dimensions,
            elm1: profiles[i],
            elm2: profiles[i - 1],
            p1: 'e',
            p2: i ? 'e' : 'b',
            pos: 'bottom',
            offset: -280,
          });
        }
      }
      activeLayer.skeleton.addProfiles(profiles);
      if(profiles.length > 2) {
        new DimensionLine({
          project,
          owner: activeLayer,
          parent: project.dimensions,
          elm1: profiles[profiles.length - 1],
          elm2: profiles[0],
          p1: 'e',
          p2: 'b',
          pos: 'bottom',
          offset: -500,
        });
      }
      profiles.length = 0;

      project.redraw();
      project.zoomFit();
    }
  }
}
