import runner, { RunnerOption } from 'node-pg-migrate';
import pg from 'pg';
import fs from 'fs';
import path from 'path';


function findSqlFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findSqlFiles(filePath, fileList);
    } else if (path.extname(file) === '.sql') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

export async function migrationRunner(direction: 'up' | 'down'): Promise<void> {
  process.chdir(__dirname);
  const client = new pg.Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    port: 5432,
 
  });

  const options: RunnerOption = {
    dbClient: client,
    migrationsTable: 'migrations',
    migrationsSchema: 'public',
    schema: 'public',
    dir: '../migrations',
    checkOrder: true,
    direction: direction,
    singleTransaction: true,
    createSchema: false,
    createMigrationsSchema: false,
    noLock: false,
    fake: false,
    dryRun: false,

    verbose: false,
    decamelize: false,
  };

  await client.connect();
  console.log(`Connected to DB ${process.env.POSTGRES_DB}`);
  
  try {
    await runner(options);

    // Applying seeds
    const seedFiles = findSqlFiles('../seeds');
    for (const file of seedFiles) {
      console.log(`Applying seed file: ${file}`);
      const sql = fs.readFileSync(file).toString();
      await client.query(sql);
      console.log(`Successfully applied ${file}`);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error during migration or seeding: ', err.stack);
    } else {
      console.error('An unexpected error occurred', err);
    }
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}
