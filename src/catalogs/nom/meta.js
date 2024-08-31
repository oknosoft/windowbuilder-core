
export const meta= {
  name: "Номенклатура",
  synonym: "Номенклатура",
  illustration: "Перечень товаров, продукции, материалов, полуфабрикатов, тары, услуг",
  objPresentation: "Позиция номенклатуры",
  inputBy: ["name", "id", "article"],
  hierarchical: true,
  groupHierarchy: true,
  mainPresentation: "name",
  codeLength: 11,
  fields: {
    article: {
      synonym: "Артикул",
      multiline: false,
      type: {
        types: [
          "string"
        ],
        strLen: 100
      }
    },
    name_full: {
      synonym: "Наименование для печати",
      multiline: true,
      tooltip: "Наименование номенклатуры, которое будет печататься во всех документах.",
      type: {
        types: ["string"],
        strLen: 1024
      }
    },
    base_unit: {
      synonym: "Базовая единица измерения",
      choiceGrp: "elm",
      "mandatory": true,
      type: {
        types: ["cat.units"]
      }
    },
    storage_unit: {
      synonym: "Единица хранения остатков",
      choiceLinks: [
        {
          "name": ["selection", "owner"],
          "path": ["ref"]
        }
      ],
      choiceGrp: "elm",
      type: {
        types: ["cat.nomUnits"]
      }
    },
    nomKind: {
      synonym: "Вид номенклатуры",
      tooltip: "Определяет состав дополнительных реквизитов",
      choiceGrp: "elm",
      mandatory: true,
      type: {
        types: ["cat.nomKinds"]
      }
    },
    /*
    
    nom_group: {
      synonym: "Номенклатурная группа",
      multiline_mode: false,
      "tooltip": "Определяет счета учета и выступает разрезом в расчете себестоимости",
      "choice_groups_elm": "elm",
      "type": {
        "types": [
          "cat.nom_groups"
        ],
        "is_ref": true
      }
    },
    "price_group": {
      "synonym": "Ценовая группа",
      "multiline_mode": false,
      "tooltip": "Актуально для продукций",
      "choice_groups_elm": "elm",
      "type": {
        "types": [
          "cat.price_groups"
        ],
        "is_ref": true
      }
    },
    "vat_rate": {
      "synonym": "Ставка НДС",
      "multiline_mode": false,
      "tooltip": "Для подстановки в документы",
      "choice_groups_elm": "elm",
      "mandatory": true,
      "type": {
        "types": [
          "enm.vat_rates"
        ],
        "is_ref": true
      }
    },
        "alp1": {
      "synonym": "Угол: Типовой угол реза",
      "multiline_mode": false,
      "tooltip": "",
      "max": 360,
      "min": 0,
      "type": {
        "types": [
          "number"
        ],
        "digits": 8,
        "fraction": 2
      }
    },
    "wsnip_min": {
      "synonym": "Длина плохого обрезка min",
      "multiline_mode": false,
      "tooltip": "",
      "type": {
        "types": [
          "number"
        ],
        "digits": 8,
        "fraction": 2
      }
    },
    "wsnip_max": {
      "synonym": "Длина плохого обрезка max",
      "multiline_mode": false,
      "tooltip": "",
      "type": {
        "types": [
          "number"
        ],
        "digits": 8,
        "fraction": 2
      }
    },
    
    */
    note: {
      synonym: "Комментарий",
      multiline: true,
      type: {
        types: ["string"],
        strLen: 0
      }
    },
    elm_type: {
      synonym: "Тип элемента: рама, створка и т.п.",
      choiceGrp: "elm",
      type: {
        types: ["enm.elmTypes"]
      }
    },
    len: {
      synonym: "Длина - L",
      tooltip: "Длина стандартной загатовки, мм",
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    width: {
      synonym: "Ширина - A",
      tooltip: "Ширина стандартной загатовки, мм",
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    thickness: {
      synonym: "Толщина - T",
      tooltip: "Если указан svg визуализации, толщина берётся из чертежа, если не указан - из этого поля",
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    sizefurn: {
      synonym: "Размер фурн. паза - D",
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    sizefaltz: {
      synonym: "Размер фальца - F",
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    density: {
      synonym: "Плотность, кг / ед. хранения",
      type: {
        types: ["number"],
        digits: 10,
        fraction: 4
      }
    },
    volume: {
      synonym: "Объем, м³ / ед. хранения",
      type: {
        types: ["number"],
        digits: 10,
        fraction: 4
      }
    },
    arc_elongation: {
      synonym: "Удлинение арки",
      tooltip: "Этот размер будет добавлен изогнутым элементам",
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    sizeb: {
      synonym: "Размер до опоры - B",
      tooltip: "Имеет смысл только для вставок с вычисляемым размером \"B\" по номенклатуре",
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    szc: {
      synonym: "Размер фальца штапика - C",
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    loss_factor: {
      synonym: "Коэффициент потерь",
      tooltip: "Плановый коэффициент потерь (обрезь, усушка)",
      type: {
        types: ["number"],
        digits: 6,
        fraction: 4
      }
    },
    rounding_quantity: {
      synonym: "Округлять количество",
      tooltip: "При расчете спецификации построителя, как в функции Окр(). 1: до десятых долей,  0: до целых, -1: до десятков",
      type: {
        types: ["number"],
        digits: 1,
        fraction: 0
      }
    },
    clr: {
      synonym: "Цвет по умолчанию",
      tooltip: "Цвет материала по умолчанию. Актуально для заполнений, которые берём НЕ из системы",
      choiceGrp: "elm",
      type: {
        types: ["string", "cat.clrs"],
        strLen: 72,
        strFix: true
      }
    },
    cutting_optimization_type: {
      synonym: "Тип оптимизации",
      choiceGrp: "elm",
      type: {
        types: ["enm.cutting_optimization_types"]
      }
    },
    saw_width: {
      synonym: "Ширина пилы, мм.",
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    overmeasure: {
      synonym: "Припуск в раскрое, мм",
      tooltip: "Оставлять на хлысте припуск (мм) для захвата станком",
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    double_cut: {
      synonym: "Парный раскрой",
      tooltip: "0, 1 - одиночный.\n2 - парный",
      type: {
        types: ["number"],
        digits: 1,
        fraction: 0
      }
    },
    packing: {
      synonym: "Нормоупаковка",
      tooltip: "Коэффициент нормоураковки (N единиц хранения остатков)",
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    pricing: {
      synonym: "Расценка",
      "tooltip": "Дополнительная формула расчета цены на случай, когда не хватает возможностей стандартной подисистемы",
      choiceGrp: "elm",
      type: {
        types: ["cat.formulas"]
      }
    },
    visualization: {
      synonym: "Визуализация",
      choiceGrp: "elm",
      type: {
        types: ["cat.elm_visualization"]
      }
    },
    complete_list_sorting: {
      synonym: "Сортировка в листе комплектации",
      type: {
        types: ["number"],
        "digits": 2,
        "fraction": 0
      }
    },
    is_accessory: {
      synonym: "Это аксессуар",
      type: {
        types: ["boolean"]
      }
    },
    is_procedure: {
      synonym: "Это техоперация",
      type: {
        types: ["boolean"]
      }
    },
    is_service: {
      synonym: "Это услуга",
      type: {
        types: ["boolean"]
      }
    },
    is_pieces: {
      synonym: "Штуки",
      type: {
        types: ["boolean"]
      }
    },
    parent: {
      synonym: "Группа",
      tooltip: "Группа, в которую входит данная позиция номенклатуры.",
      type: {
        types: ["cat.nom"]
      }
    }
  },
  tabulars: {
    extra_fields: {
      name: "ДополнительныеРеквизиты",
      synonym: "Дополнительные реквизиты",
      tooltip: "Дополнительные реквизиты объекта",
      fields: {
        property: {
          synonym: "Свойство",
          tooltip: "Дополнительный реквизит",
          choiceGrp: "elm",
          type: {
            types: ["cch.properties"]
          }
        },
        value: {
          synonym: "Значение",
          tooltip: "Значение дополнительного реквизита",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "extra_fields",
                "property"
              ]
            }
          ],
          choiceGrp: "elm",
          choiceType: {
            path: ["extra_fields", "property"],
            elm: 0
          },
          type: {
            "types": [
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
            "is_ref": true,
            "str_len": 1024,
            "date_part": "date_time",
            "digits": 15,
            "fraction": 3
          }
        },
        txt_row: {
          synonym: "Текстовая строка",
          multiline: true,
          tooltip: "Полный текст строкового дополнительного реквизита",
          type: {
            types: ["string"],
            strLen: 0
          },
          "hide": true
        }
      }
    },
    demand: {
      name: "Потребность",
      synonym: "Потребность",
      tooltip: "Виды рабочих центров для целей планирования",
      fields: {
        kind: {
          synonym: "Этап производства",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.work_center_kinds"
            ]
          }
        },
        days_from_execution: {
          synonym: "Дней от готовности",
          tooltip: "Обратный отсчет. Когда надо запустить в работу в цехе. Должно иметь значение <= ДнейДоГотовности",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        days_to_execution: {
          synonym: "Дней до готовности",
          tooltip: "Если номенклатура есть в спецификации, плановая готовность отодвигается на N дней",
          type: {
            types: ["number"],
            digits: 6,
            fraction: 0
          }
        }
      }
    },
    colors: {
      name: "Цвета",
      synonym: "Цвета",
      tooltip: "Коды в разрезе цветов",
      fields: {
        clr: {
          synonym: "Цвет",
          choiceGrp: "elm",
          type: {
            types: ["string", "cat.clrs"],
            strLen: 72,
            strFix: true
          }
        },
        id: {
          synonym: "Код",
          type: {
            types: ["string"],
            strLen: 25
          }
        },
        article: {
          synonym: "Артикул ",
          type: {
            types: ["string"],
            strLen: 50
          }
        },
        name: {
          synonym: "Наименование н+х",
          tooltip: "Наименование ключа \"Номенклатура + Характеристика\"",
          type: {
            types: ["string"],
            strLen: 100
          }
        },
        packing: {
          synonym: "Нормоупаковка",
          tooltip: "Коэффициент нормоураковки (N единиц хранения остатков)",
          type: {
            types: ["number"],
            digits: 8,
            fraction: 2
          }
        },
        len: {
          synonym: "Длина - L",
          tooltip: "Длина стандартной загатовки, мм",
          type: {
            types: ["number"],
            digits: 8,
            fraction: 2
          }
        }
      }
    }
  },
  id: "n",
  mdm: true,
  cachable: "ram"
};


