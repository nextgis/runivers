import { Panel, PanelOptions } from './PanelControl';
import './LegendPanelControl.css';
import Color from 'color';
export interface LegendPanelOptions extends PanelOptions {
  colors?: Array<[number, string, string, number[]]>;
}

const OPTIONS: LegendPanelOptions = {
  addClass: 'legend-panel'
};

export class LegendPanelControl extends Panel {
  constructor(public options: LegendPanelOptions) {
    super({ ...OPTIONS, ...options });
    this._createLegendBody();

    this._addEventsListener();
  }

  createLegendBlock(interactive = false) {
    const element = document.createElement('div');
    element.className = 'panel-body__legend';

    this.options.colors.forEach(c => {
      element.appendChild(this._createLegendItem(c, interactive));
    });

    return element;
  }

  private _createLegendBody() {
    const element = this.createLegendBlock();
    const buttonBlock = document.createElement('div');
    buttonBlock.className = 'panel-body__legend--button';
    buttonBlock.innerHTML = `<a
      href="https://www.runivers.ru/granitsy-rossii/charts/index.php"
      target='_blank'
      class="btn panel-button">ГРАФИК ИЗМЕНЕНИЯ ТЕРРИТОРИИ
    </a>`;
    element.appendChild(buttonBlock);
    this.updateBody(element);
    return element;
  }

  private _createLegendItem(c: [number, string, string, number[]], interactive = false) {
    const block = document.createElement('div');
    block.className = 'panel-body__legend--block';

    const [name, color, text] = c;

    if (interactive) {
      const colorInput = document.createElement('input');
      colorInput.setAttribute('type', 'color');
      colorInput.className = 'editable-legend__color-input';
      colorInput.value = color;
      block.appendChild(colorInput);
      const getName = (value: string) => {
        return ` - ${text} (${value})`;
      };

      const nameBlock = document.createElement('span');
      nameBlock.className = 'panel-body__legend--name';
      nameBlock.innerHTML = getName(color);
      colorInput.onchange = () => {
        const changedColor = this.options.colors.find(x => x[0] === name);
        changedColor[1] = colorInput.value;
        nameBlock.innerHTML = getName(colorInput.value);
        this.emitter.emit('change', this.options.colors);
      };

      block.appendChild(nameBlock);
    } else {
      const _color = new Color(color);

      const colorSymbol = document.createElement('div');
      colorSymbol.className = 'panel-body__legend--color';
      colorSymbol.style.backgroundColor = _color.fade(0.3);

      colorSymbol.style.border = '2px solid ' + _color.darken(0.5);

      block.appendChild(colorSymbol);

      const nameBlock = document.createElement('div');
      nameBlock.className = 'panel-body__legend--name';
      nameBlock.innerHTML = `${text}`;
      block.appendChild(nameBlock);
    }
    return block;
  }

  private _addEventsListener() {
    this.emitter.on('change', () => {
      this._createLegendBody();
    });
  }
}
