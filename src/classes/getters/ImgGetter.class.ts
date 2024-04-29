import PrimaryGetter from "./PrimaryGetter.class";

export default class ImgGetter extends PrimaryGetter {
  constructor() {
    super('Img', 'fa-solid fa-image');
  }

  getContent(el: Element) {
    return el.getAttribute('src') || '';
  }
}
