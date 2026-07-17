import { spawn } from "child_process";

export interface CommandOptions {
    name: string;
    command: string;
    exitCode?: number;
    duration?: number;
    succeeded?: boolean;
}

export async function runCommand(
    name: string,
    command: string,
    args: string[] = [],
): Promise<CommandOptions> {
    const start = Date.now();
    console.log(`\n ${name}`);
    
    const exitCode = await new Promise<number>((resolve, reject) => {
        const childProcess = spawn(command, args, { stdio: "inherit", shell: process.platform === "win32", env: process.env });

        childProcess.on("close", (code) => {
            resolve(code ?? 1);
        });
        childProcess.on("error", reject);
    });
    const result: CommandOptions = {
        name,
        command: [command, ...args].join(" "),
        exitCode,
        duration: Date.now() - start,
        succeeded: exitCode === 0,
    };
    console.log(
        result.succeeded
            ? `✅ ${name} succeeded in ${result.duration}ms`
            : `❌ ${name} failed with exit code ${exitCode} in ${result.duration}ms`,
    )
    return result;
}