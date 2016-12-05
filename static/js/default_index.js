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

    function folder_url(start_idx, end_idx){
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx,
            user_email: self.vue.email,
        };
        return get_folders_url + "?" + $.param(pp);
    }

    self.jquery_init = function() {
      // code from http://stackoverflow.com/questions/11338592/how-can-i-bind-to-the-change-event-of-a-textarea-in-jquery
      self.vue.old_paste_content = self.vue.paste_content;
      $("#textarea").on("change keyup paste", function() {
        var currentVal = $(this).val();
        if(currentVal == self.vue.old_paste_content) {
            return; //check to prevent multiple simultaneous triggers
        }
      self.vue.old_paste_content = self.vue.paste_content;
      //action to be performed on textarea changed
      self.vue.textarea_changed = true;
    });

      // code from http://jsfiddle.net/Handyman/fNjFF/11/
      $('#paste_send').tooltip({
      items: 'a.target',
      content: 'Loading…',
      show: true,
      open: function(event, ui)
      {
          if (typeof(event.originalEvent) === 'undefined')
          {
              return false;
          }

          var $id = $(ui.tooltip).attr('id');

          // close any lingering tooltips
          $('div.ui-tooltip').not('#' + $id).remove();

          // ajax function to pull in data and add it to the tooltip goes here
      },
      close: function(event, ui)
      {
          ui.tooltip.hover(function()
          {
              $(this).stop(true).fadeTo(400, 1);
          },
          function()
          {
              $(this).fadeOut('400', function()
              {
                  $(this).remove();
              });
          })
      }
    })
    };

    self.get_folders = function(){
    // get the folder content
    $.get(folder_url(0,100), function(data)
       {
         self.vue.folders = data.folders;
         self.vue.logged_in = data.logged_in;
         self.vue.email = data.email;
         self.vue.user_name = data.user_name.split(" ")[0];
         enumerate(self.vue.folders);
         self.get_paste();
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
        // create a copy of url_input_fields and do for each on that :)
        // we need to do this since url_input_fields is used for vue.js nonsense
        var copied_fields = jQuery.extend({}, self.vue.url_input_fields); // uh........
        var mackey = Object.keys(copied_fields).map(function(key){return copied_fields[key];}); // uhhhhhh..............
        console.log(mackey); // an homage to wesley
        mackey.forEach(function (element)
                                          {
                                            var pattern = new RegExp('^(https:\\/\\/)?'+ // protocol
                                             '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
                                             '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                                             '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                                             '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                                             '(\\#[-a-z\\d_]*)?$','i');
                                             res = element.url_field.substr(0,8);
                                             if(!pattern.test(element.url_field)) {
                                                //window.alert("Please enter a valid URL.");
                                              }else if(res != "https://" || res.substr(0,7)!="http://"){
                                                element.url_field = "http://" + element.url_field;
                                              }
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
                self.vue.folder_name = "";
                self.vue.url_input_fields.splice(1, self.vue.url_input_fields.length);
                self.vue.url_input_fields.forEach(function(element, index) // javascript....
                      {
                        self.vue.url_input_fields[index].url_field = "";
                      });
                enumerate(self.vue.folders);
            });
    };


    // deprecated
    self.edit_folder = function(folders_idx){
        console.log("edit_folder");
        self.vue.is_edit_folders = true;
        self.vue.is_adding_folders = false;
        self.edit_folder_get_content(folders_idx);
    };

    // deprecated
    self.edit_folder_get_content = function(folders_idx) {
      var my_folder_id = self.vue.folders[folders_idx].id;
      self.vue.edit_index = folders_idx;
      $.post(edit_folder_get_url,
        {
          folder_id: my_folder_id,
        },
        function (data) {
          var url_list = JSON.parse(data.url_input_fields);
          self.vue.edit_folder_name = data.folder_name;
          self.vue.edit_id = data.edit_id;
          enumerate(self.vue.folders);
        });
    };

    // deprecated
    self.edit_folder_submit = function(){
      console.log('inside edit_submit');
      self.vue.is_edit_folders = false;
      var new_content = [];
      self.vue.edit_url_input_fields.forEach(
            function(element,index)
            {
                console.log(element);
                new_content.push(element);
            });
        var new_url_stringy = JSON.stringify(new_content);
        $.post(edit_folder_submit_url,
          {
            edit_content: self.vue.new_url_stringy,
            new_name: self.vue.edit_folder_name,
            folders_id: self.vue.edit_id,
          },
          function (data) {
              $.web2py.enableElement($("#edit_submit"));
              self.vue.folders[self.vue.edit_index].folder_name = data.folder.folder_name;

              //self.vue.edit_url_input_fields = [];
              self.vue.url_input_fields.splice(1, self.vue.url_input_fields.length);
              self.vue.url_input_fields.forEach(function(element, index) // javascript....
                    {
                      self.vue.url_input_fields[index].url_field = "";
                    });
              self.vue.edit_folder_name = "";
              enumerate(self.vue.folders)
          });
    };

    self.delete_folder = function (folders_id) {
        console.log("look here: " + self.vue.folders[folders_id].folder_id)
        var id_to_send = self.vue.folders[folders_id].folder_id;
        console.log("id to send: " + id_to_send);
        $.post(del_folder_url,
            {
                folders_id: id_to_send
            },
            function () {
                self.vue.folders.splice(folders_id , 1);
                enumerate(self.vue.folders);
            })

    };

    self.open_urls = function (url_string) {
      var url_json = JSON.parse(url_string);
      $.each(url_json, function(index)
                       {
                         self.vue.open(url_json[index]);
                       });
    };

    self.open = function(url){
        console.log(url);
        window.open(url,"_blank");
    }


    self.add_folder_entry = function () { // vue.js nation
      console.log("add folder entry");
      self.vue.url_input_fields.push({url_field: ""});
    };

    self.delete_folder_entry = function () {
      console.log("remove folder entry");
      if(self.vue.url_input_fields.length > 1)
        self.vue.url_input_fields.pop();
    };

    self.send_paste = function() {
      console.log(self.vue.email);
      $.post(send_paste_url,
        {
            user_email: self.vue.email,
            paste_content: self.vue.paste_content,
        },
        function (data) {
            $.web2py.enableElement($("#paste_save"));
            self.vue.textarea_changed = false;
            //self.vue.paste_content = data.paste.paste_content;
        })
    };

    self.get_paste = function() {
      console.log(self.vue.email);
      $.post(get_paste_url,
        {
          user_email: self.vue.email,
        }
        , function(data)
        {
          self.vue.paste_content = data.paste_content;
        })
    };

    self.new_folder_button = function() {
      if(self.vue.email == "")
      {
        $.get(add_folder_denied);
        return;
      }
      self.vue.is_adding_folders = !self.vue.is_adding_folders;
      //enumerate(self.vue.folders);
    }

    self.edit_folder_cancel_button = function() {
      self.vue.is_edit_folders = false;
      //self.vue.edit_url_input_fields = [];
      self.vue.url_input_fields.splice(1, self.vue.url_input_fields.length);
      self.vue.url_input_fields.forEach(function(element, index) // javascript....
            {
              self.vue.url_input_fields[index].url_field = "";
            });
      self.vue.edit_folder_name = "";
      enumerate(self.vue.folders);
    };

    self.folder_send_phone = function(folders_idx) {
      var folder_id = self.vue.folders[folders_idx].id
      console.log("sending folder to phone");
      $.get(send_folder_phone_url,
      {
        folder_idx: folder_id,
        user_email: self.vue.email,
      });
    };

    self.send_paste_phone = function() {
      console.log("sending paste to phone");
      $.get(send_paste_phone_url,
        {
          user_email: self.vue.email,
        });
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
            user_name: null,

            url_content: null,

            edit_folders_id: null,
            edit_url_input_fields: [{url_field: ""}],
            edit_folder_name: null,
            edit_button: false,
            edit_id: -1,
            edit_index: -1,

            page: 'default',

            paste_content: null,
            old_paste_content: null,
            textarea_changed: false,

            next_input_idx: 0,
            url_input_fields: [{url_field: ""}],


        },
        computed: {

          // check if new_folder_button should be enabled
          folder_enabled : function ()
              {
                var enabled = false;
                if((this.is_adding_folders == false) && (this.is_edit_folders == false))
                  enabled = true;
                return enabled;
              },

          // check if new_folder_button should be disabled
          folder_disabled : function ()
              {
                var disabled = false;
                if((this.is_adding_folders == true) || (this.is_edit_folders == true))
                  disabled = true;
                return disabled;
              }
        }
        ,
        methods: {
            get_more: self.get_more,
            add_folder: self.add_folder,
            delete_folder: self.delete_folder,

            new_folder_button: self.new_folder_button,

            add_folder_entry: self.add_folder_entry,
            delete_folder_entry: self.delete_folder_entry,

            edit_folder: self.edit_folder,
            edit_folder_get_content: self.edit_folder_get_content,
            edit_folder_submit:self.edit_folder_submit,
            edit_folder_cancel_button: self.edit_folder_cancel_button,

            open: self.open,
            open_urls: self.open_urls,

            send_paste: self.send_paste,

            folder_send_phone: self.folder_send_phone,
            send_paste_phone: self.send_paste_phone,

            jquery_init: self.jquery_init,

        }

    });

    self.jquery_init();
    self.get_folders();
    //self.get_paste();
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
