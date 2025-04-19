
export const meta = {
  name: "СвязиПараметров",
  synonym: "Связи параметров",
  illustration: "Подчиненные параметры",
  objPresentation: "Связь параметров",
  listPresentation: "Связи параметров",
  inputBy: [
    "name"
  ],
  hierarchical: true,
  hasOwners: false,
  groupHierarchy: true,
  mainPresentation: "name",
  codeLength: 0,
  fields: {
    master: {
      synonym: "Ведущий",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.parametersKeys"
        ]
      }
    },
    slave: {
      synonym: "Ведомый",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "cch.properties"
        ]
      }
    },
    hide: {
      synonym: "Скрыть ведомый",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "boolean"
        ]
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
    use_master: {
      synonym: "Использование ведущих",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "number"
        ],
        digits: 1,
        fraction: 0
      }
    },
    parent: {
      synonym: "",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "cat.paramsLinks"
        ]
      }
    }
  },
  tabulars: {
    leadings: {
      name: "Ведущие",
      synonym: "Ведущие",
      tooltip: "",
      fields: {
        key: {
          synonym: "Ключ",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.parametersKeys"
            ]
          }
        }
      }
    },
    values: {
      name: "Значения",
      synonym: "Значения",
      tooltip: "",
      fields: {
        value: {
          synonym: "Значение",
          multiline: false,
          tooltip: "",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "slave"
              ]
            }
          ],
          choiceParams: [],
          choiceType: {
            path: [
              "slave"
            ],
            elm: 0
          },
          type: {
            types: [
              "enm.sketch_view",
              "cat.nom_groups",
              "enm.coloring",
              "cat.production_params",
              "enm.opening",
              "cat.inserts",
              "cat.templates",
              "cat.price_groups",
              "cat.currencies",
              "enm.open_directions",
              "cat.characteristics",
              "cat.projects",
              "cat.individuals",
              "cat.users",
              "cat.values_options",
              "cat.delivery_areas",
              "cat.color_price_groups",
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
              "enm.plan_detailing",
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
              "cch.properties",
              "cat.clrs"
            ],
            strLen: 1024,
            datePart: "date_time",
            digits: 15,
            fraction: 3
          }
        },
        by_default: {
          synonym: "По умолчанию",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        forcibly: {
          synonym: "Принудительно",
          multiline: false,
          tooltip: "Замещать установленное ранее значение при перевыборе ведущего параметра",
          type: {
            types: [
              "boolean"
            ]
          }
        }
      }
    }
  },
  id: "prl",
  aliases: ['params_links'],
  cachable: "ram"
};

export const exclude = [/*'cat.paramsLinks'*/];

export function classes({cat, classes, symbols}, exclude)  {
  const {CatParamsLinks: CatObj, CatColorPriceGroups} = classes;
  const {get, set} = symbols;

  class CatParamsLinks extends CatObj{
    /**
     * @summary Дополеняет массив разрешенными в текущей связи значениями
     * @param values {Array}
     * @return {Array}
     */
    appendValues(values = []) {
      for(const row of this.values) {
        if(row.value instanceof CatColorPriceGroups) {
          for(const value of row.value.clrs()) {
            values.push({value});//by_default,forcibly
          }
        }
        else if(row.value?.isFolder) {
          row.value._children().forEach(value => {
            !value.isFolder && values.push({value});
          });
        }
        else {
          values.push(row);
        }
      }
      return values;
    }
  }
  classes.CatParamsLinks = CatParamsLinks;
}

