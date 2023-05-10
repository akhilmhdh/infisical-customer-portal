import { Types } from 'mongoose';
import type { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { SignJWT, jwtVerify } from 'jose'
import {
    MembershipOrg,
    Organization
} from '@/app/api/models';
import { 
  USER_TOKEN, 
  JWT_SECRET,
  OWNER
} from '@/app/api/config';

/**
 * Verifies that the user with id [userId] is authorized for the organization
 * with id [organizationId]
 * @param userId - id of user to validate
 * @param organizationId - id of organization to validate against
 */
export async function verifyOrgAuth(userId: string, organizationId: string) {
  const membershipOrg = await MembershipOrg.findOne({
      user: new Types.ObjectId(userId!),
      organization: new Types.ObjectId(organizationId),
      role: OWNER
  }).select('organization');

  if (!membershipOrg) throw Error();
  
  const organization = await Organization.findById(membershipOrg.organization);

  if (!organization) throw Error();

  return { organization };
}

interface UserJwtPayload {
  jti: string
  iat: number
  userId: string;
}

export class AuthError extends Error {}

/**
 * Verifies the user's JWT token and returns its payload if it's valid.
 */
export async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get(USER_TOKEN)?.value

  if (!token) throw new AuthError('Missing user token')

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )
    return verified.payload as unknown as UserJwtPayload;
  } catch (err) {
    throw new AuthError('Your token has expired.')
  }
}

/**
 * Adds the user token cookie to a response.
 */
export async function setUserCookie(res: NextResponse, userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode(JWT_SECRET))

  res.cookies.set(USER_TOKEN, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 2, // 2 hours in seconds
  })

  return res
}

/**
 * Expires the user token cookie
 */
export async function expireUserCookie(res: NextResponse) {
  res.cookies.set(USER_TOKEN, '', { httpOnly: true, maxAge: 0 })
  return res
}