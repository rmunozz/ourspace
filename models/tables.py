# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

db.define_table('room',
                Field('name', 'string', default="Silly Room Name xD"),
                Field('owner_email', default=auth.user.email if auth.user_id else None),
                )

# I don't want to display the user email by default in all forms.
db.room.owner_email.readable = db.room.owner_email.writable = False
db.room.name.requires = IS_NOT_EMPTY()

# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
