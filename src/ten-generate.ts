import { ModelManager } from "@accordproject/concerto-core";
import { readFileSync, writeFileSync } from "fs";

const { TemplateMarkInterpreter } = require('@accordproject/template-engine');
import { TemplateMarkTransformer } from '@accordproject/markdown-template';
const { transform } = require('@accordproject/markdown-transform');
const dayjs = require('dayjs');

export async function generateCommand(templateFile: string, modelFile: string, dataJson: string, outputFormat: string, outputFile: string) {
    const model = readFileSync(modelFile, 'utf-8');
    const template = readFileSync(templateFile, 'utf-8');
    const data = JSON.parse(readFileSync(dataJson, 'utf-8'));
    const modelManager = new ModelManager({ strict: true });
    modelManager.addCTOModel(model);
    const engine = new TemplateMarkInterpreter(modelManager, {});

    const templateMarkTransformer = new TemplateMarkTransformer();

    const templateMarkDom = templateMarkTransformer.fromMarkdownTemplate({ content: template }, modelManager, 'contract', { verbose: false });

    //const now = dayjs('2023-03-17T00:00:00.000Z');
    const now = null;
    const ciceroMark = await engine.generate(templateMarkDom, data, now);
    console.log(typeof ciceroMark);
    console.log(JSON.stringify(ciceroMark, null, 2));
    const result = await transform(ciceroMark.toJSON(), 'ciceromark_parsed', [outputFormat], {}, {});
    console.log(JSON.stringify(result, null, 2));
    writeFileSync(outputFile, result);
}