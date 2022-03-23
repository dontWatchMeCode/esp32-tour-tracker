const router = require('express').Router();
const fileUpload = require('express-fileupload');
const { requiresAuth } = require('express-openid-connect');

const fs = require('fs');

const db = require('./modules/operations');

router.use(fileUpload());

/* private routes only avalible when logged in */

router.get('/', async (req, res) => {
    db.check_user(req.oidc.user.sub);
    res.render('index', {
        title: 'Home',
        isAuthenticated: req.oidc.isAuthenticated()
    });
});

router.get('/profile', requiresAuth(), async (req, res) => {
    res.render('profile', {
        title: 'Profile',
        userProfile: JSON.stringify(req.oidc.user, null, 2)
    });
});

router.get('/upload', requiresAuth(), async (req, res) => {
    res.render('upload', {
        title: 'Upload',
        isAuthenticated: req.oidc.isAuthenticated()
    });
});

router.get('/files', requiresAuth(), async (req, res) => {
    await db.check_user(req.oidc.user.sub);
    const userid = await db.get_userid(req.oidc.user.sub);
    let file_list = fs.readdirSync('./uploads/' + userid);
    res.render('files', {
        title: 'Files',
        isAuthenticated: req.oidc.isAuthenticated(),
        file_list
    });
});

router.get('/devices', requiresAuth(), async (req, res) => {
    const key_array = await db.api_keys_get(req.oidc.user.sub);
    /* name_array = await db.get_apiname(req.oidc.user.sub); */

    res.render('devices', {
        title: 'Devices',
        isAuthenticated: req.oidc.isAuthenticated(),
        api_keys: key_array
    });
});

router.get('/view/:id', requiresAuth(), async (req, res) => {
    const userid = await db.get_userid(req.oidc.user.sub);
    const gapi = process.env.GMAPS_API_KEY;
    let id = req.params.id;
    // https://stackoverflow.com/a/53031629
    let data = fs.readFileSync('./uploads/' + userid + "/" + id)
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
    res.render('view', {
        title: 'View',
        isAuthenticated: req.oidc.isAuthenticated(),
        id,
        data,
        gapi
    });
});

router.post('/api/upload', async (req, res) => {
    let file;
    let upload_path;

    const userid = await db.get_userid(req.oidc.user.sub);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "file") is used to retrieve the uploaded file
    file = req.files.file;
    const api_key = req.body.key;

    console.log(api_key);

    upload_path = __dirname + '/../uploads/' + userid + "/" + file.name + "-" + Date.now();

    // Use the mv() method to place the file somewhere on your server
    file.mv(upload_path, function (err) {
        if (err)
            return res.status(500).send(err);

        res.status(200).send('File uploaded!');
    });
});

router.route('/api/key')
    .get(async (req, res) => {
        const api_values = await db.api_keys_get(req.oidc.user.sub);
        res.json(api_values);
    })
    .post(async (req, res) => {
        await db.api_keys_add(req.oidc.user.sub);
        res.send('key created');
    })
    .delete(async (req, res) => {
        let query_id = req.query.id;
        let value;
        const api_values = await db.api_keys_get(req.oidc.user.sub);
        try {
            value = api_values[query_id].key;
        } catch {
            res.status(400);
            res.send("id dosnt exist");
            return;
        }
        await db.api_keys_delete(value);
        res.send('deleted' + query_id);
    })
    .patch(async (req, res) => {
        let query_id = req.query.id;
        let query_value = req.query.value;
        let value;
        const api_values = await db.api_keys_get(req.oidc.user.sub);
        try {
            value = api_values[query_id].key;
        } catch {
            res.status(400);
            res.send("id dosnt exist");
            return;
        }
        await db.api_keys_update(value, query_value);
        res.send("changed " + query_id + " to " + query_value);
    });

router.route('/api/tours')
    .get(async (req, res) => {
        if (req.query.file != undefined) {
            let query_file = req.query.file;
            let info;
            try {
                info = await db.file_get_info(req.oidc.user.sub, query_file);
            } catch {
                res.status(400);
                res.send("file doasnt exist");
            }
            res.json(info);
            return;
        }
        const files = await db.files_get(req.oidc.user.sub);
        res.json(files);
    })
    .patch(async (req, res) => {
        let query_name = req.query.name;
        let query_notes = req.query.notes;
        let query_id = req.query.id;
        let value;
        const tours_values = await db.files_get(req.oidc.user.sub);
        try {
            value = tours_values[query_id].file;
        } catch {
            res.status(400);
            res.send("id dosnt exist");
            return;
        }
        if (query_name != undefined) {
            await db.file_rename(value, query_name);
        }
        if (query_notes != undefined) {
            await db.file_change_notes(value, query_notes);
        }
        res.send("changed " + query_id);
    })
    .delete(async (req, res) => {
        let query_id = req.query.id;
        const userid = await db.get_userid(req.oidc.user.sub);
        const tours_values = await db.files_get(req.oidc.user.sub);
        try {
            value = tours_values[query_id].file;
        } catch {
            res.status(400);
            res.send("id dosnt exist");
            return;
        }
        await db.file_delete(userid, value);
        res.send("deleted " + query_id);
    });

module.exports = router;