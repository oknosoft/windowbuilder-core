/**
 *
 *
 * @module Skeleton
 *
 * Created by Evgeniy Malyarov on 02.05.2020.
 */

class Skeleton extends Graph {

  /**
   * Ищет узел по координатам точки
   * @param point
   * @param {GraphVertex[]} vertices
   * @return {GraphVertex}
   */
  vertexByPoint(point, vertices) {
    return (vertices || this.getAllVertices())
      .find((vertex) => vertex.point.is_nearest(point, 0));
  }

  /**
   * Возвращает массив узлов, связанных с текущим профилем
   * @param profile
   * @return {GraphVertex[]}
   */
  vertexesByProfile(profile) {
    const res = new Set();
    this.getAllEdges().forEach((edge) => {
      if(edge.profile === profile) {
        res.add(edge.startVertex);
        res.add(edge.endVertex);
      }
    });
    return Array.from(res);
  }

  /**
   * Возвращает массив рёбер, связанных с текущим профилем
   * @param profile
   * @return {GraphEdge[]}
   */
  edgesByProfile(profile) {
    return this.getAllEdges().filter((edge) => edge.profile === profile);
  }

  /**
   * Возвращает группы узлов слева и справа от текущей точки
   * @param profile
   * @param point
   * @return {{left: [], right: []}}
   */
  splitVertexes(profile, point) {
    const {generatrix} = profile;
    const res = {
      left: [],
      right: [],
      offset: generatrix.getOffsetOf(generatrix.getNearestPoint(point)),
    };
    for(const vertex of this.vertexesByProfile(profile)) {
      const offset = generatrix.getOffsetOf(generatrix.getNearestPoint(vertex.point));
      if(offset < res.offset) {
        res.left.push({vertex, offset});
      }
      else if(offset > res.offset) {
        res.right.push({vertex, offset});
      }
      else {
        //throw new Error('Пересечение узлов');
      }
    }
    const sort = (a, b) => a.offset - b.offset;
    res.left.sort(sort);
    res.right.sort(sort);
    return res;
  }

  /**
   * Создаёт при необходимости узел в точке
   * @param point
   * @return {GraphVertex}
   */
  createVertexByPoint(point) {
    const vertices = this.getAllVertices();
    let vertex = this.vertexByPoint(point, vertices);
    if(!vertex) {
      vertex = new GraphVertex((vertices.length + 1).toString(), point);
      this.addVertex(vertex);
    }
    return vertex;
  }

  /**
   * Ищет самый короткий в массиве узлов
   * Если не находит - создаёт длиннейший
   * @param left
   * @param right
   * @return {{startVertex, endVertex}}
   */
  findShortest({left, right}) {
    let edge;
    for(let l=left.length-1; l>=0; l--) {
      for(let r=0; r<right.length; r++) {
        edge = this.findEdge(left[l].vertex, right[r].vertex);
        if(edge) {
          break;
        }
      }
      if(edge) {
        break;
      }
    }
    if(!edge) {
      edge = {startVertex: left[0].vertex, endVertex: right[right.length-1].vertex};
    }
    return edge;
  }

  /**
   * Делит элемент, к которому примыкает импост на два ребра
   * @param cnn
   * @param vertex
   */
  addImpostEdges(cnn, vertex) {
    if(cnn.profile && !cnn.profile_point) {
      // находим точки на ведущем профиле
      const {left, right, offset} = this.splitVertexes(cnn.profile, vertex.point);
      if(left.length && right.length) {
        // Если сторона соединения изнутри, делим в прямом направлении
        const inner = cnn.profile.cnn_side(cnn.parent, cnn.parent.generatrix.interiorPoint) === $p.enm.cnn_sides.Изнутри;
        const edge = inner ? this.findShortest({left, right}) : this.findShortest({left: right.reverse(), right: left.reverse()});
        this.addFragment({startVertex: edge.startVertex, endVertex: edge.endVertex, vertex, profile: cnn.profile});
      }
      else {
        //throw new Error('Пересечение узлов');
      }
    }
  }

  /**
   * Вспомогательный метод дл addImpostEdges
   * @param startVertex
   * @param endVertex
   * @param vertex
   * @param profile
   */
  addFragment({startVertex, endVertex, vertex, profile}) {
    const edge = this.findEdge(startVertex, endVertex);
    if(edge) {
      this.deleteEdge(edge);
    }
    this.addEdge(new GraphEdge({startVertex, endVertex: vertex, profile}));
    this.addEdge(new GraphEdge({startVertex: vertex, endVertex, profile}));
  }

