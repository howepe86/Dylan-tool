/** Dev-only auth bypass — never enable in production. */
export function isDevAuthBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.DEV_BYPASS_AUTH === "true"
  );
}

export function isDevAuthBypassEnabledClient(): boolean {
  return process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true";
}

export function getDevMockUserId(): string {
  return (
    process.env.DEV_MOCK_USER_ID ?? "00000000-0000-0000-0000-000000000001"
  );
}

export function getDevMockUserEmail(): string {
  return process.env.DEV_MOCK_USER_EMAIL ?? "dev@local.test";
}

export type AppUser = {
  id: string;
  email: string;
};

export function getDevMockUser(): AppUser {
  return {
    id: getDevMockUserId(),
    email: getDevMockUserEmail(),
  };
}
