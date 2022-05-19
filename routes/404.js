const express = require('express');

////////////////////////////////////////////////////////////

const router = express.Router();

router.get('*', (req, res) => {
    res.status(404)
        .render('404',  {
            path: '/*',
            pageTitle: 'Page not found'});
        // .sendFile(path.join(__dirname, 'views', '404.html'));
}); //*萬用路由的位置要放在所有路由的最後面，否則會讓所有的路由皆顯示404

module.exports = router; 