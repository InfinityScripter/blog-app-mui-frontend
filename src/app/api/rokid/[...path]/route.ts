// Прокси для агента очков Rokid: их сетевой стек умеет HTTPS только на
// стандартном порту 443, а бэкенд живёт на 8444. Vercel (443) пересылает
// запрос на VDS как есть; тело и авторизация проходят насквозь.
const BACKEND = "https://api.aifirst.us.com:8444/rokid";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function proxy(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const headers: Record<string, string> = {
    "content-type": req.headers.get("content-type") ?? "application/json",
  };
  const authorization = req.headers.get("authorization");
  if (authorization) headers.authorization = authorization;
  const ak = req.headers.get("x-auth-ak");
  if (ak) headers["x-auth-ak"] = ak;

  const res = await fetch(`${BACKEND}/${path.join("/")}`, {
    method: req.method,
    headers,
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await req.arrayBuffer(),
  });
  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export { proxy as GET, proxy as POST };
