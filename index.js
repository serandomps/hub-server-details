var dust = require('dust')();
var serand = require('serand');
var io = require('socket.io');

var HUB = 'wss://hub.serandives.com:4000/hub';

var hub = io.connect(HUB, {
    transports: ['websocket']
});

hub.on('connect', function () {
    hub.on('', function () {

    });
});

dust.loadSource(dust.compile(require('./template'), 'hub-server-details'));
dust.loadSource(dust.compile(require('./update'), 'hub-server-details-update'));

var details = function (sandbox, fn, options, next) {
    dust.render('hub-server-details', options, function (err, out) {
        if (err) {
            fn(err);
            return;
        }
        var el = $(out).appendTo(sandbox);
        next(options, $('.content', el), function (err) {
            fn(err, function () {
                $('.hub-server-details', sandbox).remove();
            });
        });
    });
};

var update = function (options, parent, done) {
    dust.render('hub-server-details-update', options, function (err, out) {
        if (err) {
            done(err);
            return;
        }
        var el = $(out);
        $('.update', el).click(function () {
            console.log('updating');
            hub.emit('exec', {
                plugin: 'hub',
                action: 'update',
                id: $(this).data('id')
            });
        });
        parent.html(el);
        done();
    });
};

module.exports = function (sandbox, fn, options) {
    var action = options.action || 'summary';
    switch (action) {
        case 'summary':
        case 'update':
            details(sandbox, fn, options, update);
            return;
    }
};
