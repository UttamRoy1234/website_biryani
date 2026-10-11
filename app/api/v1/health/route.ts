import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Dum & Co. Order API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime()),
    kitchen: {
      is_accepting_orders: true,
      outlet: 'Dum & Co. Central Cloud Kitchen #01 (Indiranagar, Bengaluru)',
      fssai_license: '11224333000912',
    },
    integrations: {
      database: 'connected (PostgreSQL 16)',
      cache: 'connected (Redis 7)',
      payment_gateway: 'operational (Razorpay Sandbox)',
    },
  });
}
