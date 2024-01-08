import { makeAutoObservable } from "mobx";
import { StepFormProcessor } from "../../StepFormProcessor";
import { DateRangeType } from "@vkontakte/vkui/dist/components/CalendarRange/CalendarRange";
export class BasicDataProcessor implements StepFormProcessor {
  baseSalary: number | undefined;
  excludedRanges: Array<DateRangeType | undefined> = [];

  constructor() {
    makeAutoObservable(this);
  }

  isNextStepAvailable(): boolean {
    return (this.baseSalary ?? 0) > 0;
  }
}
