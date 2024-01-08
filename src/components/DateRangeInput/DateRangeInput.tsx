import { UTCDate } from "@date-fns/utc";
import {
  DateRangeInput as VKUIDateRangeInput,
  DateRangeInputProps,
  useAdaptivityWithJSMediaQueries,
  ViewWidth,
  FormLayoutGroup,
  FormItem,
  DatePicker,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";

function DateRangeInputMobile(props: DateRangeInputProps) {
  const defaultStartDate = props.value?.[0] ?? undefined;
  const defaultEndDate = props.value?.[1] ?? undefined;

  const [startDate, setStartDate] = useState<Date | undefined>(
    defaultStartDate
  );
  const [endDate, setEndDate] = useState<Date | undefined>(defaultEndDate);

  useEffect(() => {
    props.onChange?.([startDate ?? null, endDate ?? null]);
  }, [startDate, endDate]);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        flex: "0 0 0",
        marginLeft: -16,
        marginRight: -16,
      }}
    >
      <FormLayoutGroup style={{ width: "100%" }} segmented>
        <FormItem>
          <DatePicker
            defaultValue={
              defaultStartDate
                ? {
                    day: defaultStartDate.getDate(),
                    month: defaultStartDate.getMonth(),
                    year: defaultStartDate.getFullYear(),
                  }
                : undefined
            }
            onDateChange={(value) =>
              setStartDate(new UTCDate(value.year, value.month, value.day))
            }
          />
        </FormItem>
        <FormItem>
          <DatePicker
            defaultValue={
              defaultEndDate
                ? {
                    day: defaultEndDate.getDate(),
                    month: defaultEndDate.getMonth(),
                    year: defaultEndDate.getFullYear(),
                  }
                : undefined
            }
            onDateChange={(value) =>
              setEndDate(new UTCDate(value.year, value.month, value.day))
            }
          />
        </FormItem>
      </FormLayoutGroup>
      {props.after}
    </div>
  );
}

export function DateRangeInput(props: DateRangeInputProps) {
  const adaptivity = useAdaptivityWithJSMediaQueries();
  if (adaptivity.viewWidth >= ViewWidth.SMALL_TABLET) {
    return <VKUIDateRangeInput {...props} />;
  }

  return <DateRangeInputMobile {...props} />;
}
