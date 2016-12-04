# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

import datetime

db.define_table('folder',
                Field('user_email', default=auth.user.email if auth.user_id else None),
                Field('folder_name', 'text'),
                Field('url_content', 'list:string'),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow()),
                )

# I don't want to display the user email by default in all forms.
db.folder.user_email.readable = db.folder.user_email.writable = False
db.folder.folder_name.requires = IS_NOT_EMPTY()
db.folder.url_content.requires = IS_NOT_EMPTY()

# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
