/*global define*/

define([
    'underscore',
    'backbone',
    'models/event',
    'backbone.localStorage',
], function (_, Backbone, EventModel, BackboneLocalStorage) {
    'use strict';

    var EventsCollection = Backbone.Collection.extend({

        localStorage: new Backbone.LocalStorage('dayPlanner'),

        model: EventModel,

        comparator: 'startTime',

        /**
         * returns a list of events that are at the given hour or hours.
         */
        eventsAtHour: function(hours) {
            hours = _.isArray(hours) ? hours : [hours];
            return this.filter(function(event) {
                return _(hours).any(function(hour){
                    return event.isAtHour(hour);
                })
            })
        },

        /**
         * This will look at collisions and collisions of collisons to fidn the max.
         */
        maxConnectedCollisions: function(hours) {
            var allConnectedHours = this.getAllConnectedHours(hours);

            return _(allConnectedHours)
                .chain()
                .map(function(hour) {
                    return this.eventsAtHour(hour).length;
                }, this)
                .max()
                .value();
        },

        /**
         * Get all hours that are connected to the given hours.
         * This might be the entire day or just an hour.
         */
        getAllConnectedHours: function(hours) {
            var events = this.eventsAtHour(hours);

            var newHours = _(events).chain()
                .map(function(event) {
                    return event.getHours();
                })
                .flatten()
                .unique()
                .value();

            // If we have the same hours as we started with ...
            if (_(newHours).chain().difference(hours).isEmpty().value()) {
                // Looking at all the colliding events hasn't added more hours.
                // No reason to recurse.
                return newHours;
            } else {
                // We've added more hours. Recurse incase this new scope adds even more hours.
                return this.getAllConnectedHours(newHours);
            }
        },

    });

    return EventsCollection;
});