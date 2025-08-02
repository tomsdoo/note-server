import type { Context, Next } from "koa";
import * as v from "valibot";
import { getNotes, upsertNote } from "@/modules/notes";

const Body = v.object({
  body: v.string(),
  id: v.optional(v.string()),
  subject: v.optional(v.string()),
});

export async function get(ctx: Context, next: Next) {
  ctx.response.body = {
    notes: await getNotes(),
  };
  await next();
}

export async function post(ctx: Context, next: Next) {
  const { success, output: body } = v.safeParse(Body, ctx.request.body);
  if (success === false) {
    ctx.throw(400);
  }
  ctx.response.body = {
    note: await upsertNote(body),
  };
  await next();
}
