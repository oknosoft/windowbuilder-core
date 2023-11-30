
export const meta= {
  name: "Вставки",
  splitted: false,
  synonym: "Вставки",
  illustration: "Армирование, пленки, вставки - дополнение спецификации, которое зависит от элемента и произвольных параметров",
  objPresentation: "Вставка",
  listPresentation: "Вставки",
  inputBy: ["name", "id"],
  hierarchical: false,
  hasOwners: false,
  groupHierarchy: false,
  mainPresentation: "name",
  codeLength: 9,
  id: "ins",
  mdm: true,
  fields: {
    article: {
      synonym: "Артикул ",
      multiline: false,
      tooltip: "Для формулы",
      type: {
        types: [
          "string"
        ],
        strLen: 100
      }
    },
    insert_type: {
      synonym: "Тип вставки",
      multiline: false,
      tooltip: "Используется, как фильтр в интерфейсе, плюс, от типа вставки могут зависеть алгоритмы расчета количеств и углов",
      choiceGrp: "elm",
      mandatory: true,
      type: {
        types: [
          "enm.insertsTypes"
        ]
      }
    },
    clr: {
      synonym: "Цвет",
      multiline: false,
      tooltip: "Вставку можно использовать для элементов с этим цветом",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.clrs"
        ]
      }
    },
    lmin: {
      synonym: "X min",
      multiline: false,
      tooltip: "X min (длина или ширина)",
      type: {
        types: [
          "number"
        ],
        digits: 6,
        fraction: 0
      }
    },
    lmax: {
      synonym: "X max",
      multiline: false,
      tooltip: "X max (длина или ширина)",
      type: {
        types: [
          "number"
        ],
        digits: 6,
        fraction: 0
      }
    },
    hmin: {
      synonym: "Y min",
      multiline: false,
      tooltip: "Y min (высота)",
      type: {
        types: [
          "number"
        ],
        digits: 6,
        fraction: 0
      }
    },
    hmax: {
      synonym: "Y max",
      multiline: false,
      tooltip: "Y max (высота)",
      type: {
        types: [
          "number"
        ],
        digits: 6,
        fraction: 0
      }
    },
    smin: {
      synonym: "S min",
      multiline: false,
      tooltip: "Площадь min",
      type: {
        types: [
          "number"
        ],
        digits: 8,
        fraction: 3
      }
    },
    smax: {
      synonym: "S max",
      multiline: false,
      tooltip: "Площадь max",
      type: {
        types: [
          "number"
        ],
        digits: 8,
        fraction: 3
      }
    },
    for_direct_profile_only: {
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
    },
    ahmin: {
      synonym: "α min",
      multiline: false,
      tooltip: "AH min (угол к горизонтали)",
      max: 360,
      min: -360,
      type: {
        types: [
          "number"
        ],
        digits: 8,
        fraction: 2
      }
    },
    ahmax: {
      synonym: "α max",
      multiline: false,
      tooltip: "AH max (угол к горизонтали)",
      max: 360,
      min: -360,
      type: {
        types: [
          "number"
        ],
        digits: 8,
        fraction: 2
      }
    },
    priority: {
      synonym: "Приоритет",
      multiline: false,
      tooltip: "Не используется",
      type: {
        types: [
          "number"
        ],
        digits: 6,
        fraction: 0
      }
    },
    mmin: {
      synonym: "Масса min",
      multiline: false,
      tooltip: "M min (масса)",
      type: {
        types: [
          "number"
        ],
        digits: 6,
        fraction: 0
      }
    },
    mmax: {
      synonym: "Масса max",
      multiline: false,
      tooltip: "M max (масса)",
      type: {
        types: [
          "number"
        ],
        digits: 6,
        fraction: 0
      }
    },
    can_rotate: {
      synonym: "Можно поворачивать",
      multiline: false,
      tooltip: "Используется при контроле размеров",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    sizeb: {
      synonym: "Размер \"B\"",
      multiline: false,
      tooltip: "Можно указать\n- размер в мм\n- половину ширины номенклатуры элемента\n- \"B\" из номенклатуры элемента\n- пару чисел [для импоста]/[для рамы], когда одна вставка используется в разных положениях",
      type: {
        types: [
          "number"
        ],
        digits: 8,
        fraction: 2
      }
    },
    clr_group: {
      synonym: "Доступность цветов",
      multiline: false,
      tooltip: "Если указано, выбор цветов будет ограничен этой группой",
      choiceParams: [
        {
          name: "color_price_group_destination",
          path: "ДляОграниченияДоступности"
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.values_options",
          "cat.color_price_groups"
        ]
      }
    },
    is_order_row: {
      synonym: "Это строка заказа",
      multiline: false,
      tooltip: "Если заполнено, строка будет добавлена в заказ, а не в спецификацию текущей продукции",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.formulas",
          "enm.specification_order_row_types"
        ]
      }
    },
    note: {
      synonym: "Комментарий",
      "multiline_mode": true,
      tooltip: "Расширенное описание в markdown",
      type: {
        types: [
          "string"
        ],
        strLen: 0
      }
    },
    insert_glass_type: {
      synonym: "Тип вставки стп",
      multiline: false,
      tooltip: "Тип вставки стеклопакета - используется в составных и в привязках вставок",
      choiceGrp: "elm",
      type: {
        types: [
          "enm.inserts_glass_types"
        ]
      }
    },
    available: {
      synonym: "Доступна в интерфейсе",
      multiline: false,
      tooltip: "Показывать эту вставку в списках допвставок в элемент, изделие и контур",
      choiceParams: [
        {
          name: "applying",
          path: [
            "Технология",
            "ПараметрВыбора"
          ]
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "boolean",
          "cat.parameters_keys"
        ]
      }
    },
    slave: {
      synonym: "Ведомая",
      multiline: false,
      tooltip: "Выполнять пересчет спецификации этой вставки при изменении других строк заказа (например, спецификация монтажа)",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    is_supplier: {
      synonym: "Поставщик",
      multiline: false,
      tooltip: "Если указано, вставка формирует уникальную характеристику и получает цену через API поставщика",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.http_apis"
        ]
      }
    },
    region: {
      synonym: "Ряд по умолчанию",
      multiline: false,
      tooltip: "Для вставок в ряды связок - актуально для витражных и прочих составных конструкций\n0 - не ряд\n1 - ряд внутри элемента\n>1 - за элементом\n<0 - перед элементом",
      choiceGrp: "elm",
      type: {
        types: [
          "enm.lay_regions",
          "number"
        ],
        digits: 2,
        fraction: 0
      }
    },
    split_type: {
      synonym: "Тип деления",
      multiline: false,
      tooltip: "Тип деления по умолчанию",
      choiceGrp: "elm",
      type: {
        types: [
          "enm.lay_split_types",
          "string"
        ],
        strLen: 512
      }
    },
    pair: {
      synonym: "Пара",
      multiline: false,
      tooltip: "Вставка соседней раскладки",
      choiceParams: [
        {
          name: "insert_type",
          path: "Профиль"
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.inserts"
        ]
      }
    },
    lay_split_types: {
      synonym: "Единственный тип деления",
      multiline: false,
      tooltip: "Запретить изменять тип деления",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    css: {
      synonym: "Класс css",
      multiline: false,
      tooltip: "css класс картинки значения - для оживления списков выбора",
      type: {
        types: [
          "string"
        ],
        strLen: 50
      }
    },
    flipped: {
      synonym: "Перевёрнут",
      multiline: false,
      tooltip: "0 - ничего не переворачиваем\n1 - меняем углы на 180 - α\n2 - меняем b и e местами\n3 - меняем углы и b и e",
      type: {
        types: [
          "number"
        ],
        digits: 1,
        fraction: 0
      }
    },
  },
  tabulars: {
    specification: {
      name: "Спецификация",
      synonym: "Спецификация",
      tooltip: "",
      fields: {
        elm: {
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
        nom: {
          synonym: "Номенклатура",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.inserts",
              "cat.nom"
            ]
          }
        },
        algorithm: {
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
        nom_characteristic: {
          synonym: "Характеристика",
          multiline: false,
          tooltip: "",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
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
        clr: {
          synonym: "Цвет",
          multiline: false,
          tooltip: "",
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
            types: [
              "cat.color_price_groups",
              "cat.formulas",
              "cat.clrs"
            ],
            "default": "cat.clrs"
          }
        },
        quantity: {
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
        sz: {
          synonym: "Размер",
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
        coefficient: {
          synonym: "Коэфф.",
          multiline: false,
          tooltip: "коэффициент (кол-во комплектующего на 1мм профиля или 1м² заполнения)",
          type: {
            types: [
              "number"
            ],
            digits: 14,
            fraction: 8
          }
        },
        angle_calc_method: {
          synonym: "Расчет угла",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.angle_calculating_ways"
            ]
          }
        },
        count_calc_method: {
          synonym: "Расчет колич.",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.count_calculating_ways"
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
              path: [
                "3220e24b-ffcd-11e5-8303-e67fda7f6b46",
                "3220e251-ffcd-11e5-8303-e67fda7f6b46"
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
        lmin: {
          synonym: "Длина min",
          multiline: false,
          tooltip: "Минимальная длина или ширина",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        lmax: {
          synonym: "Длина max",
          multiline: false,
          tooltip: "Максимальная длина или ширина",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        ahmin: {
          synonym: "Угол min",
          multiline: false,
          tooltip: "Минимальный угол к горизонтали",
          max: 360,
          min: -360,
          type: {
            types: [
              "number"
            ],
            digits: 8,
            fraction: 2
          }
        },
        ahmax: {
          synonym: "Угол max",
          multiline: false,
          tooltip: "Максимальный угол к горизонтали",
          max: 360,
          min: -360,
          type: {
            types: [
              "number"
            ],
            digits: 8,
            fraction: 2
          }
        },
        smin: {
          synonym: "S min",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 10,
            fraction: 3
          }
        },
        smax: {
          synonym: "S max",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 10,
            fraction: 3
          }
        },
        rmin: {
          synonym: "Радиус min",
          multiline: false,
          tooltip: "Минимальный радиус",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        rmax: {
          synonym: "Радиус max",
          multiline: false,
          tooltip: "Максимальный радиус",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        for_direct_profile_only: {
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
        },
        step: {
          synonym: "Шаг",
          multiline: false,
          tooltip: "Шаг (расчет по точкам)",
          type: {
            types: [
              "number"
            ],
            digits: 10,
            fraction: 3
          }
        },
        step_angle: {
          synonym: "Угол шага",
          multiline: false,
          tooltip: "",
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
        offsets: {
          synonym: "Отступы шага / длина мmax",
          multiline: false,
          tooltip: "Для способа расчёта \"По шагам\", задаёт отступы. В остальных случаях, ограничивает длину max",
          type: {
            types: [
              "number"
            ],
            digits: 10,
            fraction: 3
          }
        },
        do_center: {
          synonym: "↔",
          multiline: false,
          tooltip: "Положение от края или от центра",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        attrs_option: {
          synonym: "Направления",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.inset_attrs_options"
            ]
          }
        },
        is_order_row: {
          synonym: "Перенос",
          multiline: false,
          tooltip: "Если заполнено, строка будет добавлена в заказ, а не в спецификацию текущей продукции",
          choiceParams: [
            {
              name: "ref",
              path: [
                "Нет",
                "Материал",
                "Продукция",
                "Комплектация",
                "Добор"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.elm_types",
              "enm.specification_order_row_types"
            ]
          }
        },
        is_main_elm: {
          synonym: "Это основной элемент",
          multiline: false,
          tooltip: "Для профильных вставок определяет номенклатуру, размеры которой будут использованы при построении эскиза",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        stage: {
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
        inset: {
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
        elm: {
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
        param: {
          synonym: "Параметр",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cch.properties"
            ]
          }
        },
        origin: {
          synonym: "Источник",
          multiline: false,
          tooltip: "",
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
              "enm.comparison_types"
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
            path: [
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
    },
    product_params: {
      name: "ПараметрыИзделия",
      synonym: "Параметры изделия",
      tooltip: "Значения по умолчанию (для параметрических изделий)",
      fields: {
        param: {
          synonym: "Параметр",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cch.properties"
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
              path: [
                "product_params",
                "param"
              ]
            }
          ],
          choiceGrp: "elm",
          choiceType: {
            path: [
              "product_params",
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
        hide: {
          synonym: "Скрыть",
          multiline: false,
          tooltip: "Не показывать строку параметра в диалоге свойств изделия",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        forcibly: {
          synonym: "Принудительно",
          multiline: false,
          tooltip: "Замещать установленное ранее значение при перевыборе системы",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        pos: {
          synonym: "Расположение",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.elm_positions"
            ]
          }
        },
        list: {
          synonym: "Дискретный ряд",
          "multiline_mode": true,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        }
      }
    },
    inserts: {
      name: "Вставки",
      synonym: "Доп. вставки",
      tooltip: "Дополнительные рекомендуемые вставки в элемент",
      fields: {
        inset: {
          synonym: "Рекомендуемая доп. вставка",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "insert_type",
              path: [
                "Элемент",
                "Профиль",
                "Заполнение"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.inserts"
            ]
          }
        },
        key: {
          synonym: "Ключ",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "applying",
              path: [
                "Технология",
                "ПараметрВыбора"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.parameters_keys"
            ]
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
        }
      }
    }
  },
  "cachable": "ram"
};


