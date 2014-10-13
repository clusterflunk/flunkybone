FlunkyBone
==========

A thin wrapper around backbone.js that does a few extra cool things.

### Filterable Collections Options

- "input_el": this is the input field that will be watched for changes and used to search collection

### Infinite Scroll Collection Options

- "limit": is how many items you want to load every time
- "end_of_list_el": this should be a list item that is at the bottom of the page, or anything that you want to display somewhere on the page when you've reached the end of the collection.
- "scroll_el": this is the wrapper of something at the bottom of the page or list that needs to be fully on screen to trigger more content to load
- "scroll_el_bottom_margin": this is how much room you want between the element and the bottom of the window before triggering the load
- "scroll_text_el": this is the part of the scroll element that shows text like "Load More" -- this is also clickable to load more if the list is too short to trigger scroll.
- "scroll_spinner_el": this is the gif that needs to be show/hidden while scrolling

Example:

```
/* Cached Elements */
this.items_el = this.$el;
this.end_of_list_el = this.items_el.find('.end');
this.scroll_el = $('.load_more');
this.scroll_text = this.scroll_el.find('.text');
this.scroll_spinner = this.scroll_el.find('.spinner_gif');

/* Subview */
this.infinite_items = new Flunkybone.InfiniteCollectionView({
    'el': this.items_el,
    'collection': this.collection,
    'limit': 2,
    'end_of_list_el': this.end_of_list_el,
    'scroll_el': this.scroll_el,
    'scroll_el_bottom_margin': 40,
    'scroll_text_el': this.scroll_text,
    'scroll_spinner_el': this.scroll_spinner
});
```
