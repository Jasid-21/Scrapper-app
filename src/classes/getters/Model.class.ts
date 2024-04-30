import GetterName from "@/types/GetterName.type";
import BaseGetter from "./BaseGetter.class";
import { ComposeAlert } from "@/services/FireAlert.service";
import { getters } from "@/helpers/Objects";
import SelectElements, { GetMainContext } from "@/services/SelectElements.service";
import ComposeSelector from "@/services/ComposeSelector.service";
import { useModelsStore } from "@/stores/models";

export interface Property {
  name: string;
  value: any;
}

export interface RawProperty extends Property {
  getter: GetterName;
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

  setRawProperty(name: string, getter: GetterName) {
    const prop: RawProperty = {
      name, getter, selector: undefined,
      value: undefined, multiple: false,
    }
    this.raw_properties.push(prop);
  }

  getContent(el: Element): Property[] {
    return this.raw_properties.map(p => {
      const raw_els = p.multiple ?
        el.querySelectorAll(p.selector as string) || undefined :
        el.querySelector(p.selector as string) || undefined;
      if (raw_els === undefined) return { name: p.name, value: undefined };

      let els: Element[];
      if (p.multiple) {
        els = Array.from((raw_els as NodeListOf<Element>).values());
      } else els = [raw_els as Element];
      
      const getter = getters[p.getter] || useModelsStore().models.find(m => m.name == p.getter);
      if (!getter) return { name: p.name, value: '' };
      const v: any[] | undefined = getter.run(els);

      return { name: p.name, value: v && v.length == 1 ? v[0] : v };
    });
  }

  run(ctxs: Element[]): Property[][] {
    if (!this.trained) return [];
    if (!ctxs) return [];
    
    return ctxs.map(ctx => this.getContent(ctx));
  }

  async trainProperty(name: string, el: Element): Promise<boolean> {
    if (!this.train_context) {
      ComposeAlert('Invalid training context');
      return false;
    }

    const selector = ComposeSelector(el);
    const els = SelectElements(selector, this.train_context);
    if (!els) {
      ComposeAlert('No elements were found. This may be an internal system error');
      return false;
    }
    
    let multiple = false;
    console.log(els.length);
    if (els.length > 1) {
      const mult = await ComposeAlert(
        `We've found ${els.length} elements. If you click "ok" you'll keep them all.
        Otherwise only the first will be selected`,
        'info', true
      );
      if (mult.isConfirmed) multiple = true;
    }

    const property = this.raw_properties.find(p => p.name == name);
    if (!property) return false;

    property.selector = selector;
    property.multiple = multiple;
    return true;
  }

  async setTrainingContext(selector: string): Promise<boolean> {
    if (!selector) {
      this.train_context = null;
      return false;
    }

    const main = GetMainContext();
    if (!main) return false;
    let context: Element | null = null;
    try {
      const ctx  = main.querySelectorAll(selector);
      if (ctx.length > 1) {
        const pass = await ComposeAlert(
          `We've found ${ ctx.length } element that match the selection.
          This may cause problems in model elements selection.
          Do you want to continue?`, 'warning', true
        );
        if (pass.isDismissed) return false;
      }
      context = main.querySelector(selector);
    } catch (err) {
      console.log(err);
      return false;
    }
    if (!context) return false;
    this.train_context = context;
    return true;
  }
}
