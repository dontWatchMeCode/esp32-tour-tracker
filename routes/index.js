const router = require('express').Router();
const fileUpload = require('express-fileupload');
const { requiresAuth } = require('express-openid-connect');

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Home',
        isAuthenticated: req.oidc.isAuthenticated()
    });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
    res.render('profile', {
        title: 'Profile',
        userProfile: JSON.stringify(req.oidc.user, null, 2)
    });
});

router.get('/upload', requiresAuth(), function (req, res, next) {
    res.render('upload', {
        title: 'Upload',
        isAuthenticated: req.oidc.isAuthenticated()
    });
});

router.get('/files', requiresAuth(), function (req, res, next) {
    let file_list = require('fs')
        .readdirSync('./uploads/');
    res.render('files', {
        title: 'Files',
        isAuthenticated: req.oidc.isAuthenticated(),
        file_list
    });
});

router.get('/view/:id', requiresAuth(), function (req, res, next) {
    let id = req.params.id;
    let data = require('fs').readFileSync('./uploads/' + id)
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
router.post('/api/upload', function (req, res) {
    let file;
    let upload_path;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "file") is used to retrieve the uploaded file
    file = req.files.file;
    upload_path = __dirname + '/../uploads/' + file.name;

    // Use the mv() method to place the file somewhere on your server
    file.mv(upload_path, function (err) {
        if (err)
            return res.status(500).send(err);

        res.status(200).send('File uploaded!');
    });
});

module.exports = router;
