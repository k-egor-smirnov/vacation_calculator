import {
  Div,
  FormItem,
  FormLayoutGroup,
  FormStatus,
  Group,
  Input,
  PanelHeader,
} from "@vkontakte/vkui";
import { useFormProcessor } from "../../useFormProcessor";
import { observer } from "mobx-react-lite";
import { availableYears } from "../../lib/calculator";
import { runInAction } from "mobx";
import { DateRangeInput } from "../../components/DateRangeInput/DateRangeInput";
import { Icon16RoubleOutline } from "@vkontakte/icons";

export const Dates = observer(() => {
  const processor = useFormProcessor("dates");
  const { mode } = processor;

  return (
    <>
      <PanelHeader>Базовая информация</PanelHeader>
      <Group>
        <FormLayoutGroup>
          <FormItem top="Зарплата" bottom="Сумма всех выплат до вычета налогов">
            <Input
              placeholder="65 321 ₽"
              inputMode="numeric"
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
      <Group>
        {mode === "dates" && (
          <>
            {processor.dateRange?.[0] &&
            processor.dateRange?.[1] &&
            processor.dateRange[0].getFullYear() !==
              processor.dateRange[1]?.getFullYear() ? (
              <Div>
                <FormStatus mode="error">
                  Выбор дат между разными годами временно недоступен
                </FormStatus>
              </Div>
            ) : null}
            {processor.dateRange?.[0] &&
            !availableYears.includes(
              String(processor.dateRange[0].getFullYear())
            ) ? (
              <Div>
                <FormStatus mode="error">
                  {processor.dateRange[0].getFullYear()} год недоступен для
                  выбора. Доступные варианты: {availableYears.join(", ")}
                </FormStatus>
              </Div>
            ) : null}
            <FormItem top="Желаемые даты отпуска">
              {/* TODO: Mobile */}
              <DateRangeInput
                value={processor.dateRange}
                onChange={(range) =>
                  runInAction(() => (processor.dateRange = range))
                }
              />
            </FormItem>
            {/* <Div>
              <FormStatus header="" mode="default">
                Даты отпуска попадают на праздничные дни. Они не будут
                учитываться при расчете.
              </FormStatus>
            </Div> */}
          </>
        )}
      </Group>
    </>
  );
});
