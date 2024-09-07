
export const meta= {
  name: "пзФурнитура",
  splitted: false,
  synonym: "Фурнитура",
  illustration: "Описывает ограничения и правила формирования спецификаций фурнитуры",
  objPresentation: "Фурнитура",
  listPresentation: "Фурнитура",
  inputBy: [
    "name",
    "id"
  ],
  hierarchical: true,
  hasOwners: false,
  groupHierarchy: true,
  mainPresentation: "name",
  codeLength: 9,
  fields: {
    flap_weight_max: {
      synonym: "Масса створки макс",
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
    left_right: {
      synonym: "Левая правая",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    is_set: {
      synonym: "Это набор",
      multiline: false,
      tooltip: "Определяет, является элемент набором для построения спецификации или комплектом фурнитуры для выбора в построителе",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    is_sliding: {
      synonym: "Это раздвижка",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    furn_set: {
      synonym: "Набор фурнитуры",
      multiline: false,
      tooltip: "",
      choiceParams: [
        {
          name: "is_set",
          "path": true
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.furns"
        ]
      }
    },
    side_count: {
      synonym: "Количество сторон",
      multiline: false,
      tooltip: "",
      max: 8,
      min: 0,
      type: {
        types: [
          "number"
        ],
        digits: 1,
        fraction: 0
      }
    },
    clr_group: {
      synonym: "Доступность цветов",
      multiline: false,
      tooltip: "Если указано, выбор цветов будет ограничен этой группой",
      choiceParams: [
        {
          name: "color_price_group_destination",
          "path": "ДляОграниченияДоступности"
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.color_price_groups"
        ]
      }
    },
    handle_side: {
      synonym: "Ручка на стороне",
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
    open_type: {
      synonym: "Тип открывания",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "enm.open_types"
        ]
      }
    },
    name_short: {
      synonym: "Синоним",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "string"
        ],
        "strLen": 3
      }
    },
    applying: {
      synonym: "Уровень",
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
    formula: {
      synonym: "График размеров",
      multiline: false,
      tooltip: "Альтернатива табчасти \"НастройкиОткрывания\", чтобы задать размеры min-max",
      choiceParams: [
        {
          name: "parent",
          "path": "33bb8f4e-04e0-11ed-8e44-be0a92ebdb41"
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.formulas"
        ]
      }
    },
    note: {
      synonym: "Комментарий",
      multiline: true,
      tooltip: "Расширенное описание в markdown",
      type: {
        types: [
          "string"
        ],
        "strLen": 0
      }
    },
    parent: {
      synonym: "Группа",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "cat.furns"
        ]
      }
    }
  },
  tabulars: {
    open_tunes: {
      name: "НастройкиОткрывания",
      synonym: "Настройки открывания",
      tooltip: "",
      fields: {
        "side": {
          synonym: "Сторона",
          multiline: false,
          tooltip: "№ стороны",
          type: {
            types: [
              "number"
            ],
            digits: 1,
            fraction: 0
          }
        },
        "lmin": {
          synonym: "X min (длина или ширина)",
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
        "lmax": {
          synonym: "X max (длина или ширина)",
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
        "amin": {
          synonym: "α min",
          multiline: false,
          tooltip: "Минимальный угол к соседнему элементу",
          max: 360,
          min: 0,
          type: {
            types: [
              "number"
            ],
            digits: 8,
            fraction: 2
          }
        },
        "amax": {
          synonym: "α max",
          multiline: false,
          tooltip: "Максимальный угол к соседнему элементу",
          max: 360,
          min: 0,
          type: {
            types: [
              "number"
            ],
            digits: 8,
            fraction: 2
          }
        },
        "arc_available": {
          synonym: "Дуга",
          multiline: false,
          tooltip: "Разрешено искривление элемента",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "shtulp_available": {
          synonym: "Штульп",
          multiline: false,
          tooltip: "Примыкает либо крепится штульп",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "shtulp_fix_here": {
          synonym: "Крепится штульп",
          multiline: false,
          tooltip: "Пассивная штульповая створка",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "rotation_axis": {
          synonym: "Ось поворота",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "partial_opening": {
          synonym: "Неполн. откр.",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "outline": {
          synonym: "Эскиз",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 3,
            fraction: 0
          }
        }
      }
    },
    specification: {
      name: "Спецификация",
      synonym: "Спецификация",
      tooltip: "",
      fields: {
        "elm": {
          synonym: "№",
          multiline: false,
          tooltip: "Идентификатор строки спецификации",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        "dop": {
          synonym: "№ доп",
          multiline: false,
          tooltip: "Элемент дополнительной спецификации",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        "nom": {
          synonym: "Номенклатура/Набор",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "is_set",
              "path": true
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.inserts",
              "cat.nom",
              "cat.furns"
            ]
          }
        },
        "algorithm": {
          synonym: "Алгоритм",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.predefined_formulas"
            ]
          }
        },
        "nom_characteristic": {
          synonym: "Характеристика",
          multiline: false,
          tooltip: "",
          "choiceLinks": [
            {
              name: [
                "selection",
                "owner"
              ],
              "path": [
                "specification",
                "nom"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.characteristics"
            ]
          }
        },
        "clr": {
          synonym: "Цвет",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "clr_in",
              "path": "00000000-0000-0000-0000-000000000000"
            },
            {
              name: "clr_out",
              "path": "00000000-0000-0000-0000-000000000000"
            },
            {
              name: "color_price_group_destination",
              "path": "ДляХарактеристик"
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.color_price_groups",
              "cat.formulas",
              "cat.clrs"
            ],
            "default": "cat.clrs"
          }
        },
        "quantity": {
          synonym: "Количество",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 14,
            fraction: 8
          }
        },
        "handle_height_base": {
          synonym: "Выс. ручк.",
          multiline: false,
          tooltip: "Высота ручки по умолчению.\n>0: фиксированная высота\n=0: Высоту задаёт оператор\n<0: Ручка по центру",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        "fix_ruch": {
          synonym: "Высота ручки фиксирована",
          multiline: false,
          tooltip: "Запрещено изменять высоту ручки",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "handle_height_min": {
          synonym: "Выс. ручк. min",
          multiline: false,
          tooltip: "Строка будет добавлена только в том случае, если ручка выше этого значеия",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        "handle_height_max": {
          synonym: "Выс. ручк. max",
          multiline: false,
          tooltip: "Строка будет добавлена только в том случае, если ручка ниже этого значеия.\nЗначение (-1), означает учитывать высоту min с двух сторон (снизу и сверху) створки",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        "handle_base_filter": {
          synonym: "Смещение",
          multiline: false,
          tooltip: "Фильтр пр высоте ручки\n0: для любой высоты\n1: только для стандартной\n2: только для нестандартной",
          type: {
            types: [
              "number"
            ],
            digits: 1,
            fraction: 0
          }
        },
        "contraction": {
          synonym: "Укороч",
          multiline: false,
          tooltip: "Укорочение - число или формула на javascript",
          choiceGrp: "elm",
          type: {
            types: [
              "string",
              "number"
            ],
            "strLen": 100,
            digits: 8,
            fraction: 2
          }
        },
        "contraction_option": {
          synonym: "Укороч. от",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.contraction_options"
            ]
          }
        },
        "coefficient": {
          synonym: "Коэффициент",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 14,
            fraction: 8
          }
        },
        "flap_weight_min": {
          synonym: "Масса створки min",
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
        flap_weight_max: {
          synonym: "Масса створки max",
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
        "side": {
          synonym: "Сторона",
          multiline: false,
          tooltip: "Сторона фурнитуры, на которую устанавливается элемент или выполняется операция",
          type: {
            types: [
              "number"
            ],
            digits: 1,
            fraction: 0
          }
        },
        "cnn_side": {
          synonym: "Сторона соед.",
          multiline: false,
          tooltip: "Фильтр: выполнять операцию, если примыкающий элемент примыкает с заданной стороны",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.cnn_sides"
            ]
          }
        },
        "offset_option": {
          synonym: "Смещ. от",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.offset_options"
            ]
          }
        },
        formula: {
          synonym: "Формула",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "parent",
              "path": [
                "3220e25a-ffcd-11e5-8303-e67fda7f6b46",
                "3220e251-ffcd-11e5-8303-e67fda7f6b46",
                "33bb8f4e-04e0-11ed-8e44-be0a92ebdb41"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.formulas"
            ]
          }
        },
        "transfer_option": {
          synonym: "Перенос опер.",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.transfer_operations_options"
            ]
          }
        },
        "overmeasure": {
          synonym: "Припуск",
          multiline: false,
          tooltip: "Учитывать припуск длины элемента (например, на сварку)",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "is_set_row": {
          synonym: "Это строка набора",
          multiline: false,
          tooltip: "Интерфейсное поле (Номенклатура=Фурнитура) для редактирования без кода",
          type: {
            types: [
              "number"
            ],
            digits: 1,
            fraction: 0
          }
        },
        "is_procedure_row": {
          synonym: "Это строка операции",
          multiline: false,
          tooltip: "Интерфейсное поле (Номенклатура=Номенклатура И ТипНоменклатуры = Техоперация) для редактирования без кода",
          type: {
            types: [
              "number"
            ],
            digits: 1,
            fraction: 0
          }
        },
        "is_order_row": {
          synonym: "Это строка заказа",
          multiline: false,
          tooltip: "Если заполнено, строка будет добавлена в заказ, а не в спецификацию текущей продукции",
          choiceParams: [
            {
              name: "ref",
              "path": [
                "Нет",
                "Материал",
                "Продукция",
                "Комплектация"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.specification_order_row_types"
            ]
          }
        },
        "stage": {
          synonym: "Этап",
          multiline: false,
          tooltip: "Этап производства",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.work_center_kinds"
            ]
          }
        },
        "inset": {
          synonym: "Доп. вставка",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.inserts"
            ]
          }
        }
      }
    },
    selection_params: {
      name: "ПараметрыОтбора",
      synonym: "Параметры отбора",
      tooltip: "",
      fields: {
        "elm": {
          synonym: "Элемент",
          multiline: false,
          tooltip: "Идентификатор строки спецификации",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        "dop": {
          synonym: "Доп",
          multiline: false,
          tooltip: "Элемент дополнительной спецификации",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        "area": {
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
        "param": {
          synonym: "Параметр",
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
        "origin": {
          synonym: "Источник",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "ref",
              "path": [
                "order",
                "product",
                "layer",
                "elm",
                "nearest",
                "parent",
                "algorithm",
                "layer_active",
                "layer_passive"
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
        "comparison_type": {
          synonym: "Вид сравнения",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.comparison_types"
            ]
          }
        },
        "value": {
          synonym: "Значение",
          multiline: false,
          tooltip: "",
          "choiceLinks": [
            {
              name: [
                "comparison_type"
              ],
              "path": [
                "selection_params",
                "comparison_type"
              ]
            },
            {
              name: [
                "selection",
                "owner"
              ],
              "path": [
                "selection_params",
                "param"
              ]
            },
            {
              name: [
                "txt_row"
              ],
              "path": [
                "selection_params",
                "txt_row"
              ]
            }
          ],
          "choiceType": {
            "path": [
              "selection_params",
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
            "strLen": 1024,
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
            "strLen": 0
          }
        }
      }
    },
    "specification_restrictions": {
      name: "ОграниченияСпецификации",
      synonym: "Ограничения спецификации",
      tooltip: "",
      fields: {
        "elm": {
          synonym: "№",
          multiline: false,
          tooltip: "Идентификатор строки спецификации",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        "dop": {
          synonym: "Доп",
          multiline: false,
          tooltip: "Элемент дополнительной спецификации",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        "side": {
          synonym: "Сторона",
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
        "lmin": {
          synonym: "X min (длина или ширина)",
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
        "lmax": {
          synonym: "X max (длина или ширина)",
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
        "amin": {
          synonym: "α мин",
          multiline: false,
          tooltip: "",
          max: 360,
          type: {
            types: [
              "number"
            ],
            digits: 8,
            fraction: 2
          }
        },
        "amax": {
          synonym: "α макс",
          multiline: false,
          tooltip: "",
          max: 360,
          type: {
            types: [
              "number"
            ],
            digits: 8,
            fraction: 2
          }
        },
        "for_direct_profile_only": {
          synonym: "Для прямых",
          multiline: false,
          tooltip: "Использовать только для прямых профилей (1), только для кривых (-1) или всегда(0)",
          max: 1,
          min: -1,
          type: {
            types: [
              "number"
            ],
            digits: 1,
            fraction: 0
          }
        }
      }
    },
    "attrs_option": {
      name: "ВариантАтрибутов",
      synonym: "Варианты наборов и графиков",
      tooltip: "",
      fields: {
        "mmin": {
          synonym: "Масса min",
          multiline: false,
          tooltip: "Масса min",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        "mmax": {
          synonym: "Масса max",
          multiline: false,
          tooltip: "Масса max",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        formula: {
          synonym: "График размеров",
          multiline: false,
          tooltip: "Альтернатива табчасти \"НастройкиОткрывания\", чтобы задать размеры min-max",
          choiceParams: [
            {
              name: "parent",
              "path": "33bb8f4e-04e0-11ed-8e44-be0a92ebdb41"
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.formulas"
            ]
          }
        },
        furn_set: {
          synonym: "Набор фурнитуры",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "is_set",
              "path": true
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.furns"
            ]
          }
        }
      }
    }
  },
  "cachable": "ram",
  "id": "frn",
}
