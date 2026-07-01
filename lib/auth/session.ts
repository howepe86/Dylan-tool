import type { User } from "@supabase/supabase-js";

import {
  getDevMockUserEmail,
  getDevMockUserId,
  isDevAuthBypassEnabled,
  type AppUser,
} from "@/lib/auth/dev-bypass";
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";

let cachedDevUser: AppUser | null = null;

function toAppUser(user: User): AppUser {
  return { id: user.id, email: user.email ?? "user@unknown.test" };
}

async function resolveDevMockUser(): Promise<AppUser> {
  if (cachedDevUser) return cachedDevUser;

  if (process.env.DEV_MOCK_USER_ID) {
    cachedDevUser = {
      id: getDevMockUserId(),
      email: getDevMockUserEmail(),
    };
    return cachedDevUser;
  }

  try {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
    const first = data.users[0];
    if (first) {
      cachedDevUser = {
        id: first.id,
        email: first.email ?? getDevMockUserEmail(),
      };
      return cachedDevUser;
    }
  } catch {
    // fall through to placeholder
  }

  cachedDevUser = {
    id: getDevMockUserId(),
    email: getDevMockUserEmail(),
  };
  return cachedDevUser;
}

/** Real Supabase session only (for marketing / login pages). */
export async function getSessionUser(): Promise<AppUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? toAppUser(user) : null;
}

/**
 * Current app user — in dev bypass returns a mock user when no session exists
 * so dashboard and APIs work without real login.
 */
export async function getAuthUser(): Promise<AppUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return toAppUser(user);

  if (isDevAuthBypassEnabled()) {
    return resolveDevMockUser();
  }

  return null;
}

/** Supabase client for data access — uses service role in dev bypass when unauthenticated. */
export async function getDataClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user || !isDevAuthBypassEnabled()) {
    return supabase;
  }

  return createAdminClient();
}
