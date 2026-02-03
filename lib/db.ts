import mssql from 'mssql';

const config: any = {
    server: process.env.DB_SERVER || 'DESKTOP-9M75GPK',
    database: process.env.DB_NAME || 'ElsewedySchoolSysDB_DEV',
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Use Integrated Security (Windows Authentication) if specified
if (process.env.DB_INTEGRATED_SECURITY === 'true') {
    config.options.trustedConnection = true;
} else {
    config.user = process.env.DB_USER;
    config.password = process.env.DB_PASSWORD;
}


let poolPromise: Promise<mssql.ConnectionPool> | null = null;

export async function getDbPool() {
    if (poolPromise) return poolPromise;

    poolPromise = mssql.connect(config as any);
    return poolPromise;
}

export async function query(sql: string, params: Record<string, any> = {}) {
    const pool = await getDbPool();
    const request = pool.request();

    for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
    }

    return request.query(sql);
}

export { mssql };
