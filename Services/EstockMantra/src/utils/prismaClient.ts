import { PrismaClient } from "@prisma/client";
import { log } from "./logger.js";
const prisma = new PrismaClient();
log.info("Prisma CLient Created");
export default prisma;
