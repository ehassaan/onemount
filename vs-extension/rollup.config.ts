
import { RollupOptions, Plugin, ObjectHook } from "rollup";
import typescript from '@rollup/plugin-typescript';
import copy from "rollup-plugin-copy";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import { builtinModules } from 'module';


const config: RollupOptions[] = [
    {
        plugins: [
            typescript(),
            json(),
            nodeResolve({ preferBuiltins: true }),
            commonjs({
                // ignoreDynamicRequires: true
            }),
            copy({
                targets: [{
                    src: "node_modules/@ducklake/core/dist/lib/*",
                    dest: "out/lib/"
                }],
                hook: "buildEnd"
            })
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
];
export default config;
