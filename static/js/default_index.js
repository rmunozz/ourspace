// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Enumerates an array
    var enumerate = function(v) {
        var k=0;
        return v.map(function(e) {e._idx = k++;});
    };

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    //helper to get the room URL
    function rooms_url(start_idx, end_idx) {
        var pp = {
          start_idx: start_idx,
          end_idx: end_idx
        };
        return get_rooms_url + "?" + $.param(pp);
    }

    self.get_rooms = function () {
      $.getJSON(rooms_url(0,4), function (data) {
            self.vue.rooms = data.rooms;
            self.vue.has_more = data.has_more;
            self.vue.logged_in = data.logged_in;
            self.vue.email = data.email;
            enumerate(self.vue.rooms);
      })
    };

    self.get_more = function () {};


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            rooms: [],
            has_more: false,
            logged_in: null,
            email: null,
        },
        methods: {
            get_rooms: self.get_rooms,
            get_more: self.get_more
        }

    });

    self.get_rooms();
    $("#vue-div").show()
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
