
export const meta = {
  name: "КлючиПараметров",
  synonym: "Ключи параметров",
  illustration: "Списки пар {Параметр:Значение} для фильтрации в подсистемах формирования спецификаций, планировании и ценообразовании\n",
  objPresentation: "Ключ параметров",
  listPresentation: "Ключи параметров",
  inputBy: [
    "name"
  ],
  hierarchical: true,
  hasOwners: false,
  groupHierarchy: true,
  mainPresentation: "name",
  codeLength: 0,
  fields: {
    priority: {
      synonym: "Приоритет",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "number"
        ],
        digits: 6,
        fraction: 0
      }
    },
    note: {
      synonym: "Комментарий",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "string"
        ],
        strLen: 0
      }
    },
    sorting_field: {
      synonym: "Порядок",
      multiline: false,
      tooltip: "Используется для упорядочивания",
      type: {
        types: [
          "number"
        ],
        digits: 5,
        fraction: 0
      }
    },
    applying: {
      synonym: "Применение",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "enm.parametersKeysApplying"
        ]
      }
    },
    predefined_name: {
      synonym: "",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "string"
        ],
        strLen: 256
      }
    },
    parent: {
      synonym: "",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "cat.parametersKeys"
        ]
      }
    }
  },
  tabulars: {
    params: {
      name: "Параметры",
      synonym: "Параметры",
      tooltip: "",
      fields: {
        property: {
          synonym: "Свойство",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          "mandatory": true,
          type: {
            types: [
              "cch.properties"
            ]
          }
        },
        area: {
          synonym: "Гр. ИЛИ",
          multiline: false,
          tooltip: "Позволяет формировать условия ИЛИ",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        origin: {
          synonym: "Источник",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "ref",
              path: [
                "product",
                "layer",
                "nearest",
                "parent",
                "elm",
                "order"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.planDetailing"
            ]
          }
        },
        comparison_type: {
          synonym: "Вид сравнения",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.cmpTypes"
            ]
          }
        },
        value: {
          synonym: "Значение",
          multiline: false,
          tooltip: "",
          choiceLinks: [
            {
              name: [
                "comparison_type"
              ],
              path: [
                "params",
                "comparison_type"
              ]
            },
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "params",
                "property"
              ]
            },
            {
              name: [
                "txt_row"
              ],
              path: [
                "params",
                "txt_row"
              ]
            }
          ],
          choiceType: {
            path: [
              "params",
              "property"
            ],
            "elm": 0
          },
          type: {
            types: [
              "enm.sketch_view",
              "cat.nomGroups",
              "enm.coloring",
              "cat.production_params",
              "enm.opening",
              "cat.inserts",
              "cat.priceGroups",
              "cat.currencies",
              "enm.open_directions",
              "cat.characteristics",
              "cat.projects",
              "cat.individuals",
              "cat.users",
              "cat.values_options",
              "cat.delivery_areas",
              "cat.color_price_groups",
              "cch.properties",
              "cat.clrs",
              "cat.elm_visualization",
              "cat.property_values_hierarchy",
              "cat.formulas",
              "cat.delivery_directions",
              "cat.property_values",
              "boolean",
              "cat.nom_prices_types",
              "cat.divisions",
              "enm.elm_types",
              "enm.align_types",
              "cat.parametersKeys",
              "cat.partners",
              "string",
              "enm.sz_line_types",
              "enm.orientations",
              "cat.organizations",
              "date",
              "cat.units",
              "number",
              "enm.planDetailing",
              "cat.abonents",
              "cat.work_shifts",
              "cat.work_center_kinds",
              "enm.positions",
              "cat.branches",
              "cat.cashboxes",
              "enm.open_types",
              "cat.nom",
              "cat.cnns",
              "cat.furns",
              "enm.inserts_glass_types",
              "enm.vat_rates",
              "enm.cnn_sides",
              "enm.nested_object_editing_mode",
              "cat.stores",
              "cat.templates",
            ],
            strLen: 1024,
            "datePart": "date_time",
            digits: 15,
            fraction: 3
          }
        },
        "txt_row": {
          synonym: "Текстовая строка",
          multiline: false,
          tooltip: "Полный текст строкового реквизита либо сериализация списочного значения",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        }
      }
    }
  },
  id: "k",
  aliases: ['parameters_keys'],
  cachable: "ram"
};

