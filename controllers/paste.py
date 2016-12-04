def get_paste():
    rows = db().select(db.paste.ALL, orderby=~db.paste.id)
    paste_content = ""

    count = 0
    for row in rows:
        if count == 1:
            break
        paste_content += row.paste_content
        count += 1
    return response.json(dict(
        paste_content = paste_content
    ))

def send_paste():
    t_id = db.paste.insert(
        paste_content = request.vars.paste_content,
    )
    t = db.paste(t_id)
    return response.json(dict(paste = t))
