import { Step, formStore } from "./FormStore";

export function useFormProcessor<T extends Step>(step: T) {
  return formStore.processors[step];
}
