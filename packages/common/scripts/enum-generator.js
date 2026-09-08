#!/usr/bin/env node
const { generatorHandler } = require('@prisma/generator-helper');
const fs = require('fs');
const path = require('path');

generatorHandler({
  onManifest: () => ({
    defaultOutput: '../src/prisma-enums.ts',
    prettyName: 'SSOT Enums Generator',
  }),
  onGenerate: async options => {
    const enums = options.dmmf.datamodel.enums;
    if (enums.length === 0) return;

    const outPath = options.generator.output.value;

    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    let existingContent = '';
    if (fs.existsSync(outPath)) {
      existingContent = fs.readFileSync(outPath, 'utf-8');
    } else {
      existingContent = `// ⚠️ AUTOMATIC GENERATED. DO NOT EDIT!\n\n`;
    }

    let newContent = existingContent;
    let hasChanges = false;

    enums.forEach(e => {
      const enumSignature = `export const ${e.name} = {`;

      if (!newContent.includes(enumSignature)) {
        let enumCode = `export const ${e.name} = {\n`;
        e.values.forEach(v => {
          enumCode += `  ${v.name}: '${v.name}',\n`;
        });
        enumCode += `} as const;\n\n`;
        enumCode += `export type ${e.name} = (typeof ${e.name})[keyof typeof ${e.name}];\n\n`;

        newContent += enumCode;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(outPath, newContent, 'utf-8');
    }
  },
});
