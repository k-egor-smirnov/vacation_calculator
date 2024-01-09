import { makeAutoObservable, reaction } from "mobx";
import { DatesProcessor } from "./panels/Dates/DatesProcessor";
import { IntroProcessor } from "./panels/Intro/IntroProcessor";
import { BasicDataProcessor } from "./panels/BasicData/BasicDataProcessor";
import { calculateVacation } from "./lib/calculator";
import {
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import bridge from "@vkontakte/vk-bridge";
import { VK_RETARGETING_PIXEL_ID } from "./consants";

export type Step = "intro" | "dates" | "basic" | "result";

export class FormStore {
  step: Step = "intro";
  history: Step[] = [];

  public readonly processors: {
    dates: DatesProcessor;
    intro: IntroProcessor;
    basic: BasicDataProcessor;
    result: DatesProcessor;
  } = {
    dates: new DatesProcessor(),
    intro: new IntroProcessor(),
    basic: new BasicDataProcessor(),
    result: new DatesProcessor(),
  };

  constructor() {
    makeAutoObservable(this);

    if (localStorage.getItem("intro_complete")) {
      this.step = this.getNextStep();
    }

    this.history.push(this.step);

    reaction(
      () => this.processors.dates.dateRange,
      (newTargetDateRange) => {
        if (!newTargetDateRange?.[0]) {
          return;
        }

        this.processors.basic.vacationTargetStart = newTargetDateRange[0];

        const billingPeriodStartDate = startOfMonth(
          subMonths(newTargetDateRange[0], 12)
        );

        const billingPeriodEndDate = endOfMonth(
          subMonths(newTargetDateRange[0], 1)
        );

        this.processors.basic.excludedRanges =
          this.processors.basic.excludedRanges.filter((dateRange) => {
            // Незаполнененные данные оставляем
            if (!dateRange || !dateRange[0] || !dateRange[1]) {
              return true;
            }

            return (
              dateRange[0] >= billingPeriodStartDate &&
              dateRange[0] <= billingPeriodEndDate &&
              dateRange[1] >= billingPeriodStartDate &&
              dateRange[1] <= billingPeriodEndDate
            );
          });
      }
    );

    reaction(
      () => this.processors.dates.baseSalary,
      (baseSalary) => {
        this.processors.basic.baseSalary = baseSalary;
      }
    );
  }

  get isNextStepAvailable() {
    const processor = this.processors[this.step];
    if (!processor) {
      return true;
    }

    return processor.isNextStepAvailable();
  }

  get vacationTargetStart(): Date | null {
    return this.processors.dates.dateRange?.[0] ?? null;
  }

  private getNextStep(): Step {
    switch (this.step) {
      case "intro":
        return "dates";
      case "dates":
        return "basic";
      case "basic":
        return "result";
      default:
        return "intro";
    }
  }

  get result(): {
    vacationSalary: number;
    nextSalaries: Record<number, number>;
    diff: number;
  } | null {
    const { dateRange } = this.processors.dates;
    const { baseSalary, excludedRanges } = this.processors.basic;
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return null;
    }

    if (!baseSalary) {
      return null;
    }

    const excludedDates = excludedRanges
      .map((dateRange) =>
        eachDayOfInterval({ start: dateRange![0]!, end: dateRange![1]! })
      )
      .flat();

    const calcResult = calculateVacation(
      baseSalary,
      this.processors.basic.customSalaries.map((v) => v.value || 0),
      dateRange[0],
      dateRange[1],
      excludedDates
    );

    return {
      diff: calcResult.diff,
      vacationSalary: parseFloat(
        Math.floor(calcResult.vacationSalary).toFixed(2)
      ),
      nextSalaries: calcResult.nextSalaries,
    };
  }

  nextStep() {
    if (!this.isNextStepAvailable) {
      return;
    }
    if (this.step === "intro") {
      bridge.send("VKWebAppRetargetingPixel", {
        pixel_code: VK_RETARGETING_PIXEL_ID,
        event: "click",
      });
      // @ts-expect-error vk pixel
      window._tmr?.push({ type: "reachGoal", id: 3470645, goal: "intro" });
    }

    this.step = this.getNextStep();
    this.history.push(this.step);
  }

  prevStep() {
    this.history.pop();
    this.step = this.history[this.history.length - 1] || "intro";
  }
}

export const formStore = new FormStore();
