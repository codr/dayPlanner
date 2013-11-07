/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/event'
], function ($, _, Backbone, JST, EventView) {
    'use strict';

    var DayView = Backbone.View.extend({

        events: {
            'submit': 'createEvent',
            'click .clear': 'clearEvents',
        },

        template: JST['app/scripts/templates/day.ejs'],

        initialize: function() {

            this.listenTo(this.collection, 'add remove', this.addAllEvents);

            this.eventViews = [];

            this.render();
        },

        render: function() {
            this.$el.html(this.template());
        },

        createEvent: function(e) {
            e.preventDefault();

            this.collection.create({
                name: this.$('#event-name').val() || null,
                startTime: this.$('#start-time').val(),
                endTime: this.$('#end-time').val(),
            })
        },

        addEvent: function(model) {
            var view = new EventView({model: model, day: this});
            this.eventViews.push(view);
            this.$('.event-container').append(view.render().el);
        },

        addAllEvents: function() {
            this.$('.event-container').empty();
            this.eventViews = [];
            this.collection.each(this.addEvent, this);
        },

        clearEvents: function() {
            var model;
            while (model = this.collection.first()) {
                model.destroy();
            }
        }
    });

    return DayView;
});