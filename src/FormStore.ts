import { makeAutoObservable } from "mobx";
import { DatesProcessor } from "./panels/Dates/DatesProcessor";
import { IntroProcessor } from "./panels/Intro/IntroProcessor";
import { BasicDataProcessor } from "./panels/BasicData/BasicDataProcessor";
import { calculateVacation } from "./lib/calculator";
import { eachDayOfInterval } from "date-fns";

export type Step = "intro" | "dates" | "basic" | "result";

class FormStore {
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
      new Array(12).fill(baseSalary),
      dateRange[0],
      dateRange[1],
      excludedDates
    );

    return {
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

    this.step = this.getNextStep();
    this.history.push(this.step);
  }

  prevStep() {
    this.history.pop();
    this.step = this.history[this.history.length - 1] || "intro";
  }
}

export const formStore = new FormStore();
