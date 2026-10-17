import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defaultAgentDir } from "../../maestro/core/host-cli.ts";

const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

export function getAgentConfigDir(): string {
	return defaultAgentDir();
}

export function getSubagentsConfigDir(): string {
	return join(getAgentConfigDir(), "herdr-agents");
}

export function getSubagentsConfigPath(): string {
	return join(getSubagentsConfigDir(), "config.json");
}

export function getSubagentsConfigExamplePath(): string {
	return join(PACKAGE_ROOT, "config.json.example");
}

export function getSubagentsPackageRoot(): string {
	return PACKAGE_ROOT;
}
