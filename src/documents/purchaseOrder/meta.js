
export const meta= {
  name: "ЗаказПоставщику",
  splitted: false,
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
    organization: {
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
    department: {
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
    partner: {
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
    stage: {
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
    shipping_date: {
      synonym: "Дата поступления план",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "date"
        ],
        datePart: "date"
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
    bank_account: {
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
    obj_delivery_state: {
      synonym: "Этап согласования",
      multiline: false,
      tooltip: "",
      "choiceParams": [
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
    identifier: {
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
  "tabulars": {
    "goods": {
      name: "Товары",
      synonym: "Товары",
      tooltip: "",
      fields: {
        identifier: {
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
        params: {
          synonym: "Параметры",
          multiline: true,
          tooltip: "Необходимые данной позиции параметры для обсчета сервисом поставщика или внутренним движком",
          type: {
            types: [
              "json"
            ]
          }
        },
        calc_order: {
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
  cachable: "doc",
  aliases: ['purchase_order'],
};


