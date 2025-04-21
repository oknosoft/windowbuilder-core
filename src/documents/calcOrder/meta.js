
export const meta= {
  name: "Расчет",
  splitted: false,
  synonym: "Расчет-заказ",
  illustration: "Аналог заказа покупателя типовых конфигураций.\nСодержит инструменты для формирования спецификаций и подготовки данных производства и диспетчеризации",
  objPresentation: "Расчет-заказ",
  listPresentation: "Расчеты-заказы",
  inputBy: [
    "number_doc",
    "number_internal"
  ],
  mainPresentation: "name",
  codeLength: 11,
  id: "co",
  fields: {
    number_internal: {
      synonym: "Номер внутр",
      multiline: false,
      tooltip: "Дополнительный (внутренний) номер документа",
      type: {
        types: [
          "string"
        ],
        strLen: 20
      }
    },
    project: {
      synonym: "Проект",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.projects"
        ]
      }
    },
    organization: {
      synonym: "Организация",
      multiline: false,
      tooltip: "",
      choiceParams: [
        {
          name: "is_folder",
          path: false
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.organizations"
        ]
      }
    },
    partner: {
      synonym: "Контрагент",
      multiline: false,
      tooltip: "",
      choiceParams: [
        {
          name: "is_buyer",
          path: true
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.partners"
        ]
      }
    },
    client_of_dealer: {
      synonym: "Клиент дилера",
      multiline: false,
      tooltip: "Наименование конечного клиента в дилерских заказах",
      type: {
        types: [
          "string"
        ],
        strLen: 255
      }
    },
    contract: {
      synonym: "Договор контрагента",
      multiline: false,
      tooltip: "",
      choiceLinks: [
        {
          name: [
            "selection",
            "owner"
          ],
          path: [
            "partner"
          ]
        },
        {
          name: [
            "selection",
            "organization"
          ],
          path: [
            "organization"
          ]
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.contracts"
        ]
      }
    },
    bank_account: {
      synonym: "Банковский счет",
      multiline: false,
      tooltip: "Банковский счет организации, на который планируется поступление денежных средств",
      choiceLinks: [
        {
          name: [
            "selection",
            "owner"
          ],
          path: [
            "organization"
          ]
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.partner_bank_accounts"
        ]
      }
    },
    note: {
      synonym: "Комментарий",
      multiline: false,
      tooltip: "Дополнительная информация",
      type: {
        types: [
          "string"
        ],
        strLen: 255
      }
    },
    manager: {
      synonym: "Менеджер",
      multiline: false,
      tooltip: "Менеджер, оформивший заказ, автор",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.users"
        ]
      }
    },
    leading_manager: {
      synonym: "Ведущий менеджер",
      multiline: false,
      tooltip: "Куратор, ведущий менеджер, ответственный",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.users"
        ]
      }
    },
    department: {
      synonym: "Офис продаж",
      multiline: false,
      tooltip: "Подразделение продаж",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.divisions"
        ]
      }
    },
    warehouse: {
      synonym: "Склад",
      multiline: false,
      tooltip: "Предполагаемый склад отгрузки товаров по заказу",
      type: {
        types: [
          "cat.stores"
        ]
      }
    },
    doc_amount: {
      synonym: "Сумма документа",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "number"
        ],
        "digits": 15,
        "fraction": 2
      }
    },
    amount_operation: {
      synonym: "Сумма упр",
      multiline: false,
      tooltip: "Сумма в валюте управленческого учета",
      type: {
        types: [
          "number"
        ],
        "digits": 15,
        "fraction": 2
      }
    },
    amount_internal: {
      synonym: "Сумма внутр.",
      multiline: false,
      tooltip: "Сумма внутренней реализации",
      type: {
        types: [
          "number"
        ],
        "digits": 15,
        "fraction": 2
      }
    },
    phone: {
      synonym: "Телефон",
      multiline: false,
      tooltip: "Телефон по адресу доставки",
      type: {
        types: [
          "string"
        ],
        strLen: 100
      }
    },
    delivery_area: {
      synonym: "Район",
      multiline: false,
      tooltip: "Район (зона, направление) доставки для группировки при планировании и оптимизации маршрута геокодером",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.delivery_areas"
        ]
      }
    },
    shipping_address: {
      synonym: "Адрес доставки",
      multiline: false,
      tooltip: "Адрес доставки изделий заказа",
      type: {
        types: [
          "string"
        ],
        strLen: 255
      }
    },
    coordinates: {
      synonym: "Координаты",
      multiline: false,
      tooltip: "Гео - координаты адреса доставки",
      type: {
        types: [
          "string"
        ],
        strLen: 50
      }
    },
    address_fields: {
      synonym: "Значения полей адреса",
      multiline: false,
      tooltip: "Служебный реквизит",
      type: {
        types: [
          "string"
        ],
        strLen: 0
      }
    },
    weight: {
      synonym: "Масса, кг",
      multiline: false,
      tooltip: "Масса всех изделий заказа",
      type: {
        types: [
          "number"
        ],
        "digits": 10,
        "fraction": 4
      }
    },
    vat_consider: {
      synonym: "Учитывать НДС",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    vat_included: {
      synonym: "Сумма включает НДС",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    settlements_course: {
      synonym: "Курс взаиморасчетов",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "number"
        ],
        "digits": 10,
        "fraction": 4
      }
    },
    settlements_multiplicity: {
      synonym: "Кратность взаиморасчетов",
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
    extra_charge_external: {
      synonym: "Наценка внешн.",
      multiline: false,
      tooltip: "Наценка внешней (дилерской) продажи по отношению к цене производителя, %.",
      type: {
        types: [
          "number"
        ],
        "digits": 5,
        "fraction": 2
      }
    },
    obj_delivery_state: {
      synonym: "Этап согласования",
      multiline: false,
      tooltip: "",
      choiceParams: [
        {
          name: "ref",
          path: [
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
    category: {
      synonym: "Категория заказа",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "enm.order_categories"
        ]
      }
    },
    sending_stage: {
      synonym: "Этап отправки",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "enm.order_sending_stages"
        ]
      }
    },
    basis: {
      synonym: "Документ основание",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "doc.calc_order"
        ]
      }
    },
    lead: {
      synonym: "Лид",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.leads"
        ]
      }
    },
    approval: {
      synonym: "Согласие на обработку перс. данных",
      multiline: false,
      tooltip: "Получено согласие на обработку персональных данных",
      type: {
        types: [
          "boolean"
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
        strLen: 512
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
    }
  },
  tabulars: {
    production: {
      name: "Продукция",
      synonym: "Продукция",
      tooltip: "",
      fields: {
        nom: {
          synonym: "Номенклатура",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.nom"
            ]
          }
        },
        characteristic: {
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
                "production",
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
        quantity: {
          synonym: "Количество",
          multiline: false,
          tooltip: "",
          "min": 0,
          type: {
            types: [
              "number"
            ],
            "digits": 14,
            "fraction": 3
          }
        },
        unit: {
          synonym: "Ед.",
          multiline: false,
          tooltip: "Единица измерения",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "production",
                "nom"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.nom_units"
            ]
          }
        },
        qty: {
          synonym: "Количество, шт",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 14,
            "fraction": 6
          }
        },
        first_cost: {
          synonym: "Себест. ед.",
          multiline: false,
          tooltip: "Плановая себестоимость единицы продукции",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 4
          }
        },
        marginality: {
          synonym: "К. марж",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 5,
            "fraction": 3
          }
        },
        price: {
          synonym: "Цена",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 2
          }
        },
        discount_percent: {
          synonym: "Скидка %",
          multiline: false,
          tooltip: "",
          "max": 100,
          type: {
            types: [
              "number"
            ],
            "digits": 5,
            "fraction": 2
          }
        },
        discount: {
          synonym: "Скидка",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 2
          }
        },
        amount: {
          synonym: "Сумма",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 2
          }
        },
        margin: {
          synonym: "Маржа",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 2
          }
        },
        discount_percent_internal: {
          synonym: "Скидка внутр. %",
          multiline: false,
          tooltip: "Процент скидки для внутренней перепродажи (холдинг) или внешней (дилеры)",
          "max": 100,
          type: {
            types: [
              "number"
            ],
            "digits": 5,
            "fraction": 2
          }
        },
        extra_charge_external: {
          synonym: "Наценка %",
          multiline: false,
          tooltip: "Процент наценки для внешней продажи (от дилера конечному покупателю)",
          type: {
            types: [
              "number"
            ],
            "digits": 5,
            "fraction": 2
          }
        },
        price_internal: {
          synonym: "Цена внутр.",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 2
          }
        },
        amount_internal: {
          synonym: "Сумма внутр.",
          multiline: false,
          tooltip: "Сумма внутренней реализации (холдинг) или внешней (от дилера конечному клиенту)",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 2
          }
        },
        vat_rate: {
          synonym: "Ставка НДС",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.vat_rates"
            ]
          }
        },
        vat_amount: {
          synonym: "Сумма НДС",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 2
          }
        },
        ordn: {
          synonym: "Ведущая продукция",
          multiline: false,
          tooltip: "ссылка на продукциию, к которой относится материал",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.characteristics"
            ]
          }
        },
        changed: {
          synonym: "Запись изменена",
          multiline: false,
          tooltip: "Запись изменена\n- оператором (1, -2)\n- добавлена корректировкой спецификации (-1)\n- добавлена раскроем (-3)",
          type: {
            types: [
              "number"
            ],
            "digits": 1,
            "fraction": 0
          }
        }
      }
    },
    extra_fields: {
      name: "ДополнительныеРеквизиты",
      synonym: "Дополнительные реквизиты",
      tooltip: "",
      fields: {
        property: {
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
        value: {
          synonym: "Значение",
          multiline: false,
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
            path: [
              "extra_fields",
              "property"
            ],
            elm: 0
          },
          type: {
            types: [
              "enm.sketch_view",
              "cat.nomGroups",
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
        txt_row: {
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
    contact_information: {
      name: "КонтактнаяИнформация",
      synonym: "Контактная информация",
      tooltip: "Хранение контактной информации (адреса, веб-страницы, номера телефонов и др.)",
      fields: {
        type: {
          synonym: "Тип",
          multiline: false,
          tooltip: "Тип контактной информации (телефон, адрес и т.п.)",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.contact_information_types"
            ]
          }
        },
        kind: {
          synonym: "Вид",
          multiline: false,
          tooltip: "Вид контактной информации",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.contact_information_kinds"
            ]
          }
        },
        presentation: {
          synonym: "Представление",
          multiline: false,
          tooltip: "Представление контактной информации для отображения в формах",
          type: {
            types: [
              "string"
            ],
            strLen: 500
          }
        },
        values_fields: {
          synonym: "Значения полей",
          multiline: false,
          tooltip: "Служебное поле, для хранения контактной информации",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        country: {
          synonym: "Страна",
          multiline: false,
          tooltip: "Страна (заполняется для адреса)",
          type: {
            types: [
              "string"
            ],
            strLen: 100
          }
        },
        region: {
          synonym: "Регион",
          multiline: false,
          tooltip: "Регион (заполняется для адреса)",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        city: {
          synonym: "Город",
          multiline: false,
          tooltip: "Город (заполняется для адреса)",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        email_address: {
          synonym: "Адрес ЭП",
          multiline: false,
          tooltip: "Адрес электронной почты",
          type: {
            types: [
              "string"
            ],
            strLen: 100
          }
        },
        phone_number: {
          synonym: "Номер телефона",
          multiline: false,
          tooltip: "Полный номер телефона",
          type: {
            types: [
              "string"
            ],
            strLen: 20
          }
        },
        phone_without_codes: {
          synonym: "Номер телефона без кодов",
          multiline: false,
          tooltip: "Номер телефона без кодов и добавочного номера",
          type: {
            types: [
              "string"
            ],
            strLen: 20
          }
        }
      }
    },
    planning: {
      name: "Планирование",
      synonym: "Планирование",
      tooltip: "",
      fields: {
        "phase": {
          synonym: "Фаза",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.planning_phases"
            ]
          }
        },
        date: {
          synonym: "Дата",
          multiline: false,
          tooltip: "Плановая дата доставки или начала операции",
          type: {
            types: [
              "date"
            ],
            "datePart": "date"
          }
        },
        key: {
          synonym: "Ключ",
          multiline: false,
          tooltip: "Ключ или вид РЦ",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.parameters_keys",
              "cat.work_center_kinds"
            ]
          }
        },
        obj: {
          synonym: "Объект",
          multiline: false,
          tooltip: "",
          choiceLinks: [
            {
              name: [
                "selection",
                "calc_order"
              ],
              path: [
                "ref"
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
        specimen: {
          synonym: "Экземпляр",
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
        elm: {
          synonym: "Элемент",
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
        power: {
          synonym: "Мощность",
          multiline: false,
          tooltip: "Трудоемкость или время операции",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        }
      }
    },
    orders: {
      name: "Заказы",
      synonym: "Заказы поставщикам",
      tooltip: "",
      fields: {
        is_supplier: {
          synonym: "Поставщик",
          multiline: false,
          tooltip: "Поставщики с внешним API",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.http_apis"
            ]
          }
        },
        invoice: {
          synonym: "Заказ",
          multiline: false,
          tooltip: "Заказ между заводом и торговым домом",
          choiceGrp: "elm",
          type: {
            types: [
              "doc.purchase_order"
            ]
          }
        }
      }
    }
  },
  hashable: true,
  cachable: "doc",
  aliases: ['calc_order'],
};


