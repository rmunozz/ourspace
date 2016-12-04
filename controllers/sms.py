from twilio.rest import TwilioRestClient
import json

# To find these visit https://www.twilio.com/user/account
ACCOUNT_SID = "ACdeea4929a6b60bce587247ceae0267e6"
AUTH_TOKEN = "474195ed0551dcc532188f06438d16b3"
client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN)

twilio_number = "+8318245151"

@auth.requires_signature(hash_vars=False)
def send_folder():
    url_content = json.dumps(db.folder(db.folder.id == request.vars.folder_idx).url_content)
    out = ""
    for url in url_content:
        out += url
    message = client.sms.messages.create(
        to=auth.user.phone,
        from_="8318245151",
        body=out[2:-2]
    )
    return "ok"


def send_paste():
    if(request.vars.user_email == ""):
        response.flash= T("Please login to send your paste")
        return
    paste_content = db.paste(db.paste.user_email == request.vars.user_email).paste_content
    out = ""
    for msg in paste_content:
        out += msg
    message = client.sms.messages.create(
        to=auth.user.phone,
        from_="8318245151",
        body=out
    )
    return "ok"
