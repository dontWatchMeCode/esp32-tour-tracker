const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

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


async function file_get_info(arg, file) {
    const userid = await get_userid(arg);
    let sp_max = 0;
    let sp_min = 9999;
    let sp_avg = 0;

    let tmp_max = 0;
    let tmp_min = 9999;
    let tmp_avg = 0;

    let output = [];

    let data = fs.readFileSync('./uploads/' + userid + "/" + file)
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array

    for (i = 1; i < data.length - 1; i++) {
        if (sp_max < data[i][11]) {
            sp_max = data[i][11];
        }

        if (sp_min > data[i][11]) {
            sp_min = data[i][11];
        }

        sp_avg = parseFloat(sp_avg) + parseFloat(data[i][11]);

        if (tmp_max < data[i][6]) {
            tmp_max = data[i][6];
        }

        if (tmp_min > data[i][6]) {
            tmp_min = data[i][6];
        }

        tmp_avg = parseFloat(tmp_avg) + parseFloat(data[i][6]);
    }

    sp_avg = (sp_avg / (data.length - 2)).toFixed(2);
    tmp_avg = (tmp_avg / (data.length - 2)).toFixed(2);

    output[0] = sp_max;
    output[1] = sp_min;
    output[2] = sp_avg;
    output[3] = tmp_max;
    output[4] = tmp_min;
    output[5] = tmp_avg;

    return output;
}

module.exports = {
    check_user,
    get_userid,
    api_keys_get,
    api_keys_add,
    api_keys_delete,
    api_keys_update,
    files_get,
    file_get_info
};
