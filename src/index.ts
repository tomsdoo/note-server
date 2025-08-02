import { emitKeypressEvents } from "node:readline";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { get as getRoot } from "@/routes/";
import { get as getNotes, post as postNotes } from "@/routes/notes/";
import {
  Delete as deleteNote,
  get as getNote,
  put as putNote,
} from "@/routes/notes/_noteId/";
import { get as getStatus } from "@/routes/status/";

void (async () => {
	const app = new Koa();
  app.use(bodyParser());
  const router = new Router();
  const port = Number(process.env.PORT ?? 3000);
  app.use(async (ctx, next) => {
    const started = new Date();
    const startTime = started.getTime();
    await next();
    const endTime = Date.now();
    console.log(
      `${started.toISOString()} ${ctx.response.status} ${ctx.request.method} ${ctx.request.url} ${endTime - startTime}ms`,
    );
  });

  router.get("/", getRoot);
	router.get("/status", getStatus);
  router.get("/notes", getNotes);
  router.post("/notes", postNotes);
  router.get("/notes/:noteId", getNote);
  router.put("/notes/:noteId", putNote);
  router.delete("/notes/:noteId", deleteNote);

  app.use(router.routes());
  app.use(router.allowedMethods());
  const server = app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`listening ${port}`);

    function showHelp() {
      console.log("");
      console.log("available keys:");
      console.log("\t- u : show url");
      console.log("\t- q : quit");
      console.log("");
    }
    showHelp();

    emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on("keypress", (_code, key) => {
      if ((key.ctrl && key.name === "c") || key.name === "q") {
        server.close();
        process.exit();
      }
      if (key.name === "u") {
        console.log(url);
      }
      showHelp();
    });
  });
})();
