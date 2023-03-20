import * as path from 'path';
import * as fs from 'fs';
import dayjs from 'dayjs';

import { ModelManager } from "@accordproject/concerto-core";
import { TemplateMarkInterpreter } from '@accordproject/template-engine';
import { TemplateMarkTransformer } from '@accordproject/markdown-template';
import { transform } from '@accordproject/markdown-transform';

export async function generateCommandHandler(templateDir: string, dataFile: string, outputFormat: string, outputFile: string, options: { libraryFile?: string | true | undefined; now?: string | true | undefined; verbose?: true | undefined; }) {
    
    const template = fs.readFileSync(path.join(templateDir, 'template.md'), 'utf-8');
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    
    const ctoFileNames = fs.readdirSync(templateDir, { withFileTypes: true })
        .filter(item => !item.isDirectory() && item.name.endsWith('.cto'))
        .map(item => item.name);

    const modelManager = new ModelManager({ strict: true });
    ctoFileNames.forEach( ctoFile => {
        modelManager.addCTOModel(fs.readFileSync(path.join(templateDir, ctoFile), 'utf-8'), ctoFile, true);
    })
    await modelManager.updateExternalModels();

    const clauseLibrary = options.libraryFile ? JSON.parse(fs.readFileSync(options.libraryFile as string, 'utf-8')) : {};
    
    if(options.verbose) {
        console.log('Library:');
        console.log(clauseLibrary);
    }

    const engine = new TemplateMarkInterpreter(modelManager, clauseLibrary);
    const templateMarkTransformer = new TemplateMarkTransformer();
    const templateMarkDom = templateMarkTransformer.fromMarkdownTemplate({ content: template }, modelManager, 'contract', { verbose: options.verbose });

    if(options.verbose) {
        console.log('TemplateMark DOM:');
        console.log(JSON.stringify(templateMarkDom, null, 2));
    }

    const genNow = options.now ? dayjs(options.now as string) : dayjs();

    if(options.now ) {
        console.log(`Value of 'now' is: ${genNow.toISOString()}` );
    }

    const ciceroMark = await engine.generate(templateMarkDom, data, genNow);

    if(options.verbose) {
        console.log('AgreementMark DOM:');
        console.log(JSON.stringify(ciceroMark, null, 2));
    }

    const result = await transform(ciceroMark.toJSON(), 'ciceromark_parsed', [outputFormat], {}, {verbose: options.verbose});

    if(options.verbose) {
        console.log(`${outputFormat}:`);
        console.log(result);
    }

    fs.writeFileSync(outputFile, result);
    console.log(`Created ${outputFormat} and saved to file: ${outputFile}`);
}