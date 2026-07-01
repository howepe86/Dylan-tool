export const DEMO_EMAIL =
  process.env.DEMO_LOGIN_EMAIL ?? "demo@clientledger.app";
export const DEMO_PASSWORD =
  process.env.DEMO_LOGIN_PASSWORD ?? "DemoPass123!";

export function isDemoModeEnabled(): boolean {
  return process.env.DEMO_MODE === "true";
}
