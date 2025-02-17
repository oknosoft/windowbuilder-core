
export const meta= {
  name: "Изделия",
  splitted: false,
  synonym: "Изделия",
  illustration: "",
  objPresentation: "",
  listPresentation: "",
  inputBy: [
    "name"
  ],
  hierarchical: false,
  hasOwners: true,
  groupHierarchy: false,
  mainPresentation: "name",
  codeLength: 0,
  fields: {
    calc_order: {
      synonym: "Расчет",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "doc.calc_order"
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
        strLen: 512
      }
    },
    obj_delivery_state: {
      synonym: "Этап согласования",
      multiline: false,
      tooltip: "Для целей RLS",
      choiceParams: [
        {
          name: "ref",
          "path": [
            "Подтвержден",
            "Отклонен",
            "Архив",
            "Шаблон",
            "Черновик"
          ]
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "enm.obj_delivery_states"
        ]
      }
    },
    route: {
      synonym: "Отделы-получатели",
      multiline: false,
      tooltip: "Разделитель при частичной репликации до родителя",
      type: {
        types: [
          "string"
        ],
        "strLen": 512
      }
    },
    branch: {
      synonym: "Отдел",
      multiline: false,
      tooltip: "Разделитель репликаций, идентификатор происхождения объекта",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.abonents",
          "cat.branches"
        ]
      }
    },
    owner: {
      synonym: "",
      multiline: false,
      tooltip: "",
      mandatory: true,
      type: {
        types: [
          "cat.nom"
        ]
      }
    }
  },
  tabulars: {
    links: {
      name: "Связи",
      synonym: "Связи",
      tooltip: "",
      fields: {
        kind: {
          synonym: "Вид",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.product_link_kinds"
            ]
          }
        },
        obj: {
          synonym: "Объект",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.characteristics"
            ]
          }
        },
        address: {
          synonym: "Проем",
          multiline: false,
          tooltip: "Указатель на проём",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        }
      }
    },
    struct: {
      name: "Структура",
      synonym: "Структура",
      tooltip: "Слои, проёмы, заполнения",
      fields: {
        kind: {
          synonym: "Вид слоя",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.layer_kinds"
            ]
          }
        },
        region: {
          synonym: "Ряд",
          multiline: false,
          tooltip: "Фильтр для дополнительных вставок\n0 - не ряд\n1 - ряд внутри элемента\n>1 - за элементом\n<0 - перед элементом",
          type: {
            types: [
              "number"
            ],
            digits: 2,
            fraction: 0
          }
        },
        parent: {
          synonym: "Внешний слой",
          multiline: false,
          tooltip: "Для вложенных - ссылка на родителя",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        address: {
          synonym: "Проем",
          multiline: false,
          tooltip: "Для вложенных - указатель на проём",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        sys: {
          synonym: "Система",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.production_params"
            ]
          }
        },
        inset: {
          synonym: "Вставка",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.inserts"
            ]
          }
        },
        open_type: {
          synonym: "Тип открывания",
          multiline: false,
          tooltip: "Свойство слоя, ограничивает фурнитуру",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.open_types"
            ]
          }
        },
        direction: {
          synonym: "Направл. откр.",
          multiline: false,
          tooltip: "Направление открывания",
          choiceParams: [
            {
              name: "ref",
              "path": [
                "Левое",
                "Правое"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.open_directions"
            ]
          }
        },
        furn: {
          synonym: "Фурнитура",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "is_folder",
              "path": false
            },
            {
              name: "is_set",
              "path": false
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.furns"
            ]
          }
        },
        params: {
          synonym: "Параметры слоя",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "json",
              "tabular"
            ]
          },
          proto: "params"
        },
        svg_path: {
          synonym: "Путь SVG",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        children: {
          synonym: "Дети",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "json",
              "tabular"
            ]
          },
          proto: "struct"
        },
        profiles: {
          synonym: "Профили",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "json",
              "tabular"
            ]
          },
          proto: "profiles"
        }
      },
    },
    params: {
      name: "Параметры",
      virtual: true,
      synonym: "Параметры",
      tooltip: "Параметры изделий, слоёв и элементов",
      fields: {
        param: {
          synonym: "Параметр",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cch.properties",
              "cat.nom"
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
                "selection",
                "owner"
              ],
              "path": [
                "params",
                "param"
              ]
            }
          ],
          choiceGrp: "elm",
          choiceType: {
            "path": [
              "params",
              "param"
            ],
            "elm": 0
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
              "cat.parameters_keys",
              "cat.partners",
              "string",
              "enm.sz_line_types",
              "enm.orientations",
              "cat.organizations",
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
            digits: 15,
            fraction: 3
          }
        }
      }
    },
    profiles: {
      name: "Профили",
      virtual: true,
      synonym: "Профили",
      tooltip: "",
      fields: {
        bv: {
          synonym: "bv",
          multiline: false,
          tooltip: "Узел в точке b",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        bx: {
          synonym: "bx",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 8,
            fraction: 2
          }
        },
        by: {
          synonym: "by",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 8,
            fraction: 2
          }
        },
        bcnn: {
          synonym: "bcnn",
          multiline: false,
          tooltip: "Основное соединение в точке b",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.cnns"
            ]
          }
        },
        bcnno: {
          synonym: "bcnno",
          multiline: false,
          tooltip: "Соединение с обюратной стороны в точке b (при наличии)",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.cnns"
            ]
          }
        },
        ev: {
          synonym: "ev",
          multiline: false,
          tooltip: "Узел в точке e",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        ex: {
          synonym: "ex",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 8,
            fraction: 2
          }
        },
        ey: {
          synonym: "ey",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 8,
            fraction: 2
          }
        },
        ecnn: {
          synonym: "ecnn",
          multiline: false,
          tooltip: "Основное соединение в точке e",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.cnns"
            ]
          }
        },
        ecnno: {
          synonym: "ecnno",
          multiline: false,
          tooltip: "Соединение с обюратной стороны в точке e (при наличии)",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.cnns"
            ]
          }
        },
        offset: {
          synonym: "Смещение",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 8,
            fraction: 2
          }
        },
        svg_path: {
          synonym: "Путь SVG",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        params: {
          synonym: "Параметры профиля",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "json",
              "tabular"
            ]
          },
          proto: "params"
        },
        children: {
          synonym: "children",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "json",
              "tabular"
            ]
          },
          proto: "profiles"
        }
      }
    }
  },
  id: "p",
  cachable: "doc"
};


