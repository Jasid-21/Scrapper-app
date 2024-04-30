import GetterName from "@/types/GetterName.type";

export default class BaseGetter {
  name: GetterName | string;
  context: Element | undefined = undefined;
  icon: string;
  isDefault: boolean;

  constructor(name: GetterName | string, icon: string, isDefault: boolean = true) {
    this.name = name;
    this.icon = icon;
    this.isDefault = isDefault;
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
