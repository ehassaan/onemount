
import { RollupOptions, Plugin, ObjectHook } from "rollup";
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import { builtinModules } from 'module';
import { readFileSync, writeFileSync } from 'fs';


const config = [
    {
        plugins: [
            del({ targets: 'out/*', hook: 'buildStart' }),
            typescript(),
            json(),
            nodeResolve({ preferBuiltins: true }),
            commonjs({
                // ignoreDynamicRequires: true
            }),
            copy({
                hook: "buildEnd",
                flatten: false,
                targets: [
                    {
                        src: "node_modules/duckdb/lib/*",
                        dest: "lib/"
                    },
                    {
                        src: "assets/*",
                        dest: "out/assets/"
                    },
                    {
                        src: "src/views/**/*",
                        dest: "out/"
                    },
                ]
            }),
        ],
        external: [
            ...builtinModules,
            "vscode",
        ],
        input: 'src/index.ts',
        output: {
            file: 'out/index.js',
            format: 'cjs',
        },
    },
] as RollupOptions;
export default config;
