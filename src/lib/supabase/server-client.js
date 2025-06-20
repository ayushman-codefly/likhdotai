import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// server component can only get cookies and not set them, hence the "component" check
export function createSupabaseServerClient(component = false) {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          if (component) return;
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          });
        },
      },
    }
  );
}

export function createSupabaseServerComponentClient() {
  cookies()
    .then(cookieStore => {
      cookieStore.getAll();
    })
    .catch(err => {
      return createSupabaseServerClient(false);
    })
  return createSupabaseServerClient(true);
}

export function createSupabaseReqResClient(
  req,
  res
) {
  cookies()
    .then(cookieStore => {
      cookieStore.getAll();
    })
    .catch(err => {
      return createSupabaseServerClient(false);
    })
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );
}