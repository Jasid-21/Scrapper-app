export interface ModelTrainingStep {
  message: string;
  completed: boolean;
}

export default interface ModelTraining {
  model: string;
  message: string;
}
