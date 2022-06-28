import Color from 'color';
import { Panel, PanelOptions } from './PanelControl';
import './LegendPanelControl.css';
import { LegendColor, LegendColorItem } from '../../interfaces';
export interface LegendPanelOptions extends PanelOptions {
  colors?: LegendColor;
}

const OPTIONS: LegendPanelOptions = {
  addClass: 'legend-panel',
};

export class LegendPanelControl extends Panel {
  constructor(public options: LegendPanelOptions) {
    super({ ...OPTIONS, ...options });
    this._createLegendBody();

    this._addEventsListener();
  }

  createLegendBlock(interactive = false): HTMLElement {
    const element = document.createElement('div');
    element.className = 'panel-body__legend';
    const colors = this.options.colors;
    if (colors) {
      Object.values(colors).forEach((x) => {
        x.forEach((c) => {
          element.appendChild(this._createLegendItem(c, interactive));
        });
      });
    }

    return element;
  }

  private _createLegendBody() {
    const element = this.createLegendBlock();
    const buttonBlock = document.createElement('div');
    buttonBlock.className = 'panel-body__legend--button';
    buttonBlock.innerHTML = `
    <div><a
      href="https://www.runivers.ru/granitsy-rossii/charts/index.php"
      target='_blank'
      class="btn panel-button">ГРАФИК ИЗМЕНЕНИЯ ТЕРРИТОРИИ
    </a></div>
    <div><a
      href="https://runivers.ru/doc/rusland/zemli-i-knyazhestva/"
      target='_blank'
      class="btn panel-button">Схема земель и княжеств <div class="link-button subtitle">средневековой Руси</div>
    </a></div>
    `;
    element.appendChild(buttonBlock);
    this.updateBody(element);
    return element;
  }

  private _createLegendItem(c: LegendColorItem, interactive = false) {
    const block = document.createElement('div');
    block.className = 'panel-body__legend--block';

    const [id, paint, text] = c;
    const color = typeof paint === 'string' ? paint : paint.color;
    const type = (typeof paint !== 'string' && paint.type) || 'fill';
    if (interactive) {
      this._createInteractiveBlock(block, id, color, text);
    } else {
      const _color = new Color(color);

      const colorSymbol = document.createElement('div');
      colorSymbol.className = 'panel-body__legend--color ' + type;
      colorSymbol.style.backgroundColor = String(_color.fade(0.3));

      colorSymbol.style.border = '2px solid ' + _color.darken(0.5);

      block.appendChild(colorSymbol);

      const nameBlock = document.createElement('div');
      nameBlock.className = 'panel-body__legend--name';
      nameBlock.innerHTML = `${text}`;
      block.appendChild(nameBlock);
    }
    return block;
  }

  private _createInteractiveBlock(
    block: HTMLElement,
    id: number,
    color: string,
    text: string,
  ) {
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
    const allColors = this.options.colors;
    colorInput.onchange = () => {
      if (allColors) {
        const colors: LegendColorItem[] = [];
        Object.values(allColors).forEach((x) =>
          x.forEach((y) => colors.push(y)),
        );
        const changedColor = colors.find((x) => x[0] === id);
        if (changedColor) {
          changedColor[1] = colorInput.value;
          nameBlock.innerHTML = getName(colorInput.value);
          this.emitter.emit('change', this.options.colors);
        }
      }
    };

    block.appendChild(nameBlock);
  }

  private _addEventsListener() {
    this.emitter.on('change', () => {
      this._createLegendBody();
    });
  }
}
