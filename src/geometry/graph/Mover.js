import paper from 'paper/dist/paper-core';

// извлекаем разрешенные диапазоны из шаблона
let li = 140;
let lmin = 200;
let lmax = 2000;

export class Mover {

  #raw = {};
  
  constructor(owner) {
    Object.assign(this.#raw, {
      owner,
      vertexes: new Map(),
    });
  }
  
  addRecursive(vertex, edge, level, noDepth) {
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
    
    if(level > 2 || noDepth) {
      return;
    }
    const candidates = [];
    if(!vertex.selected) {
      for(const otherEdge of vertex.getAllEdges()) {
        if(otherEdge !== edge && otherEdge.profile !== edge.profile && !move.edges.has(otherEdge)) {
          candidates.push({vertex, edge: otherEdge});
        }
      }
    }
    if(!other.selected && !vertexes.has(other)) {
      for(const otherEdge of other.getAllEdges()) {
        if(otherEdge !== edge && otherEdge.profile !== edge.profile && !move.edges.has(otherEdge)) {
          candidates.push({vertex: other, edge: otherEdge});
        }
      }
    }
    for(const {vertex, edge} of candidates) {
      this.addRecursive(vertex, edge, level + 1);
    }    
  }

  /**
   * @summary Запоминает выделенные узлы и рёбра перед началом сдвига
   * @param {Boolean} [interactive]
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
    if(interactive) {
      this.#raw.initialCarcass = owner.project.props.carcass; 
      owner.project.props.carcass = true;
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
  }

  /**
   * @summary Корректирует delta допустимой величиной сдвига для каждого узла
   * @param {paper.Point} start
   * @param {paper.Point} delta
   * @param {Boolean} [interactive]
   */
  tryMovePoints(start, delta, interactive) {

    // сначала, для узлов нулевого уровня
    for(const [vertex, move] of this.#raw.vertexes) {
      if(!move.startPoint) {
        move.startPoint = move.point;
      }
      if(move.level === 0) {
        const test = move.startPoint.add(delta);
        if(vertex.isT) {
          this.tryMoveImpost({vertex, move, test});
        }
        else {
          // узел угла не должен порождать длины < lmin и > lmax
          for(const [edge, me] of move.edges) {
            const pos = edge.profile.generatrix.directedPosition({
              base: me.other.point,
              initial: move.startPoint,
              test,
              free: true,
              min: lmin,
              max: lmax,
            });
            if(pos.delta.length) {
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
    for(const [vertex, move] of this.#raw.vertexes) {
      if(move.level && vertex.isT) {
        // ищем точку на будущей образующей
        const test = move.startPoint.clone();
        this.tryMoveImpost({vertex, move, test});
      }
    }
    for(const [vertex, move] of this.#raw.vertexes) {
      if(move.delta?.length) {
        move.point = move.startPoint.add(move.delta);
        move.delta = null;
      }
    }
    this.drawMoveRibs();
  }

  tryMoveImpost({vertex, move, test}) {
    // узел импоста не должен покидать родительский профиль и приближаться к углам ближе li

    function edgesProfile(edges, impost) {
      for(const [edge, me] of edges) {
        if (!impost && !me.base || impost && me.base) {
          return edge.profile;
        }
      }
      for(const [edge, me] of edges) {
        const cpt = vertex.cnnPoints.find((cpt) => cpt.owner === edge.profile);
        if(cpt) {
          return impost ? edge.profile : cpt.profile;
        }
      }
    }
    
    const profile = edgesProfile(move.edges);
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
        const impost = edgesProfile(move.edges, true);
        pos = gen.joinedDirectedPosition({
          test: impost.generatrix,
          initial: move.startPoint,
          min: li,
          max: lmax,
        });
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
      if(pos.delta.length && (!move.delta || move.delta.length > pos.delta.length)) {
        move.delta = pos.delta;
      }
      
    }
  }

  drawMoveRibs() {
    const {ribs} = this.#raw.owner.children.visualization;
    ribs.clear();
    const rects = [];
    const selected = new Map();
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
            const start = edge.otherProfileVertex(vertex) || me.other.point;
            new paper.Path({
              parent: ribs,
              strokeColor: 'blue',
              strokeWidth: 2,
              strokeScaling: false,
              dashArray: [4, 4],
              guide: true,
              segments: [start, move.point],
            });
          }
          if(!rects.some((pt) => pt.isNearest(move.point))) {
            rects.push(move.point.clone());
            new paper.Path.Rectangle({
              parent: ribs,
              fillColor: 'blue',
              center: move.point,
              strokeScaling: false,
              size: [50, 50],
            });
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
  
  applyMovePoints() {
    let moved;
    for(const [vertex, move] of this.#raw.vertexes) {
      if(move.point && !vertex.point.isNearest(move.point)) {
        moved = true;
        vertex.point = move.point;
      }
    }    
    this.cancelMovePoints();
    return moved;
  }
}
