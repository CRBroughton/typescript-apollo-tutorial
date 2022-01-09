// 1
import { PrismaClient } from '@prisma/client'

// 2
const prisma = new PrismaClient()

// 3
async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: 'Fullstack tutorial for GraphQL',
      url: 'www.howtographql.com',
    },
  })
  const allLinks = await prisma.link.findMany()
  // eslint-disable-next-line no-console
  console.log(allLinks)
}

// 4
main()
  .catch((e) => {
    throw e
  })
// 5
  .finally(async() => {
    await prisma.$disconnect()
  })
