// import { MssqlDataSource } from './data/mssql/MssqlDataSource';
import { FSMount } from '@/FSMount';
import { describe, expect, test } from '@jest/globals';
import { parse } from "smol-toml";
import { readFileSync } from "node:fs";
import { MountOptions } from '@/MountOptions';

const configPath = "~/AppData/Roaming/rclone/rclone.conf";

const lake = new FSMount();

async function readRemote(remoteName: string) {
  const res = await lake.runCommand("config file");
  const path = res.trim().split("\n").at(-1);
  console.log("Config File: ", path);
  const text = readFileSync(path).toString("utf-8");
  console.log("Config file: ", text);
  const toml = parse(text);
  console.log("Remote Value: \n", toml[remoteName]);
  return toml;
}

describe("FSMount", async () => {

  test("createRemote", async () => {
    const remoteName = "ducklake-test-1";
    const config = {
      type: "s3",
      authType: "KEY",
      remoteUri: "",
      localPath: "./",
      nativeArgs: {
        provider: "AWS"
      }
    } as MountOptions;
    await lake.createRemote(remoteName, config);

    expect(await readRemote(remoteName)).toBeDefined();
  });

});
// const sql = tr.translate(query, 10, 2);

// console.log(sql);
