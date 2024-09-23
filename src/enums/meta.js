
import {classes, exclude} from './classes';

export const meta = {
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
      css: "tb_img_cnn_ad"
    },
    {
      order: 1,
      name: "УгловоеКВертикальной",
      synonym: "Угловое к вертикальной",
      latin: "av",
      css: "tb_img_cnn_short"
    },
    {
      order: 2,
      name: "УгловоеКГоризонтальной",
      synonym: "Угловое к горизонтальной",
      latin: "ah",
      css: "tb_img_cnn_long"
    },
    {
      order: 3,
      name: "ТОбразное",
      synonym: "Т-образное",
      latin: "t",
      css: "tb_img_cnn_t"
    },
    {
      order: 4,
      name: "Наложение",
      synonym: "Наложение",
      latin: "ii",
      css: "tb_img_cnn_ii"
    },
    {
      order: 5,
      name: "НезамкнутыйКонтур",
      synonym: "Незамкнутый контур",
      latin: "i",
      css: "tb_img_cnn_i"
    },
    {
      order: 6,
      name: "КрестВСтык",
      synonym: "Крест в стык",
      latin: "xx",
      css: "tb_img_cnn_xx"
    },
    {
      order: 7,
      name: "КрестПересечение",
      synonym: "Крест пересечение",
      latin: "xt",
      css: "tb_img_cnn_xt"
    },
    {
      order: 8,
      name: "Короткое",
      synonym: "Короткое",
      latin: "short",
      css: "tb_img_cnn_short"
    },
    {
      order: 9,
      name: "Длинное",
      synonym: "Длинное",
      latin: "long",
      css: "tb_img_cnn_long"
    },
    {
      order: 10,
      name: "Разрыв0",
      synonym: "Разрыв симметричный",
      latin: "cut0",
      css: "tb_img_cnn_cut0",
      css90: "tb_img_cnn_cut0_90",
      css180: "tb_img_cnn_cut0_180",
      css270: "tb_img_cnn_cut0_270",
    },
    {
      order: 11,
      name: "Т2",
      synonym: "Т с двух сторон",
      latin: "tt",
      css: "tb_img_cnn_tt",
      css90: "tb_img_cnn_tt_90"
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
      latin: "tearing",
      note: "Профиль разрыва заполнения"
    },
    {
      order: 20,
      name: "Проем",
      synonym: "Проем",
      latin: "portal",
      note: "Профиль проёма"
    },
    {
      order: 21,
      name: "Вложение",
      synonym: "Вирт. конт. вложения",
      latin: "attachment"
    },
    {
      order: 22,
      name: "Водоотлив",
      synonym: "Водоотлив",
      latin: "drainage"
    },
    {
      order: 23,
      name: "Москитка",
      synonym: "Москитн. сетка",
      latin: "mosquito"
    },
    {
      order: 24,
      name: "Примыкание",
      synonym: "Примыкание",
      latin: "adjoining"
    },
    {
      order: 25,
      name: "Перекрытие",
      synonym: "Перекрытие",
      latin: "floor"
    },
    {
      order: 26,
      name: "Фурнитура",
      synonym: "Фурнитура",
      latin: "furn"
    },
    {
      order: 27,
      name: "СоставнойПуть",
      synonym: "Составной путь",
      latin: "compound"
    },
    {
      order: 28,
      name: "Макрос",
      synonym: "Макрос обр центра",
      latin: "macro"
    },
    {
      order: 29,
      name: "Подоконник",
      synonym: "Подоконник",
      latin: "sill"
    },
    {
      order: 30,
      name: "ОшибкаКритическая",
      synonym: "Ошибка критическая",
      latin: "error"
    },
    {
      order: 31,
      name: "ОшибкаИнфо",
      synonym: "Ошибка инфо",
      latin: "info"
    },
    {
      order: 32,
      name: "Визуализация",
      synonym: "Визуализация",
      latin: "visualization"
    },
    {
      order: 33,
      name: "Прочее",
      synonym: "Прочее",
      latin: "other"
    },
    {
      order: 34,
      name: "Продукция",
      synonym: "Продукция",
      latin: "product"
    },
    {
      order: 35,
      name: "Доставка",
      synonym: "Доставка",
      latin: "delivery"
    },
    {
      order: 36,
      name: "РаботыЦеха",
      synonym: "Работы цеха",
      latin: "work"
    },
    {
      order: 37,
      name: "Монтаж",
      synonym: "Монтаж",
      latin: "mounting"
    },
    {
      order: 38,
      name: "Уплотнение",
      synonym: "Уплотнение",
      latin: "gasket"
    },
    {
      order: 39,
      name: "Арматура",
      synonym: "Армирование",
      latin: "reinforcement"
    },
    {
      order: 40,
      name: "Порог",
      synonym: "Порог",
      latin: "doorstep"
    },
    {
      order: 41,
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
  insetAttrsOptions: [
    {
      order: 0,
      name: "НеПоперечина",
      synonym: "Не поперечина"
    },
    {
      order: 1,
      name: "ОбаНаправления",
      synonym: "Оба направления"
    },
    {
      order: 2,
      name: "ОтключитьВтороеНаправление",
      synonym: "Отключить второе направление"
    },
    {
      order: 3,
      name: "ОтключитьШагиВторогоНаправления",
      synonym: "Отключить шаги второго направления"
    },
    {
      order: 4,
      name: "ОтключитьПервоеНаправление",
      synonym: "Отключить первое направление"
    },
    {
      order: 5,
      name: "ОтключитьШагиПервогоНаправления",
      synonym: "Отключить шаги первого направления"
    },
    {
      tag: "Варианты атрибутов вставок",
      id: 'eia',
      description: "Используется для расчёта спецификации вставки \"по шагам\"",
      aliases: ['inset_attrs_options']
    }
  ],
  applicationModeKinds: [
    {
      order: 0,
      name: "Минимум",
      synonym: "Минимум"
    },
    {
      order: 1,
      name: "Максимум",
      synonym: "Максимум"
    },
    {
      order: 2,
      name: "Сложение",
      synonym: "Сложение"
    },
    {
      order: 3,
      name: "Умножение",
      synonym: "Умножение"
    },
    {
      order: 4,
      name: "Вытеснение",
      synonym: "Вытеснение"
    },
    {
      tag: "Варианты совместного применения скидок наценок",
      id: 'eaa',
      aliases: ['application_mode_kinds']
    }
  ],
  contractionOptions: [
    {
      order: 0,
      name: "ОтДлиныСтороны",
      synonym: "От длины стороны"
    },
    {
      order: 1,
      name: "ОтВысотыРучки",
      synonym: "От высоты ручки"
    },
    {
      order: 2,
      name: "ОтДлиныСтороныМинусВысотыРучки",
      synonym: "От длины стороны минус высота ручки"
    },
    {
      order: 3,
      name: "ФиксированнаяДлина",
      synonym: "Фиксированная длина"
    },
    {
      order: 4,
      name: "Выражение",
      synonym: "Выражение"
    },
    {
      tag: "Варианты укорочений",
      id: 'esv',
      description: "Для расчёта координат в {@link CatFurns|фурнитуре}",
      aliases: ['contraction_options']
    }
  ],
  sketchView: [
    {
      order: 0,
      name: "hinge",
      synonym: "Со стороны петель"
    },
    {
      order: 1,
      name: "inner",
      synonym: "Изнутри"
    },
    {
      order: 2,
      name: "outer",
      synonym: "Снаружи"
    },
    {
      order: 3,
      name: "out_hinge",
      synonym: "Обратный от петель"
    },
    {
      "default": "hinge"
    },
    {
      tag: "Вид на эскиз",
      id: 'evv',
      aliases: ['sketch_view']
    }
  ],
  textAligns: [
    {
      order: 0,
      name: "left",
      synonym: "Лево"
    },
    {
      order: 1,
      name: "right",
      synonym: "Право"
    },
    {
      order: 2,
      name: "center",
      synonym: "Центр"
    },
    {
      tag: "Выравнивание текста",
      id: 'eta',
      aliases: ['text_aligns']
    }
  ],
  orderCategories: [
    {
      order: 0,
      name: "order",
      synonym: "Расчет заказ"
    },
    {
      order: 1,
      name: "service",
      synonym: "Сервис"
    },
    {
      order: 2,
      name: "complaints",
      synonym: "Рекламация"
    },
    {
      order: 3,
      name: "variant",
      synonym: "Вариант КП"
    },
    {
      tag: "Категории заказов",
      id: 'eok',
      aliases: ['order_categories']
    }
  ],
  colorPriceGroupDestinations: [
    {
      order: 0,
      name: "ДляЦенообразования",
      synonym: "Для ценообразования"
    },
    {
      order: 1,
      name: "ДляХарактеристик",
      synonym: "Для характеристик"
    },
    {
      order: 2,
      name: "ДляГруппировкиВПараметрах",
      synonym: "Для группировки в параметрах"
    },
    {
      order: 3,
      name: "ДляОграниченияДоступности",
      synonym: "Для ограничения доступности"
    },
    {
      tag: "Назначения цветовых групп",
      id: 'ecd',
      aliases: ['color_price_group_destinations']
    }
  ],
  orientations: [
    {
      order: 0,
      name: "Горизонтальная",
      synonym: "Горизонтальная",
      latin: "hor"
    },
    {
      order: 1,
      name: "Вертикальная",
      synonym: "Вертикальная",
      latin: "vert"
    },
    {
      order: 2,
      name: "Наклонная",
      synonym: "Наклонная",
      latin: "incline"
    },
    {
      tag: "Ориентация элемента",
      id: 'eoi',
    }
  ],
  opening: [
    {
      order: 0,
      name: "in",
      synonym: "На себя"
    },
    {
      order: 1,
      name: "out",
      synonym: "От себя"
    },
    {
      "default": "in"
    },
    {
      tag: "Открывание",
      description: "Вовнутрь или наружу",
      id: 'eop',
    }
  ],
  positions: [
    {
      order: 0,
      name: "Любое",
      synonym: "Любое",
      latin: "any"
    },
    {
      order: 1,
      name: "Верх",
      synonym: "Верх",
      latin: "top"
    },
    {
      order: 2,
      name: "Низ",
      synonym: "Низ",
      latin: "bottom"
    },
    {
      order: 3,
      name: "Лев",
      synonym: "Лев",
      latin: "left"
    },
    {
      order: 4,
      name: "Прав",
      synonym: "Прав",
      latin: "right"
    },
    {
      order: 5,
      name: "ЦентрВертикаль",
      synonym: "Центр вертикаль",
      latin: "vert"
    },
    {
      order: 6,
      name: "ЦентрГоризонталь",
      synonym: "Центр горизонталь",
      latin: "hor"
    },
    {
      order: 7,
      name: "Центр",
      synonym: "Центр",
      latin: "center"
    },
    {
      order: 8,
      name: "ЛевВерх",
      synonym: "Лев верх",
      latin: "lt"
    },
    {
      order: 9,
      name: "ЛевНиз",
      synonym: "Лев низ",
      latin: "lb"
    },
    {
      order: 10,
      name: "ПравВерх",
      synonym: "Прав верх",
      latin: "rt"
    },
    {
      order: 11,
      name: "ПравНиз",
      synonym: "Прав низ",
      latin: "rb"
    },
    {
      tag: "Положение элемента",
      description: "Используется для назначения {@link CatInserts|Вставки} в {@link CatProduction_params|Системе}",
      id: 'eep'
    }
  ],
  parametersKeysApplying: [
    {
      order: 0,
      name: "НаправлениеДоставки",
      synonym: "Направление доставки"
    },
    {
      order: 1,
      name: "РабочийЦентр",
      synonym: "Рабочий центр"
    },
    {
      order: 2,
      name: "Технология",
      synonym: "Технология"
    },
    {
      order: 3,
      name: "Ценообразование",
      synonym: "Ценообразование"
    },
    {
      order: 4,
      name: "ПараметрВыбора",
      synonym: "Параметр выбора"
    },
    {
      tag: "Применения ключей параметров",
      id: 'epa',
      aliases: ['parameters_keys_applying']
    }
  ],
  bindCoordinates: [
    {
      order: 0,
      name: "product",
      synonym: "Изделие"
    },
    {
      order: 1,
      name: "contour",
      synonym: "Слой"
    },
    {
      order: 2,
      name: "b",
      synonym: "Начало пути"
    },
    {
      order: 3,
      name: "e",
      synonym: "Конец пути"
    },
    {
      tag: "Приязка координат",
      id: 'ebc',
      aliases: ['bind_coordinates']
    }
  ],
  layRegions: [
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
      name: "all",
      synonym: "С двух стор"
    },
    {
      order: 3,
      name: "r1",
      synonym: "Кам 1"
    },
    {
      order: 4,
      name: "r2",
      synonym: "Кам 2"
    },
    {
      order: 5,
      name: "r3",
      synonym: "Кам 3"
    },
    {
      tag: "Слои раскладки",
      id: 'elr',
      aliases: ['lay_regions']
    }
  ],
  coloring: [
    {
      order: 0,
      name: "lam",
      synonym: "Ламинация"
    },
    {
      order: 1,
      name: "coloring",
      synonym: "Покраска"
    },
    {
      order: 2,
      name: "subl",
      synonym: "Сублимация"
    },
    {
      tag: "Способ придания цвета",
      id: 'ecv',
    }
  ],
  countCalculatingWays: [
    {
      order: 0,
      name: "ПоПериметру",
      synonym: "По периметру",
      latin: "perim"
    },
    {
      order: 1,
      name: "ПоПлощади",
      synonym: "По площади",
      latin: "area"
    },
    {
      order: 2,
      name: "ДляЭлемента",
      synonym: "Для элемента",
      latin: "element"
    },
    {
      order: 3,
      name: "ПоШагам",
      synonym: "По шагам",
      latin: "steps"
    },
    {
      order: 4,
      name: "ПоФормуле",
      synonym: "По формуле",
      latin: "formulas"
    },
    {
      order: 5,
      name: "ПоПарам",
      synonym: "По параметру",
      latin: "parameters"
    },
    {
      order: 6,
      name: "ДлинаПоПарам",
      synonym: "Длина по параметру",
      latin: "len_prm"
    },
    {
      order: 7,
      name: "ГабаритыПоПарам",
      synonym: "Габариты по параметрам",
      latin: "dimensions"
    },
    {
      order: 8,
      name: "ПоСоединениям",
      synonym: "По соединениям",
      latin: "cnns",
      note: "Поправки размеров из концевых соединений"
    },
    {
      order: 9,
      name: "ПоЗаполнениям",
      synonym: "По заполнениям",
      latin: "fillings",
      note: "Для всех заполнений контура"
    },
    {
      order: 10,
      name: "ПоЦвету",
      synonym: "По цвету",
      latin: "coloring",
      note: "С учётом группы цвета и площадей изнутри-снаружи"
    },
    {
      tag: "Способы расчета количества",
      id: 'ecc',
      aliases: ['count_calculating_ways']
    }
  ],
  angleCalculatingWays: [
    {
      order: 0,
      name: "Основной",
      synonym: "Основной"
    },
    {
      order: 1,
      name: "СварнойШов",
      synonym: "Сварной шов"
    },
    {
      order: 2,
      name: "СоединениеПополам",
      synonym: "Соед./2"
    },
    {
      order: 3,
      name: "Соединение",
      synonym: "Соединение"
    },
    {
      order: 4,
      name: "_90",
      synonym: "90"
    },
    {
      order: 5,
      name: "НеСчитать",
      synonym: "Не считать"
    },
    {
      tag: "Способы расчета угла",
      id: 'eac',
      aliases: ['angle_calculating_ways']
    }
  ],
  specInstallationMethods: [
    {
      order: 0,
      name: "Всегда",
      synonym: "Всегда"
    },
    {
      order: 1,
      name: "САртикулом1",
      synonym: "с Арт1"
    },
    {
      order: 2,
      name: "САртикулом2",
      synonym: "с Арт2"
    },
    {
      tag: "Способы установки спецификации",
      id: 'eim',
      aliases: ['specification_installation_methods']
    }
  ],
  cnnSides: [
    {
      order: 0,
      name: "Изнутри",
      synonym: "Изнутри",
      latin: "inner"
    },
    {
      order: 1,
      name: "Снаружи",
      synonym: "Снаружи",
      latin: "outer"
    },
    {
      order: 2,
      name: "Любая",
      synonym: "Любая",
      latin: "any"
    },
    {
      "default": "Любая"
    },
    {
      tag: "Стороны соединений",
      description: "Актуально для импостов и витражных элементов",
      id: 'ecs',
      aliases: ['cnn_sides']
    }
  ],
  laySplitTypes: [
    {
      order: 0,
      name: "ДелениеГоризонтальных",
      synonym: "Деление горизонтальных",
      latin: "hor"
    },
    {
      order: 1,
      name: "ДелениеВертикальных",
      synonym: "Деление вертикальных",
      latin: "vert"
    },
    {
      order: 2,
      name: "КрестВСтык",
      synonym: "Крест в стык",
      latin: "cross_butt"
    },
    {
      order: 3,
      name: "КрестПересечение",
      synonym: "Крест пересечение",
      latin: "crossing"
    },
    {
      order: 4,
      name: "ЗапретДеления",
      synonym: "Запрет деления",
      latin: "disabled"
    },
    {
      tag: "Типы деления раскладки",
      description: "Тип параметра для команды \"добавить раскладку\"",
      id: 'els',
      aliases: ['lay_split_types']
    }
  ],
  cutOptimizationTypes: [
    {
      order: 0,
      name: "Нет",
      synonym: "Нет",
      latin: "no"
    },
    {
      order: 1,
      name: "РасчетНарезки",
      synonym: "Расчет нарезки",
      latin: "cut"
    },
    {
      order: 2,
      name: "НельзяВращатьПереворачивать",
      synonym: "Нельзя вращать переворачивать",
      latin: "no_rotate"
    },
    {
      order: 3,
      name: "ТолькоНомераЯчеек",
      synonym: "Только номера ячеек",
      latin: "cell"
    },
    {
      "default": "Нет"
    },
    {
      tag: "Типы оптимизаций раскроя",
      id: 'ec',
      aliases: ['cutting_optimization_types']
    }
  ],
  openTypes: [
    {
      order: 0,
      name: "Глухое",
      synonym: "Глухое",
      latin: "no"
    },
    {
      order: 1,
      name: "Поворотное",
      synonym: "Поворотное",
      latin: "rotary"
    },
    {
      order: 2,
      name: "Откидное",
      synonym: "Откидное",
      latin: "folding"
    },
    {
      order: 3,
      name: "ПоворотноОткидное",
      synonym: "Поворотно-откидное",
      latin: "rotary_folding"
    },
    {
      order: 4,
      name: "Раздвижное",
      synonym: "Раздвижное",
      latin: "sliding"
    },
    {
      order: 5,
      name: "Неподвижное",
      synonym: "Неподвижное",
      latin: "static"
    },
    {
      order: 6,
      name: "ПодъемноСдвижное",
      synonym: "Подъемно сдвижное",
      latin: "up_sliding"
    },
    {
      tag: "Типы открывания",
      id: 'eo',
      aliases: ['open_types']
    }
  ],
  specOrderRowTypes: [
    {
      order: 0,
      name: "Нет",
      synonym: "Нет",
      latin: "no"
    },
    {
      order: 1,
      name: "Материал",
      synonym: "Материал",
      latin: "material"
    },
    {
      order: 2,
      name: "Продукция",
      synonym: "Продукция",
      latin: "prod"
    },
    {
      order: 3,
      name: "Комплектация",
      synonym: "Комплектация",
      latin: "kit"
    },
    {
      order: 4,
      name: "ТекИзделие",
      synonym: "Текущее изделие",
      latin: "current"
    },
    {
      order: 5,
      name: "Контур",
      synonym: "Контур",
      latin: "layer"
    },
    {
      order: 6,
      name: "Соседний",
      synonym: "Соседний элем или слой",
      latin: "nearest"
    },
    {
      tag: "Типы строк в заказ",
      description: "Способ вытягивания строки спецификации в заказ либо привязка к элементу или слою",
      id: 'eol',
      aliases: ['specification_order_row_types']
    }
  ],
};

export {classes, exclude};
