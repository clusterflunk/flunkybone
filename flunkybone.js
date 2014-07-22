/*
* Flunkybone.js
*/

var Flunkybone = {};

/* Flunkybone scope */
(function(Flunkybone, Backbone, _, $) {

    /*
    * Flunkybone.ViewCollection
    */

    var CollectionView = Flunkybone.CollectionView = Backbone.View.extend({
        modelView: null,
        constructor: function(options) {
            this.views = [];

            Backbone.View.apply(this, arguments);

            this._initialize();
            this._initialEvents();
        },
        _initialize: function() {
            /* Cached Elements */
            this.els = this.$el.children("li");
        },
        _initialEvents: function() {
            /* Events */
            this.listenTo(this.collection, 'add', this._add);
            this.listenTo(this.collection, 'remove', this._remove);
        },
        _add: function(model) {
            var view = new this.modelView({
                'model': model,
                'el': model.get('html')
            });

            /* find the index of the model in the collection, and also its
               previous index */
            var i = this.collection.indexOf(model);
            var prev_i = i - 1;

            /* put the view in our local array of views */
            this.views.splice(i, 0, view);

            /* put the post at the correct location in the DOM */
            if (prev_i > -1) {
                $(this.els[prev_i]).after(view.el);
            }
            else {
                this.$el.prepend(view.el);
            }

            /* refresh the elements */
            this.els = this.$el.children('li');
        },
        _remove: function(model) {
            _.each(this.views, function(view) {
                if (view.model.id == model.id) {
                    /* remove the view from the DOM */
                    view.remove();

                    /* remove from our list of views */
                    this.views.splice(i, 1);
                }
            });
        }
    });

    /*
    * Flunkybone.ViewCollection
    */

    var ModelView = Flunkybone.ModelView = Backbone.View.extend({
        constructor: function() {
            Backbone.View.apply(this, arguments);
        }
    });

    /*
    * Flunkybone.Utils
    */

    _.mixin({
        /*
        *  _.bindObj - bind all of an objects functions to a particular context.
        */

        bindObj: function(obj) {
            _.bindAll.apply(_, [obj].concat(_.functions(obj)));
        }
    });

})(Flunkybone, Backbone, _, $);