
import { readFileSync } from "fs";
import hb from "handlebars";
import { BackendOption } from "@ducklake/core";


export interface AddConnectionOptions {
    fields: BackendOption[];
}

export function getTemplate() {
    const file = readFileSync(`${__dirname}/views/add-connection/index.html`).toString("utf8");
    return hb.compile(file);
}

