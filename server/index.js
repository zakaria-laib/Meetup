const express = require('express');
const createError = require('http-errors');
const path = require('path');
const configs = require('./config');
const SpeakerService = require('./services/SpeakerService');
const app = express();

const config = configs[app.get('env')];

const speakerService = new SpeakerService(config.data.speakers);

app.set('view engine', 'pug');
if(app.get('env') === 'development') {
    app.locals.pretty = true;
}
app.set('views', path.join(__dirname, './views'));
app.locals.title = config.sitename;

const routes = require('./routes');
app.use(express.static('public'));
app.get('/favicon.ico', (req, res, next) => {
    return res.sendStatus(204);
});

app.use(async (req, res, next) => {
    try {
        const names = await speakerService.getNames();
        res.locals.speakerNames = names;
        return next();
    } catch(err) {  
        return next(err);
    }
});

app.use('/', routes({
    speakerService
}));

app.use((req, res, next) => {
    return next(createError(404, 'File not found'));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    const status = err.status || 500;
    res.locals.status = status;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(status);
    return res.render('error');
});

app.listen(3000);

module.export = app;