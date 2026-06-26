import { PrismaClient } from '@prisma/client'
import { seedCalisthenics } from './seeds/calisthenics'

const prisma = new PrismaClient()

async function main() {
  await seedCalisthenics(prisma)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
