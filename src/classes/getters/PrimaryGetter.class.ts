import GetterName from "@/types/GetterName.type";
import BaseGetter from "./BaseGetter.class";

export default class PrimaryGetter extends BaseGetter {
  constructor(name: GetterName | string, icon: string) {
    super(name, icon);
  }
}
