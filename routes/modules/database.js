const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tools = require('./tools');

async function check_user(arg) {
    try {
        await prisma.user.upsert({
            where: { key: arg, },
            update: {},
            create: { key: arg, },
        });

        const db_user = await prisma.user.findUnique({
            where: {
                key: arg
            }
        });

        const fs = require('fs');
        const dir = './uploads/' + db_user.id;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    catch (error) {
        return error;
    }
}

async function get_userid(arg) {
    try {
        const db_user = await prisma.user.findUnique({
            where: { key: arg }
        });
        return db_user.id;
    }
    catch (error) {
        return error;
    }
}

async function api_keys_get(arg) {
    try {
        const db_user = await prisma.user.findUnique({
            where: { key: arg, },
            include: {
                api_keys: {
                    select: { key: true, name: true }
                }
            },
        });

        return db_user.api_keys;
    }
    catch (error) {
        return error;
    }
}

async function api_keys_add(arg) {
    const userid = await get_userid(arg);
    try {
        await prisma.api_keys.create({
            data: {
                userId: userid,
                key: tools.makekey(64),
                name: "Tracker"
            }
        });
    }
    catch (error) { console.log(error); }
}

async function api_keys_delete(arg) {
    try {
        await prisma.api_keys.delete({
            where: { key: arg }
        });
    }
    catch (error) { console.log(error); }
}

async function api_keys_update(arg, value) {
    try {
        await prisma.api_keys.update({
            where: { key: arg },
            data: { name: value },
        });
    }
    catch (error) { console.log(error); }
}

async function files_get(arg) {
    let out_tours;
    const userid = await get_userid(arg);
    let file_list = require('fs')
        .readdirSync('./uploads/' + userid);

    const db_count = await prisma.user.findUnique({
        where: { key: arg, },
        include: {
            tours: {
                select: { file: true }
            }
        }
    });
    if (db_count.tours.length != file_list.length) {
        // delete all records where file doasnt exist
        for (let i = 0; i < db_count.tours.length; i++) {
            if (!file_list.includes(db_count.tours[i].file)) {
                await prisma.tours.delete({
                    where: { file: db_count.tours[i].file }
                });
            }
        }
        // creat if not exist
        for (let i = 0; i < file_list.length; i++) {
            await prisma.tours.upsert({
                where: { file: file_list[i], },
                update: {},
                create: { file: file_list[i], userId: userid },
            });
        }
    }
    const db_user = await prisma.user.findUnique({
        where: { key: arg, },
        include: {
            tours: {
                select: { name: true, file: true }
            }
        },
    });

    return db_user.tours;
}

module.exports = {
    check_user,
    get_userid,
    api_keys_get,
    api_keys_add,
    api_keys_delete,
    api_keys_update,
    files_get
};
