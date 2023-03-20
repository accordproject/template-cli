const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const figlet = require("figlet");

const program = new Command();

console.log(figlet.textSync("Template Manager"));

program
    .version('1.0.0')
    .command('generate <templateFile> <modelFile> <dataJson> <outputFormat> <outputDir>')
    .alias('gen')
    .description('Generate a document from a template')
    .action((templateFile:string, modelFile:string, dataJson:string, outputFormat:string, outputDir:string) => {
        console.log('clone command called');
    });

if (!process.argv.slice(2).length) {
    program.outputHelp();
}