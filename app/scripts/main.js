/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: 'vendor/bootstrap',
        'backbone.localStorage': '../bower_components/backbone.localStorage/backbone.localStorage'
    }
});

require([
    'jquery',
    'backbone',
    'collections/events',
    'views/day'
], function ($, Backbone, eventsCollection, dayView) {
    Backbone.history.start();

    var events = new eventsCollection();

    var day = new dayView({collection: events, el: $('#day')});

    events.fetch();

    //for debugging
    window.day = day;
});
