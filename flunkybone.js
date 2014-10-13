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
            _.every(this.views, function(view, index) {
                if (view.model.id == model.id) {
                    /* remove the view from the DOM */
                    view.remove();

                    /* remove from our list of views */
                    this.views.splice(index, 1);
                } else {
                    /* _.every loop breaks on false, so to counter the offset model id, return true in else fork */
                    return true;
                }
            }, this);
        }
    });

    /*
    * Flunkybone.FilterableCollectionView
    */

    var FilterableCollectionView = Flunkybone.FilterableCollectionView = Backbone.View.extend({
        modelView: null,
        initialize: function(options) {
            _.bindObj(this);

            /* Vars */
            this.options = options
            this.input_el = this.options.input_el

            /* Events */
            this.input_el.keydown(_.debounce(this.filter_collection, 0));
        },

        /* 
        * Filtering through a collection
        */

        input_el_keydown: function(e) {
            /* if user presses non alpha numeric key */
            if (!((48 >= e.which <= 90) || (96 >= e.which <= 105))) {
                /* prevent the form from submitting */
                return false;
            }
        },
        filter_collection: function(e) {
            if (this.input_el.val() !== '') {
                /* show spinner */

                this.collection.fetch({
                    'reset': true,
                    'data': {
                        's': this.input_el.val()
                    },
                    'success': this.filter_collection_success
                });
            }
        },
        filter_collection_success: function(e) {
            /* hide spinner */
            if (this.collection.length > 0) {
                /* show the results */
                this.collection.reset();
            } else {
                /* display "no results found" */
            }
        }
    });

    /*
    * Flunkybone.ViewCollection ---> ViewModel?
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