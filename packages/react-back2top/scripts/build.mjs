import {execSync} from 'node:child_process';
import {rmSync, writeFileSync} from 'node:fs';

const run = (cmd) => execSync(cmd, {stdio: 'inherit'});

rmSync('lib', {recursive: true, force: true});
run('tsc -p tsconfig.build.json');
writeFileSync('lib/esm/package.json', '{"type":"module"}\n');
run('tsc -p tsconfig.build.json --module node16 --moduleResolution node16 --outDir lib/cjs --declaration false');
writeFileSync('lib/cjs/package.json', '{"type":"commonjs"}\n');
