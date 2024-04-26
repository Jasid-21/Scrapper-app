import PrimaryGetter from "./PrimaryGetter.class";

export default class LinkGetter extends PrimaryGetter {
  constructor() {
    super('Link', 'fa-solid fa-link');
  }

  run(el: Element): string {
    if (!(el instanceof HTMLElement)) return '';
    return el.getAttribute('href') || '';
  }
}
