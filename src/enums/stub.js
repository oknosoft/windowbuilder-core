
/*
  id и aliases в перечисление
 */
const tmp = {
  "enm": {
    
    "mutual_contract_settlements": [
      {
        order: 0,
        name: "ПоДоговоруВЦелом",
        synonym: "По договору в целом"
      },
      {
        order: 1,
        name: "ПоЗаказам",
        synonym: "По заказам"
      },
      {
        order: 2,
        name: "ПоСчетам",
        synonym: "По счетам"
      },
      {
        tag: "Ведение взаиморасчетов по договорам"
      }
    ],
    "debit_credit_kinds": [
      {
        order: 0,
        name: "Приход",
        synonym: "Приход",
        latin: "debit"
      },
      {
        order: 1,
        name: "Расход",
        synonym: "Расход",
        latin: "credit"
      },
      {
        tag: "Виды движений приход/расход"
      }
    ],
    "contract_kinds": [
      {
        order: 0,
        name: "СПоставщиком",
        synonym: "С поставщиком"
      },
      {
        order: 1,
        name: "СПокупателем",
        synonym: "С покупателем"
      },
      {
        order: 2,
        name: "СКомитентом",
        synonym: "С комитентом",
        latin: "committent"
      },
      {
        order: 3,
        name: "СКомиссионером",
        synonym: "С комиссионером",
        latin: "commission_agent"
      },
      {
        order: 4,
        name: "Прочее",
        synonym: "Прочее"
      },
      {
        tag: "Виды договоров контрагентов"
      }
    ],
    "inventory_kinds": [
      {
        order: 0,
        name: "Инвентаризация",
        synonym: "Инвентаризация"
      },
      {
        order: 1,
        name: "Оприходование",
        synonym: "Оприходование"
      },
      {
        order: 2,
        name: "Списание",
        synonym: "Списание"
      },
      {
        order: 3,
        name: "ИнвТек",
        synonym: "Инвентаризация текущих"
      },
      {
        tag: "Виды операций инвентаризации"
      }
    ],
    "use_cut": [
      {
        order: 0,
        name: "none",
        synonym: "Не учитывать"
      },
      {
        order: 1,
        name: "all",
        synonym: "Учитывать"
      },
      {
        order: 2,
        name: "input",
        synonym: "Только входящую"
      },
      {
        order: 3,
        name: "output",
        synonym: "Только исходящую"
      },
      {
        tag: "Использование обрези",
        description: "Варианты использования деловой обрези"
      }
    ],
    "rounding_quantity": [
      {
        order: 0,
        name: "БезОптимизации",
        synonym: "Без оптимизации",
        latin: "none"
      },
      {
        order: 1,
        name: "РаскройДоХлыста",
        synonym: "Раскрой до хлыста",
        latin: "stick"
      },
      {
        order: 2,
        name: "РаскройДоУпаковки",
        synonym: "Раскрой до упаковки",
        latin: "packing"
      },
      {
        "default": "none"
      },
      {
        tag: "Округлять количество"
      }
    ],
    "gender": [
      {
        order: 0,
        name: "Мужской",
        synonym: "Мужской"
      },
      {
        order: 1,
        name: "Женский",
        synonym: "Женский"
      },
      {
        tag: "Пол физических Лиц"
      }
    ],
    "elm_positions": [
      {
        order: 0,
        name: "top",
        synonym: "Шапка"
      },
      {
        order: 1,
        name: "column1",
        synonym: "Колонка 1"
      },
      {
        order: 2,
        name: "column2",
        synonym: "Колонка 2"
      },
      {
        order: 3,
        name: "column3",
        synonym: "Колонка 3"
      },
      {
        order: 4,
        name: "bottom",
        synonym: "Подвал"
      },
      {
        tag: "Расположение элементов управления"
      }
    ],
    "nested_object_editing_mode": [
      {
        order: 0,
        name: "string",
        synonym: "Строка"
      },
      {
        order: 1,
        name: "frm",
        synonym: "Форма"
      },
      {
        order: 2,
        name: "both",
        synonym: "Строка и форма"
      },
      {
        tag: "Режим редактирования вложенного объекта"
      }
    ],
    "buyers_order_states": [
      {
        order: 0,
        name: "ОжидаетсяСогласование",
        synonym: "Ожидается согласование"
      },
      {
        order: 1,
        name: "ОжидаетсяАвансДоОбеспечения",
        synonym: "Ожидается аванс (до обеспечения)"
      },
      {
        order: 2,
        name: "ГотовКОбеспечению",
        synonym: "Готов к обеспечению"
      },
      {
        order: 3,
        name: "ОжидаетсяПредоплатаДоОтгрузки",
        synonym: "Ожидается предоплата (до отгрузки)"
      },
      {
        order: 4,
        name: "ОжидаетсяОбеспечение",
        synonym: "Ожидается обеспечение"
      },
      {
        order: 5,
        name: "ГотовКОтгрузке",
        synonym: "Готов к отгрузке"
      },
      {
        order: 6,
        name: "ВПроцессеОтгрузки",
        synonym: "В процессе отгрузки"
      },
      {
        order: 7,
        name: "ОжидаетсяОплатаПослеОтгрузки",
        synonym: "Ожидается оплата (после отгрузки)"
      },
      {
        order: 8,
        name: "ГотовКЗакрытию",
        synonym: "Готов к закрытию"
      },
      {
        order: 9,
        name: "Закрыт",
        synonym: "Закрыт"
      },
      {
        tag: "Состояния заказов клиентов"
      }
    ],
    "application_joint_kinds": [
      {
        order: 0,
        name: "Сумма",
        synonym: "Скидка (наценка) суммой на документ"
      },
      {
        order: 1,
        name: "СуммаДляКаждойСтроки",
        synonym: "Скидка (наценка) суммой для каждой строки"
      },
      {
        order: 2,
        name: "Количество",
        synonym: "Скидка количеством"
      },
      {
        order: 3,
        name: "Процент",
        synonym: "Скидка (наценка) процентом"
      },
      {
        order: 4,
        name: "ВидЦены",
        synonym: "Специальная цена"
      },
      {
        order: 5,
        name: "Сообщение",
        synonym: "Выдача сообщения"
      },
      {
        order: 6,
        name: "КартаЛояльности",
        synonym: "Выдача карты лояльности"
      },
      {
        order: 7,
        name: "Подарок",
        synonym: "Подарок"
      },
      {
        order: 8,
        name: "ОкруглениеСуммы",
        synonym: "Округление суммы документа"
      },
      {
        tag: "Способы предоставления скидок наценок"
      }
    ],
    "vat_rates": [
      {
        order: 0,
        name: "НДС18",
        synonym: "18%"
      },
      {
        order: 1,
        name: "НДС18_118",
        synonym: "18% / 118%"
      },
      {
        order: 2,
        name: "НДС10",
        synonym: "10%"
      },
      {
        order: 3,
        name: "НДС10_110",
        synonym: "10% / 110%"
      },
      {
        order: 4,
        name: "НДС0",
        synonym: "0%"
      },
      {
        order: 5,
        name: "БезНДС",
        synonym: "Без НДС"
      },
      {
        order: 6,
        name: "НДС20",
        synonym: "20%"
      },
      {
        order: 7,
        name: "НДС20_120",
        synonym: "20% / 120%"
      },
      {
        tag: "Ставки НДС"
      }
    ],
    "contact_information_types": [
      {
        order: 0,
        name: "Адрес",
        synonym: "Адрес"
      },
      {
        order: 1,
        name: "Телефон",
        synonym: "Телефон"
      },
      {
        order: 2,
        name: "АдресЭлектроннойПочты",
        synonym: "Адрес электронной почты"
      },
      {
        order: 3,
        name: "ВебСтраница",
        synonym: "Веб страница"
      },
      {
        order: 4,
        name: "Факс",
        synonym: "Факс"
      },
      {
        order: 5,
        name: "Другое",
        synonym: "Другое"
      },
      {
        order: 6,
        name: "Skype",
        synonym: "Skype"
      },
      {
        tag: "Типы контактной информации"
      }
    ],
    "lead_types": [
      {
        order: 0,
        name: "email",
        synonym: "Электронная почта"
      },
      {
        order: 1,
        name: "social",
        synonym: "Социальная сеть"
      },
      {
        order: 2,
        name: "phone",
        synonym: "Телефон"
      },
      {
        order: 3,
        name: "visit",
        synonym: "Визит"
      },
      {
        order: 4,
        name: "site",
        synonym: "Сайт"
      },
      {
        tag: "Типы лидов"
      }
    ],
    "sz_line_types": [
      {
        order: 0,
        name: "Обычные",
        synonym: "Обычные",
        latin: "normal"
      },
      {
        order: 1,
        name: "Габаритные",
        synonym: "Только габаритные",
        latin: "bounds"
      },
      {
        order: 2,
        name: "ПоСтворкам",
        synonym: "По створкам",
        latin: "flap"
      },
      {
        order: 3,
        name: "ОтКрая",
        synonym: "От края",
        latin: "borde"
      },
      {
        order: 4,
        name: "БезРазмеров",
        synonym: "Без размеров",
        latin: "none"
      },
      {
        "default": "normal"
      },
      {
        tag: "Типы размерных линий"
      }
    ],
    "planning_phases": [
      {
        order: 0,
        name: "plan",
        synonym: "План"
      },
      {
        order: 1,
        name: "run",
        synonym: "Запуск"
      },
      {
        order: 2,
        name: "ready",
        synonym: "Готовность"
      },
      {
        tag: "Фазы планирования и диспетчеризации"
      }
    ],
    "order_sending_stages": [
      {
        order: 0,
        name: "replenish",
        synonym: "Уточнение информации"
      },
      {
        order: 1,
        name: "pay_start",
        synonym: "Ожидание оплаты"
      },
      {
        order: 2,
        name: "pay_confirmed",
        synonym: "Оплата подтверждена"
      },
      {
        tag: "Этапы отправки заказа"
      }
    ],
    "individual_legal": [
      {
        order: 0,
        name: "ЮрЛицо",
        synonym: "Юрлицо"
      },
      {
        order: 1,
        name: "ФизЛицо",
        synonym: "Физлицо"
      },
      {
        tag: "Юр/ФизЛицо"
      }
    ]
  },
  "cat": {
    "params_links": {
      name: "СвязиПараметров",
      synonym: "Связи параметров",
      illustration: "Подчиненные параметры",
      objPresentation: "Связь параметров",
      listPresentation: "Связи параметров",
      inputBy: [
        "name"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "prl",
      fields: {
        master: {
          synonym: "Ведущий",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.parameters_keys"
            ]
          }
        },
        slave: {
          synonym: "Ведомый",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cch.properties"
            ]
          }
        },
        hide: {
          synonym: "Скрыть ведомый",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
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
            strLen: 0
          }
        },
        "use_master": {
          synonym: "Использование ведущих",
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
        parent: {
          synonym: "",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.params_links"
            ]
          }
        }
      },
      tabulars: {
        "leadings": {
          name: "Ведущие",
          synonym: "Ведущие",
          tooltip: "",
          fields: {
            "key": {
              synonym: "Ключ",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.parameters_keys"
                ]
              }
            }
          }
        },
        "values": {
          name: "Значения",
          synonym: "Значения",
          tooltip: "",
          fields: {
            "value": {
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
                    "slave"
                  ]
                }
              ],
              choiceParams: [],
              "choiceType": {
                path: [
                  "slave"
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
            "forcibly": {
              synonym: "Принудительно",
              multiline: false,
              tooltip: "Замещать установленное ранее значение при перевыборе ведущего параметра",
              type: {
                types: [
                  "boolean"
                ]
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "choice_params": {
      name: "ПараметрыВыбора",
      synonym: "Параметры выбора",
      illustration: "Для привязки ключей параметров к метаданным",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "sp",
      fields: {
        "key": {
          synonym: "Ключ",
          multiline: false,
          tooltip: "Массив условий, добавляемых в параметр выбора",
          choiceParams: [
            {
              name: "applying",
              path: "ПараметрВыбора"
            }
          ],
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.parameters_keys"
            ]
          }
        },
        "runtime": {
          synonym: "Динамический",
          multiline: false,
          tooltip: "Если истина, фильтр будет рассчитываться всякий раз, когда его запросит поле ввода или динсписок. Статический параметр рассчитывается на старте приложения",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "condition_formula": {
          synonym: "Формула условия",
          multiline: false,
          tooltip: "В этом поле можно указать дополнительное условие на языке javascript",
          choiceParams: [
            {
              name: "parent",
              path: "1cce6b82-73be-11e9-94bb-98d95b9a5346"
            },
            {
              name: "disabled",
              path: false
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.formulas"
            ]
          }
        },
        "field": {
          synonym: "Поле реквизита",
          multiline: false,
          tooltip: "Ссылка или вложенное поле, на которое накладывается отбор",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 255
          }
        },
        "disabled": {
          synonym: "Отключен",
          multiline: false,
          tooltip: "Не использовать данный параметр выбора",
          type: {
            types: [
              "boolean"
            ]
          }
        }
      },
      tabulars: {
        "composition": {
          name: "Состав",
          synonym: "Состав",
          tooltip: "",
          fields: {
            "field": {
              synonym: "Реквизит",
              multiline: false,
              tooltip: "Полное имя метаданных",
              mandatory: true,
              type: {
                types: [
                  "string"
                ],
                strLen: 255
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "partner_bank_accounts": {
      name: "БанковскиеСчетаКонтрагентов",
      synonym: "Банковские счета",
      illustration: "Банковские счета сторонних контрагентов и физических лиц.",
      objPresentation: "Банковский счет",
      listPresentation: "Банковские счета",
      inputBy: [
        "name",
        "account_number"
      ],
      hierarchical: false,
      hasOwners: true,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "ba",
      fields: {
        "account_number": {
          synonym: "Номер счета",
          multiline: false,
          tooltip: "Номер расчетного счета организации",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 20
          }
        },
        "bank": {
          synonym: "Банк",
          multiline: false,
          tooltip: "Банк, в котором открыт расчетный счет организации",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.banks_qualifier"
            ]
          }
        },
        "settlements_bank": {
          synonym: "Банк для расчетов",
          multiline: false,
          tooltip: "Банк, в случае непрямых расчетов",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.banks_qualifier"
            ]
          }
        },
        "correspondent_text": {
          synonym: "Текст корреспондента",
          multiline: false,
          tooltip: "Текст \"Плательщик\\Получатель\" в платежных документах",
          type: {
            types: [
              "string"
            ],
            strLen: 250
          }
        },
        "appointments_text": {
          synonym: "Текст назначения",
          multiline: false,
          tooltip: "Текст назначения платежа",
          type: {
            types: [
              "string"
            ],
            strLen: 250
          }
        },
        "funds_currency": {
          synonym: "Валюта",
          multiline: false,
          tooltip: "Валюта учета денежных средств",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.currencies"
            ]
          }
        },
        "bank_bic": {
          synonym: "БИКБанка",
          multiline: false,
          tooltip: "БИК банка, в котором открыт счет",
          type: {
            types: [
              "string"
            ],
            strLen: 9
          }
        },
        "bank_name": {
          synonym: "Наименование банка",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 100
          }
        },
        "bank_correspondent_account": {
          synonym: "Корр. счет банк",
          multiline: false,
          tooltip: "Корр.счет банка",
          type: {
            types: [
              "string"
            ],
            strLen: 20
          }
        },
        "bank_city": {
          synonym: "Город банка",
          multiline: false,
          tooltip: "Город банка",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "bank_address": {
          synonym: "Адрес банка",
          multiline: false,
          tooltip: "Адрес банка",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "bank_phone_numbers": {
          synonym: "Телефоны банка",
          multiline: false,
          tooltip: "Телефоны банка",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "settlements_bank_bic": {
          synonym: "БИК банка для расчетов",
          multiline: false,
          tooltip: "БИК банка, в случае непрямых расчетов",
          type: {
            types: [
              "string"
            ],
            strLen: 9
          }
        },
        "settlements_bank_correspondent_account": {
          synonym: "Корр. счет банка для расчетов",
          multiline: false,
          tooltip: "Корр.счет банка, в случае непрямых расчетов",
          type: {
            types: [
              "string"
            ],
            strLen: 20
          }
        },
        "settlements_bank_city": {
          synonym: "Город банка для расчетов",
          multiline: false,
          tooltip: "Город банка, в случае непрямых расчетов",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "owner": {
          synonym: "Контрагент",
          multiline: false,
          tooltip: "Контрагент или физическое лицо, являющиеся владельцем банковского счета",
          choiceParams: [
            {
              name: "is_folder",
              path: false
            }
          ],
          mandatory: true,
          type: {
            types: [
              "cat.individuals",
              "cat.partners",
              "cat.organizations"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "work_center_kinds": {
      name: "ВидыРабочихЦентров",
      synonym: "Этапы производства (Виды РЦ)",
      illustration: "",
      objPresentation: "Вид рабочего центра",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "sg",
      fields: {
        "applying": {
          synonym: "Детализация",
          multiline: false,
          tooltip: "Детализация планирования (до элемента, продукции, заказа...)",
          choiceParams: [
            {
              name: "ref",
              path: [
                "product",
                "layer",
                "parent",
                "elm",
                "order",
                "region"
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
        "available": {
          synonym: "Всегда доступен",
          multiline: false,
          tooltip: "Не учитывать остатки мощностей",
          type: {
            types: [
              "boolean"
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
      tabulars: {},
      cachable: "ram"
    },
    "property_values_hierarchy": {
      name: "ЗначенияСвойствОбъектовИерархия",
      synonym: "Дополнительные значения (иерархия)",
      illustration: "",
      objPresentation: "Дополнительное значение (иерархия)",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: true,
      hasOwners: true,
      groupHierarchy: false,
      mainPresentation: "name",
      codeLength: 0,
      id: "vh",
      fields: {
        "heft": {
          synonym: "Весовой коэффициент",
          multiline: false,
          tooltip: "Относительный вес дополнительного значения (значимость).",
          type: {
            types: [
              "number"
            ],
            "digits": 10,
            "fraction": 2
          }
        },
        "owner": {
          synonym: "Свойство",
          multiline: false,
          tooltip: "Дополнительный реквизит или сведение.",
          mandatory: true,
          type: {
            types: [
              "cch.properties"
            ]
          }
        },
        parent: {
          synonym: "Входит в группу",
          multiline: false,
          tooltip: "Вышестоящее дополнительное значение свойства.",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "owner"
              ]
            }
          ],
          type: {
            types: [
              "cat.property_values_hierarchy"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "banks_qualifier": {
      name: "КлассификаторБанковРФ",
      synonym: "Классификатор банков РФ",
      illustration: "",
      objPresentation: "Банк",
      listPresentation: "Банки",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "bn",
      fields: {
        "correspondent_account": {
          synonym: "Корр. счет",
          multiline: false,
          tooltip: "Корреспондентский счет банка",
          type: {
            types: [
              "string"
            ],
            strLen: 20
          }
        },
        "city": {
          synonym: "Город",
          multiline: false,
          tooltip: "Город банка",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "address": {
          synonym: "Адрес",
          multiline: false,
          tooltip: "Адрес банка",
          type: {
            types: [
              "string"
            ],
            strLen: 500
          }
        },
        "phone_numbers": {
          synonym: "Телефоны",
          multiline: false,
          tooltip: "Телефоны банка",
          type: {
            types: [
              "string"
            ],
            strLen: 250
          }
        },
        "activity_ceased": {
          synonym: "Деятельность прекращена",
          multiline: false,
          tooltip: "Банк по каким-либо причинам прекратил свою деятельность",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "swift": {
          synonym: "СВИФТ БИК",
          multiline: false,
          tooltip: "Международный банковский идентификационный код (SWIFT BIC)",
          type: {
            types: [
              "string"
            ],
            strLen: 11
          }
        },
        "inn": {
          synonym: "ИНН",
          multiline: false,
          tooltip: "Идентификационный номер налогоплательщика",
          type: {
            types: [
              "string"
            ],
            strLen: 12
          }
        },
        parent: {
          synonym: "Группа банков",
          multiline: false,
          tooltip: "Группа банков, в которую входит данный банк",
          type: {
            types: [
              "cat.banks_qualifier"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "destinations": {
      name: "НаборыДополнительныхРеквизитовИСведений",
      synonym: "Наборы дополнительных реквизитов и сведений",
      illustration: "",
      objPresentation: "Набор дополнительных реквизитов и сведений",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "ds",
      fields: {
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
        },
        parent: {
          synonym: "Входит в группу",
          multiline: false,
          tooltip: "Группа, к которой относится набор.",
          type: {
            types: [
              "cat.destinations"
            ]
          }
        }
      },
      tabulars: {
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "",
          fields: {
            "property": {
              synonym: "Дополнительный реквизит",
              multiline: false,
              tooltip: "Дополнительный реквизит этого набора",
              choiceGrp: "elm",
              type: {
                types: [
                  "cch.properties"
                ]
              }
            },
            "_deleted": {
              synonym: "Пометка удаления",
              multiline: false,
              tooltip: "Устанавливается при исключении дополнительного реквизита из набора,\nчтобы можно было вернуть связь с уникальным дополнительным реквизитом.",
              type: {
                types: [
                  "boolean"
                ]
              }
            }
          }
        },
        "extra_properties": {
          name: "ДополнительныеСведения",
          synonym: "Дополнительные сведения",
          tooltip: "",
          fields: {
            "property": {
              synonym: "Дополнительное сведение",
              multiline: false,
              tooltip: "Дополнительное сведение этого набора",
              choiceGrp: "elm",
              type: {
                types: [
                  "cch.properties"
                ]
              }
            },
            "_deleted": {
              synonym: "Пометка удаления",
              multiline: false,
              tooltip: "Устанавливается при исключении дополнительного сведения из набора,\nчтобы можно было вернуть связь с уникальным дополнительным сведением.",
              type: {
                types: [
                  "boolean"
                ]
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "countries": {
      name: "СтраныМира",
      synonym: "Страны мира",
      illustration: "",
      objPresentation: "Страна мира",
      listPresentation: "",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 3,
      id: "cou",
      fields: {
        "name_full": {
          synonym: "Наименование полное",
          multiline: false,
          tooltip: "Полное наименование страны мира",
          type: {
            types: [
              "string"
            ],
            strLen: 100
          }
        },
        "alpha2": {
          synonym: "Код альфа-2",
          multiline: false,
          tooltip: "Двузначный буквенный код альфа-2 страны по ОКСМ",
          type: {
            types: [
              "string"
            ],
            strLen: 2
          }
        },
        "alpha3": {
          synonym: "Код альфа-3",
          multiline: false,
          tooltip: "Трехзначный буквенный код альфа-3 страны по ОКСМ",
          type: {
            types: [
              "string"
            ],
            strLen: 3
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
      tabulars: {},
      cachable: "ram"
    },
    "formulas": {
      name: "Формулы",
      synonym: "Формулы",
      illustration: "Формулы пользователя, для выполнения при расчете спецификаций, модификаторы, вычисляемые свойства",
      objPresentation: "Формула",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "f",
      fields: {
        "formula": {
          synonym: "Формула",
          multiline: false,
          tooltip: "Текст функции на языке javascript",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "leading_formula": {
          synonym: "Ведущая формула",
          multiline: false,
          tooltip: "Если указано, выполняется код ведущей формулы с параметрами, заданными для текущей формулы",
          choiceParams: [
            {
              name: "leading_formula",
              path: "00000000-0000-0000-0000-000000000000"
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.formulas"
            ]
          }
        },
        "condition_formula": {
          synonym: "Это формула условия",
          multiline: false,
          tooltip: "Формула используется, как фильтр, а не как алгоритм расчета количества.\nЕсли возвращает не Истина, строка в спецификацию не добавляется",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "definition": {
          synonym: "Описание",
          multiline: true,
          tooltip: "Описание в формате html",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "template": {
          synonym: "Шаблон",
          multiline: true,
          tooltip: "html или jsx шаблон отчета",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "sorting_field": {
          synonym: "Порядок",
          multiline: false,
          tooltip: "Используется для упорядочивания (служебный)",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "async": {
          synonym: "Асинхронный режим",
          multiline: false,
          tooltip: "Создавать асинхронную функцию",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "disabled": {
          synonym: "Отключена",
          multiline: false,
          tooltip: "Имеет смысл только для печатных форм и модификаторов",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "context": {
          synonym: "Контекст",
          multiline: false,
          tooltip: "Выполнять в браузере, node или везде",
          "max": 2,
          "min": 0,
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "jsx": {
          synonym: "JSX",
          multiline: false,
          tooltip: "Транспилировать формулу из шаблона jsx",
          type: {
            types: [
              "boolean"
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
        },
        parent: {
          synonym: "Группа",
          multiline: false,
          tooltip: "Группа формул",
          mandatory: true,
          type: {
            types: [
              "cat.formulas"
            ]
          }
        }
      },
      tabulars: {
        "params": {
          name: "Параметры",
          synonym: "Параметры",
          tooltip: "",
          fields: {
            "param": {
              synonym: "Параметр",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
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
            "value": {
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
                    "params",
                    "param"
                  ]
                }
              ],
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
        }
      },
      cachable: "ram"
    },
    "elm_visualization": {
      name: "ВизуализацияЭлементов",
      synonym: "Визуализация элементов",
      illustration: "Строки svg для рисования петель, ручек и графических примитивов",
      objPresentation: "Визуализация элемента",
      listPresentation: "Визуализация элементов",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "vz",
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
      cachable: "ram"
    },
    "branches": {
      name: "ИнтеграцияОтделыАбонентов",
      synonym: "Отделы абонентов",
      illustration: "",
      objPresentation: "Отдел абонента",
      listPresentation: "",
      inputBy: [
        "name",
        "suffix"
      ],
      hierarchical: true,
      hasOwners: true,
      groupHierarchy: false,
      mainPresentation: "name",
      codeLength: 11,
      id: "br",
      fields: {
        "suffix": {
          synonym: "Суффикс CouchDB",
          multiline: false,
          tooltip: "Для разделения данных в CouchDB",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 4
          }
        },
        "lang": {
          synonym: "Язык",
          multiline: false,
          tooltip: "Язык интерфейса пользователя",
          type: {
            types: [
              "string"
            ],
            strLen: 2,
            "strFix": true
          }
        },
        "server": {
          synonym: "Сервер",
          multiline: false,
          tooltip: "Если указано, используется этот сервер, а не основной сервер абонента",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.servers"
            ]
          }
        },
        "back_server": {
          synonym: "Обратный сервер",
          multiline: false,
          tooltip: "Если указано, этот сервер, для настройки репликации от сервера отдела к родителю",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.servers"
            ]
          }
        },
        "repl_server": {
          synonym: "Сервер репликатора",
          multiline: false,
          tooltip: "Если указано, задание репликации будет запущено на этом сервере",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.servers"
            ]
          }
        },
        "direct": {
          synonym: "Direct",
          multiline: false,
          tooltip: "Для пользователя запрещен режим offline",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "use": {
          synonym: "Используется",
          multiline: false,
          tooltip: "Использовать данный отдел при создании баз и пользователей",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "mode": {
          synonym: "Режим",
          multiline: false,
          tooltip: "Режим репликации текущего отдела",
          type: {
            types: [
              "number"
            ],
            "digits": 1,
            "fraction": 0
          }
        },
        "no_mdm": {
          synonym: "NoMDM",
          multiline: false,
          tooltip: "Отключить MDM для данного отдела (напрмиер, если это dev-база)",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "no_partners": {
          synonym: "NoPartners",
          multiline: false,
          tooltip: "Не использовать фильтр по контрагенту в репликации (только по подразделению)",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "no_divisions": {
          synonym: "NoDivisions",
          multiline: false,
          tooltip: "Не использовать фильтр по подразделению в репликации (только по контрагенту)",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "filter": {
          synonym: "Фильтр технологии",
          multiline: false,
          tooltip: "Если указано, используется индивидуальный образ справочников",
          choiceParams: [
            {
              name: "area",
              path: true
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.abonents"
            ]
          }
        },
        "part": {
          synonym: "Частичная репликация детей",
          multiline: false,
          tooltip: "Если указано, репликация дочерних отделов будет ораничена вверх текущим. Потребуется повторная \"отправка\" из текущего, чтобы объект достиг вышестоящих отделов",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "owner": {
          synonym: "Абонент",
          multiline: false,
          tooltip: "Абонент, которому принадлежит отдел",
          choiceParams: [
            {
              name: "area",
              path: false
            }
          ],
          mandatory: true,
          type: {
            types: [
              "cat.abonents"
            ]
          }
        },
        parent: {
          synonym: "Ведущий отдел",
          multiline: false,
          tooltip: "Заполняется в случае иерархической репликации",
          type: {
            types: [
              "cat.branches"
            ]
          }
        }
      },
      tabulars: {
        "organizations": {
          name: "Организации",
          synonym: "Организации",
          tooltip: "Организации, у которых дилер может заказывать продукцию и услуги",
          fields: {
            "obj": {
              synonym: "Объект доступа",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "cat.organizations"
                ]
              }
            },
            "by_default": {
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
        },
        "partners": {
          name: "Контрагенты",
          synonym: "Контрагенты",
          tooltip: "Юридические лица дилера, от имени которых он оформляет заказы",
          fields: {
            "obj": {
              synonym: "Объект доступа",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "cat.partners"
                ]
              }
            },
            "by_default": {
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
        },
        "divisions": {
          name: "Подразделения",
          synonym: "Подразделения",
          tooltip: "Подразделения, к данным которых, дилеру предоставлен доступ",
          fields: {
            "obj": {
              synonym: "Объект доступа",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "cat.divisions"
                ]
              }
            },
            "by_default": {
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
        },
        "price_types": {
          name: "ТипыЦен",
          synonym: "Типы цен",
          tooltip: "Типы цен, привязанные к дилеру",
          fields: {
            "obj": {
              synonym: "Объект доступа",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "cat.nom_prices_types",
                  "cat.branches"
                ]
              }
            }
          }
        },
        "keys": {
          name: "Ключи",
          synonym: "Ключи",
          tooltip: "Ключи параметров, привязанные к дилеру",
          fields: {
            "obj": {
              synonym: "Объект доступа",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "cat.parameters_keys"
                ]
              }
            }
          }
        },
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "Дополнительные реквизиты объекта",
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
        "servers": {
          name: "ИнтеграцияСерверы",
          synonym: "Серверы",
          tooltip: "",
          fields: {
            "key": {
              synonym: "Год",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "number"
                ],
                "digits": 4,
                "fraction": 0
              }
            },
            "server": {
              synonym: "Сервер",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.servers"
                ]
              }
            },
            name: {
              synonym: "Имя базы",
              multiline: false,
              tooltip: "Указывается, если имя архивной базы отличается от типового",
              type: {
                types: [
                  "string"
                ],
                strLen: 255
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "cashboxes": {
      name: "Кассы",
      synonym: "Кассы",
      illustration: "Список мест фактического хранения и движения наличных денежных средств предприятия. Кассы разделены по организациям и валютам денежных средств. ",
      objPresentation: "Касса",
      listPresentation: "Кассы предприятия",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: true,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "cb",
      fields: {
        "funds_currency": {
          synonym: "Валюта денежных средств",
          multiline: false,
          tooltip: "Валюта учета денежных средств",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.currencies"
            ]
          }
        },
        "department": {
          synonym: "Подразделение",
          multiline: false,
          tooltip: "Подразделение, отвечающее за кассу.",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.divisions"
            ]
          }
        },
        "current_account": {
          synonym: "Расчетный счет",
          multiline: false,
          tooltip: "",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "owner"
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
        "owner": {
          synonym: "Организация",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "is_folder",
              path: false
            }
          ],
          mandatory: true,
          type: {
            types: [
              "cat.organizations"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "currencies": {
      name: "Валюты",
      synonym: "Валюты",
      illustration: "Валюты, используемые при расчетах",
      objPresentation: "Валюта",
      listPresentation: "",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 3,
      id: "cr",
      fields: {
        "name_full": {
          synonym: "Наименование валюты",
          multiline: false,
          tooltip: "Полное наименование валюты",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "extra_charge": {
          synonym: "Наценка",
          multiline: false,
          tooltip: "Коэффициент, который применяется к курсу основной валюты для вычисления курса текущей валюты.",
          type: {
            types: [
              "number"
            ],
            "digits": 10,
            "fraction": 2
          }
        },
        "main_currency": {
          synonym: "Основная валюта",
          multiline: false,
          tooltip: "Валюта, на основании курса которой рассчитывается курс текущей валюты",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.currencies"
            ]
          }
        },
        "parameters_russian_recipe": {
          synonym: "Параметры прописи на русском",
          multiline: false,
          tooltip: "Параметры прописи валюты на русском языке",
          type: {
            types: [
              "string"
            ],
            strLen: 200
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "contact_information_kinds": {
      name: "ВидыКонтактнойИнформации",
      synonym: "Виды контактной информации",
      illustration: "",
      objPresentation: "Вид контактной информации",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "cik",
      fields: {
        "mandatory_fields": {
          synonym: "Обязательное заполнение",
          multiline: false,
          tooltip: "Вид контактной информации обязателен к заполнению",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        type: {
          synonym: "Тип",
          multiline: false,
          tooltip: "Тип контактной информации (адрес, телефон и т.д.)",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.contact_information_types"
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
        },
        parent: {
          synonym: "Группа",
          multiline: false,
          tooltip: "Группа вида контактной информации",
          type: {
            types: [
              "cat.contact_information_kinds"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "nom_kinds": {
      name: "ВидыНоменклатуры",
      synonym: "Виды номенклатуры",
      illustration: "",
      objPresentation: "Вид номенклатуры",
      listPresentation: "",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "nk",
      fields: {
        "nom_type": {
          synonym: "Тип номенклатуры",
          multiline: false,
          tooltip: "Указывается тип, к которому относится номенклатура данного вида.",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.nom_types"
            ]
          }
        },
        "dnom": {
          synonym: "Набор свойств номенклатура",
          multiline: false,
          tooltip: "Набор свойств, которым будет обладать номенклатура с этим видом",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.destinations"
            ]
          }
        },
        "dcharacteristic": {
          synonym: "Набор свойств характеристика",
          multiline: false,
          tooltip: "Набор свойств, которым будет обладать характеристика с этим видом",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.destinations"
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
        parent: {
          synonym: "Группа",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.nom_kinds"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "contracts": {
      name: "ДоговорыКонтрагентов",
      synonym: "Договоры контрагентов",
      illustration: "Перечень договоров, заключенных с контрагентами",
      objPresentation: "Договор контрагента",
      listPresentation: "Договоры контрагентов",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: true,
      hasOwners: true,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "cn",
      fields: {
        "settlements_currency": {
          synonym: "Валюта взаиморасчетов",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.currencies"
            ]
          }
        },
        "mutual_settlements": {
          synonym: "Ведение взаиморасчетов",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.mutual_contract_settlements"
            ]
          }
        },
        "contract_kind": {
          synonym: "Вид договора",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.contract_kinds"
            ]
          }
        },
        "date": {
          synonym: "Дата",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "date"
            ],
            "datePart": "date"
          }
        },
        "check_days_without_pay": {
          synonym: "Держать резерв без оплаты ограниченное время",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "allowable_debts_amount": {
          synonym: "Допустимая сумма дебиторской задолженности",
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
        "allowable_debts_days": {
          synonym: "Допустимое число дней дебиторской задолженности",
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
        note: {
          synonym: "Комментарий",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "check_debts_amount": {
          synonym: "Контролировать сумму дебиторской задолженности",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "check_debts_days": {
          synonym: "Контролировать число дней дебиторской задолженности",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "number_doc": {
          synonym: "Номер",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 20
          }
        },
        "organization": {
          synonym: "Организация",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.organizations"
            ]
          }
        },
        "main_cash_flow_article": {
          synonym: "Основная статья движения денежных средств",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.cash_flow_articles"
            ]
          }
        },
        "main_project": {
          synonym: "Основной проект",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.projects"
            ]
          }
        },
        "accounting_reflect": {
          synonym: "Отражать в бухгалтерском учете",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "tax_accounting_reflect": {
          synonym: "Отражать в налоговом учете",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "prepayment_percent": {
          synonym: "Процент предоплаты",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 5,
            "fraction": 2
          }
        },
        "validity": {
          synonym: "Срок действия договора",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "date"
            ],
            "datePart": "date"
          }
        },
        "vat_included": {
          synonym: "Сумма включает НДС",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "price_type": {
          synonym: "Тип цен",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.nom_prices_types",
              "cat.branches"
            ]
          }
        },
        "vat_consider": {
          synonym: "Учитывать НДС",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "days_without_pay": {
          synonym: "Число дней резерва без оплаты",
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
        "owner": {
          synonym: "Контрагент",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "is_folder",
              path: false
            }
          ],
          mandatory: true,
          type: {
            types: [
              "cat.partners"
            ]
          }
        },
        parent: {
          synonym: "Группа договоров",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.contracts"
            ]
          }
        }
      },
      tabulars: {
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "",
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
              },
              hide: true
            }
          }
        }
      },
      cachable: "ram"
    },
    "nom_units": {
      name: "ЕдиницыИзмерения",
      synonym: "Единицы измерения",
      illustration: "Перечень единиц измерения номенклатуры и номенклатурных групп",
      objPresentation: "Единица измерения",
      listPresentation: "Единицы измерения",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: true,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "nu",
      fields: {
        "qualifier_unit": {
          synonym: "Единица по классификатору",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.units"
            ]
          }
        },
        "heft": {
          synonym: "Вес",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 3
          }
        },
        "volume": {
          synonym: "Объем",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 3
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
            "digits": 10,
            "fraction": 3
          }
        },
        "rounding_threshold": {
          synonym: "Порог округления",
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
        "owner": {
          synonym: "Номенклатура",
          multiline: false,
          tooltip: "",
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
      cachable: "ram"
    },
    "property_values": {
      name: "ЗначенияСвойствОбъектов",
      synonym: "Дополнительные значения",
      illustration: "",
      objPresentation: "Дополнительное значение",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: true,
      hasOwners: true,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "v",
      fields: {
        "heft": {
          synonym: "Весовой коэффициент",
          multiline: false,
          tooltip: "Относительный вес дополнительного значения (значимость).",
          type: {
            types: [
              "number"
            ],
            "digits": 10,
            "fraction": 2
          }
        },
        "css": {
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
        "owner": {
          synonym: "Свойство",
          multiline: false,
          tooltip: "Дополнительный реквизит или сведение.",
          mandatory: true,
          type: {
            types: [
              "cch.properties"
            ]
          }
        },
        parent: {
          synonym: "Входит в группу",
          multiline: false,
          tooltip: "Группа дополнительных значений свойства.",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "owner"
              ]
            }
          ],
          type: {
            types: [
              "cat.property_values"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "divisions": {
      name: "Подразделения",
      synonym: "Подразделения",
      illustration: "Перечень подразделений предприятия",
      objPresentation: "Подразделение",
      listPresentation: "Подразделения",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: false,
      mainPresentation: "name",
      codeLength: 9,
      id: "dep",
      fields: {
        "sorting_field": {
          synonym: "Порядок",
          multiline: false,
          tooltip: "Используется для упорядочивания (служебный)",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        parent: {
          synonym: "Входит в подразделение",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.divisions"
            ]
          }
        }
      },
      tabulars: {
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
        "keys": {
          name: "Ключи",
          synonym: "Ключи",
          tooltip: "Ключи параметров, привязанные к дилеру",
          fields: {
            "obj": {
              synonym: "Объект доступа",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "cat.parameters_keys"
                ]
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "meta_ids": {
      name: "ИдентификаторыОбъектовМетаданных",
      synonym: "Идентификаторы объектов метаданных",
      illustration: "Идентификаторы объектов метаданных для использования в базе данных.",
      objPresentation: "Идентификатор объекта метаданных",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: false,
      mainPresentation: "name",
      codeLength: 0,
      id: "mi",
      fields: {
        "full_moniker": {
          synonym: "Полное имя",
          multiline: false,
          tooltip: "Полное имя объекта метаданных",
          type: {
            types: [
              "string"
            ],
            strLen: 430
          }
        },
        parent: {
          synonym: "Группа объектов",
          multiline: false,
          tooltip: "Группа объектов метаданных.",
          type: {
            types: [
              "cat.meta_ids"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "units": {
      name: "КлассификаторЕдиницИзмерения",
      synonym: "Классификатор единиц измерения",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 3,
      id: "uc",
      fields: {
        "name_full": {
          synonym: "Полное наименование",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 100
          }
        },
        "international_short": {
          synonym: "Международное сокращение",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 3
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "partners": {
      name: "Контрагенты",
      synonym: "Контрагенты",
      illustration: "Список юридических или физических лиц клиентов (поставщиков, покупателей).",
      objPresentation: "Контрагент",
      listPresentation: "Контрагенты",
      inputBy: [
        "name",
        "id",
        "inn"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 11,
      id: "ka",
      fields: {
        "name_full": {
          synonym: "Полное наименование",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "main_bank_account": {
          synonym: "Основной банковский счет",
          multiline: false,
          tooltip: "",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "ref"
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
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "inn": {
          synonym: "ИНН",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 12
          }
        },
        "kpp": {
          synonym: "КПП",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 9
          }
        },
        "ogrn": {
          synonym: "ОГРН",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 15
          }
        },
        "okpo": {
          synonym: "Код по ОКПО",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 10
          }
        },
        "individual_legal": {
          synonym: "Юр. / физ. лицо",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.individual_legal"
            ]
          }
        },
        "main_contract": {
          synonym: "Основной договор контрагента",
          multiline: false,
          tooltip: "",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "ref"
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
        "identification_document": {
          synonym: "Документ, удостоверяющий личность",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "buyer_main_manager": {
          synonym: "Основной менеджер покупателя",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.users"
            ]
          }
        },
        "is_buyer": {
          synonym: "Покупатель",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "is_supplier": {
          synonym: "Поставщик",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "primary_contact": {
          synonym: "Основное контактное лицо",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.individuals"
            ]
          }
        },
        parent: {
          synonym: "Группа контрагентов",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.partners"
            ]
          }
        }
      },
      tabulars: {
        "contact_information": {
          name: "КонтактнаяИнформация",
          synonym: "Контактная информация",
          tooltip: "",
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
            "kind": {
              synonym: "Вид",
              multiline: false,
              tooltip: "Вид контактной информации",
              choiceParams: [
                {
                  name: "parent",
                  path: "139d49b9-5301-45f3-b851-4488420d7d15"
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.contact_information_kinds"
                ]
              }
            },
            "presentation": {
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
            "values_fields": {
              synonym: "Значения полей",
              multiline: false,
              tooltip: "Служебное поле, для хранения контактной информации",
              type: {
                types: [
                  "string"
                ],
                strLen: 0
              },
              hide: true
            },
            "country": {
              synonym: "Страна",
              multiline: false,
              tooltip: "Страна (заполняется для адреса)",
              type: {
                types: [
                  "string"
                ],
                strLen: 100
              },
              hide: true
            },
            "region": {
              synonym: "Регион",
              multiline: false,
              tooltip: "Регион (заполняется для адреса)",
              type: {
                types: [
                  "string"
                ],
                strLen: 50
              },
              hide: true
            },
            "city": {
              synonym: "Город",
              multiline: false,
              tooltip: "Город (заполняется для адреса)",
              type: {
                types: [
                  "string"
                ],
                strLen: 50
              },
              hide: true
            },
            "email_address": {
              synonym: "Адрес ЭП",
              multiline: false,
              tooltip: "Адрес электронной почты",
              type: {
                types: [
                  "string"
                ],
                strLen: 100
              },
              hide: true
            },
            "phone_number": {
              synonym: "Номер телефона",
              multiline: false,
              tooltip: "Полный номер телефона",
              type: {
                types: [
                  "string"
                ],
                strLen: 20
              },
              hide: true
            },
            "phone_without_codes": {
              synonym: "Номер телефона без кодов",
              multiline: false,
              tooltip: "Номер телефона без кодов и добавочного номера",
              type: {
                types: [
                  "string"
                ],
                strLen: 20
              },
              hide: true
            }
          }
        },
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "",
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
              },
              hide: true
            }
          }
        }
      },
      cachable: "ram"
    },
    nom: {
      name: "Номенклатура",
      synonym: "Номенклатура",
      illustration: "Перечень товаров, продукции, материалов, полуфабрикатов, тары, услуг",
      objPresentation: "Позиция номенклатуры",
      listPresentation: "",
      inputBy: [
        "name",
        "id",
        "article"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 11,
      id: "n",
      fields: {
        "article": {
          synonym: "Артикул ",
          multiline: false,
          tooltip: "Артикул номенклатуры",
          type: {
            types: [
              "string"
            ],
            strLen: 32
          }
        },
        "name_full": {
          synonym: "Наименование для печати",
          multiline: true,
          tooltip: "Наименование номенклатуры, которое будет печататься во всех документах.",
          type: {
            types: [
              "string"
            ],
            strLen: 1024
          }
        },
        "base_unit": {
          synonym: "Базовая единица измерения",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.units"
            ]
          }
        },
        "storage_unit": {
          synonym: "Единица хранения остатков",
          multiline: false,
          tooltip: "",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "ref"
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
        "nom_kind": {
          synonym: "Вид номенклатуры",
          multiline: false,
          tooltip: "Определяет состав дополнительных реквизитов",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.nom_kinds"
            ]
          }
        },
        "nom_group": {
          synonym: "Номенклатурная группа",
          multiline: false,
          tooltip: "Определяет счета учета и выступает разрезом в расчете себестоимости",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.nom_groups"
            ]
          }
        },
        "price_group": {
          synonym: "Ценовая группа",
          multiline: false,
          tooltip: "Актуально для продукций",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.price_groups"
            ]
          }
        },
        "vat_rate": {
          synonym: "Ставка НДС",
          multiline: false,
          tooltip: "Для подстановки в документы",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.vat_rates"
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
            strLen: 0
          }
        },
        "elm_type": {
          synonym: "Тип элемента: рама, створка и т.п.",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.elm_types"
            ]
          }
        },
        "len": {
          synonym: "Длина - L",
          multiline: false,
          tooltip: "Длина стандартной загатовки, мм",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "width": {
          synonym: "Ширина - A",
          multiline: false,
          tooltip: "Ширина стандартной загатовки, мм",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "thickness": {
          synonym: "Толщина - T",
          multiline: false,
          tooltip: "Если указан svg визуализации, толщина берётся из чертежа, если не указан - из этого поля",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "sizefurn": {
          synonym: "Размер фурн. паза - D",
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
        "sizefaltz": {
          synonym: "Размер фальца - F",
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
        "density": {
          synonym: "Плотность, кг / ед. хранения",
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
        "volume": {
          synonym: "Объем, м³ / ед. хранения",
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
        "arc_elongation": {
          synonym: "Удлинение арки",
          multiline: false,
          tooltip: "Этот размер будет добавлен изогнутым элементам",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "sizeb": {
          synonym: "Размер до опоры - B",
          multiline: false,
          tooltip: "Имеет смысл только для вставок с вычисляемым размером \"B\" по номенклатуре",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "loss_factor": {
          synonym: "Коэффициент потерь",
          multiline: false,
          tooltip: "Плановый коэффициент потерь (обрезь, усушка)",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 4
          }
        },
        "rounding_quantity": {
          synonym: "Округлять количество",
          multiline: false,
          tooltip: "При расчете спецификации построителя, как в функции Окр(). 1: до десятых долей,  0: до целых, -1: до десятков",
          type: {
            types: [
              "number"
            ],
            "digits": 1,
            "fraction": 0
          }
        },
        "clr": {
          synonym: "Цвет по умолчанию",
          multiline: false,
          tooltip: "Цвет материала по умолчанию. Актуально для заполнений, которые берём НЕ из системы",
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
        "cutting_optimization_type": {
          synonym: "Тип оптимизации",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.cutting_optimization_types"
            ]
          }
        },
        "saw_width": {
          synonym: "Ширина пилы, мм.",
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
        "overmeasure": {
          synonym: "Припуск в раскрое, мм",
          multiline: false,
          tooltip: "Оставлять на хлысте припуск (мм) для захвата станком",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "double_cut": {
          synonym: "Парный раскрой",
          multiline: false,
          tooltip: "0, 1 - одиночный.\n2 - парный",
          type: {
            types: [
              "number"
            ],
            "digits": 1,
            "fraction": 0
          }
        },
        "alp1": {
          synonym: "Угол: Типовой угол реза",
          multiline: false,
          tooltip: "",
          "max": 360,
          "min": 0,
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "wsnip_min": {
          synonym: "Длина плохого обрезка min",
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
        "wsnip_max": {
          synonym: "Длина плохого обрезка max",
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
        "packing": {
          synonym: "Нормоупаковка",
          multiline: false,
          tooltip: "Коэффициент нормоураковки (N единиц хранения остатков)",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "pricing": {
          synonym: "Расценка",
          multiline: false,
          tooltip: "Дополнительная формула расчета цены на случай, когда не хватает возможностей стандартной подисистемы",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.formulas"
            ]
          }
        },
        "visualization": {
          synonym: "Визуализация",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.elm_visualization"
            ]
          }
        },
        "complete_list_sorting": {
          synonym: "Сортировка в листе комплектации",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 2,
            "fraction": 0
          }
        },
        "is_accessory": {
          synonym: "Это аксессуар",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "is_procedure": {
          synonym: "Это техоперация",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "is_service": {
          synonym: "Это услуга",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "is_pieces": {
          synonym: "Штуки",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
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
        parent: {
          synonym: "Группа",
          multiline: false,
          tooltip: "Группа, в которую входит данная позиция номенклатуры.",
          type: {
            types: [
              "cat.nom"
            ]
          }
        }
      },
      tabulars: {
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "Дополнительные реквизиты объекта",
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
              },
              hide: true
            }
          }
        },
        "demand": {
          name: "Потребность",
          synonym: "Потребность",
          tooltip: "Виды рабочих центров для целей планирования",
          fields: {
            "kind": {
              synonym: "Этап производства",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.work_center_kinds"
                ]
              }
            },
            "days_from_execution": {
              synonym: "Дней от готовности",
              multiline: false,
              tooltip: "Обратный отсчет. Когда надо запустить в работу в цехе. Должно иметь значение <= ДнейДоГотовности",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "days_to_execution": {
              synonym: "Дней до готовности",
              multiline: false,
              tooltip: "Если номенклатура есть в спецификации, плановая готовность отодвигается на N дней",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            }
          }
        },
        "colors": {
          name: "Цвета",
          synonym: "Цвета",
          tooltip: "Коды в разрезе цветов",
          fields: {
            "clr": {
              synonym: "Цвет",
              multiline: false,
              tooltip: "",
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
            id: {
              synonym: "Код",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 25
              }
            },
            "article": {
              synonym: "Артикул ",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 50
              }
            },
            name: {
              synonym: "Наименование н+х",
              multiline: false,
              tooltip: "Наименование ключа \"Номенклатура + Характеристика\"",
              type: {
                types: [
                  "string"
                ],
                strLen: 100
              }
            },
            "packing": {
              synonym: "Нормоупаковка",
              multiline: false,
              tooltip: "Коэффициент нормоураковки (N единиц хранения остатков)",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "len": {
              synonym: "Длина - L",
              multiline: false,
              tooltip: "Длина стандартной загатовки, мм",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "organizations": {
      name: "Организации",
      synonym: "Организации",
      illustration: "",
      objPresentation: "Организация",
      listPresentation: "",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 11,
      id: "og",
      fields: {
        "prefix": {
          synonym: "Префикс",
          multiline: false,
          tooltip: "Используется при нумерации документов. В начало каждого номера документов данной организации добавляется символы префикса.",
          type: {
            types: [
              "string"
            ],
            strLen: 3
          }
        },
        "individual_legal": {
          synonym: "Юр. / физ. лицо",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.individual_legal"
            ]
          }
        },
        "individual_entrepreneur": {
          synonym: "Индивидуальный предприниматель",
          multiline: false,
          tooltip: "Ссылка на физлицо, если данная организация, является ИП",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.individuals"
            ]
          }
        },
        "inn": {
          synonym: "ИНН",
          multiline: false,
          tooltip: "Идентификационный номер налогоплательщика",
          type: {
            types: [
              "string"
            ],
            strLen: 12
          }
        },
        "kpp": {
          synonym: "КПП",
          multiline: false,
          tooltip: "Код причины постановки на учет",
          type: {
            types: [
              "string"
            ],
            strLen: 9
          }
        },
        "ogrn": {
          synonym: "ОГРН",
          multiline: false,
          tooltip: "Основной государственный регистрационный номер",
          type: {
            types: [
              "string"
            ],
            strLen: 15
          }
        },
        "main_bank_account": {
          synonym: "Основной банковский счет",
          multiline: false,
          tooltip: "Основной банковский счет организации",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "ref"
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
        "main_cashbox": {
          synonym: "Основноая касса",
          multiline: false,
          tooltip: "Основноая касса организации",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "ref"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.cashboxes"
            ]
          }
        },
        "certificate_series_number": {
          synonym: "Серия и номер свидетельства о постановке на учет",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 25
          }
        },
        "certificate_date_issue": {
          synonym: "Дата выдачи свидетельства о постановке на учет",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "date"
            ],
            "datePart": "date"
          }
        },
        "certificate_authority_name": {
          synonym: "Наименование налогового органа, выдавшего свидетельство",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 254
          }
        },
        "certificate_authority_code": {
          synonym: "Код налогового органа, выдавшего свидетельство",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 4
          }
        },
        "chief": {
          synonym: "Руководитель",
          multiline: false,
          tooltip: "Руководитель организации",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.individuals"
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
        parent: {
          synonym: "",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.organizations"
            ]
          }
        }
      },
      tabulars: {
        "contact_information": {
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
            "kind": {
              synonym: "Вид",
              multiline: false,
              tooltip: "Вид контактной информации",
              choiceParams: [
                {
                  name: "parent",
                  path: "c34c4e9d-c7c5-42bb-8def-93ecfe7b1977"
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.contact_information_kinds"
                ]
              }
            },
            "presentation": {
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
            "values_fields": {
              synonym: "Значения полей",
              multiline: false,
              tooltip: "Служебное поле, для хранения контактной информации",
              type: {
                types: [
                  "string"
                ],
                strLen: 0
              },
              hide: true
            },
            "country": {
              synonym: "Страна",
              multiline: false,
              tooltip: "Страна (заполняется для адреса)",
              type: {
                types: [
                  "string"
                ],
                strLen: 100
              },
              hide: true
            },
            "region": {
              synonym: "Регион",
              multiline: false,
              tooltip: "Регион (заполняется для адреса)",
              type: {
                types: [
                  "string"
                ],
                strLen: 50
              },
              hide: true
            },
            "city": {
              synonym: "Город",
              multiline: false,
              tooltip: "Город (заполняется для адреса)",
              type: {
                types: [
                  "string"
                ],
                strLen: 50
              },
              hide: true
            },
            "email_address": {
              synonym: "Адрес ЭП",
              multiline: false,
              tooltip: "Адрес электронной почты",
              type: {
                types: [
                  "string"
                ],
                strLen: 100
              },
              hide: true
            },
            "phone_number": {
              synonym: "Номер телефона",
              multiline: false,
              tooltip: "Полный номер телефона",
              type: {
                types: [
                  "string"
                ],
                strLen: 20
              },
              hide: true
            },
            "phone_without_codes": {
              synonym: "Номер телефона без кодов",
              multiline: false,
              tooltip: "Номер телефона без кодов и добавочного номера",
              type: {
                types: [
                  "string"
                ],
                strLen: 20
              },
              hide: true
            },
            "list_view": {
              synonym: "Вид для списка",
              multiline: false,
              tooltip: "Вид контактной информации для списка",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.contact_information_kinds"
                ]
              }
            },
            "act_from": {
              synonym: "Действует С",
              multiline: false,
              tooltip: "Дата актуальности контактная информация",
              type: {
                types: [
                  "date"
                ],
                "datePart": "date"
              }
            }
          }
        },
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "Дополнительные реквизиты объекта",
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
              },
              hide: true
            }
          }
        }
      },
      cachable: "ram"
    },
    "inserts": {
      name: "Вставки",
      synonym: "Вставки",
      illustration: "Армирование, пленки, вставки - дополнение спецификации, которое зависит от элемента и произвольных параметров",
      objPresentation: "Вставка",
      listPresentation: "Вставки",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "ins",
      fields: {
        "article": {
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
        "insert_type": {
          synonym: "Тип вставки",
          multiline: false,
          tooltip: "Используется, как фильтр в интерфейсе, плюс, от типа вставки могут зависеть алгоритмы расчета количеств и углов",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.inserts_types"
            ]
          }
        },
        "clr": {
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
        "lmin": {
          synonym: "X min",
          multiline: false,
          tooltip: "X min (длина или ширина)",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "lmax": {
          synonym: "X max",
          multiline: false,
          tooltip: "X max (длина или ширина)",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "hmin": {
          synonym: "Y min",
          multiline: false,
          tooltip: "Y min (высота)",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "hmax": {
          synonym: "Y max",
          multiline: false,
          tooltip: "Y max (высота)",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "smin": {
          synonym: "S min",
          multiline: false,
          tooltip: "Площадь min",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 3
          }
        },
        "smax": {
          synonym: "S max",
          multiline: false,
          tooltip: "Площадь max",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 3
          }
        },
        "for_direct_profile_only": {
          synonym: "Для прямых",
          multiline: false,
          tooltip: "Использовать только для прямых профилей (1), только для кривых (-1) или всегда(0)",
          "max": 1,
          "min": -1,
          type: {
            types: [
              "number"
            ],
            "digits": 1,
            "fraction": 0
          }
        },
        "ahmin": {
          synonym: "α min",
          multiline: false,
          tooltip: "AH min (угол к горизонтали)",
          "max": 360,
          "min": -360,
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "ahmax": {
          synonym: "α max",
          multiline: false,
          tooltip: "AH max (угол к горизонтали)",
          "max": 360,
          "min": -360,
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "priority": {
          synonym: "Приоритет",
          multiline: false,
          tooltip: "Не используется",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "mmin": {
          synonym: "Масса min",
          multiline: false,
          tooltip: "M min (масса)",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "mmax": {
          synonym: "Масса max",
          multiline: false,
          tooltip: "M max (масса)",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "can_rotate": {
          synonym: "Можно поворачивать",
          multiline: false,
          tooltip: "Используется при контроле размеров",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "sizeb": {
          synonym: "Размер \"B\"",
          multiline: false,
          tooltip: "Можно указать\n- размер в мм\n- половину ширины номенклатуры элемента\n- \"B\" из номенклатуры элемента\n- пару чисел [для импоста]/[для рамы], когда одна вставка используется в разных положениях",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "clr_group": {
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
        "is_order_row": {
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
          multiline: true,
          tooltip: "Расширенное описание в markdown",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "insert_glass_type": {
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
        "available": {
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
        "is_supplier": {
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
        "region": {
          synonym: "Ряд по умолчанию",
          multiline: false,
          tooltip: "Для вставок в ряды связок - актуально для витражных и прочих составных конструкций\n0 - не ряд\n1 - ряд внутри элемента\n>1 - за элементом\n<0 - перед элементом",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.lay_regions",
              "number"
            ],
            "digits": 2,
            "fraction": 0
          }
        },
        "split_type": {
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
        "pair": {
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
        "lay_split_types": {
          synonym: "Единственный тип деления",
          multiline: false,
          tooltip: "Запретить изменять тип деления",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "css": {
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
        "flipped": {
          synonym: "Перевёрнут",
          multiline: false,
          tooltip: "0 - ничего не переворачиваем\n1 - меняем углы на 180 - α\n2 - меняем b и e местами\n3 - меняем углы и b и e",
          type: {
            types: [
              "number"
            ],
            "digits": 1,
            "fraction": 0
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
        }
      },
      tabulars: {
        "specification": {
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
                "digits": 6,
                "fraction": 0
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
            "clr": {
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
                "digits": 14,
                "fraction": 8
              }
            },
            "sz": {
              synonym: "Размер",
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
            "coefficient": {
              synonym: "Коэфф.",
              multiline: false,
              tooltip: "коэффициент (кол-во комплектующего на 1мм профиля или 1м² заполнения)",
              type: {
                types: [
                  "number"
                ],
                "digits": 14,
                "fraction": 8
              }
            },
            "angle_calc_method": {
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
            "count_calc_method": {
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
            "formula": {
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
            "lmin": {
              synonym: "Длина min",
              multiline: false,
              tooltip: "Минимальная длина или ширина",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "lmax": {
              synonym: "Длина max",
              multiline: false,
              tooltip: "Максимальная длина или ширина",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "ahmin": {
              synonym: "Угол min",
              multiline: false,
              tooltip: "Минимальный угол к горизонтали",
              "max": 360,
              "min": -360,
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "ahmax": {
              synonym: "Угол max",
              multiline: false,
              tooltip: "Максимальный угол к горизонтали",
              "max": 360,
              "min": -360,
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "smin": {
              synonym: "S min",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 10,
                "fraction": 3
              }
            },
            "smax": {
              synonym: "S max",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 10,
                "fraction": 3
              }
            },
            "rmin": {
              synonym: "Радиус min",
              multiline: false,
              tooltip: "Минимальный радиус",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "rmax": {
              synonym: "Радиус max",
              multiline: false,
              tooltip: "Максимальный радиус",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "for_direct_profile_only": {
              synonym: "Для прямых",
              multiline: false,
              tooltip: "Использовать только для прямых профилей (1), только для кривых (-1) или всегда(0)",
              "max": 1,
              "min": -1,
              type: {
                types: [
                  "number"
                ],
                "digits": 1,
                "fraction": 0
              }
            },
            "step": {
              synonym: "Шаг",
              multiline: false,
              tooltip: "Шаг (расчет по точкам)",
              type: {
                types: [
                  "number"
                ],
                "digits": 10,
                "fraction": 3
              }
            },
            "step_angle": {
              synonym: "Угол шага",
              multiline: false,
              tooltip: "",
              "max": 360,
              "min": 0,
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "offsets": {
              synonym: "Отступы шага / длина мmax",
              multiline: false,
              tooltip: "Для способа расчёта \"По шагам\", задаёт отступы. В остальных случаях, ограничивает длину max",
              type: {
                types: [
                  "number"
                ],
                "digits": 10,
                "fraction": 3
              }
            },
            "do_center": {
              synonym: "↔",
              multiline: false,
              tooltip: "Положение от края или от центра",
              type: {
                types: [
                  "boolean"
                ]
              }
            },
            "attrs_option": {
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
            "is_order_row": {
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
            "is_main_elm": {
              synonym: "Это основной элемент",
              multiline: false,
              tooltip: "Для профильных вставок определяет номенклатуру, размеры которой будут использованы при построении эскиза",
              type: {
                types: [
                  "boolean"
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
        "selection_params": {
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
                "digits": 6,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
              }
            },
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
            "origin": {
              synonym: "Источник",
              multiline: false,
              tooltip: "",
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
              "choiceType": {
                path: [
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
                strLen: 1024,
                "datePart": "date_time",
                "digits": 15,
                "fraction": 3
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
                strLen: 0
              }
            }
          }
        },
        "product_params": {
          name: "ПараметрыИзделия",
          synonym: "Параметры изделия",
          tooltip: "Значения по умолчанию (для параметрических изделий)",
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
            "pos": {
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
            "list": {
              synonym: "Дискретный ряд",
              multiline: true,
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
        "inserts": {
          name: "Вставки",
          synonym: "Доп. вставки",
          tooltip: "Дополнительные рекомендуемые вставки в элемент",
          fields: {
            "inset": {
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
            "key": {
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
            "by_default": {
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
      cachable: "ram"
    },
    "parameters_keys": {
      name: "КлючиПараметров",
      synonym: "Ключи параметров",
      illustration: "Списки пар {Параметр:Значение} для фильтрации в подсистемах формирования спецификаций, планировании и ценообразовании\n",
      objPresentation: "Ключ параметров",
      listPresentation: "Ключи параметров",
      inputBy: [
        "name"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "k",
      fields: {
        "priority": {
          synonym: "Приоритет",
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
        note: {
          synonym: "Комментарий",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "sorting_field": {
          synonym: "Порядок",
          multiline: false,
          tooltip: "Используется для упорядочивания",
          type: {
            types: [
              "number"
            ],
            "digits": 5,
            "fraction": 0
          }
        },
        "applying": {
          synonym: "Применение",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.parameters_keys_applying"
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
        },
        parent: {
          synonym: "",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.parameters_keys"
            ]
          }
        }
      },
      tabulars: {
        "params": {
          name: "Параметры",
          synonym: "Параметры",
          tooltip: "",
          fields: {
            "property": {
              synonym: "Свойство",
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
            "area": {
              synonym: "Гр. ИЛИ",
              multiline: false,
              tooltip: "Позволяет формировать условия ИЛИ",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "origin": {
              synonym: "Источник",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "ref",
                  path: [
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
              choiceLinks: [
                {
                  name: [
                    "comparison_type"
                  ],
                  path: [
                    "params",
                    "comparison_type"
                  ]
                },
                {
                  name: [
                    "selection",
                    "owner"
                  ],
                  path: [
                    "params",
                    "property"
                  ]
                },
                {
                  name: [
                    "txt_row"
                  ],
                  path: [
                    "params",
                    "txt_row"
                  ]
                }
              ],
              "choiceType": {
                path: [
                  "params",
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
              tooltip: "Полный текст строкового реквизита либо сериализация списочного значения",
              type: {
                types: [
                  "string"
                ],
                strLen: 0
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "production_params": {
      
    },
    "delivery_areas": {
      name: "РайоныДоставки",
      synonym: "Районы доставки",
      illustration: "",
      objPresentation: "Район доставки",
      listPresentation: "Районы доставки",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "da",
      fields: {
        "country": {
          synonym: "Страна",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.countries"
            ]
          }
        },
        "region": {
          synonym: "Регион",
          multiline: false,
          tooltip: "Регион, край, область",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "city": {
          synonym: "Город (населенный пункт)",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "latitude": {
          synonym: "Гео. коорд. Широта",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 12
          }
        },
        "longitude": {
          synonym: "Гео. коорд. Долгота",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 12
          }
        },
        "delivery_area": {
          synonym: "Район (внутри города)",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "rstore": {
          synonym: "Региональный склад",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.stores"
            ]
          }
        }
      },
      tabulars: {
        coordinates: {
          name: "Координаты",
          synonym: "Координаты",
          tooltip: "Периметр района",
          fields: {
            "latitude": {
              synonym: "Гео. коорд. Широта",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 12
              }
            },
            "longitude": {
              synonym: "Гео. коорд. Долгота",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 12
              }
            }
          }
        }
      },
      cachable: "ram",
      "common": true
    },
    "cnns": {
      name: "пзСоединения",
      synonym: "Соединения элементов",
      illustration: "Спецификации соединений элементов. См.: {@tutorial cnns}",
      objPresentation: "Соединение",
      listPresentation: "Соединения",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "cnn",
      fields: {
        "priority": {
          synonym: "Приоритет",
          multiline: false,
          tooltip: "Для автоподстановки соединения (чем больше число, тем ниже по списку)",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "amin": {
          synonym: "Угол минимальный",
          multiline: false,
          tooltip: "",
          "max": 360,
          "min": -360,
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "amax": {
          synonym: "Угол максимальный",
          multiline: false,
          tooltip: "",
          "max": 360,
          "min": -360,
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "sd1": {
          synonym: "Сторона (фильтр)",
          multiline: false,
          tooltip: "Соединение доступно только для указанной стороны профиля (фильтр)",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.cnn_sides"
            ]
          }
        },
        "sd2": {
          synonym: "Сторона (отступ)",
          multiline: false,
          tooltip: "Откладывать \"размер\" от внутренней стороны профиля (0) или от внешней (1)",
          type: {
            types: [
              "number"
            ],
            "digits": 1,
            "fraction": 0
          }
        },
        "sz": {
          synonym: "Размер",
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
        "cnn_type": {
          synonym: "Тип соединения",
          multiline: false,
          tooltip: "Угловое, Т, Примыкающее и т.д.",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.cnn_types"
            ]
          }
        },
        "ahmin": {
          synonym: "AH min (угол к горизонтали)",
          multiline: false,
          tooltip: "",
          "max": 360,
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "ahmax": {
          synonym: "AH max (угол к горизонтали)",
          multiline: false,
          tooltip: "",
          "max": 360,
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "lmin": {
          synonym: "Длина шва min ",
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
        "lmax": {
          synonym: "Длина шва max ",
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
        "tmin": {
          synonym: "Толщина min ",
          multiline: false,
          tooltip: "",
          "max": 1000,
          "min": 0,
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "tmax": {
          synonym: "Толщина max ",
          multiline: false,
          tooltip: "",
          "max": 1000,
          "min": 0,
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "var_layers": {
          synonym: "Разн. плоск. створок",
          multiline: false,
          tooltip: "Створки в разных плоскостях",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "for_direct_profile_only": {
          synonym: "Для прямых",
          multiline: false,
          tooltip: "Использовать только для прямых профилей (1), только для кривых (-1) или всегда(0)",
          "max": 1,
          "min": -1,
          type: {
            types: [
              "number"
            ],
            "digits": 1,
            "fraction": 0
          }
        },
        "art1vert": {
          synonym: "Арт1 верт.",
          multiline: false,
          tooltip: "Соединение используется только в том случае, если Артикул1 - вертикальный",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "art1glass": {
          synonym: "Арт1 - стеклопакет",
          multiline: false,
          tooltip: "Артикул1 может быть составным стеклопакетом",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "art2glass": {
          synonym: "Арт2 - стеклопакет",
          multiline: false,
          tooltip: "Артикул2 может быть составным стеклопакетом",
          type: {
            types: [
              "boolean"
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
            strLen: 0
          }
        },
        "applying": {
          synonym: "Применение",
          multiline: false,
          tooltip: "Применимость соединения на стыке, честном Т или в любом месте:\n- 0 - Везде\n- 1 - Только стык\n- 2 - Только T\n- 3 - Только угол",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "region": {
          synonym: "Доступный ряд",
          multiline: false,
          tooltip: "Применимость соединения в рядах:\n0 - Любой (в том числе, обычные соединения)\n1 - Ряд внутри элемента\n<0 - Ряд перед элементом\n>1 - Ряд за элементом",
          type: {
            types: [
              "number"
            ],
            "digits": 2,
            "fraction": 0
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
        }
      },
      tabulars: {
        "specification": {
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
                "digits": 6,
                "fraction": 0
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
            "clr": {
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
            "coefficient": {
              synonym: "Коэффициент",
              multiline: false,
              tooltip: "коэффициент (кол-во комплектующего на 1мм профиля)",
              type: {
                types: [
                  "number"
                ],
                "digits": 14,
                "fraction": 8
              }
            },
            "sz": {
              synonym: "Размер",
              multiline: false,
              tooltip: "размер (в мм, на которое компл. заходит на Артикул 2)",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
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
                "digits": 14,
                "fraction": 8
              }
            },
            "formula": {
              synonym: "Формула",
              multiline: false,
              tooltip: "",
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
                types: [
                  "cat.formulas"
                ]
              }
            },
            "sz_min": {
              synonym: "Размер min",
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
            "sz_max": {
              synonym: "Размер max",
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
            "amin": {
              synonym: "Угол min",
              multiline: false,
              tooltip: "",
              "max": 360,
              "min": -360,
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "amax": {
              synonym: "Угол max",
              multiline: false,
              tooltip: "",
              "max": 360,
              "min": -360,
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "set_specification": {
              synonym: "Устанавливать",
              multiline: false,
              tooltip: "Устанавливать спецификацию",
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.specification_installation_methods"
                ]
              }
            },
            "for_direct_profile_only": {
              synonym: "Для прямых",
              multiline: false,
              tooltip: "Использовать только для прямых профилей (1), только для кривых (-1) или всегда(0)",
              "max": 1,
              "min": -1,
              type: {
                types: [
                  "number"
                ],
                "digits": 1,
                "fraction": 0
              }
            },
            "alp2": {
              synonym: "Учитывать α>180",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "boolean"
                ]
              }
            },
            "angle_calc_method": {
              synonym: "Расчет угла",
              multiline: false,
              tooltip: "Способ расчета угла",
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.angle_calculating_ways"
                ]
              }
            },
            "contour_number": {
              synonym: "Контур №",
              multiline: false,
              tooltip: "Номер контура (доп)",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "is_order_row": {
              synonym: "Это строка заказа",
              multiline: false,
              tooltip: "Если заполнено, строка будет добавлена в заказ, а не в спецификацию текущей продукции",
              choiceParams: [
                {
                  name: "ref",
                  path: [
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
        "cnn_elmnts": {
          name: "СоединяемыеЭлементы",
          synonym: "Соединяемые элементы",
          tooltip: "",
          fields: {
            "nom1": {
              synonym: "Номенклатура1",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.nom"
                ]
              }
            },
            "clr1": {
              synonym: "Цвет1",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.clrs"
                ]
              }
            },
            "nom2": {
              synonym: "Номенклатура2",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.nom"
                ]
              }
            },
            "clr2": {
              synonym: "Цвет2",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.clrs"
                ]
              }
            },
            "is_nom_combinations_row": {
              synonym: "Это строка сочетания номенклатур",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "boolean"
                ]
              }
            }
          }
        },
        "selection_params": {
          name: "ПараметрыОтбора",
          synonym: "Параметры отбора",
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
                "digits": 6,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
              }
            },
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
            "origin": {
              synonym: "Источник",
              multiline: false,
              tooltip: "",
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
              "choiceType": {
                path: [
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
                strLen: 1024,
                "datePart": "date_time",
                "digits": 15,
                "fraction": 3
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
                strLen: 0
              }
            }
          }
        },
        "sizes": {
          name: "Размеры",
          synonym: "Размеры",
          tooltip: "Варианты размеров с фильтром по параметрам",
          fields: {
            "elm": {
              synonym: "Размер",
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
            "origin": {
              synonym: "Источник",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "ref",
                  path: [
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
              "choiceType": {
                path: [
                  "sizes",
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
            "txt_row": {
              synonym: "Текстовая строка",
              multiline: false,
              tooltip: "Полный текст строкового реквизита либо сериализация списочного значения",
              type: {
                types: [
                  "string"
                ],
                strLen: 0
              }
            },
            "key": {
              synonym: "Ключ",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.parameters_keys"
                ]
              }
            }
          }
        },
        "priorities": {
          name: "Приоритеты",
          synonym: "Приоритеты",
          tooltip: "",
          fields: {
            "sys": {
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
            "orientation": {
              synonym: "Ориентация",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.orientations"
                ]
              }
            },
            "priority": {
              synonym: "Приоритет",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            }
          }
        },
        coordinates: {
          name: "Координаты",
          synonym: "Координаты",
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
                "digits": 6,
                "fraction": 0
              }
            },
            "offset_option": {
              synonym: "Смещ. от",
              multiline: false,
              tooltip: "",
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
            "formula": {
              synonym: "Формула",
              multiline: false,
              tooltip: "",
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
            }
          }
        }
      },
      cachable: "ram"
    },
    "furns": {
      name: "пзФурнитура",
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
      id: "frn",
      fields: {
        "flap_weight_max": {
          synonym: "Масса створки макс",
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
        "left_right": {
          synonym: "Левая правая",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "is_set": {
          synonym: "Это набор",
          multiline: false,
          tooltip: "Определяет, является элемент набором для построения спецификации или комплектом фурнитуры для выбора в построителе",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "is_sliding": {
          synonym: "Это раздвижка",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "furn_set": {
          synonym: "Набор фурнитуры",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "is_set",
              path: true
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.furns"
            ]
          }
        },
        "side_count": {
          synonym: "Количество сторон",
          multiline: false,
          tooltip: "",
          "max": 8,
          "min": 0,
          type: {
            types: [
              "number"
            ],
            "digits": 1,
            "fraction": 0
          }
        },
        "clr_group": {
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
              "cat.color_price_groups"
            ]
          }
        },
        "handle_side": {
          synonym: "Ручка на стороне",
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
        "open_type": {
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
        "name_short": {
          synonym: "Синоним",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 3
          }
        },
        "applying": {
          synonym: "Уровень",
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
        "formula": {
          synonym: "График размеров",
          multiline: false,
          tooltip: "Альтернатива табчасти \"НастройкиОткрывания\", чтобы задать размеры min-max",
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
        "open_tunes": {
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
                "digits": 1,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
              }
            },
            "amin": {
              synonym: "α min",
              multiline: false,
              tooltip: "Минимальный угол к соседнему элементу",
              "max": 360,
              "min": 0,
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "amax": {
              synonym: "α max",
              multiline: false,
              tooltip: "Максимальный угол к соседнему элементу",
              "max": 360,
              "min": 0,
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
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
                "digits": 3,
                "fraction": 0
              }
            }
          }
        },
        "specification": {
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
                "digits": 6,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
              }
            },
            nom: {
              synonym: "Номенклатура/Набор",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "is_set",
                  path: true
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
            "clr": {
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
                "digits": 14,
                "fraction": 8
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
                "digits": 6,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
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
                "digits": 1,
                "fraction": 0
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
                strLen: 100,
                "digits": 8,
                "fraction": 2
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
                "digits": 14,
                "fraction": 8
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
                "digits": 6,
                "fraction": 0
              }
            },
            "flap_weight_max": {
              synonym: "Масса створки max",
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
            "side": {
              synonym: "Сторона",
              multiline: false,
              tooltip: "Сторона фурнитуры, на которую устанавливается элемент или выполняется операция",
              type: {
                types: [
                  "number"
                ],
                "digits": 1,
                "fraction": 0
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
            "formula": {
              synonym: "Формула",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "parent",
                  path: [
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
                "digits": 1,
                "fraction": 0
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
                "digits": 1,
                "fraction": 0
              }
            },
            "is_order_row": {
              synonym: "Это строка заказа",
              multiline: false,
              tooltip: "Если заполнено, строка будет добавлена в заказ, а не в спецификацию текущей продукции",
              choiceParams: [
                {
                  name: "ref",
                  path: [
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
        "selection_params": {
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
                "digits": 6,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
              }
            },
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
            "origin": {
              synonym: "Источник",
              multiline: false,
              tooltip: "",
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
              "choiceType": {
                path: [
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
                strLen: 1024,
                "datePart": "date_time",
                "digits": 15,
                "fraction": 3
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
                strLen: 0
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
                "digits": 6,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
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
                "digits": 1,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
              }
            },
            "amin": {
              synonym: "α мин",
              multiline: false,
              tooltip: "",
              "max": 360,
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "amax": {
              synonym: "α макс",
              multiline: false,
              tooltip: "",
              "max": 360,
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "for_direct_profile_only": {
              synonym: "Для прямых",
              multiline: false,
              tooltip: "Использовать только для прямых профилей (1), только для кривых (-1) или всегда(0)",
              "max": 1,
              "min": -1,
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
                "digits": 6,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
              }
            },
            "formula": {
              synonym: "График размеров",
              multiline: false,
              tooltip: "Альтернатива табчасти \"НастройкиОткрывания\", чтобы задать размеры min-max",
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
            "furn_set": {
              synonym: "Набор фурнитуры",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "is_set",
                  path: true
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
      cachable: "ram"
    },
    "clrs": {
      name: "пзЦвета",
      synonym: "Цвета",
      illustration: "",
      objPresentation: "Цвет",
      listPresentation: "Цвета",
      inputBy: [
        "name",
        "ral",
        "id"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "clr",
      fields: {
        "ral": {
          synonym: "Цвет RAL",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 20
          }
        },
        "machine_tools_clr": {
          synonym: "Код для станка",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 20
          }
        },
        "clr_str": {
          synonym: "Цвет в построителе",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 36
          }
        },
        "clr_out": {
          synonym: "Цвет снаружи",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "clr_out",
              path: "00000000-0000-0000-0000-000000000000"
            },
            {
              name: "clr_in",
              path: "00000000-0000-0000-0000-000000000000"
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.clrs"
            ]
          }
        },
        "clr_in": {
          synonym: "Цвет изнутри",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "clr_out",
              path: "00000000-0000-0000-0000-000000000000"
            },
            {
              name: "clr_in",
              path: "00000000-0000-0000-0000-000000000000"
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.clrs"
            ]
          }
        },
        "grouping": {
          synonym: "Группировка",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.property_values"
            ]
          }
        },
        "area_src": {
          synonym: "Источник площади",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.coloring"
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
        },
        parent: {
          synonym: "Группа",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.clrs"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "color_price_groups": {
      name: "ЦветоЦеновыеГруппы",
      synonym: "Цвето-ценовые группы",
      illustration: "",
      objPresentation: "Цвето-ценовая группа",
      listPresentation: "Цвето-ценовые группы",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "clg",
      fields: {
        "color_price_group_destination": {
          synonym: "Назначение",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.color_price_group_destinations"
            ]
          }
        },
        "condition_formula": {
          synonym: "Формула условия",
          multiline: false,
          tooltip: "В этом поле можно указать дополнительное условие на языке javascript",
          choiceParams: [
            {
              name: "parent",
              path: "1cce6b82-73be-11e9-94bb-98d95b9a5346"
            },
            {
              name: "disabled",
              path: false
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.formulas"
            ]
          }
        },
        "mode": {
          synonym: "Режим",
          multiline: false,
          tooltip: "Режим формулы",
          "max": 1,
          "min": 0,
          type: {
            types: [
              "number"
            ],
            "digits": 1,
            "fraction": 0
          }
        },
        "hide_composite": {
          synonym: "Скрыть составные",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "clr": {
          synonym: "Приведение цвета",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "parent",
              path: "faf4d037-7d9a-4d4e-ad65-ba01caa36481"
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.clrs"
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
        }
      },
      tabulars: {
        "price_groups": {
          name: "ЦеновыеГруппы",
          synonym: "Ценовые группы",
          tooltip: "",
          fields: {
            "price_group": {
              synonym: "Ценовая гр. или номенклатура",
              multiline: false,
              tooltip: "Ссылка на ценовую группу или номенклатуру или папку (родитель - первый уровень иерархии) номенклатуры, для которой действует соответствие цветов",
              type: {
                types: [
                  "cat.price_groups",
                  "cat.nom"
                ]
              }
            }
          }
        },
        "clr_conformity": {
          name: "СоответствиеЦветов",
          synonym: "Соответствие цветов",
          tooltip: "",
          fields: {
            "clr1": {
              synonym: "Цвет",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "cat.color_price_groups",
                  "string",
                  "cat.clrs"
                ],
                strLen: 72,
                "strFix": true
              }
            },
            "clr2": {
              synonym: "Соответствие",
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
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.clrs"
                ]
              }
            }
          }
        },
        "exclude": {
          name: "Исключить",
          synonym: "Исключения сторон",
          tooltip: "",
          fields: {
            "side": {
              synonym: "Сторона",
              multiline: false,
              tooltip: "* Любая - общий цвет",
              choiceParams: [
                {
                  name: "ref",
                  path: [
                    "Изнутри",
                    "Снаружи",
                    "Любая"
                  ]
                }
              ],
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "enm.cnn_sides"
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
                  path: "00000000-0000-0000-0000-000000000000"
                },
                {
                  name: "clr_out",
                  path: "00000000-0000-0000-0000-000000000000"
                }
              ],
              mandatory: true,
              type: {
                types: [
                  "cat.color_price_groups",
                  "cat.clrs"
                ]
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "users": {
      name: "Пользователи",
      synonym: "Пользователи",
      illustration: "",
      objPresentation: "Пользователь",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "u",
      fields: {
        "invalid": {
          synonym: "Недействителен",
          multiline: false,
          tooltip: "Пользователь больше не работает в программе, но сведения о нем сохранены.\nНедействительные пользователи скрываются из всех списков\nпри выборе или подборе в документах и других местах программы.",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "department": {
          synonym: "Подразделение",
          multiline: false,
          tooltip: "Подразделение, в котором работает пользователь",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.divisions"
            ]
          }
        },
        "individual_person": {
          synonym: "Физическое лицо",
          multiline: false,
          tooltip: "Физическое лицо, с которым связан пользователь",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.individuals"
            ]
          }
        },
        note: {
          synonym: "Комментарий",
          multiline: true,
          tooltip: "Произвольная строка",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "ancillary": {
          synonym: "Служебный",
          multiline: false,
          tooltip: "Неразделенный или разделенный служебный пользователь, права к которому устанавливаются непосредственно и программно.",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "user_ib_uid": {
          synonym: "Идентификатор пользователя ИБ",
          multiline: false,
          tooltip: "Уникальный идентификатор пользователя информационной базы, с которым сопоставлен этот элемент справочника.",
          choiceGrp: "elm",
          type: {
            types: [
              "string"
            ],
            strLen: 36,
            "strFix": true
          }
        },
        id: {
          synonym: "Логин",
          multiline: true,
          tooltip: "Произвольная строка",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        latin: {
          synonym: "latin",
          multiline: true,
          tooltip: "Произвольная строка",
          type: {
            types: [
              "string"
            ],
            strLen: 100
          }
        },
        "prefix": {
          synonym: "Префикс нумерации",
          multiline: false,
          tooltip: "Префикс номеров документов текущего пользователя",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 2
          }
        },
        "ips": {
          synonym: "IP-адреса входа",
          multiline: false,
          tooltip: "Список ip-адресов с маской через запятую, с которых разрешена авторизация\n192.168.9.0/24, 192.168.21.*",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "suffix": {
          synonym: "Суффикс CouchDB",
          multiline: false,
          tooltip: "Для разделения данных в CouchDB",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 4
          }
        },
        "direct": {
          synonym: "Direct",
          multiline: false,
          tooltip: "Для пользователя запрещен режим offline",
          type: {
            types: [
              "boolean"
            ]
          }
        }
      },
      tabulars: {
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "Дополнительные реквизиты объекта",
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
        "contact_information": {
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
            "kind": {
              synonym: "Вид",
              multiline: false,
              tooltip: "Вид контактной информации",
              choiceParams: [
                {
                  name: "parent",
                  path: "8cbaa30d-faab-45ad-880e-84f8b421f448"
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.contact_information_kinds"
                ]
              }
            },
            "presentation": {
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
            "values_fields": {
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
            "country": {
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
            "region": {
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
            "city": {
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
            "email_address": {
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
            "phone_number": {
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
            "phone_without_codes": {
              synonym: "Номер телефона без кодов",
              multiline: false,
              tooltip: "Номер телефона без кодов и добавочного номера",
              type: {
                types: [
                  "string"
                ],
                strLen: 20
              }
            },
            "list_view": {
              synonym: "Вид для списка",
              multiline: false,
              tooltip: "Вид контактной информации для списка",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.contact_information_kinds"
                ]
              }
            }
          }
        },
        "acl_objs": {
          name: "ОбъектыДоступа",
          synonym: "Объекты доступа",
          tooltip: "",
          fields: {
            "obj": {
              synonym: "Объект",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "cat.individuals",
                  "cat.users",
                  "cat.nom_prices_types",
                  "cat.divisions",
                  "cat.parameters_keys",
                  "cat.partners",
                  "cat.organizations",
                  "cat.abonents",
                  "cat.cashboxes",
                  "cat.meta_ids",
                  "cat.stores"
                ]
              }
            },
            type: {
              synonym: "Тип",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 50
              }
            },
            "by_default": {
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
        },
        "ids": {
          name: "Идентификаторы",
          synonym: "Идентификаторы авторизации",
          tooltip: "",
          fields: {
            "identifier": {
              synonym: "Идентификатор",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "string"
                ],
                strLen: 255
              }
            },
            "server": {
              synonym: "Сервер",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.servers"
                ]
              }
            },
            "password_hash": {
              synonym: "password_scheme",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 1000
              }
            }
          }
        },
        "subscribers": {
          name: "Абоненты",
          synonym: "Абоненты",
          tooltip: "",
          fields: {
            "abonent": {
              synonym: "Абонент",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "area",
                  path: false
                }
              ],
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.abonents"
                ]
              }
            },
            "branch": {
              synonym: "Отдел",
              multiline: false,
              tooltip: "",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "owner"
                  ],
                  path: [
                    "subscribers",
                    "abonent"
                  ]
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.branches"
                ]
              }
            },
            "roles": {
              synonym: "Роли Couchdb",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "json"
                ]
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "projects": {
      name: "Проекты",
      synonym: "Проекты",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 11,
      id: "pt",
      fields: {
        "finished": {
          synonym: "Завершен",
          multiline: false,
          tooltip: "Признак, указывающий на то, что работы по проекту завершены.",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "Ответственный за реализацию проекта.",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.users"
            ]
          }
        },
        note: {
          synonym: "Комментарий",
          multiline: false,
          tooltip: "Любые комментарии по проекту",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "category": {
          synonym: "Категория",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.project_categories"
            ]
          }
        },
        parent: {
          synonym: "",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.projects"
            ]
          }
        }
      },
      tabulars: {
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
        "stages": {
          name: "Этапы",
          synonym: "Этапы",
          tooltip: "",
          fields: {
            "stage": {
              synonym: "Этап",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "grouping",
                  path: false
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.project_stages"
                ]
              }
            },
            "date": {
              synonym: "Дата",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "date"
                ],
                "datePart": "date_time"
              }
            },
            responsible: {
              synonym: "Ответственный",
              multiline: false,
              tooltip: "Ответственный за регистрацию этапа",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.users"
                ]
              }
            },
            note: {
              synonym: "Комментарий",
              multiline: false,
              tooltip: "Комментарии к этапу",
              type: {
                types: [
                  "string"
                ],
                strLen: 0
              }
            }
          }
        },
        "acl_objs": {
          name: "ОбъектыДоступа",
          synonym: "Объекты доступа",
          tooltip: "",
          fields: {
            "obj": {
              synonym: "Объект доступа",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "area",
                  path: false
                }
              ],
              type: {
                types: [
                  "cat.users",
                  "cat.divisions",
                  "cat.abonents",
                  "cat.branches"
                ]
              }
            }
          }
        }
      },
      cachable: "doc"
    },
    "stores": {
      name: "Склады",
      synonym: "Склады (места хранения)",
      illustration: "Сведения о местах хранения товаров (складах), их структуре и физических лицах, назначенных материально ответственными (МОЛ) за тот или иной склад",
      objPresentation: "Склад",
      listPresentation: "Склады",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "str",
      fields: {
        "department": {
          synonym: "Подразделение",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.divisions"
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
            strLen: 0
          }
        },
        "assembly_days": {
          synonym: "Дней для сборки",
          multiline: false,
          tooltip: "Разрыв \"производство -> доставка\", дней",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "address": {
          synonym: "Адрес",
          multiline: false,
          tooltip: "Географический адрес",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "latitude": {
          synonym: "Широта",
          multiline: false,
          tooltip: "Географические координаты (широта)",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 12
          }
        },
        "longitude": {
          synonym: "Долгота",
          multiline: false,
          tooltip: "Географические координаты (долгота)",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 12
          }
        },
        "delivery_area": {
          synonym: "Район",
          multiline: false,
          tooltip: "Географическая зона, к которой привязан адрес",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.delivery_areas"
            ]
          }
        },
        "address_fields": {
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
        parent: {
          synonym: "Группа",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.stores"
            ]
          }
        }
      },
      tabulars: {
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
        }
      },
      cachable: "ram"
    },
    "work_shifts": {
      name: "Смены",
      synonym: "Смены",
      illustration: "Перечень рабочих смен предприятия",
      objPresentation: "Смена",
      listPresentation: "Смены",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "str",
      fields: {
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
        "work_shift_periodes": {
          name: "ПериодыСмены",
          synonym: "Периоды смены",
          tooltip: "",
          fields: {
            "begin_time": {
              synonym: "Время начала",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "date"
                ],
                "datePart": "time"
              }
            },
            "end_time": {
              synonym: "Время окончания",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "date"
                ],
                "datePart": "time"
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "cash_flow_articles": {
      name: "СтатьиДвиженияДенежныхСредств",
      synonym: "Статьи движения денежных средств",
      illustration: "Перечень статей движения денежных средств (ДДС), используемых в предприятии для проведения анализа поступлений и расходов в разрезе статей движения денежных средств. ",
      objPresentation: "Статья движения денежных средств",
      listPresentation: "Статьи движения денежных средств",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "mpt",
      fields: {
        "definition": {
          synonym: "Описание",
          multiline: true,
          tooltip: "Рекомендации по выбору статьи движения денежных средств в документах",
          type: {
            types: [
              "string"
            ],
            strLen: 1024
          }
        },
        "sorting_field": {
          synonym: "Порядок",
          multiline: false,
          tooltip: "Определяет порядок вывода вариантов анализа в мониторе целевых показателей при группировке по категориям целей.",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
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
        },
        parent: {
          synonym: "В группе статей",
          multiline: false,
          tooltip: "Группа статей движения денежных средств",
          type: {
            types: [
              "cat.cash_flow_articles"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "nom_prices_types": {
      name: "ТипыЦенНоменклатуры",
      synonym: "Типы цен номенклатуры",
      illustration: "Перечень типов отпускных цен предприятия",
      objPresentation: "Тип цен номенклатуры",
      listPresentation: "Типы цен номенклатуры",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "prc",
      fields: {
        "price_currency": {
          synonym: "Валюта цены по умолчанию",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.currencies"
            ]
          }
        },
        "discount_percent": {
          synonym: "Процент скидки или наценки по умолчанию",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 5,
            "fraction": 2
          }
        },
        "vat_price_included": {
          synonym: "Цена включает НДС",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "rounding_order": {
          synonym: "Порядок округления",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 10
          }
        },
        "rounding_in_a_big_way": {
          synonym: "Округлять в большую сторону",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
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
            strLen: 0
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "individuals": {
      name: "ФизическиеЛица",
      synonym: "Физические лица",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 10,
      id: "ip",
      fields: {
        "birth_date": {
          synonym: "Дата рождения",
          multiline: false,
          tooltip: "Дата рождения физического лица",
          type: {
            types: [
              "date"
            ],
            "datePart": "date"
          }
        },
        "sex": {
          synonym: "Пол",
          multiline: false,
          tooltip: "Пол физического лица",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.gender"
            ]
          }
        },
        "imns_code": {
          synonym: "Код ИФНС",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 4
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
            strLen: 0
          }
        },
        "inn": {
          synonym: "ИНН",
          multiline: false,
          tooltip: "Индивидуальный номер налогоплательщика сотрудника",
          type: {
            types: [
              "string"
            ],
            strLen: 12
          }
        },
        "pfr_number": {
          synonym: "СНИЛС",
          multiline: false,
          tooltip: "Страховой номер сотрудника в пенсионном фонде",
          type: {
            types: [
              "string"
            ],
            strLen: 14
          }
        },
        "birth_place": {
          synonym: "Место рождения",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 240
          }
        },
        "Фамилия": {
          synonym: "Фамилия",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "Имя": {
          synonym: "Имя",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "Отчество": {
          synonym: "Отчество",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "ФамилияРП": {
          synonym: "Фамилия (родительный падеж)",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "ИмяРП": {
          synonym: "Имя (родительный падеж)",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "ОтчествоРП": {
          synonym: "Отчество (родительный падеж)",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "ОснованиеРП": {
          synonym: "Основание (родительный падеж)",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "ДолжностьРП": {
          synonym: "Должность (родительный падеж)",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "Должность": {
          synonym: "Должность",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 50
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
        },
        parent: {
          synonym: "",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.individuals"
            ]
          }
        }
      },
      tabulars: {
        "contact_information": {
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
            "kind": {
              synonym: "Вид",
              multiline: false,
              tooltip: "Вид контактной информации",
              choiceParams: [
                {
                  name: "parent",
                  path: "822f19bc-09ab-4913-b283-b5461382a75d"
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.contact_information_kinds"
                ]
              }
            },
            "presentation": {
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
            "values_fields": {
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
            "country": {
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
            "region": {
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
            "city": {
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
            "email_address": {
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
            "phone_number": {
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
            "phone_without_codes": {
              synonym: "Номер телефона без кодов",
              multiline: false,
              tooltip: "Номер телефона без кодов и добавочного номера",
              type: {
                types: [
                  "string"
                ],
                strLen: 20
              }
            },
            "list_view": {
              synonym: "Вид для списка",
              multiline: false,
              tooltip: "Вид контактной информации для списка",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.contact_information_kinds"
                ]
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "characteristics": {
      name: "ХарактеристикиНоменклатуры",
      synonym: "Характеристики номенклатуры",
      illustration: "Дополнительные характеристики элементов номенклатуры: цвет, размер и т.п.",
      objPresentation: "Характеристика номенклатуры",
      listPresentation: "Характеристики номенклатуры",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: true,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "cx",
      fields: {
        "x": {
          synonym: "Длина, мм",
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
        "y": {
          synonym: "Высота, мм",
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
        "z": {
          synonym: "Толщина, мм",
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
        "s": {
          synonym: "Площадь, м²",
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
        "clr": {
          synonym: "Цвет",
          multiline: false,
          tooltip: "",
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
        "weight": {
          synonym: "Масса, кг",
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
        "calc_order": {
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
        "product": {
          synonym: "Изделие",
          multiline: false,
          tooltip: "Для продукции - номер строки заказа, для характеристики стеклопакета - номер элемента",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "leading_product": {
          synonym: "Ведущая продукция",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.characteristics"
            ]
          }
        },
        "leading_elm": {
          synonym: "Ведущий элемент",
          multiline: false,
          tooltip: "Номер элемента или слоя ведущей продукции",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "origin": {
          synonym: "Происхождение",
          multiline: false,
          tooltip: "Породившая продукцию Вставка или Заказ поставщику",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.inserts",
              "doc.purchase_order"
            ],
            "default": "cat.inserts"
          }
        },
        "base_block": {
          synonym: "Типовой блок",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.characteristics"
            ]
          }
        },
        "sys": {
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
        "obj_delivery_state": {
          synonym: "Этап согласования",
          multiline: false,
          tooltip: "Для целей RLS",
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
        "partner": {
          synonym: "Контрагент",
          multiline: false,
          tooltip: "Для целей RLS",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.partners"
            ]
          }
        },
        "department": {
          synonym: "Офис продаж",
          multiline: false,
          tooltip: "Для целей RLS",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.divisions"
            ]
          }
        },
        "builder_props": {
          synonym: "Доп. свойства построителя",
          multiline: false,
          tooltip: "Объект JSON-строкой",
          type: {
            types: [
              "string"
            ],
            strLen: 1000
          }
        },
        "svg": {
          synonym: "Миниэскиз",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          },
          "compress": true
        },
        "extra": {
          synonym: "Допреквизиты и параметры",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "json"
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
        "route": {
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
        "branch": {
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
        "owner": {
          synonym: "Номенклатура",
          multiline: false,
          tooltip: "Характеристика может быть подчинена, кроме {@link CatNom|Номенклатуры), элементам справочника {@link CatNom_kinds|ВидыНоменклатуры}, что экономило бы ссылки (одну характеристику на несколько номенклатур), но в сейчас это не используется",
          mandatory: true,
          type: {
            types: [
              "cat.nom_kinds",
              "cat.nom"
            ]
          }
        }
      },
      tabulars: {
        "constructions": {
          name: "Конструкции",
          synonym: "Конструкции",
          tooltip: "Конструкции изделия. Они же - слои или контуры",
          fields: {
            "cnstr": {
              synonym: "№ Конструкции",
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
            parent: {
              synonym: "Внешн. констр.",
              multiline: false,
              tooltip: "№ внешней конструкции",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "x": {
              synonym: "Ширина, м",
              multiline: false,
              tooltip: "Габаритная ширина контура",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "y": {
              synonym: "Высота, м",
              multiline: false,
              tooltip: "Габаритная высота контура",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "z": {
              synonym: "Глубина",
              multiline: false,
              tooltip: "Z-координата плоскости (z-index) длч многослойных конструкций",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "w": {
              synonym: "Ширина фурн",
              multiline: false,
              tooltip: "Ширина фурнитуры (по фальцу)",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "h": {
              synonym: "Высота фурн",
              multiline: false,
              tooltip: "Высота фурнитуры (по фальцу)",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "furn": {
              synonym: "Фурнитура",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "is_folder",
                  path: false
                },
                {
                  name: "is_set",
                  path: false
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.furns"
                ]
              }
            },
            "direction": {
              synonym: "Направл. откр.",
              multiline: false,
              tooltip: "Направление открывания",
              choiceParams: [
                {
                  name: "ref",
                  path: [
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
            "h_ruch": {
              synonym: "Высота ручки",
              multiline: false,
              tooltip: "Высота ручки в координатах контура (от габарита створки)",
              "min": 0,
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "fix_ruch": {
              synonym: "Высота ручки фиксирована",
              multiline: false,
              tooltip: "Вычисляется по свойствам фурнитуры",
              "min": 0,
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "is_rectangular": {
              synonym: "Есть кривые",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "boolean"
                ]
              }
            },
            "kind": {
              synonym: "Вид слоя",
              multiline: false,
              tooltip: "0 - обычный слой\n1 - виртуальный\n2 - вложенное изделие\n3 - слой родительского изделия\n4 - разрыв заполнения\n5 - слой ряда\n10 - вирт. изделие к слою\n11 - вирт. изделие к изделию",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "flipped": {
              synonym: "Перевёрнут",
              multiline: false,
              tooltip: "Штапик наружу\n(0) - авто, (1) - перевёрнут, (-1) - не перевёрнут",
              type: {
                types: [
                  "number"
                ],
                "digits": 1,
                "fraction": 0
              }
            },
            "dop": {
              synonym: "Допреквизиты и параметры",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "json"
                ]
              }
            }
          }
        },
        coordinates: {
          name: "Координаты",
          synonym: "Координаты",
          tooltip: "Координаты элементов",
          fields: {
            "cnstr": {
              synonym: "Конструкция",
              multiline: false,
              tooltip: "Номер конструкции (слоя)",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            parent: {
              synonym: "Родитель",
              multiline: false,
              tooltip: "Дополнительная иерархия. Например, номер стеклопакета для раскладки или внешняя примыкающая палка для створки или доборного профиля",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "region": {
              synonym: "Ряд",
              multiline: false,
              tooltip: "Для расклодок: inner, outer, 1, 2, 3\nДля прочих:\n0 - не ряд\n1 - ряд внутри элемента\n>1 - за элементом\n<0 - перед элементом",
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.lay_regions",
                  "number"
                ],
                "digits": 2,
                "fraction": 0
              }
            },
            "elm": {
              synonym: "Элемент",
              multiline: false,
              tooltip: "Номер элемента",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "elm_type": {
              synonym: "Тип элемента",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.elm_types"
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
                  "string",
                  "cat.clrs"
                ],
                strLen: 72,
                "strFix": true
              }
            },
            "inset": {
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
            "path_data": {
              synonym: "Путь SVG",
              multiline: false,
              tooltip: "Данные пути образующей в терминах svg или json элемента",
              type: {
                types: [
                  "string"
                ],
                strLen: 1000
              }
            },
            "x1": {
              synonym: "X1",
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
            "y1": {
              synonym: "Y1",
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
            "x2": {
              synonym: "X2",
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
            "y2": {
              synonym: "Y2",
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
            "r": {
              synonym: "Радиус",
              multiline: false,
              tooltip: "Вспомогательное поле - частный случай криволинейного элемента",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "arc_ccw": {
              synonym: "Против часов.",
              multiline: false,
              tooltip: "Вспомогательное поле - частный случай криволинейного элемента - дуга против часовой стрелки",
              type: {
                types: [
                  "boolean"
                ]
              }
            },
            "s": {
              synonym: "Площадь",
              multiline: false,
              tooltip: "Вычисляемое",
              type: {
                types: [
                  "number"
                ],
                "digits": 14,
                "fraction": 6
              }
            },
            "angle_hor": {
              synonym: "Угол к горизонту",
              multiline: false,
              tooltip: "Вычисляется для прямой, проходящей через узлы",
              "max": 360,
              "min": 0,
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "alp1": {
              synonym: "Угол 1, °",
              multiline: false,
              tooltip: "Вычисляемое - угол реза в первом узле",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "alp2": {
              synonym: "Угол 2, °",
              multiline: false,
              tooltip: "Вычисляемое - угол реза во втором узле",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "len": {
              synonym: "Длина, м",
              multiline: false,
              tooltip: "Вычисляется по координатам и соединениям",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "pos": {
              synonym: "Положение",
              multiline: false,
              tooltip: "Вычисляется во соседним элементам",
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.positions"
                ]
              }
            },
            "orientation": {
              synonym: "Ориентация",
              multiline: false,
              tooltip: "Вычисляется по углу к горизонту",
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.orientations"
                ]
              }
            },
            nom: {
              synonym: "Номенклатура",
              multiline: false,
              tooltip: "Вычисляется по вставке, геометрии и параметрам",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.nom"
                ]
              }
            },
            "offset": {
              synonym: "Смещение",
              multiline: false,
              tooltip: "Смещение от опорной линии d0",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "dop": {
              synonym: "Допреквизиты и параметры",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "json"
                ]
              }
            }
          }
        },
        "inserts": {
          name: "Вставки",
          synonym: "Вставки",
          tooltip: "Дополнительные вставки в изделие и контуры",
          fields: {
            "cnstr": {
              synonym: "Конструкция",
              multiline: false,
              tooltip: "Номер конструкции (слоя)\nЕсли 0, вставка относится к изделию.\nЕсли >0 - к контуру\nЕсли <0 - к элементу",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "region": {
              synonym: "Ряд",
              multiline: false,
              tooltip: "0 - не ряд\n1 - ряд внутри элемента\n>1 - за элементом\n<0 - перед элементом",
              type: {
                types: [
                  "number"
                ],
                "digits": 2,
                "fraction": 0
              }
            },
            "inset": {
              synonym: "Вставка",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "insert_type",
                  path: [
                    "МоскитнаяСетка",
                    "Контур",
                    "Изделие",
                    "Профиль",
                    "Элемент"
                  ]
                },
                {
                  name: "available",
                  path: true
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.inserts"
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
                  "string",
                  "cat.clrs"
                ],
                strLen: 72,
                "strFix": true
              }
            },
            "dop": {
              synonym: "Допреквизиты и параметры",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "json"
                ]
              }
            }
          }
        },
        "params": {
          name: "Параметры",
          "virtual": true,
          synonym: "Параметры",
          tooltip: "Параметры изделий и фурнитуры",
          fields: {
            "cnstr": {
              synonym: "Конструкция",
              multiline: false,
              tooltip: "Фильтр для дополнительных вставок",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "region": {
              synonym: "Ряд",
              multiline: false,
              tooltip: "Фильтр для дополнительных вставок\n0 - не ряд\n1 - ряд внутри элемента\n>1 - за элементом\n<0 - перед элементом",
              type: {
                types: [
                  "number"
                ],
                "digits": 2,
                "fraction": 0
              }
            },
            "inset": {
              synonym: "Вставка",
              multiline: false,
              tooltip: "Фильтр для дополнительных вставок",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.inserts"
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
                  "cat.nom",
                  "cch.properties"
                ]
              }
            },
            "value": {
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
                    "params",
                    "param"
                  ]
                }
              ],
              choiceGrp: "elm",
              "choiceType": {
                path: [
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
            }
          }
        },
        "cnn_elmnts": {
          name: "СоединяемыеЭлементы",
          synonym: "Соединяемые элементы",
          tooltip: "Соединения элементов",
          fields: {
            "elm1": {
              synonym: "Элем 1",
              multiline: false,
              tooltip: "Номер первого элемента",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "node1": {
              synonym: "Узел 1",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 1
              }
            },
            "elm2": {
              synonym: "Элем 2",
              multiline: false,
              tooltip: "Номер второго элемента",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "node2": {
              synonym: "Узел 2",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 1
              }
            },
            "cnn": {
              synonym: "Соединение",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.cnns"
                ]
              }
            },
            "aperture_len": {
              synonym: "Длина шва/проема",
              multiline: false,
              tooltip: "Для соединений с заполнениями: длина светового проема примыкающего элемента",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "dop": {
              synonym: "Допреквизиты и параметры",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "json"
                ]
              }
            }
          }
        },
        "glass_specification": {
          name: "СпецификацияЗаполнений",
          synonym: "Спецификация заполнений",
          tooltip: "",
          fields: {
            "elm": {
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
            "inset": {
              synonym: "Вставка",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "insert_type",
                  path: [
                    "Заполнение"
                  ]
                },
                {
                  name: "insert_glass_type",
                  path: [
                    "Заполнение",
                    "Рамка",
                    "Газ",
                    "Пленка",
                    "СтеклоСПодогревом",
                    "СтеклоЗакаленное",
                    "СтеклоЦветное",
                    "Триплекс"
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
            "clr": {
              synonym: "Цвет",
              multiline: false,
              tooltip: "",
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
            "dop": {
              synonym: "Допреквизиты и параметры",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "json"
                ]
              }
            }
          }
        },
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "",
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
        "glasses": {
          name: "Заполнения",
          synonym: "Заполнения",
          tooltip: "Стеклопакеты и сэндвичи - вычисляемая табличная часть (кеш) для упрощения отчетов",
          fields: {
            "elm": {
              synonym: "Элемент",
              multiline: false,
              tooltip: "№ элемента",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            nom: {
              synonym: "Номенклатура",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "string",
                  "cat.nom"
                ],
                strLen: 50
              }
            },
            "formula": {
              synonym: "Формула",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.characteristics",
                  "string"
                ],
                strLen: 50
              }
            },
            "width": {
              synonym: "Ширина, мм",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 14,
                "fraction": 3
              }
            },
            "height": {
              synonym: "Высота, мм",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 14,
                "fraction": 3
              }
            },
            "s": {
              synonym: "Площадь, м ²",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 10,
                "fraction": 3
              }
            },
            "is_rectangular": {
              synonym: "Прямоуг.",
              multiline: false,
              tooltip: "Прямоугольное заполнение",
              type: {
                types: [
                  "boolean"
                ]
              }
            },
            "is_sandwich": {
              synonym: "Листовые",
              multiline: false,
              tooltip: "Непрозрачное заполнение - сэндвич",
              type: {
                types: [
                  "boolean"
                ]
              }
            },
            "thickness": {
              synonym: "Толщина",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 2,
                "fraction": 0
              }
            },
            "coffer": {
              synonym: "Камеры",
              multiline: false,
              tooltip: "",
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
        "specification": {
          name: "Спецификация",
          "compress": true,
          synonym: "Спецификация",
          tooltip: "",
          fields: {
            "elm": {
              synonym: "Элемент",
              multiline: false,
              tooltip: "Номер элемента, если значение > 0, либо номер конструкции, если значение < 0",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
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
            "clr": {
              synonym: "Цвет",
              multiline: false,
              tooltip: "",
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
            "characteristic": {
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
            "qty": {
              synonym: "Количество (шт)",
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
            "len": {
              synonym: "Длина/высота, м",
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
            "width": {
              synonym: "Ширина, м",
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
            "s": {
              synonym: "Площадь, м²",
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
            "alp1": {
              synonym: "Угол 1, °",
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
            "alp2": {
              synonym: "Угол 2, °",
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
            "totqty": {
              synonym: "Количество",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 14,
                "fraction": 4
              }
            },
            "totqty1": {
              synonym: "Количество (+%)",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 14,
                "fraction": 4
              }
            },
            "price": {
              synonym: "Себест.план",
              multiline: false,
              tooltip: "Цена плановой себестоимости строки спецификации",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 4
              }
            },
            "amount": {
              synonym: "Сумма себест.",
              multiline: false,
              tooltip: "Сумма плановой себестоимости строки спецификации",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 4
              }
            },
            "amount_marged": {
              synonym: "Сумма с наценкой",
              multiline: false,
              tooltip: "Вклад строки спецификации в стоимость изделия для сценария КМАРЖ_В_СПЕЦИФИКАЦИИ",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 4
              }
            },
            "stage": {
              synonym: "Этап",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.work_center_kinds"
                ]
              }
            },
            "origin": {
              synonym: "Происхождение",
              multiline: false,
              tooltip: "Ссылка на настройки построителя, из которых возникла строка спецификации",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.inserts",
                  "string",
                  "number",
                  "cat.cnns",
                  "cat.furns"
                ],
                strLen: 1024,
                "digits": 6,
                "fraction": 0
              }
            },
            "specify": {
              synonym: "Уточнение происхождения",
              multiline: false,
              tooltip: "Ссылка на настройки построителя, из которых возникла строка спецификации",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.inserts",
                  "cat.characteristics",
                  "string",
                  "number",
                  "cat.nom",
                  "cat.cnns",
                  "cat.furns"
                ],
                strLen: 255,
                "digits": 2,
                "fraction": 0
              }
            },
            "changed": {
              synonym: "Запись изменена",
              multiline: false,
              tooltip: "Запись изменена оператором (1) или добавлена корректировкой спецификации (-1)",
              type: {
                types: [
                  "number"
                ],
                "digits": 1,
                "fraction": 0
              }
            },
            "dop": {
              synonym: "Это акс. или визуализ.",
              multiline: false,
              tooltip: "+1 - аксессуары\n-1 - визуализация\n-2 - техоперации\n-3 - обрезь",
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
        "dop": {
          name: "Доп",
          synonym: "Дополнение спецификации",
          tooltip: "",
          fields: {
            "elm": {
              synonym: "Элемент",
              multiline: false,
              tooltip: "Номер элемента, если значение > 0, либо номер конструкции, если значение < 0",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
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
            "coordinate": {
              synonym: "Координата",
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
            "origin": {
              synonym: "Происхождение",
              multiline: false,
              tooltip: "Ссылка на настройки построителя, из которых возникла строка спецификации",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.inserts",
                  "number",
                  "cat.cnns",
                  "cat.furns"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "dop": {
              synonym: "Это акс. или визуализ.",
              multiline: false,
              tooltip: "Содержит (1) для строк аксессуаров и (-1) для строк с визуализацией",
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
        "demand": {
          name: "Потребность",
          synonym: "Потребность",
          tooltip: "",
          fields: {
            "kind": {
              synonym: "Вид РЦ",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.work_center_kinds"
                ]
              }
            },
            "days_from_execution": {
              synonym: "Дней от готовности",
              multiline: false,
              tooltip: "Обратный отсчет. Когда надо запустить в работу в цехе. Должно иметь значение <= ДнейДоГотовности",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "days_to_execution": {
              synonym: "Дней до готовности",
              multiline: false,
              tooltip: "Если номенклатура есть в спецификации, плановая готовность отодвигается на N дней",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            }
          }
        }
      },
      "hashable": true,
      cachable: "doc"
    },
    "price_groups": {
      name: "ЦеновыеГруппы",
      synonym: "Ценовые группы",
      illustration: "",
      objPresentation: "Ценовая группа",
      listPresentation: "Ценовые группы",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "pg",
      fields: {
        "definition": {
          synonym: "Описание",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 1024
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
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "project_categories": {
      name: "КатегорииПроектов",
      synonym: "Категории проектов",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "prk",
      fields: {
        note: {
          synonym: "Комментарий",
          multiline: false,
          tooltip: "Описание назначения использования группы шаблонов для сайта",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        }
      },
      tabulars: {
        "stages": {
          name: "Этапы",
          synonym: "Этапы",
          tooltip: "",
          fields: {
            "stage": {
              synonym: "Этап",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "grouping",
                  path: false
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.project_stages"
                ]
              }
            },
            "grouping": {
              synonym: "Группа",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "grouping",
                  path: true
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.project_stages"
                ]
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "charges_discounts": {
      name: "СкидкиНаценки",
      synonym: "Скидки (наценки)",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "dm",
      fields: {
        "price_type": {
          synonym: "Тип цен",
          multiline: false,
          tooltip: "Если указано, скидка действует только при совпадении с типом цены в строке заказа",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.nom_prices_types"
            ]
          }
        },
        "sorting_field": {
          synonym: "Порядок применения",
          multiline: false,
          tooltip: "Для скидок (наценок), входящих в группу \"Умножение\" определяет последовательность применения. Для скидок, входящих в группу \"Вытеснение\" определяет приоритеты скидок в пределах группы.",
          type: {
            types: [
              "number"
            ],
            "digits": 5,
            "fraction": 0
          }
        },
        "application_joint": {
          synonym: "Вариант совместного применения",
          multiline: false,
          tooltip: "Определяет вариант, в соответствии с которым рассчитываются скидки ( наценки) данной группы при совместном применении.",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.application_mode_kinds"
            ]
          }
        },
        "application_mode": {
          synonym: "Способ предоставления",
          multiline: false,
          tooltip: "Определяет способ, в соответствии с которым предоставляется скидка  (наценка).",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.formulas",
              "enm.application_joint_kinds"
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
        },
        parent: {
          synonym: "Группа",
          multiline: false,
          tooltip: "Группа скидок (наценок)",
          type: {
            types: [
              "cat.charges_discounts"
            ]
          }
        }
      },
      tabulars: {
        "periods": {
          name: "Периоды",
          synonym: "Периоды",
          tooltip: "",
          fields: {
            "start_date": {
              synonym: "Дата начала",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "date"
                ],
                "datePart": "date_time"
              }
            },
            "expiration_date": {
              synonym: "Дата окончания",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "date"
                ],
                "datePart": "date_time"
              }
            }
          }
        },
        "keys": {
          name: "Ключи",
          synonym: "Условия предоставления",
          tooltip: "",
          fields: {
            "condition": {
              synonym: "Условие",
              multiline: false,
              tooltip: "Условие при выполнении которого будет предоставлена скидка (наценка).",
              choiceParams: [
                {
                  name: "applying",
                  path: "Ценообразование"
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.parameters_keys",
                  "cat.branches"
                ]
              }
            }
          }
        },
        "price_groups": {
          name: "ЦеновыеГруппы",
          synonym: "Ценовые группы",
          tooltip: "",
          fields: {
            "price_group": {
              synonym: "Ценовая группа",
              multiline: false,
              tooltip: "Ценовая группа, на номенклатурные позиции которой предоставляется указанное значение скидки (наценки). ",
              type: {
                types: [
                  "cat.nom_groups",
                  "cat.price_groups",
                  "cat.nom_kinds",
                  "cat.nom"
                ]
              }
            },
            "value": {
              synonym: "Значение скидки (наценки)",
              multiline: false,
              tooltip: "Значение скидки (наценки), тип которого зависит от способа предоставления.",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "nom_groups": {
      name: "ГруппыФинансовогоУчетаНоменклатуры",
      synonym: "Группы фин. учета номенклатуры",
      illustration: "Перечень номенклатурных групп для учета затрат и укрупненного планирования продаж, закупок и производства",
      objPresentation: "Номенклатурная группа",
      listPresentation: "Номенклатурные группы",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "ng",
      fields: {
        "vat_rate": {
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
        parent: {
          synonym: "Раздел",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.nom_groups"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "servers": {
      name: "ИнтеграцияСерверы",
      synonym: "Серверы CouchDB",
      illustration: "",
      objPresentation: "Сервер",
      listPresentation: "Серверы CouchDB",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "srv",
      fields: {
        "http": {
          synonym: "HTTP",
          multiline: false,
          tooltip: "Адрес сервиса интеграции metadata.js или сервера авторизации oAuth",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 255
          }
        },
        "http_local": {
          synonym: "HTTP local",
          multiline: false,
          tooltip: "Адрес в локальной сети для репликатора (если не указан, используется основной HTTP)",
          type: {
            types: [
              "string"
            ],
            strLen: 255
          }
        },
        "username": {
          synonym: "Login (consumerKey)",
          multiline: false,
          tooltip: "Login администратора CouchDB или consumerKey сервера oAuth",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 100
          }
        },
        "password": {
          synonym: "Password (consumerSecret)",
          multiline: false,
          tooltip: "Пароль администратора CouchDB или consumerSecret сервера oAuth",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 100
          }
        },
        "callbackurl": {
          synonym: "Обратный url oAuth",
          multiline: false,
          tooltip: "oAuth callback URL",
          type: {
            types: [
              "string"
            ],
            strLen: 255
          }
        },
        "hv": {
          synonym: "Гипервизор",
          multiline: false,
          tooltip: "Гипервизор, на котором расположен сервер, используется при формировании очереди заданий",
          type: {
            types: [
              "string"
            ],
            strLen: 20
          }
        }
      },
      tabulars: {},
      cachable: "meta"
    },
    "abonents": {
      name: "ИнтеграцияАбоненты",
      synonym: "Абоненты",
      illustration: "",
      objPresentation: "Абонент",
      listPresentation: "Абоненты",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 6,
      id: "abn",
      fields: {
        "server": {
          synonym: "Сервер",
          multiline: false,
          tooltip: "Основной сервер абонента (отделы абонента могут использовать другие серверы)",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.servers"
            ]
          }
        },
        "area": {
          synonym: "Это фильтр технологии",
          multiline: false,
          tooltip: "Если \"Истина\", абонент используется не как владелец репликаций, а как фильтр технологических справочников",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "no_mdm": {
          synonym: "NoMDM",
          multiline: false,
          tooltip: "Отключить MDM для данного абонента (напрмиер, если это dev-база)",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "lang": {
          synonym: "Язык",
          multiline: false,
          tooltip: "Язык интерфейса пользователя",
          type: {
            types: [
              "string"
            ],
            strLen: 2,
            "strFix": true
          }
        }
      },
      tabulars: {
        "acl_objs": {
          name: "ОбъектыДоступа",
          synonym: "Базовые объекты",
          tooltip: "Базовые объекты к регистрации: системы профилей, фурнитуры, организации, контрагенты",
          fields: {
            "obj": {
              synonym: "Объект доступа",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "doc.work_centers_performance",
                  "cat.nom_groups",
                  "cat.http_apis",
                  "cat.production_params",
                  "cat.inserts",
                  "cat.templates",
                  "cat.price_groups",
                  "doc.credit_card_order",
                  "cat.leads",
                  "cat.nom_units",
                  "doc.planning_event",
                  "cch.predefined_elmnts",
                  "cat.currencies",
                  "doc.nom_prices_setup",
                  "cat.choice_params",
                  "cat.characteristics",
                  "cat.projects",
                  "cat.individuals",
                  "cat.users",
                  "cat.insert_bind",
                  "cat.values_options",
                  "cat.partner_bank_accounts",
                  "cat.delivery_areas",
                  "cat.color_price_groups",
                  "cat.elm_visualization",
                  "doc.debit_bank_order",
                  "doc.registers_correction",
                  "cat.property_values_hierarchy",
                  "cat.formulas",
                  "cat.project_categories",
                  "cat.delivery_directions",
                  "cat.production_kinds",
                  "doc.inventory_goods",
                  "cat.charges_discounts",
                  "cat.property_values",
                  "doc.purchase_order",
                  "cat.banks_qualifier",
                  "doc.credit_cash_order",
                  "doc.selling",
                  "cat.nom_prices_types",
                  "cat.divisions",
                  "cch.mdm_groups",
                  "cat.destinations",
                  "cat.parameters_keys",
                  "doc.purchase",
                  "cat.contact_information_kinds",
                  "cat.params_links",
                  "cat.partners",
                  "doc.debit_cash_order",
                  "cat.lead_src",
                  "cat.nom_kinds",
                  "cat.organizations",
                  "cat.countries",
                  "cat.units",
                  "doc.inventory_cuts",
                  "doc.work_centers_task",
                  "cat.abonents",
                  "cat.work_shifts",
                  "cat.work_center_kinds",
                  "cat.servers",
                  "doc.calc_order",
                  "cat.branches",
                  "doc.credit_bank_order",
                  "cat.cashboxes",
                  "cat.nom",
                  "cat.cnns",
                  "cat.furns",
                  "cat.cash_flow_articles",
                  "cat.work_centers",
                  "cat.meta_ids",
                  "cat.contracts",
                  "cat.project_stages",
                  "cat.stores",
                  "cch.properties",
                  "cat.clrs"
                ]
              }
            },
            type: {
              synonym: "Тип",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 255
              }
            }
          }
        },
        "ex_bases": {
          name: "ДополнительныеБазы",
          synonym: "Дополнительные базы",
          tooltip: "Шаблоны, логгер и т.д. - копируем в _security пользователей из ram",
          fields: {
            name: {
              synonym: "Наименование",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "string"
                ],
                strLen: 25
              }
            },
            "server": {
              synonym: "Сервер",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.servers"
                ]
              }
            }
          }
        },
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "Дополнительные реквизиты объекта",
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
        "http_apis": {
          name: "ПоставщикиСВнешнимAPI",
          synonym: "Поставщики с внешним API",
          tooltip: "",
          fields: {
            "is_supplier": {
              synonym: "Поставщик",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.http_apis"
                ]
              }
            },
            "partner": {
              synonym: "Контрагент",
              multiline: false,
              tooltip: "Этот контрагент будет указан в Заказах поставщику",
              mandatory: true,
              type: {
                types: [
                  "cat.partners"
                ]
              }
            },
            "server": {
              synonym: "Сервер",
              multiline: false,
              tooltip: "Сервер для доступа к API поставщика",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.servers"
                ]
              }
            }
          }
        },
        "servers": {
          name: "ИнтеграцияСерверы",
          synonym: "Серверы",
          tooltip: "",
          fields: {
            "key": {
              synonym: "Год",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "number"
                ],
                "digits": 4,
                "fraction": 0
              }
            },
            name: {
              synonym: "Имя базы",
              multiline: false,
              tooltip: "Указывается, если имя архивной базы отличается от типового",
              type: {
                types: [
                  "string"
                ],
                strLen: 255
              }
            },
            "proxy": {
              synonym: "url auth-proxy",
              multiline: false,
              tooltip: "Для редиректа из основного маршрута",
              type: {
                types: [
                  "string"
                ],
                strLen: 255
              }
            }
          }
        }
      },
      cachable: "meta"
    },
    "insert_bind": {
      name: "ПривязкиВставок",
      synonym: "Привязки вставок",
      illustration: "Замена регистра \"Корректировка спецификации\"",
      objPresentation: "Привязка вставки",
      listPresentation: "Привязки вставок",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "isl",
      fields: {
        "key": {
          synonym: "Ключ",
          multiline: false,
          tooltip: "Если указано, привязка распространяется только на продукцию, параметры окружения которой, совпадают с параметрами ключа параметров",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.parameters_keys"
            ]
          }
        },
        "calc_order": {
          synonym: "На документ",
          multiline: false,
          tooltip: "Привязка к заказу в целом.\nВ контексте вставок, в этом режиме, доступны суммарные площади, массы, и прочие агрегаты по всем продукциям, после отбора по ключу и номенклатуре",
          type: {
            types: [
              "boolean"
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
        }
      },
      tabulars: {
        "production": {
          name: "Продукция",
          synonym: "Продукция",
          tooltip: "",
          fields: {
            nom: {
              synonym: "Номенклатура",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "cat.production_params",
                  "cat.nom"
                ]
              }
            }
          }
        },
        "inserts": {
          name: "Вставки",
          synonym: "Вставки",
          tooltip: "Дополнительные вставки в изделие и контуры",
          fields: {
            "inset": {
              synonym: "Вставка",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "insert_type",
                  path: [
                    "МоскитнаяСетка",
                    "Контур",
                    "Изделие",
                    "Водоотлив",
                    "Откос",
                    "Подоконник",
                    "Элемент"
                  ]
                }
              ],
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.inserts"
                ]
              }
            },
            "elm_type": {
              synonym: "Источник",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "ref",
                  path: [
                    "Рама",
                    "Створка",
                    "Продукция",
                    "Заполнение",
                    "Стекло"
                  ]
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.elm_types"
                ]
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "templates": {
      name: "Шаблоны",
      synonym: "Группы шаблонов",
      illustration: "Для \"быстрых окон\"",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "tm",
      fields: {
        note: {
          synonym: "Комментарий",
          multiline: true,
          tooltip: "Описание назначения использования группы шаблонов для сайта (markdown)",
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
        }
      },
      tabulars: {
        "templates": {
          name: "Шаблоны",
          synonym: "Шаблоны",
          tooltip: "",
          fields: {
            "template": {
              synonym: "Шаблон",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.characteristics"
                ]
              }
            },
            "xmin": {
              synonym: "Ширина min",
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
            "xmax": {
              synonym: "Ширина max",
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
            "ymin": {
              synonym: "Высота min",
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
            "ymax": {
              synonym: "Высота max",
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
            "sys": {
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
            "furn": {
              synonym: "Фурнитура",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "is_set",
                  path: false
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.furns"
                ]
              }
            },
            "filling": {
              synonym: "Заполнение",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "insert_type",
                  path: "Заполнение"
                },
                {
                  name: "insert_glass_type",
                  path: ""
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.inserts"
                ]
              }
            },
            note: {
              synonym: "Комментарий",
              multiline: false,
              tooltip: "Общее описание шаблона",
              type: {
                types: [
                  "string"
                ],
                strLen: 0
              }
            },
            "props": {
              synonym: "Props",
              multiline: false,
              tooltip: "Свойства слоёв изделия",
              type: {
                types: [
                  "string"
                ],
                strLen: 0
              }
            },
            "grouping": {
              synonym: "Группа",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "delivery_directions": {
      name: "НаправленияДоставки",
      synonym: "Направления доставки",
      illustration: "Объединяет районы, территории или подразделения продаж",
      objPresentation: "Направление доставки",
      listPresentation: "Направления доставки",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "dd",
      fields: {},
      tabulars: {
        "composition": {
          name: "Состав",
          synonym: "Состав",
          tooltip: "",
          fields: {
            "elm": {
              synonym: "Элемент",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.delivery_areas",
                  "cat.divisions"
                ]
              }
            }
          }
        },
        coordinates: {
          name: "Координаты",
          synonym: "Координаты",
          tooltip: "Периметр района",
          fields: {
            "latitude": {
              synonym: "Гео. коорд. Широта",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 12
              }
            },
            "longitude": {
              synonym: "Гео. коорд. Долгота",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 12
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "http_apis": {
      name: "ПоставщикиСВнешнимAPI",
      synonym: "Поставщики с внешним API",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "pa",
      fields: {},
      tabulars: {
        nom: {
          name: "Номенклатура",
          synonym: "Номенклатура",
          tooltip: "Позиции с параметрами, которые можно заказать у данного поставщика. В заказе будет номенклатура с уникальной характеристикой",
          fields: {
            "identifier": {
              synonym: "Идентификатор",
              multiline: false,
              tooltip: "Ид. вставки поставщика",
              type: {
                types: [
                  "string"
                ],
                strLen: 36
              }
            },
            name: {
              synonym: "Наименование",
              multiline: false,
              tooltip: "Наименование у поставщика",
              type: {
                types: [
                  "string"
                ],
                strLen: 50
              }
            },
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
            nom_characteristic: {
              synonym: "Характеристика",
              multiline: false,
              tooltip: "Характеристика номенклатуры",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "owner"
                  ],
                  path: [
                    "nom",
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
            "params": {
              synonym: "Параметры",
              multiline: true,
              tooltip: "Необходимые данной позиции параметры и диапазоны значений",
              type: {
                types: [
                  "string"
                ],
                strLen: 0
              }
            }
          }
        },
        "params": {
          name: "Параметры",
          synonym: "Параметры",
          tooltip: "Все, используемые данным поставщиком параметры",
          fields: {
            "identifier": {
              synonym: "Идентификатор",
              multiline: false,
              tooltip: "Ид. параметра поставщика",
              type: {
                types: [
                  "string"
                ],
                strLen: 36
              }
            },
            name: {
              synonym: "Наименование",
              multiline: false,
              tooltip: "Наименование у поставщика",
              type: {
                types: [
                  "string"
                ],
                strLen: 50
              }
            },
            type: {
              synonym: "Тип",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 25
              }
            },
            "values": {
              synonym: "Значения",
              multiline: true,
              tooltip: "json-сериализация возможных значений параметра, если параметр предполагает дискретный ряд или enum",
              type: {
                types: [
                  "string"
                ],
                strLen: 0
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "production_kinds": {
      name: "ВидыПроизводства",
      synonym: "Виды производства",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "pk",
      fields: {
        note: {
          synonym: "Комментарий",
          multiline: true,
          tooltip: "Произвольный комментарий к документу",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        }
      },
      tabulars: {
        "stages": {
          name: "Этапы",
          synonym: "Этапы",
          tooltip: "",
          fields: {
            parent: {
              synonym: "Предыдущие",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 25
              }
            },
            "stage": {
              synonym: "Этап",
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
      cachable: "ram"
    },
    "values_options": {
      name: "ВариантыЗначенийПараметров",
      synonym: "Варианты значений параметров",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: true,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "pvv",
      fields: {
        "owner": {
          synonym: "",
          multiline: false,
          tooltip: "",
          mandatory: true,
          type: {
            types: [
              "cch.properties"
            ]
          }
        }
      },
      tabulars: {
        "values": {
          name: "Значения",
          synonym: "Значения",
          tooltip: "Значения по ключу",
          fields: {
            "key": {
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
            "value": {
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
                    "owner"
                  ]
                }
              ],
              choiceGrp: "elm",
              "choiceType": {
                path: [
                  "owner"
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
        }
      },
      cachable: "ram"
    },
    "lead_src": {
      name: "ИсточникиЛидов",
      synonym: "Источники лидов",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "ls",
      fields: {
        type: {
          synonym: "Тип",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.lead_types"
            ]
          }
        },
        "server": {
          synonym: "Сервер",
          multiline: false,
          tooltip: "Сервер источника. Например, bitrix24.\nУ сервера есть строка подключения и реквизиты авторизации",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.servers"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "leads": {
      name: "Лиды",
      synonym: "Лиды",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 11,
      id: "ld",
      fields: {
        "create_date": {
          synonym: "Дата создания",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "date"
            ],
            "datePart": "date_time"
          }
        },
        "origin": {
          synonym: "Источник",
          multiline: false,
          tooltip: "Телефон, сайт, визит и т.д.",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.lead_src"
            ]
          }
        },
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "Автор",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.users"
            ]
          }
        },
        "department": {
          synonym: "Подразделение",
          multiline: false,
          tooltip: "Место, где родился лид",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.divisions"
            ]
          }
        },
        "dop": {
          synonym: "Допреквизиты и параметры",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "json"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "doc"
    },
    "accounts": {
      name: "ИнтеграцияПользователи",
      synonym: "Пользователи сервиса",
      illustration: "",
      objPresentation: "Пользователь сервиса",
      listPresentation: "",
      inputBy: [],
      hierarchical: false,
      hasOwners: true,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      fields: {
        "prefix": {
          synonym: "Префикс нумерации",
          multiline: false,
          tooltip: "Префикс номеров документов текущего пользователя",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 2
          }
        },
        "push_only": {
          synonym: "Только push",
          multiline: false,
          tooltip: "Для пользователя установлен режим push-only (изменения мигрируют в одну сторону - от пользователя на сервер)",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "ips": {
          synonym: "IP-адреса входа",
          multiline: false,
          tooltip: "Список ip-адресов с маской через запятую, с которых разрешена авторизация\n192.168.9.0/24, 192.168.21.*",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "owner": {
          synonym: "Пользователь 1С",
          multiline: false,
          tooltip: "Ссылка на стандартного пользователя",
          type: {
            types: [
              "cat.users"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    },
    "work_centers": {
      name: "РабочиеЦентры",
      synonym: "Рабочие центры (Ресурсы)",
      illustration: "Ресурсы предприятия, загрузку которых необходимо планировать",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name",
        "id"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 9,
      id: "wpl",
      fields: {
        "department": {
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
        "plan_multiplicity": {
          synonym: "Кратность планирования",
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
        "work_center_kinds": {
          name: "ВидыРабочихЦентров",
          synonym: "Виды рабочих центров",
          tooltip: "",
          fields: {
            "kind": {
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
      "common": true
    },
    "project_stages": {
      name: "ЭтапыПроектов",
      synonym: "Этапы проектов",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "psg",
      fields: {
        note: {
          synonym: "Комментарий",
          multiline: false,
          tooltip: "Описание назначения использования группы шаблонов для сайта",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "grouping": {
          synonym: "Это группа",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        }
      },
      tabulars: {},
      cachable: "ram"
    }
  },
  "doc": {
    "registers_correction": {
      name: "КорректировкаРегистров",
      synonym: "Корректировка регистров",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "rc",
      fields: {
        "original_doc_type": {
          synonym: "Тип исходного документа",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 255
          }
        },
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "Пользователь, ответственный за  документ",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.users"
            ]
          }
        },
        note: {
          synonym: "Комментарий",
          multiline: false,
          tooltip: "Произвольный комментарий. ",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "partner": {
          synonym: "Контрагент",
          multiline: false,
          tooltip: "Для целей RLS",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.partners"
            ]
          }
        }
      },
      tabulars: {
        "registers_table": {
          name: "ТаблицаРегистров",
          synonym: "Таблица регистров",
          tooltip: "",
          fields: {
            "Имя": {
              synonym: "Имя",
              multiline: false,
              tooltip: "Имя регистра, которому скорректированы записи.",
              mandatory: true,
              type: {
                types: [
                  "string"
                ],
                strLen: 255
              }
            }
          }
        }
      },
      cachable: "doc"
    },
    "purchase": {
      name: "ПоступлениеТоваровУслуг",
      synonym: "Поступление товаров и услуг",
      illustration: "Документы отражают поступление товаров и услуг",
      objPresentation: "Поступление товаров и услуг",
      listPresentation: "Поступление товаров и услуг",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "",
      fields: {
        "organization": {
          synonym: "Организация",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.organizations"
            ]
          }
        },
        "partner": {
          synonym: "Контрагент",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "is_supplier",
              path: true
            }
          ],
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.partners"
            ]
          }
        },
        "department": {
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
        warehouse: {
          synonym: "Склад",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.stores"
            ]
          }
        },
        "doc_amount": {
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
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.users"
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
            strLen: 0
          }
        }
      },
      tabulars: {
        goods: {
          name: "Товары",
          synonym: "Товары",
          tooltip: "",
          fields: {
            nom: {
              synonym: "Номенклатура",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "Услуга",
                  path: false
                },
                {
                  name: "set",
                  path: false
                }
              ],
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.nom"
                ]
              }
            },
            nom_characteristic: {
              synonym: "Характеристика",
              multiline: false,
              tooltip: "Характеристика номенклатуры",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "owner"
                  ],
                  path: [
                    "goods",
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
            quantity: {
              synonym: "Количество",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
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
                    "goods",
                    "nom"
                  ]
                }
              ],
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.nom_units"
                ]
              }
            },
            "price": {
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
            "amount": {
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
            "vat_rate": {
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
            "vat_amount": {
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
            "trans": {
              synonym: "Заказ резерв",
              multiline: false,
              tooltip: "",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "partner"
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
                  "doc.calc_order"
                ]
              }
            }
          }
        },
        "services": {
          name: "Услуги",
          synonym: "Услуги",
          tooltip: "",
          fields: {
            nom: {
              synonym: "Номенклатура",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "Услуга",
                  path: true
                },
                {
                  name: "set",
                  path: false
                }
              ],
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.nom"
                ]
              }
            },
            "content": {
              synonym: "Содержание услуги, доп. сведения",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "string"
                ],
                strLen: 0
              }
            },
            quantity: {
              synonym: "Количество",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            },
            "price": {
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
            "amount": {
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
            "vat_rate": {
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
            "vat_amount": {
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
            "nom_group": {
              synonym: "Номенклатурная группа",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.nom_groups"
                ]
              }
            },
            "department": {
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
            "cost_item": {
              synonym: "Статья затрат",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 10
              }
            },
            "project": {
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
            "buyers_order": {
              synonym: "Заказ затрат",
              multiline: false,
              tooltip: "",
              choiceLinks: [
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
                  "doc.calc_order"
                ]
              }
            }
          }
        },
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "",
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
        }
      },
      cachable: "doc"
    },
    "inventory_cuts": {
      name: "ИнвентаризацияДеловойОбрези",
      synonym: "Инвентаризация деловой обрези",
      illustration: "",
      objPresentation: "Инвентаризация НЗП",
      listPresentation: "Инвентаризации НЗП",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "",
      fields: {
        "transactions_kind": {
          synonym: "Вид операции",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.inventory_kinds"
            ]
          }
        },
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.users"
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
            strLen: 0
          }
        },
        "work_center": {
          synonym: "Подразделение",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.divisions",
              "cat.work_centers"
            ]
          }
        }
      },
      tabulars: {
        "materials": {
          name: "Материалы",
          synonym: "Материалы",
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
            "characteristic": {
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
                    "materials",
                    "nom"
                  ]
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.characteristics"
                ]
              },
              "force_ram": true
            },
            "len": {
              synonym: "Длина",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            },
            "width": {
              synonym: "Ширина",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            },
            "qty": {
              synonym: "Количество, шт",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            },
            "cell": {
              synonym: "Ячейка",
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
            recorded_quantity: {
              synonym: "Количество по данным учета",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            }
          }
        }
      },
      cachable: "doc"
    },
    inventory_goods: {
      name: "ИнвентаризацияТоваровНаСкладе",
      synonym: "Инвентаризация товаров на складе",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "",
      fields: {
        "organization": {
          synonym: "Организация",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.organizations"
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
            strLen: 0
          }
        },
        warehouse: {
          synonym: "Склад",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.stores"
            ]
          }
        },
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.users"
            ]
          }
        },
        "origin": {
          synonym: "Происхождение",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "doc.inventory_goods"
            ]
          }
        }
      },
      tabulars: {
        goods: {
          name: "Товары",
          synonym: "Товары",
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
            nom_characteristic: {
              synonym: "Характеристика номенклатуры",
              multiline: false,
              tooltip: "",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "owner"
                  ],
                  path: [
                    "goods",
                    "nom"
                  ]
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.characteristics"
                ]
              },
              "force_ram": true
            },
            quantity: {
              synonym: "Количество",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            },
            recorded_quantity: {
              synonym: "Количество по данным учета",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            },
            unit: {
              synonym: "Единица измерения",
              multiline: false,
              tooltip: "",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "owner"
                  ],
                  path: [
                    "goods",
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
            "coefficient": {
              synonym: "Коэффициент",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 10,
                "fraction": 3
              }
            },
            "price": {
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
            "amount": {
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
            "len": {
              synonym: "Длина",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            },
            "width": {
              synonym: "Ширина",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            },
            "qty": {
              synonym: "Штук",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            }
          }
        }
      },
      cachable: "doc"
    },
    "work_centers_task": {
      name: "НарядРЦ",
      synonym: "Задание рабочему центру",
      illustration: "",
      objPresentation: "Наряд",
      listPresentation: "Задания рабочим центрам",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "wt",
      fields: {
        "key": {
          synonym: "Ключ",
          multiline: false,
          tooltip: "Участок производства",
          choiceParams: [
            {
              name: "applying",
              path: "РабочийЦентр"
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.work_centers"
            ]
          }
        },
        "recipient": {
          synonym: "Получатель",
          multiline: false,
          tooltip: "СГП или след. передел",
          choiceParams: [
            {
              name: "applying",
              path: "РабочийЦентр"
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.work_centers"
            ]
          }
        },
        "biz_cuts": {
          synonym: "Деловая обрезь",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.use_cut"
            ]
          }
        },
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.users"
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
            strLen: 0
          }
        }
      },
      tabulars: {
        "planning": {
          name: "Планирование",
          synonym: "Планирование",
          tooltip: "",
          fields: {
            "obj": {
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
            "specimen": {
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
            "elm": {
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
            "power": {
              synonym: "Мощность",
              multiline: false,
              tooltip: "",
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
        "demand": {
          name: "Потребность",
          synonym: "Материалы",
          tooltip: "Потребность в материалах",
          fields: {
            "production": {
              synonym: "Продукция",
              multiline: false,
              tooltip: "Ссылка на характеристику продукции или объект планирования. Указывает, к чему относится материал текущей строки",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.characteristics"
                ]
              }
            },
            "specimen": {
              synonym: "Экземпляр",
              multiline: false,
              tooltip: "Номер экземпляра",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "elm": {
              synonym: "Элемент",
              multiline: false,
              tooltip: "Номер элемента",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            nom: {
              synonym: "Номенклатура",
              multiline: false,
              tooltip: "Номенклатура потребности. По умолчанию, совпадает с номенклатурой спецификации, но может содержать аналог",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.nom"
                ]
              }
            },
            "characteristic": {
              synonym: "Характеристика",
              multiline: false,
              tooltip: "Характеристика потребности. По умолчанию, совпадает с характеристикой спецификации, но может содержать аналог",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "owner"
                  ],
                  path: [
                    "demand",
                    "nom"
                  ]
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.characteristics",
                  "string",
                  "cat.clrs"
                ],
                strLen: 72,
                "strFix": true,
                "default": "cat.characteristics"
              }
            },
            "final_balance": {
              synonym: "Остаток потребности",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
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
                "digits": 15,
                "fraction": 3
              }
            },
            "from_cut": {
              synonym: "Из обрези",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            },
            "close": {
              synonym: "Закрыть",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "boolean"
                ]
              }
            }
          }
        },
        "cuts": {
          name: "Обрезь",
          synonym: "Обрезь",
          tooltip: "Приход и расход деловой обрези",
          fields: {
            "record_kind": {
              synonym: "Вид движения",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "enm.debit_credit_kinds"
                ]
              }
            },
            "stick": {
              synonym: "№ хлыста",
              multiline: false,
              tooltip: "№ листа (хлыста, заготовки)",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "pair": {
              synonym: "№ пары",
              multiline: false,
              tooltip: "№ парной заготовки",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
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
            "characteristic": {
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
                    "cuts",
                    "nom"
                  ]
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.characteristics",
                  "string",
                  "cat.clrs"
                ],
                strLen: 72,
                "strFix": true,
                "default": "cat.characteristics"
              }
            },
            "len": {
              synonym: "Длина",
              multiline: false,
              tooltip: "длина в мм",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "width": {
              synonym: "Ширина",
              multiline: false,
              tooltip: "ширина в мм",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "used": {
              synonym: "Использовано",
              multiline: false,
              tooltip: "длина в мм",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "x": {
              synonym: "Координата X",
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
            "y": {
              synonym: "Координата Y",
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
            quantity: {
              synonym: "Количество",
              multiline: false,
              tooltip: "Количество в единицах хранения",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "cell": {
              synonym: "Ячейка",
              multiline: false,
              tooltip: "№ ячейки (откуда брать заготовку или куда помещать деловой обрезок)",
              type: {
                types: [
                  "string"
                ],
                strLen: 9
              }
            },
            "dop": {
              synonym: "Допреквизиты и параметры",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "json"
                ]
              }
            }
          }
        },
        "cutting": {
          name: "Раскрой",
          synonym: "Раскрой",
          tooltip: "",
          fields: {
            "production": {
              synonym: "Продукция",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.characteristics"
                ]
              }
            },
            "specimen": {
              synonym: "Экземпляр",
              multiline: false,
              tooltip: "Номер экземпляра",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "elm": {
              synonym: "Элемент",
              multiline: false,
              tooltip: "Номер элемента",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
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
            "characteristic": {
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
                    "cutting",
                    "nom"
                  ]
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.characteristics",
                  "string",
                  "cat.clrs"
                ],
                strLen: 72,
                "strFix": true,
                "default": "cat.characteristics"
              }
            },
            "len": {
              synonym: "Длина",
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
            "width": {
              synonym: "Ширина",
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
            "stick": {
              synonym: "№ хлыста",
              multiline: false,
              tooltip: "№ листа (заготовки), на котором размещать изделие",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "pair": {
              synonym: "№ пары",
              multiline: false,
              tooltip: "№ парного изделия",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "orientation": {
              synonym: "Ориентация",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.orientations"
                ]
              }
            },
            "elm_type": {
              synonym: "Тип элемента",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.elm_types"
                ]
              }
            },
            "alp1": {
              synonym: "Угол реза1",
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
            "alp2": {
              synonym: "Угол реза2",
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
            "cell": {
              synonym: "Ячейка",
              multiline: false,
              tooltip: "№ ячейки (куда помещать изделие)",
              type: {
                types: [
                  "string"
                ],
                strLen: 9
              }
            },
            "part": {
              synonym: "Партия",
              multiline: false,
              tooltip: "Партия (такт, группа раскроя)",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "x": {
              synonym: "Координата X",
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
            "y": {
              synonym: "Y",
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
            "rotated": {
              synonym: "Поворот",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "boolean"
                ]
              }
            },
            "nonstandard": {
              synonym: "Это нестандарт",
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
      cachable: "doc"
    },
    "calc_order": {
      name: "Расчет",
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
        "number_internal": {
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
        "project": {
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
        "organization": {
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
        "partner": {
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
        "client_of_dealer": {
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
        "contract": {
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
        "bank_account": {
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
        "manager": {
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
        "leading_manager": {
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
        "department": {
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
        "doc_amount": {
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
        "amount_operation": {
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
        "amount_internal": {
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
        "phone": {
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
        "delivery_area": {
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
        "shipping_address": {
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
        "address_fields": {
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
        "sys_profile": {
          synonym: "Профиль",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 255
          }
        },
        "sys_furn": {
          synonym: "Фурнитура",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 255
          }
        },
        "difficult": {
          synonym: "Сложный",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "vat_consider": {
          synonym: "Учитывать НДС",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "vat_included": {
          synonym: "Сумма включает НДС",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "settlements_course": {
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
        "settlements_multiplicity": {
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
        "extra_charge_external": {
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
        "obj_delivery_state": {
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
        "category": {
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
        "sending_stage": {
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
        "basis": {
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
        "lead": {
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
        "approval": {
          synonym: "Согласие на обработку перс. данных",
          multiline: false,
          tooltip: "Получено согласие на обработку персональных данных",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "route": {
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
        "branch": {
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
        "production": {
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
            "characteristic": {
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
            "qty": {
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
            "len": {
              synonym: "Длина/высота, мм",
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
            "width": {
              synonym: "Ширина, мм",
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
            "s": {
              synonym: "Площадь, м²",
              multiline: false,
              tooltip: "Площадь изделия",
              type: {
                types: [
                  "number"
                ],
                "digits": 10,
                "fraction": 6
              }
            },
            "first_cost": {
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
            "marginality": {
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
            "price": {
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
            "discount_percent": {
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
            "discount": {
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
            "amount": {
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
            "margin": {
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
            "discount_percent_internal": {
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
            "extra_charge_external": {
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
            "price_internal": {
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
            "amount_internal": {
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
            "vat_rate": {
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
            "vat_amount": {
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
            "ordn": {
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
            "changed": {
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
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "",
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
        "contact_information": {
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
            "kind": {
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
            "presentation": {
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
            "values_fields": {
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
            "country": {
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
            "region": {
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
            "city": {
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
            "email_address": {
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
            "phone_number": {
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
            "phone_without_codes": {
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
        "planning": {
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
            "date": {
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
            "key": {
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
            "obj": {
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
            "specimen": {
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
            "elm": {
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
            "power": {
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
        "orders": {
          name: "Заказы",
          synonym: "Заказы поставщикам",
          tooltip: "",
          fields: {
            "is_supplier": {
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
            "invoice": {
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
      "hashable": true,
      cachable: "doc"
    },
    "credit_card_order": {
      name: "ОплатаОтПокупателяПлатежнойКартой",
      synonym: "Оплата от покупателя платежной картой",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "",
      fields: {
        "organization": {
          synonym: "Организация",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.organizations"
            ]
          }
        },
        "partner": {
          synonym: "Покупатель",
          multiline: false,
          tooltip: "Контрагент, подотчетник",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.partners"
            ]
          }
        },
        "department": {
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
        "doc_amount": {
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
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "Пользователь, ответственный за  документ",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.users"
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
            strLen: 0
          }
        }
      },
      tabulars: {
        "payment_details": {
          name: "РасшифровкаПлатежа",
          synonym: "Расшифровка платежа",
          tooltip: "",
          fields: {
            "cash_flow_article": {
              synonym: "Статья движения денежных средств",
              multiline: false,
              tooltip: "Статья движения денежных средств",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.cash_flow_articles"
                ]
              }
            },
            "trans": {
              synonym: "Объект расчетов",
              multiline: false,
              tooltip: "Документ расчетов с партнером",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "partner"
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
                  "doc.calc_order",
                  "cat.contracts"
                ]
              }
            },
            "amount": {
              synonym: "Сумма",
              multiline: false,
              tooltip: "Сумма платежа",
              mandatory: true,
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            }
          }
        },
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "",
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
        }
      },
      cachable: "doc"
    },
    "work_centers_performance": {
      name: "МощностиРЦ",
      synonym: "Мощности рабочих центров",
      illustration: "",
      objPresentation: "Мощность рабочих центров",
      listPresentation: "Мощности рабочих центров",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "wp",
      fields: {
        "start_date": {
          synonym: "Дата начала",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "date"
            ],
            "datePart": "date"
          }
        },
        "expiration_date": {
          synonym: "Дата окончания",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "date"
            ],
            "datePart": "date"
          }
        },
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.users"
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
            strLen: 0
          }
        }
      },
      tabulars: {
        "planning": {
          name: "Планирование",
          synonym: "Планирование",
          tooltip: "",
          fields: {
            "date": {
              synonym: "Дата",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "date"
                ],
                "datePart": "date"
              }
            },
            "work_shift": {
              synonym: "Смена",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.work_shifts"
                ]
              }
            },
            "work_center": {
              synonym: "Рабочий центр",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.work_centers"
                ]
              }
            },
            "power": {
              synonym: "Мощность",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            }
          }
        }
      },
      cachable: "doc"
    },
    "debit_bank_order": {
      name: "ПлатежноеПоручениеВходящее",
      synonym: "Платежное поручение входящее",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "",
      fields: {
        "organization": {
          synonym: "Организация",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.organizations"
            ]
          }
        },
        "partner": {
          synonym: "Плательщик",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.partners"
            ]
          }
        },
        "department": {
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
        "bank_account": {
          synonym: "Счет организации",
          multiline: false,
          tooltip: "",
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
        "doc_amount": {
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
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "Пользователь, ответственный за  документ",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.users"
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
            strLen: 0
          }
        }
      },
      tabulars: {
        "payment_details": {
          name: "РасшифровкаПлатежа",
          synonym: "Расшифровка платежа",
          tooltip: "",
          fields: {
            "cash_flow_article": {
              synonym: "Статья движения денежных средств",
              multiline: false,
              tooltip: "Статья движения денежных средств",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.cash_flow_articles"
                ]
              }
            },
            "trans": {
              synonym: "Объект расчетов",
              multiline: false,
              tooltip: "Документ расчетов с партнером",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "partner"
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
                  "doc.calc_order",
                  "cat.contracts"
                ]
              }
            },
            "amount": {
              synonym: "Сумма",
              multiline: false,
              tooltip: "Сумма платежа",
              mandatory: true,
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            }
          }
        },
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "",
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
        }
      },
      cachable: "doc"
    },
    "credit_bank_order": {
      name: "ПлатежноеПоручениеИсходящее",
      synonym: "Платежное поручение исходящее",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "",
      fields: {
        "organization": {
          synonym: "Организация",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.organizations"
            ]
          }
        },
        "partner": {
          synonym: "Получатель",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.partners"
            ]
          }
        },
        "department": {
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
        "bank_account": {
          synonym: "Счет организации",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.partner_bank_accounts"
            ]
          }
        },
        "doc_amount": {
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
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "Пользователь, ответственный за  документ",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.users"
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
            strLen: 0
          }
        }
      },
      tabulars: {
        "payment_details": {
          name: "РасшифровкаПлатежа",
          synonym: "Расшифровка платежа",
          tooltip: "",
          fields: {
            "cash_flow_article": {
              synonym: "Статья движения денежных средств",
              multiline: false,
              tooltip: "Статья движения денежных средств",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.cash_flow_articles"
                ]
              }
            },
            "trans": {
              synonym: "Объект расчетов",
              multiline: false,
              tooltip: "Документ расчетов с партнером",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "partner"
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
                  "doc.calc_order",
                  "cat.contracts"
                ]
              }
            },
            "amount": {
              synonym: "Сумма",
              multiline: false,
              tooltip: "Сумма платежа",
              mandatory: true,
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            }
          }
        },
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "",
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
        }
      },
      cachable: "doc"
    },
    "debit_cash_order": {
      name: "ПриходныйКассовыйОрдер",
      synonym: "Приходный кассовый ордер",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "",
      fields: {
        "organization": {
          synonym: "Организация",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.organizations"
            ]
          }
        },
        "partner": {
          synonym: "Плательщик",
          multiline: false,
          tooltip: "Контрагент, подотчетник",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.individuals",
              "cat.partners"
            ]
          }
        },
        "department": {
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
        "cashbox": {
          synonym: "Касса",
          multiline: false,
          tooltip: "",
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
              "cat.cashboxes"
            ]
          }
        },
        "doc_amount": {
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
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "Пользователь, ответственный за  документ",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.users"
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
            strLen: 0
          }
        }
      },
      tabulars: {
        "payment_details": {
          name: "РасшифровкаПлатежа",
          synonym: "Расшифровка платежа",
          tooltip: "",
          fields: {
            "cash_flow_article": {
              synonym: "Статья движения денежных средств",
              multiline: false,
              tooltip: "Статья движения денежных средств",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.cash_flow_articles"
                ]
              }
            },
            "trans": {
              synonym: "Объект расчетов",
              multiline: false,
              tooltip: "Документ расчетов с партнером",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "partner"
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
                  "doc.calc_order",
                  "cat.contracts"
                ]
              }
            },
            "amount": {
              synonym: "Сумма",
              multiline: false,
              tooltip: "Сумма платежа",
              mandatory: true,
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            }
          }
        },
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "",
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
        }
      },
      cachable: "doc"
    },
    "credit_cash_order": {
      name: "РасходныйКассовыйОрдер",
      synonym: "Расходный кассовый ордер",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "",
      fields: {
        "organization": {
          synonym: "Организация",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.organizations"
            ]
          }
        },
        "partner": {
          synonym: "Получатель",
          multiline: false,
          tooltip: "Контрагент, подотчетник",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.individuals",
              "cat.partners"
            ]
          }
        },
        "department": {
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
        "cashbox": {
          synonym: "Касса",
          multiline: false,
          tooltip: "",
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
              "cat.cashboxes"
            ]
          }
        },
        "doc_amount": {
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
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "Пользователь, ответственный за  документ",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.users"
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
            strLen: 0
          }
        }
      },
      tabulars: {
        "payment_details": {
          name: "РасшифровкаПлатежа",
          synonym: "Расшифровка платежа",
          tooltip: "",
          fields: {
            "cash_flow_article": {
              synonym: "Статья движения денежных средств",
              multiline: false,
              tooltip: "Статья движения денежных средств",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.cash_flow_articles"
                ]
              }
            },
            "trans": {
              synonym: "Объект расчетов",
              multiline: false,
              tooltip: "Документ расчетов с партнером",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "partner"
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
                  "doc.calc_order",
                  "cat.contracts"
                ]
              }
            },
            "amount": {
              synonym: "Сумма",
              multiline: false,
              tooltip: "Сумма платежа",
              mandatory: true,
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            }
          }
        },
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "",
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
        }
      },
      cachable: "doc"
    },
    "selling": {
      name: "РеализацияТоваровУслуг",
      synonym: "Реализация товаров и услуг",
      illustration: "Документы отражают факт реализации (отгрузки) товаров",
      objPresentation: "Реализация товаров и услуг",
      listPresentation: "Реализация товаров и услуг",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "",
      fields: {
        "organization": {
          synonym: "Организация",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.organizations"
            ]
          }
        },
        "partner": {
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
          mandatory: true,
          type: {
            types: [
              "cat.partners"
            ]
          }
        },
        "department": {
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
        warehouse: {
          synonym: "Склад",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.stores"
            ]
          }
        },
        "doc_amount": {
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
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "Пользователь, ответственный за  документ",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.users"
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
            strLen: 0
          }
        }
      },
      tabulars: {
        goods: {
          name: "Товары",
          synonym: "Товары",
          tooltip: "",
          fields: {
            nom: {
              synonym: "Номенклатура",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "Услуга",
                  path: false
                },
                {
                  name: "set",
                  path: false
                }
              ],
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.nom"
                ]
              }
            },
            nom_characteristic: {
              synonym: "Характеристика",
              multiline: false,
              tooltip: "Характеристика номенклатуры",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "owner"
                  ],
                  path: [
                    "goods",
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
            quantity: {
              synonym: "Количество",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
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
                    "goods",
                    "nom"
                  ]
                }
              ],
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.nom_units"
                ]
              }
            },
            "price": {
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
            "discount_percent": {
              synonym: "Процент скидки или наценки",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 5,
                "fraction": 2
              }
            },
            "vat_rate": {
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
            "amount": {
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
            "vat_amount": {
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
            "trans": {
              synonym: "Сделка",
              multiline: false,
              tooltip: "Документ расчетов с партнером",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "partner"
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
                  "doc.calc_order"
                ]
              }
            }
          }
        },
        "services": {
          name: "Услуги",
          synonym: "Услуги",
          tooltip: "",
          fields: {
            nom: {
              synonym: "Номенклатура",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "Услуга",
                  path: true
                },
                {
                  name: "set",
                  path: false
                }
              ],
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.nom"
                ]
              }
            },
            "content": {
              synonym: "Содержание услуги, доп. сведения",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "string"
                ],
                strLen: 0
              }
            },
            quantity: {
              synonym: "Количество",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            },
            "price": {
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
            "discount_percent": {
              synonym: "Процент скидки или наценки",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 5,
                "fraction": 2
              }
            },
            "amount": {
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
            "vat_rate": {
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
            "vat_amount": {
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
            "trans": {
              synonym: "Сделка",
              multiline: false,
              tooltip: "Документ расчетов с партнером",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "partner"
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
                  "doc.calc_order"
                ]
              }
            }
          }
        },
        "extra_fields": {
          name: "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          tooltip: "",
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
        }
      },
      cachable: "doc"
    },
    "nom_prices_setup": {
      name: "УстановкаЦенНоменклатуры",
      synonym: "Установка цен номенклатуры",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "",
      fields: {
        "price_type": {
          synonym: "Тип Цен",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.nom_prices_types",
              "cat.branches"
            ]
          }
        },
        currency: {
          synonym: "Валюта",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "cat.currencies"
            ]
          }
        },
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.users"
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
            strLen: 0
          }
        }
      },
      tabulars: {
        goods: {
          name: "Товары",
          synonym: "Товары",
          tooltip: "",
          fields: {
            nom: {
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
            nom_characteristic: {
              synonym: "Характеристика или цветогруппа",
              multiline: false,
              tooltip: "",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "owner"
                  ],
                  path: [
                    "goods",
                    "nom"
                  ]
                }
              ],
              choiceParams: [
                {
                  name: "color_price_group_destination",
                  path: "ДляЦенообразования"
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.characteristics",
                  "cat.color_price_groups",
                  "string",
                  "cat.clrs"
                ],
                strLen: 72,
                "strFix": true,
                "default": "cat.characteristics"
              }
            },
            "price_type": {
              synonym: "Тип Цен",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.nom_prices_types",
                  "cat.branches"
                ]
              }
            },
            "price": {
              synonym: "Цена",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 4
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "planning_event": {
      name: "СобытиеПланирования",
      synonym: "Событие планирования",
      illustration: "",
      objPresentation: "Событие планирования",
      listPresentation: "События планирования",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "",
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
        "key": {
          synonym: "Ключ",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 13,
            "fraction": 0
          }
        },
        "recipient": {
          synonym: "Получатель",
          multiline: false,
          tooltip: "СГП или следующий передел",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.parameters_keys"
            ]
          }
        },
        "trans": {
          synonym: "Сделка",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "doc.calc_order"
            ]
          }
        },
        "partner": {
          synonym: "Контрагент",
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
              "cat.partners"
            ]
          }
        },
        "project": {
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
        "origin": {
          synonym: "Происхождение",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "doc.planning_event"
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
            strLen: 0
          }
        }
      },
      tabulars: {
        "executors": {
          name: "Исполнители",
          synonym: "Исполнители",
          tooltip: "",
          fields: {
            "executor": {
              synonym: "Исполнитель",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.individuals",
                  "cat.partners"
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
                "digits": 10,
                "fraction": 3
              }
            }
          }
        },
        "planning": {
          name: "Планирование",
          synonym: "Планирование",
          tooltip: "",
          fields: {
            "obj": {
              synonym: "Объект",
              multiline: false,
              tooltip: "Если указано - изделие, если пусто - Расчет из шапки",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.characteristics"
                ]
              }
            },
            "specimen": {
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
            "elm": {
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
            "power": {
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
            },
            nom: {
              synonym: "Номенклатура",
              multiline: false,
              tooltip: "Номенклатура работы или услуги события",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.nom"
                ]
              }
            },
            "begin_time": {
              synonym: "Время начала",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "date"
                ],
                "datePart": "date_time"
              }
            },
            "end_time": {
              synonym: "Время окончания",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "date"
                ],
                "datePart": "date_time"
              }
            }
          }
        }
      },
      cachable: "doc"
    },
    "purchase_order": {
      name: "ЗаказПоставщику",
      synonym: "Заказ поставщику",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      inputBy: [
        "number_doc"
      ],
      mainPresentation: "name",
      codeLength: 11,
      id: "po",
      fields: {
        "organization": {
          synonym: "Организация",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.organizations"
            ]
          }
        },
        "department": {
          synonym: "Подразделение",
          multiline: false,
          tooltip: "",
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
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.stores"
            ]
          }
        },
        "partner": {
          synonym: "Контрагент",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.partners"
            ]
          }
        },
        "contract": {
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
        "basis": {
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
        "stage": {
          synonym: "Этап производства",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.work_center_kinds"
            ]
          }
        },
        responsible: {
          synonym: "Ответственный",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.users"
            ]
          }
        },
        "shipping_date": {
          synonym: "Дата поступления план",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "date"
            ],
            "datePart": "date"
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
            strLen: 0
          }
        },
        "settlements_course": {
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
        "settlements_multiplicity": {
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
        "bank_account": {
          synonym: "Банковский счет",
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
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.partner_bank_accounts"
            ]
          }
        },
        "vat_included": {
          synonym: "Сумма включает НДС",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "doc_amount": {
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
        "vat_consider": {
          synonym: "Учитывать НДС",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "obj_delivery_state": {
          synonym: "Этап согласования",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "ref",
              path: [
                "Подтвержден",
                "Отклонен",
                "Отправлен",
                "Отозван",
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
        "identifier": {
          synonym: "Идентификатор",
          multiline: false,
          tooltip: "Идентификатор в учетной системе поставщика",
          type: {
            types: [
              "string"
            ],
            strLen: 36
          }
        }
      },
      tabulars: {
        goods: {
          name: "Товары",
          synonym: "Товары",
          tooltip: "",
          fields: {
            "identifier": {
              synonym: "Идентификатор",
              multiline: false,
              tooltip: "Ид. вставки поставщика",
              type: {
                types: [
                  "string"
                ],
                strLen: 36
              }
            },
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
            nom_characteristic: {
              synonym: "Характеристика",
              multiline: false,
              tooltip: "Характеристика номенклатуры",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "owner"
                  ],
                  path: [
                    "goods",
                    "nom"
                  ]
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.characteristics",
                  "string",
                  "cat.clrs"
                ],
                strLen: 72,
                "strFix": true
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
                    "goods",
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
            quantity: {
              synonym: "Количество",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            },
            "price": {
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
            "amount": {
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
            "vat_rate": {
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
            "vat_amount": {
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
            note: {
              synonym: "Комментарий",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 0
              }
            },
            "params": {
              synonym: "Параметры",
              multiline: true,
              tooltip: "Необходимые данной позиции параметры для обсчета сервисом поставщика или внутренним движком",
              type: {
                types: [
                  "json"
                ]
              }
            },
            "calc_order": {
              synonym: "Расчет",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "doc.calc_order"
                ]
              }
            }
          }
        }
      },
      cachable: "doc"
    }
  },
  "ireg": {
    currency_courses: {
      name: "КурсыВалют",
      note: "",
      synonym: "Курсы валют",
      dimensions: {
        currency: {
          synonym: "Валюта",
          multiline: false,
          tooltip: "Ссылка на валюты",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.currencies"
            ]
          }
        },
        period: {
          synonym: "Дата курса",
          multiline: false,
          tooltip: "Дата курса валюты",
          mandatory: true,
          type: {
            types: [
              "date"
            ],
            "datePart": "date"
          }
        }
      },
      resources: {
        course: {
          synonym: "Курс",
          multiline: false,
          tooltip: "Курс валюты",
          mandatory: true,
          type: {
            types: [
              "number"
            ],
            "digits": 10,
            "fraction": 4
          }
        },
        multiplicity: {
          synonym: "Кратность",
          multiline: false,
          tooltip: "Кратность валюты",
          mandatory: true,
          type: {
            types: [
              "number"
            ],
            "digits": 10,
            "fraction": 0
          }
        }
      },
      attributes: {},
      cachable: "ram"
    },
    "margin_coefficients": {
      name: "пзМаржинальныеКоэффициентыИСкидки",
      note: "",
      synonym: "Маржинальные коэффициенты",
      dimensions: {
        "price_group": {
          synonym: "Ценовая группа",
          multiline: false,
          tooltip: "Если указано, правило распространяется только на продукцию данной ценовой группы",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.price_groups"
            ]
          }
        },
        "key": {
          synonym: "Ключ",
          multiline: false,
          tooltip: "Если указано, правило распространяется только на продукцию, параметры окружения которой, совпадают с параметрами ключа параметров",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.parameters_keys"
            ]
          }
        },
        "condition_formula": {
          synonym: "Формула условия",
          multiline: false,
          tooltip: "В этом поле можно указать дополнительное условие на языке javascript",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.formulas"
            ]
          }
        }
      },
      resources: {
        "marginality": {
          synonym: "К марж",
          multiline: false,
          tooltip: "На этот коэффициент будет умножена плановая себестоимость для получения отпускной цены. Имеет смысл, если \"тип цен прайс\" не указан и константа КМАРЖ_В_СПЕЦИФИКАЦИИ сброшена",
          type: {
            types: [
              "number"
            ],
            "digits": 10,
            "fraction": 4
          }
        },
        "marginality_min": {
          synonym: "К марж мин.",
          multiline: false,
          tooltip: "Не позволяет установить в документе расчет скидку, при которой маржинальность строки опустится ниже указанного значения",
          type: {
            types: [
              "number"
            ],
            "digits": 10,
            "fraction": 4
          }
        },
        "marginality_internal": {
          synonym: "К марж внутр.",
          multiline: false,
          tooltip: "Маржинальный коэффициент внутренней продажи",
          type: {
            types: [
              "number"
            ],
            "digits": 10,
            "fraction": 4
          }
        },
        "price_type_first_cost": {
          synonym: "Тип цен плановой себестоимости",
          multiline: false,
          tooltip: "Этот тип цен будет использован для расчета плановой себестоимости продукции",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.nom_prices_types",
              "cat.branches"
            ]
          }
        },
        "price_type_sale": {
          synonym: "Тип прайсовых цен",
          multiline: false,
          tooltip: "Этот тип цен будет использован для расчета отпускной цены продукции. Если указано, значения КМарж и КМарж.мин игнорируются",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.nom_prices_types",
              "cat.branches"
            ]
          }
        },
        "price_type_internal": {
          synonym: "Тип цен внутренней продажи",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.nom_prices_types",
              "cat.branches"
            ]
          }
        },
        "formula": {
          synonym: "Формула",
          multiline: false,
          tooltip: "В этом поле можно указать произвольный код на языке 1С для расчета (корректировки) себестоимости",
          choiceParams: [
            {
              name: "parent",
              path: [
                "3220e251-ffcd-11e5-8303-e67fda7f6b46",
                "3220e25b-ffcd-11e5-8303-e67fda7f6b46"
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
        "sale_formula": {
          synonym: "Формула продажа",
          multiline: false,
          tooltip: "В этом поле можно указать произвольный код на языке 1С для расчета (корректировки) цены продажи",
          choiceParams: [
            {
              name: "parent",
              path: [
                "3220e251-ffcd-11e5-8303-e67fda7f6b46",
                "3220e25b-ffcd-11e5-8303-e67fda7f6b46"
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
        "internal_formula": {
          synonym: "Формула внутр",
          multiline: false,
          tooltip: "В этом поле можно указать произвольный код на языке 1С для расчета цены внутренней продажи или заказа поставщику",
          choiceParams: [
            {
              name: "parent",
              path: [
                "3220e251-ffcd-11e5-8303-e67fda7f6b46",
                "3220e25b-ffcd-11e5-8303-e67fda7f6b46"
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
        "external_formula": {
          synonym: "Формула внешн.",
          multiline: false,
          tooltip: "В этом поле можно указать произвольный код на языке 1С для расчета внешней (дилерской) цены",
          choiceParams: [
            {
              name: "parent",
              path: [
                "3220e251-ffcd-11e5-8303-e67fda7f6b46",
                "3220e25b-ffcd-11e5-8303-e67fda7f6b46"
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
        "extra_charge_external": {
          synonym: "Наценка внешн.",
          multiline: false,
          tooltip: "Наценка внешней (дилерской) продажи по отношению к цене производителя, %. Перекрывается, если указан в лёгклм клиенте",
          type: {
            types: [
              "number"
            ],
            "digits": 5,
            "fraction": 2
          }
        },
        "discount_external": {
          synonym: "Скидка внешн.",
          multiline: false,
          tooltip: "Скидка по умолчанию для внешней (дилерской) продажи по отношению к дилерской цене, %. Перекрывается, если указан в лёгклм клиенте",
          type: {
            types: [
              "number"
            ],
            "digits": 5,
            "fraction": 2
          }
        },
        "discount": {
          synonym: "Скидка",
          multiline: false,
          tooltip: "Скидка по умолчанию, %",
          type: {
            types: [
              "number"
            ],
            "digits": 5,
            "fraction": 2
          }
        }
      },
      attributes: {
        note: {
          synonym: "Комментарий",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 200
          }
        }
      },
      cachable: "ram"
    },
    "settlements_course": {
      name: "КурсВзаиморасчетов",
      note: "",
      synonym: "Курсы взаиморасчетов",
      dimensions: {
        currency: {
          synonym: "Валюта",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.currencies"
            ]
          }
        },
        "nom_group": {
          synonym: "Номенклатурная группа",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.nom_groups"
            ]
          }
        },
        "branch": {
          synonym: "Отдел",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.branches"
            ]
          }
        },
        period: {
          synonym: "",
          multiline: false,
          tooltip: "",
          mandatory: true,
          type: {
            types: [
              "date"
            ],
            "datePart": "date"
          }
        }
      },
      resources: {
        course: {
          synonym: "Курс",
          multiline: false,
          tooltip: "Курс валюты",
          mandatory: true,
          type: {
            types: [
              "number"
            ],
            "digits": 10,
            "fraction": 4
          }
        }
      },
      attributes: {},
      cachable: "ram"
    },
    "delivery_schedules": {
      name: "ГрафикиДоставки",
      note: "",
      synonym: "Графики доставки по районам",
      dimensions: {
        warehouse: {
          synonym: "Точка отправления",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.stores"
            ]
          }
        },
        "delivery_area": {
          synonym: "Географическая зона",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.delivery_areas"
            ]
          }
        },
        "date": {
          synonym: "Дата",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "date"
            ],
            "datePart": "date"
          }
        }
      },
      resources: {
        "start": {
          synonym: "Выезд",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        }
      },
      attributes: {},
      cachable: "ram"
    },
    "delivery_scheme": {
      name: "СхемаДоставки",
      note: "",
      synonym: "Схема доставки готовой продукции",
      dimensions: {
        warehouse: {
          synonym: "Склад отправления",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.stores"
            ]
          }
        },
        "delivery_area": {
          synonym: "Район доставки",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.delivery_areas"
            ]
          }
        },
        "chain_warehouse": {
          synonym: "Промежуточный склад",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.stores"
            ]
          }
        },
        "chain_area": {
          synonym: "Промежуточный район",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.delivery_areas"
            ]
          }
        }
      },
      resources: {
        "chain": {
          synonym: "Номер звена",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 2,
            "fraction": 0
          }
        }
      },
      attributes: {},
      cachable: "ram"
    },
    "predefined_elmnts": {
      name: "ПредопределенныеЭлементы",
      note: "",
      synonym: "Предопределенные элементы",
      dimensions: {
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
        "obj": {
          synonym: "Объект",
          multiline: false,
          tooltip: "Разделитель",
          choiceParams: [
            {
              name: "area",
              path: false
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.abonents",
              "cat.branches"
            ]
          }
        }
      },
      resources: {},
      attributes: {
        "value": {
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
                "property"
              ]
            }
          ],
          "choiceType": {
            path: [
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
      },
      cachable: "ram"
    },
    "i18n": {
      name: "Интернационализация",
      note: "",
      synonym: "Интернационализация",
      dimensions: {
        "obj": {
          synonym: "Объект",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "doc.work_centers_performance",
              "cat.nom_groups",
              "cat.http_apis",
              "cat.production_params",
              "cat.inserts",
              "cat.templates",
              "cat.price_groups",
              "doc.credit_card_order",
              "cat.leads",
              "cat.nom_units",
              "doc.planning_event",
              "cch.predefined_elmnts",
              "cat.currencies",
              "doc.nom_prices_setup",
              "cat.choice_params",
              "cat.characteristics",
              "cat.projects",
              "cat.individuals",
              "cat.users",
              "cat.insert_bind",
              "cat.values_options",
              "cat.partner_bank_accounts",
              "cat.delivery_areas",
              "cat.color_price_groups",
              "cat.elm_visualization",
              "doc.debit_bank_order",
              "doc.registers_correction",
              "cat.property_values_hierarchy",
              "cat.formulas",
              "cat.project_categories",
              "cat.delivery_directions",
              "cat.production_kinds",
              "doc.inventory_goods",
              "cat.charges_discounts",
              "cat.property_values",
              "doc.purchase_order",
              "cat.banks_qualifier",
              "doc.credit_cash_order",
              "doc.selling",
              "cat.nom_prices_types",
              "cat.divisions",
              "cch.mdm_groups",
              "cat.destinations",
              "cat.parameters_keys",
              "doc.purchase",
              "cat.contact_information_kinds",
              "cat.params_links",
              "cat.partners",
              "doc.debit_cash_order",
              "cat.lead_src",
              "cat.nom_kinds",
              "cat.organizations",
              "cat.countries",
              "cat.units",
              "doc.inventory_cuts",
              "doc.work_centers_task",
              "cat.abonents",
              "cat.work_shifts",
              "cat.work_center_kinds",
              "cat.servers",
              "doc.calc_order",
              "cat.branches",
              "doc.credit_bank_order",
              "cat.cashboxes",
              "cat.nom",
              "cat.cnns",
              "cat.furns",
              "cat.cash_flow_articles",
              "cat.work_centers",
              "cat.meta_ids",
              "cat.contracts",
              "cat.project_stages",
              "cat.stores",
              "cch.properties",
              "cat.clrs"
            ]
          }
        },
        "lang": {
          synonym: "Язык",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 2,
            "strFix": true
          }
        },
        "field": {
          synonym: "Реквизит",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        }
      },
      resources: {
        "value": {
          synonym: "Значение",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 100
          }
        }
      },
      attributes: {},
      cachable: "ram"
    }
  },
  "areg": {},
  "dp": {
    "builder_size": {
      name: "builder_size",
      synonym: "Размерная линия",
      illustration: "Метаданные инструмента ruler",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
      fields: {
        "offset": {
          synonym: "Отступ",
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
        "angle": {
          synonym: "Поворот",
          multiline: false,
          tooltip: "",
          "max": 360,
          "min": -360,
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "fix_angle": {
          synonym: "Фикс. угол",
          multiline: false,
          tooltip: "Направлять размерную линию под заданным углом, вместо кратчайшего пути между точками",
          "max": 360,
          "min": -360,
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "align": {
          synonym: "Выравнивание",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.text_aligns"
            ]
          }
        },
        "hide_c1": {
          synonym: "Скрыть выноску1",
          multiline: false,
          tooltip: "",
          "max": 360,
          "min": -360,
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "hide_c2": {
          synonym: "Скрыть выноску2",
          multiline: false,
          tooltip: "",
          "max": 360,
          "min": -360,
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "hide_line": {
          synonym: "Скрыть линию",
          multiline: false,
          tooltip: "",
          "max": 360,
          "min": -360,
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "text": {
          synonym: "Текст",
          multiline: true,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "font_family": {
          synonym: "Шрифт",
          multiline: true,
          tooltip: "Имя шрифта",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "bold": {
          synonym: "Жирный",
          multiline: true,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "font_size": {
          synonym: "Размер",
          multiline: true,
          tooltip: "Размер шрифта",
          "min": 7,
          type: {
            types: [
              "number"
            ],
            "digits": 3,
            "fraction": 0
          }
        }
      },
      tabulars: {}
    },
    "builder_coordinates": {
      name: "builder_coordinates",
      synonym: "Таблица координат",
      illustration: "Метаданные инструмента coordinates",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
      fields: {
        "bind": {
          synonym: "Приязка координат",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "ref",
              path: [
                "b",
                "e"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.bind_coordinates"
            ]
          }
        },
        path: {
          synonym: "Путь",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "ref",
              path: [
                "generatrix",
                "inner",
                "outer"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.path_kind"
            ]
          }
        },
        "offset": {
          synonym: "Отступ",
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
        "step": {
          synonym: "Шаг",
          multiline: false,
          tooltip: "Шаг (расчет по точкам)",
          type: {
            types: [
              "number"
            ],
            "digits": 10,
            "fraction": 3
          }
        },
        "step_angle": {
          synonym: "Угол",
          multiline: false,
          tooltip: "",
          "max": 360,
          "min": 0,
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        }
      },
      tabulars: {
        coordinates: {
          name: "Координаты",
          synonym: "Координаты",
          tooltip: "",
          fields: {
            "x": {
              synonym: "X",
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
            "y": {
              synonym: "Y",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            }
          }
        }
      }
    },
    "builder_pen": {
      name: "builder_pen",
      synonym: "Рисование",
      illustration: "Метаданные инструмента pen (рисование профилей)",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
      fields: {
        "elm_type": {
          synonym: "Тип элемента",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "ref",
              path: [
                "Рама",
                "Импост",
                "Раскладка",
                "Добор",
                "Соединитель",
                "Водоотлив",
                "Линия",
                "Примыкание",
                "Сечение",
                "Разрыв",
                "Штапик"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.elm_types"
            ]
          }
        },
        "inset": {
          synonym: "Материал профиля",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.inserts"
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
              "string",
              "cat.clrs"
            ],
            strLen: 72,
            "strFix": true
          }
        },
        "bind_generatrix": {
          synonym: "Магнит к профилю",
          multiline: true,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "bind_node": {
          synonym: "Магнит к узлам",
          multiline: true,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "bind_sys": {
          synonym: "Вставки по умолчанию из системы",
          multiline: true,
          tooltip: "Действует при добавлении типовой формы",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "grid": {
          synonym: "Шаг сетки",
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
        "region": {
          synonym: "Ряд",
          multiline: false,
          tooltip: "Для расклодок: inner, outer, 1, 2, 3\n0 - не ряд\n1 - ряд внутри элемента\n>1 - за элементом\n<0 - перед элементом",
          choiceParams: [
            {
              name: "ref",
              path: [
                "r1",
                "r2",
                "r3"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.lay_regions"
            ]
          }
        }
      },
      tabulars: {}
    },
    "builder_price": {
      name: "builder_price",
      synonym: "Цены номенклатуры",
      illustration: "Метаданные карточки цен номенклатуры",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
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
        "department": {
          synonym: "Офис продаж",
          multiline: false,
          tooltip: "Подразделение продаж",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.divisions"
            ]
          }
        }
      },
      tabulars: {
        goods: {
          name: "Товары",
          synonym: "Цены",
          tooltip: "",
          fields: {
            "price_type": {
              synonym: "Тип Цен",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.nom_prices_types",
                  "cat.branches"
                ]
              }
            },
            "date": {
              synonym: "Дата",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "date"
                ],
                "datePart": "date"
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
            "price": {
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
            currency: {
              synonym: "Валюта",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.currencies"
                ]
              }
            }
          }
        },
        "rounding_quantity": {
          name: "ОкруглятьКоличество",
          synonym: "Округлять количество",
          tooltip: "",
          fields: {
            "elm_type": {
              synonym: "Тип элемента",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "ref",
                  path: [
                    "Рама",
                    "Уплотнение",
                    "Фурнитура",
                    "Прочее"
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
            "value": {
              synonym: "Значение",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "enm.rounding_quantity"
                ]
              }
            }
          }
        }
      }
    },
    "buyers_order": {
      name: "ЗаказПокупателя",
      synonym: "Заказ покупателя",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
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
        "characteristic": {
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
        "sys": {
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
        "clr": {
          synonym: "Цвет",
          multiline: false,
          tooltip: "",
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
        "len": {
          synonym: "Длина, мм",
          multiline: false,
          tooltip: "",
          "min": 0,
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "height": {
          synonym: "Высота, мм",
          multiline: false,
          tooltip: "",
          "min": 0,
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "depth": {
          synonym: "Глубина, мм",
          multiline: false,
          tooltip: "",
          "min": 0,
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        },
        "s": {
          synonym: "Площадь, м²",
          multiline: false,
          tooltip: "",
          "min": 0,
          type: {
            types: [
              "number"
            ],
            "digits": 10,
            "fraction": 4
          }
        },
        quantity: {
          synonym: "Колич., шт",
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
        note: {
          synonym: "Комментарий",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 150
          }
        },
        "first_cost": {
          synonym: "Себест. ед.",
          multiline: false,
          tooltip: "Плановая себестоимость единицы продукции",
          type: {
            types: [
              "number"
            ],
            "digits": 15,
            "fraction": 2
          }
        },
        "price": {
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
        "discount_percent": {
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
        "discount_percent_internal": {
          synonym: "Скидка внутр. %",
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
        "discount": {
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
        "amount": {
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
        "shipping_date": {
          synonym: "Дата доставки",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "date"
            ],
            "datePart": "date"
          }
        },
        "client_number": {
          synonym: "Номер клиента",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 20
          }
        },
        "inn": {
          synonym: "ИНН Клиента",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 20
          }
        },
        "shipping_address": {
          synonym: "Адрес доставки",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 255
          }
        },
        "phone": {
          synonym: "Телефон",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 100
          }
        },
        "price_internal": {
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
        "amount_internal": {
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
        "base_block": {
          synonym: "Типовой блок",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.characteristics"
            ]
          }
        },
        "weight": {
          synonym: "Масса кг.",
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
        "furn": {
          synonym: "Фурнитура",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "is_folder",
              path: false
            },
            {
              name: "is_set",
              path: false
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.furns"
            ]
          }
        },
        "inset": {
          synonym: "Вставка",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "insert_type",
              path: "Заполнение"
            },
            {
              name: "insert_glass_type",
              path: ""
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.inserts"
            ]
          }
        }
      },
      tabulars: {
        "product_params": {
          name: "ПараметрыИзделия",
          synonym: "Параметры продукции",
          tooltip: "",
          fields: {
            "elm": {
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
            "region": {
              synonym: "Ряд",
              multiline: false,
              tooltip: "Фильтр для дополнительных вставок",
              type: {
                types: [
                  "number"
                ],
                "digits": 2,
                "fraction": 0
              }
            },
            "inset": {
              synonym: "Вставка",
              multiline: false,
              tooltip: "Фильтр для дополнительных вставок",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.inserts"
                ]
              }
            },
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
              tooltip: "",
              type: {
                types: [
                  "boolean"
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
            "inset": {
              synonym: "Продукция",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "insert_type",
                  path: [
                    "Изделие",
                    "МоскитнаяСетка",
                    "Жалюзи",
                    "Подоконник",
                    "Откос",
                    "Заполнение",
                    "Доставка",
                    "Монтаж"
                  ]
                },
                {
                  name: "available",
                  path: true
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.inserts"
                ]
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
                  "cat.nom"
                ]
              }
            },
            "characteristic": {
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
            "clr": {
              synonym: "Цвет",
              multiline: false,
              tooltip: "",
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
            "len": {
              synonym: "Длина, мм",
              multiline: false,
              tooltip: "",
              "min": 0,
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "height": {
              synonym: "Высота, мм",
              multiline: false,
              tooltip: "",
              "min": 0,
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "depth": {
              synonym: "Глубина, мм",
              multiline: false,
              tooltip: "",
              "min": 0,
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "s": {
              synonym: "Площадь, м²",
              multiline: false,
              tooltip: "Площадь изделия",
              "min": 0,
              type: {
                types: [
                  "number"
                ],
                "digits": 10,
                "fraction": 4
              }
            },
            quantity: {
              synonym: "Количество, шт",
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
            note: {
              synonym: "Комментарий",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 150
              }
            },
            "first_cost": {
              synonym: "Себест. ед.",
              multiline: false,
              tooltip: "Плановая себестоимость единицы продукции",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            },
            "price": {
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
            "discount_percent": {
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
            "amount": {
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
            "ordn": {
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
            "qty": {
              synonym: "Количество, шт",
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
            "use": {
              synonym: "√",
              multiline: false,
              tooltip: "Использовать",
              type: {
                types: [
                  "boolean"
                ]
              }
            }
          }
        },
        "glass_specification": {
          name: "СпецификацияЗаполнений",
          synonym: "Спецификация заполнений (ORDGLP)",
          tooltip: "",
          fields: {
            "elm": {
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
            "sorting": {
              synonym: "Порядок",
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
            "inset": {
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
            "clr": {
              synonym: "Цвет",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
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
        "specification": {
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
                "digits": 6,
                "fraction": 0
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
                "digits": 6,
                "fraction": 0
              }
            },
            nom: {
              synonym: "Номенклатура/Набор",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "is_set",
                  path: true
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
            nom_characteristic: {
              synonym: "Характеристика",
              multiline: false,
              tooltip: "",
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
            quantity: {
              synonym: "Количество",
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
            "handle_height_base": {
              synonym: "Выс. ручк.",
              multiline: false,
              tooltip: "Стандартная высота ручки",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "handle_height_min": {
              synonym: "Выс. ручк. min",
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
            "handle_height_max": {
              synonym: "Выс. ручк. max",
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
            "contraction": {
              synonym: "Укорочение",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "string",
                  "number"
                ],
                strLen: 100,
                "digits": 10,
                "fraction": 4
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
                "digits": 10,
                "fraction": 4
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
                "digits": 6,
                "fraction": 0
              }
            },
            "flap_weight_max": {
              synonym: "Масса створки max",
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
            "side": {
              synonym: "Сторона",
              multiline: false,
              tooltip: "Сторона фурнитуры, на которую устанавливается элемент или на которой выполняется операция",
              type: {
                types: [
                  "number"
                ],
                "digits": 1,
                "fraction": 0
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
            "formula": {
              synonym: "Формула",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 0
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
                "digits": 1,
                "fraction": 0
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
                "digits": 1,
                "fraction": 0
              }
            },
            "is_order_row": {
              synonym: "Это строка заказа",
              multiline: false,
              tooltip: "Если заполнено, строка будет добавлена в заказ, а не в спецификацию текущей продукции",
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.specification_order_row_types"
                ]
              }
            },
            "origin": {
              synonym: "Происхождение",
              multiline: false,
              tooltip: "Ссылка на настройки построителя, из которых возникла строка спецификации",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.inserts",
                  "string",
                  "number",
                  "cat.cnns",
                  "cat.furns"
                ],
                strLen: 1024,
                "digits": 6,
                "fraction": 0
              }
            },
            "specify": {
              synonym: "Уточнение происхождения",
              multiline: false,
              tooltip: "Ссылка на настройки построителя, из которых возникла строка спецификации",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.inserts",
                  "number",
                  "cat.nom",
                  "cat.cnns",
                  "cat.furns"
                ],
                "digits": 2,
                "fraction": 0
              }
            },
            "stage": {
              synonym: "Этап",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.work_center_kinds"
                ]
              }
            }
          }
        },
        "charges_discounts": {
          name: "СкидкиНаценки",
          synonym: "Скидки наценки",
          tooltip: "",
          fields: {
            "nom_kind": {
              synonym: "Группа",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.nom_kinds"
                ]
              }
            },
            "discount_percent": {
              synonym: "Скидка %",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 5,
                "fraction": 2
              }
            }
          }
        },
        "sys_furn": {
          name: "СистемыФурнитуры",
          synonym: "Фурнитура",
          tooltip: "",
          fields: {
            "elm1": {
              synonym: "Текущая",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "is_set",
                  path: false
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.furns"
                ]
              }
            },
            "elm2": {
              synonym: "Заменить на",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "is_set",
                  path: false
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
        },
        "sys_profile": {
          name: "СистемыПрофилей",
          synonym: "Разрешенные системы",
          tooltip: "Допустимые системы",
          fields: {
            "sys": {
              synonym: "Система",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.production_params"
                ]
              }
            }
          }
        }
      }
    },
    "builder_text": {
      name: "builder_text",
      synonym: "Произвольный текст",
      illustration: "Метаданные инструмента text",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
      fields: {
        "text": {
          synonym: "Текст",
          multiline: true,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "font_family": {
          synonym: "Шрифт",
          multiline: true,
          tooltip: "Имя шрифта",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "bold": {
          synonym: "Жирный",
          multiline: true,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "font_size": {
          synonym: "Размер",
          multiline: true,
          tooltip: "Размер шрифта",
          "min": 7,
          type: {
            types: [
              "number"
            ],
            "digits": 3,
            "fraction": 0
          }
        },
        "angle": {
          synonym: "Поворот",
          multiline: false,
          tooltip: "",
          "max": 360,
          "min": -360,
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "align": {
          synonym: "Выравнивание",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "enm.text_aligns"
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
        "x": {
          synonym: "X коорд.",
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
        "y": {
          synonym: "Y коорд.",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        }
      },
      tabulars: {}
    },
    "builder_lay_impost": {
      name: "builder_lay_impost",
      synonym: "Импосты и раскладки",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
      fields: {
        "elm_type": {
          synonym: "Тип элемента",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "ref",
              path: [
                "Импост",
                "Раскладка",
                "Рама"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.elm_types"
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
              "string",
              "cat.clrs"
            ],
            strLen: 72,
            "strFix": true
          }
        },
        "region": {
          synonym: "Ряд",
          multiline: false,
          tooltip: "Для расклодок: inner, outer, 1, 2, 3\n0 - не ряд\n1 - ряд внутри элемента\n>1 - за элементом\n<0 - перед элементом",
          choiceParams: [
            {
              name: "ref",
              path: [
                "r1",
                "r2",
                "r3"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.lay_regions"
            ]
          }
        },
        "split": {
          synonym: "Тип деления",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "ref",
              path: [
                "ДелениеГоризонтальных",
                "ДелениеВертикальных",
                "КрестВСтык",
                "КрестПересечение"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.lay_split_types"
            ]
          }
        },
        "elm_by_y": {
          synonym: "Элементов",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 2,
            "fraction": 0
          }
        },
        "step_by_y": {
          synonym: "Шаг",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 4,
            "fraction": 0
          }
        },
        "align_by_y": {
          synonym: "Опора",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "ref",
              path: [
                "Низ",
                "Верх",
                "Центр"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.positions"
            ]
          }
        },
        "inset_by_y": {
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
        "elm_by_x": {
          synonym: "Элементов",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 2,
            "fraction": 0
          }
        },
        "step_by_x": {
          synonym: "Шаг",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 4,
            "fraction": 0
          }
        },
        "align_by_x": {
          synonym: "Опора",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "ref",
              path: [
                "Лев",
                "Прав",
                "Центр"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "enm.positions"
            ]
          }
        },
        "inset_by_x": {
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
        "w": {
          synonym: "Ширина",
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
        "h": {
          synonym: "Высота",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            "digits": 8,
            "fraction": 2
          }
        }
      },
      tabulars: {
        "sizes": {
          name: "Размеры",
          synonym: "Размеры",
          tooltip: "Размеры ячеек фасада по X и Y",
          fields: {
            "elm": {
              synonym: "Напраленние",
              multiline: false,
              tooltip: "0 - горизонт, 1 - вертикаль",
              type: {
                types: [
                  "number"
                ],
                "digits": 1,
                "fraction": 0
              }
            },
            "sz": {
              synonym: "Размер",
              multiline: false,
              tooltip: "Размер ячейки. Порядок в номере строки, направление в elm",
              mandatory: true,
              type: {
                types: [
                  "string"
                ],
                strLen: 8
              }
            },
            "changed": {
              synonym: "Запись изменена",
              multiline: false,
              tooltip: "Запись изменена оператором",
              type: {
                types: [
                  "number"
                ],
                "digits": 1,
                "fraction": 0
              }
            }
          }
        }
      }
    }
  },
  "rep": {
    "materials_demand": {
      name: "materials_demand",
      synonym: "Потребность в материалах",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
      fields: {
        "calc_order": {
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
        "formula": {
          synonym: "Формула",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "parent",
              path: [
                "3220e252-ffcd-11e5-8303-e67fda7f6b46",
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
        "scheme": {
          synonym: "Вариант настроек",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "obj",
              path: "rep.materials_demand.specification"
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.scheme_settings"
            ]
          }
        }
      },
      tabulars: {
        "production": {
          name: "Продукция",
          synonym: "Продукция",
          tooltip: "",
          fields: {
            "use": {
              synonym: "Использование",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "boolean"
                ]
              }
            },
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
            "characteristic": {
              synonym: "Характеристика",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.characteristics"
                ]
              }
            },
            "elm": {
              synonym: "Элемент",
              multiline: false,
              tooltip: "№ элемента",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "qty": {
              synonym: "Количество, шт",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 14,
                "fraction": 3
              }
            }
          }
        },
        "specification": {
          name: "Спецификация",
          synonym: "Спецификация",
          tooltip: "",
          fields: {
            "calc_order": {
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
            "product": {
              synonym: "Изделие",
              multiline: false,
              tooltip: "Для продукции - номер строки заказа, для характеристики стеклопакета - номер элемента",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
            "cnstr": {
              synonym: "№ Конструкции",
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
            "elm": {
              synonym: "Элемент",
              multiline: false,
              tooltip: "Номер элемента, если значение > 0, либо номер конструкции, если значение < 0",
              type: {
                types: [
                  "number"
                ],
                "digits": 6,
                "fraction": 0
              }
            },
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
            "article": {
              synonym: "Артикул",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 50
              }
            },
            id: {
              synonym: "Код",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "string",
                  "number"
                ],
                strLen: 20,
                "digits": 20,
                "fraction": 0
              }
            },
            "clr": {
              synonym: "Цвет",
              multiline: false,
              tooltip: "",
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
            "characteristic": {
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
            "nom_kind": {
              synonym: "Вид номенклатуры",
              multiline: false,
              tooltip: "Указывается вид, к которому следует отнести данную позицию номенклатуры.",
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.nom_kinds"
                ]
              }
            },
            "price_group": {
              synonym: "Ценовая группа",
              multiline: false,
              tooltip: "Актуально для продукций",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.price_groups"
                ]
              }
            },
            "nom_group": {
              synonym: "Номенклатурная группа",
              multiline: false,
              tooltip: "Определяет счета учета и выступает разрезом в расчете себестоимости",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.nom_groups"
                ]
              }
            },
            "packing": {
              synonym: "Нормоупаковка",
              multiline: false,
              tooltip: "Коэффициент нормоураковки (N единиц хранения остатков)",
              type: {
                types: [
                  "number"
                ],
                "digits": 8,
                "fraction": 2
              }
            },
            "qty": {
              synonym: "Количество (шт)",
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
            "len": {
              synonym: "Длина, м",
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
            "width": {
              synonym: "Ширина, м",
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
            "s": {
              synonym: "Площадь, м²",
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
            "thickness": {
              synonym: "Толщина, мм",
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
            "material": {
              synonym: "Материал",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 255
              }
            },
            "grouping": {
              synonym: "Группировка",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 50
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
            "totqty": {
              synonym: "Количество",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 14,
                "fraction": 4
              }
            },
            "totqty1": {
              synonym: "Количество (+%)",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 14,
                "fraction": 4
              }
            },
            "alp1": {
              synonym: "Угол 1, °",
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
            "alp2": {
              synonym: "Угол 2, °",
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
            "sz": {
              synonym: "Размер",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 50
              }
            },
            "price": {
              synonym: "Себест.план",
              multiline: false,
              tooltip: "Цена плановой себестоимости строки спецификации",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            },
            "amount": {
              synonym: "Сумма себест.",
              multiline: false,
              tooltip: "Сумма плановой себестоимости строки спецификации",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            },
            "amount_marged": {
              synonym: "Сумма с наценкой",
              multiline: false,
              tooltip: "Вклад строки спецификации в стоимость изделия для сценария КМАРЖ_В_СПЕЦИФИКАЦИИ",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            },
            "dop": {
              synonym: "Вид строки",
              multiline: false,
              tooltip: "+1 - аксессуары\n-1 - визуализация\n-2 - техоперации\n-3 - обрезь",
              type: {
                types: [
                  "number"
                ],
                "digits": 1,
                "fraction": 0
              }
            }
          }
        }
      }
    },
    "formulas_stat": {
      name: "formulas_stat",
      synonym: "Статистика работы формул",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
      fields: {},
      tabulars: {
        "data": {
          name: "data",
          synonym: "Data",
          tooltip: "",
          fields: {
            "date": {
              synonym: "Дата",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "date"
                ],
                "datePart": "date_time"
              }
            },
            "formula": {
              synonym: "Формула",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.formulas"
                ]
              }
            },
            "user": {
              synonym: "Пользователь",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 50
              }
            },
            "suffix": {
              synonym: "Суффикс",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 4,
                "strFix": true
              }
            },
            "requests": {
              synonym: "Вызовов",
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
            "time": {
              synonym: "Время, mc",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 10,
                "fraction": 0
              }
            }
          }
        }
      }
    },
    "cash": {
      name: "cash",
      synonym: "Денежные средства",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
      fields: {},
      tabulars: {
        "data": {
          name: "data",
          synonym: "Данные",
          tooltip: "",
          fields: {
            period: {
              synonym: "Период",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "date"
                ],
                "datePart": "date"
              }
            },
            "register": {
              synonym: "Регистратор",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "doc.credit_card_order",
                  "doc.debit_bank_order",
                  "doc.registers_correction",
                  "doc.credit_cash_order",
                  "doc.debit_cash_order",
                  "doc.credit_bank_order"
                ]
              }
            },
            "organization": {
              synonym: "Организация",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.organizations"
                ]
              }
            },
            "bank_account_cashbox": {
              synonym: "Касса или банковский счет",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.partner_bank_accounts",
                  "cat.cashboxes"
                ]
              }
            },
            "initial_balance": {
              synonym: "Начальный остаток",
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
            "debit": {
              synonym: "Приход",
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
            "credit": {
              synonym: "Расход",
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
            "final_balance": {
              synonym: "Конечный остаток",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            }
          }
        }
      }
    },
    goods: {
      name: "goods",
      synonym: "Товары на складах",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
      fields: {},
      tabulars: {
        "data": {
          name: "data",
          synonym: "Данные",
          tooltip: "",
          fields: {
            period: {
              synonym: "Период",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "date"
                ],
                "datePart": "date"
              }
            },
            "register": {
              synonym: "Регистратор",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "doc.registers_correction",
                  "doc.selling",
                  "doc.purchase"
                ]
              }
            },
            warehouse: {
              synonym: "Склад",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.stores"
                ]
              }
            },
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
            "characteristic": {
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
                    "data",
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
            "initial_balance": {
              synonym: "Начальный остаток",
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
            "debit": {
              synonym: "Приход",
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
            "credit": {
              synonym: "Расход",
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
            "final_balance": {
              synonym: "Конечный остаток",
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
            "amount_initial_balance": {
              synonym: "Сумма начальный остаток",
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
            "amount_debit": {
              synonym: "Сумма приход",
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
            "amount_credit": {
              synonym: "Сумма расход",
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
            "amount_final_balance": {
              synonym: "Сумма конечный остаток",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            }
          }
        }
      }
    },
    "invoice_execution": {
      name: "invoice_execution",
      synonym: "Исполнение заказов",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
      fields: {},
      tabulars: {
        "data": {
          name: "data",
          synonym: "Данные",
          tooltip: "",
          fields: {
            period: {
              synonym: "Период",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "date"
                ],
                "datePart": "date"
              }
            },
            "organization": {
              synonym: "Организация",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.organizations"
                ]
              }
            },
            "department": {
              synonym: "Подразделение",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.divisions"
                ]
              }
            },
            "partner": {
              synonym: "Контрагент",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.partners"
                ]
              }
            },
            "trans": {
              synonym: "Сделка",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "doc.calc_order"
                ]
              }
            },
            "invoice": {
              synonym: "Сумма заказа",
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
            "pay": {
              synonym: "Оплачено",
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
            "pay_total": {
              synonym: "Оплатить",
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
            "pay_percent": {
              synonym: "% Оплаты",
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
            "shipment": {
              synonym: "Отгружено",
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
            "shipment_total": {
              synonym: "Отгрузить",
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
            "shipment_percent": {
              synonym: "% Отгрузки",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            }
          }
        }
      }
    },
    "mutual_settlements": {
      name: "mutual_settlements",
      synonym: "Взаиморасчеты",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
      fields: {},
      tabulars: {
        "data": {
          name: "data",
          synonym: "Данные",
          tooltip: "",
          fields: {
            period: {
              synonym: "Период",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "date"
                ],
                "datePart": "date"
              }
            },
            "register": {
              synonym: "Регистратор",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "doc.credit_card_order",
                  "doc.debit_bank_order",
                  "doc.registers_correction",
                  "doc.credit_cash_order",
                  "doc.selling",
                  "doc.purchase",
                  "doc.debit_cash_order",
                  "doc.credit_bank_order"
                ]
              }
            },
            "organization": {
              synonym: "Организация",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.organizations"
                ]
              }
            },
            "trans": {
              synonym: "Сделка",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "doc.calc_order"
                ]
              }
            },
            "partner": {
              synonym: "Контрагент",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.partners"
                ]
              }
            },
            "initial_balance": {
              synonym: "Нач. остаток",
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
            "debit": {
              synonym: "Приход",
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
            "credit": {
              synonym: "Расход",
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
            "final_balance": {
              synonym: "Кон. остаток",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            }
          }
        }
      }
    },
    "selling": {
      name: "selling",
      synonym: "Продажи",
      illustration: "",
      objPresentation: "",
      listPresentation: "",
      mainPresentation: "name",
      codeLength: 0,
      id: "",
      fields: {},
      tabulars: {
        "data": {
          name: "data",
          synonym: "Данные",
          tooltip: "",
          fields: {
            period: {
              synonym: "Период",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "date"
                ],
                "datePart": "date"
              }
            },
            "register": {
              synonym: "Регистратор",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "doc.registers_correction",
                  "doc.selling",
                  "doc.purchase"
                ]
              }
            },
            "organization": {
              synonym: "Организация",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.organizations"
                ]
              }
            },
            "department": {
              synonym: "Подразделение",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.divisions"
                ]
              }
            },
            "partner": {
              synonym: "Контрагент",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "cat.partners"
                ]
              }
            },
            "trans": {
              synonym: "Сделка",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "doc.calc_order"
                ]
              }
            },
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
            "characteristic": {
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
                    "data",
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
            quantity: {
              synonym: "Количество",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 3
              }
            },
            "amount": {
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
            "vat_amount": {
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
            "discount": {
              synonym: "Сумма скидки",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "number"
                ],
                "digits": 15,
                "fraction": 2
              }
            }
          }
        }
      }
    }
  },
  "cch": {
    "predefined_elmnts": {
      name: "ПредопределенныеЭлементы",
      synonym: "Константы и списки",
      illustration: "Хранит значения настроек и параметров подсистем",
      objPresentation: "Значение настроек",
      listPresentation: "",
      inputBy: [
        "name",
        "synonym"
      ],
      hierarchical: true,
      hasOwners: false,
      groupHierarchy: false,
      mainPresentation: "name",
      codeLength: 0,
      id: "pe",
      fields: {
        "value": {
          synonym: "Значение",
          multiline: false,
          tooltip: "",
          "choiceType": {
            path: [
              "ТипЗначения"
            ],
            "elm": 0
          },
          type: {
            types: [
              "cat.http_apis",
              "cat.production_params",
              "cat.inserts",
              "cat.price_groups",
              "cat.currencies",
              "cat.characteristics",
              "cat.color_price_groups",
              "cat.property_values_hierarchy",
              "cat.formulas",
              "cat.property_values",
              "boolean",
              "cat.nom_prices_types",
              "cat.divisions",
              "enm.elm_types",
              "cat.parameters_keys",
              "string",
              "enm.sz_line_types",
              "cat.nom_kinds",
              "date",
              "cat.units",
              "number",
              "enm.plan_detailing",
              "doc.calc_order",
              "cat.branches",
              "cat.nom",
              "cat.furns",
              "enm.inserts_glass_types",
              "cch.properties",
              "cat.clrs"
            ],
            strLen: 1024,
            "datePart": "date",
            "digits": 15,
            "fraction": 3
          }
        },
        "definition": {
          synonym: "Описание",
          multiline: true,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        synonym: {
          synonym: "Синоним",
          multiline: false,
          tooltip: "Синоним предопределенного элемента латиницей для обращения из javascript",
          type: {
            types: [
              "string"
            ],
            strLen: 50
          }
        },
        "list": {
          synonym: "Список",
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
        },
        parent: {
          synonym: "",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cch.predefined_elmnts"
            ]
          }
        },
        type: {
          synonym: "",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.http_apis",
              "cat.production_params",
              "cat.inserts",
              "cat.price_groups",
              "cat.currencies",
              "cat.characteristics",
              "cat.color_price_groups",
              "cat.property_values_hierarchy",
              "cat.formulas",
              "cat.property_values",
              "boolean",
              "cat.nom_prices_types",
              "cat.divisions",
              "enm.elm_types",
              "cat.parameters_keys",
              "string",
              "enm.sz_line_types",
              "cat.nom_kinds",
              "date",
              "cat.units",
              "number",
              "enm.plan_detailing",
              "doc.calc_order",
              "cat.branches",
              "cat.nom",
              "cat.furns",
              "enm.inserts_glass_types",
              "cch.properties",
              "cat.clrs"
            ],
            strLen: 1024,
            "datePart": "date",
            "digits": 15,
            "fraction": 3
          }
        }
      },
      tabulars: {
        "elmnts": {
          name: "Элементы",
          synonym: "Элементы",
          tooltip: "",
          fields: {
            "value": {
              synonym: "Значение",
              multiline: false,
              tooltip: "",
              "choiceType": {
                path: [
                  "ТипЗначения"
                ],
                "elm": 0
              },
              type: {
                types: [
                  "cat.http_apis",
                  "cat.production_params",
                  "cat.inserts",
                  "cat.price_groups",
                  "cat.currencies",
                  "cat.characteristics",
                  "cat.color_price_groups",
                  "cat.property_values_hierarchy",
                  "cat.formulas",
                  "cat.property_values",
                  "boolean",
                  "cat.nom_prices_types",
                  "cat.divisions",
                  "enm.elm_types",
                  "cat.parameters_keys",
                  "string",
                  "enm.sz_line_types",
                  "cat.nom_kinds",
                  "date",
                  "cat.units",
                  "number",
                  "enm.plan_detailing",
                  "doc.calc_order",
                  "cat.branches",
                  "cat.nom",
                  "cat.furns",
                  "enm.inserts_glass_types",
                  "cch.properties",
                  "cat.clrs"
                ],
                strLen: 1024,
                "datePart": "date",
                "digits": 15,
                "fraction": 3
              }
            },
            "elm": {
              synonym: "Элемент",
              multiline: false,
              tooltip: "",
              type: {
                types: [
                  "cat.http_apis",
                  "cat.production_params",
                  "cat.inserts",
                  "cat.price_groups",
                  "cat.currencies",
                  "cat.characteristics",
                  "cat.color_price_groups",
                  "cat.property_values_hierarchy",
                  "cat.formulas",
                  "cat.property_values",
                  "boolean",
                  "cat.nom_prices_types",
                  "cat.divisions",
                  "enm.elm_types",
                  "cat.parameters_keys",
                  "string",
                  "enm.sz_line_types",
                  "cat.nom_kinds",
                  "date",
                  "cat.units",
                  "number",
                  "enm.plan_detailing",
                  "doc.calc_order",
                  "cat.branches",
                  "cat.nom",
                  "cat.furns",
                  "enm.inserts_glass_types",
                  "cch.properties",
                  "cat.clrs"
                ],
                strLen: 1024,
                "datePart": "date",
                "digits": 15,
                "fraction": 3
              }
            }
          }
        }
      },
      cachable: "ram"
    },
    "mdm_groups": {
      name: "ГруппыMDM",
      synonym: "Группы MDM",
      illustration: "",
      objPresentation: "Группа MDM",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: false,
      mainPresentation: "name",
      codeLength: 0,
      id: "mg",
      fields: {
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
        "use": {
          synonym: "Используется",
          multiline: false,
          tooltip: "Использовать данный фильтр",
          type: {
            types: [
              "boolean"
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
        },
        type: {
          synonym: "",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.production_params",
              "cat.inserts",
              "cch.predefined_elmnts",
              "cat.choice_params",
              "cat.insert_bind",
              "cat.formulas",
              "cat.property_values",
              "cat.params_links",
              "cat.furns",
              "cch.properties",
              "cat.clrs"
            ]
          }
        }
      },
      tabulars: {
        "elmnts": {
          name: "Элементы",
          synonym: "Элементы",
          tooltip: "",
          fields: {
            "elm": {
              synonym: "Элемент",
              multiline: false,
              tooltip: "",
              "choiceType": {
                path: [
                  "ТипЗначения"
                ],
                "elm": 0
              },
              mandatory: true,
              type: {
                types: [
                  "cat.production_params",
                  "cat.inserts",
                  "cch.predefined_elmnts",
                  "cat.choice_params",
                  "cat.insert_bind",
                  "cat.formulas",
                  "cat.property_values",
                  "cat.params_links",
                  "cat.furns",
                  "cch.properties",
                  "cat.clrs"
                ]
              }
            }
          }
        },
        "applying": {
          name: "Применение",
          synonym: "Отделы",
          tooltip: "",
          fields: {
            "branch": {
              synonym: "Отдел",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "area",
                  path: false
                }
              ],
              choiceGrp: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.abonents",
                  "cat.branches"
                ]
              }
            }
          }
        }
      },
      cachable: "meta"
    },
    "properties": {
      name: "ДополнительныеРеквизитыИСведения",
      synonym: "Дополнительные реквизиты и сведения",
      illustration: "",
      objPresentation: "Дополнительный реквизит / сведение",
      listPresentation: "",
      inputBy: [
        "name"
      ],
      hierarchical: false,
      hasOwners: false,
      groupHierarchy: false,
      mainPresentation: "name",
      codeLength: 0,
      id: "pr",
      fields: {
        "shown": {
          synonym: "Виден",
          multiline: false,
          tooltip: "Настройка видимости дополнительного реквизита",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "sorting_field": {
          synonym: "Порядок",
          multiline: false,
          tooltip: "Используется для упорядочивания (служебный)",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        "extra_values_owner": {
          synonym: "Владелец дополнительных значений",
          multiline: false,
          tooltip: "Свойство-образец, с которым у этого свойства одинаковый список дополнительных значений",
          choiceGrp: "elm",
          type: {
            types: [
              "cch.properties"
            ]
          }
        },
        "available": {
          synonym: "Доступен",
          multiline: false,
          tooltip: "Настройка доступности дополнительного реквизита",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        mandatory: {
          synonym: "Заполнять обязательно",
          multiline: false,
          tooltip: "Настройка проверки заполненности дополнительного реквизита",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "include_to_name": {
          synonym: "Включать в наименование",
          multiline: false,
          tooltip: "Добавлять значение параметра в наименование продукции",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "list": {
          synonym: "Список",
          multiline: false,
          tooltip: "Реквизит подсистемы интеграции metadata.js - реализует функциональность списка опций",
          type: {
            types: [
              "number"
            ],
            "digits": 1,
            "fraction": 0
          }
        },
        "caption": {
          synonym: "Наименование",
          multiline: false,
          tooltip: "Краткое представление свойства, которое\nвыводится в формах редактирования его значения",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 75
          }
        },
        note: {
          synonym: "Комментарий",
          multiline: false,
          tooltip: "Поясняет назначение свойства",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "destination": {
          synonym: "Набор свойств",
          multiline: false,
          tooltip: "Набор свойств, которому принадлежит уникальное свойство. Если не задан, значит свойство общее.",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.destinations"
            ]
          }
        },
        tooltip: {
          synonym: "Подсказка",
          multiline: false,
          tooltip: "Показывается пользователю при редактировании свойства в форме объекта",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        "is_extra_property": {
          synonym: "Это дополнительное сведение",
          multiline: false,
          tooltip: "Свойство является дополнительным сведением, а не дополнительным реквизитом",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "include_to_description": {
          synonym: "Включать в описание",
          multiline: false,
          tooltip: "Добавлять имя и значение параметра в строку описания продукции",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "calculated": {
          synonym: "Вычисляемый",
          multiline: false,
          tooltip: "Если параметр вычисляемый, здесь указываем формулу",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.formulas"
            ]
          }
        },
        "showcalc": {
          synonym: "Показывать вычисляемый",
          multiline: false,
          tooltip: "Показывать параметр в списках свойств объекта ",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        "inheritance": {
          synonym: "Наследование",
          multiline: false,
          tooltip: "Правило уточнения значений свойства\n0 - Обычный параметр\n1 - Переопределять для элемента\n2 - Только для элемента\n3 - Переопределять для отдела абонента\n4 - Умолчание для отдела\n5 - Значение из шаблона",
          type: {
            types: [
              "number"
            ],
            "digits": 6,
            "fraction": 0
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
        },
        type: {
          synonym: "",
          multiline: false,
          tooltip: "Типы значения, которое можно ввести при заполнении свойства.",
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
        }
      },
      tabulars: {
        "applying": {
          name: "Применение",
          synonym: "Применение для элемента",
          tooltip: "Актуально для параметров, задаваемых для элемента. Позволяет задействовать параметр только для определённых типов элемента и положений. Например, параметр будет виден в интерфейсе для горизонтальных импостов и скрыт для рам и створок",
          fields: {
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
                    "Стекло",
                    "Заполнение"
                  ]
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.elm_types"
                ]
              }
            },
            "pos": {
              synonym: "Положение/ориентация",
              multiline: false,
              tooltip: "",
              choiceParams: [
                {
                  name: "ref",
                  path: [
                    "Любое",
                    "Лев",
                    "Прав",
                    "Верх",
                    "Низ",
                    "Центр",
                    "Горизонтальная",
                    "Вертикальная",
                    "Наклонная"
                  ]
                }
              ],
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.orientations",
                  "enm.positions"
                ]
              }
            }
          }
        },
        "use": {
          name: "use",
          synonym: "Применение для способов расчёта",
          tooltip: "Позволяет отключить проверку параметра при расчёте специфиации для строк с определённым способом расчёта количества. Например, условие должно проверяться при расчёте по периметру и не должно при расчёте по площади",
          fields: {
            "count_calc_method": {
              synonym: "Расчет колич.",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: [
                  "enm.count_calculating_ways"
                ]
              }
            }
          }
        },
        hide: {
          name: "Скрыть",
          synonym: "Скрываемые значения",
          tooltip: "Для печатных форм. Значения, перечисленные в данной табчасти, могут быть скрыты",
          fields: {
            "value": {
              synonym: "Скрывать значения",
              multiline: false,
              tooltip: "",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "owner"
                  ],
                  path: [
                    "ref"
                  ]
                }
              ],
              choiceGrp: "elm",
              "choiceType": {
                path: [
                  "ТипЗначения"
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
        }
      },
      cachable: "ram"
    }
  },
  "cacc": {},
  "bp": {},
  "tsk": {},
}
