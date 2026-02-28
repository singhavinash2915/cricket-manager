import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { SeededData } from './seed';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATE_FILE = path.join(__dirname, '..', '.test-state.json');

/**
 * Load the seeded test data IDs from the state file written by global setup.
 */
export function loadTestState(): SeededData {
  const raw = fs.readFileSync(STATE_FILE, 'utf-8');
  return JSON.parse(raw) as SeededData;
}
