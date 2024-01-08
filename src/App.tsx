import {
  AdaptivityProvider,
  AppRoot,
  Button,
  ButtonGroup,
  ConfigProvider,
  Div,
  FixedLayout,
  Panel,
  PanelHeader,
  Root,
  SplitCol,
  SplitLayout,
  View,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import { observer } from "mobx-react-lite";
import { Intro } from "./panels/Intro/Intro";
import { formStore } from "./FormStore";
import { BasicData } from "./panels/BasicData/BasicData";
import { Dates } from "./panels/Dates/Dates";
import { Result } from "./panels/Result/Result";

const App = observer(() => {
  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout header={<PanelHeader delimiter="none" />}>
            <SplitCol autoSpaced>
              <Root activeView={formStore.step === "intro" ? "intro" : "main"}>
                <View nav="intro" activePanel="intro">
                  <Panel nav="intro" centered>
                    <Intro />
                  </Panel>
                </View>
                <View nav="main" activePanel={formStore.step}>
                  <Panel nav="dates" style={{ paddingBottom: 60 }}>
                    <Dates />
                    <div style={{ height: 68 }}></div>
                  </Panel>
                  <Panel nav="basic">
                    <BasicData />
                    <div style={{ height: 68 }}></div>
                  </Panel>
                  <Panel nav="result">
                    <Result />
                    <div style={{ height: 68 }}></div>
                  </Panel>
                </View>
              </Root>
              {formStore.step !== "intro" && (
                <FixedLayout vertical="bottom" filled>
                  <Div>
                    <ButtonGroup stretched>
                      <Button
                        stretched
                        size="l"
                        mode="secondary"
                        onClick={() => formStore.prevStep()}
                      >
                        Назад
                      </Button>
                      <Button
                        stretched
                        size="l"
                        disabled={!formStore.isNextStepAvailable}
                        onClick={() => formStore.nextStep()}
                      >
                        Дальше
                      </Button>
                    </ButtonGroup>
                  </Div>
                </FixedLayout>
              )}
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
});

export default App;
