import PrimaryGetter from "./PrimaryGetter.class";

export default class LinkGetter extends PrimaryGetter {
  constructor() {
    super('Link', 'fa-solid fa-link');
  }

  getContent(el: Element) {
    return el.getAttribute('data-href') || '';
  }
}
