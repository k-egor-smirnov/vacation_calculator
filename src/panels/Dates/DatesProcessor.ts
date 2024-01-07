import { makeAutoObservable } from "mobx";
import { StepFormProcessor } from "../../StepFormProcessor";
import { DateRangeType } from "@vkontakte/vkui/dist/components/CalendarRange/CalendarRange";

export class DatesProcessor implements StepFormProcessor {
  public mode: "dates" | "duration" = "dates";
  private _dateRange: DateRangeType | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  public setMode(mode: typeof this.mode) {
    this.mode = mode;
  }

  public get dateRange(): DateRangeType | undefined {
    return this._dateRange;
  }

  public set dateRange(dateRange: DateRangeType | undefined) {
    this._dateRange = dateRange;
  }

  public isNextStepAvailable(): boolean {
    if (this.mode === "duration") {
      return false; //temp;
    }

    if (!this.dateRange || !this.dateRange[0] || !this.dateRange[1]) {
      return false;
    }

    return true;
  }
}
