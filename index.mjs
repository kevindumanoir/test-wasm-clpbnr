import SWIPL from 'swipl-wasm'
import { readFileSync } from 'fs';

function loadFiles(module) {
    const plFiles = [
        "clpBNR/prolog/clpBNR.pl",
        "clpBNR/prolog/clpBNR/ia_primitives.pl",
        "clpBNR/prolog/clpBNR/ia_simplify.pl",
        "clpBNR/prolog/clpBNR/ia_utilities.pl",
        'test-clpbnr.pl',
      ];
    module.FS.mkdir('/clpBNR');
    for (const file of plFiles) {
        console.log(`Loading ${JSON.stringify(file)}`);
        module.FS.writeFile(`/${file.replace('clpBNR/prolog/', '')}`, readFileSync(file));
    }
    console.log("Validating file tree: ");
    const rootDir = '/';
    const files = module.FS.readdir(rootDir);
    files.forEach(file => {
        try {
            const stat = module.FS.stat(`${rootDir}${file}`);
            const type = stat.isDirectory() ? 'directory' : 'file';
            console.log(`- ${file} (${type})`);
        } catch (e) {
            console.log(`- ${file} (error reading stats)`);
        }
    });
}

async function main() {
    const swipl = await SWIPL({ /*arguments: ['-q'],*/ preRun: loadFiles });
    console.log(swipl.prolog.call("consult('/test-clpbnr.pl')."));
    const pmtQuery = swipl.prolog.query('Rate::real, pmt(Rate / 12, 24, -75000, 0, pmt_end, 3240), { Rate >= 0.01 }, solve(Rate), print(Rate).');
    console.log(JSON.stringify([pmtQuery.once(), pmtQuery.once(), pmtQuery.once()]));
    console.log(JSON.stringify(swipl.prolog.query('{ X - 2 == 0}.').once()));
}

await main();
