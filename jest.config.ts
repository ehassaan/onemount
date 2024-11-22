
import { JestConfigWithTsJest } from "ts-jest";

export default {
  moduleDirectories: [
    "node_modules",
    "src"
  ],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  globals: {
    window: {}
  },
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
} as JestConfigWithTsJest;