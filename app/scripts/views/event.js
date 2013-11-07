/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var hourHeight = 30;

    var EventView = Backbone.View.extend({

        tagName: 'div',

        className: 'event',

        template: JST['app/scripts/templates/event.ejs'],

        initialize: function(options) {
            this.day = options.day;
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.css(this.properties());
            return this;
        },

        properties: function() {
            return {
                height: this.model.getDuration() * hourHeight + 'px',
                top: (this.model.get('startTime') - 1) * hourHeight + 'px',
                width: this.calculateWidth() + '%',
                left: this.calculateWidth() * this.calculateColumn() + '%',
            }
        },

        calculateWidth: function() {
            var maxCollisions = this.model.maxConnectedCollisions();
            return 1 / maxCollisions * 100;
        },

        calculateColumn: function() {
            var collidingViews = this.getCollidingViews();

            // Of all possible columns ...
            this.column = _(_.range(collidingViews.length +1))
                // ... find the first column ...
                .find(function(column) {
                    // ... that is not occupied by a colliding event.
                    return !_(collidingViews).chain()
                        .pluck('column')
                        .contains(column)
                        .value();
                });

            // and we have the first empty column.
            return this.column;
        },

        getCollidingViews: function() {
            var collisions = this.model.collection.eventsAtHour(this.model.getHours());

            // cannot collide with yourself
            collisions = _(collisions).reject(function(model) {
                return model == this.model;
            }, this);

            // For all eventViews ...
            return _(this.day.eventViews).filter(function(eventView) {
                // ... get only the views ...
                return _(collisions).any(function(event) {
                    // ... that have models in the collisions array.
                    return event === eventView.model;
                }, this)
            }, this);
        }
    });

    return EventView;
});