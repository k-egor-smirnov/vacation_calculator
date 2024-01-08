import { makeAutoObservable } from "mobx";
import { StepFormProcessor } from "../../StepFormProcessor";
import { DateRangeType } from "@vkontakte/vkui/dist/components/CalendarRange/CalendarRange";
import { availableYears } from "../../lib/calculator";

export class DatesProcessor implements StepFormProcessor {
  public baseSalary: number | undefined;
  public mode: "dates" | "duration" = "dates";
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

    if (this.dateRange[0].getFullYear() !== this.dateRange[1].getFullYear()) {
      return false;
    }

    if (!availableYears.includes(String(this.dateRange[0].getFullYear()))) {
      return false;
    }

    return true;
  }
}
