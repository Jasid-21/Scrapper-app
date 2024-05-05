import BaseGetter from "@/classes/getters/BaseGetter.class";
import Model from "@/classes/getters/Model.class";
import ModelTraining from "@/interfaces/ModelTraining.interface";

export default interface ModelsState {
  default_getters: BaseGetter[];
  models: Model[];
  training: Model | undefined;
  training_queue: Model[];
}
