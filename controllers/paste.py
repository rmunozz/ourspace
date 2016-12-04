import json

def get_paste():
    #rows = db().select(db.paste.paste_content, orderby=~db.paste.id)
    p = db(db.paste.user_email == request.vars.user_email).select(db.paste.ALL)
    paste_return = ""
    for entry in p:
        paste_return += entry.paste_content

    return response.json(dict(
        paste_content = paste_return
    ))


def send_paste():
    if(request.vars.user_email == ""):
        response.flash= T("Please login to save your paste!")
        return
    p = db.folder(db.paste.user_email == request.vars.user_email)
    if p is None:
        # insert into DB
        t_id = db.paste.insert(
            paste_content= request.vars.paste_content,
            user_email = request.vars.user_email
        )
        t = db.paste(t_id)
        return response.json(dict(folder = t))
    p.paste_content = request.vars.paste_content
    p.update_record()
    return response.json(dict(paste = p))
