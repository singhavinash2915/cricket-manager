import { seedTestClub } from './fixtures/seed';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATE_FILE = path.join(__dirname, '.test-state.json');

async function globalSetup() {
  console.log('\n[E2E Global Setup] Seeding test data...');
  const data = await seedTestClub();

  // Write seeded IDs to a file so tests can read them
  fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2));
  console.log(`[E2E Global Setup] State saved to ${STATE_FILE}`);
  console.log(`[E2E Global Setup] Club ID: ${data.clubId}`);
}

export default globalSetup;
