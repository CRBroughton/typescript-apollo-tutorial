import { join } from 'path'
import { makeSchema } from 'nexus'
import * as types from './graphql'

export const schema = makeSchema({
  types,
  outputs: {
    schema: join(__dirname, '..', 'schema.graphql'), // 2
    typegen: join(__dirname, '..', 'nexus-typegen.ts'), // 3
  },
  contextType: {
    module: join(__dirname, './context.ts'), // 1
    export: 'Context', // 2
  },
})
