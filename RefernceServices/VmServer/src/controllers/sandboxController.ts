import { Request, Response } from "express";
import { executeCode } from "../utils/sandbox.js";

export function executeController(req: Request, res: Response) {
  const { code } = req.body;

  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ error: "missing 'code' string in body" });
  }

  const output = executeCode(code);
  res.json(output);
}
