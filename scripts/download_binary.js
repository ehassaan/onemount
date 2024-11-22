
import fs from 'fs/promises';
import { dirname } from 'path';
import unzipper from "unzipper";
import "zlib";

const version = "1.68.1";

const osMap = {
    windows: "win32",
    linux: "linux",
    osx: "darwin"
};

const architectures = ["amd64", "arm64"];
const template_url = "https://downloads.rclone.org/v<version>/rclone-v<version>-<os>-<arch>.zip";

async function download(url, path) {
    console.log("Downloading: ", url);

    const res = await fetch(url);
    const directory = await unzipper.Open.buffer(Buffer.from(await res.arrayBuffer()));
    const file = directory.files.find(d => d.path.endsWith("rclone") || d.path.endsWith("rclone.exe"));
    const content = await file.buffer();
    try {
        fs.access(dirname(path));
    }
    catch {
        await fs.mkdir(dirname(path), { recursive: true });
    }
    await fs.writeFile(path, content);
    console.log("Downloaded to: ", path);
}

for (const os of Object.keys(osMap)) {
    for (const arch of architectures) {
        let url = template_url.replaceAll("<version>", version).replaceAll("<os>", os).replaceAll("<arch>", arch);

        await download(url, `./lib/${osMap[os]}/${arch}/rclone${os === "windows" ? ".exe" : ""}`);
    }
}