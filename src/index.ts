#!/usr/bin/env node
const figlet = require("figlet");
import { Argument, program } from '@commander-js/extra-typings';
import { compileCommandHandler } from './ten-compile';
import { generateCommandHandler } from './ten-generate';

console.log(figlet.textSync('Template Manager'));

program
    .version('1.0.0')
    .name('ten')
    .command('generate')
    .alias('gen')
    .description('Generate a document from a template')
    .argument('<templateDir>', 'path to template directory')
    .argument('<dataFile>', 'path to JSON data file')
    .addArgument(new Argument('<outputFormat>', 'output file format').choices(['pdf', 'markdown', 'html']))
    .argument('<outputFile>', 'path to output file')
    .option('--libraryFile [value]', 'path to library file')
    .option('--now [value]', 'date/time to use for \'now\' (ISO-8601 format)')
    .option('--verbose', 'verbose output')
    .action(generateCommandHandler);

program
    .command('compile')
    .description('Compile a template to TypeScript code')
    .argument('<templateDir>', 'path to template directory')
    .argument('<outputDir>', 'path to output directory')
    .option('--verbose', 'verbose output')
    .action(compileCommandHandler);

async function run() {
    await program.parseAsync();

    if (!process.argv.slice(2).length) {
        program.outputHelp();
    }    
}

run();