import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET() {
    try {
        // A simple query to check the connection
        const result = await executeQuery('SELECT 1 as connected, GETDATE() as currentTime');
        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            data: result.recordset[0]
        });
    } catch (error: any) {
        console.error('Database connection error:', error);
        return NextResponse.json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        }, { status: 500 });
    }
}
