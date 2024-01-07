import {
  Avatar,
  Banner,
  Checkbox,
  DateRangeInput,
  Div,
  FormItem,
  FormLayoutGroup,
  Group,
  Input,
  PanelHeader,
  SegmentedControl,
  Select,
} from "@vkontakte/vkui";
import { useFormProcessor } from "../../useFormProcessor";
import { observer } from "mobx-react-lite";

const warningGradient = "linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)";

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
              options={[2023, 2024].map((v) => ({
                label: v.toString(),
                value: v.toString(),
              }))}
              defaultValue={new Date().getFullYear().toString()}
            />
          </FormItem>
        </FormLayoutGroup>
      </Group>
      <Group>
        <FormLayoutGroup>
          {mode === "dates" && (
            <>
              <FormItem top="Желаемые даты отпуска">
                {/* TODO: Mobile */}
                <DateRangeInput
                  value={processor.dateRange}
                  onChange={(range) => (processor.dateRange = range)}
                  shouldDisableDate={(date) => date.getFullYear() !== 2024}
                />
              </FormItem>
            </>
          )}
        </FormLayoutGroup>
      </Group>
    </>
  );
});