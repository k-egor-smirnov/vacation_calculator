import {
  DateRangeInput,
  Div,
  FormItem,
  FormLayoutGroup,
  FormStatus,
  Group,
  PanelHeader,
  Select,
} from "@vkontakte/vkui";
import { useFormProcessor } from "../../useFormProcessor";
import { observer } from "mobx-react-lite";
import { availableYears } from "../../lib/calculator";
import { runInAction } from "mobx";

export const Dates = observer(() => {
  const processor = useFormProcessor("dates");
  const { mode } = processor;

  return (
    <>
      <PanelHeader>Даты отпуска</PanelHeader>
      <Group>
        <FormLayoutGroup>
          <FormItem
            top="Год отпуска"
            bottom="От выбранного года зависит количество праздников и выходных в соответствии с производственным календарем."
          >
            <Select
              options={availableYears.map((v) => ({
                label: v.toString(),
                value: v.toString(),
              }))}
              value={String(processor.year)}
              onChange={(e) =>
                runInAction(() => (processor.year = Number(e.target.value)))
              }
            />
          </FormItem>
        </FormLayoutGroup>
      </Group>
      <Group>
        {mode === "dates" && (
          <>
            <FormItem top="Желаемые даты отпуска">
              {/* TODO: Mobile */}
              <DateRangeInput
                value={processor.dateRange}
                onChange={(range) =>
                  runInAction(() => (processor.dateRange = range))
                }
                shouldDisableDate={(date) =>
                  date.getFullYear() !== processor.year
                }
              />
            </FormItem>
            <Div>
              <FormStatus header="" mode="default">
                Даты отпуска попадают на праздничные дни. Они не будут
                учитываться при расчете.
              </FormStatus>
            </Div>
          </>
        )}
      </Group>
    </>
  );
});
