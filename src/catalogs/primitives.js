
export default  {
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
  nomGroups: {
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
    fields: {
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
      parent: {
        synonym: "Раздел",
        multiline: false,
        tooltip: "",
        type: {
          types: [
            "cat.nomGroups"
          ]
        }
      }
    },
    tabulars: {},
    id: "ng",
    cachable: "ram",
    aliases: ['nom_groups'],
  },
  priceGroups: {
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
    fields: {
      definition: {
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
    },
    tabulars: {},
    id: "pg",
    cachable: "ram",
    aliases: ['price_groups'],
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
          digits: 15,
          fraction: 3
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
            "cat.nomGroups",
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
  nomPricesTypes: {
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
    fields: {
      price_currency: {
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
      discount_percent: {
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
      vat_price_included: {
        synonym: "Цена включает НДС",
        multiline: false,
        tooltip: "",
        type: {
          types: [
            "boolean"
          ]
        }
      },
      rounding_order: {
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
      rounding_in_a_big_way: {
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
    cachable: "ram",
    id: "prc",
    aliases: ['nom_prices_types'],
  },
  cashboxes: {
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
      funds_currency: {
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
      department: {
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
      current_account: {
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
      owner: {
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
};
