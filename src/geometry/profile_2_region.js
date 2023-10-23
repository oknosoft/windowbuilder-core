
(() => {

  /**
   * Возвращает виртуальный профиль ряда, вставка и соединения которого, заданы в отдельных свойствах
   * DataObj, транслирующий свойства допвставки через свойства элемента
   * @param num {Number}
   * @return {Profile}
   */
  function region(num) {
    const {_attr, rays, layer: {_ox}, elm} = this;
    const {cat: {cnns, inserts}, utils, enm} = $p;
    const trunc = Math.trunc(num);
    let fraction = Math.abs(num - trunc);
    if(fraction) {
      const tmp = fraction.toFixed(2).substring(2);
      fraction = [parseInt(tmp[0]), parseInt(tmp[1])];
      if(fraction[1] <= fraction[0]) {
        fraction = 0;
      }
    }
    const irow = _ox.inserts.find({cnstr: -elm, region: num});

    if(!irow) {
      return this;
    }

    // параметры выбора для ряда
    function cnn_choice_links(elm1, o, cnn_point) {
      const nom_cnns = cnns.nom_cnn(elm1, cnn_point.profile, cnn_point.cnn_types, false, undefined, cnn_point);
      return nom_cnns.some((cnn) => {
        return o.ref == cnn;
      });
    }

    // возаращает строку соединяемых элементов для ряда
    function cn_row(prop, add) {
      let node1 = prop === 'cnn1' ? 'b' : (prop === 'cnn2' ? 'e' : '');
      let cnn_point = {};
      if(node1 && this[node1].is_nearest(rays?.[node1]?.point)) {
        cnn_point = rays?.[node1];
      }
      const {profile, profile_point} = cnn_point;
      node1 += num;
      const node2 = profile_point ? (profile_point + num) : `t${num}`;
      const elm2 = profile ? profile.elm : 0;
      let row = _ox.cnn_elmnts.find({elm1: elm, elm2, node1, node2});
      if(!row && add) {
        row = _ox.cnn_elmnts.add({elm1: elm, elm2, node1, node2});
      }
      return add === 0 ? {row, cnn_point} : row;
    }

    if(!_attr._ranges) {
      _attr._ranges = new Map();
    }
    if(!_attr._ranges.has(num)) {
      // заготовка атрибутов proxy
      const __attr = {
        _corns: [],
        generatrix: _attr.generatrix,
      };
      // если узлы не совпадают с узлами родителя...
      if(fraction) {
        const {generatrix} = _attr;
        const {inner, outer} = this.joined_imposts();
        const imposts = [];
        for(const {point} of inner.concat(outer)) {
          const pt = generatrix.getNearestPoint(point);
          if(imposts.some(ip => ip.is_nearest(pt, 0))) {
            continue;
          }
          imposts.push(pt);
        }
        if(imposts.length && fraction[1] <= imposts.length) {
          const b = fraction[0] ? imposts[fraction[0] - 1] : generatrix.firstSegment.point;
          const e = fraction[1] <= imposts.length ? imposts[fraction[1] - 1] : generatrix.lastSegment.point;
          __attr.generatrix = generatrix.get_subpath(b, e);
        }
      }

      const nearest = () => this;
      _attr._ranges.set(num, new Proxy(this, {
        get(target, prop, receiver) {
          switch (prop){
            case '_attr':
              return __attr;
            case 'cnn1':
            case 'cnn2':
            case 'cnn3':
              if (!_attr._ranges.get(`cnns${num}`)) {
                _attr._ranges.set(`cnns${num}`, {});
              }
              const cn = _attr._ranges.get(`cnns${num}`);
              const proxy_point = __attr?._rays?.[prop === 'cnn1' ? 'b' : 'e'];
              if (!cn[prop] || cn[prop].empty()) {
                const {row, cnn_point} = cn_row.call(receiver, prop, 0);
                const pregion = cnn_point?.profile?._attr?._ranges?.get(num);
                if(row && prop !== 'cnn3' && proxy_point && !pregion) {
                  proxy_point.profile = null;
                  proxy_point.profile_point = '';
                  proxy_point.cnn_types = enm.cnn_types.acn.i;
                  if(!proxy_point.cnn_types.includes(row.cnn.cnn_type)) {
                    row.cnn = cnns.elm_cnn(receiver, null, proxy_point.cnn_types, null, false, false, proxy_point);
                  }
                  proxy_point.cnn = row.cnn;
                }
                else if(row) {
                  cn[prop] = row.cnn;
                  if(proxy_point) {
                    proxy_point.cnn = row.cnn;
                  }
                }
                else if(prop !== 'cnn3' && proxy_point) {
                  if(pregion) {
                    const {profile} = proxy_point;
                    proxy_point.profile_point = cnn_point?.profile_point || '';
                    proxy_point.cnn_types = cnn_point?.cnn_types;
                    const side = profile?.parent_elm?.cnn_side?.(target);
                    proxy_point.cnn = cnns.region_cnn({region: trunc, elm1: receiver, elm2: [{profile, side}], cnn_types: proxy_point.cnn_types});
                  }
                  else {
                    proxy_point.profile = null;
                    proxy_point.profile_point = '';
                    proxy_point.cnn_types = enm.cnn_types.acn.i;
                    proxy_point.cnn = cnns.elm_cnn(receiver, null, proxy_point.cnn_types, null, false, false, proxy_point);
                  }
                  cn[prop] = cnns.get();
                }
              }
              else {
                proxy_point.cnn = cn[prop];
              }
              return cn[prop];

            case 'cnn1_row':
            case 'cnn2_row':
            case 'cnn3_row':
              return cn_row.call(receiver, prop.substring(0, 4), 0);

            case 'rnum':
              return trunc;

            case 'irow':
              return irow;

            case 'inset':
              return irow.inset;

            case 'nom':
              return receiver.inset.nom(receiver, 0);

            case 'ref': {
              const {nom} = receiver;
              return nom && !nom.empty() ? nom.ref : receiver.inset.ref;
            }

            case 'sizeb':
              return BuilderElement.prototype.get_sizeb.call(receiver);

            case 'generatrix':
              return __attr.generatrix;

            case 'b':
              return __attr.generatrix.firstSegment.point;

            case 'e':
              return __attr.generatrix.lastSegment.point;

            case 'd0': {
              let {_nearest_cnn} = __attr;
              if(!_nearest_cnn?.check_nom1(receiver.nom) || !_nearest_cnn?.check_nom2(target.nom)) {
                const {cnn3} = receiver;
                if(cnn3?.check_nom1(receiver.nom) && cnn3?.check_nom2(target.nom)) {
                  __attr._nearest_cnn = _nearest_cnn = cnn3;
                }
                else {
                  __attr._nearest_cnn = _nearest_cnn = cnns.elm_cnn(receiver, target, enm.cnn_types.acn.ii, null, true);
                }
              }
              return target.d0 + (_nearest_cnn?.size(receiver, target, trunc) || 0);
            }

            case 'd1':
              return -(receiver.d0 - receiver.sizeb);

            case 'd2':
              return receiver.d1 - receiver.width;

            case 'width':
              return receiver.nom?.width || target.width;

            case 'rays': {
              if(!__attr._rays) {
                __attr._rays = new ProfileRays(receiver);
              }
              const {_rays} = __attr;
              if(!_rays.inner.segments.length || !_rays.outer.segments.length) {
                _rays.recalc();
              }
              if(!_rays.b._profile) {
                if(receiver.b.is_nearest(target.b)) {
                  for(const [rn, rprofile] of rays.b._profile?._attr?._ranges || []) {
                    if(rn === trunc || rn === num) {
                      _rays.b._profile = rprofile;
                    }
                  }
                  if(!_rays.b._profile) {
                    _rays.b._profile = rays.b._profile?.region?.(num);
                  }
                }
                else {

                }
              }
              if(!_rays.e._profile) {
                if(receiver.e.is_nearest(target.e)) {
                  for(const [rn, rprofile] of rays.e._profile?._attr?._ranges || []) {
                    if(rn === trunc || rn === num) {
                      _rays.e._profile = rprofile;
                    }
                  }
                  if(!_rays.e._profile) {
                    _rays.e._profile = rays.e._profile?.region?.(num);
                  }
                }
                else {

                }
              }
              receiver.cnn1;
              receiver.cnn2;
              return _rays;
            }

            case 'path': {
              // получаем узлы
              const {generatrix, rays} = receiver;
              //rays.recalc();
              const {_corns} = __attr;
              _corns.length = 0;
              // получаем соединения концов профиля и точки пересечения с соседями
              ProfileItem.prototype.path_points.call(receiver, rays.b, 'b', []);
              ProfileItem.prototype.path_points.call(receiver, rays.e, 'e', []);
              const {paths} = _attr;
              if(!paths.has(num)) {
                paths.set(num, Object.assign(new paper.Path({parent: target}), ProfileItem.path_attr));
              }
              const path = paths.get(num);
              path.removeSegments();
              path.addSegments([_corns[1], _corns[2], _corns[3], _corns[4]]);
              path.closePath();
              path.fillColor = BuilderElement.clr_by_clr.call(target, receiver.clr);
              return path;
            }

            case 'clr':
              return irow.clr.empty() ? target.clr : irow.clr;

            case '_metadata': {
              const meta = target.__metadata(false);
              const {fields} = meta;
              const {cnn1, cnn2} = fields;
              const {b, e} = receiver.rays;
              delete cnn1.choice_links;
              delete cnn2.choice_links;
              cnn1.list = cnns.nom_cnn(receiver, b.profile, b.cnn_types, false, undefined, b);
              cnn2.list = cnns.nom_cnn(receiver, e.profile, e.cnn_types, false, undefined, e);
              return meta;
            }

            case 'parent_elm':
              return target;

            case 'nearest':
              return nearest;

            default:
              let prow;
              if (utils.is_guid(prop)) {
                prow = _ox.params.find({param: prop, cnstr: -elm, region: num});
              }
              return prow ? prow.value : target[prop];
          }
        },

        set(target, prop, val, receiver) {
          switch (prop){
            case 'cnn1':
            case 'cnn2':
            case 'cnn3':
              const cn = _attr._ranges.get(`cnns${num}`);
              cn[prop] = cnns.get(val);
              const row = cn_row.call(receiver, prop, true);
              if(row.cnn !== cn[prop]) {
                row.cnn = cn[prop];
              }
              break;

            case 'clr':
              irow.clr = val;
              break;

            default:
              if(utils.is_guid(prop)) {
                const prow = _ox.params.find({param: prop, cnstr: -elm, region: num}) || _ox.params.add({param: prop, cnstr: -elm, region: num});
                prow.value = val;
              }
              else {
                target[prop] = val;
              }
          }
          target.project.register_change(true, ({_scope}) => _scope.eve.emit_async('region_change', receiver, prop));
          return true;
        },
      }));
    }
    return _attr._ranges.get(num);
  }

  EditorInvisible.Profile.prototype.region = region;
})();

