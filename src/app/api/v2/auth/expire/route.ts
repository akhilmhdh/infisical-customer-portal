import { type NextRequest } from 'next/server'
import { expireUserCookie } from '@/app/api/helpers';
import { jsonResponse } from '@/app/api/utils';

export async function POST(req: NextRequest) {
  return expireUserCookie(jsonResponse(200, { success: true }));
}