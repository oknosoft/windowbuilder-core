
export const meta= {
  name: "пзСоединения",
  synonym: "Соединения элементов", 
  illustration: "Спецификации соединений элементов. См.: {@tutorial cnns}",
  objPresentation: "Соединение",
  listPresentation: "Соединения",
  inputBy: ["name", "id"],
  mainPresentation: "name",
  codeLength: 9,
  fields: {
    priority: {
      synonym: "Приоритет",
      tooltip: "Для автоподстановки соединения (чем больше число, тем ниже по списку)",
      type: {
        types: ["number"],
        digits: 6,
        fraction: 0
      }
    },
    amin: {
      synonym: "Угол минимальный",
      max: 360,
      min: -360,
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    amax: {
      synonym: "Угол максимальный",
      max: 360,
      min: -360,
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    sd1: {
      synonym: "Сторона (фильтр)",
      tooltip: "Соединение доступно только для указанной стороны профиля (фильтр)",
      choiceGrp: "elm",
      mandatory: true,
      type: {
        types: ["enm.cnn_sides"]
      }
    },
    sd2: {
      synonym: "Сторона (отступ)",
      tooltip: "Откладывать \"размер\" от внутренней стороны профиля (0) или от внешней (1)",
      type: {        
        types: ["number"],
        digits: 1,
        fraction: 0
      }
    },
    sz: {
      synonym: "Размер",
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    cnn_type: {
      synonym: "Тип соединения",
      tooltip: "Угловое, Т, Примыкающее и т.д.",
      choiceGrp: "elm",
      mandatory: true,
      type: {
        types: ["enm.cnn_types"]
      }
    },
    ahmin: {
      synonym: "AH min (угол к горизонтали)",
      max: 360,
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    ahmax: {
      synonym: "AH max (угол к горизонтали)",
      max: 360,
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    lmin: {
      synonym: "Длина шва min ",
      type: {
        types: ["number"],
        digits: 6,
        fraction: 0
      }
    },
    lmax: {
      synonym: "Длина шва max ",
      type: {
        types: ["number"],
        digits: 6,
        fraction: 0
      }
    },
    tmin: {
      synonym: "Толщина min ",
      max: 1000,
      min: 0,
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    tmax: {
      synonym: "Толщина max ",
      max: 1000,
      min: 0,
      type: {
        types: ["number"],
        digits: 8,
        fraction: 2
      }
    },
    var_layers: {
      synonym: "Разн. плоск. створок",
      tooltip: "Створки в разных плоскостях",
      type: {
        types: ["boolean"]
      }
    },
    for_direct_profile_only: {
      synonym: "Для прямых",
      tooltip: "Использовать только для прямых профилей (1), только для кривых (-1) или всегда(0)",
      max: 1,
      min: -1,
      type: {
        types: ["number"],
        digits: 1,
        fraction: 0
      }
    },
    art1vert: {
      synonym: "Арт1 верт.",
      tooltip: "Соединение используется только в том случае, если Артикул1 - вертикальный",
      type: {
        types: ["boolean"]
      }
    },
    art1glass: {
      synonym: "Арт1 - стеклопакет",
      tooltip: "Артикул1 может быть составным стеклопакетом",
      type: {
        types: ["boolean"]
      }
    },
    art2glass: {
      synonym: "Арт2 - стеклопакет",
      tooltip: "Артикул2 может быть составным стеклопакетом",
      type: {
        types: ["boolean"]
      }
    },
    note: {
      synonym: "Комментарий",
      type: {
        types: ["string"],
        strLen: 0
      }
    },
    applying: {
      synonym: "Применение",
      tooltip: "Применимость соединения на стыке, честном Т или в любом месте:\n- 0 - Везде\n- 1 - Только стык\n- 2 - Только T\n- 3 - Только угол",
      type: {
        types: ["number"],
        digits: 6,
        fraction: 0
      }
    },
    region: {
      synonym: "Доступный ряд",
      tooltip: "Применимость соединения в рядах:\n0 - Любой (в том числе, обычные соединения)\n1 - Ряд внутри элемента\n<0 - Ряд перед элементом\n>1 - Ряд за элементом",
      type: {
        types: ["number"],
        digits: 2,
        fraction: 0
      }
    },
  },
  tabulars: {
    specification: {
      name: "Спецификация",
      synonym: "Спецификация",
      fields: {
        elm: {
          synonym: "№",
          tooltip: "Идентификатор строки спецификации",
          type: {
            types: ["number"],
            digits: 6,
            fraction: 0
          }
        },
        nom: {
          synonym: "Номенклатура",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: ["cat.inserts", "cat.nom"]
          }
        },
        algorithm: {
          synonym: "Алгоритм",
          choiceGrp: "elm",
          type: {
            types: ["enm.predefined_formulas"]
          }
        },
        nom_characteristic: {
          synonym: "Характеристика",
          choiceLinks: [
            {
              name: ["selection", "owner"],
              path: ["specification", "nom"]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: ["cat.characteristics"]
          }
        },
        clr: {
          synonym: "Цвет",
          choiceParams: [
            {
              name: "clr_in",
              path: "00000000-0000-0000-0000-000000000000"
            },
            {
              name: "clr_out",
              path: "00000000-0000-0000-0000-000000000000"
            },
            {
              name: "color_price_group_destination",
              path: "ДляХарактеристик"
            }
          ],
          choiceGrp: "elm",
          type: {
            types: ["cat.color_price_groups", "cat.formulas", "cat.clrs"],
            "default": "cat.clrs"
          }
        },
        coefficient: {
          synonym: "Коэффициент",
          tooltip: "коэффициент (кол-во комплектующего на 1мм профиля)",
          type: {
            types: ["number"],
            digits: 14,
            fraction: 8
          }
        },
        sz: {
          synonym: "Размер",
          tooltip: "размер (в мм, на которое компл. заходит на Артикул 2)",
          type: {
            types: ["number"],
            digits: 8,
            fraction: 2
          }
        },
        quantity: {
          synonym: "Количество",
          type: {
            types: ["number"],
            digits: 14,
            fraction: 8
          }
        },
        formula: {
          synonym: "Формула",
          choiceParams: [
            {
              name: "parent",
              path: [
                "3220e259-ffcd-11e5-8303-e67fda7f6b46",
                "3220e251-ffcd-11e5-8303-e67fda7f6b46"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: ["cat.formulas"]
          }
        },
        sz_min: {
          synonym: "Размер min",
          type: {
            types: ["number"],
            digits: 6,
            fraction: 0
          }
        },
        sz_max: {
          synonym: "Размер max",
          type: {
            types: ["number"],
            digits: 6,
            fraction: 0
          }
        },
        amin: {
          synonym: "Угол min",
          max: 360,
          "min": -360,
          type: {
            types: ["number"],
            digits: 8,
            fraction: 2
          }
        },
        amax: {
          synonym: "Угол max",
          max: 360,
          min: -360,
          type: {
            types: ["number"],
            digits: 8,
            fraction: 2
          }
        },
        set_specification: {
          synonym: "Устанавливать",
          tooltip: "Устанавливать спецификацию",
          choiceGrp: "elm",
          type: {
            types: ["enm.specification_installation_methods"]
          }
        },
        for_direct_profile_only: {
          synonym: "Для прямых",
          tooltip: "Использовать только для прямых профилей (1), только для кривых (-1) или всегда(0)",
          max: 1,
          min: -1,
          type: {
            types: ["number"],
            digits: 1,
            fraction: 0
          }
        },
        alp2: {
          synonym: "Учитывать α>180",
          type: {
            types: ["boolean"]
          }
        },
        angle_calc_method: {
          synonym: "Расчет угла",
          tooltip: "Способ расчета угла",
          choiceGrp: "elm",
          type: {
            types: ["enm.angle_calculating_ways"]
          }
        },
        contour_number: {
          synonym: "Контур №",
          tooltip: "Номер контура (доп)",
          type: {
            types: ["number"],
            digits: 6,
            fraction: 0
          }
        },
        is_order_row: {
          synonym: "Это строка заказа",
          tooltip: "Если заполнено, строка будет добавлена в заказ, а не в спецификацию текущей продукции",
          choiceParams: [
            {
              name: "ref",
              path: ["Нет", "Материал", "Продукция", "Комплектация"]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: ["enm.specification_order_row_types"]
          }
        },
        stage: {
          synonym: "Этап",
          tooltip: "Этап производства",
          choiceGrp: "elm",
          type: {
            types: ["cat.work_center_kinds"]
          }
        },
        inset: {
          synonym: "Доп. вставка",
          choiceGrp: "elm",
          type: {
            types: ["cat.inserts"]
          }
        }
      }
    },
    cnn_elmnts: {
      name: "СоединяемыеЭлементы",
      synonym: "Соединяемые элементы",
      fields: {
        nom1: {
          synonym: "Номенклатура1",
          choiceGrp: "elm",
            type: {
            types: [
              "cat.nom"
            ]
          }
        },
        clr1: {
          synonym: "Цвет1",
          choiceGrp: "elm",
          type: {
            types: ["cat.clrs"]
          }
        },
        nom2: {
          synonym: "Номенклатура2",
          choiceGrp: "elm",
          type: {
            types: ["cat.nom"]
          }
        },
        clr2: {
          synonym: "Цвет2",
          choiceGrp: "elm",
          type: {
            types: ["cat.clrs"]
          }
        },
        is_nom_combinations_row: {
          synonym: "Это строка сочетания номенклатур",
          type: {
            types: ["boolean"]
          }
        }
      }
    },
    selection_params: {
      name: "ПараметрыОтбора",
      synonym: "Параметры отбора",
      fields: {
        elm: {
          synonym: "№",
          tooltip: "Идентификатор строки спецификации",
          type: {
            types: ["number"],
            digits: 6,
            fraction: 0
          }
        },
        area: {
          synonym: "Гр. ИЛИ",
          tooltip: "Позволяет формировать условия ИЛИ",
          type: {
            types: ["number"],
            digits: 6,
            fraction: 0
          }
        },
        param: {
          synonym: "Параметр",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: ["cch.properties"]
          }
        },
        origin: {
          synonym: "Источник",
          choiceParams: [
            {
              name: "ref",
              path: [
                "product",
                "layer",
                "nearest",
                "parent",
                "elm",
                "order",
                "algorithm",
                "layer_active",
                "layer_passive"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: ["enm.plan_detailing"]
          }
        },
        comparison_type: {
          synonym: "Вид сравнения",
          choiceGrp: "elm",
          type: {
            types: ["enm.comparison_types"]
          }
        },
        value: {
          synonym: "Значение",
          choiceLinks: [
            {
              name: [
                "comparison_type"
              ],
              path: [
                "selection_params",
                "comparison_type"
              ]
            },
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "selection_params",
                "param"
              ]
            },
            {
              name: [
                "txt_row"
              ],
              path: [
                "selection_params",
                "txt_row"
              ]
            }
          ],
          choiceType: {
            "path": [
              "selection_params",
              "param"
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
              strLen: 1024,
              datePart: "date_time",
              digits: 15,
              fraction: 3
          }
        },
        txt_row: {
          synonym: "Текстовая строка",
          tooltip: "Полный текст строкового реквизита либо сериализация списочного значения",
          type: {
            types: ["string"],
            strLen: 0
          }
        }
      }
    },
    sizes: {
      name: "Размеры",
      synonym: "Размеры",
      tooltip: "Варианты размеров с фильтром по параметрам",
      fields: {
        elm: {
          synonym: "Размер",
          type: {
            types: [
              "number"
            ],
              digits: 8,
              fraction: 2
          }
        },
        param: {
          synonym: "Параметр",
          choiceGrp: "elm",
          type: {
            types: [
              "cch.properties"
            ]
          }
        },
        origin: {
          synonym: "Источник",
          choiceParams: [
            {
              name: "ref",
              "path": [
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
              "enm.plan_detailing"
            ]
          }
        },
        comparison_type: {
          synonym: "Вид сравнения",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.comparison_types"
            ]
          }
        },
        value: {
          synonym: "Значение",
          choiceLinks: [
            {
              name: [
                "comparison_type"
              ],
              path: [
                "sizes",
                "comparison_type"
              ]
            },
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "sizes",
                "param"
              ]
            },
            {
              name: [
                "txt_row"
              ],
              path: [
                "sizes",
                "txt_row"
              ]
            }
          ],
          choiceType: {
            path: ["sizes", "param" ],
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
            strLen: 1024,
            datePart: "date_time",
            digits: 15,
            fraction: 3
          }
        },
        txt_row: {
          synonym: "Текстовая строка",
          tooltip: "Полный текст строкового реквизита либо сериализация списочного значения",
          type: {
            types: ["string"],
            strLen: 0
          }
        },
        key: {
          synonym: "Ключ",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.parameters_keys"
            ]
          }
        }
      }
    },
    priorities: {
      name: "Приоритеты",
      synonym: "Приоритеты",
      fields: {
        sys: {
          synonym: "Система",
          choiceGrp: "elm",
            type: {
            types: [
              "cat.production_params"
            ]
          }
        },
        orientation: {
          synonym: "Ориентация",
          choiceGrp: "elm",
            type: {
            types: [
              "enm.orientations"
            ]
          }
        },
        priority: {
          synonym: "Приоритет",
          type: {
            types: ["number"],
            digits: 6,
            fraction: 0
          }
        }
      }
    },
    coordinates: {
      name: "Координаты",
      synonym: "Координаты",
      fields: {
        elm: {
          synonym: "№",
          tooltip: "Идентификатор строки спецификации",
            type: {
            types: [
              "number"
            ],
              digits: 6,
              fraction: 0
          }
        },
        offset_option: {
          synonym: "Смещ. от",
          choiceParams: [
            {
              name: "ref",
              path: [
                "ОтНачалаСтороны",
                "ОтКонцаСтороны",
                "ОтСередины",
                "Формула"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.offset_options"
            ]
          }
        },
        formula: {
          synonym: "Формула",
          choiceParams: [
            {
              name: "parent",
              path: [
                "3220e25a-ffcd-11e5-8303-e67fda7f6b46",
                "3220e251-ffcd-11e5-8303-e67fda7f6b46",
                "33bb8f4e-04e0-11ed-8e44-be0a92ebdb41",
                "3220e259-ffcd-11e5-8303-e67fda7f6b46"
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
        transfer_option: {
          synonym: "Перенос опер.",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.transfer_operations_options"
            ]
          }
        },
        overmeasure: {
          synonym: "Припуск",
          tooltip: "Учитывать припуск длины элемента (например, на сварку)",
            type: {
            types: [
              "boolean"
            ]
          }
        }
      }
    }
  },
  mdm: true,
  cachable: "ram",
  id: "cnn",
}
