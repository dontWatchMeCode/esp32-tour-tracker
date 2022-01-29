// db stuff
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/test', async (req, res) => {

    /* const out = "test"; */

    /* const out = await prisma.user.findUnique({
        where: {
            id: 1
        }
    }) */

    /* const out = await prisma.user.create({
        data: {
            key: "lul"
        }        
    }) */

    /* const out = await prisma.user.delete({
        where: {
            id: 1
        }
    }) */

    /* const out = await prisma.$queryRaw`SELECT * FROM user`; */

    res.json({
        data: out
    });
});