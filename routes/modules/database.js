const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tools = require('./tools');

exports.check_user = async (arg) => {
    try {
        await prisma.user.upsert({
            where: { key: arg, },
            update: {},
            create: { key: arg, },
        })

        const db_user = await prisma.user.findUnique({
            where: {
                key: arg
            }
        })

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

exports.get_userid = async (arg) => {
    try {
        const db_user = await prisma.user.findUnique({
            where: { key: arg }
        })
        return db_user.id;
    }
    catch (error) {
        return error
    }
}

exports.api_keys_get = async (arg) => {
    try {
        const db_user = await prisma.user.findUnique({
            where: { key: arg, },
            include: {
                api_keys: {
                    select: { key: true, name: true }
                }
            },
        })
        let key_array = [];
        let name_array = [];
        for (let i = 0; i < db_user.api_keys.length; i++) {
            key_array.push(db_user.api_keys[i].key);
            name_array.push(db_user.api_keys[i].name);
        }

        let combined_array = [], i = -1;
        while (key_array[++i]) {
            combined_array.push([name_array[i], key_array[i]]);
        }

        return combined_array;
    }
    catch (error) {
        return error;
    }
}

exports.api_keys_add = async (arg) => {
    try {
        await prisma.api_keys.create({
            data: {
                userId: arg,
                key: tools.makekey(64)
            }
        })
    }
    catch (error) { console.log(error); }
}

exports.api_keys_delete = async (arg) => {
    try {
        await prisma.api_keys.delete({
            where: { key: arg }
        })
    }
    catch (error) { console.log(error); }
}

exports.api_keys_update = async (arg, value) => {
    try {
        await prisma.api_keys.update({
            where: { key: arg },
            data: { key: value },
        })
    }
    catch (error) { console.log(error); }
}