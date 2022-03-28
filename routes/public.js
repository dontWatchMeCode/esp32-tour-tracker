const router = require('express').Router();
const fileUpload = require('express-fileupload');
const db = require('./modules/operations');

router.use(fileUpload());

/* public routes for pages and public api */

router.post('/', async (req, res) => {
    const apikey = req.headers.apikey;
    console.log(apikey);
    console.log(req.files);
    let userid;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    try {
        userid = await db.check_api_key(apikey);
    } catch (error) {
        res.status(400);
        res.send("api key doasnt exist");
        return;
    }

    file = req.files.file;

    upload_path = __dirname + '/../uploads/' + userid + "/" + file.name + "-" + Date.now();

    // Use the mv() method to place the file somewhere on your server
    file.mv(upload_path, function (err) {
        if (err)
            return res.status(500).send(err);

        res.status(200).send('File uploaded!');
    });
});

module.exports = router;