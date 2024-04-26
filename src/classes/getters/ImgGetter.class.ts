import PrimaryGetter from "./PrimaryGetter.class";

export default class ImgGetter extends PrimaryGetter {
  constructor() {
    super('Img', 'fa-solid fa-image');
  }

  run(el: Element): string {
    if (!(el instanceof HTMLImageElement)) return '';
    return el.src || '';
  }
}
