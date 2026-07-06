
export function aiOptimizer(state: any, event: any) {
  const intensity = event.amount;
  if (intensity > 3) return "SAFE_MODE";
  if (state.value > 20) return "STABILIZE";
  return "NORMAL";
}