export const exclude = [/*'cat.parametersKeys'*/];

export function classes({cat, enm, classes, symbols, utils, md}, exclude)  {
  const {CatParametersKeys: CatObj, CatParametersKeysParamsRow: TabularSectionRow} = classes;
  const {get, set} = symbols;

  class CatParametersKeys extends CatObj{

    /**
     * @summary `Map ИЛИ` таблицы параметров
     * @return {Map}
     */
    get or() {
      let {_or} = this;
      if(!_or) {
        _or = new Map();
        for(const prm_row of this.params) {
          if(!_or.has(prm_row.area)) {
            _or.set(prm_row.area, []);
          }
          _or.get(prm_row.area).push(prm_row);
        }
        this._or = _or;
      }
      return _or;
    }

    checkCondition(attr) {

      if(this.empty()) {
        return true;
      }

      // по таблице параметров сначала строим Map ИЛИ
      const {or} = this;

      let res = true;
      for(const grp of _or.values()) {
        let grp_ok = true;
        for(const prm_row of grp) {
          grp_ok = prm_row.checkCondition(attr);
          if (!grp_ok) {
            break;
          }
        }
        res = grp_ok;
        if(res) {
          break;
        }
      }

      return res;
    }
  }
  classes.CatParametersKeys = CatParametersKeys;

  class CatParametersKeysParamsRow extends TabularSectionRow {

    get value(){
      const {comparison_type, txt_row} = this;
      const value = this[get]('value');

      const {cmpTypes: ct} = enm;

      switch (comparison_type) {

        case ct.in:
        case ct.nin:
        case ct.lke:
        case ct.nlk:

          if(value instanceof classes.CatColorPriceGroups) {
            return value.clrs();
          }
          else if(!txt_row) {
            return value;
          }
          try {
            const arr = JSON.parse(txt_row);
            const {types, isRef} = this.property.type;
            if(types && isRef && arr.length) {
              let mgr;
              for(const type of types) {
                const tmp = md.mgr(type);
                if(tmp && arr.some(ref => tmp.byRef(ref))) {
                  mgr = tmp;
                  break;
                }
              }
              if(!mgr) {
                return arr;
              }
              else if(mgr === cat.colorPriceGroups) {
                const res = [];
                for(const ref of arr) {
                  const cg = mgr.get(ref, false);
                  if(cg) {
                    res.push(...cg.clrs());
                  }
                }
                return res;
              }
              return arr.map((ref) => mgr.get(ref, false)).filter(v => v && !v.empty());
            }
            return arr;
          }
          catch (err) {
            return value;
          }

        default:
          return value;
      }
    }
    set value(v){this[set]('value',v)}

    /**
     * @summary Проверяет условие в строке отбора
     * @param {BuilderElement} [elm]
     * @param {BuilderElement} [elm2]
     * @param {String} [node]
     * @param {String} [node2]
     * @param {Contour} [layer] - для случая, когда не указан элемент
     * @param {Scheme} [project] - для случая, когда не указан слой
     * @param {DocCalcOrder} [order] - для случая, когда не указаны элемент, слой и проект
     */
    checkCondition({elm, elm2, node, rib, node2, layer, project, order, ...other}) {
      const {property, origin} = this;
      let src = origin.is('nearest') ? (node2 || elm2) : (rib || node || elm);
      if(!src) {
        src = layer || project || order;
      }
      if(property.hasOwnProperty('checkCondition')) {
        return property.checkCondition({prm_row: this, ...src.params.context(origin)});
      }
      const left = (src.params || src.props).get(property);
      return utils.checkCompare(left, this.value, this.comparison_type);
    }

  }
  classes.CatParametersKeysParamsRow = CatParametersKeysParamsRow;
}

