import {
  Button,
  Card,
  CardGrid,
  Div,
  Group,
  Header,
  Headline,
  InfoRow,
  Link,
  MiniInfoCell,
  PanelHeader,
  SimpleCell,
  Text,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { formStore } from "../../FormStore";

export const Result = observer(() => {
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
            Вы получите дополнительно 13 412₽ к вашей зарплате.{" "}
            <Link href="#">Узнайте, как происходили вычисления.</Link>
          </Text>
        </Div>
      </Group>
      <Group header={<Header>Следующие выплаты</Header>}>
        {Object.keys(result.nextSalaries).map((ts) => {
          const date = new Date(+ts);
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
      </Group>
    </>
  );
});
