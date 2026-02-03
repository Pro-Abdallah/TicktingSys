import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Call .NET API backend
        const response = await fetch(`${API_URL}/api/Auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Login error detailed:', {
            message: error.message,
            cause: error.cause,
            stack: error.stack,
            url: `${API_URL}/api/Auth/login`
        });

        // Check if it's a connection refused error
        if (error.cause?.code === 'ECONNREFUSED') {
            return NextResponse.json(
                { success: false, message: 'Cannot connect to backend server. Is .NET API running on port 5000?', error: error.message },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { success: false, message: 'Internal server error during login', error: error.message },
            { status: 500 }
        );
    }
}
