
export const meta= {
  name: "пзПараметрыПродукции",
  synonym: "Параметры продукции",
  illustration: "Настройки системы профилей и фурнитуры",
  objPresentation: "Система",
  listPresentation: "Параметры продукции",
  inputBy: [
    "name",
    "id"
  ],
  hierarchical: true,
  hasOwners: false,
  groupHierarchy: true,
  mainPresentation: "name",
  codeLength: 9,
  id: "sys",
  aliases: ['production_params'],
  fields: {
    "default_clr": {
      synonym: "Осн цвет",
      multiline: false,
      tooltip: "Цвет изделия по умолчанию. Если указана цветогруппа, дожен входить в отбор. Иначе, используется первый цвет цветогруппы",
      choiceGrp: "elm",
      type: {
        types: [
          "string",
          "cat.clrs"
        ],
        strLen: 72,
        "strFix": true
      }
    },
    "clr_group": {
      synonym: "Доступность цветов",
      multiline: false,
      tooltip: "Группа цветов, доступных для профилей системы",
      choiceParams: [
        {
          name: "color_price_group_destination",
          path: "ДляОграниченияДоступности"
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.color_price_groups"
        ]
      }
    },
    "template": {
      synonym: "Это вложенное изделие ",
      multiline: false,
      tooltip: "Система для вложенных изделий",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    "flap_pos_by_impost": {
      synonym: "Положение ств. по импостам.",
      multiline: false,
      tooltip: "Использовать положения Центр, Центр вертикаль и Центр горизонталь для створок",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    "flap_weight_max": {
      synonym: "Фильтр по тяжелой створке",
      multiline: false,
      tooltip: "Использовать в фильтре фурнитуры массу самой тяжелой створки изделия, вместо текущей створки",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    "formula": {
      synonym: "График размеров",
      multiline: false,
      tooltip: "",
      choiceParams: [
        {
          name: "parent",
          path: "33bb8f4e-04e0-11ed-8e44-be0a92ebdb41"
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.formulas"
        ]
      }
    },
    "jx": {
      synonym: "Момент инерции, см⁴",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "number"
        ],
        "digits": 6,
        "fraction": 0
      }
    },
    "e": {
      synonym: "Mодуль упругости, кгс/см²",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "number"
        ],
        "digits": 10,
        "fraction": 0
      }
    },
    "c": {
      synonym: "Аэродинамический коэффициент",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "number"
        ],
        "digits": 8,
        "fraction": 2
      }
    },
    "g": {
      synonym: "Коэффициент надежности",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "number"
        ],
        "digits": 8,
        "fraction": 2
      }
    },
    "f": {
      synonym: "Допустимый прогиб, см",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "number"
        ],
        "digits": 8,
        "fraction": 2
      }
    },
    "check_static": {
      synonym: "Рассчитывать статические нагрузки",
      multiline: false,
      tooltip: "Анализировать прочность и выводить сообщения на эскизе",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    "show_flipped": {
      synonym: "Показывать перевёрнутость",
      multiline: false,
      tooltip: "Показывать реквизит перевёрнутости слоя",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    "show_ii": {
      synonym: "Показывать ошибку примыкания",
      multiline: false,
      tooltip: "Показывать ошибку примыкания слоёв в изделиях с несколькими рамными слоями",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    "glass_thickness": {
      synonym: "Фильтр толщин заполнений",
      multiline: false,
      tooltip: "0 - по толщинам из списка\n1 - по списку\n2 - по вилке толщин (min max)\n3 - без ограничений",
      type: {
        types: [
          "number"
        ],
        "digits": 1,
        "fraction": 0
      }
    },
    "furn_level": {
      synonym: "Слой фурнитуры min",
      multiline: false,
      tooltip: "Минимальный уровень вложенности, на котором разрешена фурнитура",
      type: {
        types: [
          "number"
        ],
        "digits": 1,
        "fraction": 0
      }
    },
    "base_clr": {
      synonym: "Цвет основы",
      multiline: false,
      tooltip: "Параметр, используемый в данной системе, как цвет основы",
      choiceGrp: "elm",
      type: {
        types: [
          "cch.properties"
        ]
      }
    },
    "sketch_view": {
      synonym: "Вид на эскиз",
      multiline: false,
      tooltip: "Вид по умолчанию",
      choiceGrp: "elm",
      type: {
        types: [
          "enm.sketch_view"
        ]
      }
    },
    "production_kind": {
      synonym: "Вид производства",
      multiline: false,
      tooltip: "Для продукции, определяет состав и последовательность этапов",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.production_kinds"
        ]
      }
    },
    "outline": {
      synonym: "Эскиз",
      multiline: false,
      tooltip: "Картинка для формы выбора",
      choiceParams: [
        {
          name: "obj_delivery_state",
          path: "Шаблон"
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.characteristics",
          "cat.elm_visualization"
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
        strLen: 0
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
    "parent": {
      synonym: "Группа",
      multiline: false,
      tooltip: "Стандартная иерархия",
      type: {
        types: [
          "cat.production_params"
        ]
      }
    }
  },
  tabulars: {
    "elmnts": {
      name: "Элементы",
      synonym: "Элементы",
      tooltip: "Типовые рама, створка, импост и заполнение для данной системы",
      fields: {
        "by_default": {
          synonym: "По умолчанию",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "elm_type": {
          synonym: "Тип элемента",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "ref",
              path: [
                "Рама",
                "Створка",
                "Импост",
                "Штульп",
                "Заполнение",
                "Раскладка",
                "Добор",
                "Соединитель",
                "Москитка",
                "Водоотлив",
                "Стекло",
                "СтворкаБИ",
                "Примыкание",
                "Разрыв",
                "Штапик"
              ]
            }
          ],
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.elm_types"
            ]
          }
        },
        "key": {
          synonym: "Ключ",
          multiline: false,
          tooltip: "Если указано, фильтрует строку",
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
        "nom": {
          synonym: "Вставка",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "list",
              path: 1
            }
          ],
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.inserts",
              "cch.predefined_elmnts"
            ]
          }
        },
        "clr": {
          synonym: "Цвет",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.clrs"
            ]
          }
        },
        "pos": {
          synonym: "Положение",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "ref",
              path: [
                "Лев",
                "Прав",
                "Верх",
                "Низ",
                "ЦентрВертикаль",
                "ЦентрГоризонталь",
                "Центр",
                "Любое"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.positions"
            ]
          }
        }
      }
    },
    "production": {
      name: "Продукция",
      synonym: "Продукция",
      tooltip: "",
      fields: {
        "nom": {
          synonym: "Номенклатура",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.nom"
            ]
          }
        },
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
        },
        "value": {
          synonym: "Значение",
          multiline: false,
          tooltip: "",
          "choiceLinks": [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "production",
                "param"
              ]
            }
          ],
          choiceGrp: "elm",
          "choiceType": {
            path: [
              "production",
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
            strLen: 1024,
            "datePart": "date_time",
            "digits": 15,
            "fraction": 3
          }
        }
      }
    },
    "product_params": {
      name: "ПараметрыИзделия",
      synonym: "Параметры изделия",
      tooltip: "Значения параметров изделия по умолчанию",
      fields: {
        "param": {
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
        "value": {
          synonym: "Значение",
          multiline: false,
          tooltip: "",
          "choiceLinks": [
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
          "choiceType": {
            path: [
              "product_params",
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
            strLen: 1024,
            "datePart": "date_time",
            "digits": 15,
            "fraction": 3
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
        "forcibly": {
          synonym: "Принудительно",
          multiline: false,
          tooltip: "Замещать установленное ранее значение при перевыборе системы",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "elm": {
          synonym: "Для элемента",
          multiline: false,
          tooltip: "Свойство может уточняться для элемента",
          type: {
            types: [
              "boolean"
            ]
          }
        }
      }
    },
    "furn_params": {
      name: "ПараметрыФурнитуры",
      synonym: "Параметры фурнитуры",
      tooltip: "Значения параметров фурнитуры по умолчанию",
      fields: {
        "param": {
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
        "value": {
          synonym: "Значение",
          multiline: false,
          tooltip: "",
          "choiceLinks": [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "furn_params",
                "param"
              ]
            }
          ],
          choiceGrp: "elm",
          "choiceType": {
            path: [
              "furn_params",
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
            strLen: 1024,
            "datePart": "date_time",
            "digits": 15,
            "fraction": 3
          }
        },
        hide: {
          synonym: "Скрыть",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "forcibly": {
          synonym: "Принудительно",
          multiline: false,
          tooltip: "Замещать установленное ранее значение при перевыборе системы",
          type: {
            types: [
              "boolean"
            ]
          }
        }
      }
    },
    "params": {
      name: "Параметры",
      synonym: "Параметры номенклатур",
      tooltip: "Умолчания характеристик материалов",
      fields: {
        "param": {
          synonym: "Параметр",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.nom"
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
                "selection",
                "owner"
              ],
              path: [
                "params",
                "param"
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
        "forcibly": {
          synonym: "Принудительно",
          multiline: false,
          tooltip: "Замещать установленное ранее значение при перевыборе системы",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "elm": {
          synonym: "Для элемента",
          multiline: false,
          tooltip: "Свойство может уточняться для элемента",
          type: {
            types: [
              "boolean"
            ]
          }
        }
      }
    },
    "colors": {
      name: "Цвета",
      synonym: "Цвета не красить",
      tooltip: "Список цветов с учётом цвета основы, для которых не требуется вклад в спецификацию",
      fields: {
        "base_clr": {
          synonym: "Цвет основы",
          multiline: false,
          tooltip: "Имеет смысл, если цвет, не требующий отработки, зависит от цвета основы",
          "choiceLinks": [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "base_clr"
              ]
            }
          ],
          choiceGrp: "elm",
          "choiceType": {
            path: [
              "base_clr"
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
            strLen: 1024,
            "datePart": "date_time",
            "digits": 15,
            "fraction": 3
          }
        },
        "clr": {
          synonym: "Цвет",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "string",
              "cat.clrs"
            ],
            strLen: 72,
            "strFix": true
          }
        }
      }
    },
    "extra_fields": {
      name: "ДополнительныеРеквизиты",
      synonym: "Дополнительные реквизиты",
      tooltip: "Набор реквизитов, состав которого определяется компанией.",
      fields: {
        "property": {
          synonym: "Свойство",
          multiline: false,
          tooltip: "Дополнительный реквизит",
          choiceGrp: "elm",
          type: {
            types: [
              "cch.properties"
            ]
          }
        },
        "value": {
          synonym: "Значение",
          multiline: false,
          tooltip: "Значение дополнительного реквизита",
          "choiceLinks": [
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
          "choiceType": {
            path: [
              "extra_fields",
              "property"
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
            strLen: 1024,
            "datePart": "date_time",
            "digits": 15,
            "fraction": 3
          }
        },
        "txt_row": {
          synonym: "Текстовая строка",
          multiline: false,
          tooltip: "Полный текст строкового дополнительного реквизита",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        }
      }
    },
    "templates": {
      name: "Шаблоны",
      synonym: "Шаблоны",
      tooltip: "",
      fields: {
        "template": {
          synonym: "Шаблон",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "obj_delivery_state",
              path: "Шаблон"
            }
          ],
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "doc.calc_order"
            ]
          }
        }
      }
    },
    "color_price_groups": {
      name: "ЦветоЦеновыеГруппы",
      synonym: "Доступность цветов",
      tooltip: "",
      fields: {
        "base_clr": {
          synonym: "Цвет основы",
          multiline: false,
          tooltip: "Значение цвета основы",
          "choiceLinks": [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "base_clr"
              ]
            }
          ],
          choiceGrp: "elm",
          "choiceType": {
            path: [
              "base_clr"
            ],
            "elm": 0
          },
          mandatory: true,
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
            "datePart": "date_time",
            "digits": 15,
            "fraction": 3
          }
        },
        "clr_group": {
          synonym: "Доступность цветов",
          multiline: false,
          tooltip: "Группа цветов, доступных для данного цвета основы",
          choiceParams: [
            {
              name: "color_price_group_destination",
              path: "ДляОграниченияДоступности"
            }
          ],
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.color_price_groups"
            ]
          }
        }
      }
    }
  },
  cachable: "ram"
}
