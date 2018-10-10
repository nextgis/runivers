import './Links.scss';
import { Panel } from '../Panels/PanelControl';

export function getBottomLinksPanel() {
  const block =  document.createElement('div');
  block.innerHTML = `
    <div class="transneft__logo"></div>

    <span class="socialLinks" style="height: 20px;">
      <a href="http://twitter.com/#!/runivers" class="social__logo twitter"></a>
      <a href="http://www.facebook.com/Runiverse.ru" class="social__logo facebook"></a>
      <a href="http://vk.com/public35690973" class="social__logo vkontakte"></a>
      <a href="http://runivers.livejournal.com/" class="social__logo livejournal"></a>
    </span>
  `;


  const panel = new Panel({
    addClass: 'bottom-links'
  });
  panel.updateBody(block);
  return panel;
}

