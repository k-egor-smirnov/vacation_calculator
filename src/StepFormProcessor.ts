export abstract class StepFormProcessor {
  deps?: Array<typeof StepFormProcessor>;
  abstract isNextStepAvailable(): boolean;
}
