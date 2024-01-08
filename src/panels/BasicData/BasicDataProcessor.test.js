import { describe, expect, it } from "vitest";
import { BasicDataProcessor } from "./BasicDataProcessor";
import { addMonths, startOfMonth, subMonths } from "date-fns";
import { UTCDate } from "@date-fns/utc";

function getBillingPeriodDates(vacationStartDate) {
  return [
    startOfMonth(subMonths(vacationStartDate, 12)),
    startOfMonth(subMonths(vacationStartDate, 11)),
    startOfMonth(subMonths(vacationStartDate, 10)),
    startOfMonth(subMonths(vacationStartDate, 9)),
    startOfMonth(subMonths(vacationStartDate, 8)),
    startOfMonth(subMonths(vacationStartDate, 7)),
    startOfMonth(subMonths(vacationStartDate, 6)),
    startOfMonth(subMonths(vacationStartDate, 5)),
    startOfMonth(subMonths(vacationStartDate, 4)),
    startOfMonth(subMonths(vacationStartDate, 3)),
    startOfMonth(subMonths(vacationStartDate, 2)),
    startOfMonth(subMonths(vacationStartDate, 1)),
  ];
}

describe("BasicDataProcessor", () => {
  it("should fill months after first target set", () => {
    const processor = new BasicDataProcessor();
    processor.baseSalary = 10_000;
    processor.vacationTargetStart = new UTCDate();

    expect(processor.customSalaries.map((v) => v.date)).toMatchObject(
      getBillingPeriodDates(new UTCDate())
    );
  });

  it("should shift dates left when new target start is less than old target", () => {
    const processor = new BasicDataProcessor();
    processor.baseSalary = 10_000;

    processor.vacationTargetStart = new UTCDate();
    processor.customSalaries[0].value = 20_000;
    processor.customSalaries[3].value = 40_000;

    processor.vacationTargetStart = subMonths(new UTCDate(), 2);

    expect(processor.customSalaries.map((v) => v.date)).toMatchObject(
      getBillingPeriodDates(subMonths(new UTCDate(), 2))
    );

    expect(processor.customSalaries[2].value).toEqual(20_000);
    expect(processor.customSalaries[5].value).toEqual(40_000);
  });

  it("should shift dates right when new target start is larger than old target", () => {
    const processor = new BasicDataProcessor();
    processor.baseSalary = 10_000;

    processor.vacationTargetStart = new UTCDate();
    processor.customSalaries[0].value = 20_000;
    processor.customSalaries[3].value = 40_000;

    processor.vacationTargetStart = addMonths(new UTCDate(), 2);

    expect(processor.customSalaries.map((v) => v.date)).toMatchObject(
      getBillingPeriodDates(addMonths(new UTCDate(), 2))
    );

    expect(processor.customSalaries[0].value).toEqual(10_000);
    expect(processor.customSalaries[1].value).toEqual(40_000);
  });
});
