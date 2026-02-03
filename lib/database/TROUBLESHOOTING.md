# Database Connection Troubleshooting

The connection is failing with: `Failed to connect to DESKTOP-9M75GPK:1433`

## Possible Issues:

1. **SQL Server is not running**
2. **TCP/IP is not enabled** in SQL Server Configuration Manager
3. **Named Instance** (e.g., SQLEXPRESS) requires different configuration
4. **Windows Authentication doesn't work** from Node.js
5. **Firewall** is blocking port 1433

## Quick Fixes to Try:

### Option 1: Check if using SQL Express (Named Instance)

If you're using SQL Server Express, update `lib/database/connection.ts` line 10:

```typescript
instanceName: 'SQLEXPRESS',  // or whatever your instance name is
```

### Option 2: Enable TCP/IP Protocol

1. Open **SQL Server Configuration Manager**
2. Go to **SQL Server Network Configuration** → **Protocols for [Your Instance]**
3. Enable **TCP/IP**
4. Restart SQL Server service

### Option 3: Use SQL Authentication Instead

If Windows Auth doesn't work, you need SQL Server credentials. Update the connection config:

```typescript
authentication: {
    type: 'default'
},
user: 'your_sql_username',
password: 'your_sql_password'
```

### Option 4: Check Firewall

Make sure Windows Firewall allows SQL Server:
- Port 1433 for default instance
- Port 1434 for SQL Browser (named instances)

## What I Need from You:

Please answer these questions so I can fix the connection:

1. **Is this SQL Server Express or full SQL Server?**
2. **What is the instance name?** (e.g., MSSQLSERVER, SQLEXPRESS, or custom)
3. **Do you have SQL Server username/password?** (If Windows Auth doesn't work)
4. **Can you check if SQL Server is running?** (Services → SQL Server)
