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
      else {
        res.right.push({vertex, offset});
      }
    }
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
   * Делит элемент, к которому примыкает импост на два ребра
   * @param cnn
   * @param vertex
   */
  addImpostEdges(cnn, vertex) {
    if(cnn.profile && !cnn.profile_point) {
      // находим точки на ведущем профиле
      const {left, right, offset} = this.splitVertexes(cnn.profile, vertex.point);
      if(left.length === 1 && right.length === 1) {
        // Если сторона соединения изнутри, делим в прямом направлении
        if(cnn.profile.cnn_side(cnn.parent, cnn.parent.generatrix.interiorPoint) === $p.enm.cnn_sides.Изнутри) {
          this.addFragment({startVertex: left[0].vertex, endVertex: right[0].vertex, vertex, profile: cnn.profile});
        }
        else {
          this.addFragment({endVertex: left[0].vertex, startVertex: right[0].vertex, vertex, profile: cnn.profile});
        }
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
    //return;

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
    if(ab && ae) {
      return;
    }

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

  /**
   * Объединяет сегменты при удалении или отрыве импоста или склейке профилей
   * @param edges
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
}
