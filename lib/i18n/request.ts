import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const headerLocale = headerStore.get("x-locale");
  const cookieLocale = cookieStore.get("locale")?.value;
  const locale = headerLocale ?? cookieLocale ?? "ja";
  const validLocale = ["ja", "en"].includes(locale) ? locale : "ja";

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default,
  };
});
