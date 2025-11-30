import { prisma } from './lib/prisma.js';

async function testPrisma() {
    try {
        console.log('Testing Prisma connection...');

        // Try to create an author
        const author = await prisma.author.create({
            data: {
                name: 'Test Author',
                lifeSpan: '1900-2000',
            },
        });
        console.log('Author created:', author);

        // Try to count authors
        const count = await prisma.author.count();
        console.log('Total authors:', count);

        // Clean up
        await prisma.author.delete({
            where: { id: author.id },
        });
        console.log('Test author deleted');

        console.log('\n✅ Prisma is working correctly!');
    } catch (error) {
        console.error('❌ Prisma error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testPrisma();
