import {
  getDaysInMonth,
  subMonths,
  differenceInDays,
  addMonths,
  eachDayOfInterval,
  subMinutes,
  isSameMonth,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { months } from "./calendar.json"; // https://xmlcalendar.ru/data/ru/2024/calendar.json

const basicOffset = new Date().getTimezoneOffset();

function createDate(str: string | Date) {
  const date = new Date(str);
  return subMinutes(date, basicOffset);
}

function getWorkingDatesOfMonth(date: Date) {
  const excludedDays = months[date.getMonth()].days
    .split(",")
    .map((v) => parseInt(v, 10));

  const workingDays = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  })
    .map((v) => createDate(v))
    .filter((v) => !excludedDays.includes(v.getDate()));

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
  const vacationDays = differenceInDays(endDate, startDate) + 1;

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

  const vacationDates = eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).map((v) => createDate(v));

  for (let i = 0; i <= endDate.getMonth() - startDate.getMonth(); i++) {
    const date = addMonths(startDate, i);

    const monthVacationDays = vacationDates
      .filter((vacationDate) => isSameMonth(date, vacationDate))
      .map((v) => v.getDate());

    const commonWorkingDays = getWorkingDatesOfMonth(date).map((v) =>
      v.getDate()
    );
    const workingDays = commonWorkingDays.filter(
      (v) => !monthVacationDays.includes(v)
    );
    console.log(commonWorkingDays.length, workingDays.length);

    // todo holidays
    const avgDaySalary = salary / getWorkingDatesOfMonth(date).length;

    const expectedMonthSalary = workingDays.length * avgDaySalary;
    nextSalaries[+date] = expectedMonthSalary;
  }

  return { nextSalaries };
}

export function calculateVacation(
  salary: number,
  billingPeriodSalaries: number[],
  startDate: Date,
  endDate: Date,
  excludedDates: Date[]
) {
  if (startDate > endDate) {
    throw new Error("End date is less than end date");
  } else if (startDate.getFullYear() !== endDate.getFullYear()) {
    throw new Error("Years must me same");
  }

  const vacationSalary = calcVacationSalary(
    billingPeriodSalaries,
    startDate,
    endDate,
    excludedDates
  );

  const standardSalaries = {};
  const { nextSalaries } = calcWorkSalary(salary, startDate, endDate);

  const nextSalariesSum = Object.values(nextSalaries).reduce(
    (acc, v) => (acc += v)
  );

  // const nextSalaries = startDate
  console.log(vacationSalary, nextSalaries, vacationSalary + nextSalariesSum);

  return {
    daysSpent: 1,
    vacationSalary,
    nextSalaries,
  };
}
