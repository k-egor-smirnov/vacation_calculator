import {
  Div,
  Footer,
  Group,
  Header,
  InfoRow,
  PanelHeader,
  SimpleCell,
  Text,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { formStore } from "../../FormStore";
import { addMonths } from "date-fns";
import { UTCDate } from '@date-fns/utc';
import { useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { VK_RETARGETING_PIXEL_ID } from '../../consants';

export const Result = observer(() => {
  useEffect(() => {
    bridge.send("VKWebAppRetargetingPixel", {
      pixel_code: VK_RETARGETING_PIXEL_ID,
      event: "conversion",
      target_group_id: 58125182,
    });
    // @ts-expect-error VK pixel
    window._tmr?.push({ type: 'reachGoal', id: 3470645, goal: 'result'});
  }, []);

  const result = formStore.result;
  if (!result) {
    return <PanelHeader>Ошибка</PanelHeader>;
  }

  return (
    <>
      <PanelHeader>Результат</PanelHeader>
      <Group>
        <Div>
          <span
            style={{
              display: "block",
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            За отпуск вы получите
          </span>
          <span
            style={{
              display: "block",
              marginTop: 4,
              marginBottom: 16,
              fontSize: 64,
              fontWeight: 500,
              lineHeight: "normal",
            }}
          >
            {new Intl.NumberFormat("ru-RU", {
              style: "currency",
              currency: "RUB",
              compactDisplay: "short",
              maximumFractionDigits: 0,
            }).format(result.vacationSalary)}
          </span>
          <Text>
            В расчетных периодах отпуска вы в сумме получите дополнительно{" "}
            {new Intl.NumberFormat("ru-RU", {
              style: "currency",
              currency: "RUB",
              compactDisplay: "short",
              maximumFractionDigits: 0,
            }).format(result.diff)}{" "}
            к вашей зарплате.{" "}
            {/* <Link href="#">Узнайте, как происходили вычисления. </Link> */}
          </Text>
        </Div>
      </Group>
      <Group header={<Header>Следующие выплаты</Header>}>
        {Object.keys(result.nextSalaries).map((ts) => {
          const date = new UTCDate(+ts);
          const salary = result.nextSalaries[+ts];

          return (
            <SimpleCell multiline key={ts}>
              <InfoRow
                header={new Intl.DateTimeFormat("ru", {
                  month: "long",
                  year: "numeric",
                }).format(date)}
              >
                {new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                  compactDisplay: "short",
                  maximumFractionDigits: 0,
                }).format(salary)}{" "}
              </InfoRow>
            </SimpleCell>
          );
        })}
        <SimpleCell>
          <InfoRow
            header={`${new Intl.DateTimeFormat("ru", {
              month: "long",
              year: "numeric",
            }).format(
              addMonths(+(Object.keys(result.nextSalaries).pop() ?? "") ?? 0, 1)
            )} и далее`}
          >
            Без изменений
          </InfoRow>
        </SimpleCell>
      </Group>
      <Footer>
        Расчет суммы отпускных и последующих начислений заработной платы
        примерный и может не совпадать с реальным.
      </Footer>
    </>
  );
});
