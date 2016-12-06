#!/usr/bin/env python2.7

import os
from urlparse import urlparse
from twilio.rest.resources import Connection
from twilio.rest.resources.connection import PROXY_TYPE_HTTP

from twilio.rest import TwilioRestClient
import json




# To find these visit https://www.twilio.com/user/account
ACCOUNT_SID = #####################################
TOKEN = ################################
client = TwilioRestClient(ACCOUNT_SID, TOKEN)

twilio_number = "+8318245151"

@auth.requires_signature(hash_vars=False)
def send_folder():
    url_content = db.folder(db.folder.id == request.vars.folder_idx).url_content
    phone_num = db.auth_user(db.auth_user.email == request.vars.user_email).phone
    out = ""
    for url in url_content:
        out += url
    message = client.sms.messages.create(
        to=phone_num,
        from_="8318245151",
        body=out[4:-4]
    )
    return "ok"


def send_paste():
    if(request.vars.user_email == ""):
        response.flash= T("Please login to send your paste")
        return
    paste_content = db.paste(db.paste.user_email == request.vars.user_email).paste_content
    phone_num = db.auth_user(db.auth_user.email == request.vars.user_email).phone
    out = ""
    for msg in paste_content:
        out += msg
    message = client.sms.messages.create(
        to=phone_num,
        from_="8318245151",
        body=out
    )
    return "ok"
