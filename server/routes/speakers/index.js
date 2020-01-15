const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { speakerService } = param;

    router.get('/', async (req, res, next) => {
        const speakerslist = await speakerService.getList();
        return res.render('speakers', {
            page: 'All Speakers',
            speakerslist
        });
    });

    router.get('/:name', (req, res, next) => {
        return res.render('speakers/detail', {
            page: req.params.name,
        });
    });
    
    return router;
};