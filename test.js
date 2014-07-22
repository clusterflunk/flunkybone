var Item = Backbone.Model.extend();

var Items = Backbone.Collection.extend({
    model: Item
});

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

var items = [
    {"body": "this is sparta", "html": "<li style=\"background-color: #779ECB;\">this is sparta</li>"},
    {"body": "this is rome", "html": "<li style=\"background-color: #FFB347;\">this is rome</li>"},
    {"body": "this is greece", "html": "<li style=\"background-color: #966FD6;\">this is greece</li>"},
    {"body": "this is persia", "html": "<li style=\"background-color: #C23B22;\">this is persia</li>"},
    {"body": "this is 'merica", "html": "<li style=\"background-color: #03C03C;\">this is 'merica</li>"}
];

var items_collection = new Items();
var items_el = $(".items");
var items_collection_view = new ItemsView({
    'collection': items_collection,
    'el': items_el
});

_.each(items, function(item, i) {
    window.setTimeout(function() {
        items_collection.add(item);
    }, i * 200);
});
