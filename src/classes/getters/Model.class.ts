import GetterName from "@/types/GetterName.type";
import BaseGetter from "./BaseGetter.class";

export interface Property {
  name: string;
  value: any;
  getter: GetterName;
}

export interface RawProperty extends Property {
  selector: string | undefined;
}

export default class Model extends BaseGetter {
  raw_properties: RawProperty[] = [];
  train_context: Element | null = null;

  constructor(name: string, properties: RawProperty[] = []) {
    super(name, 'fa-solid fa-sitemap');

    if (!properties.length) return;
    this.raw_properties = properties;
  }

  get nextProperty(): string {
    return this.raw_properties.find(p => !p.selector)?.name || '';
  }

  set rawProperty(prop: RawProperty) {
    this.raw_properties.push(prop);
  }

  setFakeContext(ctx: Element) {
    if (!(ctx instanceof Element)) return;
    this.train_context = ctx;
  }

  trainProperty(name: string, selector: string) {
    const property = this.raw_properties.find(p => p.name == name);
    if (!property) return

    property.selector = selector;
  }
}
