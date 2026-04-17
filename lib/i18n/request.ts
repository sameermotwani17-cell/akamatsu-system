import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "ja";
  const validLocale = ["ja", "en"].includes(locale) ? locale : "ja";

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default,
  };
});
