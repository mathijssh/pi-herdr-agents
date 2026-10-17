/**
 * The Pi-compatible CLI hosting this process: upstream Pi (`pi`) or its fork
 * Oh My Pi (`omp`). Children run under the same CLI as their parent, so the
 * binary, config directory and session-file flag all follow the host.
 */
import { homedir } from "node:os";
import { basename, join } from "node:path";

export interface HostCli {
	/** Executable that launches a child. */
	readonly binary: "pi" | "omp";
	/** Per-user (`~/<dir>/agent`) and per-project (`<cwd>/<dir>`) config directory name. */
	readonly configDirName: ".pi" | ".omp";
	/** Flag that opens the child's session file and appends to it. */
	readonly sessionFlag: "--session" | "--resume";
	/** Whether `sessionFlag` creates a missing file; `omp --resume` refuses one, so it must be seeded. */
	readonly createsMissingSession: boolean;
}

export const PI_CLI: HostCli = {
	binary: "pi",
	configDirName: ".pi",
	sessionFlag: "--session",
	createsMissingSession: true,
};

export const OMP_CLI: HostCli = {
	binary: "omp",
	configDirName: ".omp",
	sessionFlag: "--resume",
	createsMissingSession: false,
};

/** Env override (`pi` or `omp`); otherwise the host is read from the running executable. */
export const HOST_CLI_ENV = "PI_HERDR_AGENTS_CLI";

export function hostCli(
	env: NodeJS.ProcessEnv = process.env,
	execPath: string = process.execPath,
): HostCli {
	const forced = env[HOST_CLI_ENV];
	if (forced === "omp") return OMP_CLI;
	if (forced === "pi") return PI_CLI;
	// omp is a single compiled executable; Pi runs under node.
	return basename(execPath) === "omp" ? OMP_CLI : PI_CLI;
}

/** The host's per-user agent directory, honouring `PI_CODING_AGENT_DIR` (read by both CLIs). */
export function defaultAgentDir(cli: HostCli = hostCli()): string {
	return (
		process.env.PI_CODING_AGENT_DIR ??
		join(homedir(), cli.configDirName, "agent")
	);
}
