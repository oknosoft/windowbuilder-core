
/**
 * @summary Значение перечисления {@link EnmAccumulation_record_typeManager|Вид движения регистра накопления}
 * @desc Системное перечисление
 * @class EnmAccumulation_record_type
 * @see EnmAccumulation_record_typeManager
 */

/**
 * @summary Менеджер перечисления _Вид движения регистра накопления_ 
 * @desc Системное перечисление
 * @class
 * @extends metadata.EnumManager
 * @prop debit {EnmAccumulation_record_type} - Приход
 * @prop credit {EnmAccumulation_record_type} - Расход
 */
class EnmAccumulation_record_typeManager {}

/**
 * @summary Значение перечисления {@link EnmSort_directionsManager|Направление сортировки}
 * @desc Для компоновки
 * @class EnmSort_directions
 * @see EnmSort_directionsManager
 */

/**
 * @summary Менеджер перечисления _Направление сортировки_ 
 * @desc Для компоновки
 * @class
 * @extends metadata.EnumManager
 * @prop asc {EnmSort_directions} - По возрастанию
 * @prop desc {EnmSort_directions} - По убыванию
 */
class EnmSort_directionsManager {}

/**
 * @summary Значение перечисления {@link EnmComparison_typesManager|Виды сравнений}
 * @desc Системное перечисление
 * @class EnmComparison_types
 * @see EnmComparison_typesManager
 */

/**
 * @summary Менеджер перечисления _Виды сравнений_ 
 * @desc Системное перечисление
 * @class
 * @extends metadata.EnumManager
 * @prop gt {EnmComparison_types} - Больше
 * @prop gte {EnmComparison_types} - Больше или равно
 * @prop lt {EnmComparison_types} - Меньше
 * @prop lte {EnmComparison_types} - Меньше или равно 
 * @prop eq {EnmComparison_types} - Равно
 * @prop ne {EnmComparison_types} - Не равно
 * @prop in {EnmComparison_types} - В списке
 * @prop nin {EnmComparison_types} - Не в списке
 * @prop inh {EnmComparison_types} - В группе
 * @prop ninh {EnmComparison_types} - Не в группе
 * @prop lke {EnmComparison_types} - Содержит 
 * @prop nlk {EnmComparison_types} - Не содержит
 * @prop filled {EnmComparison_types} - Заполнено 
 * @prop nfilled {EnmComparison_types} - Не заполнено
 */
class EnmComparison_typesManager {}

/**
 * @summary Значение перечисления {@link EnmLabel_positionsManager|Положение заголовка элемеента управления}
 * @desc Системное перечисление
 * @class EnmLabel_positions
 * @see EnmLabel_positionsManager
 */

/**
 * @summary Менеджер перечисления _Положение заголовка элемеента управления_ 
 * @desc Системное перечисление
 * @class
 * @extends metadata.EnumManager
 * @prop inherit {EnmLabel_positions} - Наследовать
 * @prop hide {EnmLabel_positions} - Скрыть
 * @prop left {EnmLabel_positions} - Лево
 * @prop right {EnmLabel_positions} - Право
 * @prop top {EnmLabel_positions} - Верх
 * @prop bottom {EnmLabel_positions} - Низ
 */
class EnmLabel_positionsManager {}

/**
 * @summary Значение перечисления {@link EnmData_field_kindsManager|Типы полей ввода данных}
 * @desc Системное перечисление
 * @class EnmData_field_kinds
 * @see EnmData_field_kindsManager
 */

/**
 * @summary Менеджер перечисления _Типы полей ввода данных_ 
 * @desc Системное перечисление
 * @class
 * @extends metadata.EnumManager
 * @prop field {EnmData_field_kinds} - Поле ввода
 * @prop input {EnmData_field_kinds} - Простой текст
 * @prop text {EnmData_field_kinds} - Многострочный текст
 * @prop label {EnmData_field_kinds} - Надпись
 * @prop link {EnmData_field_kinds} - Гиперссылка
 * @prop cascader {EnmData_field_kinds} - Каскадер
 * @prop toggle {EnmData_field_kinds} - Переключатель
 * @prop image {EnmData_field_kinds} - Картинка
 * @prop type {EnmData_field_kinds} - Тип значения
 * @prop path {EnmData_field_kinds} - Путь к данным
 * @prop typed_field {EnmData_field_kinds} - Поле связи по типу
 * @prop props {EnmData_field_kinds} - Свойства объекта
 * @prop star {EnmData_field_kinds} - Пометка
 */
class EnmData_field_kindsManager {}

/**
 * @summary Значение перечисления {@link EnmStandard_periodManager|Стандартный период}
 * @desc Для компоновки
 * @class EnmStandard_period
 * @see EnmStandard_periodManager
 */

/**
 * @summary Менеджер перечисления _Стандартный период_ 
 * @desc Для компоновки
 * @class
 * @extends metadata.EnumManager
 * @prop custom {EnmStandard_period} - Произвольный
 * @prop yesterday {EnmStandard_period} - Вчера
 * @prop today {EnmStandard_period} - Сегодня
 * @prop tomorrow {EnmStandard_period} - Завтра
 * @prop last7days {EnmStandard_period} - Последние 7 дней
 * @prop last30days {EnmStandard_period} - Последние 30 дней
 * @prop last3Month {EnmStandard_period} - Последние 3 месяца
 * @prop last6Month {EnmStandard_period} - Последние 6 месяцев
 * @prop lastWeek {EnmStandard_period} - Прошлая неделя
 * @prop lastTendays {EnmStandard_period} - Прошлая декада
 * @prop lastMonth {EnmStandard_period} - Прошлый месяц
 * @prop lastQuarter {EnmStandard_period} - Прошлый квартал
 * @prop lastHalfYear {EnmStandard_period} - Прошлое полугодие
 * @prop lastYear {EnmStandard_period} - Прошлый год
 * @prop next7Days {EnmStandard_period} - Следующие 7 дней
 * @prop nextTendays {EnmStandard_period} - Следующая декада
 * @prop nextWeek {EnmStandard_period} - Следующая неделя
 * @prop nextMonth {EnmStandard_period} - Следующий месяц
 * @prop nextQuarter {EnmStandard_period} - Следующий квартал
 * @prop nextHalfYear {EnmStandard_period} - Следующее полугодие
 * @prop nextYear {EnmStandard_period} - Следующий год
 * @prop tillEndOfThisYear {EnmStandard_period} - До конца этого года
 * @prop tillEndOfThisQuarter {EnmStandard_period} - До конца этого квартала
 * @prop tillEndOfThisMonth {EnmStandard_period} - До конца этого месяца
 * @prop tillEndOfThisHalfYear {EnmStandard_period} - До конца этого полугодия
 * @prop tillEndOfThistendays {EnmStandard_period} - До конца этой декады
 * @prop tillEndOfThisweek {EnmStandard_period} - До конца этой недели
 * @prop fromBeginningOfThisYear {EnmStandard_period} - С начала этого года
 * @prop fromBeginningOfThisQuarter {EnmStandard_period} - С начала этого квартала
 * @prop fromBeginningOfThisMonth {EnmStandard_period} - С начала этого месяца
 * @prop fromBeginningOfThisHalfYear {EnmStandard_period} - С начала этого полугодия
 * @prop fromBeginningOfThisTendays {EnmStandard_period} - С начала этой декады
 * @prop fromBeginningOfThisWeek {EnmStandard_period} - С начала этой недели
 * @prop thisTenDays {EnmStandard_period} - Эта декада
 * @prop thisWeek {EnmStandard_period} - Эта неделя
 * @prop thisHalfYear {EnmStandard_period} - Это полугодие
 * @prop thisYear {EnmStandard_period} - Этот год
 * @prop thisQuarter {EnmStandard_period} - Этот квартал
 * @prop thisMonth {EnmStandard_period} - Этот месяц
 */
