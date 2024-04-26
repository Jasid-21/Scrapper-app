import GetterName from "@/types/GetterName.type";

export default class BaseGetter {
  name: GetterName | string;
  context: Element | null = null;
  icon: string;

  constructor(name: GetterName | string, icon: string) {
    this.name = name;
    this.icon = icon;
  }

  setContext(ctx: Element) {
    if (!(ctx instanceof Element)) return;
    this.context = ctx;
  }

  run(ctx: Element) {
    return;
  }
}
