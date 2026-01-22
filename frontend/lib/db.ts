import { Connection, Request } from 'tedious';

const config = {
  server: process.env.AZURE_SQL_SERVER || '',
  authentication: {
    type: 'default' as any,
    options: {
      userName: process.env.AZURE_SQL_USERNAME || '',
      password: process.env.AZURE_SQL_PASSWORD || '',
    },
  },
  options: {
    database: process.env.AZURE_SQL_DATABASE || '',
    encrypt: true,
    connectTimeout: 30000,
    trustServerCertificate: true, // Azure için bazen gerekebilir
  },
};

export async function executeQuery(query: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    // Missing env check
    if (!config.server || !config.options?.database) {
      reject(new Error('Azure SQL configuration is missing in environment variables'));
      return;
    }

    const connection = new Connection(config);

    connection.on('connect', (err) => {
      if (err) {
        reject(err);
        return;
      }

      const request = new Request(query, (err) => {
        if (err) {
          reject(err);
        }
        connection.close();
      });

      const results: any[] = [];
      request.on('row', (columns) => {
        const row: any = {};
        columns.forEach((column: any) => {
          row[column.metadata.colName] = column.value;
        });
        results.push(row);
      });

      request.on('requestCompleted', () => {
        resolve(results);
      });

      connection.execSql(request);
    });

    connection.on('error', (err) => {
      console.error('Connection error:', err);
      reject(err);
    });

    connection.connect();
  });
}
