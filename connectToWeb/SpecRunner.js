requirejs.config({
    baseUrl: '.',
    waitSeconds: 0,
    paths: {
        text: 'www/lib/require/text',
        'jasmin': 'test/lib/jasmine-2.5.2/jasmine',
        'jasmin-html': 'test/lib/jasmine-2.5.2/jasmine-html',
        'boot': 'test/lib/jasmine-2.5.2/boot'
    },
    shim: {
        'jasmin-html': {
            deps: ['jasmin'],
            exports: 'jasmin'
        },
        'boot': {
            deps: ['jasmin-html', 'jasmin'],
            exports: 'jasmin'
        }
    },
    config: {}
});

require(['boot', 'test/spec/HomeViewSpec'], function (jasmine) {
    window.onload();
});