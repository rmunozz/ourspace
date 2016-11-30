# These are the controllers for your ajax api.
import datetime
def get_folders():

    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0

    """This controller is used to get the folderss.  Follow what we did in lecture 10, to ensure
    that the first time, we get 4 folderss max, and each time the "load more" button is pressed,
    we load at most 4 more folderss."""
    # Implement me!\
    folders = []
    has_more = False

    rows = db().select(db.folder.ALL,orderby=~db.folder.url_content, limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            t = dict(
                url_content = r.url_content,
                folder_name = r.folder_name,
                user_email = r.user_email,
                folder_id = r.id,
            )
            folders.append(t)
        else:
            has_more = True
    logged_in = auth.user_id is not None
    email = auth.user.email
    return response.json(dict(
        folders=folders,
        logged_in = logged_in,
        has_more=has_more,
        email=email,
    ))


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature(hash_vars=False)
def add_folder():
    t_id = db.folder.insert(
        folder_name = request.vars.folder_name,
        folder_content=request.vars.url_content,
        user_email = request.vars.user_email

    )
    t = db.folder(t_id)
    return response.json(dict(folder = t))


@auth.requires_signature()
def del_folder():
    """Used to delete a folders."""
    # Implement me!
    db(db.folder.id == request.vars.folders_id).delete()
    return "ok"
    #return response.json(dict())

def edit_folder_url():
    edit_content = db.folder(db.folder.id == request.vars.folder_id).url_content
    return response.json(dict(edit_content=edit_content))

@auth.requires_signature(hash_vars=False)
def edit_folder_submit():
    p = db.folder(db.folder.id == request.vars.folder_id)
    p.url_content = request.vars.edit_content
    p.update_record()
    return response.json(dict(folders = p))
