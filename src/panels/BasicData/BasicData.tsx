import { Icon20DeleteOutline } from "@vkontakte/icons";
import {
  CellButton,
  Div,
  FormItem,
  FormLayoutGroup,
  Group,
  Header,
  IconButton,
  Input,
  PanelHeader,
  Subhead,
} from "@vkontakte/vkui";
import { useFormProcessor } from "../../useFormProcessor";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import { formStore } from "../../FormStore";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { DateRangeInput } from "../../components/DateRangeInput/DateRangeInput";

export const BasicData = observer(() => {
  const processor = useFormProcessor("basic");

  const billingPeriodStartDate = startOfMonth(
    subMonths(formStore.vacationTargetStart!, 12)
  );

  const billingPeriodEndDate = endOfMonth(
    subMonths(formStore.vacationTargetStart!, 1)
  );

  return (
    <>
      <PanelHeader>Дополнительно</PanelHeader>
      <Group header={<Header>Периоды отсутствия</Header>}>
        <Div style={{ paddingTop: 0, paddingBottom: 4 }}>
          <Subhead style={{ color: "var(--vkui--color_text_secondary)" }}>
            Больничные, отпуска (и оплачиваемые, и неоплачевымые) или
            командировки в промежутке между{" "}
            <b>
              {new Intl.DateTimeFormat("ru", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              }).format(billingPeriodStartDate)}
              {" "}
            </b>
            и{" "}
            <b>
              {new Intl.DateTimeFormat("ru", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              }).format(billingPeriodEndDate)}
            </b>{" "}
            включительно.
          </Subhead>
        </Div>
        <FormLayoutGroup segmented={true}>
          {processor.excludedRanges.map((dateRange, index) => (
            <FormItem key={index + JSON.stringify(dateRange)}>
              <DateRangeInput
                onChange={(dateRange) => {
                  runInAction(() => {
                    processor.excludedRanges[index] = dateRange;
                  });
                }}
                value={dateRange}
                shouldDisableDate={(date) => {
                  if (!formStore.vacationTargetStart) {
                    return true;
                  }
                  return (
                    date >= billingPeriodEndDate ||
                    date < billingPeriodStartDate
                  );
                }}
                after={
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      processor.excludedRanges.splice(index, 1);
                    }}
                  >
                    <Icon20DeleteOutline />
                  </IconButton>
                }
              />
            </FormItem>
          ))}
        </FormLayoutGroup>
        <CellButton onClick={() => processor.excludedRanges.push([null, null])}>
          Добавить отсутствие
        </CellButton>
      </Group>
      <Group
        header={<Header>Изменения выплат в течение года</Header>}
        description="Финальная сумма, включая отпуска, больничные и пособия. Указывайте сумму ДО уплаты НДФЛ"
      >
        <FormLayoutGroup>
          {processor.customSalaries.map((customSalary) => {
            return (
              <FormItem
                top={
                  <>
                    {new Intl.DateTimeFormat("ru", { month: "long" }).format(
                      customSalary.date
                    )}{" "}
                    {customSalary.date.getFullYear()}
                  </>
                }
              >
                <Input
                  value={customSalary.value}
                  inputMode="numeric"
                  onChange={(e) =>
                    (customSalary.value = parseInt(e.target.value, 10))
                  }
                ></Input>
              </FormItem>
            );
          })}
        </FormLayoutGroup>
      </Group>
    </>
  );
});
