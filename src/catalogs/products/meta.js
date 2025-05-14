import {propValue} from '../../chartscharacteristics/properties/meta';

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
      multiline: true,
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
      multiline: true,
      tooltip: "Разделитель при частичной репликации до родителя",
      type: {
        types: [
          "string"
        ],
        strLen: 512
      }
    },
    branch: {
      synonym: "Отдел",
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
          tooltip: "",
          choiceParams: [
            {
              name: "is_folder",
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
          multiline: true,
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
          type: propValue.type,
        }
      }
    },
    profiles: {
      name: "Профили",
      virtual: true,
      synonym: "Профили",
      tooltip: "",
      fields: {
        b: {
          synonym: "b",
          tooltip: "Узел в точке b",
          type: {
            types: [
              "json",
              "struct"
            ]
          },
          proto: "cnnpoint"
        },
        e: {
          synonym: "e",
          tooltip: "Узел в точке b",
          type: {
            types: [
              "json",
              "struct"
            ]
          },
          proto: "cnnpoint"
        },
        offset: {
          synonym: "Смещение",
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
    },
    vertex: {
      name: "vertex",
      virtual: true,
      synonym: "Узел графа",
      tooltip: "Описание типа сохраняемых данных узла графа",
      fields: {
        key: {
          synonym: "Key",
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 4
          }
        },
        cnnType: {
          synonym: "cnnType",
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.cnn_types"
            ]
          }
        },
        x: {
          synonym: "x",
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        y: {
          synonym: "y",
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        params: {
          synonym: "Параметры профиля",
          tooltip: "",
          type: {
            types: [
              "json",
              "tabular"
            ]
          },
          proto: "params"
        }
      }
    },
    cnnpoint: {
      name: "cnnPoint",
      virtual: true,
      synonym: "Cnn point",
      tooltip: "Описание типа сохраняемых данных cnnPoint",
      fields: {
        cnn: {
          synonym: "cnn",
          tooltip: "Основное концевое соединение",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.cnns"
            ]
          }
        },
        cnno: {
          synonym: "cnno",
          tooltip: "Соединение с обюратной стороны (при наличии)",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.cnns"
            ]
          }
        },
        vertex: {
          synonym: "Узел",
          tooltip: "",
          type: {
            types: [
              "json",
              "struct"
            ]
          },
          proto: "vertex"
        }
      }
    }
  },
  id: "p",
  cachable: "doc"
};


