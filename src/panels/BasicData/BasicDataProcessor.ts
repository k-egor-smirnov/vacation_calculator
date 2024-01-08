import { StepFormProcessor } from "../../StepFormProcessor";
import { DateRangeType } from "@vkontakte/vkui/dist/components/CalendarRange/CalendarRange";
import {
  addMonths,
  differenceInCalendarMonths,
  startOfMonth,
  subMonths,
} from "date-fns";
import { UTCDate } from "@date-fns/utc";
import { makeAutoObservable } from "mobx";

export class BasicDataProcessor implements StepFormProcessor {
  constructor() {
    makeAutoObservable(this);
  }

  customSalaries: Array<{ date: Date; value: number | undefined }> = new Array(
    12
  )
    .fill(undefined)
    .map((_, index, arr) => ({
      date: startOfMonth(subMonths(new UTCDate(), arr.length - index)),
      value: undefined,
    }));

  excludedRanges: Array<DateRangeType | undefined> = [];

  private _vacationTargetStart: Date = new UTCDate();
  private _baseSalary: number | undefined;

  get baseSalary() {
    return this._baseSalary;
  }

  set baseSalary(baseSalary: number | undefined) {
    const prevSalary = this._baseSalary;
    this._baseSalary = baseSalary;

    this.customSalaries.forEach((salary) => {
      if (salary.value === undefined || salary.value === prevSalary) {
        salary.value = baseSalary;
      }
    });
  }

  set vacationTargetStart(newVacationTargetStart: Date) {
    const billingPeriodStartDate = startOfMonth(
      subMonths(newVacationTargetStart, 12)
    );

    const billingPeriodEndDate = startOfMonth(
      subMonths(newVacationTargetStart, 1)
    );

    const difference = differenceInCalendarMonths(
      billingPeriodEndDate,
      subMonths(this._vacationTargetStart, 1)
    );

    if (difference > 0) {
      this.customSalaries.splice(0, difference);
      this.customSalaries.push(
        ...new Array(difference)
          .fill({
            date: this.customSalaries[this.customSalaries.length - 1].date,
            value: this.baseSalary,
          })
          .map((v, i) => ({ ...v, date: addMonths(v.date, i + 1) }))
      );
    } else if (difference < 0) {
      this.customSalaries.splice(difference, -difference);
      for (let i = 0; i < -difference; i++) {
        this.customSalaries.unshift({
          date: subMonths(billingPeriodStartDate, i - 1),
          value: this.baseSalary,
        });
      }
    }

    this._vacationTargetStart = newVacationTargetStart;
  }

  get vacationTargetStart() {
    return this._vacationTargetStart;
  }

  isNextStepAvailable(): boolean {
    return (this.baseSalary ?? 0) > 0;
  }
}
