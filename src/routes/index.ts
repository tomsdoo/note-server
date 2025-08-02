import yamljs from "yamljs";
import { readFile } from "fs/promises";
import type { Context, Next } from "koa";

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Swagger UI</title>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.25.3/swagger-ui.css"
    />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.25.3/swagger-ui-bundle.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.25.3/swagger-ui-standalone-preset.js"></script>
    <style>
      #swagger-ui .topbar {
        display: none;
      }
    </style>

    <script>
      %SPECLINES%

      window.onload = function () {
        window.ui = SwaggerUIBundle({
          spec: swaggerSpec,
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          plugins: [SwaggerUIBundle.plugins.DownloadUrl],
          layout: 'StandaloneLayout'
        })

        //</editor-fold>
      }
    </script>
  </head>

  <body>
    <div id="swagger-ui"></div>
  </body>
</html>
`;

async function generateHtml() {
  const yamlFilePath = process.env.OPENAPI_YAML ?? "docs/openapi.yml";
  const content = await readFile(yamlFilePath, { encoding:"utf8" });
  const obj = yamljs.parse(content);
  return html.replace(/%SPECLINES%/, `const swaggerSpec = ${JSON.stringify(obj, null, 2)};`);
}

export async function get(ctx: Context, next: Next) {
  ctx.response.type = "text/html";
  ctx.response.body = await generateHtml();
  await next();
}
