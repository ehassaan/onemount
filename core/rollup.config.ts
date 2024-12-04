
import { RollupOptions } from "rollup";
import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import alias from '@rollup/plugin-alias';
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import path from "node:path";
import { fileURLToPath } from "url";
import { builtinModules } from 'module';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = [
    {
        plugins: [
            // del({ targets: 'dist', hook: "buildStart" }),
            json(),
            typescript({
                tsconfig: "./tsconfig.json",
                declaration: true,
                declarationMap: true,
                declarationDir: "./dist/"
            }),
            copy({
                targets: [{
                    src: "./lib/*",
                    dest: "dist/lib/"
                }, {
                    src: "./assets/*",
                    dest: "dist/assets/"
                }],
                hook: "buildStart"
            })
        ],
        external: [...builtinModules, "child_process", "node:child_process"],
        input: 'src/main.ts',
        output: {
            name: 'ducklake',
            file: 'dist/index.js',
            format: 'cjs',
            // globals: {
            //     "node:child_process": "$cp"
            // }
        },

    },
    {
        plugins: [
            json(),
            alias({
                entries: [
                    { find: /@\/(.*)$/, replacement: path.resolve(__dirname, 'dist/src', '$1') },
                ]
            }),
            dts(),
            // del({ targets: 'dist/typings', hook: 'buildEnd' })
        ],
        input: 'dist/src/main.d.ts',
        output: {
            format: 'es',
            file: 'dist/index.d.ts',
        },
    },
] as RollupOptions;
export default config;
