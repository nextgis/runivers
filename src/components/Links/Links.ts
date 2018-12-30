import './Links.scss';
import { Panel } from '../Panels/PanelControl';
import { App } from '../../App';
import { Toggler } from './Toggler';
import Dialog, { DialogAdapterOptions } from '@nextgis/dialog';

export function getBottomLinksPanel() {
  const block = document.createElement('div');
  block.innerHTML = `
    <a href="https://www.runivers.ru" class="runiver__logo"></a>
    <a href="https://histgeo.ru/laboratory.html" class="laboratory__logo"
      title="Лабораторией исторической геоинформатики"></a>
    <div class="transneft__logo"></div>

    <span class="socialLinks" style="height: 18px;">
      <a href="http://twitter.com/#!/runivers" class="social__logo twitter"></a>
      <a href="http://www.facebook.com/Runiverse.ru" class="social__logo facebook"></a>
      <a href="http://vk.com/public35690973" class="social__logo vkontakte"></a>
    </span>
  `;
  // <a href="http://runivers.livejournal.com/" class="social__logo livejournal"></a>


  const panel = new Panel({
    addClass: 'bottom-links'
  });
  panel.updateBody(block);
  return panel;
}

export function getBottomLeftLinksPanel() {
  const block = document.createElement('div');
  block.innerHTML = `
    <div><a href="#" class="resource__link">О проекте</a></div>
  `;
  const link = block.getElementsByTagName('a')[0];
  link.onclick = () => {
    openDialog({ template: aboutShort });
  };
  // <div><a  href="https://histgeo.ru/laboratory.html" class="resource__link">Лаборатория ИГ ИВИ РАН</a></div>

  const panel = new Panel({
    addClass: 'bottom-links'
  });
  panel.updateBody(block);
  return panel;
}

export function getTopLeftLinksPanel() {
  const block = document.createElement('div');
  block.innerHTML = `
    <div>
      <a
        href="https://www.runivers.ru/granitsy-rossii/charts/index.php"
        target="_blank"
        class="graph_logo"
        title="График изменения территории России"
      ></a>
    </div>
  `;

  const panel = new Panel({
    addClass: 'top-links'
  });
  panel.updateBody(block);
  return panel;
}

export function getTopLinksPanel(app: App) {
  const block = document.createElement('div');

  const baselayerToggler = new Toggler({
    className: 'baselayer__toggler',
    title: 'Скрыть подложку',
    titleOff: 'Показать подложку',
    toggleAction: (status) => {
      if (status) {
        app.webMap.showLayer('baselayer');
      } else {
        app.webMap.hideLayer('baselayer');
      }
    }
  });
  block.appendChild(baselayerToggler.getContainer());

  const periodToggler = new Toggler({
    className: 'period__toggler',
    title: 'Скрыть панель правителей',
    titleOff: 'Показать панель правителей',
    toggleAction: (status) => {
      if (status) {
        app.periodsPanelControl.show();
      } else {
        app.periodsPanelControl.hide();
      }
    }
  });
  block.appendChild(periodToggler.getContainer());
  app.periodsPanelControl.emitter.on('toggle', (status) => {
    periodToggler.toggle(status);
  });

  const yearsToggler = new Toggler({
    className: 'years__toggler',
    title: 'Скрыть панель изменения в территориальном составе',
    titleOff: 'Показать панель изменения в территориальном составе',
    toggleAction: (status) => {
      if (status) {
        app.yearsStatPanelControl._blocked = false;
        app.yearsStatPanelControl.show();
      } else {
        app.yearsStatPanelControl.hide();
        app.yearsStatPanelControl._blocked = true;
      }
    }
  });
  app.yearsStatPanelControl.emitter.on('toggle', (status) => {
    yearsToggler.toggle(status);
  });
  block.appendChild(yearsToggler.getContainer());


  const panel = new Panel({
    addClass: 'top-links'
  });
  panel.updateBody(block);
  return panel;
}

function openDialog(options: DialogAdapterOptions) {

  const dialog = new Dialog(options);

  const isSame = options && options.template &&
    dialog.options.template === options.template;
  if (!isSame) {
    dialog.updateContent(options.template);
  }
  dialog.show();
  return Dialog;
}