class EnmStandard_periodManager {}

/**
 * @summary Значение перечисления {@link EnmQuick_accessManager|Расположение элемента быстрого доступа}
 * @desc Для компоновки
 * @class EnmQuick_access
 * @see EnmQuick_accessManager
 */

/**
 * @summary Менеджер перечисления _Расположение элемента быстрого доступа_ 
 * @desc Для компоновки
 * @class
 * @extends metadata.EnumManager
 * @prop none {EnmQuick_access} - Нет
 * @prop toolbar {EnmQuick_access} - Панель инструментов
 * @prop drawer {EnmQuick_access} - Панель формы
 */
class EnmQuick_accessManager {}

/**
 * @summary Значение перечисления {@link EnmReport_outputManager|Варианты вывода отчёта}
 * @desc Для компоновки
 * @class EnmReport_output
 * @see EnmReport_outputManager
 */

/**
 * @summary Менеджер перечисления _Варианты вывода отчёта_ 
 * @desc Для компоновки
 * @class
 * @extends metadata.EnumManager
 * @prop grid {EnmReport_output} - Таблица
 * @prop chart {EnmReport_output} - Диаграмма
 * @prop pivot {EnmReport_output} - Cводная таблица
 * @prop html {EnmReport_output} - Документ HTML
 */
class EnmReport_outputManager {}

/**
 * @summary Значение перечисления {@link EnmPath_kindManager|Вариант пути}
 * @desc Для визуализации элементов. Привязка к образующей, внутренней или внешней стороне
 * @class EnmPath_kind
 * @see EnmPath_kindManager
 */

/**
 * @summary Менеджер перечисления _Вариант пути_ 
 * @desc Для визуализации элементов. Привязка к образующей, внутренней или внешней стороне
 * @class
 * @extends metadata.EnumManager
 * @prop generatrix {EnmPath_kind} - Образующая
 * @prop inner {EnmPath_kind} - Внутренний
 * @prop outer {EnmPath_kind} - Внешний
 */
class EnmPath_kindManager {}

/**
 * @summary Значение перечисления {@link EnmInset_attrs_optionsManager|Варианты атрибутов вставок}
 * @desc Используется для расчёта спецификации вставки "по шагам"
 * @class EnmInset_attrs_options
 * @see EnmInset_attrs_optionsManager
 */

/**
 * @summary Менеджер перечисления _Варианты атрибутов вставок_ 
 * @desc Используется для расчёта спецификации вставки "по шагам"
 * @class
 * @extends metadata.EnumManager
 * @prop НеПоперечина {EnmInset_attrs_options} - Не поперечина
 * @prop ОбаНаправления {EnmInset_attrs_options} - Оба направления
 * @prop ОтключитьВтороеНаправление {EnmInset_attrs_options} - Отключить второе направление
 * @prop ОтключитьШагиВторогоНаправления {EnmInset_attrs_options} - Отключить шаги второго направления
 * @prop ОтключитьПервоеНаправление {EnmInset_attrs_options} - Отключить первое направление
 * @prop ОтключитьШагиПервогоНаправления {EnmInset_attrs_options} - Отключить шаги первого направления
 */
class EnmInset_attrs_optionsManager {}

/**
 * @summary Значение перечисления {@link EnmTransfer_operations_optionsManager|Варианты переноса операций}
 * @desc Для расчёта координат в {@link CatFurns|фурнитуре}
 * @class EnmTransfer_operations_options
 * @see EnmTransfer_operations_optionsManager
 */

/**
 * @summary Менеджер перечисления _Варианты переноса операций_ 
 * @desc Для расчёта координат в {@link CatFurns|фурнитуре}
 * @class
 * @extends metadata.EnumManager
 * @prop НетПереноса {EnmTransfer_operations_options} - Нет переноса
 * @prop НаПримыкающий {EnmTransfer_operations_options} - На примыкающий
 * @prop НаПримыкающийОтКонца {EnmTransfer_operations_options} - На примыкающий от конца
 * @prop ЧерезПримыкающий {EnmTransfer_operations_options} - Через примыкающий
 */
class EnmTransfer_operations_optionsManager {}

/**
 * @summary Значение перечисления {@link EnmOffset_optionsManager|Варианты смещений}
 * @desc Для расчёта координат в {@link CatFurns|фурнитуре}
 * @class EnmOffset_options
 * @see EnmOffset_optionsManager
 */

/**
 * @summary Менеджер перечисления _Варианты смещений_ 
 * @desc Для расчёта координат в {@link CatFurns|фурнитуре}
 * @class
 * @extends metadata.EnumManager
 * @prop ОтНачалаСтороны {EnmOffset_options} - От начала стороны
 * @prop ОтКонцаСтороны {EnmOffset_options} - От конца стороны
 * @prop ОтСередины {EnmOffset_options} - От середины
 * @prop ОтРучки {EnmOffset_options} - От ручки
 * @prop РазмерПоФальцу {EnmOffset_options} - Размер по фальцу
 * @prop Формула {EnmOffset_options} - Формула
 */
class EnmOffset_optionsManager {}

/**
 * @summary Значение перечисления {@link EnmApplication_mode_kindsManager|Варианты совместного применения скидок наценок}
 * @class EnmApplication_mode_kinds
 * @see EnmApplication_mode_kindsManager
 */

/**
 * @summary Менеджер перечисления _Варианты совместного применения скидок наценок_ 
 * @class
 * @extends metadata.EnumManager
 * @prop Минимум {EnmApplication_mode_kinds} - Минимум
 * @prop Максимум {EnmApplication_mode_kinds} - Максимум
 * @prop Сложение {EnmApplication_mode_kinds} - Сложение
 * @prop Умножение {EnmApplication_mode_kinds} - Умножение
 * @prop Вытеснение {EnmApplication_mode_kinds} - Вытеснение
 */
