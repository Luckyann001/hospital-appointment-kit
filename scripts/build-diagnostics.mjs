import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";

const outDir = ".artifacts";
const outFile = `${outDir}/next-build.log`;
mkdirSync(outDir, { recursive: true });

const env = {
  ...process.env,
  CI: "1",
  NEXT_TELEMETRY_DISABLED: "1",
  NEXT_PRIVATE_BUILD_WORKER: "0"
};

const child = spawn("npx", ["next", "build", "--debug"], {
  stdio: ["ignore", "pipe", "pipe"],
  env,
  shell: process.platform === "win32"
});

let logs = "";
child.stdout.on("data", (d) => {
  const s = d.toString();
  logs += s;
  process.stdout.write(s);
});
child.stderr.on("data", (d) => {
  const s = d.toString();
  logs += s;
  process.stderr.write(s);
});

child.on("exit", (code) => {
  if (!logs.trim()) {
    logs = "No build output was produced. This can indicate sandbox/runtime restrictions.\n";
  }
  writeFileSync(outFile, logs);

  if (existsSync(".next/diagnostics")) {
    cpSync(".next/diagnostics", `${outDir}/next-diagnostics`, { recursive: true });
  }

  if (code !== 0) {
    console.error(`\nBuild failed. Diagnostic log: ${outFile}`);
    process.exit(code ?? 1);
  }
  console.log(`\nBuild diagnostics saved to ${outFile}`);
});
