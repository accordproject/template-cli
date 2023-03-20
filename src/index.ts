const { Command } = require("commander");
const figlet = require("figlet");
import { generateCommand } from "./ten-generate";

const program = new Command();

console.log(figlet.textSync("Template Manager"));

program
    .version('1.0.0')
    .name('ten')
    .command('generate <templateFile> <modelFile> <dataJson> <outputFormat> <outputDir>')
    .alias('gen')
    .description('Generate a document from a template')
    .action(generateCommand);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parseAsync(process.argv);