class EnmApplication_mode_kindsManager {}

/**
 * @summary Значение перечисления {@link EnmContraction_optionsManager|Варианты укорочений}
 * @desc Для расчёта координат в {@link CatFurns|фурнитуре}
 * @class EnmContraction_options
 * @see EnmContraction_optionsManager
 */

/**
 * @summary Менеджер перечисления _Варианты укорочений_ 
 * @desc Для расчёта координат в {@link CatFurns|фурнитуре}
 * @class
 * @extends metadata.EnumManager
 * @prop ОтДлиныСтороны {EnmContraction_options} - От длины стороны
 * @prop ОтВысотыРучки {EnmContraction_options} - От высоты ручки
 * @prop ОтДлиныСтороныМинусВысотыРучки {EnmContraction_options} - От длины стороны минус высота ручки
 * @prop ФиксированнаяДлина {EnmContraction_options} - Фиксированная длина
 * @prop Выражение {EnmContraction_options} - Выражение
 */
class EnmContraction_optionsManager {}

/**
 * @summary Значение перечисления {@link EnmAlign_typesManager|Варианты уравнивания}
 * @desc Для команды графического редактора "Уравнять"
 * @class EnmAlign_types
 * @see EnmAlign_typesManager
 */

/**
 * @summary Менеджер перечисления _Варианты уравнивания_ 
 * @desc Для команды графического редактора "Уравнять"
 * @class
 * @extends metadata.EnumManager
 * @prop Геометрически {EnmAlign_types} - Геометрически
 * @prop ПоЗаполнениям {EnmAlign_types} - По заполнениям
 */
class EnmAlign_typesManager {}

/**
 * @summary Значение перечисления {@link EnmMutual_contract_settlementsManager|Ведение взаиморасчетов по договорам}
 * @class EnmMutual_contract_settlements
 * @see EnmMutual_contract_settlementsManager
 */

/**
 * @summary Менеджер перечисления _Ведение взаиморасчетов по договорам_ 
 * @class
 * @extends metadata.EnumManager
 * @prop ПоДоговоруВЦелом {EnmMutual_contract_settlements} - По договору в целом
 * @prop ПоЗаказам {EnmMutual_contract_settlements} - По заказам
 * @prop ПоСчетам {EnmMutual_contract_settlements} - По счетам
 */
class EnmMutual_contract_settlementsManager {}

/**
 * @summary Значение перечисления {@link EnmSketch_viewManager|Вид на эскиз}
 * @class EnmSketch_view
 * @see EnmSketch_viewManager
 */

/**
 * @summary Менеджер перечисления _Вид на эскиз_ 
 * @class
 * @extends metadata.EnumManager
 * @prop hinge {EnmSketch_view} - Со стороны петель
 * @prop inner {EnmSketch_view} - Изнутри
 * @prop outer {EnmSketch_view} - Снаружи
 * @prop out_hinge {EnmSketch_view} - Обратный от петель
 */
class EnmSketch_viewManager {}

/**
 * @summary Значение перечисления {@link EnmDebit_credit_kindsManager|Виды движений приход/расход}
 * @class EnmDebit_credit_kinds
 * @see EnmDebit_credit_kindsManager
 */

/**
 * @summary Менеджер перечисления _Виды движений приход/расход_ 
 * @class
 * @extends metadata.EnumManager
 * @prop Приход {EnmDebit_credit_kinds} - Приход
 * @prop Расход {EnmDebit_credit_kinds} - Расход
 */
class EnmDebit_credit_kindsManager {}

/**
 * @summary Значение перечисления {@link EnmContract_kindsManager|Виды договоров контрагентов}
 * @class EnmContract_kinds
 * @see EnmContract_kindsManager
 */

/**
 * @summary Менеджер перечисления _Виды договоров контрагентов_ 
 * @class
 * @extends metadata.EnumManager
 * @prop СПоставщиком {EnmContract_kinds} - С поставщиком
 * @prop СПокупателем {EnmContract_kinds} - С покупателем
 * @prop committent {EnmContract_kinds} - С комитентом
 * @prop commission_agent {EnmContract_kinds} - С комиссионером
 * @prop Прочее {EnmContract_kinds} - Прочее
 */
class EnmContract_kindsManager {}

/**
 * @summary Значение перечисления {@link EnmInventory_kindsManager|Виды операций инвентаризации}
 * @class EnmInventory_kinds
 * @see EnmInventory_kindsManager
 */

/**
 * @summary Менеджер перечисления _Виды операций инвентаризации_ 
 * @class
 * @extends metadata.EnumManager
 * @prop Инвентаризация {EnmInventory_kinds} - Инвентаризация
 * @prop Оприходование {EnmInventory_kinds} - Оприходование
 * @prop Списание {EnmInventory_kinds} - Списание
 * @prop ИнвТек {EnmInventory_kinds} - Инвентаризация текущих
 */
class EnmInventory_kindsManager {}

/**
 * @summary Значение перечисления {@link EnmPredefined_formulasManager|Встроенные формулы}
 * @class EnmPredefined_formulas
 * @see EnmPredefined_formulasManager
 */

/**
 * @summary Менеджер перечисления _Встроенные формулы_ 
 * @class
 * @extends metadata.EnumManager
 * @prop cx_prm {EnmPredefined_formulas} - Характеристика по параметрам
 * @prop cx_row {EnmPredefined_formulas} - Характеристика тек. строки
 * @prop cx_clr {EnmPredefined_formulas} - Характеристика по цвету
 * @prop gb_short {EnmPredefined_formulas} - Штапик короткий
 * @prop gb_long {EnmPredefined_formulas} - Штапик длинный
 * @prop nom_prm {EnmPredefined_formulas} - Номенклатура по параметру
 * @prop clr_prm {EnmPredefined_formulas} - Цвет по параметру
 * @prop clr_in {EnmPredefined_formulas} - Цвет как изнутри с дополнением
 * @prop clr_out {EnmPredefined_formulas} - Цвет как снаружи с дополнением
 * @prop w2 {EnmPredefined_formulas} - Плюс ширина2
 */
class EnmPredefined_formulasManager {}

/**
 * @summary Значение перечисления {@link EnmText_alignsManager|Выравнивание текста}
 * @class EnmText_aligns
 * @see EnmText_alignsManager
 */

/**
 * @summary Менеджер перечисления _Выравнивание текста_ 
 * @class
 * @extends metadata.EnumManager
 * @prop left {EnmText_aligns} - Лево
 * @prop right {EnmText_aligns} - Право
 * @prop center {EnmText_aligns} - Центр
 */
