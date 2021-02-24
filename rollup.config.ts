import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import * as glob from 'glob'
import * as path from 'path'

const pkg = require('./package.json')

const libraryName = 'ts-iterable-functions'

const externals = ["tslib", "ts-functional-pipe", "ts-comparer-builder"]

const umdGlobals = externals => externals.map(moduleName => [moduleName, camelCase(moduleName)]).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})

const files = glob.sync("src/**/*.ts")
  .map(f => ({ parsed: path.parse(f), path: f }))
  .map(f => ({ jsPath: path.relative("src", path.join(`${f.parsed.dir}`, `${f.parsed.name}`)), filePath: f.path }))
  .reduce((acc, { jsPath, filePath }) => ({ ...acc, [jsPath]: filePath }), {})

console.log(JSON.stringify(files, null, 2))

export default {
  input: files,
  output: [
    //{ dir: "umd", name: camelCase(libraryName), format: 'umd', sourcemap: true, globals: umdGlobals(externals) },
    { dir: "lib", format: 'cjs', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: externals,
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),

    // Resolve source maps to the original source
    sourceMaps(),
  ]
}
