import { basename } from "path";

const args = process.argv
  .slice(2)
  .filter((arg) => arg.startsWith("--"))
  .map((arg) => {
    const [key, value] = arg.slice(2).split("=");
    if (value) {
      return [key, value];
    } else {
      return [key, true];
    }
  });

const version =
  process.argv.slice(2).find((arg) => !arg.startsWith("--")) || "canary";

const options = Object.fromEntries(args);

if (options.help || !version) {
  console.log(
    `Usage: get-bun-zip <version, default "canary"> --platform=<${process.platform}> --arch=${process.arch}  [--profile]`
  );
  process.exit(0);
}

const platform = options.platform || process.platform;
let arch = options.arch || process.arch;
const profile = options.profile || false;

if (arch === "arm64") {
  arch = "aarch64";
}

const url = `https://github.com/oven-sh/bun/releases/download/${
  version === "canary"
    ? "canary"
    : version === "latest"
    ? "latest"
    : `bun-v${version}`
}/${profile ? "bun-profile" : "bun"}-${platform}-${arch}.zip`;

const filename = basename(url);

console.log("Downloading bun from", url);
console.time("Downloaded ./" + filename + ` (${version})`);
const response = await fetch(url);
if (!response.ok) {
  console.error("Failed to download bun:", await response.text());
  process.exit(1);
}

if ("Bun" in globalThis) {
  await Bun.write(filename, response);
} else {
  const buffer = await response.arrayBuffer();
  (await import("fs")).writeFileSync(filename, buffer);
}
console.timeEnd("Downloaded ./" + filename + ` (${version})`);
