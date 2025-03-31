import paper from 'paper/dist/paper-core';
import {ToolSelectable} from './ToolSelectable';
import {GeneratrixElement} from '../GeneratrixElement';
import {DimensionLineCustom} from '../DimensionLineCustom';
import {ContourPortal} from '../ContourPortal';
import {ProfileAdjoining} from '../ProfileAdjoining';

export class ToolPen extends ToolSelectable {

  constructor() {
    super();
    this.name = 'pen';
    const dp = $p.dp.builderPen || $p.dp.builder_pen;
    this.profile = dp.create({elm_type: 'rama', grid: 50});
    Object.assign(this, {
      mode: 0,
      path: null,
      hit1: null,
      hit2: null,
      callout1: null,
      callout2: null,
    })
    this.on({
      activate: () => {
        this.project.workLayer;
        this.onActivate('cursor-autodesk');
        this.onZoomFit();
        this.get('line').strokeWidth = 3;
      },
      deactivate() {
        this.reset();
      },
      mousedown: this.mousedown,
      // mouseup: this.mouseup,
      // mousedrag: this.mousedrag,
      mousemove: this.mousemove,
      keydown: this.keydown,
    });
  }

  mousemove(ev) {
    this.hitTest(ev);
    const {mode, profile, path, project} = this;
    
    if(profile.mode === 1 && profile.elm_type.is('adjoining')) {
      return this.drawAdjoining();
    }
    
    const {shift, space, control, alt} = ev.modifiers;
    const {hitItem, node, line, text1, text2} = this.get('hitItem,node,line,text1,text2');
    const {gridStep, snap, snapAngle} = project.props;
    if(node && line) {
      this.hideDecor();
      if (hitItem) {
        let item = hitItem.item.parent;
        if(space && item?.nearest) {
          item = item.nearest;
        }
        if(item instanceof GeneratrixElement) {
          if (!profile.elm_type.is('size') && (hitItem.type == 'fill' || hitItem.type == 'stroke') && Array.isArray(hitItem.item.segments)) {
            line.removeSegments();
            line.addSegments(hitItem.item.segments.map(({point, handleIn, handleOut}) => ({point, handleIn, handleOut})));
            line.visible = true;
          }
          if(hitItem.point && (!profile.elm_type.is('size') || hitItem.type === 'segment')) {
            node.position = hitItem.point.clone();
            node.visible = true;
          }
        }
        else if(hitItem.type == 'bind') {
          node.position = hitItem.point.clone();
          node.visible = true;
          line.removeSegments();
          line.addSegments(hitItem.segments);
          line.visible = true;
        }
      }
    }
    if(mode === 1 && path) {
      let pt = hitItem?.point || ev.point;
      let delta = pt.subtract(path.firstSegment.point);
      if (!hitItem?.point && !shift && !profile.elm_type.is('size')) {
        if(snap === 'angle') {
          delta = delta.snapToAngle(Math.PI*snapAngle/180);
        }
        else if(snap === 'grid') {
          delta = delta.snap(gridStep);
        }        
        pt = path.firstSegment.point.add(delta);
      }
      if(delta.length > 10) {
        if(hitItem?.segment) {
          pt = hitItem.segment.point;
        }
        else if(hitItem?.location) {
          pt = hitItem.location.path.getNearestPoint(pt);
        }
        path.lastSegment.point = pt;
      }
      if(path.length > 200) {
        const {length, firstSegment} = path;
        const loc = path.getLocationAt(length / 2);
        const {quadrant, angle} = loc.tangent
        text1.position = loc.point.add(loc.normal.multiply(text1.fontSize));
        text1.content = length.round();
        text1.visible = true;

        text2.position = firstSegment.point.add(loc.normal.multiply(text1.fontSize));
        text2.content = `${angle.round()}°`;
        text2.visible = true;
        if([1,2].includes(quadrant)) {
          text1.justification = 'right';
          text2.justification = 'right';
        }
        else {
          text1.justification = 'left';
          text2.justification = 'left';
        }
      }
    }
    else if(mode === 2 && path) {
      const {callout1, callout2, hit1, hit2} = this;
      const b = this.hit1.point;
      const e = this.hit2.point;
      const rect = new paper.Rectangle(b, e);
      const gen = new paper.Path({insert: false, segments: [b, e]});
      const {rib, pos, parallel} = rect.nearestRib(ev.point);
      this.rectPos = pos;
      this.swap = false;
      this.sign = gen.pointPos(ev.point);
      const pt = gen.getNearestPoint(ev.point);
      const line = path;
      if(rect.contains(ev.point) || !rib) {
        this.rect_pos = 'free';
        const delta = pt.getDistance(ev.point);
        const normal = gen.getNormalAt(0).multiply(delta * this.sign);
        callout1.lastSegment.point = b.add(normal);
        callout2.lastSegment.point = e.add(normal);
        line.firstSegment.point = b.add(normal);
        line.lastSegment.point = e.add(normal);
      }
      else {
        const pp2 = parallel.point.add(parallel.vector);
        line.firstSegment.point = parallel.point;
        line.lastSegment.point = pp2;
        if(b.getDistance(parallel.point) > b.getDistance(pp2)) {
          this.swap = true;
          callout1.lastSegment.point = pp2;
          callout2.lastSegment.point = parallel.point;
        }
        else {
          callout1.lastSegment.point = parallel.point;
          callout2.lastSegment.point = pp2;
        }
      }
      this.sign = gen.pointPos(line.interiorPoint);
    }
  }

