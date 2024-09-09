import type { Logger as WinstonLogger } from "winston";
import {
  createLogger, format, transports, addColors,
} from "winston";

addColors({
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "green",
});

const customColorize = format.printf(({
  level, message, timestamp,
}) => (message.includes("specialWord")
  ? `\x1B[35m[${timestamp}] [${level}]: ${message}\x1B[0m`
  : `[${timestamp}] [${level}]: ${message}`));

export class Logger {
  public static for(serviceName: string): Logger {
    return new Logger(serviceName);
  }

  private readonly logger: WinstonLogger;

  public constructor(private readonly serviceName: string) {
    this.logger = createLogger({
      level: "info",
      format: format.combine(
        format.colorize({ all: true }),
        format.timestamp(),
        customColorize,
      ),
      transports: [new transports.Console()],
    });
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.log("info", message, meta);
  }

  public error(message: string, meta?: Record<string, unknown>): void {
    this.log("error", message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.log("warn", message, meta);
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    this.log("debug", message, meta);
  }

  private log(
    level: "info" | "error" | "warn" | "debug",
    message: string,
    meta?: Record<string, unknown>,
  ): void {
    this.logger.log(
      level,
      `[${this.serviceName}] ${message}`,
      meta,
    );
  }
}
