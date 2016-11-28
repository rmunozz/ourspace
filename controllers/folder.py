# These are the controllers for your ajax api.
import datetime
def get_posts():

    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0

    """This controller is used to get the posts.  Follow what we did in lecture 10, to ensure
    that the first time, we get 4 posts max, and each time the "load more" button is pressed,
    we load at most 4 more posts."""
    # Implement me!\
    posts = []
    has_more = False

    rows = db().select(db.post.ALL,orderby=~db.post.created_on, limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            t = dict(
                post_content = r.post_content,
                user_email = r.user_email,
                created_on = r.created_on,
                updated_on = r.updated_on,
                post_id = r.id,
            )
            posts.append(t)
        else:
            has_more = True
    logged_in = auth.user_id is not None
    email = auth.user.email
    return response.json(dict(
        posts=posts,
        logged_in=logged_in,
        has_more=has_more,
        email=email,
    ))


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature(hash_vars=False)
def add_post():
    """Here you get a new post and add it.  Return what you want."""
    # Implement me!
    t_id = db.post.insert(
        post_content=request.vars.post_content,
        user_email = request.vars.user_email

    )
    t = db.post(t_id)
    return response.json(dict(post = t))


@auth.requires_signature()
def del_post():
    """Used to delete a post."""
    # Implement me!
    db(db.post.id == request.vars.post_id).delete()
    return "ok"
    #return response.json(dict())

def edit_post_url():
    edit_content = db.post(db.post.id == request.vars.post_id).post_content
    return response.json(dict(edit_content=edit_content))

@auth.requires_signature(hash_vars=False)
def edit_post_submit():
    p = db.post(db.post.id == request.vars.post_id)
    p.post_content = request.vars.edit_content
    p.updated_on = datetime.datetime.utcnow()
    p.update_record()
    return response.json(dict(post = p))