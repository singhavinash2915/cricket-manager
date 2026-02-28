import { cleanupTestClub } from './fixtures/seed';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATE_FILE = path.join(__dirname, '.test-state.json');

async function globalTeardown() {
  console.log('\n[E2E Global Teardown] Cleaning up test data...');
  await cleanupTestClub();

  // Remove state file
  if (fs.existsSync(STATE_FILE)) {
    fs.unlinkSync(STATE_FILE);
  }
  console.log('[E2E Global Teardown] Done.');
}

export default globalTeardown;