  mousedown(ev) {
    const {hitItem, node, line} = this.get('hitItem,node,line');
    const {mode, profile, project} = this;
    const {gridStep} = project.props;
    if(ev.event?.which > 1) {
      project.deselectAll();
      return this.reset(ev);
    }
    if(profile.mode === 1 && profile.elm_type.is('adjoining')) {
      if(line?.length) {
        project.rootLayer.createProfile({
          b: line.firstSegment.point,
          e: line.lastSegment.point,
          elmType: profile.elm_type,
        });
      }
      return;
    }
    if(!mode) {
      if(profile.elm_type.is('rama') || 
        profile.elm_type.is('impost') || 
        profile.elm_type.is('linking') || 
        profile.elm_type.is('line') || 
        profile.elm_type.is('cut')) {
        
      }
      else if(!node.visible || (profile.elm_type.is('size') && hitItem.type !== 'segment')) {
        return this.reset(ev);
      }
      const pt = hitItem?.point || ev.point.snap(gridStep);
      this.hit1 = {...hitItem, point: pt};
      this.path = new paper.Path({
        segments: [pt.clone(), pt.clone()],
        parent: this.parent,
        guide: true,
        strokeColor: 'grey',
        strokeWidth: 3,
        strokeScaling: false,
        strokeCap: 'round',
      });
      this.mode = 1;
    }
    else if(mode === 1 && this.path?.length) {
      if(profile.elm_type.is('size')) {
        this.hit2 = hitItem;
        const normal = this.path.getNormalAt(0).multiply(10);
        this.callout1 = new paper.Path({
          parent: this.parent,
          segments: [this.hit1.point, this.hit1.point.add(normal)],
          strokeColor: 'black',
          guide: true,
        });
        this.callout2 = new paper.Path({
          parent: this.parent,
          segments: [this.hit2.point, this.hit2.point.add(normal)],
          strokeColor: 'black',
          guide: true,
        });
        this.path.firstSegment.point = this.callout1.lastSegment.point;
        this.path.lastSegment.point = this.callout2.lastSegment.point;
        this.mode = 2;
        return;
      }
      else if(!(project.activeLayer instanceof ContourPortal) && (profile.elm_type.is('linking') ||
          profile.elm_type.is('cut') || profile.elm_type.is('line') || profile.elm_type.is('adjoining'))) {
        project.rootLayer.createProfile({
          b: this.path.firstSegment.point,
          e: this.path.lastSegment.point,
          elmType: profile.elm_type,
        });
      }
      else {
        project.activeLayer.createProfile({
          b: this.path.firstSegment.point,
          e: this.path.lastSegment.point,
          elmType: profile.elm_type,
        });
      }
      project.redraw();
      this.mousemove(ev);
      return this.reset(ev);
    }
    else if(mode === 2 && this.path?.length) {
      const {parent, hit1, hit2, callout1, callout2} = this;
      const elm1 = hit1.segment.path.parent;
      const elm2 = hit2.segment.path.parent;
      const p1 = elm1.b.point.equals(hit1.point) ? 'b' : 'e';
      const p2 = elm2.b.point.equals(hit2.point) ? 'b' : 'e';
      const nearest = elm1.layer.bounds.nearestRib(this.path.interiorPoint);
      new DimensionLineCustom({
        owner: elm1.layer,
        parent: project.dimensions,
        project,
        elm1,
        elm2,
        p1,
        p2,
        offset: -(callout1.length + callout2.length)/2,
        pos: nearest?.pos,
      });
      project.redraw();
      return this.reset(ev);
    }
  }

