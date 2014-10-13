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

                    return false;
                }

                /* _.every loop breaks on false, so to counter the offset model id, return true in else fork */
                return true;

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
            this.options = options;
            this.input_el = this.options.input_el;

            /* Events */
            this.input_el.keyup(_.debounce(this.filter_collection, 0));
        },

        /* 
        * Filtering through a collection
        */

        filter_collection: function(e) {
            this.collection.fetch({
                'reset': true,
                'data': {
                    's': this.input_el.val()
                },
                'success': this.filter_collection_success
            });
        },
        filter_collection_success: function(e) {
            if (this.collection.length > 0) {
                /* show the results */
                this.collection.reset();
            } else {
                /* display "no results found" */
            }
        }
    });

    /*
    * Flunkybone.InfiniteCollectionView
    */

    var InfiniteCollectionView = Flunkybone.InfiniteCollectionView = Backbone.View.extend({
        modelView: null,
        initialize: function(options) {
            _.bindObj(this);

            /* Vars */
            this.end_of_list_el = options.end_of_list_el;
            this.options = options;
            this.limit = options.load_amount_limit;
            this.scroll_el = options.scroll_el;
            this.scroll_text_el = options.scroll_text;
            this.scroll_spinner_el = options.scroll_spinner;

            /* Events */
            this.scroll_el.click(this.ready_to_load);
            $(window).on("scroll", _.throttle(this.ready_to_load, 300));
        },

        /*
        * Load next set of elements for collection
        */

        load_more: function() {

            this.scroll_spinner_only();

            /* fetch */
            var response = this.collection.fetch({
                'merge': true,
                'data': {
                    'offset': this.collection.length,
                    'limit': this.limit
                }
            });

            if(response == "end_of_list") {
                this.end_of_list_el.show();
                this.scroll_el.hide();
            }
        },

        /* checks position of scroll element on page before loading more */
        ready_to_load: function() {

            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height();

            var elemTop = this.scroll_el.offset().top;
            // add to this measurement to ask element is at least x pixels up from bottom
            var elemBottom = elemTop + this.scroll_el.height() + 40;

            /* if element is scrolled into the view */
            if((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
                this.load_more();
            }

        },

        /* hide spinner, show text */
        scroll_text_only: function() {
            this.scroll_text_el.show();
            this.scroll_spinner_el.hide();
        },

        scroll_spinner_only: function() {
            this.scroll_text_el.hide();
            this.scroll_spinner_el.show();
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