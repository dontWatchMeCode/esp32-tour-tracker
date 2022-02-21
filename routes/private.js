const router = require('express').Router();
const fileUpload = require('express-fileupload');
const { requiresAuth } = require('express-openid-connect');

const db = require('./modules/db');

/* private routes only avalible when logged in */

router.get('/', async (req, res, next) => {
    db.check_user(req.oidc.user.sub);
    res.render('index', {
        title: 'Home',
        isAuthenticated: req.oidc.isAuthenticated()
    });
});

router.get('/profile', requiresAuth(), async (req, res, next) => {
    res.render('profile', {
        title: 'Profile',
        userProfile: JSON.stringify(req.oidc.user, null, 2)
    });
});

router.get('/upload', requiresAuth(), async (req, res, next) => {
    res.render('upload', {
        title: 'Upload',
        isAuthenticated: req.oidc.isAuthenticated()
    });
});

router.get('/files', requiresAuth(), async (req, res, next) => {
    userid = await db.get_userid(req.oidc.user.sub)
    let file_list = require('fs')
        .readdirSync('./uploads/' + userid);
    res.render('files', {
        title: 'Files',
        isAuthenticated: req.oidc.isAuthenticated(),
        file_list
    });
});

router.get('/devices', requiresAuth(), async (req, res, next) => {
    key_array = await db.get_apikey(req.oidc.user.sub);
    /* name_array = await db.get_apiname(req.oidc.user.sub); */

    res.render('devices', {
        title: 'Devices',
        isAuthenticated: req.oidc.isAuthenticated(),
        api_keys: key_array
    });
});

router.get('/view/:id', requiresAuth(), async (req, res, next) => {
    userid = await db.get_userid(req.oidc.user.sub)
    let id = req.params.id;
    let data = require('fs').readFileSync('./uploads/' + userid + "/" + id)
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
    res.render('view', {
        title: 'View',
        isAuthenticated: req.oidc.isAuthenticated(),
        id,
        data
    });
});

router.use(fileUpload());
router.post('/api/upload', async (req, res) => {
    let file;
    let upload_path;

    userid = await db.get_userid(req.oidc.user.sub)

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "file") is used to retrieve the uploaded file
    file = req.files.file;
    api_key = req.body.key;

    console.log(api_key);

    upload_path = __dirname + '/../uploads/' + userid + "/" + file.name;

    // Use the mv() method to place the file somewhere on your server
    file.mv(upload_path, function (err) {
        if (err)
            return res.status(500).send(err);

        res.status(200).send('File uploaded!');
    });
});

router.post('/api/key/add', async (req, res) => {
    userid = await db.get_userid(req.oidc.user.sub);

    db.add_apikey(userid);

    res.send('ok');
});

router.post('/api/key/del/:id', async (req, res) => {
    let id = req.params.id;
    key_to_delete = await db.get_apikey(req.oidc.user.sub);

    db.del_apikey(key_to_delete[id]);

    res.send('ok');
});

module.exports = router;
