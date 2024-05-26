/*
 * Created 02.05.2020.
 */

import {Graph} from './Graph';
import {GraphEdge} from './Edge';
import {GraphVertex} from './Vertex';
import {Cycle} from './Cycle';
import {CnnPoint} from '../ProfileCnnPoint';

const offsetSort = (a, b) => a.offset - b.offset;

export class Skeleton extends Graph {

  /**
   * Ищет узел по координатам точки
   * @param {paper.Point|CnnPoint} point
   * @param {GraphVertex[]} [vertices]
   * @param {Number} [delta]
   * @return {GraphVertex}
   */
  vertexByPoint(point, vertices, delta = 0) {
    if(point instanceof CnnPoint) {
      point = point.point;
    }
    return (vertices || this.getAllVertices())
      .find((vertex) => vertex.point.isNearest(point, delta));
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
    res.left.sort(offsetSort);
    res.right.sort(offsetSort);
    return res;
  }

  /**
   * Создаёт при необходимости узел в точке
   * @param {paper.Point|CnnPoint} point
   * @return {GraphVertex}
   */
  createVertexByPoint(point) {
    const vertices = this.getAllVertices();
    let vertex = this.vertexByPoint(point, vertices, 1);
    if(!vertex) {
      vertex = new GraphVertex((vertices.length + 1).toString(), point);
      this.addVertex(vertex);
    }
    if(point instanceof CnnPoint) {
      if(!vertex.cnnPoints.includes(point)) {
        vertex.cnnPoints.push(point);
      }
      point.vertex = vertex;
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
   * @param cnnPoint
   * @param vertex
   */
  addImpostEdges(cnnPoint, vertex) {
    // находим точки на ведущем профиле
    const {left, right, offset} = this.splitVertexes(cnnPoint.profile, vertex.point);
    if(left.length && right.length) {
      // Если сторона соединения изнутри, делим в прямом направлении
      const inner = cnnPoint.profile.cnnSide(cnnPoint.owner) < 0;
      const edge = inner ?
        this.findShortest({left, right}) : 
        this.findShortest({left: right.reverse(), right: left.reverse()});
      this.addFragment({startVertex: edge.startVertex, endVertex: edge.endVertex, vertex, profile: cnnPoint.profile});
    }
    else {
      //throw new Error('Пересечение узлов');
    }
  }

  /**
   * Вспомогательный метод для addImpostEdges
   * @param startVertex
   * @param endVertex
   * @param vertex
   * @param profile
   */
  addFragment({startVertex, endVertex, vertex, profile}) {
    const edge = this.findEdge(startVertex, endVertex);
    const startPoints = [...startVertex.cnnPoints];
    const endPoints = [...endVertex.cnnPoints];
    if(edge) {
      this.deleteEdge(edge);
    }
    this.addEdge(new GraphEdge({startVertex, endVertex: vertex, profile}));
    this.addEdge(new GraphEdge({startVertex: vertex, endVertex, profile}));
    const addPurge = ({cnnPoints}, point) => {
      if(!cnnPoints.includes(point)) {
        cnnPoints.push(point);
      }
      const rm = cnnPoints.filter((pt) => !(pt instanceof CnnPoint));
      for (const pt of rm) {
        cnnPoints.length > 1 && cnnPoints.splice(cnnPoints.indexOf(pt), 1);
      }
    };
    for(const cnnPoint of startPoints) {
      addPurge(startVertex, cnnPoint);
    }
    for(const cnnPoint of endPoints) {
      addPurge(endVertex, cnnPoint);
    }
  }
  
  checkNodes(b, e) {
    const startVertex = this.createVertexByPoint(b);
    const endVertex = this.createVertexByPoint(e);
    const res = Boolean(this.findEdge(startVertex, endVertex));
    for(const vertex of [startVertex, endVertex]) {
      if(!vertex.edges.head && !vertex.endEdges.head) {
        this.deleteVertex(vertex);
      }
    }
    return res;
  }

  /**
   * Добавляет профиль в граф
   * @param profile
   */
  addProfile(profile) {
    const {b, e} = profile;
    const startVertex = this.createVertexByPoint(b);
    const endVertex = this.createVertexByPoint(e);
    this.addEdge(new GraphEdge({startVertex, endVertex, profile}));
    
    let add;
    if(b.isT) {
      // рвём элемент, к которому примыкает импост
      this.addImpostEdges(b, startVertex);
      add = true;
    }
    if(e.isT) {
      this.addImpostEdges(e, endVertex);
      add = true;
    }
    // если импост, добавляем ребро в обратную сторону
    if(add) {
      this.addEdge(new GraphEdge({startVertex: endVertex, endVertex: startVertex, profile}));
    }

    // проверим соседей. возможно, им нужно обратное ребро
    const checked = new Set();
    for(const vertex of [startVertex, endVertex]) {
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
        // for(const corn of [ab, ae]) {
        //   if((corn.elm1 === profile.elm && corn.elm2 === edge.profile.elm) || (corn.elm2 === profile.elm || corn.elm1 === edge.profile.elm)) {
        //     if(edge.startVertex.point.isNearest(edge.profile.b)) {
        //       const startVertex = this.createVertexByPoint(edge.profile.e);
        //       const outer_adge = new GraphEdge({startVertex, endVertex: edge.startVertex, profile: edge.profile});
        //       this.addEdge(outer_adge);
        //       console.log(edge.profile);
        //       checked.add(edge.profile);
        //     }
        //   }
        // }
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
          const {b, e} = fromEdge.profile;
          toEdge.startVertex.addCnnPointIfNearest(b);
          fromEdge.endVertex.addCnnPointIfNearest(b);
          toEdge.startVertex.addCnnPointIfNearest(e);
          fromEdge.endVertex.addCnnPointIfNearest(e);
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

  /**
   * Detect cycle in directed graph using Depth First Search.
   *
   */
  detectCycles() {
    const cycles = [];
    let cycle = null;

    $p.jobPrm.debug ? console.profile() : console.time();

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
          cycles.push(new Cycle().reorder(cycle, blackSet, graySet));
          cycle = null;
          return false;
        }

        if(blackSet.has(nextEdge)) {
          return false;
        }

        // если на одном и том же профиле, не допускаем перевёртыш
        if(currentEdge.isProfileOuter(nextEdge)) {
          return false;
        }

        if(edges.length > 1) {
          const tangent = currentEdge.getTangentAt(currentEdge.endVertex);
          let maxAngle = 0;
          let currentAngle;
          for(const edge of edges) {
            if(currentEdge.isProfileOuter(edge) || nextEdge.isProfileOuter(edge)) {
              continue;
            }
            const ntangent = edge.getTangentAt(edge.startVertex);
            let angle = tangent.getDirectedAngle(ntangent);
            if(angle < 0) {
              angle += 360;
            }
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

    $p.jobPrm.debug ? console.profileEnd() : console.timeEnd();

    return cycles;
  }
}