  /**
   * Добавляет профиль в граф
   * @param profile
   */
  addProfile(profile) {
    // заглушка
    if(!this.project._use_skeleton) {
      return;
    }

    const b = this.createVertexByPoint(profile.b);
    const e = this.createVertexByPoint(profile.e);
    if(this.findEdge(b, e)) {
      throw new Error('Edge has already been added before');
    }
    this.addEdge(new GraphEdge({startVertex: b, endVertex: e, profile}));

    // заглушка для раскладок
    if(profile instanceof Onlay) {
      return;
    }

    // если импост, добавляем ребро в обратную сторону
    const {ab, ae} = profile.is_corner();
    const {_rays} = profile._attr;
    if(!ab || !ae) {
      // рвём элемент, к которому примыкает импост
      let add;
      if(_rays.b.profile && !_rays.b.profile.e.is_nearest(profile.b) && !_rays.b.profile.b.is_nearest(profile.b)) {
        this.addImpostEdges(_rays.b, b);
        add = true;
      }
      if(_rays.e.profile && !_rays.e.profile.b.is_nearest(profile.e) && !_rays.e.profile.e.is_nearest(profile.e)) {
        this.addImpostEdges(_rays.e, e);
        add = true;
      }
      if(add) {
        this.addEdge(new GraphEdge({startVertex: e, endVertex: b, profile}));
      }
    }

    // проверим соседей. возможно, им нужно обратное ребро
    const checked = new Set();
    for(const vertex of [b, e]) {
      for(const edge of vertex.getEdges()) {
        if(edge.profile === profile || checked.has(edge.profile)) {
          continue;
        }
        for(const endEdge of vertex.getEndEdges()) {
          if(edge.profile === endEdge.profile) {
            checked.add(edge.profile);
            break;
          }
        }
        if(checked.has(edge.profile)) {
          continue;
        }
        for(const corn of [ab, ae]) {
          if((corn.elm1 === profile.elm && corn.elm2 === edge.profile.elm) || (corn.elm2 === profile.elm || corn.elm1 === edge.profile.elm)) {
            if(edge.startVertex.point.is_nearest(edge.profile.b)) {
              const startVertex = this.createVertexByPoint(edge.profile.e);
              const outer_adge = new GraphEdge({startVertex, endVertex: edge.startVertex, profile: edge.profile});
              this.addEdge(outer_adge);
              console.log(edge.profile);
              checked.add(edge.profile);
            }
          }
        }
      }
    }

  }

  /**
   * Объединяет сегменты при удалении или отрыве импоста или склейке профилей
   * @param vertex
   */
  unSplitEdges(vertex) {
    const from = vertex.getEdges();
    const to = vertex.getEndEdges();
    for(const toEdge of to) {
      for(const fromEdge of from) {
        if(fromEdge.profile === toEdge.profile && fromEdge.startVertex === vertex && toEdge.endVertex === vertex) {
          this.deleteEdge(fromEdge);
          this.deleteEdge(toEdge);
          this.addEdge(new GraphEdge({startVertex: toEdge.startVertex, endVertex: fromEdge.endVertex, profile: fromEdge.profile}));
        }
      }
    }
  }

  /**
   * Удаляет профиль из графа
   * @param profile
   */
  removeProfile(profile) {
    // если к профилю есть примыкания импостов, удалять нельзя
    const vertexes = this.vertexesByProfile(profile);
    if(vertexes.length > 2) {
      throw new Error('Сначала удалите примыкающие импосты');
    }
    this.edgesByProfile(profile).some((edge) => {
      this.deleteEdge(edge);
      this.unSplitEdges(edge.startVertex);
      this.unSplitEdges(edge.endVertex);
    });
    // если узел не содержит профилей, удаляем
    for(const vertex of vertexes) {
      if(!vertex.edges.head && !vertex.endEdges.head) {
        this.deleteVertex(vertex);
      }
    }
  }

  get carcass() {
    return Boolean(this._carcass);
  }

  set carcass(v) {
    this._carcass = Boolean(v);
    this.getAllEdges().forEach(({profile}) => profile.carcass = v);
  }

