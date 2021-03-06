# These are the controllers for your ajax api.
import datetime

def get_user_name_from_email(email):
    """Returns a string corresponding to the user first and last names,
    given the user email."""
    u = db(db.auth_user.email == email).select().first()
    if u is None:
        return 'None'
    else:
        return ' '.join([u.first_name, u.last_name])

def get_folders():

    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0

    """This controller is used to get the folderss.  Follow what we did in lecture 10, to ensure
    that the first time, we get 4 folderss max, and each time the "load more" button is pressed,
    we load at most 4 more folderss."""
    folders = []
    has_more = False

    #rows = db().select(db.folder.ALL,orderby=~db.folder.url_content, limitby=(start_idx, end_idx + 1))
    # this is bad -- should only get rows for current user
    rows = db().select(db.folder.ALL, orderby=~db.folder.created_on, limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            urls = []
            for url in r.url_content:
                urls.append(url)
            t = dict(
                url_content = urls,
                folder_name = r.folder_name,
                user_email = r.user_email,
                folder_id = r.id,
            )
            folders.append(t)
        else:
            has_more = True

    logged_in = auth.user_id is not None
    email = ""
    user_name = ""
    if logged_in:
        email = auth.user.email
    if email:
        user_name = get_user_name_from_email(email)

    return response.json(dict(
        folders=folders,
        logged_in = logged_in,
        has_more=has_more,
        email=email,
        user_name = user_name,
    ))


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature(hash_vars=False)
def add_folder():
    t_id = db.folder.insert(
        folder_name = request.vars.folder_name,
        url_content= request.vars.url_fields,
        user_email = request.vars.email
    )
    t = db.folder(t_id)
    return response.json(dict(folder = t))


@auth.requires_signature()
def del_folder():
    """Used to delete a folders."""
    # Implement me!
    db(db.folder.id == request.vars.folders_id).delete()
    return "ok"


def edit_get_folder():
    url_input_fields = db.folder(db.folder.id == request.vars.folder_id).url_content
    folder_name = db.folder(db.folder.id == request.vars.folder_id).folder_name
    edit_id = db.folder(db.folder.id == request.vars.folder_id).id
    return response.json(dict(url_input_fields=url_input_fields, folder_name = folder_name, edit_id=edit_id))

@auth.requires_signature(hash_vars=False)
def edit_submit_folder():
    po = db.folder(db.folder.id == request.vars.folders_id)
    po.folder_name = request.vars.new_name
    po.update_record()
    return response.json(dict(folder=po))

@auth.requires_signature(hash_vars=False)
def edit_folder_submit():
    p = db.folder(db.folder.id == request.vars.folder_id)
    p.url_content = request.vars.edit_content
    p.update_record()
    return response.json(dict(folders = p))

def deny_add_folders():
    response.flash = T("Please login to add a folder")
    return "ok"
