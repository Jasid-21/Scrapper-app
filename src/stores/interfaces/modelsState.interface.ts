import BaseGetter from "@/classes/getters/BaseGetter.class";
import Model from "@/classes/getters/Model.class";

export default interface ModelsState {
  default_getters: BaseGetter[];
  models: Model[];
}
