import {
  getDaysInMonth,
  subMonths,
  addMonths,
  eachDayOfInterval,
  subMinutes,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  differenceInCalendarDays,
} from "date-fns";
import { years } from "../../../calendar/result.json"; // https://xmlcalendar.ru/data/ru/2024/calendar.json
import { UTCDate } from "@date-fns/utc";

export const availableYears = Object.keys(years);

const basicOffset = new Date().getTimezoneOffset();

function createDate(str: string | Date) {
  const date = new UTCDate(str);
  return subMinutes(date, basicOffset);
}

function getSpecialDays(year: number, monthIndex: number) {
  // @ts-expect-error  No index signature with a parameter of type 'string' was found on type
  const yearValue = years[year.toString()];
  return Object.keys(yearValue.days).reduce<Record<string, any>>(
    (acc, date) => {
      if (date.startsWith(String(monthIndex + 1).padStart(2, "0"))) {
        acc[parseInt(date.split(".")[1], 10)] = yearValue.days[date];
      }

      return acc;
    },
    {}
  );
}

function getWorkingDatesOfMonth(date: Date) {
  const specialDays = getSpecialDays(date.getFullYear(), date.getMonth());

  const workingDays = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  }).filter((v) => {
    const specialDayData = specialDays[v.getDate()];
    if (specialDayData) {
      // Особый рабочий день, выпадающий на выходные
      return specialDayData.type === "3";
    } else {
      // Выходной
      return v.getDay() !== 0 && v.getDay() !== 6;
    }
  });

  return workingDays;
}

function calcAvgDailySalary(
  billingPeriodSalariesSum: number,
  billingPeriodLength: number,
  startDate: Date,
  excludedDates: Date[]
) {
  const excludedDaysByMonth = excludedDates.reduce<Record<number, number>>(
    (acc, v) => {
      acc[v.getMonth()] ??= 0;
      acc[v.getMonth()]++;
      return acc;
    },
    {}
  );

  const totalWorkingDays = new Array(billingPeriodLength)
    .fill(0)
    .map((_, index) => {
      const date = subMonths(startDate, billingPeriodLength - index - 1);
      const days = getDaysInMonth(date);
      const excludedDays = excludedDaysByMonth[date.getMonth()] ?? 0;

      // https://kontur.ru/bk/spravka/210-raschet_i_vyplata_otpusknyh
      return ((days - excludedDays) * 29.3) / days;
    })
    .reduce((acc, v) => (acc += v));

  return billingPeriodSalariesSum / totalWorkingDays;
}

function calcVacationSalary(
  billingPeriodSalaries: number[],
  startDate: Date,
  endDate: Date,
  excludedDates: Date[]
) {
  const billingPeriodSalariesSum = billingPeriodSalaries.reduce(
    (acc, v) => acc + v
  );
  const holidays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).filter((v) => {
    // TODO Оптимизировать
    const specialDaysThisMonth = getSpecialDays(v.getFullYear(), v.getMonth());
    return specialDaysThisMonth[v.getDate()]?.type === "1";
  });

  const vacationDays =
    differenceInCalendarDays(endDate, startDate) + 1 - holidays.length;

  const avgDailySalary = calcAvgDailySalary(
    billingPeriodSalariesSum,
    billingPeriodSalaries.length,
    startDate,
    excludedDates
  );

  return vacationDays * avgDailySalary;
}

function calcWorkSalary(salary: number, startDate: Date, endDate: Date) {
  const nextSalaries: Record<number, number> = {};
  const standardSalaries: Record<number, number> = {};

  const vacationDates = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  for (let i = 0; i <= endDate.getMonth() - startDate.getMonth(); i++) {
    const date = addMonths(startDate, i);
    console.log(date);

    const monthVacationDays = vacationDates
      .filter((vacationDate) => isSameMonth(date, vacationDate))
      .map((v) => v.getDate());

    const commonWorkingDays = getWorkingDatesOfMonth(date).map((v) =>
      v.getDate()
    );
    const workingDays = commonWorkingDays.filter(
      (v) => !monthVacationDays.includes(v)
    );

    // todo holidays
    const avgDaySalary = salary / commonWorkingDays.length;

    const expectedMonthSalary = workingDays.length * avgDaySalary;
    nextSalaries[+date] = expectedMonthSalary;
    standardSalaries[+date] = commonWorkingDays.length * avgDaySalary;
  }

  return { nextSalaries, standardSalaries };
}

export function calculateVacation(
  salary: number,
  billingPeriodSalaries: number[],
  startDate: Date,
  endDate: Date,
  excludedDates: Date[]
) {
  startDate = createDate(startDate);
  endDate = createDate(endDate);

  if (startDate > endDate) {
    throw new Error("End date is less than start date");
  }

  const vacationSalary = calcVacationSalary(
    billingPeriodSalaries,
    startDate,
    endDate,
    excludedDates
  );

  const { standardSalaries, nextSalaries } = calcWorkSalary(
    salary,
    startDate,
    endDate
  );

  const standardSalariesSum = Object.values(standardSalaries).reduce(
    (acc, v) => (acc += v),
    0
  );

  const nextSalariesSum = Object.values(nextSalaries).reduce(
    (acc, v) => (acc += v),
    0
  );

  const totalSalary = nextSalariesSum + vacationSalary;

  return {
    diff: totalSalary - standardSalariesSum,
    vacationSalary,
    nextSalaries,
  };
}
