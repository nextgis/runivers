import './Links.scss';
import { Panel } from '../Panels/PanelControl';
import { App } from '../../App';
import { Toggler } from './Toggler';

export function getBottomLinksPanel() {
  const block = document.createElement('div');
  block.innerHTML = `
    <a  href="https://www.runivers.ru/timeline/" class="resource__link">График изменения</a>
    <a  href="https://www.runivers.ru" class="runiver__logo"></a>
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
    <a  href="https://www.runivers.ru" class="runiver__logo"></a>
  `;


  const panel = new Panel({
    addClass: 'bottom-links'
  });
  panel.updateBody(block);
  return panel;
}

export function getTopLinksPanel(app: App) {
  const block = document.createElement('div');
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
    title: 'Скрыть панель изменения в территориальной целостности',
    titleOff: 'Показать панель изменения в территориальной целостности',
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
    addClass: 'bottom-links'
  });
  panel.updateBody(block);
  return panel;
}



