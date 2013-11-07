/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var EventModel = Backbone.Model.extend({
        defaults: {
            name: 'event',
            startTime: 1,
            endTime: 2,
        },

        getDuration: function() {
            return this.get('endTime') - this.get('startTime'); // The minus will cast string to ints. TODO: handle type checking better.
        },

        isAtHour: function(hour) {
            return hour >= this.get('startTime') && hour < this.get('endTime');
        },

        getHours: function() {
            return _.range(1,12).filter(function(hour) {
                return this.isAtHour(hour);
            }, this);
        },

        maxConnectedCollisions: function() {
            return this.collection.maxConnectedCollisions(this.getHours());
        },

    });

    return EventModel;
});