class EnmText_alignsManager {}

/**
 * @summary Значение перечисления {@link EnmObj_delivery_statesManager|Статусы отправки документа}
 * @desc Статус отправки документа
 * @class EnmObj_delivery_states
 * @see EnmObj_delivery_statesManager
 */

/**
 * @summary Менеджер перечисления _Статусы отправки документа_ 
 * @desc Статус отправки документа
 * @class
 * @extends metadata.EnumManager
 * @prop Черновик {EnmObj_delivery_states} - Черновик
 * @prop Отправлен {EnmObj_delivery_states} - Отправлен
 * @prop Проверяется {EnmObj_delivery_states} - Проверяется
 * @prop Подтвержден {EnmObj_delivery_states} - Подтвержден
 * @prop Отклонен {EnmObj_delivery_states} - Отклонен
 * @prop Отозван {EnmObj_delivery_states} - Отозван
 * @prop Архив {EnmObj_delivery_states} - Перенесён в архив
 * @prop Шаблон {EnmObj_delivery_states} - Шаблон
 */
class EnmObj_delivery_statesManager {}

/**
 * @summary Значение перечисления {@link EnmUse_cutManager|Использование обрези}
 * @desc Варианты использования деловой обрези
 * @class EnmUse_cut
 * @see EnmUse_cutManager
 */

/**
 * @summary Менеджер перечисления _Использование обрези_ 
 * @desc Варианты использования деловой обрези
 * @class
 * @extends metadata.EnumManager
 * @prop none {EnmUse_cut} - Не учитывать
 * @prop all {EnmUse_cut} - Учитывать
 * @prop input {EnmUse_cut} - Только входящую
 * @prop output {EnmUse_cut} - Только исходящую
 */
class EnmUse_cutManager {}

/**
 * @summary Значение перечисления {@link EnmOrder_categoriesManager|Категории заказов}
 * @class EnmOrder_categories
 * @see EnmOrder_categoriesManager
 */

/**
 * @summary Менеджер перечисления _Категории заказов_ 
 * @class
 * @extends metadata.EnumManager
 * @prop order {EnmOrder_categories} - Расчет заказ
 * @prop service {EnmOrder_categories} - Сервис
 * @prop complaints {EnmOrder_categories} - Рекламация
 */
class EnmOrder_categoriesManager {}

/**
 * @summary Значение перечисления {@link EnmColor_price_group_destinationsManager|Назначения цветовых групп}
 * @class EnmColor_price_group_destinations
 * @see EnmColor_price_group_destinationsManager
 */

/**
 * @summary Менеджер перечисления _Назначения цветовых групп_ 
 * @class
 * @extends metadata.EnumManager
 * @prop ДляЦенообразования {EnmColor_price_group_destinations} - Для ценообразования
 * @prop ДляХарактеристик {EnmColor_price_group_destinations} - Для характеристик
 * @prop ДляГруппировкиВПараметрах {EnmColor_price_group_destinations} - Для группировки в параметрах
 * @prop ДляОграниченияДоступности {EnmColor_price_group_destinations} - Для ограничения доступности
 */
class EnmColor_price_group_destinationsManager {}

/**
 * @summary Значение перечисления {@link EnmOpen_directionsManager|Направление открывания}
 * @desc Направление открывания створки
 * @class EnmOpen_directions
 * @see EnmOpen_directionsManager
 */

/**
 * @summary Менеджер перечисления _Направление открывания_ 
 * @desc Направление открывания створки
 * @class
 * @extends metadata.EnumManager
 * @prop left {EnmOpen_directions} - Левое
 * @prop right {EnmOpen_directions} - Правое
 * @prop folding {EnmOpen_directions} - Откидное
 */
class EnmOpen_directionsManager {}

/**
 * @summary Значение перечисления {@link EnmRounding_quantityManager|Округлять количество}
 * @class EnmRounding_quantity
 * @see EnmRounding_quantityManager
 */

/**
 * @summary Менеджер перечисления _Округлять количество_ 
 * @class
 * @extends metadata.EnumManager
 * @prop none {EnmRounding_quantity} - Без оптимизации
 * @prop stick {EnmRounding_quantity} - Раскрой до хлыста
 * @prop packing {EnmRounding_quantity} - Раскрой до упаковки
 */
class EnmRounding_quantityManager {}

/**
 * @summary Значение перечисления {@link EnmOrientationsManager|Ориентация элемента}
 * @class EnmOrientations
 * @see EnmOrientationsManager
 */

/**
 * @summary Менеджер перечисления _Ориентация элемента_ 
 * @class
 * @extends metadata.EnumManager
 * @prop hor {EnmOrientations} - Горизонтальная
 * @prop vert {EnmOrientations} - Вертикальная
 * @prop incline {EnmOrientations} - Наклонная
 */
class EnmOrientationsManager {}

/**
 * @summary Значение перечисления {@link EnmOpeningManager|Открывание}
 * @desc Вовнутрь или наружу
 * @class EnmOpening
 * @see EnmOpeningManager
 */

/**
 * @summary Менеджер перечисления _Открывание_ 
 * @desc Вовнутрь или наружу
 * @class
 * @extends metadata.EnumManager
 * @prop in {EnmOpening} - На себя
 * @prop out {EnmOpening} - От себя
 */
class EnmOpeningManager {}

/**
 * @summary Значение перечисления {@link EnmPlan_detailingManager|Детализация планирования}
 * @class EnmPlan_detailing
 * @see EnmPlan_detailingManager
 */

/**
 * @summary Менеджер перечисления _Детализация планирования_ 
 * @class
 * @extends metadata.EnumManager
 * @prop order {EnmPlan_detailing} - Заказ
 * @prop product {EnmPlan_detailing} - Изделие
 * @prop layer {EnmPlan_detailing} - Контур
 * @prop elm {EnmPlan_detailing} - Элемент
 * @prop nearest {EnmPlan_detailing} - Соседний элем или слой
 * @prop parent {EnmPlan_detailing} - Родительский элемент или слой
 * @prop sub_elm {EnmPlan_detailing} - Вложенный элемент
 * @prop algorithm {EnmPlan_detailing} - Алгоритм
 * @prop layer_active {EnmPlan_detailing} - Активн. створка
 * @prop layer_passive {EnmPlan_detailing} - Пассивн. створка
 */
class EnmPlan_detailingManager {}

/**
 * @summary Значение перечисления {@link EnmPositionsManager|Положение элемента}
 * @desc Используется для назначения {@link CatInserts|Вставки} в {@link CatProduction_params|Системе}
 * @class EnmPositions
 * @see EnmPositionsManager
 */

