Виртуальный класс [ProfileItem](ProfileItem.html) описывает базовое поведение профиля и раскладки.
От него унаследованы [Profile](Profile.html), [Onlay](Onlay.html), [ProfileAddl](ProfileAddl.html) и [ProfileConnective](ProfileConnective.html)
```
. BuilderElement          # Абстрактный элемент
└─ ProfileItem            # Абстрактный профиль
   ├─ Profile             # Рама, Створка, Импост, Штульп
   ├─ Onlay               # Раскладка
   ├─ ProfileAddl         # Доборный и расширительный профили
   └─ ProfileConnective   # Соединительный профиль
```
Важнейшие свойства профиля

| Свойство | Тип                                          | Описание |
|:---|:---------------------------------------------|:---|
| generatrix | [Path](http://paperjs.org/reference/path/)   | Образующая - унаследована от [BuilderElement](Элемент-(BuilderElement)), - прямая или кривая линия, определяющая размеры, положение и форму профиля |
| b | [Point](http://paperjs.org/reference/point/) | Координаты начальной точки - первой вершины образующей. Вычисляется, как  `generatrix.firstSegment.point` |
| e | [Point](http://paperjs.org/reference/point/) | Координаты конечной точки - последней вершины образующей. Вычисляется, как  `generatrix.firstSegment.point` |
| inset | [CatInserts](CatInserts.html)            | Вставка, унаследована от [BuilderElement](Элемент-(BuilderElement)), по ней вычисляется номенклатура и сдвиг рёбер относительно образующей |
| width | Число                                    | Ширина профиля - зависит от материала, который вычисляется по вставке с учетом параметров. Если не найдена номенклатура вставки или не указана ширина в номенклатуре, принимается `width = 80` |
| d0 | Число                                       | Расстояние от узла до опорной линии. Для сегментов створок и вложенных элементов зависит от ширины элементов и свойств примыкающих соединений. Для элементов внешнего контура `d0 = 0` |
| d1 | Число                                       | Расстояние от узла до внешнего ребра элемента. Для рам, обычно `d1 = 0`, для импостов 1/2 ширины, зависит от `d0` и `sizeb` |
| d2 | Число                                       | Расстояние от узла до внутреннего ребра элемента, зависит от `d1` и `width` |
| rays | [ProfileRays](ProfileRays.html)           | Опорные точки и лучи |
| corns | function                                 | Координаты вершин (cornx1...corny4) - свойство только для чтения |
| elm_type | [ElmTypes](EnmElm_types.html)         | Тип элемента - свойство только для чтения, вычисляется по слою и концевым соединениям профиля|

<img src="imgs/rama0-b-20.png" align="left" title="Размер B = -20" height="300" >

<img src="imgs/rama0-b0.png" align="left" title="Размер B = 0" height="300" >

![Размер B = 0](/oknosoft/windowbuilder/blob/master/doc/imgs/wiki/rama-b-20.png)

![Размер B = 0](imgs/rama-b20.png)

При расчете значений `d0` и связанных с ним `d1` и `d2` для профилей вложенных контуров, кроме `ширин` и `размеров В`, вступает в игру размер `sz` примыкающего соединения:

<img src="imgs/overlay.png" align="left" title="Наложение" height="300" >
