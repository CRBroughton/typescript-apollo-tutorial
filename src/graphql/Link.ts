import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus'
import { context } from '../context'

export const Link = objectType({
  name: 'Link',
  definition(t) {
    t.nonNull.int('id')
    t.nullable.string('description')
    t.nonNull.string('url')
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
      resolve() {
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

      resolve(_parent, args) {
        const newLink = context.prisma.link.create({
          data: {
            description: args.description,
            url: args.url,
          },
        })
        return newLink
      },
    })
  },
})

// export const deleteLink = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.nonNull.field('deleteLink', {
//       type: 'ID',
//       args: {
//         id: nonNull(intArg()),
//       },

//       resolve(_parent, args) {
//         links = links.filter(link => link.id !== args.id)
//         return `deleted post ${args.id}`
//       },
//     })
//   },
// })

// export const updateLink = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.nonNull.field('updateLink', {
//       type: 'Link',
//       args: {
//         id: nonNull(intArg()),
//         url: nonNull(stringArg()),
//       },
//       resolve(_parent, args) {
//         const { id, url } = args
//         for (const link of links) {
//           if (link.id === id)
//             link.url = url
//         }
//         return args
//       },
//     })
//   },
// })
