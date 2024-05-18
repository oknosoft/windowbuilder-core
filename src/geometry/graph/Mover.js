import paper from 'paper/dist/paper-core';
import {epsilon} from '../paper/Point';

// извлекаем разрешенные диапазоны из шаблона
let li = 120;
let lmin = 160;
let lmax = 2000;

export class Mover {

  #raw = {};
  
  constructor(owner) {
    Object.assign(this.#raw, {
      owner,
      vertexes: new Map(),
      space: false,
      interactive: false,
    });
  }

  /**
   * 
   * @param {Map} edges
   * @param {Boolean} [impost]
   * @return {GraphEdge}
   */
  edgesProfile(edges, impost, vertex) {
    let iedge;
    for(const [edge, me] of edges) {
      if (!impost && !me.base || impost && me.base) {
        if(!iedge || iedge.length > edge.length) {
          iedge = edge;
        }
        if(!impost) {
          break;
        }
      }
    }
    if(!iedge) {
      for(const [edge, me] of edges) {
        const cpt = vertex.cnnPoints.find((cpt) => impost ? cpt.owner === edge.profile : cpt.profile === edge.profile);
        if(cpt) {
          if(!iedge || iedge.length > edge.length) {
            iedge = edge;
          }
          if(!impost) {
            break;
          }
        }
      }
    }
    return iedge || {};
  }
  
  addRecursive(vertex, edge, level, noDepth, candidates = []) {
    const {owner, vertexes} = this.#raw;
    const move = vertexes.has(vertex) ? 
      vertexes.get(vertex) :
      vertexes.set(vertex, {level, point: vertex.point.clone(), edges: new Map()}).get(vertex);
    if(move.edges.has(edge)) {
      return;
    }
    // узлы с другой стороны ближайшего ребра и с другой стороны профиля
    const {other, profileOther: base} = edge.other(vertex);
    move.edges.set(edge, {other, base});

    const ncandidates = [];
    if(!level) {
      for(const ov of edge.allProfileVertexes()) {
        if(ov !== vertex && !ov.selected && !vertexes.has(ov)) {
          for(const otherEdge of ov.getAllEdges()) {
            if(!candidates.find((c) => c.vertex === ov && c.edge === otherEdge)) {
              ncandidates.push({vertex: ov, edge: otherEdge});
            }
          }
        }
      }
    }
    
    if(level <= 2 && !noDepth) {
      if(!vertex.selected) {
        for(const otherEdge of vertex.getAllEdges()) {
          if(otherEdge !== edge && otherEdge.profile !== edge.profile && !move.edges.has(otherEdge)) {
            if(!candidates.find((c) => c.vertex === vertex && c.edge === otherEdge)) {
              ncandidates.push({vertex, edge: otherEdge});
            }
          }
        }
      }
    }
    
    if(!noDepth) {
      for(const {vertex, edge} of ncandidates) {
        this.addRecursive(vertex, edge, level + 1, false, ncandidates);
      }
    }
  }

  /**
   * @summary Запоминает выделенные узлы и рёбра перед началом сдвига
   * @param {Boolean|String} [interactive]
   */
  prepareMovePoints(interactive) {
    const {owner, vertexes} = this.#raw;
    const edges = owner.skeleton.getAllEdges();
    for(const edge of edges) {
      if(edge.selected || (edge.startVertex.selected && edge.endVertex.selected)) {
        this.addRecursive(edge.startVertex, edge, 0, true);
        this.addRecursive(edge.endVertex, edge, 0, true);
      }
    }
    // опускаем Т ниже в иерархии
    const t = new Map();
    for(const [vertex, move] of this.#raw.vertexes) {
      if(vertex.isT) {
        t.set(vertex, move);
      }
    }
    for(const [vertex, move] of t) {
      this.#raw.vertexes.delete(vertex);
      this.#raw.vertexes.set(vertex, move);
    }
    
    for(const edge of edges) {
      if(edge.selected || (edge.startVertex.selected && edge.endVertex.selected)) {
        continue;
      }
      else if(edge.startVertex.selected) {
        this.addRecursive(edge.startVertex, edge, 0);
      }
      else if(edge.endVertex.selected) {
        this.addRecursive(edge.endVertex, edge, 0);
      }
    }
    // при интерактивных сдвигах, прячем линии профилей
    this.#raw.space = false;
    if(interactive) {
      this.#raw.interactive = true;
      this.#raw.initialCarcass = owner.project.props.carcass; 
      owner.project.props.carcass = true;
      if(interactive === 'space') {
        this.#raw.space = true;
      }
    }
  }

  /**
   * @summary При завершении или отмене сдвига
   */
  cancelMovePoints() {
    const {owner, vertexes, initialCarcass} = this.#raw;
    vertexes.clear();
    owner.children.visualization.ribs.clear();
    owner.project.props.carcass = initialCarcass;
    this.#raw.interactive = false;
  }

  /**
   * @summary Корректирует delta допустимой величиной сдвига для каждого узла
   * @param {paper.Point} start
   * @param {paper.Point} delta
   */
  tryMovePoints(start, delta) {

    const cmax = this.#raw.owner.profiles.length > 100 ? 40000 : lmax;
    const {vertexes} = this.#raw;
    // сначала, для узлов нулевого уровня
    for(const [vertex, move] of vertexes) {
      if(!move.startPoint) {
        move.startPoint = move.point;
      }
      if(move.level === 0) {
        const test = move.startPoint.add(delta);
        if(vertex.isT) {
          this.tryMoveImpost({vertex, move, test, delta});
        }
        else {
          // узел угла не должен порождать длины < lmin и > cmax
          for(const [edge, me] of move.edges) {
            const pos = edge.profile.generatrix.directedPosition({
              base: me.other.point,
              initial: move.startPoint,
              test,
              free: true,
              min: lmin,
              max: cmax,
            });
            if(pos?.delta?.length > epsilon) {
              // на текущем профиле перевёртыш - ищем точку
              if(pos.stop) {
                const pos = edge.profile.generatrix.directedMinPosition({
                  base: me.other.point,
                  initial: move.startPoint,
                  min: lmin,
                });
                move.delta = pos.delta;
                break;
              }
              else if (!move.delta || move.delta.length > pos.delta.length) {
                move.delta = pos.delta;
              }
            }
          }
        }
      }
    }
    // для узлов зависимости c ведомым T
    for(const [vertex, move] of vertexes) {
      if(move.level && vertex.isT) {
        // ищем точку на будущей образующей
        const test = move.startPoint.clone();
        this.tryMoveImpost({vertex, move, test, delta});
      }
    }
    let reset;
    for(const [vertex, move] of vertexes) {
      if(move.reset) {
        reset = true;
        break;
      }
    }
    if(!reset) {
      for(const [vertex, move] of vertexes) {
        if(move.delta?.length) {
          move.point = move.startPoint.add(move.delta);
          move.delta = null;
        }
        else if(!move.point.equals(move.startPoint)) {
          move.point = move.startPoint;
        }
      }
    }
    this.drawMoveRibs();
  }

  tryMoveImpost({vertex, move, test, delta}) {
    // узел импоста не должен покидать родительский профиль и приближаться к углам ближе li
    const cmax = this.#raw.owner.profiles.length > 100 ? 40000 : lmax;     
    const {profile} = this.edgesProfile(move.edges, false, vertex);
    if(profile) {
      let gen = profile.generatrix.clone({insert: false, deep: false}), base1, base2;
      for(const [edge, me] of move.edges) {
        if(edge.profile === profile) {
          if(edge.startVertex === vertex) {
            base1 = edge.endVertex.point;
          }
          else if(edge.endVertex === vertex) {
            base2 = edge.startVertex.point;
          }
        }
      }
      if(profile.selected || move.level) {
        const m1 = this.#raw.vertexes.get(profile.b.vertex);
        const m2 = this.#raw.vertexes.get(profile.e.vertex);
        const p1 = m1?.delta?.length ? profile.b.point.add(m1.delta) : profile.b.point;
        const p2 = m2?.delta?.length ? profile.e.point.add(m2.delta) : profile.e.point;
        gen = new paper.Path({insert: false, segments: [p1, p2]});
      }
      // если импост в данной вершине только один, он должен двигаться вдоль своей образующей
      let pos;
      if(move.edges.size <= 4 && (profile.selected || move.level)) {
        
        const iedge = this.edgesProfile(move.edges, true, vertex);
        const segments = move.startPoint.getDistance(iedge.startVertex.point) > move.startPoint.getDistance(iedge.endVertex.point) ?
          [iedge.startVertex.point, iedge.endVertex.point] : [iedge.endVertex.point, iedge.startVertex.point];
        if(this.#raw.space && profile.generatrix.isCollinear(delta)) {
          const l0 = profile.generatrix.length;
          const o0 = profile.generatrix.getOffsetOf(move.startPoint);
          const l1 = gen.length;
          const o1 = o0 * l1 / l0;
          pos = {delta: gen.getPointAt(o1).subtract(move.startPoint)};
        }
        else {
          pos = gen.joinedDirectedPosition({
            test: new paper.Path({insert: false, segments}),
            initial: move.startPoint,
            min: li,
            max: cmax,
          });
        }
      }
      else {
        if(base1) {
          base1 = gen.getNearestPoint(base1);
        }
        else {
          base1 = gen.firstSegment.point;
        }
        if(base2) {
          base2 = gen.getNearestPoint(base2);
        }
        else {
          base2 = gen.lastSegment.point;
        }
        if(gen.getOffsetOf(base1) > gen.getOffsetOf(base2)) {
          [base1, base2] = [base2, base1];
        }
        pos = gen.joinedPosition({
          base1,
          base2,
          initial: move.startPoint,
          test,
          min: li,
        });
      }
      if(pos?.reset) {
        move.reset = true;
        delete move.delta;
      }
      else {
        delete move.reset;
        if(pos?.delta?.length > epsilon && (!move.delta || move.delta.length > pos.delta.length)) {
          move.delta = pos.delta;
        }
      }
      
    }
  }

  drawMoveRibs() {
    const {owner, interactive} = this.#raw;
    if(interactive) {
      const {ribs} = owner.children.visualization;
      ribs.clear();
      const rects = [];
      const segms = new Set();
      const selected = new Map();
      const circle = (point) => {
        if(!rects.some((pt) => pt.isNearest(point))) {
          rects.push(point.clone());
          new paper.Path.Circle({
            parent: ribs,
            fillColor: 'blue',
            center: point,
            strokeScaling: false,
            radius: 20,
          });
        }
      };
      for(const [vertex, move] of this.#raw.vertexes) {
        for(const [edge, me] of move.edges) {
          if(!move.level && move.point.length) {
            if(me.other.selected) {
              if(selected.has(edge.profile)) {
                selected.get(edge.profile).push(move.point);
              }
              else {
                selected.set(edge.profile, [move.point]);
              }
            }
            else {
              if(!segms.has(edge.profile)) {
                segms.add(edge.profile);
                const start = edge.otherProfileVertex(vertex)?.point || me.other.point;
                new paper.Path({
                  parent: ribs,
                  strokeColor: 'blue',
                  strokeWidth: 1,
                  strokeScaling: false,
                  dashArray: [4, 4],
                  guide: true,
                  segments: [start, move.point],
                });
              }
            }
            circle(move.point);
            for(const tv of edge.allProfileVertexes()) {
              if(tv !== vertex) {
                const tm = this.#raw.vertexes.get(tv);
                circle(tm.point);
                const iedge = this.edgesProfile(tm.edges, true, vertex);
                if(!segms.has(iedge.profile)) {
                  segms.add(iedge.profile);
                  const sv = iedge.otherProfileVertex(tv);
                  if(sv) {
                    const sm = this.#raw.vertexes.get(sv);
                    new paper.Path({
                      parent: ribs,
                      strokeColor: 'blue',
                      strokeWidth: 1,
                      strokeScaling: false,
                      dashArray: [4, 4],
                      guide: true,
                      segments: [sm?.point || sv.point, tm.point],
                    });
                  }
                }
              }
            }
          }
        }

      }
      for(const [profile, points] of selected) {
        if(points.length === 2) {
          new paper.Path({
            parent: ribs,
            strokeColor: 'blue',
            strokeWidth: 2,
            strokeScaling: false,
            dashArray: [4, 4],
            guide: true,
            segments: [points[0], points[1]],
          });
        }
      }
    }
  }
  
  applyMovePoints(delta) {
    let moved;
    for(const [vertex, move] of this.#raw.vertexes) {
      if(move.point && !vertex.point.isNearest(move.point)) {
        moved = true;
        if(delta instanceof paper.Point) {
          const dt = move.point.subtract(move.startPoint);
          if(dt.length < delta.length) {
            delta.x = dt.x; 
            delta.y = dt.y; 
          }
        }
        else {
          vertex.point = move.point;
        }
      }
    }    
    this.cancelMovePoints();
    return moved;
  }
  
  setBounds({width, height, direction, space}) {
    const {bounds} = this.#raw.owner;
    // запомним выделенные элементы и узлы
    ;
    if(width && width !== bounds.width) {
      // снимаем выделение всего

      // выделяем край
      
      // формируем vertexes
      this.prepareMovePoints(space ? 'space' : false);
    }
    if(height && height !== bounds.height) {
      // снимаем выделение всего

      // выделяем край

      // формируем vertexes
      this.prepareMovePoints(space ? 'space' : false);
    }
  }
}
