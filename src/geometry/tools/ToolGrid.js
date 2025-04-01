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
        this.project.props.loading = false;
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
    const xMap = new Map();
    const profiles = [];
    if(byX.length) {
      
      // стойки      
      const left = align_by_x.is('left');
      const sign = left ? 1 : -1;
      let x = 0;
      for(let i = 0; i <= byX.length; i++) {
        if(i) {
          x += sign * byX[i - 1].sz;
        }
        let attr;
        if(left) {
          attr = i ? {b: [x, -h], e: [x, 0]} : {e: [x, -h], b: [x, 0]};
        }
        else {
          attr = i ? {b: [x, 0], e: [x, -h]} : {e: [x, 0], b: [x, -h]};
        }
        const profile = activeLayer.createProfile(attr);
        profiles.push(profile);
        xMap.set(x, profile);

        if(i) {
          new DimensionLine({
            project,
            owner: activeLayer,
            parent: project.dimensions,
            elm1: left ? profiles[i] : profiles[i - 1],
            elm2: left ? profiles[i - 1] : profiles[i],
            p1: left ? 'e' : (i > 1 ? 'b' : 'e'),
            p2: left ? (i > 1 ? 'e' : 'b') : 'b',
            pos: 'bottom',
            offset: -260,
          });
        }
      }
      if(profiles.length > 2) {
        new DimensionLine({
          project,
          owner: activeLayer,
          parent: project.dimensions,
          elm1: left ? profiles[profiles.length - 1] : profiles[0],
          elm2: left ? profiles[0] : profiles[profiles.length - 1],
          p1: 'e',
          p2: 'b',
          pos: 'bottom',
          offset: -460,
        });
      }

      // ригели
      const byY = sizes.filter(row => row.elm === 0);
      const yMap = new Map();
      if(byY.length) {
        const bottom = align_by_y.is('bottom');
        x = 0;
        for(let i = 1; i <= byX.length; i++) {
          // находим примыкающие стойки и сообщаем их узлам
          const cnns = {b: {profile: xMap.get(x)}};
          x += sign * byX[i - 1].sz;
          cnns.e = {profile: xMap.get(x)};

          let y = 0;
          let prevCy = null;
          for(let j = 0; j < byY.length; j++) {
            y += (byY[j].sz || 0);
            const cy = bottom ? -y : (-h + y);
            if(cy > 0 || cy < -h) {
              continue;
            }
            if(prevCy === null) {
              prevCy = cy;
            }
            else {
              if(prevCy === cy) {
                continue;
              }
              prevCy = cy;
            }
            let profile;
            if(bottom && cy > -100) {
              profile = activeLayer.createProfile({
                b: [cnns.e.profile.b.point.x, cy],
                e: [cnns.b.profile.b.point.x, cy],
                cnns: {b: cnns.e, e: cnns.b}
              });
            }
            else {
              profile = activeLayer.createProfile({
                b: [cnns.b.profile.b.point.x, cy],
                e: [cnns.e.profile.b.point.x, cy],
                cnns
              });
            }
            
            profiles.push(profile);
            if(left && i === byX.length || !left && i === 1) {
              yMap.set(cy, profile);
            }
          }
        }
        
        let prev;
        const aX = Array.from(xMap);
        const aY = Array.from(yMap);
        aY.forEach(([y, profile], index) => {
          if(bottom) {
            if(index) {
              prev = {profile: aY[index - 1][1]};
              prev.pt = prev.profile.b.point.x > prev.profile.e.point.x ? 'b' : 'e';
            }
            else {
              if(y) {
                prev = left ? {pt: 'e', profile: aX[aX.length - 1][1]} : {pt: 'e', profile: aX[0][1]};
              }
              else {
                return;
              }
            }
            new DimensionLine({
              project,
              owner: activeLayer,
              parent: project.dimensions,
              elm1: prev.profile,
              elm2: profile,
              p1: prev.pt,
              p2: profile.b.point.x > profile.e.point.x ? 'b' : 'e',
              pos: 'right',
              offset: -220,
            });
          }
          else {
            if(index) {
              prev = {profile: aY[index - 1][1]};
              prev.pt = prev.profile.b.point.x > prev.profile.e.point.x ? 'b' : 'e';
            }
            else {
              if(y) {
                prev = left ? {pt: 'b', profile: aX[aX.length - 1][1]} : {pt: 'b', profile: aX[0][1]};
              }
              else {
                return;
              }
            }
            new DimensionLine({
              project,
              owner: activeLayer,
              parent: project.dimensions,
              elm1: prev.profile,
              elm2: profile,
              p1: prev.pt,
              p2: profile.b.point.x > profile.e.point.x ? 'b' : 'e',
              pos: 'right',
              offset: -220,
            });
          }
        });
        if(aY[aY.length - 1][0] < h) {
          if(bottom) {
            const prev = left ? {profile: aX[aX.length - 1][1]} : {profile: aX[0][1]};
            const profile = aY[aY.length - 1][1];
            new DimensionLine({
              project,
              owner: activeLayer,
              parent: project.dimensions,
              elm1: prev.profile,
              elm2: profile,
              p1: 'b',
              p2: profile.b.point.x > profile.e.point.x ? 'b' : 'e',
              pos: 'right',
              offset: -220,
            });
          }
          else {
            const prev = aY[aY.length - 1][1];
            const profile = left ? aX[aX.length - 1][1] : aX[0][1];
            new DimensionLine({
              project,
              owner: activeLayer,
              parent: project.dimensions,
              elm1: prev,
              elm2: profile,
              p1: prev.b.point.x > prev.e.point.x ? 'b' : 'e',
              p2: 'e',
              pos: 'right',
              offset: -220,
            });
          }
        }
      }
      activeLayer.skeleton.addProfiles(profiles);
      project.redraw();
      project.zoomFit();
      project.redraw();
    }
    
  }
}