/**
 * @summary Менеджер перечисления _Положение элемента_ 
 * @desc Используется для назначения {@link CatInserts|Вставки} в {@link CatProduction_params|Системе}
 * @class
 * @extends metadata.EnumManager
 * @prop any {EnmPositions} - Любое
 * @prop top {EnmPositions} - Верх
 * @prop bottom {EnmPositions} - Низ
 * @prop left {EnmPositions} - Лев
 * @prop right {EnmPositions} - Прав
 * @prop vert {EnmPositions} - Центр вертикаль
 * @prop hor {EnmPositions} - Центр горизонталь
 * @prop center {EnmPositions} - Центр
 * @prop lt {EnmPositions} - Лев верх
 * @prop lb {EnmPositions} - Лев низ
 * @prop rt {EnmPositions} - Прав верх
 * @prop rb {EnmPositions} - Прав низ
 */
class EnmPositionsManager {}

/**
 * @summary Значение перечисления {@link EnmGenderManager|Пол физических Лиц}
 * @class EnmGender
 * @see EnmGenderManager
 */

/**
 * @summary Менеджер перечисления _Пол физических Лиц_ 
 * @class
 * @extends metadata.EnumManager
 * @prop Мужской {EnmGender} - Мужской
 * @prop Женский {EnmGender} - Женский
 */
class EnmGenderManager {}

/**
 * @summary Значение перечисления {@link EnmParameters_keys_applyingManager|Применения ключей параметров}
 * @class EnmParameters_keys_applying
 * @see EnmParameters_keys_applyingManager
 */

/**
 * @summary Менеджер перечисления _Применения ключей параметров_ 
 * @class
 * @extends metadata.EnumManager
 * @prop НаправлениеДоставки {EnmParameters_keys_applying} - Направление доставки
 * @prop РабочийЦентр {EnmParameters_keys_applying} - Рабочий центр
 * @prop Технология {EnmParameters_keys_applying} - Технология
 * @prop Ценообразование {EnmParameters_keys_applying} - Ценообразование
 * @prop ПараметрВыбора {EnmParameters_keys_applying} - Параметр выбора
 */
class EnmParameters_keys_applyingManager {}

/**
 * @summary Значение перечисления {@link EnmBind_coordinatesManager|Приязка координат}
 * @class EnmBind_coordinates
 * @see EnmBind_coordinatesManager
 */

/**
 * @summary Менеджер перечисления _Приязка координат_ 
 * @class
 * @extends metadata.EnumManager
 * @prop product {EnmBind_coordinates} - Изделие
 * @prop contour {EnmBind_coordinates} - Слой
 * @prop b {EnmBind_coordinates} - Начало пути
 * @prop e {EnmBind_coordinates} - Конец пути
 */
class EnmBind_coordinatesManager {}

/**
 * @summary Значение перечисления {@link EnmElm_positionsManager|Расположение элементов управления}
 * @class EnmElm_positions
 * @see EnmElm_positionsManager
 */

/**
 * @summary Менеджер перечисления _Расположение элементов управления_ 
 * @class
 * @extends metadata.EnumManager
 * @prop top {EnmElm_positions} - Шапка
 * @prop column1 {EnmElm_positions} - Колонка 1
 * @prop column2 {EnmElm_positions} - Колонка 2
 * @prop column3 {EnmElm_positions} - Колонка 3
 * @prop bottom {EnmElm_positions} - Подвал
 */
class EnmElm_positionsManager {}

/**
 * @summary Значение перечисления {@link EnmNested_object_editing_modeManager|Режим редактирования вложенного объекта}
 * @class EnmNested_object_editing_mode
 * @see EnmNested_object_editing_modeManager
 */

/**
 * @summary Менеджер перечисления _Режим редактирования вложенного объекта_ 
 * @class
 * @extends metadata.EnumManager
 * @prop string {EnmNested_object_editing_mode} - Строка
 * @prop frm {EnmNested_object_editing_mode} - Форма
 * @prop both {EnmNested_object_editing_mode} - Строка и форма
 */
class EnmNested_object_editing_modeManager {}

/**
 * @summary Значение перечисления {@link EnmLay_regionsManager|Слои раскладки}
 * @class EnmLay_regions
 * @see EnmLay_regionsManager
 */

/**
 * @summary Менеджер перечисления _Слои раскладки_ 
 * @class
 * @extends metadata.EnumManager
 * @prop inner {EnmLay_regions} - Изнутри
 * @prop outer {EnmLay_regions} - Снаружи
 * @prop all {EnmLay_regions} - С двух стор
 * @prop r1 {EnmLay_regions} - Кам 1
 * @prop r2 {EnmLay_regions} - Кам 2
 * @prop r3 {EnmLay_regions} - Кам 3
 */
class EnmLay_regionsManager {}

/**
 * @summary Значение перечисления {@link EnmBuyers_order_statesManager|Состояния заказов клиентов}
 * @class EnmBuyers_order_states
 * @see EnmBuyers_order_statesManager
 */

/**
 * @summary Менеджер перечисления _Состояния заказов клиентов_ 
 * @class
 * @extends metadata.EnumManager
 * @prop ОжидаетсяСогласование {EnmBuyers_order_states} - Ожидается согласование
 * @prop ОжидаетсяАвансДоОбеспечения {EnmBuyers_order_states} - Ожидается аванс (до обеспечения)
 * @prop ГотовКОбеспечению {EnmBuyers_order_states} - Готов к обеспечению
 * @prop ОжидаетсяПредоплатаДоОтгрузки {EnmBuyers_order_states} - Ожидается предоплата (до отгрузки)
 * @prop ОжидаетсяОбеспечение {EnmBuyers_order_states} - Ожидается обеспечение
 * @prop ГотовКОтгрузке {EnmBuyers_order_states} - Готов к отгрузке
 * @prop ВПроцессеОтгрузки {EnmBuyers_order_states} - В процессе отгрузки
 * @prop ОжидаетсяОплатаПослеОтгрузки {EnmBuyers_order_states} - Ожидается оплата (после отгрузки)
 * @prop ГотовКЗакрытию {EnmBuyers_order_states} - Готов к закрытию
 * @prop Закрыт {EnmBuyers_order_states} - Закрыт
 */
class EnmBuyers_order_statesManager {}

/**
 * @summary Значение перечисления {@link EnmColoringManager|Способ придания цвета}
 * @class EnmColoring
 * @see EnmColoringManager
 */

/**
 * @summary Менеджер перечисления _Способ придания цвета_ 
 * @class
 * @extends metadata.EnumManager
 * @prop lam {EnmColoring} - Ламинация
 * @prop coloring {EnmColoring} - Покраска
 */
class EnmColoringManager {}

