import PrimaryGetter from "./PrimaryGetter.class";

export default class TextGetter extends PrimaryGetter {
  constructor() {
    super('Text', 'fa-solid fa-font');
  }

  getContent(el: Element): string {
    return el.textContent || '';
  }
}
