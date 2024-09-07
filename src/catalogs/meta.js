
import {classes as divisionsClasses, meta as divisions, exclude as divisionsExclude} from './divisions/meta';
import {classes as nomKindsClasses, meta as nomKinds, exclude as nomKindsExclude} from './nomKinds/meta';
import {classes as nomClasses, meta as nom, exclude as nomExclude} from './nom';
import {classes as insertsClasses, meta as inserts, exclude as insertsExclude} from './inserts';
import {classes as cnnsClasses, meta as cnns, exclude as cnnsExclude} from './cnns';
import {classes as furnsClasses, meta as furns, exclude as furnsExclude} from './furns';
import {classes as productionParamsClasses, meta as productionParams, exclude as productionParamsExclude} from './productionParams';

export const meta = {
  currencies: {
    name: "Валюты",
    splitted: false,
    synonym: "Валюты",
    illustration: "Валюты, используемые при расчетах",
    objPresentation: "Валюта",
    inputBy: ["name", "id"],
    groupHierarchy: true,
    mainPresentation: "name",
    codeLength: 3,
    fields: {
      name_full: {
        synonym: "Наименование валюты",
        tooltip: "Полное наименование валюты",
        mandatory: true,
        type: {
          types: ["string"],
          strLen: 50
        }
      },
      extra_charge: {
        synonym: "Наценка",
        tooltip: "Коэффициент, который применяется к курсу основной валюты для вычисления курса текущей валюты.",
        type: {
          types: ["number"],
          digits: 10,
          fraction: 2
        }
      },
      main_currency: {
        synonym: "Основная валюта",
        tooltip: "Валюта, на основании курса которой рассчитывается курс текущей валюты",
        choiceGrp: "elm",
        mandatory: true,
        type: {
          types: ["cat.currencies"]
        }
      },
      parameters_russian_recipe: {
        synonym: "Параметры прописи на русском",
        tooltip: "Параметры прописи валюты на русском языке",
        type: {
          types: ["string"],
          strLen: 200
        }
      }
    },
    tabulars: {},
    cachable: "ram",
    id: "cr",
  },
  destinations: {
    name: "НаборыДополнительныхРеквизитовИСведений",
    splitted: false,
    synonym: "Наборы дополнительных реквизитов и сведений",
    illustration: "",
    objPresentation: "Набор дополнительных реквизитов и сведений",
    listPresentation: "",
    inputBy: ["name"],
    hierarchical: true,
    hasOwners: false,
    groupHierarchy: true,
    mainPresentation: "name",
    codeLength: 0,
    id: "ds",
    fields: {
      predefined_name: {
        synonym: "",
        multiline: false,
        tooltip: "",
        type: {
          types: ["string"],
          strLen: 256
        }
      },
      parent: {
        synonym: "Входит в группу",
        multiline: false,
        tooltip: "Группа, к которой относится набор.",
        type: {
          types: ["cat.destinations"]
        }
      }
    },
    tabulars: {
      extra_fields: {
        name: "ДополнительныеРеквизиты",
        synonym: "Дополнительные реквизиты",
        tooltip: "",
        fields: {
          property: {
            synonym: "Дополнительный реквизит",
            multiline: false,
            tooltip: "Дополнительный реквизит этого набора",
            choiceGrp: "elm",
            type: {
              types: ["cch.properties"]
            }
          },
          _deleted: {
            synonym: "Пометка удаления",
            multiline: false,
            tooltip: "Устанавливается при исключении дополнительного реквизита из набора,\nчтобы можно было вернуть связь с уникальным дополнительным реквизитом.",
            type: {
              types: ["boolean"]
            }
          }
        }
      },
      extra_properties: {
        name: "ДополнительныеСведения",
        synonym: "Дополнительные сведения",
        tooltip: "",
        fields: {
          property: {
            synonym: "Дополнительное сведение",
            multiline: false,
            tooltip: "Дополнительное сведение этого набора",
            choiceGrp: "elm",
            type: {
              types: ["cch.properties"]
            }
          },
          _deleted: {
            synonym: "Пометка удаления",
            multiline: false,
            tooltip: "Устанавливается при исключении дополнительного сведения из набора,\nчтобы можно было вернуть связь с уникальным дополнительным сведением.",
            type: {
              types: ["boolean"]
            }
          }
        }
      }
    },
    cachable: "ram"
  },
  divisions,
  elmVisualization: {
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
      "svg_path": {
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
      "rotate": {
        synonym: "Поворачивать",
        multiline: false,
        tooltip: "правила поворота эскиза параллельно касательной профиля в точке визуализации\n0 - поворачивать\n1 - ручка",
        type: {
          types: [
            "number"
          ],
          "digits": 1,
          "fraction": 0
        }
      },
      "offset": {
        synonym: "Смещение",
        multiline: false,
        tooltip: "Смещение в мм относительно внещнего ребра элемента",
        type: {
          types: [
            "number"
          ],
          "digits": 6,
          "fraction": 0
        }
      },
      "side": {
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
      "elm_side": {
        synonym: "Сторона элем.",
        multiline: false,
        tooltip: "(0) - изнутри, (1) - снаружи, (-1) - в середине элемента",
        type: {
          types: [
            "number"
          ],
          "digits": 1,
          "fraction": 0
        }
      },
      "cx": {
        synonym: "cx",
        multiline: false,
        tooltip: "Координата точки привязки",
        type: {
          types: [
            "number"
          ],
          "digits": 6,
          "fraction": 0
        }
      },
      "cy": {
        synonym: "cy",
        multiline: false,
        tooltip: "Координата точки привязки",
        type: {
          types: [
            "number"
          ],
          "digits": 6,
          "fraction": 0
        }
      },
      "angle_hor": {
        synonym: "Угол к горизонту",
        multiline: false,
        tooltip: "Угол к к горизонту элемента по умолчанию",
        type: {
          types: [
            "number"
          ],
          "digits": 6,
          "fraction": 0
        }
      },
      "priority": {
        synonym: "Приоритет",
        multiline: false,
        tooltip: "Группа визуализаций",
        type: {
          types: [
            "number"
          ],
          "digits": 6,
          "fraction": 0
        }
      },
      "mode": {
        synonym: "Режим",
        multiline: false,
        tooltip: "",
        type: {
          types: [
            "number"
          ],
          "digits": 1,
          "fraction": 0
        }
      },
      "origin": {
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
      "captured": {
        synonym: "Захвачен",
        multiline: false,
        tooltip: "Реквизит подсистемы MDM. Указывает, что объект в настоящий момент, захвачен для редактирования. Может содержать Тег (строку, комментарий) захвата ",
        choiceGrp: "elm",
        type: {
          types: [
            "boolean",
            "string"
          ],
          strLen: 50
        }
      },
      "editor": {
        synonym: "Редактор",
        multiline: false,
        tooltip: "Реквизит подсистемы MDM, указывает на {@link CatUsers|Пользователя}, захватившего объект для редактирования",
        choiceGrp: "elm",
        type: {
          types: [
            "cat.users"
          ]
        }
      },
      "predefined_name": {
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
      "sketch_view": {
        name: "ВидНаЭскиз",
        synonym: "Доступные виды",
        tooltip: "Доступные виды на эскиз",
        fields: {
          "kind": {
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
      "params": {
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
  },
  nomKinds,
  nomUnits: {
    name: "ЕдиницыИзмерения",
    synonym: "Единицы измерения",
    illustration: "Перечень единиц измерения номенклатуры и номенклатурных групп",
    objPresentation: "Единица измерения",
    listPresentation: "Единицы измерения",
    inputBy: ["name", "id"],
    hierarchical: false,
    hasOwners: true,
    mainPresentation: "name",
    codeLength: 9,
    fields: {
      qualifier_unit: {
        synonym: "Единица по классификатору",
        choiceGrp: "elm",
        type: {
          types: ["cat.units"]
        }
      },
      heft: {
        synonym: "Вес",
        type: {
          types: ["number"],
          digits: 15,
          fraction: 3
        }
      },
      volume: {
        synonym: "Объем",
        type: {
          types: ["number"],
          "digits": 15,
          "fraction": 3
        }
      },
      coefficient: {
        synonym: "Коэффициент",
        type: {
          types: ["number"],
          digits: 10,
          fraction: 3
        }
      },
      rounding_threshold: {
        synonym: "Порог округления",
        type: {
          types: ["number"],
          digits: 10,
          fraction: 0
        }
      },
      owner: {
        synonym: "Номенклатура",
        mandatory: true,
        type: {
          types: [
            "cat.nom_groups",
            "cat.nom"
          ]
        }
      }
    },
    tabulars: {},
    cachable: "ram",
    id: "nu",
    aliases: ['nom_units'],
  },
  nom,
  inserts,
  cnns,
  furns,
  productionParams,
  workCenterKinds: {
    name: "ВидыРабочихЦентров",
    synonym: "Этапы производства (Виды РЦ)",
    illustration: "",
    objPresentation: "Вид рабочего центра",
    listPresentation: "",
    inputBy: ["name"],
    hierarchical: false,
    groupHierarchy: false,
    mainPresentation: "name",
    codeLength: 0,
    fields: {
      applying: {
        synonym: "Детализация",
        tooltip: "Детализация планирования (до элемента, продукции, заказа...)",
        choiceParams: [
          {
            name: "ref",
            path: ["product", "layer", "parent", "elm", "order", "region"]
          }
        ],
        choiceGrp: "elm",
        type: {
          types: ["enm.plan_detailing"],
        }
      },
      available: {
        synonym: "Всегда доступен",
        tooltip: "Не учитывать остатки мощностей",
        type: {
          types: [
            "boolean"
          ]
        }
      },
      predefined_name: {
        synonym: "",
        multiline: false,
        tooltip: "",
        type: {
          types: ["string"],
          strLen: 256
        }
      }
    },
    tabulars: {},
    cachable: "ram",
    id: "sg",
    common: true,
    aliases: ['work_center_kinds'],
  },
  workCenters: {
    name: "РабочиеЦентры",
    synonym: "Рабочие центры",
    illustration: "",
    objPresentation: "",
    listPresentation: "",
    inputBy: ["name", "id"],
    hierarchical: true,
    groupHierarchy: true,
    mainPresentation: "name",
    codeLength: 9,
    fields: {
      department: {
        synonym: "Подразделение",
        multiline: false,
        tooltip: "",
        choiceGrp: "elm",
        mandatory: true,
        type: {
          types: [
            "cat.divisions"
          ]
        }
      },
      parent: {
        synonym: "",
        multiline: false,
        tooltip: "",
        type: {
          types: [
            "cat.work_centers"
          ]
        }
      }
    },
    tabulars: {
      work_center_kinds: {
        name: "ВидыРабочихЦентров",
        synonym: "Виды рабочих центров",
        tooltip: "",
        fields: {
          kind: {
            synonym: "Вид РЦ",
            multiline: false,
            tooltip: "",
            choiceGrp: "elm",
            mandatory: true,
            type: {
              types: [
                "cat.work_center_kinds"
              ]
            }
          }
        }
      }
    },
    cachable: "ram",
    id: "",
    common: true,
    aliases: ['work_centers'],
  },
  units: {
    name: "КлассификаторЕдиницИзмерения",
    synonym: "Классификатор единиц измерения",
    inputBy: ["name", "id"],
    mainPresentation: "name",
    codeLength: 3,
    fields: {
      name_full: {
        synonym: "Полное наименование",
        type: {
          types: ["string"],
          strLen: 100
        }
      },
      international_short: {
        synonym: "Международное сокращение",
        type: {
          types: ["string"],
          strLen: 3
        }
      }
    },
    tabulars: {},
    cachable: "ram",
    id: "uc",
  },
};

export const exclude = [
  ...divisionsExclude,
  ...nomKindsExclude,
  ...insertsExclude,
  ...nomExclude,
  ...cnnsExclude,
  ...furnsExclude,
  ...productionParamsExclude,
];

export const classes = [
  divisionsClasses,
  nomKindsClasses,
  nomClasses,
  insertsClasses,
  cnnsClasses,
  furnsClasses,
  productionParamsClasses,
];
