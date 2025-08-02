import type { Context, Next } from "koa";

export async function get(ctx: Context, next: Next) {
  ctx.response.body = {
    status: "ok",
  };
  await next();  
}