  keydown(ev) {
    const {event: {code, target}, modifiers: {space}} = ev;
    if(code === 'Delete') {
      const {hitItem, node, line} = this.get('hitItem,node,line');
      if(line.visible) {
        let item = hitItem.item.parent;
        if(space && item?.nearest) {
          item = item.nearest;
        }
        if(item instanceof GeneratrixElement) {
          try{
            item.remove();
          }
          catch (err) {
            alert(err.message);
          }
          this.project.redraw();
          return this.mousemove(ev);
        }
      }
    }
    else if(code === 'Escape') {
      return this.reset(ev);
    }
    
  }
  
  reset(ev) {
    this.hideDecor();
    this.mode = 0;
    this.path?.remove?.();
    this.callout1?.remove?.();
    this.callout2?.remove?.();
    this.path = null;
    this.hit1 = null;
    this.hit2 = null;
    this.callout1 = null;
    this.callout2 = null;
    ev?.stop?.();
  }

  hitTestAdjoining(ev) {
    const {hitItem, node, line} = this.get('hitItem,node,line');
    this.addlHit = null;
    // для профиля, определяем внешнюю или внутреннюю сторону и ближайшее примыкание
    if(hitItem?.item?.parent?.is('GeneratrixElement.Profile')){
      const hit = {
        point: hitItem.point,
        profile: hitItem.item.parent
      };

      // выясним, с какой стороны примыкает профиль
      const {inner, outer} = hit.profile;
      if(inner.getNearestPoint(hit.point).getDistance(hit.point, true) < outer.getNearestPoint(hit.point).getDistance(hit.point, true)) {
        hit.side = 'inner';
      }
      else {
        hit.side = 'outer';
      }

      // бежим по всем заполнениям и находим ребро
      hit.profile.layer.fillings.some((glass) => {
        return glass.ribs.some((rib, index) => {
          if(rib.edge.profile === hit.profile && 
              hit.profile.generatrix.getSubPath(rib.edge.startVertex.point, rib.edge.endVertex.point)?.getNearestPoint(hit.point).isNearest(hit.point, true)) {
            if(hit.side == 'outer' && rib.edge.isOuter() || hit.side == 'inner' && !rib.edge.isOuter()) {
              hit.glass = glass;
              return true;
            }
          }
        });
      });

      if(!hit.glass){
        const imposts = hit.profile.imposts[hit.side];
        const {generatrix} = hit.profile;
        const offset = generatrix.getOffsetOf(generatrix.getNearestPoint(hit.point));
        const fin = imposts.length - 1;
        if(fin < 0) {
          hit.b = {elm: hit.profile, point: hit.side === 'inner' ? 'b' : 'e'};
          hit.e = {elm: hit.profile, point: hit.side === 'inner' ? 'e' : 'b'};
        }
        else if(fin === 0) {
          const impost = imposts[0];
          const ioffset = generatrix.getOffsetOf(impost.point);
          if(hit.side === 'inner' && ioffset > offset) {
            hit.b = {elm: hit.profile, point: 'b'};
            hit.e = {elm: impost.profile, point: impost.profile.b.point.isNearest(impost.point) ? 'b' : 'e'};
          }
          else if(hit.side === 'outer' && ioffset > offset) {
            hit.b = {elm: impost.profile, point: impost.profile.b.point.isNearest(impost.point) ? 'b' : 'e'};
            hit.e = {elm: hit.profile, point: 'b'};
          }
          else if(hit.side === 'inner' && ioffset < offset) {
            hit.b = {elm: impost.profile, point: impost.profile.b.point.isNearest(impost.point) ? 'b' : 'e'};
            hit.e = {elm: hit.profile, point: 'e'};
          }
          else if(hit.side === 'outer' && ioffset < offset) {
            hit.b = {elm: hit.profile, point: 'e'};
            hit.e = {elm: impost.profile, point: impost.profile.b.point.isNearest(impost.point) ? 'b' : 'e'};
          }
        }
        else {
          let i0 = imposts[0];
          let ifin = imposts[fin];
          let offset0 = generatrix.getOffsetOf(i0.point);
          let offsetfin = generatrix.getOffsetOf(ifin.point);
          if(offset0 > offsetfin) {
            [i0, ifin] = [ifin, i0];
            [offset0, offsetfin] = [offset0, offsetfin];
          }
          if(hit.side === 'inner' && offset0 > offset) {
            hit.b = {elm: hit.profile, point: 'b'};
            hit.e = {elm: i0.profile, point: i0.profile.b.point.isNearest(i0.point) ? 'b' : 'e'};
          }
          else if(hit.side === 'outer' && offset0 > offset) {
            hit.b = {elm: i0.profile, point: i0.profile.b.point.isNearest(i0.point) ? 'b' : 'e'};
            hit.e = {elm: hit.profile, point: 'b'};
          }
          else if(hit.side === 'inner' && offsetfin < offset) {
            hit.b = {elm: ifin.profile, point: ifin.profile.b.point.isNearest(ifin.point) ? 'b' : 'e'};
            hit.e = {elm: hit.profile, point: 'e'};
          }
          else if(hit.side === 'outer' && offsetfin < offset) {
            hit.b = {elm: hit.profile, point: 'e'};
            hit.e = {elm: ifin.profile, point: ifin.profile.b.point.isNearest(ifin.point) ? 'b' : 'e'};
          }
        }

        this.addlHit = hit;
        this.canvasCursor('cursor-pen-adjust');
      }
    }
    else {
      this.canvasCursor('cursor-autodesk');
    }
  }
  
