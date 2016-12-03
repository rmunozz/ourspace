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
        return;
        return v.map(function(e) {e._idx = k++;});
    };

    function folder_url(start_indx, end_indx){
        var pp = {
            start_indx: start_indx,
            end_indx: end_indx
        };
        return get_folders_url + "?" + $.param(pp);
    }
    self.get_folders = function(){
        $.getJSON(folder_url(0,4), function (data){
           self.vue.folders = data.folders;
           self.vue.has_more = data.has_more;
           self.vue.logged_in = data.logged_in;
           self.vue.email = data.email;
           enumerate(self.vue.folders);

        })

    };
    self.get_more = function () {
        var num_folders = self.vue.folders.length;
        $.getJSON(folder_url(num_folders, num_folders + 4), function (data) {
            self.vue.has_more = data.has_more;
            self.extend(self.vue.folders, data.folders);
            enumerate(self.vue.folders);
        });
    };
    self.add_folder = function(){
        self.vue.is_adding_folders = false;
        var url_inputs = [];
        self.vue.url_input_fields.forEach(function (element)
                                          {
                                            url_inputs.push(element.url_field);
                                          } );
        console.log(url_inputs);
        var url_inputs_stringy = JSON.stringify(url_inputs);
        $.post(add_folder_url,
            {
                folder_name: self.vue.folder_name,
                url_fields: url_inputs_stringy,
                email:self.vue.email

            },
            function (data) {
                $.web2py.enableElement($("#add_folder_submit"));
                self.vue.folders.unshift(data.folder);
                self.vue.folder_content = "";
                enumerate(self.vue.folder);
            });

    };


    self.edit_folder = function(folders_idx){
        var pp = {folders_id:self.vue.folders[folders_idx].folders_id};
        self.vue.edit_folders_id = folders_idx;
        $.getJSON(is_edit_url_content + "?" + $.param(pp), function (data) {
            self.vue.edit_content = data.edit_content;});
    };

    self.edit_submit = function(){
        console.log('inside edit_submit');
      self.vue.is_edit_folders = false;
      self.vue.edit_button = true;
        $.folders(edit_folder_submit,{
            edit_content: self.vue.edit_content,
            folders_id: self.vue.folders[self.vue.edit_folders_id].folders_id
        },
        function (data) {
            $.web2py.enableElement($("#edit_folders_submit"));
            self.vue.folders[self.vue.edit_folders_id].folders_content=self.vue.edit_content;
            enumerate(self.vue.folders);
        });
    };
    // self.edit_folders_button = function (folders_id) {
    //     self.vue.is_edit_folders = !self.vue.is_edit_folders;
    //     self.edit_folders(folders_id);
    // };
    self.delete_folder = function (folders_id) {
        $.post(del_folders_url,
            {
                folders_id: self.vue.folders[folders_id].folders_id
            },

                function () {
                    self.vue.folders.splice(folders_id , 1);
                    enumerate(self.vue.folders);
                })

    };

    self.add_folder_entry = function () { // vue.js nation
      console.log("add folder entry");
      self.vue.url_input_fields.push({url_field: ""});
    };

    self.delete_folder_entry = function () {
      console.log("remove folder entry");
      self.vue.url_input_fields.pop();
    };


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            folders: [],
            get_folders: false,
            folder_name: null,
            is_adding_folders: false,
            is_edit_folders: false,
            has_more: false,
            logged_in: false,
            email: null,
            url_content: null,
            edit_folders_id: null,
            edit_content: null,
            edit_button: false,
            page: 'default',

            next_input_idx: 0,
            url_input_fields: [{url_field: ""}]

        },
        methods: {
            get_more: self.get_more,
            add_folder: self.add_folder,
            delete_folder: self.delete_folder,

            add_folder_entry: self.add_folder_entry,
            delete_folder_entry: self.delete_folder_entry,

            edit_folder:self.edit_folder,
            edit_submit:self.edit_submit


        }

    });

    self.get_folders();
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
