# coding=UTF-8
import json
import requests
from flask import Flask, request, json
import database
import  algorithm
from algorithm.algorithm import get_answer

app = Flask(__name__)
db = database.Database()


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/admin', methods=['GET', 'POST'])
def admin_or_not():
    data = json.loads(request.get_data().decode('utf-8'))
    data = data['userid']
    admin = db.select_user(str(data))
    return json.dumps({"admin": admin})


@app.route('/comment', methods=['GET', 'POST'])
def comment_get():
    data = json.loads(request.get_data().decode('utf-8'))
    data = data['comment']
    print(data)
    username = str(data['username'])
    content = data['content']
    time = data['time']
    reply = data['reply']
    if reply is None:
        reply = ''
    checked = data['checked']
    if checked is False:
        checked = 0
    else:
        checked = 1
    reply_time = data['reply_time']
    if reply_time is None:
        reply_time = '0000-00-00 00:00:00'
    flag = db.insert_comment_data(username, content, time, reply, checked, reply_time)
    return json.dumps({"flag": flag})


@app.route('/load_comment', methods=['GET', 'POST'])
def load_comment():
    list_comment = db.select_comment()
    return json.dumps({"list": list_comment})


@app.route('/reply', methods=['GET', 'POST'])
def reply_msg():
    data = json.loads(request.get_data().decode('utf-8'))
    data = data['reply']
    username = data['username']
    time = data['time']
    reply = data['reply']
    reply_time = data['reply_time']
    flag = db.update_comment_data(username, time, reply, 1, reply_time)
    return json.dumps({"flag": flag})


@app.route('/add_movie', methods=['GET', 'POST'])
def add_movie():
    data = json.loads(request.get_data().decode('utf-8'))
    data = data['movie_info']
    username = data['movie_contributor']
    name = data['movie_name']
    intro = data['movie_intro']
    actors = data['movie_actors']
    m_type = data['movie_type']
    on_time = data['movie_date']
    flag = db.insert_movie_data(username, intro, on_time, actors, m_type, name)
    return json.dumps({"flag": flag})


@app.route('/login', methods=['GET', 'POST'])
def user_login():
    data = json.loads(request.get_data().decode('utf-8'))
    appID = 'wxfbd82ac5a5c5d0ab'  # 开发者关于微信小程序的appID
    appSecret = '2f8df154f4744d576ebdd332fd8c934f'  # 开发者关于微信小程序的appSecret
    code = data['code']  # 前端POST过来的微信临时登录凭证code
    print(code)
    req_params = {
        'appid': appID,
        'secret': appSecret,
        'js_code': code,
        'grant_type': 'authorization_code'
    }
    wx_login_api = 'https://api.weixin.qq.com/sns/jscode2session'
    response_data = requests.get(wx_login_api, params=req_params)  # 向API发起GET请求
    resData = response_data.json()
    openid = resData['openid']  # 得到用户关于当前小程序的OpenID
    return json.dumps({"openid": openid})


@app.route('/send_msg', methods=['GET', 'POST'])
def send_msg():
    data = json.loads(request.get_data().decode('utf-8'))
    msg = data['message']
    userID = data['userid']
    reply = get_answer(str(msg))
    return json.dumps({"reply": reply})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7473)