const aboutShort = `
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0.17in">
<SPAN LANG="ru-RU"><a href="https://www.runivers.ru" target="_blank">«Руниверс»</a>
совместно с <a href="https://histgeo.ru/laboratory.html" target="_blank">Лабораторией исторической
геоинформатики</a> Института всеобщей
истории РАН и компанией <a href="http://nextgis.ru/" target="_blank">NextGIS</a>
представляет проект «Границы России
1462–2018 гг.».</SPAN></P>
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0.17in">
<SPAN LANG="ru-RU">Этот
картографический проект содержит
геоданные о политических границах
современной России и ее предшественников.
Важнейшей возможностью, которую
предоставляет данная карта, является
выбор любого года в интервале карты.
Год можно выбрать, кликнув мышкой в
нужном месте ленты времени (в нижней
части карты), либо запустив автоматическую
прокрутку ленты времени с шагом в один
год, либо, используя иконки + и – справа
от ленты времени, сдвигаться на один
год влево или вправо.</SPAN></P>
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0.17in">
<A NAME="OLE_LINK210"></A><A NAME="OLE_LINK209"></A>
<SPAN LANG="ru-RU">Понимая,
с одной стороны, что формы политического
статуса территорий многообразны и, с
другой стороны, что это многообразие
необходимо свести к ограниченному числу
вариантов при отображении на карте, мы
выделили всего семь различных статусов
территории России или ее предшественников:</SPAN></P>
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0in">
<SPAN LANG="ru-RU">1) Основная
территория государства.</SPAN></P>
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0in">
<SPAN LANG="ru-RU">2) Территория
под протекторатом, в вассальной
зависимости или в сфере влияния.</SPAN></P>
<P LANG="ru-RU" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0in">
3) Арендованная
территория.</P>
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0in">
<SPAN LANG="ru-RU">4) Территория
в совместном владении.</SPAN></P>
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0in">
<SPAN LANG="ru-RU">5) Спорная
территория.</SPAN></P>
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0.17in">
<SPAN LANG="ru-RU">Кроме
того, в год изменения конфигурации
границы соответствующий участок показан
отдельным полигоном: как 6) Новая
территория или, напротив, как 7) Утраченная
территория. Эти полигоны также снабжены
маркерами, цифра на которых обозначает
соответствующую позицию в списке
территориальных изменений информационной
панели. В связи с тем, что некоторые
изменения территории имели место в
разные месяцы года, иногда полигоны со
статусами 6 и 7 задерживаются на карте
и в следующем после события году.</SPAN></P>
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0.17in">
<A NAME="OLE_LINK222"></A><A NAME="OLE_LINK221"></A>
<SPAN LANG="ru-RU">Эта
дифференциация отражена во всплывающем
окне, вызываемом по клику мыши на любом
объекте внутри политических границ.
Заливка соответствующих полигонов
передана четырьмя цветами: одним цветом
показана основная территория государства
и вновь присоединенные земли (статусы
1 и 6), другим цветом – земли, находящиеся
в некоторой зависимости от него (статус
2), третьим – земли арендованные, спорные
и находящиеся под совместным управлением
с другими государствами (статусы 3–5).
Утраченные территории обозначены
четвертым цветом (статус 7), однако в
силу ряда технических особенностей
текущего алгоритма построения геометрий
не все утраченные территории показаны
на карте отдельным полигоном. По клику
на любой полигон можно получить данные
о хронологическом диапазоне, в котором
существовало данное территориальное
образование, и его площади (в квадратных
километрах).</SPAN></P>
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0.17in">
<SPAN LANG="ru-RU">В центре
каждого такого полигона помещен маркер,
помогающий пользователю быстро найти
соответствующее место на мелкомасштабной
карте. По клику на маркер выдается
информация о событии, приведшем к
появлению данного территориального
образования.</SPAN></P>
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0.17in">
<SPAN LANG="ru-RU">В правом
верхнем углу карты доступны три
иконки-кнопки. Первая позволяет отключить
современную картографическую подложку,
две другие позволяют управлять
отображением двух информационных блоков
карты. В первом из них отображается имя
правителя на избранный пользователем
год, его титул или должность, годы
нахождения у власти с отсылкой на
отдельную страницу сайта с более
подробными сведениями. В нижнем блоке
указаны имевшие место в данном году
территориальные изменения и приведена
приблизительная площадь участков,
которые добавились к территории
государства и, наоборот, оказались
утрачены.</SPAN></P>
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0.17in">
<SPAN LANG="ru-RU">При
создании веб-ГИС «Границы Московского
княжества/Русского царства/Российской
империи/СССР/Российской федерации
(1462–2018 гг.)» реализована концепция
динамической карты. С точки зрения
технической реализации проекта эта
концепция является оригинальным
решением, разработанным в <a href="https://histgeo.ru/laboratory.html" target="_blank">Лабораторией исторической
геоинформатики</a> Института
всеобщей истории РАН совместно с
<a href="http://nextgis.ru/" target="_blank">NextGIS</a>.</SPAN></P>
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0.17in">
<SPAN LANG="ru-RU">Прикладное
значение данного проекта для использования
в научных целях является отличительной
его чертой. Подобные динамические карты,
демонстрирующие изменения границ в
прошлом, имеют в основном «образовательный»
уклон и не могут быть скорректированы
в результате обсуждения кругом
специалистов-историков. Публикуемая
динамическая карта, открытая для
постоянной корректировки, призвана в
дальнейшем стать некой картографической
подосновой для историка, применяющего
ГИС-технологии для решения конкретных
исследовательских задач.</SPAN></P>
<P LANG="en-GB" CLASS="western" ALIGN=JUSTIFY STYLE="margin-bottom: 0.17in">
<SPAN LANG="ru-RU">О допущениях,
особенностях методики и ограничениях
применявшейся методики, технических
особенностях проекта и перспективах
его развития см. <a
  href="https://www.runivers.ru/granitsy-rossii/about/about_detailed/index.php"
  target="_blank"
>
  ПОДРОБНЕЕ
</a>.
</SPAN></P>
`;


