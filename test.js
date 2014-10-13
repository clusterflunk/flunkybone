/*
* Stubbed Content for Demo
*/

var items = [
    {"id": "1", "body": "this is sparta", "html": "<li style=\"background-color: #779ECB;\">this is sparta</li>"},
    {"id": "2", "body": "this is rome", "html": "<li style=\"background-color: #FFB347;\">this is rome</li>"},
    {"id": "3", "body": "this is greece", "html": "<li style=\"background-color: #966FD6;\">this is greece</li>"},
    {"id": "4", "body": "this is persia", "html": "<li style=\"background-color: #C23B22;\">this is persia</li>"},
    {"id": "5", "body": "this is canadia", "html": "<li style=\"background-color: #990000;\">this is canadia</li>"},
    {"id": "6", "body": "this is 'merica", "html": "<li style=\"background-color: #03C03C;\">this is 'merica</li>"}
];

/*
* Models & Collections
*/

var Item = Backbone.Model.extend({
});

var Items = Backbone.Collection.extend({
    model: Item,
    fetch: function(options){
        var results = [];
        var search = options.data.s;

        _.each(items, function(item) {
            if(item.body.indexOf(search) != -1) {
                results.push(item);
            }
        });

        if (search == "") {
            results = items;
        }

        this.set(results);
    }
});

var InfiniteItems = Backbone.Collection.extend({
    model: Item,
    fetch: _.debounce(function(options) {
        var collection = this;
        var offset = options.data.offset;
        var limit = options.data.limit;

        var addition = items.slice(offset, (offset+limit));

        this.add(addition);

        if (this.length >= items.length) {
            return 'end_of_list';
        }
    }, 1500)
});

/* STANDARD USE DEMO */

/*
* Views
*/

var ItemView = Flunkybone.ModelView.extend({
    initialize: function() {
        _.bindObj(this);
    }
});

var ItemsView = Flunkybone.CollectionView.extend({
    modelView: ItemView,
    initialize: function() {
        _.bindObj(this);
    }
});

/* Vars */

var items_collection = new Items();
var items_el = $(".items");
var items_collection_view = new ItemsView({
    'collection': items_collection,
    'el': items_el
});

_.each(items, function(item, i) {
    window.setTimeout(function() {
        items_collection.add(item);
    }, i * 110);
});


/* FILTERABLE USE DEMO */

/*
* Views
*/

var FilterableItemView = Flunkybone.ModelView.extend({
    initialize: function() {
        _.bindObj(this);
    }
});

var FilterableItemsView = Flunkybone.CollectionView.extend({
    modelView: FilterableItemView,
    initialize: function() {
        _.bindObj(this);

        /* Cached Elements */
        this.items_el = this.$el.find('.filterable_items');
        this.input_el = $(".search_filterable_items");

        /* Subviews */
        this.live_filter_items = new Flunkybone.FilterableCollectionView({
            'el': this.items_el,
            'collection': this.collection,
            'input_el': this.input_el
        });
    }
});

/* Vars */

var filterable_items_collection = new Items();
var filterable_items_el = $(".filterable_items");
var filterable_items_collection_view = new FilterableItemsView({
    'collection': filterable_items_collection,
    'el': filterable_items_el
 });

_.each(items, function(item, i) {
    window.setTimeout(function() {
        filterable_items_collection.add(item);
    }, i);
});


/* INFINITE SCROLL DEMO */

/*
* Views
*/

var InfiniteItemView = Flunkybone.ModelView.extend({
    initialize: function() {
        _.bindObj(this);
    }
});

var InfiniteItemsView = Flunkybone.CollectionView.extend({
    modelView: InfiniteItemView,
    initialize: function() {
        _.bindObj(this);

        /* Cached Elements */
        this.items_el = this.$el;
        this.scroll_el = $('.load_more');

        /* Subviews */
        this.infinite_items = new Flunkybone.InfiniteCollectionView({
            'el': this.items_el,
            'collection': this.collection,
            'limit': 2,
            'end_of_list_el': this.items_el.find('.end'),
            'scroll_el': this.scroll_el,
            'scroll_el_bottom_margin': 40,
            'scroll_text_el': this.scroll_el.find('.text'),
            'scroll_spinner_el': this.scroll_el.find('.spinner_gif')
        });
    }
});


/* Vars */

var infinite_items_collection = new InfiniteItems();
var infinite_items_el = $(".infinite_items");
var infinite_items_collection_view = new InfiniteItemsView({
    'collection': infinite_items_collection,
    'el': infinite_items_el
});

_.each(items.slice(0,2), function(item, i) {
    window.setTimeout(function() {
        infinite_items_collection.add(item);
    }, i);
});