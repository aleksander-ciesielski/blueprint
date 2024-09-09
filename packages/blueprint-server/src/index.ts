import "dotenv/config";
import "reflect-metadata";

import("~/Application").then(({ Application }) => Application.setup());
