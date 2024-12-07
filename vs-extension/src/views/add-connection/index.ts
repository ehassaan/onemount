
import { readFileSync } from "fs";
import ejs from "ejs";
import { BackendOption } from "@ducklake/core";


export interface AddConnectionOptions {
    fields: BackendOption[];
}


export function getTemplate() {
    const file = readFileSync(`${__dirname}/views/add-connection/index.ejs`).toString("utf8");
    return ejs.compile(file);
}