  /**
   * Detect cycle in directed graph using Depth First Search.
   *
   */
  detectCycles() {
    const cycles = [];
    let cycle = null;

    $p.job_prm.debug ? console.profile() : console.time();

    // Will store parents (previous vertices) for all visited nodes.
    // This will be needed in order to specify what path exactly is a cycle.
    const dfsParentMap = new Map();

    // White set (UNVISITED) contains all the edges that haven't been visited at all.
    const whiteSet = new Set();

    // Gray set (VISITING) contains all the edges that are being visited right now
    // (in current path).
    const graySet = new Set();

    // Black set (VISITED) contains all the edges that has been fully visited.
    // Meaning that all children of the vertex has been visited.
    const blackSet = new Set();

    // If we encounter edge in gray set it means that we've found a cycle.
    // Because when vertex in gray set it means that its neighbors or its neighbors
    // neighbors are still being explored.

    // Init white set and add all edges to it.
    /** @param {GraphVertex} vertex */
    this.getAllEdges().forEach((edge) => whiteSet.add(edge));

    // Describe BFS callbacks.
    const callbacks = {
      enterEdge: ({currentEdge, previousEdge}) => {
        if(graySet.has(currentEdge)) {
          // If current vertex already in grey set it means that cycle is detected.
          // Let's detect cycle path.
          cycle = [currentEdge];

          let currentCycleEdge;
          let nextCycleEdge = dfsParentMap.get(currentEdge);

          while (nextCycleEdge && nextCycleEdge !== currentEdge) {
            cycle.push(nextCycleEdge);
            currentCycleEdge = nextCycleEdge;
            nextCycleEdge = dfsParentMap.get(currentCycleEdge);
          }
        }
        else {
          // Otherwise let's add current vertex to gray set and remove it from white set.
          graySet.add(currentEdge);
          whiteSet.delete(currentEdge);

          // Update DFS parents list.
          previousEdge && dfsParentMap.set(previousEdge, currentEdge);
        }
      },

      leaveVertex: ({currentEdge, previousEdge}) => {
        // If all node's children has been visited let's remove it from gray set
        // and move it to the black set meaning that all its neighbors are visited.
        blackSet.add(currentEdge);
        graySet.delete(currentEdge);
      },

      allowTraversal: ({currentEdge, nextEdge, edges}) => {
        // If cycle was detected we must forbid all further traversing since it will
        // cause infinite traversal loop.
        if(cycle) {
          cycles.push(Skeleton.reorder_cycle(cycle, blackSet, graySet));
          cycle = null;
          return false;
        }

        if(blackSet.has(nextEdge)) {
          return false;
        }

        // если на одном и том же профиле, не допускаем перевёртыш
        if(currentEdge.is_profile_outer(nextEdge)) {
          return false;
        }

        if(edges.length > 1) {
          const tangent = currentEdge.getTangentAt(currentEdge.endVertex);
          let maxAngle = 0;
          let currentAngle;
          for(const edge of edges) {
            if(currentEdge.is_profile_outer(edge) || nextEdge.is_profile_outer(edge)) {
              continue;
            }
            const ntangent = edge.getTangentAt(edge.startVertex);
            let angle = tangent.getDirectedAngle(ntangent);
            // if(angle < 0) {
            //   angle += 360;
            // }
            if(angle > maxAngle) {
              maxAngle = angle;
            }
            if(edge === nextEdge) {
              currentAngle = angle;
            }
          }
          if(currentAngle < maxAngle) {
            return false;
          }
        }

        // Allow traversal only for the vertices that are not in black set
        // since all black set vertices have been already visited.
        return true;
      },
    };

    // Start exploring vertices.
    while (whiteSet.size) {
      // Do Depth First Search.
      this.depthFirstSearch(Array.from(whiteSet)[0], callbacks);
    }

    $p.job_prm.debug ? console.profileEnd() : console.timeEnd();

    return cycles;
  }
};

/**
 * Ищет нижнее ребро и упорядочивает цикл
 * @param cycle
 * @param blackSet
 * @param graySet
 * @return {[]}
 */
Skeleton.reorder_cycle = function reorder_cycle(cycle, blackSet, graySet) {
  let delta = Infinity;
  let bottom = -1;
  const sorted = [];
  for (let i = 0; i < cycle.length; i++) {
    const edge = cycle[i];
    blackSet.add(edge);
    graySet.delete(edge);
    let {angle} = edge.endVertex.point.subtract(edge.startVertex.point);
    if(angle < 0) {
      angle += 360;
    }
    const cdelta = Math.abs(angle - 180);
    if(cdelta < delta) {
      bottom = i;
      delta = cdelta;
    }
  }
  for (let i = bottom; i < cycle.length; i++) {
    sorted.push(cycle[i]);
  }
  for (let i = 0; i < bottom; i++) {
    sorted.push(cycle[i]);
  }
  return sorted;
};
