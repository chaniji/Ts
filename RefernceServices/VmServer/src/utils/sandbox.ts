import vm from "node:vm";

export function executeCode(code: string, timeoutMs = 5000) {
  const out: string[] = [];
  const sandbox = {
    console: { log: (...a: unknown[]) => out.push(a.map(String).join(" ")) },
  };
  vm.createContext(sandbox);

  try {
    const result = vm.runInContext(code, sandbox, { timeout: timeoutMs });
    return { stdout: out.join("\n"), result, error: null };
  } catch (e: any) {
    return { stdout: out.join("\n"), result: null, error: e.message };
  }
}
