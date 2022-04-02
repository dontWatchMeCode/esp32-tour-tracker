const router = require('express').Router();
const fileUpload = require('express-fileupload');
const db = require('./modules/operations');
const fs = require('fs');

router.use(fileUpload());

const bodyParser = require('body-parser');
router.use(bodyParser.text());

/* public routes for pages and public api */

router.post('/', async (req, res) => {

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    const apikey = req.headers.apikey;

    let userid;
    try {
        userid = await db.check_api_key(apikey);
    } catch (error) {
        res.status(401);
        res.send("api key doasnt exist");
        return;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(402);
        res.send("no file given");
        return;
    }

    upload_path = __dirname + '/../uploads/' + userid + "/" + "file-" + date + "-" + month + "_" + Date.now();

    var write_file = fs.createWriteStream(upload_path, {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });
    write_file.write(req.body);

    res.status(200).send('File uploaded!');
});

module.exports = router;