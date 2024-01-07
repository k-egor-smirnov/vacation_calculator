import { StepFormProcessor } from '../../StepFormProcessor';

export class IntroProcessor implements StepFormProcessor {
  isNextStepAvailable(): boolean {
    return true;
  }
}
