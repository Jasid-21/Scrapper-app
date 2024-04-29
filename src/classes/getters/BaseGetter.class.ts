import GetterName from "@/types/GetterName.type";

export default class BaseGetter {
  name: GetterName | string;
  context: Element | undefined = undefined;
  icon: string;

  constructor(name: GetterName | string, icon: string) {
    this.name = name;
    this.icon = icon;
  }

  setContext(ctx: Element) {
    if (!(ctx instanceof Element)) return;
    this.context = ctx;
  }

  getContent(el: Element): any {
    return;
  }

  run(el?: Element[]): any[] | undefined {
    if (!el) return undefined;
    return el.map(e => this.getContent(e));
  }
}
