
import { RollupOptions, Plugin, ObjectHook } from "rollup";
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
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
