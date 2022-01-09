import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus'
import type { NexusGenObjects } from '../../nexus-typegen'

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

let links: NexusGenObjects['Link'][] = [
  {
    id: 1,
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
  {
    id: 2,
    url: 'graphql.org',
    description: 'GraphQL official website',
  },
]

export const LinkQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('feed', {
      type: 'Link',
      resolve() {
        return links
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
        const idCount = links.length + 1 // 5
        const link = {
          id: idCount,
          description: args.description,
          url: args.url,
        }
        links.push(link)
        return link
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

      resolve(_parent, args) {
        links = links.filter(link => link.id !== args.id)
        return `deleted post ${args.id}`
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
      resolve(_parent, args) {
        const { id, url } = args
        for (const link of links) {
          if (link.id === id)
            link.url = url
        }
        return args
      },
    })
  },
})
