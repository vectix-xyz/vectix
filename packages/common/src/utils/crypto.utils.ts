import * as fs from 'fs';
import * as path from 'path';

export function loadKeyFile(relativePathFromRoot: string): string {
  const rootDir = process.cwd().includes('services') || process.cwd().includes('apps')
    ? path.resolve(process.cwd(), '../../')
    : process.cwd();

  const fullPath = path.resolve(rootDir, relativePathFromRoot);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`[Security] Key file not found at path: ${fullPath}`);
  }

  return fs.readFileSync(fullPath, 'utf-8');
}