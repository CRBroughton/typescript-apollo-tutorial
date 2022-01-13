import { extendType, nonNull, objectType, stringArg } from 'nexus'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { APP_SECRET } from '../utils/auth'

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.nonNull.string('token')
    t.nonNull.field('user', {
      type: 'User',
    })
  },
})

export const AuthMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, context) {
        const email = args.email.toLowerCase()
        const user = await context.prisma.user.findUnique({
          where: { email },
        })
        if (!user)
          throw new Error('No such user found')

        // 2
        const valid = await bcrypt.compare(
          args.password,
          user.password,
        )
        if (!valid)
          throw new Error('Invalid password')

        // 3
        const token = jwt.sign({ userId: user.id }, APP_SECRET)

        // 4
        return {
          token,
          user,
        }
      },
    })

    t.nonNull.field('signup', { // 1
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      async resolve(_parent, args, context) {
        // 2
        const password = await bcrypt.hash(args.password, 10)

        const email = args.email.toLowerCase()
        const name = args.name.toLowerCase()

        const existingUser = await context.prisma.user.findUnique({
          where: { email },
        })

        const existingUserName = await context.prisma.user.findUnique({
          where: { name },
        })

        if (existingUser || existingUserName)
          throw new Error('Account already created')

        // 3
        const user = await context.prisma.user.create({
          data: { email, name, password },
        })

        // 4
        const token = jwt.sign({ userId: user.id }, APP_SECRET)

        // 5
        return {
          token,
          user,
        }
      },
    })
  },
})
