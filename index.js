var dust = require('dust')();
var serand = require('serand');
var io = require('socket.io');

var consol;

var HUB = 'wss://hub.serandives.com:4000/app';

/*var hub = io.connect(HUB, {
    transports: ['websocket']
});

hub.once('connect', function () {
    hub.on('done', function (options) {
        console.log(options);
        consol.append(options.data);
    });
});*/

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
        consol = $('.console', el);
        $('.drone-start', el).click(function () {
            console.log('drone start');
            hub.emit('drone start', {
                repo: 'https://github.com/serandules/hub-client.git',
                id: $(this).data('id')
            });
        });
        $('.pull', el).click(function () {
            console.log('pull');
            hub.emit('do', {
                plugin: 'git',
                action: 'pull',
                id: $(this).data('id')
            });
        });
        $('.status', el).click(function () {
            console.log('status');
            hub.emit('do', {
                plugin: 'git',
                action: 'status',
                id: $(this).data('id')
            });
        });
        $('.start', el).click(function () {
            console.log('start');
            hub.emit('do', {
                plugin: 'sh',
                action: 'run',
                id: $(this).data('id'),
                command: 'ls',
                args: ['-alh']
            });
        });
        $('.restart', el).click(function () {
            console.log('restart');
            hub.emit('do', {
                plugin: 'sh',
                action: 'run',
                id: $(this).data('id'),
                command: 'ps',
                args: ['-ef']
            });
        });
        $('.stop', el).click(function () {
            console.log('stop');
            hub.emit('do', {
                plugin: 'sh',
                action: 'run',
                id: $(this).data('id'),
                command: 'ps',
                args: ['-ef']
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

/*serand.on('hub', 'drones start', function (data) {
    console.log('received event');
    console.log(data);
    hub.emit('drones start', data);
});*/
