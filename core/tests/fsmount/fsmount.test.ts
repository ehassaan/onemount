// import { MssqlDataSource } from './data/mssql/MssqlDataSource';
import { FSMount } from '@/FSMount';
import { describe, expect, test } from '@jest/globals';
// import { parse } from "smol-toml";
import { accessSync, mkdirSync, readFileSync, readdirSync, rmSync, rmdirSync, watch } from "node:fs";
import { dirname, join } from 'node:path';
import creds from "../../.env/credentials.json";
import { MountOptions } from '@/MountOptions';

console.log("Working dir: ", process.cwd());

const remoteName = "ducklake-test-1";

const config: MountOptions = {
  type: "s3",
  authType: "KEY",
  remoteUri: "http://localhost:9000/testbucket/",
  localPath: join(process.cwd(), "./.temp/mountdir/testbucket"),
  nativeArgs: {
    provider: "Minio",
    region: "pk-west1",
    access_key_id: creds["accessKey"],
    secret_access_key: creds["secretKey"]
  }
};
const lake = new FSMount(config);


async function testMount(localPath: string) {
  return new Promise((resolve, reject) => {
    const timeoutInt = setTimeout(() => {
      clearTimeout(timeoutInt);
      clearInterval(interval);
      return resolve(false);
    }, 30000);
    // watch(dirname(localPath), { recursive: true }, (ev, file) => {
    const interval = setInterval(() => {
      try {
        accessSync(join(localPath, "data/partitioned/partition=B/MOCK_DATA.csv"));
        clearInterval(interval);
        clearTimeout(timeoutInt);
        return resolve(true);
      }
      catch {
      }

    }, 3000);
  });

}

function parseConfig(text: string) {
  let config: { [key: string]: any; } = {};
  let itemName = "";
  for (const line of text.replaceAll("\r", "").split("\n")) {
    const match = line.match(/\[(.+)\]/);
    if (match && match.length > 0) {
      itemName = match[1];
      config[itemName] = {};
      continue;
    }
    if (!line.includes("=")) continue;
    const [key, value] = line.split("=");
    config[itemName][key.trim()] = value.trim();
  }
  return config;
}

async function readRemote(remoteName: string) {
  const res = await lake.rclone.runCommand(["config", "file"]);
  const path = res.stdout.trim().split("\n").at(-1);
  console.log("Config File: ", path);
  if (!path) return null;
  const text = readFileSync(path).toString("utf-8");
  const toml = parseConfig(text);
  console.log("Remote Value: \n", toml[remoteName]);
  return toml;
}

describe("FSMount", () => {

  test("createRemote", async () => {
    await lake.createRemote(remoteName);
    expect(await readRemote(remoteName)).toBeDefined();
  }, 20000);


  test("testMount", async () => {
    try {
      rmSync(dirname(config.localPath), { recursive: true });
    }
    catch (e) {

    }
    mkdirSync(dirname(config.localPath), { recursive: true });
    await lake.runMountProcess(remoteName, lake.bucket, config.localPath);
    expect(await testMount(config.localPath)).toBeTruthy();
    lake.unmount();
  }, 60000);

});
