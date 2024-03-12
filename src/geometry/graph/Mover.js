import paper from 'paper/dist/paper-core';

export class Mover {

  #raw = {};
  
  constructor(owner) {
    Object.assign(this.#raw, {
      owner,
      vertexes: new Map(),
    });
  }
  
  addRecursive(vertex, edge, level) {
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
    
    if(!other.selected && !vertexes.has(other)) {
      for(const otherEdge of other.getEdges()) {
        if(otherEdge.profile !== edge.profile) {
          this.addRecursive(other, otherEdge, level + 1);
        }
      }
    }
    
  }

  /**
   * @summary Запоминает выделенные узлы и рёбра перед началом сдвига
   * @param {Boolean} [interactive]
   */
  prepareMovePoints(interactive) {
    const {owner, vertexes} = this.#raw;
    for(const edge of owner.skeleton.getAllEdges()) {
      if(edge.selected || (edge.startVertex.selected && edge.endVertex.selected)) {
        this.addRecursive(edge.startVertex, edge, 0);
        this.addRecursive(edge.endVertex, edge, 0);
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
    // извлекаем разрешенные диапазоны из шаблона
    let li = 140;
    let lmin = 200;
    let lmax = 2000;
    
    for(const [vertex, move] of this.#raw.vertexes) {
      if(!move.startPoint) {
        move.startPoint = move.point;
      }
      let test = move.startPoint.add(delta);
      // если это узел нулевого уровня
      if(move.level === 0) {
        if(vertex.isT) {
          // узел импоста не должен покидать родительский профиль и приближаться к углам ближе li
          let profile;
          for(const [edge, me] of move.edges) {
            if (!me.base) {
              profile = edge.profile;
              break;
            }
          }
          if(profile) {
            for(const [edge, me] of move.edges) {
              if(!me.base) {
                continue;
              }
              // обратное ребро импоста, двигать-анализировать не надо (но надо подумать про связанные импосты)
              // нам нужны входящее и исходящее рёбра на ведущем профиле
              const edges = {};
              for(const [parent] of move.edges) {
                if(parent.profile === profile) {
                  if(parent.startVertex === vertex) {
                    edges.out = parent;
                  }
                  else if(parent.endVertex === vertex) {
                    edges.in = parent;
                  }
                }
              }
              if(edges.in && edges.out) {
                const pos = profile.generatrix.joinedPosition({
                  base1: edges.in.startVertex.point,
                  base2: edges.out.endVertex.point,
                  initial: move.startPoint,
                  test,
                  min: li,
                });
                if(pos.delta.length) {
                  move.delta = pos.delta;
                  break;
                }
              }
            }
          }
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
    for(const [vertex, move] of this.#raw.vertexes) {
      if(move.delta?.length) {
        move.point = move.startPoint.add(move.delta);
        move.delta = null;
      }
    }
    this.drawMoveRibs();
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
