import paper from 'paper/dist/paper-core';
import {ToolSelectable} from './ToolSelectable';
import {GeneratrixElement} from '../GeneratrixElement';
import {DimensionLineCustom} from '../DimensionLineCustom';

export class ToolPen extends ToolSelectable {

  constructor() {
    super();
    this.name = 'pen';
    this.profile = $p.dp.builderPen.create({
      bind_generatrix: true,
      bind_node: false,
      grid: 50
    });
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
        this.onActivate('cursor-autodesk');
        this.onZoomFit();
        this.get('line').strokeWidth = 3;
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
    const {shift, space, control, alt} = ev.modifiers;
    const {hitItem, node, line} = this.get('hitItem,node,line');
    const {mode, profile, path} = this;
    if(node && line) {
      node.visible = false;
      line.visible = false;
      if (hitItem) {
        let item = hitItem.item.parent;
        if(space && item?.nearest?.()) {
          item = item.nearest();
        }
        if(item instanceof GeneratrixElement) {
          if (!profile.elm_type.is('size') && (hitItem.type == 'fill' || hitItem.type == 'stroke')) {
            line.removeSegments();
            line.addSegments(hitItem.item.segments.map(({point, handleIn, handleOut}) => ({point, handleIn, handleOut})));
            line.visible = true;
          }
          if(!profile.elm_type.is('size') || hitItem.type === 'segment') {
            node.position = hitItem.point.clone();
            node.visible = true;
          }
        }
      }
    }
    if(mode === 1 && path) {
      let pt = hitItem?.point || ev.point;
      let delta = pt.subtract(path.firstSegment.point);
      if (!shift && !profile.elm_type.is('size')) {
        delta = delta.snapToAngle();
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
    const {hitItem, node} = this.get('hitItem,node,line');
    const {mode, profile, project} = this;
    if(ev.event?.which > 1) {
      project.deselectAll();
      return this.reset(ev);
    }
    if(!mode) {
      if(!node.visible || (profile.elm_type.is('size') && hitItem.type !== 'segment')) {
        return this.reset(ev);
      }
      this.hit1 = hitItem;
      const pt = hitItem?.point || ev.point;
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
      else {
        project.activeLayer.createProfile({
          b: this.path.firstSegment.point,
          e: this.path.lastSegment.point,
        });
      }
      project.redraw();
      this.mousemove(ev);
      return this.reset(ev);
    }
    else if(mode === 2 && this.path?.length) {
      const {parent, hit1, hit2} = this;
      const elm1 = hit1.segment.path.parent;
      const elm2 = hit2.segment.path.parent;
      const p1 = elm1.b.point.equals(hit1.point) ? 'b' : 'e';
      const p2 = elm2.b.point.equals(hit2.point) ? 'b' : 'e';
      new DimensionLineCustom({
        parent: elm1.layer.children.dimensions, 
        project,
        elm1,
        elm2,
        p1,
        p2,
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
        if(space && item?.nearest?.()) {
          item = item.nearest();
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

}
