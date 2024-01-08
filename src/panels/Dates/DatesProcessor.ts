import { makeAutoObservable, reaction } from "mobx";
import { StepFormProcessor } from "../../StepFormProcessor";
import { DateRangeType } from "@vkontakte/vkui/dist/components/CalendarRange/CalendarRange";

export class DatesProcessor implements StepFormProcessor {
  public baseSalary: number | undefined;
  public mode: "dates" | "duration" = "dates";
  public year: number = 2024;
  public dateRange: DateRangeType | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  public isNextStepAvailable(): boolean {
    if (!this.baseSalary) {
      return false;
    }

    if (this.mode === "duration") {
      return false; //temp;
    }

    if (!this.dateRange || !this.dateRange[0] || !this.dateRange[1]) {
      return false;
    }

    return true;
  }
}