/**
 * @summary Значение перечисления {@link EnmApplication_joint_kindsManager|Способы предоставления скидок наценок}
 * @class EnmApplication_joint_kinds
 * @see EnmApplication_joint_kindsManager
 */

/**
 * @summary Менеджер перечисления _Способы предоставления скидок наценок_ 
 * @class
 * @extends metadata.EnumManager
 * @prop Сумма {EnmApplication_joint_kinds} - Скидка (наценка) суммой на документ
 * @prop СуммаДляКаждойСтроки {EnmApplication_joint_kinds} - Скидка (наценка) суммой для каждой строки
 * @prop Количество {EnmApplication_joint_kinds} - Скидка количеством
 * @prop Процент {EnmApplication_joint_kinds} - Скидка (наценка) процентом
 * @prop ВидЦены {EnmApplication_joint_kinds} - Специальная цена
 * @prop Сообщение {EnmApplication_joint_kinds} - Выдача сообщения
 * @prop КартаЛояльности {EnmApplication_joint_kinds} - Выдача карты лояльности
 * @prop Подарок {EnmApplication_joint_kinds} - Подарок
 * @prop ОкруглениеСуммы {EnmApplication_joint_kinds} - Округление суммы документа
 */
class EnmApplication_joint_kindsManager {}

/**
 * @summary Значение перечисления {@link EnmCount_calculating_waysManager|Способы расчета количества}
 * @class EnmCount_calculating_ways
 * @see EnmCount_calculating_waysManager
 */

/**
 * @summary Менеджер перечисления _Способы расчета количества_ 
 * @class
 * @extends metadata.EnumManager
 * @prop perim {EnmCount_calculating_ways} - По периметру
 * @prop area {EnmCount_calculating_ways} - По площади
 * @prop element {EnmCount_calculating_ways} - Для элемента
 * @prop steps {EnmCount_calculating_ways} - По шагам
 * @prop formulas {EnmCount_calculating_ways} - По формуле
 * @prop parameters {EnmCount_calculating_ways} - По параметру
 * @prop len_prm {EnmCount_calculating_ways} - Длина по параметру
 * @prop dimensions {EnmCount_calculating_ways} - Габариты по параметрам
 * @prop cnns {EnmCount_calculating_ways} - По соединениям
 * @prop fillings {EnmCount_calculating_ways} - По заполнениям
 * @prop coloring {EnmCount_calculating_ways} - По цвету
 */
class EnmCount_calculating_waysManager {}

/**
 * @summary Значение перечисления {@link EnmAngle_calculating_waysManager|Способы расчета угла}
 * @class EnmAngle_calculating_ways
 * @see EnmAngle_calculating_waysManager
 */

/**
 * @summary Менеджер перечисления _Способы расчета угла_ 
 * @class
 * @extends metadata.EnumManager
 * @prop Основной {EnmAngle_calculating_ways} - Основной
 * @prop СварнойШов {EnmAngle_calculating_ways} - Сварной шов
 * @prop СоединениеПополам {EnmAngle_calculating_ways} - Соед./2
 * @prop Соединение {EnmAngle_calculating_ways} - Соединение
 * @prop _90 {EnmAngle_calculating_ways} - 90
 * @prop НеСчитать {EnmAngle_calculating_ways} - Не считать
 */
class EnmAngle_calculating_waysManager {}

/**
 * @summary Значение перечисления {@link EnmSpecification_installation_methodsManager|Способы установки спецификации}
 * @class EnmSpecification_installation_methods
 * @see EnmSpecification_installation_methodsManager
 */

/**
 * @summary Менеджер перечисления _Способы установки спецификации_ 
 * @class
 * @extends metadata.EnumManager
 * @prop Всегда {EnmSpecification_installation_methods} - Всегда
 * @prop САртикулом1 {EnmSpecification_installation_methods} - с Арт1
 * @prop САртикулом2 {EnmSpecification_installation_methods} - с Арт2
 */
class EnmSpecification_installation_methodsManager {}

/**
 * @summary Значение перечисления {@link EnmVat_ratesManager|Ставки НДС}
 * @class EnmVat_rates
 * @see EnmVat_ratesManager
 */

/**
 * @summary Менеджер перечисления _Ставки НДС_ 
 * @class
 * @extends metadata.EnumManager
 * @prop НДС18 {EnmVat_rates} - 18%
 * @prop НДС18_118 {EnmVat_rates} - 18% / 118%
 * @prop НДС10 {EnmVat_rates} - 10%
 * @prop НДС10_110 {EnmVat_rates} - 10% / 110%
 * @prop НДС0 {EnmVat_rates} - 0%
 * @prop БезНДС {EnmVat_rates} - Без НДС
 * @prop НДС20 {EnmVat_rates} - 20%
 * @prop НДС20_120 {EnmVat_rates} - 20% / 120%
 */
class EnmVat_ratesManager {}

/**
 * @summary Значение перечисления {@link EnmCnn_sidesManager|Стороны соединений}
 * @desc Актуально для импостов и витражных элементов
 * @class EnmCnn_sides
 * @see EnmCnn_sidesManager
 */

/**
 * @summary Менеджер перечисления _Стороны соединений_ 
 * @desc Актуально для импостов и витражных элементов
 * @class
 * @extends metadata.EnumManager
 * @prop inner {EnmCnn_sides} - Изнутри
 * @prop outer {EnmCnn_sides} - Снаружи
 * @prop any {EnmCnn_sides} - Любая
 */
class EnmCnn_sidesManager {}

/**
 * @summary Значение перечисления {@link EnmInserts_typesManager|Типы вставок}
 * @desc Задаёт алгоритмы расчета и визуализации, используется для отбора в интерфейсе
 * @class EnmInserts_types
 * @see EnmInserts_typesManager
 */

/**
 * @summary Менеджер перечисления _Типы вставок_ 
 * @desc Задаёт алгоритмы расчета и визуализации, используется для отбора в интерфейсе
 * @class
 * @extends metadata.EnumManager
 * @prop profile {EnmInserts_types} - Профиль
 * @prop glass {EnmInserts_types} - Заполнение
 * @prop element {EnmInserts_types} - Элемент
 * @prop product {EnmInserts_types} - Изделие
 * @prop layer {EnmInserts_types} - Контур
 * @prop order {EnmInserts_types} - Заказ
 * @prop mosquito {EnmInserts_types} - Москитная сетка
 * @prop sill {EnmInserts_types} - Подоконник
 * @prop slope {EnmInserts_types} - Откос
 * @prop sectional {EnmInserts_types} - Водоотлив
 * @prop jalousie {EnmInserts_types} - Жалюзи
 * @prop mount {EnmInserts_types} - Монтаж
 * @prop delivery {EnmInserts_types} - Доставка
 * @prop set {EnmInserts_types} - Набор
 * @prop parametric {EnmInserts_types} - Параметрик
 * @prop external {EnmInserts_types} - Внешнее API
 * @prop composite {EnmInserts_types} - Стеклопакет составной
 * @prop adjoining {EnmInserts_types} - Примыкание
 * @prop coloring {EnmInserts_types} - Придание цвета
 * @prop packing {EnmInserts_types} - Упаковка
 * @prop not_use {EnmInserts_types} - Не использовать
 */
