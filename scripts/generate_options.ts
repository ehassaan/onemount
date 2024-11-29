
import { write } from 'bun';
import { RClone } from "../src/RClone";
import { mkdir } from "node:fs/promises";

const rclone = new RClone();

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

async function getAllOptions(remote: string) {
    const args = ["config", "create", "test", remote, "--non-interactive", "--all", "--dry-run", "config_fs_advanced=true"];
    const props = await getOptions(args, []);
    return props;
}

async function getOptions(args: string[], props: any[]) {
    try {
        const res = await rclone.runCommand(args, 10000);
        if (!res.stdout.includes("Option")) {
            return props;
        }
        const result = JSON.parse(res.stdout);
        props.push(result.Option);
        return await getOptions([...args, `${result.Option.Name}=`], props);
    }
    catch (e) {
        console.log("Error: ", e);
        return props;
    }

}

let backends: any = {};

async function main() {
    for (const b of await checkBackends()) {
        const res = await getAllOptions(b.name);
        console.log("ALL Props: ", b.name, res.length);
        backends[b.name] = {
            ...b,
            options: Object.fromEntries(res.map(opt => [opt.Name, opt]))
        };
    }
    console.log(Object.keys(backends));

    try {
        mkdir(`${__dirname}/../assets/`, { recursive: true });
    }
    catch { }
    write(`${__dirname}/../assets/options.json`, JSON.stringify(backends, null, 4));
}

await main();
