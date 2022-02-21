const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tools = require('./tools');

exports.check_user = async (arg) => {
    try {
        const db = await prisma.user.upsert({
            where: {
                key: arg,
            },
            update: {},
            create: {
                key: arg,
            },
        })

        const db_usr = await prisma.user.findUnique({
            where: {
                key: arg
            }
        })

        const fs = require('fs');
        const dir = './uploads/' + db_usr.id;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    catch (error) {
        console.error(error);
    }
}

exports.get_userid = async (arg) => {
    try {
        const db = await prisma.user.findUnique({
            where: {
                key: arg
            }
        })
        return db.id;
    }
    catch (error) {
        return error
    }
}

exports.get_apikey = async (arg) => {
    try {
        const db = await prisma.user.findUnique({
            where: {
                key: arg,
            },
            include: {
                api_keys: {
                    select: { key: true }
                }
            },
        })
        key_array = [];
        for (let i = 0; i < db.api_keys.length; i++) {
            key_array.push(db.api_keys[i].key);
        }
        return key_array;
    }
    catch (error) {
        return error
    }
}

exports.get_apiname = async (arg) => {
    try {
        const db = await prisma.user.findUnique({
            where: {
                key: arg,
            },
            include: {
                api_keys: {
                    select: { name: true }
                }
            },
        })
        name_array = [];
        for (let i = 0; i < db.api_keys.length; i++) {
            name_array.push(db.api_keys[i].name);
        }
        return name_array;
    }
    catch (error) {
    }
}

exports.add_apikey = async (arg) => {
    try {
        const db = await prisma.api_keys.create({
            data: {
                userId: arg,
                key: tools.makekey(64)
            }
        })
    }
    catch (error) {
    }
}

exports.del_apikey = async (arg) => {
    try {
        const db = await prisma.api_keys.delete({
            where: {
                key: arg
            }
        })
    }
    catch (error) {
    }
}

