const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function makekey(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

exports.check_user = async (arg) => {
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

exports.get_userid = async (arg) => {
    const db = await prisma.user.findUnique({
        where: {
            key: arg
        }
    })
    return db.id;
}

exports.get_apikey = async (arg) => {
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

exports.get_apiname = async (arg) => {
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

exports.add_apikey = async (arg) => {
    const db = await prisma.api_keys.create({
        data: {
            userId: arg,
            key: makekey(64)
        }
    })
}

exports.del_apikey = async (arg) => {
    const db = await prisma.api_keys.delete({
        where: {
            key: arg
        }
    })
}

