import * as path from 'path';
import * as fs from 'fs';

import { ModelManager } from "@accordproject/concerto-core";
import { TemplateMarkToTypeScriptCompiler } from '@accordproject/template-engine';
import { TemplateMarkTransformer } from '@accordproject/markdown-template';

export async function compileCommandHandler(templateDir: string, outputDir: string, options: { verbose?: true | undefined; }) {
    
    const template = fs.readFileSync(path.join(templateDir, 'template.md'), 'utf-8');
    
    const ctoFileNames = fs.readdirSync(templateDir, { withFileTypes: true })
        .filter(item => !item.isDirectory() && item.name.endsWith('.cto'))
        .map(item => item.name);

    const modelManager = new ModelManager({ strict: true });
    ctoFileNames.forEach( ctoFile => {
        modelManager.addCTOModel(fs.readFileSync(path.join(templateDir, ctoFile), 'utf-8'), ctoFile, true);
    })
    await modelManager.updateExternalModels();

    const compiler = new TemplateMarkToTypeScriptCompiler(modelManager);
    const templateMarkTransformer = new TemplateMarkTransformer();
    const templateMarkDom = templateMarkTransformer.fromMarkdownTemplate({ content: template }, modelManager, 'contract', { verbose: options.verbose });

    if(options.verbose) {
        console.log('TemplateMark DOM:');
        console.log(JSON.stringify(templateMarkDom, null, 2));
    }

    compiler.compile(templateMarkDom, outputDir);
    console.log(`Compiled template to: ${outputDir}`);
}