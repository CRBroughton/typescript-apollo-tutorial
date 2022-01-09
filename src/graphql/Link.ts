import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus'

export const Link = objectType({
  name: 'Link',
  definition(t) {
    t.nonNull.int('id')
    t.nullable.string('description')
    t.nonNull.string('url')
    t.field('postedBy', { // 1
      type: 'User',
      resolve(parent, _args, context) { // 2
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy()
      },
    })
    t.nonNull.list.nonNull.field('voters', { // 1
      type: 'User',
      resolve(parent, _args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .voters()
      },
    })
  },
})

export const ID = objectType({
  name: 'ID',
  definition(t) {
    t.nonNull.int('id')
  },
})

export const LinkQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('feed', {
      type: 'Link',
      resolve(_parent, _args, context) {
        return context.prisma.link.findMany()
      },
    })
  },
})

export const LinkMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('post', {
      type: 'Link',
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(_parent, args, context) {
        const { description, url } = args
        const { userId } = context

        if (!userId) { // 1
          throw new Error('Cannot post without logging in.')
        }

        const newLink = context.prisma.link.create({
          data: {
            description,
            url,
            postedBy: { connect: { id: userId } }, // 2
          },
        })

        return newLink
      },
    })
  },
})

export const deleteLink = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('deleteLink', {
      type: 'ID',
      args: {
        id: nonNull(intArg()),
      },

      async resolve(_parent, args, context) {
        await context.prisma.link.delete({
          where: {
            id: args.id,
          },
        })
        return `deleted post ${args.id}`
        // links = links.filter(link => link.id !== args.id)
        // return `deleted post ${args.id}`
      },
    })
  },
})

export const updateLink = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateLink', {
      type: 'Link',
      args: {
        id: nonNull(intArg()),
        url: nonNull(stringArg()),
      },
      async resolve(_parent, args, context) {
        const { id, url } = args
        const updateLink = await context.prisma.link.update({
          where: {
            id,
          },
          data: {
            url,
          },
        })
        return updateLink
        // const { id, url } = args
        // for (const link of links) {
        //   if (link.id === id)
        //     link.url = url
        // }
        // return args
      },
    })
  },
})
