import PrimaryGetter from "./PrimaryGetter.class";

export default class TextGetter extends PrimaryGetter {
  constructor() {
    super('Text', 'fa-solid fa-font');
  }

  run(el: Element): string {
    if (!(el instanceof Element)) return '';
    return el.textContent || '';
  }
}
