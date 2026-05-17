import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

/**
 * Apple Pay domain verification for Stripe (embedded Checkout on your domain).
 * 1) Stripe Dashboard → Settings → Payment methods → Apple Pay → Add domain.
 * 2) Paste the downloaded file body into STRIPE_APPLE_PAY_DOMAIN_ASSOCIATION (Vercel / .env.local),
 *    or drop the same file at public/.well-known/apple-developer-merchantid-domain-association (no extension).
 */
export async function GET() {
  const fromEnv = process.env.STRIPE_APPLE_PAY_DOMAIN_ASSOCIATION?.trim();
  if (fromEnv) {
    return new NextResponse(fromEnv, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  try {
    const path = join(
      process.cwd(),
      "public",
      ".well-known",
      "apple-developer-merchantid-domain-association",
    );
    const body = await readFile(path, "utf8");
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Not configured", { status: 404 });
  }
}
