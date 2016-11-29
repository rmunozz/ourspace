// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };
    // Enumerates an array.
    var enumerate = function(v) {
        var k=0;
        return v.map(function(e) {e._idx = k++;});
    };

    function posts_url(start_indx, end_indx){
        var pp = {
            start_indx: start_indx,
            end_indx: end_indx
        };
        return get_posts_url + "?" + $.param(pp);
    }
    self.get_posts = function(){
        $.getJSON(posts_url(0,4), function (data){
           self.vue.posts = data.posts;
           self.vue.has_more = data.has_more;
           self.vue.logged_in = data.logged_in;
           self.vue.email = data.email;
           enumerate(self.vue.posts);

        })

    };
    self.get_more = function () {
        var num_posts = self.vue.posts.length;
        $.getJSON(posts_url(num_posts, num_posts + 4), function (data) {
            self.vue.has_more = data.has_more;
            self.extend(self.vue.posts, data.posts);
            enumerate(self.vue.posts);
        });
    };
    self.add_post = function(){
        self.vue.is_adding_post = false;
        $.post(add_post_url,
            {

                form_content: self.vue.form_content,
                email:self.vue.email

            },
            function (data) {
                $.web2py.enableElement($("#add_post_submit"));
                self.vue.posts.unshift(data.post);
                self.vue.form_content = "";
                enumerate(self.vue.posts);
            });

    };

    self.adding_post_button = function () {
        // The button to add a track has been pressed.
        self.vue.is_adding_post = !self.vue.is_adding_post;

    };

    self.edit_post = function(post_idx){
        var pp = {post_id:self.vue.posts[post_idx].post_id};
        self.vue.edit_post_id = post_idx;
        $.getJSON(is_edit_post_content + "?" + $.param(pp), function (data) {
            self.vue.edit_content = data.edit_content;});
    };

    self.edit_submit = function(){
        console.log('inside edit_submit');
      self.vue.is_edit_post = false;
      self.vue.edit_button = true;
        $.post(edit_post_submit,{
            edit_content: self.vue.edit_content,
            post_id: self.vue.posts[self.vue.edit_post_id].post_id
        },
        function (data) {
            $.web2py.enableElement($("#edit_post_submit"));
            self.vue.posts[self.vue.edit_post_id].post_content=self.vue.edit_content;
            self.vue.posts[self.vue.edit_post_id].updated_on = data.post.updated_on;
            enumerate(self.vue.posts);
        });
    };
    self.edit_post_button = function (post_id) {
        self.vue.is_edit_post = !self.vue.is_edit_post;
        self.edit_post(post_id);
    };
    self.delete_post = function (post_id) {
        $.post(del_post_url,
            {
                post_id: self.vue.posts[post_id].post_id
            },

                function () {
                    self.vue.posts.splice(post_id , 1);
                    enumerate(self.vue.posts);
                })

    };
    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            posts: [],
            get_post: false,
            is_adding_post: false,
            is_edit_post: false,
            has_more: false,
            logged_in: false,
            email: null,
            form_content: null,
            edit_post_id: null,
            edit_content: null,
            edit_button: false,
            page: 'default'


        },
        methods: {
            adding_post_button: self.adding_post_button,
            get_more: self.get_more,
            add_post: self.add_post,
            delete_post: self.delete_post,
            edit_post_button: self.edit_post_button,
            edit_post:self.edit_post,
            edit_submit:self.edit_submit

        }

    });

    self.get_posts();
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
