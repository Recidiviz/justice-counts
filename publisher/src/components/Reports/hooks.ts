import { useStore } from "../../stores";

export const useCheckMetricForErrors = (reportID: number) => {
  const { formStore } = useStore();

  return (metricKey: string) => {
    let foundErrors = false;

    if (formStore.metricsValues[reportID]?.[metricKey]?.error) {
      foundErrors = true;
    }

    if (formStore.disaggregations[reportID]?.[metricKey]) {
      Object.values(formStore.disaggregations[reportID][metricKey]).forEach(
        (disaggregation) => {
          Object.values(disaggregation).forEach((dimension) => {
            if (dimension.error) {
              foundErrors = true;
            }
          });
        }
      );
    }

    if (formStore.contexts[reportID]?.[metricKey]) {
      Object.values(formStore.contexts[reportID][metricKey]).forEach(
        (context) => {
          if (context.error) {
            foundErrors = true;
          }
        }
      );
    }

    return foundErrors;
  };
};
