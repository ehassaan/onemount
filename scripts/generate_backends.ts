

import { write } from 'bun';
import { RClone } from "../src/RClone";

async function checkBackends() {
    const rclone = new RClone();
    const res = await rclone.runCommand(["help", "backends"]);
    console.log(res);
    let lines = res.stdout.split("\n").slice(2);
    const backends: { name: string, description: string; }[] = [];
    for (let line of lines) {
        if (line.length === 0) break;
        if (!line.startsWith("  ")) break;
        line = line.slice(2);
        const name = line.slice(0, line.indexOf(" ")).trim();
        const description = line.slice(line.indexOf(" ")).trim();
        backends.push({
            name,
            description
        });
    }
    return backends;
}

checkBackends().then(res => {
    console.log("ALL BACKENDS: ", res);
    write(`${__dirname}/../assets/backends.json`, JSON.stringify(res, null, 4));
});