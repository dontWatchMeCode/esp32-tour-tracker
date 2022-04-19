const router = require('express').Router();
const db = require('./modules/operations');
const fs = require('fs');

router.get('/:uid/:id', async (req, res) => {
    const userid = req.params.uid;
    const fileid = req.params.id;
    const gapi = process.env.GMAPS_API_KEY;
    // https://stackoverflow.com/a/53031629
    let data = fs.readFileSync('./uploads/' + userid + "/" + fileid)
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
    res.render('viewprint', {
        title: 'View',
        fileid,
        data,
        gapi
    });
});

/* router.get('/viewprint/:id', requiresAuth(), async (req, res) => {
    const userid = await db.get_userid(req.oidc.user.sub);
    let id = req.params.id;
    // https://stackoverflow.com/a/53031629
    let data = fs.readFileSync('./uploads/' + userid + "/" + id)
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
    res.render('viewprint', {
        title: 'View',
        isAuthenticated: req.oidc.isAuthenticated(),
        id,
        data
    });
}); */

module.exports = router;