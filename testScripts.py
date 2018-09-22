from flask import jsonify
from app import app
from wrappers import user_token_available, userRequired

@app.route('/userAvailable/any')
@user_token_available
def test1(auth):
    return jsonify({'auth': auth})

@app.route('/userAvailable/prof')
@user_token_available('prof')
def test2(auth):
    return jsonify({'auth': auth})

@app.route('/userAvailable/std')
@user_token_available('std')
def test3(auth):
    return jsonify({'auth': auth})


@app.route('/userRequired/std')
@userRequired('std')
def test4(user):
    return jsonify(user)

@app.route('/userRequired/prof')
@userRequired('prof')
def test5(user):
    return jsonify(user)

@app.route('/userRequired/any')
@userRequired()
def test6(user):
    return jsonify(user)