
export function mergeCRDT(state: any, event: any, strategy: string) {
  if (event.type === "INCREMENT") {
    return {
      ...state,
      value: state.value + event.amount,
    };
  }
  if (event.type === "DECREMENT") {
    return {
      ...state,
      value: state.value - event.amount,
    };
  }
  return state;
}
