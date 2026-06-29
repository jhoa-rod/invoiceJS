import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const distDir = "dist";
const outputFile = join(distDir, "index.js");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

const extensionOf = (filePath) => {
  const dotIndex = filePath.lastIndexOf(".");
  return dotIndex >= 0 ? filePath.slice(dotIndex) : "";
};

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (fullPath === outputFile) return [];
    if (statSync(fullPath).isDirectory()) return walk(fullPath);
    return [fullPath];
  });

const assets = Object.fromEntries(
  walk(distDir).map((filePath) => {
    const routePath = `/${relative(distDir, filePath).split(sep).join("/")}`;
    const extension = extensionOf(filePath);
    return [
      routePath,
      {
        content: readFileSync(filePath).toString("base64"),
        type: mimeTypes[extension] ?? "application/octet-stream",
      },
    ];
  }),
);

writeFileSync(
  outputFile,
  `const ASSETS = ${JSON.stringify(assets)};\n\n` +
    `const decodeBase64 = (value) => {\n` +
    `  const binary = atob(value);\n` +
    `  const bytes = new Uint8Array(binary.length);\n` +
    `  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);\n` +
    `  return bytes;\n` +
    `};\n\n` +
    `const responseForAsset = (path, asset) => new Response(decodeBase64(asset.content), {\n` +
    `  headers: {\n` +
    `    "content-type": asset.type,\n` +
    `    "cache-control": path.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate",\n` +
    `  },\n` +
    `});\n\n` +
    `export default {\n` +
    `  async fetch(request) {\n` +
    `    const url = new URL(request.url);\n` +
    `    const path = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);\n` +
    `    const asset = ASSETS[path] ?? (path.startsWith("/assets/") ? undefined : ASSETS["/index.html"]);\n` +
    `    if (!asset) return new Response("Not found", { status: 404 });\n` +
    `    return responseForAsset(path, asset);\n` +
    `  },\n` +
    `};\n`,
);

console.log(`Static worker created at ${outputFile}`);
