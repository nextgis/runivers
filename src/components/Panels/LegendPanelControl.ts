import { Panel, PanelOptions } from './PanelControl';
import './LegendPanelControl.css';

export interface LegendPanelOptions extends PanelOptions {
  colors?: Array<[number, string]>;
}

const OPTIONS: LegendPanelOptions = {
  headerText: 'Легенда',
  addClass: 'legend-panel'
};


export class LegendPanelControl extends Panel {

  constructor(public options: LegendPanelOptions) {
    super(Object.assign({}, OPTIONS, options));
    this._createLegendBody();
  }

  private _createLegendBody() {
    const element = document.createElement('div');
    element.className = 'panel-body__legend';

    this.options.colors.forEach((c) => {
      const block = document.createElement('div');
      block.className = 'panel-body__legend--block';
      const [name, color] = c;
      const colorInput = document.createElement('input');
      colorInput.setAttribute('type', 'color');
      colorInput.value = color;
      block.appendChild(colorInput);

      const getName = (value) => {
        return ` - ${name} (${value})`;
      };
      const nameBlock = document.createElement('span');
      nameBlock.className = 'panel-body__legend--name';
      nameBlock.innerHTML = getName(color);

      block.appendChild(nameBlock);

      colorInput.onchange = () => {
        const changedColor = this.options.colors.find((x) => x[0] === name);
        changedColor[1] = colorInput.value;
        nameBlock.innerHTML = getName(colorInput.value);
        this.emitter.emit('change', this.options.colors);
      };

      element.appendChild(block);
    });

    this.updateBody(element);
    return element;
  }

}