class EnmInserts_typesManager {}

/**
 * @summary Значение перечисления {@link EnmInserts_glass_typesManager|Типы вставок стеклопакета}
 * @desc Состав заполнения
 * @class EnmInserts_glass_types
 * @see EnmInserts_glass_typesManager
 */

/**
 * @summary Менеджер перечисления _Типы вставок стеклопакета_ 
 * @desc Состав заполнения
 * @class
 * @extends metadata.EnumManager
 * @prop Заполнение {EnmInserts_glass_types} - Заполнение
 * @prop Рамка {EnmInserts_glass_types} - Рамка
 * @prop Газ {EnmInserts_glass_types} - Гель, газ
 * @prop Пленка {EnmInserts_glass_types} - Пленка
 * @prop СтеклоСПодогревом {EnmInserts_glass_types} - Стекло с подогревом
 * @prop СтеклоЗакаленное {EnmInserts_glass_types} - Стекло закаленное
 * @prop СтеклоЭнергоСб {EnmInserts_glass_types} - Стекло энергосберегающее
 * @prop СтеклоЦветное {EnmInserts_glass_types} - Стекло цветное
 * @prop Триплекс {EnmInserts_glass_types} - Триплекс
 */
class EnmInserts_glass_typesManager {}

/**
 * @summary Значение перечисления {@link EnmLay_split_typesManager|Типы деления раскладки}
 * @desc Тип параметра для команды "добавить раскладку"
 * @class EnmLay_split_types
 * @see EnmLay_split_typesManager
 */

/**
 * @summary Менеджер перечисления _Типы деления раскладки_ 
 * @desc Тип параметра для команды "добавить раскладку"
 * @class
 * @extends metadata.EnumManager
 * @prop ДелениеГоризонтальных {EnmLay_split_types} - Деление горизонтальных
 * @prop ДелениеВертикальных {EnmLay_split_types} - Деление вертикальных
 * @prop КрестВСтык {EnmLay_split_types} - Крест в стык
 * @prop КрестПересечение {EnmLay_split_types} - Крест пересечение
 */
class EnmLay_split_typesManager {}

/**
 * @summary Значение перечисления {@link EnmContact_information_typesManager|Типы контактной информации}
 * @class EnmContact_information_types
 * @see EnmContact_information_typesManager
 */

/**
 * @summary Менеджер перечисления _Типы контактной информации_ 
 * @class
 * @extends metadata.EnumManager
 * @prop Адрес {EnmContact_information_types} - Адрес
 * @prop Телефон {EnmContact_information_types} - Телефон
 * @prop АдресЭлектроннойПочты {EnmContact_information_types} - Адрес электронной почты
 * @prop ВебСтраница {EnmContact_information_types} - Веб страница
 * @prop Факс {EnmContact_information_types} - Факс
 * @prop Другое {EnmContact_information_types} - Другое
 * @prop Skype {EnmContact_information_types} - Skype
 */
class EnmContact_information_typesManager {}

/**
 * @summary Значение перечисления {@link EnmLead_typesManager|Типы лидов}
 * @class EnmLead_types
 * @see EnmLead_typesManager
 */

/**
 * @summary Менеджер перечисления _Типы лидов_ 
 * @class
 * @extends metadata.EnumManager
 * @prop email {EnmLead_types} - Электронная почта
 * @prop social {EnmLead_types} - Социальная сеть
 * @prop phone {EnmLead_types} - Телефон
 * @prop visit {EnmLead_types} - Визит
 * @prop site {EnmLead_types} - Сайт
 */
class EnmLead_typesManager {}

/**
 * @summary Значение перечисления {@link EnmNom_typesManager|Типы номенклатуры}
 * @class EnmNom_types
 * @see EnmNom_typesManager
 */

/**
 * @summary Менеджер перечисления _Типы номенклатуры_ 
 * @class
 * @extends metadata.EnumManager
 * @prop goods {EnmNom_types} - Товар, материал
 * @prop service {EnmNom_types} - Услуга
 * @prop operation {EnmNom_types} - Работа, техоперация
 */
class EnmNom_typesManager {}

/**
 * @summary Значение перечисления {@link EnmCutting_optimization_typesManager|Типы оптимизаций раскроя}
 * @class EnmCutting_optimization_types
 * @see EnmCutting_optimization_typesManager
 */

/**
 * @summary Менеджер перечисления _Типы оптимизаций раскроя_ 
 * @class
 * @extends metadata.EnumManager
 * @prop Нет {EnmCutting_optimization_types} - Нет
 * @prop РасчетНарезки {EnmCutting_optimization_types} - Расчет нарезки
 * @prop НельзяВращатьПереворачивать {EnmCutting_optimization_types} - Нельзя вращать переворачивать
 * @prop ТолькоНомераЯчеек {EnmCutting_optimization_types} - Только номера ячеек
 */
class EnmCutting_optimization_typesManager {}

/**
 * @summary Значение перечисления {@link EnmOpen_typesManager|Типы открывания}
 * @class EnmOpen_types
 * @see EnmOpen_typesManager
 */

/**
 * @summary Менеджер перечисления _Типы открывания_ 
 * @class
 * @extends metadata.EnumManager
 * @prop Глухое {EnmOpen_types} - Глухое
 * @prop Поворотное {EnmOpen_types} - Поворотное
 * @prop Откидное {EnmOpen_types} - Откидное
 * @prop ПоворотноОткидное {EnmOpen_types} - Поворотно-откидное
 * @prop Раздвижное {EnmOpen_types} - Раздвижное
 * @prop Неподвижное {EnmOpen_types} - Неподвижное
 */
class EnmOpen_typesManager {}

/**
 * @summary Значение перечисления {@link EnmSz_line_typesManager|Типы размерных линий}
 * @class EnmSz_line_types
 * @see EnmSz_line_typesManager
 */

/**
 * @summary Менеджер перечисления _Типы размерных линий_ 
 * @class
 * @extends metadata.EnumManager
 * @prop normal {EnmSz_line_types} - Обычные
 * @prop bounds {EnmSz_line_types} - Только габаритные
 * @prop flap {EnmSz_line_types} - По створкам
 * @prop borde {EnmSz_line_types} - От края
 * @prop none {EnmSz_line_types} - Без размеров
 */
