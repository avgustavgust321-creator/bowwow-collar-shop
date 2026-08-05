/**
 * Запуск дев-сервера с гарантированным `node` в PATH.
 *
 * Node установлен в ~/.local/node и не прописан в системном PATH,
 * а Turbopack поднимает дочерние процессы командой `node` — без этой
 * обёртки сборка CSS падает с «spawning node pooled process».
 *
 * Обычный `npm run dev` из терминала работает и без неё.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nodeBinDir = path.dirname(process.execPath);

const child = spawn(
  process.execPath,
  [path.join(projectRoot, "node_modules/next/dist/bin/next"), "dev", ...process.argv.slice(2)],
  {
    cwd: projectRoot,
    stdio: "inherit",
    env: { ...process.env, PATH: `${nodeBinDir}:${process.env.PATH ?? ""}` },
  },
);

// Пробрасываем сигналы, иначе при остановке обёртки дев-сервер
// остаётся висеть и занимать порт.
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code) => process.exit(code ?? 0));
