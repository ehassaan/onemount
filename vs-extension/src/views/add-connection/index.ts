
import { readFileSync } from "fs";
import hb from "handlebars";

export interface AddConnectionOptions {
    fields: { label: string, id: string; }[];
}

export function getTemplate() {
    const file = readFileSync(`${__dirname}/views/add-connection/index.html`).toString("utf8");
    return hb.compile(file);
}