class EnmSz_line_typesManager {}

/**
 * @summary Значение перечисления {@link EnmCnn_typesManager|Типы соединений}
 * @class EnmCnn_types
 * @see EnmCnn_typesManager
 */

/**
 * @summary Менеджер перечисления _Типы соединений_ 
 * @class
 * @extends metadata.EnumManager
 * @prop ad {EnmCnn_types} - Угловое диагональное
 * @prop av {EnmCnn_types} - Угловое к вертикальной
 * @prop ah {EnmCnn_types} - Угловое к горизонтальной
 * @prop t {EnmCnn_types} - Т-образное
 * @prop ii {EnmCnn_types} - Наложение
 * @prop i {EnmCnn_types} - Незамкнутый контур
 * @prop xx {EnmCnn_types} - Крест в стык
 * @prop xt {EnmCnn_types} - Крест пересечение
 * @prop short {EnmCnn_types} - Короткое
 * @prop long {EnmCnn_types} - Длинное
 */
class EnmCnn_typesManager {}

/**
 * @summary Значение перечисления {@link EnmSpecification_order_row_typesManager|Типы строк в заказ}
 * @desc Способ вытягивания строки спецификации в заказ либо привязка к элементу или слою
 * @class EnmSpecification_order_row_types
 * @see EnmSpecification_order_row_typesManager
 */

/**
 * @summary Менеджер перечисления _Типы строк в заказ_ 
 * @desc Способ вытягивания строки спецификации в заказ либо привязка к элементу или слою
 * @class
 * @extends metadata.EnumManager
 * @prop no {EnmSpecification_order_row_types} - Нет
 * @prop material {EnmSpecification_order_row_types} - Материал
 * @prop prod {EnmSpecification_order_row_types} - Продукция
 * @prop kit {EnmSpecification_order_row_types} - Комплектация
 * @prop current {EnmSpecification_order_row_types} - Текущее изделие
 * @prop layer {EnmSpecification_order_row_types} - Контур
 * @prop nearest {EnmSpecification_order_row_types} - Соседний элем или слой
 */
class EnmSpecification_order_row_typesManager {}

/**
 * @summary Значение перечисления {@link EnmElm_typesManager|Типы элементов}
 * @desc Определяют поведение элемента в графическом построителе. Не рекомендуется использовать для группировки номенклатур, т.к. один и тот же материал может выступать элементами разных типов
 * @class EnmElm_types
 * @see EnmElm_typesManager
 */

/**
 * @summary Менеджер перечисления _Типы элементов_ 
 * @desc Определяют поведение элемента в графическом построителе. Не рекомендуется использовать для группировки номенклатур, т.к. один и тот же материал может выступать элементами разных типов
 * @class
 * @extends metadata.EnumManager
 * @prop rama {EnmElm_types} - Рама
 * @prop flap {EnmElm_types} - Створка
 * @prop flap0 {EnmElm_types} - Створка безимпостная
 * @prop impost {EnmElm_types} - Импост
 * @prop shtulp {EnmElm_types} - Штульп
 * @prop glass {EnmElm_types} - Стекло - стеклопакет
 * @prop sandwich {EnmElm_types} - Заполнение - сэндвич
 * @prop layout {EnmElm_types} - Раскладка - фальшпереплет
 * @prop text {EnmElm_types} - Текст
 * @prop line {EnmElm_types} - Линия
 * @prop size {EnmElm_types} - Размер
 * @prop radius {EnmElm_types} - Радиус
 * @prop cut {EnmElm_types} - Сечение
 * @prop addition {EnmElm_types} - Доборный проф.
 * @prop linking {EnmElm_types} - Соединит. профиль
 * @prop bundle {EnmElm_types} - Связка элементов
 * @prop attachment {EnmElm_types} - Вирт. конт. вложения
 * @prop drainage {EnmElm_types} - Водоотлив
 * @prop mosquito {EnmElm_types} - Москитн. сетка
 * @prop adjoining {EnmElm_types} - Примыкание
 * @prop furn {EnmElm_types} - Фурнитура
 * @prop compound {EnmElm_types} - Составной путь
 * @prop macro {EnmElm_types} - Макрос обр центра
 * @prop sill {EnmElm_types} - Подоконник
 * @prop error {EnmElm_types} - Ошибка критическая
 * @prop info {EnmElm_types} - Ошибка инфо
 * @prop visualization {EnmElm_types} - Визуализация
 * @prop other {EnmElm_types} - Прочее
 * @prop product {EnmElm_types} - Продукция
 * @prop delivery {EnmElm_types} - Доставка
 * @prop work {EnmElm_types} - Работы цеха
 * @prop mounting {EnmElm_types} - Монтаж
 * @prop gasket {EnmElm_types} - Уплотнение
 * @prop reinforcement {EnmElm_types} - Армирование
 * @prop glbead {EnmElm_types} - Штапик
 * @prop doorstep {EnmElm_types} - Порог
 * @prop Подставочник {EnmElm_types} - Подставочн. профиль
 */
class EnmElm_typesManager {}

/**
 * @summary Значение перечисления {@link EnmPlanning_phasesManager|Фазы планирования}
 * @class EnmPlanning_phases
 * @see EnmPlanning_phasesManager
 */

/**
 * @summary Менеджер перечисления _Фазы планирования_ 
 * @class
 * @extends metadata.EnumManager
 * @prop plan {EnmPlanning_phases} - План
 * @prop run {EnmPlanning_phases} - Запуск
 * @prop ready {EnmPlanning_phases} - Готовность
 */
class EnmPlanning_phasesManager {}

/**
 * @summary Значение перечисления {@link EnmOrder_sending_stagesManager|Этапы отправки заказа}
 * @class EnmOrder_sending_stages
 * @see EnmOrder_sending_stagesManager
 */

/**
 * @summary Менеджер перечисления _Этапы отправки заказа_ 
 * @class
 * @extends metadata.EnumManager
 * @prop replenish {EnmOrder_sending_stages} - Уточнение информации
 * @prop pay_start {EnmOrder_sending_stages} - Ожидание оплаты
 * @prop pay_confirmed {EnmOrder_sending_stages} - Оплата подтверждена
 */
class EnmOrder_sending_stagesManager {}

/**
 * @summary Значение перечисления {@link EnmIndividual_legalManager|Юр/ФизЛицо}
 * @class EnmIndividual_legal
 * @see EnmIndividual_legalManager
 */

/**
 * @summary Менеджер перечисления _Юр/ФизЛицо_ 
 * @class
 * @extends metadata.EnumManager
 * @prop ЮрЛицо {EnmIndividual_legal} - Юрлицо
 * @prop ФизЛицо {EnmIndividual_legal} - Физлицо
 */
class EnmIndividual_legalManager {}
