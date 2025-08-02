import type { Context, Next } from "koa";
import * as v from "valibot";
import { deleteNote, getNote, upsertNote } from "@/modules/notes";

const Params = v.object({
  noteId: v.string(),
});

const Body = v.object({
  body: v.string(),
  subject: v.optional(v.string()),
});

export async function get(ctx: Context, next: Next) {
  const { noteId } = v.parse(Params, ctx.params);
  ctx.response.body = {
    note: await getNote(noteId),
  };
  await next();
}

export async function put(ctx: Context, next: Next) {
  const { noteId } = v.parse(Params, ctx.params);
  const { success, output: body } = v.safeParse(Body, ctx.request.body);
  if (success === false) {
    ctx.throw(400);
  }
  ctx.response.body = {
    note: await upsertNote({
      ...body,
      id: noteId,
    }),
  };
  await next();
}

export async function Delete(ctx: Context, next: Next) {
  const { noteId } = v.parse(Params, ctx.params);
  await deleteNote(noteId);
  ctx.response.body = {
    result: true,
  };
  await next();
}
