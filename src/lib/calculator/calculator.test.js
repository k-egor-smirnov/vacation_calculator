import { describe, it, expect } from "vitest";
import { calculateVacation } from "./index";
import { UTCDate } from '@date-fns/utc';

describe("Calculator", () => {
  it("should calculate", () => {
    const result = calculateVacation(
      100_000,
      new Array(12).fill(100_000),
      new Date("2024.01.10"),
      new Date("2024.01.11"),
      []
    );

    expect(Math.floor(result.diff)).toEqual(-4939);
    expect(Math.floor(result.vacationSalary)).toEqual(6825);
  });

  it("should not count holidays", () => {
    const result = calculateVacation(
      100_000,
      new Array(12).fill(100_000),
      new Date("2024.01.01"),
      new Date("2024.01.08"),
      []
    );

    expect(result.diff).toEqual(0);
    expect(result.vacationSalary).toEqual(0);
  });

  it("should not decrease main salary when only weekend selected", () => {
    const result = calculateVacation(
      100_000,
      new Array(12).fill(100_000),
      new UTCDate("2024.01.13"),
      new UTCDate("2024.01.14"),
      []
    );

    expect(Object.values(result.nextSalaries)[0]).toEqual(100_000);
  });
});
