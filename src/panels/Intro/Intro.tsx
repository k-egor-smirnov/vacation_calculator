import { Button, ButtonGroup, Placeholder, Tooltip } from "@vkontakte/vkui";
import { Icon56CoinsStacks3Outline } from "@vkontakte/icons";
import { formStore } from '../../FormStore';

export function Intro() {
  return (
    <>
      <Placeholder
        icon={<Icon56CoinsStacks3Outline />}
        header="Калькулятор отпускных"
        action={
          <ButtonGroup mode="vertical">
            <Button
              size="m"
              stretched
              onClick={() => {
                localStorage.setItem("intro_complete", "1");
                formStore.nextStep();
              }}
            >
              Начать
            </Button>
            <Tooltip
              text={
                <>
                  {"Вход позволяет сохранять настройки между устройствами. Данные "}
                  <b>анонимны</b>
                  {", сохраняются только расчеты."}
                  <br/>
                </>
              }
            >
              <Button size="m" stretched mode="outline">
                Войти через passkey
              </Button>
            </Tooltip>
          </ButtonGroup>
        }
      >
        Этот калькулятор поможет не потерять деньги за отпуск
      </Placeholder>
    </>
  );
}
