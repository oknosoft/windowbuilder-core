
export const meta= {
  name: "ВизуализацияЭлементов",
  synonym: "Визуализация элементов",
  illustration: "Строки svg для рисования петель, ручек и графических примитивов",
  objPresentation: "Визуализация элемента",
  listPresentation: "Визуализация элементов",
  inputBy: ["name", "id"],
  hierarchical: false,
  hasOwners: false,
  groupHierarchy: true,
  mainPresentation: "name",
  codeLength: 9,
  fields: {
    svg_path: {
      synonym: "Путь svg или текст",
      multiline: true,
      tooltip: "",
      type: {
        types: [
          "string"
        ],
        strLen: 0
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
        strLen: 0
      }
    },
    attributes: {
      synonym: "Атрибуты",
      multiline: false,
      tooltip: "Дополнительные атрибуты svg path",
      type: {
        types: [
          "json"
        ]
      }
    },
    rotate: {
      synonym: "Поворачивать",
      multiline: false,
      tooltip: "правила поворота эскиза параллельно касательной профиля в точке визуализации\n0 - поворачивать\n1 - ручка",
      type: {
        types: [
          "number"
        ],
        digits: 1,
        fraction: 0
      }
    },
    offset: {
      synonym: "Смещение",
      multiline: false,
      tooltip: "Смещение в мм относительно внещнего ребра элемента",
      type: {
        types: [
          "number"
        ],
        digits: 6,
        fraction: 0
      }
    },
    side: {
      synonym: "Сторона соедин.",
      multiline: false,
      tooltip: "имеет смысл только для импостов",
      choiceGrp: "elm",
      type: {
        types: [
          "enm.cnn_sides"
        ]
      }
    },
    elm_side: {
      synonym: "Сторона элем.",
      multiline: false,
      tooltip: "(0) - изнутри, (1) - снаружи, (-1) - в середине элемента",
      type: {
        types: [
          "number"
        ],
        digits: 1,
        fraction: 0
      }
    },
    cx: {
      synonym: "cx",
      multiline: false,
      tooltip: "Координата точки привязки",
      type: {
        types: [
          "number"
        ],
        digits: 6,
        fraction: 0
      }
    },
    cy: {
      synonym: "cy",
      multiline: false,
      tooltip: "Координата точки привязки",
      type: {
        types: [
          "number"
        ],
        digits: 6,
        fraction: 0
      }
    },
    angle_hor: {
      synonym: "Угол к горизонту",
      multiline: false,
      tooltip: "Угол к к горизонту элемента по умолчанию",
      type: {
        types: [
          "number"
        ],
        digits: 6,
        fraction: 0
      }
    },
    priority: {
      synonym: "Приоритет",
      multiline: false,
      tooltip: "Группа визуализаций",
      type: {
        types: [
          "number"
        ],
        digits: 6,
        fraction: 0
      }
    },
    mode: {
      synonym: "Режим",
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
    origin: {
      synonym: "Навигация",
      multiline: false,
      tooltip: "Навигационная ссылка на изделие или слой",
      choiceParams: [
        {
          name: "ref",
          path: [
            "product",
            "layer",
            "nearest",
            "elm"
          ]
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "enm.plan_detailing"
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
    }
  },
  tabulars: {
    sketch_view: {
      name: "ВидНаЭскиз",
      synonym: "Доступные виды",
      tooltip: "Доступные виды на эскиз",
      fields: {
        kind: {
          synonym: "Вид",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.elm_visualization"
            ]
          }
        }
      }
    },
    params: {
      name: "Параметры",
      synonym: "Параметры",
      tooltip: "Параметры для навигации",
      fields: {
        "param": {
          synonym: "Параметр",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cch.properties"
            ]
          }
        }
      }
    }
  },
  cachable: "ram",
  id: "vz",
  aliases: ['elm_visualization'],
};


