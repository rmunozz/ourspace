# These are the controllers for your ajax api.

def get_user_name_from_email(email):
    """Returns a string corresponding to the user first and last names,
    given the user email."""
    u = db(db.auth_user.email == email).select().first()
    if u is None:
        return 'None'
    else:
        return ' '.join([u.first_name, u.last_name])

def get_rooms():
    """lists the rooms"""
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    rooms = []
    has_more = False

    rows = db().select(db.room.ALL, limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            t = dict(
                owner_email = r.owner_email,
                name = r.name,
                id = r.id,
            )
            rooms.append(t)
        else:
            has_more = True

    logged_in = auth.user_id is not None
    email = None
    if logged_in:
        email = auth.user.email

    return response.json(dict(
        rooms=rooms,
        logged_in=logged_in,
        has_more=has_more,
        email=email,
    ))


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
def add_post():
    """Here you get a new post and add it.  Return what you want."""
    # Implement me!
    return response.json(dict())


@auth.requires_signature()
def del_post():
    """Used to delete a post."""
    # Implement me!
    return response.json(dict())
