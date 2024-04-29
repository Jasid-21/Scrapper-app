import GetterName from "@/types/GetterName.type";
import BaseGetter from "./BaseGetter.class";
import { ComposeAlert } from "@/services/FireAlert.service";
import { getters } from "@/helpers/Objects";
import { GetMainContext } from "@/services/SelectElements.service";

export interface Property {
  name: string;
  value: any;
  getter: GetterName;
}

export interface RawProperty extends Property {
  selector: string | undefined;
  multiple: boolean;
}

export default class Model extends BaseGetter {
  raw_properties: RawProperty[] = [];
  train_context: Element | null = null;

  constructor(name: string, properties: RawProperty[] = []) {
    super(name, 'fa-solid fa-sitemap');

    if (!properties.length) return;
    this.raw_properties = properties;
  }

  get trained(): boolean {
    return !this.raw_properties.some(p => p.selector == '');
  }

  get nextProperty(): string {
    return this.raw_properties.find(p => !p.selector)?.name || '';
  }

  set rawProperty(prop: RawProperty) {
    this.raw_properties.push(prop);
  }

  run(ctxs?: Element[]): undefined {
    if (!this.trained) return;
    if (!ctxs && !this.context) this.context = GetMainContext()?.body;
    if (ctxs) this.context = ctxs[0];
    if (!this.context) return;
    console.log(this.context);

    const obj = this.raw_properties.map(p => {
      const raw_els = p.multiple ?
        this.context?.querySelectorAll(p.selector as string) || undefined :
        this.context?.querySelector(p.selector as string) || undefined;
      if (raw_els === undefined) return { name: p.name, value: undefined };

      let els: Element[];
      if (p.multiple) {
        els = Array.from((raw_els as NodeListOf<Element>).values());
      } else els = [raw_els as Element];
      
      const getter = getters[p.getter];
      const v: any[] | undefined = getter.run(els);

      return { name: p.name, value: v && v.length == 1 ? v[0] : v };
    });

    console.log(obj);
  }

  setFakeContext(ctx: Element) {
    if (!(ctx instanceof Element)) return;
    this.train_context = ctx;
  }

  trainProperty(name: string, selector: string, multiple: boolean) {
    const property = this.raw_properties.find(p => p.name == name);
    if (!property) return

    property.selector = selector;
    property.multiple = multiple;
  }
}
