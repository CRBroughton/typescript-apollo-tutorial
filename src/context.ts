import { PrismaClient } from '@prisma/client'
import type { Request } from 'express'
import { decodeAuthHeader } from './utils/auth'

export const prisma = new PrismaClient()

export interface Context { // 1
  prisma: PrismaClient
  userId?: string
}

export const context = ({ req }: { req: Request }): Context => { // 2
  const token
      = req && req.headers.authorization
        ? decodeAuthHeader(req.headers.authorization)
        : null

  return {
    prisma,
    userId: token?.userId as string | undefined,
  }
}
