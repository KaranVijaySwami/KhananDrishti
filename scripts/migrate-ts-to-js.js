import fs from 'fs';
import { globSync } from 'glob';
import babel from '@babel/core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const transformAndRename = (pattern, isReact) => {
  const files = globSync(pattern, { cwd: root, absolute: true, ignore: '**/node_modules/**' });
  
  files.forEach(file => {
    if (file.endsWith('types.ts')) {
      console.log(`Skipping and deleting pure types file: ${file}`);
      fs.unlinkSync(file);
      return;
    }

    const code = fs.readFileSync(file, 'utf8');
    
    try {
      const result = babel.transformSync(code, {
        filename: file,
        presets: [
          ['@babel/preset-typescript', { isTSX: isReact, allExtensions: isReact }]
        ],
        // Do NOT include React preset so JSX is preserved!
        plugins: [
          // Required to parse JSX syntax when stripping TSX
          isReact ? '@babel/plugin-syntax-jsx' : null
        ].filter(Boolean),
        retainLines: true, // Try to keep original formatting
      });
      
      const newExt = isReact ? '.jsx' : '.js';
      const newPath = file.replace(/\.tsx?$/, newExt);
      
      fs.writeFileSync(newPath, result.code);
      fs.unlinkSync(file);
      console.log(`Converted: ${file} -> ${newPath}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  });
};

// Convert backend TS -> JS
transformAndRename('backend/src/**/*.ts', false);

// Convert frontend TS/TSX -> JS/JSX
transformAndRename('frontend/src/**/*.ts', false);
transformAndRename('frontend/src/**/*.tsx', true);

// Rename config files manually
const configsToRename = [
  'frontend/vite.config.ts',
];

configsToRename.forEach(relPath => {
  const file = path.resolve(root, relPath);
  if (fs.existsSync(file)) {
    const code = fs.readFileSync(file, 'utf8');
    const result = babel.transformSync(code, {
      filename: file,
      presets: [['@babel/preset-typescript']]
    });
    const newPath = file.replace(/\.ts$/, '.js');
    fs.writeFileSync(newPath, result.code);
    fs.unlinkSync(file);
    console.log(`Converted config: ${file} -> ${newPath}`);
  }
});

console.log("Migration script completed.");
