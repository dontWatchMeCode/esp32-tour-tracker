const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tools = require('./tools');

async function check_user(arg) {
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

    const dir_trash = './uploads/trash/' + db_user.id;
    if (!fs.existsSync(dir_trash)) {
        fs.mkdirSync(dir_trash, { recursive: true });
    }
}

async function get_userid(arg) {
    const db_user = await prisma.user.findUnique({
        where: { key: arg }
    });
    return db_user.id;
}

async function api_keys_get(arg) {
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

async function api_keys_add(arg) {
    const userid = await get_userid(arg);
    await prisma.api_keys.create({
        data: {
            userId: userid,
            key: tools.makekey(64),
            name: "Tracker"
        }
    });
}

async function api_keys_delete(arg) {
    await prisma.api_keys.delete({
        where: { key: arg }
    });
}

async function api_keys_update(arg, value) {
    await prisma.api_keys.update({
        where: { key: arg },
        data: { name: value },
    });
}

async function files_get(arg) {
    let db_user;
    const userid = await get_userid(arg);

    let file_list = require('fs')
        .readdirSync('./uploads/' + userid);

    async function get() {
        db_user = await prisma.user.findUnique({
            where: { key: arg, },
            include: {
                tours: {
                    select: { name: true, notes: true, file: true }
                }
            }
        });
    }
    await get();

    if (db_user.tours.length != file_list.length) {
        // delete all records where file doasnt exist
        for (let i = 0; i < db_user.tours.length; i++) {
            if (!file_list.includes(db_user.tours[i].file)) {
                await prisma.tours.delete({
                    where: { file: db_user.tours[i].file }
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
        await get();
    }

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