  hitTest(ev) {
    super.hitTest(ev);
    const {hitItem, node, line} = this.get('hitItem,node,line');
    if(this.profile.mode === 1 && this.profile.elm_type.is('adjoining')) {
      return this.hitTestAdjoining(ev);
    }
    if(!hitItem) {
      const {point} = ev;
      const {mode, path, project: {activeLayer, props}} = this;
      if(mode === 1 && path?.length > props.gridStep * 2) {
        const {bounds} = path;
        const dir = bounds.width > bounds.height ? 'x' : 'y';
        for(const vertex of activeLayer.skeleton.getAllVertices()) {
          if(Math.abs(vertex.point[dir] - point[dir]) < props.gridStep * 1.2) {
            const odir = dir === 'x' ? 'y' : 'x';
            const start = path.firstSegment.point;
            const other = Math.abs(start[odir] - point[odir]) < props.gridStep * 1.2 ? start[odir] : point[odir];
            this.set({hitItem: {
                item: 'virtual',
                type: 'bind',
                segments: [
                  {[dir]: vertex.point[dir], [odir]: vertex.point[odir] - 100},
                  {[dir]: vertex.point[dir], [odir]: vertex.point[odir] + 100}],
                point: Object.assign(point.clone(), {[dir]: vertex.point[dir], [odir]: other}),
              }});
          }
        }
      }
    }
  }

  drawAdjoining() {
    let line = this.get('line');
    this.hideDecor();
    line?.removeSegments();
    for(const hatch of line?.hatching || []) {
      hatch.remove();
    }
    if(this.addlHit) {
      const {b, e, profile, side} = this.addlHit;
      if(!line) {
        line = new paper.Path({
          parent: this.parent,
          guide: true,
          strokeColor: 'grey',
          strokeWidth: 3,
          strokeScaling: false,
          strokeCap: 'round',
        });
        this.set({line});
      }
      // рисуем внутреннюю часть прототипа пути доборного профиля
      if(b && e) {
        const generatrix = profile[side].getSubPath(e.elm[e.point].point, b.elm[b.point].point);
        line.removeSegments();
        line.addSegments(generatrix.segments);
        line.visible = true;
        line.hatching = ProfileAdjoining.drawHatching({parent: line.parent, generatrix});
      }
    }
  }

}
