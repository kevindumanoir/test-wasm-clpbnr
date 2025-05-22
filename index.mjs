import SWIPL from 'swipl-wasm'
import { readFileSync } from 'fs';

function loadFiles(module) {
    const plFiles = [
        "clpBNR/clpBNR.pl",
        "clpBNR/clpBNR/ia_primitives.pl",
        "clpBNR/clpBNR/ia_simplify.pl",
        "clpBNR/clpBNR/ia_utilities.pl",
        'test-clpbnr.pl',
      ];
    module.FS.mkdir('/clpBNR');
    module.FS.mkdir('/clpBNR/clpBNR');
    for (const file of plFiles) {
        console.log(`Loading ${JSON.stringify(file)}`);
        module.FS.writeFile(`/${file}`, readFileSync(file));
    }
    console.log("Validating file tree: ");
    const rootDir = '/';
    plFiles.forEach(file => {
        try {
            const stat = module.FS.stat(`${rootDir}${file}`);
            console.log(`- ${file} (size ${stat.size} B)`);
        } catch (e) {
            console.log(`- ${file} (error reading stats ${e.toString()})`);
        }
    });
}

async function main() {
    const swipl = await SWIPL({ /*arguments: ['-q'],*/ preRun: loadFiles });
    console.log(swipl.prolog.call("consult('/test-clpbnr.pl')."));
    const pmtQuery = swipl.prolog.query('Rate::real, pmt(Rate / 12, 24, -75000, 0, pmt_end, 3240), { Rate >= 0.01 }, solve(Rate), midpoint(Rate, RateVal).');
    console.log(JSON.stringify([pmtQuery.once(), pmtQuery.once(), pmtQuery.once()]));
    console.log(JSON.stringify(swipl.prolog.query('{ X - 2 == 0}.').once()));
}

await main();
