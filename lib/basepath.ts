/**
 * The basePath from next.config.ts, available at runtime.
 * Use this to prefix raw URLs that bypass Next.js (EventSource, fetch calls).
 * Next.js <Link> and <Image> handle basePath automatically — don't prefix those.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
