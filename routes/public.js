const router = require('express').Router();

/* public routes for pages and public api */

router.get('/', function (req, res) {
    res.json({
        message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
    });
});

module.exports = router;