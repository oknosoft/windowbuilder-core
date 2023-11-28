
export const meta = {
  enm: {
    alignTypes: [
      {
        order: 0,
        name: "Геометрически",
        synonym: "Геометрически"
      },
      {
        order: 1,
        name: "ПоЗаполнениям",
        synonym: "По заполнениям"
      },
      {
        tag: "Варианты уравнивания",
        id: 'eal',
        description: "Для команды графического редактора \"Уравнять\"",
        aliases: ['align_types']
      }
    ],
    cnnTypes: [
      {
        order: 0,
        name: "УгловоеДиагональное",
        synonym: "Угловое диагональное",
        latin: "ad",
        "css": "tb_img_cnn_ad"
      },
      {
        order: 1,
        name: "УгловоеКВертикальной",
        synonym: "Угловое к вертикальной",
        latin: "av",
        "css": "tb_img_cnn_short"
      },
      {
        order: 2,
        name: "УгловоеКГоризонтальной",
        synonym: "Угловое к горизонтальной",
        latin: "ah",
        "css": "tb_img_cnn_long"
      },
      {
        order: 3,
        name: "ТОбразное",
        synonym: "Т-образное",
        latin: "t",
        "css": "tb_img_cnn_t"
      },
      {
        order: 4,
        name: "Наложение",
        synonym: "Наложение",
        latin: "ii",
        "css": "tb_img_cnn_ii"
      },
      {
        order: 5,
        name: "НезамкнутыйКонтур",
        synonym: "Незамкнутый контур",
        latin: "i",
        "css": "tb_img_cnn_i"
      },
      {
        order: 6,
        name: "КрестВСтык",
        synonym: "Крест в стык",
        latin: "xx",
        "css": "tb_img_cnn_xx"
      },
      {
        order: 7,
        name: "КрестПересечение",
        synonym: "Крест пересечение",
        latin: "xt",
        "css": "tb_img_cnn_xt"
      },
      {
        order: 8,
        name: "Короткое",
        synonym: "Короткое",
        latin: "short",
        "css": "tb_img_cnn_short"
      },
      {
        order: 9,
        name: "Длинное",
        synonym: "Длинное",
        latin: "long",
        "css": "tb_img_cnn_long"
      },
      {
        tag: "Типы соединений",
        aliases: ['cnn_types'],
        id: 'ecn'
      }
    ],
    elmTypes: [
      {
        order: 0,
        name: "Рама",
        synonym: "Рама",
        latin: "rama"
      },
      {
        order: 1,
        name: "Створка",
        synonym: "Створка",
        latin: "flap"
      },
      {
        order: 2,
        name: "СтворкаБИ",
        synonym: "Створка безимпостная",
        latin: "flap0"
      },
      {
        order: 3,
        name: "Импост",
        synonym: "Импост",
        latin: "impost"
      },
      {
        order: 4,
        name: "Штульп",
        synonym: "Штульп",
        latin: "shtulp"
      },
      {
        order: 5,
        name: "Ряд",
        synonym: "Профиль ряда",
        latin: "region"
      },
      {
        order: 6,
        name: "Стекло",
        synonym: "Стекло - стеклопакет",
        latin: "glass"
      },
      {
        order: 7,
        name: "Заполнение",
        synonym: "Заполнение - сэндвич",
        latin: "sandwich"
      },
      {
        order: 8,
        name: "Раскладка",
        synonym: "Раскладка - фальшпереплет",
        latin: "layout"
      },
      {
        order: 9,
        name: "Текст",
        synonym: "Текст",
        latin: "text"
      },
      {
        order: 10,
        name: "Линия",
        synonym: "Линия",
        latin: "line",
        note: "Произвольная линия (путь)"
      },
      {
        order: 11,
        name: "Размер",
        synonym: "Размер",
        latin: "size",
        note: "Размерная линия"
      },
      {
        order: 12,
        name: "Радиус",
        synonym: "Радиус",
        latin: "radius",
        note: "Размерная линия радиуса"
      },
      {
        order: 13,
        name: "Угол",
        synonym: "Угол",
        latin: "angle",
        note: "Размерная линия угла"
      },
      {
        order: 14,
        name: "Сечение",
        synonym: "Сечение",
        latin: "cut"
      },
      {
        order: 15,
        name: "Добор",
        synonym: "Доборный проф.",
        latin: "addition"
      },
      {
        order: 16,
        name: "Штапик",
        synonym: "Штапик",
        latin: "glbead"
      },
      {
        order: 17,
        name: "Соединитель",
        synonym: "Соединит. профиль",
        latin: "linking"
      },
      {
        order: 18,
        name: "Связка",
        synonym: "Связка элементов",
        latin: "bundle"
      },
      {
        order: 19,
        name: "Разрыв",
        synonym: "Разрыв заполнения",
        latin: "tearing"
      },
      {
        order: 20,
        name: "Вложение",
        synonym: "Вирт. конт. вложения",
        latin: "attachment"
      },
      {
        order: 21,
        name: "Водоотлив",
        synonym: "Водоотлив",
        latin: "drainage"
      },
      {
        order: 22,
        name: "Москитка",
        synonym: "Москитн. сетка",
        latin: "mosquito"
      },
      {
        order: 23,
        name: "Примыкание",
        synonym: "Примыкание",
        latin: "adjoining"
      },
      {
        order: 24,
        name: "Фурнитура",
        synonym: "Фурнитура",
        latin: "furn"
      },
      {
        order: 25,
        name: "СоставнойПуть",
        synonym: "Составной путь",
        latin: "compound"
      },
      {
        order: 26,
        name: "Макрос",
        synonym: "Макрос обр центра",
        latin: "macro"
      },
      {
        order: 27,
        name: "Подоконник",
        synonym: "Подоконник",
        latin: "sill"
      },
      {
        order: 28,
        name: "ОшибкаКритическая",
        synonym: "Ошибка критическая",
        latin: "error"
      },
      {
        order: 29,
        name: "ОшибкаИнфо",
        synonym: "Ошибка инфо",
        latin: "info"
      },
      {
        order: 30,
        name: "Визуализация",
        synonym: "Визуализация",
        latin: "visualization"
      },
      {
        order: 31,
        name: "Прочее",
        synonym: "Прочее",
        latin: "other"
      },
      {
        order: 32,
        name: "Продукция",
        synonym: "Продукция",
        latin: "product"
      },
      {
        order: 33,
        name: "Доставка",
        synonym: "Доставка",
        latin: "delivery"
      },
      {
        order: 34,
        name: "РаботыЦеха",
        synonym: "Работы цеха",
        latin: "work"
      },
      {
        order: 35,
        name: "Монтаж",
        synonym: "Монтаж",
        latin: "mounting"
      },
      {
        order: 36,
        name: "Уплотнение",
        synonym: "Уплотнение",
        latin: "gasket"
      },
      {
        order: 37,
        name: "Арматура",
        synonym: "Армирование",
        latin: "reinforcement"
      },
      {
        order: 38,
        name: "Порог",
        synonym: "Порог",
        latin: "doorstep"
      },
      {
        order: 39,
        name: "Подставочник",
        synonym: "Подставочн. профиль"
      },
      {
        tag: "Типы элементов",
        description: "Определяют поведение элемента в графическом построителе. Не рекомендуется использовать для группировки номенклатур, т.к. один и тот же материал может выступать элементами разных типов",
        aliases: ['elm_types'],
        id: 'ee'
      }
    ],
    elmVisualization: [
      {
        order: 0,
        name: "inner",
        synonym: "Изнутри"
      },
      {
        order: 1,
        name: "outer",
        synonym: "Снаружи"
      },
      {
        order: 2,
        name: "inner1",
        synonym: "Изнутри штрих"
      },
      {
        order: 3,
        name: "outer1",
        synonym: "Снаружи штрих"
      },
      {
        "default": "inner"
      },
      {
        tag: "Вид визуализации",
        aliases: ['elm_visualization'],
        id: 'evz'
      }
    ],
    insertsTypes: [
      {
        order: 0,
        name: "Профиль",
        synonym: "Профиль",
        latin: "profile"
      },
      {
        order: 1,
        name: "Заполнение",
        synonym: "Заполнение",
        latin: "glass"
      },
      {
        order: 2,
        name: "Нарезка",
        synonym: "Профиль в нарезку",
        latin: "cut"
      },
      {
        order: 3,
        name: "Элемент",
        synonym: "Элемент",
        latin: "element"
      },
      {
        order: 4,
        name: "Изделие",
        synonym: "Изделие",
        latin: "product"
      },
      {
        order: 5,
        name: "Контур",
        synonym: "Контур",
        latin: "layer"
      },
      {
        order: 6,
        name: "Заказ",
        synonym: "Заказ",
        latin: "order"
      },
      {
        order: 7,
        name: "МоскитнаяСетка",
        synonym: "Москитная сетка",
        latin: "mosquito"
      },
      {
        order: 8,
        name: "Подоконник",
        synonym: "Подоконник",
        latin: "sill"
      },
      {
        order: 9,
        name: "Откос",
        synonym: "Откос",
        latin: "slope"
      },
      {
        order: 10,
        name: "Водоотлив",
        synonym: "Водоотлив",
        latin: "sectional"
      },
      {
        order: 11,
        name: "Жалюзи",
        synonym: "Жалюзи",
        latin: "jalousie"
      },
      {
        order: 12,
        name: "Монтаж",
        synonym: "Монтаж",
        latin: "mount"
      },
      {
        order: 13,
        name: "Доставка",
        synonym: "Доставка",
        latin: "delivery"
      },
      {
        order: 14,
        name: "Набор",
        synonym: "Набор",
        latin: "set"
      },
      {
        order: 15,
        name: "Параметрик",
        synonym: "Параметрик",
        latin: "parametric"
      },
      {
        order: 16,
        name: "ВнешнийПараметрик",
        synonym: "Внешнее API",
        latin: "external"
      },
      {
        order: 17,
        name: "Стеклопакет",
        synonym: "Стеклопакет составной",
        latin: "composite"
      },
      {
        order: 18,
        name: "Примыкание",
        synonym: "Примыкание",
        latin: "adjoining"
      },
      {
        order: 19,
        name: "Цвет",
        synonym: "Придание цвета",
        latin: "coloring"
      },
      {
        order: 20,
        name: "Упаковка",
        synonym: "Упаковка",
        latin: "packing"
      },
      {
        order: 21,
        name: "НеИспользовать",
        synonym: "Не использовать",
        latin: "not_use"
      },
      {
        tag: "Типы вставок",
        description: "Задаёт алгоритмы расчета и визуализации, используется для отбора в интерфейсе",
        aliases: ['inserts_types'],
        id: 'ei'
      }
    ],
    insertsGlassTypes: [
      {
        order: 0,
        name: "Заполнение",
        synonym: "Заполнение"
      },
      {
        order: 1,
        name: "Рамка",
        synonym: "Рамка"
      },
      {
        order: 2,
        name: "Газ",
        synonym: "Гель, газ"
      },
      {
        order: 3,
        name: "Пленка",
        synonym: "Пленка"
      },
      {
        order: 4,
        name: "СтеклоСПодогревом",
        synonym: "Стекло с подогревом"
      },
      {
        order: 5,
        name: "СтеклоЗакаленное",
        synonym: "Стекло закаленное"
      },
      {
        order: 6,
        name: "СтеклоЭнергоСб",
        synonym: "Стекло энергосберегающее"
      },
      {
        order: 7,
        name: "СтеклоЦветное",
        synonym: "Стекло цветное"
      },
      {
        order: 8,
        name: "Триплекс",
        synonym: "Триплекс"
      },
      {
        tag: "Типы вставок стеклопакета",
        description: "Состав заполнения",
        aliases: ['inserts_glass_types'],
        id: 'egi'
      }
    ],
    nomTypes: [
      {
        order: 0,
        name: "Товар",
        synonym: "Товар, материал",
        latin: "goods"
      },
      {
        order: 1,
        name: "Услуга",
        synonym: "Услуга",
        latin: "service"
      },
      {
        order: 2,
        name: "Работа",
        synonym: "Работа, техоперация",
        latin: "operation"
      },
      {
        default: "Товар"
      },
      {
        tag: "Типы номенклатуры",
        id: 'ent',
        aliases: ['nom_types']
      }
    ],
    objDeliveryStates: [
      {
        order: 0,
        name: "Черновик",
        synonym: "Черновик"
      },
      {
        order: 1,
        name: "Отправлен",
        synonym: "Отправлен"
      },
      {
        order: 2,
        name: "Проверяется",
        synonym: "Проверяется"
      },
      {
        order: 3,
        name: "Подтвержден",
        synonym: "Подтвержден"
      },
      {
        order: 4,
        name: "Отклонен",
        synonym: "Отклонен"
      },
      {
        order: 5,
        name: "Отозван",
        synonym: "Отозван"
      },
      {
        order: 6,
        name: "Архив",
        synonym: "Перенесён в архив"
      },
      {
        order: 7,
        name: "Шаблон",
        synonym: "Шаблон"
      },
      {
        tag: "Статусы отправки документа",
        description: "Статус отправки документа",
        aliases: ['obj_delivery_states'],
        id: 'eds'
      }
    ],
    offsetOptions: [
      {
        order: 0,
        name: "ОтНачалаСтороны",
        synonym: "От начала стороны"
      },
      {
        order: 1,
        name: "ОтКонцаСтороны",
        synonym: "От конца стороны"
      },
      {
        order: 2,
        name: "ОтСередины",
        synonym: "От середины"
      },
      {
        order: 3,
        name: "ОтРучки",
        synonym: "От ручки"
      },
      {
        order: 4,
        name: "РазмерПоФальцу",
        synonym: "Размер по фальцу"
      },
      {
        order: 5,
        name: "Формула",
        synonym: "Формула"
      },
      {
        tag: "Варианты смещений",
        id: 'eoo',
        description: "Для расчёта координат в {@link CatFurns|фурнитуре}",
        aliases: ['offset_options']
      }
    ],
    openDirections: [
      {
        order: 0,
        name: "Левое",
        synonym: "Левое",
        latin: "left"
      },
      {
        order: 1,
        name: "Правое",
        synonym: "Правое",
        latin: "right"
      },
      {
        order: 2,
        name: "Откидное",
        synonym: "Откидное",
        latin: "folding"
      },
      {
        order: 3,
        name: "ЛевоПраво",
        synonym: "В обе стороны",
        latin: "left_right"
      },
      {
        "default": "Правое"
      },
      {
        tag: "Направление открывания",
        description: "Направление открывания створки",
        aliases: ['open_directions'],
        id: 'eod'
      }
    ],
    pathKind: [
      {
        order: 0,
        name: "generatrix",
        synonym: "Образующая"
      },
      {
        order: 1,
        name: "inner",
        synonym: "Внутренний"
      },
      {
        order: 2,
        name: "outer",
        synonym: "Внешний"
      },
      {
        tag: "Вариант пути",
        id: 'epk',
        description: "Для визуализации элементов. Привязка к образующей, внутренней или внешней стороне",
        aliases: ['path_kind']
      }
    ],
    predefinedFormulas: [
      {
        order: 0,
        name: "cx_prm",
        synonym: "Характеристика по параметрам"
      },
      {
        order: 1,
        name: "cx_row",
        synonym: "Характеристика тек. строки"
      },
      {
        order: 2,
        name: "cx_clr",
        synonym: "Характеристика по цвету"
      },
      {
        order: 3,
        name: "gb_short",
        synonym: "Штапик короткий"
      },
      {
        order: 4,
        name: "gb_long",
        synonym: "Штапик длинный"
      },
      {
        order: 5,
        name: "nom_prm",
        synonym: "Номенклатура по параметру"
      },
      {
        order: 6,
        name: "clr_prm",
        synonym: "Цвет по параметру"
      },
      {
        order: 7,
        name: "clr_in",
        synonym: "Цвет как изнутри с дополнением"
      },
      {
        order: 8,
        name: "clr_out",
        synonym: "Цвет как снаружи с дополнением"
      },
      {
        order: 9,
        name: "w2",
        synonym: "Плюс ширина2"
      },
      {
        tag: "Встроенные формулы",
        aliases: ['predefined_formulas'],
        id: 'epf'
      }
    ],
    planDetailing: [
      {
        order: 0,
        name: "order",
        synonym: "Заказ"
      },
      {
        order: 1,
        name: "product",
        synonym: "Изделие"
      },
      {
        order: 2,
        name: "layer",
        synonym: "Контур"
      },
      {
        order: 3,
        name: "elm",
        synonym: "Элемент"
      },
      {
        order: 4,
        name: "region",
        synonym: "Ряд элемента"
      },
      {
        order: 5,
        name: "nearest",
        synonym: "Соседний элем или слой"
      },
      {
        order: 6,
        name: "parent",
        synonym: "Родительский элемент или слой"
      },
      {
        order: 7,
        name: "sub_elm",
        synonym: "Вложенный элемент"
      },
      {
        order: 8,
        name: "algorithm",
        synonym: "Алгоритм"
      },
      {
        order: 9,
        name: "layer_active",
        synonym: "Активн. створка"
      },
      {
        order: 10,
        name: "layer_passive",
        synonym: "Пассивн. створка"
      },
      {
        tag: "Детализация планирования",
        aliases: ['plan_detailing'],
        id: 'epd'
      }
    ],
    transferOperationsOptions: [
      {
        order: 0,
        name: "НетПереноса",
        synonym: "Нет переноса"
      },
      {
        order: 1,
        name: "НаПримыкающий",
        synonym: "На примыкающий"
      },
      {
        order: 2,
        name: "НаПримыкающийОтКонца",
        synonym: "На примыкающий от конца"
      },
      {
        order: 3,
        name: "ЧерезПримыкающий",
        synonym: "Через примыкающий"
      },
      {
        tag: "Варианты переноса операций",
        id: 'eto',
        description: "Для расчёта координат в {@link CatFurns|фурнитуре}",
        aliases: ['transfer_operations_options']
      }
    ],
  },
};
