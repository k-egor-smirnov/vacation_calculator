import { Icon16RoubleOutline, Icon20DeleteOutline } from "@vkontakte/icons";
import {
  CellButton,
  DateRangeInput,
  Div,
  FormItem,
  FormLayoutGroup,
  Group,
  Header,
  IconButton,
  Input,
  PanelHeader,
  Radio,
  RadioGroup,
  Subhead,
} from "@vkontakte/vkui";
import { useFormProcessor } from "../../useFormProcessor";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import { formStore } from "../../FormStore";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

export const BasicData = observer(() => {
  const processor = useFormProcessor("basic");

  const billingPeriodStartDate = startOfMonth(
    subMonths(formStore.vacationTargetStart!, 12)
  );
  1;

  const billingPeriodEndDate = endOfMonth(
    subMonths(formStore.vacationTargetStart!, 1)
  );

  return (
    <>
      <PanelHeader>Базовая информация</PanelHeader>
      <Group>
        <FormLayoutGroup>
          <FormItem top="Зарплата" bottom="Сумма всех выплат до вычета налогов">
            <Input
              placeholder="65 321 ₽"
              after={<Icon16RoubleOutline />}
              value={processor.baseSalary}
              onChange={(e) => {
                e.preventDefault();
                runInAction(() => {
                  processor.baseSalary = e.target.value
                    ? parseInt(e.target.value, 10) || processor.baseSalary
                    : undefined;
                });
              }}
            />
          </FormItem>
        </FormLayoutGroup>
      </Group>
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
            </b> включительно.
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
          {new Array(12).fill(undefined).map((_, index) => {
            if (!formStore.vacationTargetStart) {
              return;
            }

            const date = subMonths(formStore.vacationTargetStart, index + 1);
            return (
              <FormItem
                top={
                  <>
                    {new Intl.DateTimeFormat("ru", { month: "long" }).format(
                      date
                    )}{" "}
                    {date.getFullYear()}
                  </>
                }
              >
                <Input disabled value={processor.baseSalary}></Input>
              </FormItem>
            );
          })}
        </FormLayoutGroup>
        {/* <FormItem>
          <Input align="right" before="Январь" />
          <Input before="Февраль" />
          <Input before="Март" />
          <Input before="Апрель" />
          <Input before="Май" />
          <Input before="Июнь" />
          <Input before="Июль" />
          <Input before="Август" />
          <Input before="Сентябрь" />
          <Input before="Октябрь" />
          <Input before="Ноябрь" />
          <Input before="Декабрь" />
        </FormItem> */}
      </Group>
    </>
  );
});
