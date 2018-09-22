from flask import jsonify, request
from jwt import decode as jwtDecode
from functools import wraps
from dicttoxml import dicttoxml as xmlify
from config import app_secret_key

def user_token_available(role='any'):
    def wrapper(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            error = None
            currUser = None
            if 'x-access-token' in request.headers:
                token = request.headers['x-access-token']
                try:
                    data = jwtDecode(token, app_secret_key)
                    if (data['role'] == role or role == 'any'):
                        currUser = {'id': data.get('username'), 'password': data.get('password')}
                        print('{} successfully found'.format(currUser['id']))
                    else:
                        error = 'Not allowed for this user'
                except:
                    error = 'Token is invalid!'
            else:
                error = 'Token is missing!'

            auth = {'user': currUser, 'error': error}
            return fn(auth, *args, **kwargs)
        decorated.__name__ = "{}_{}".format(decorated.__name__, fn.__name__)
        return decorated
    #wrapper.__name__ = '{}_{}'.format(wrapper.__name__, random.randint(1,10000))
    return wrapper


def userRequired(role='any'):
    def decorator(fn): # (f, auth)
        @user_token_available(role)
        def decorated(auth, *args, **kwargs):
            if(auth['error']):
                return  'err', {'cause': auth['error']}, 404
            return fn(auth['user'], *args, **kwargs)
        decorated.__name__ = "{}_{}".format(decorated.__name__, fn.__name__)
        return decorated
    #decorator.__name__ = '{}_{}'.format(decorator.__name__, random.randint(1,10000))
    return decorator

def userRequiredJson(role='any'):
    def decorator(fn): # (f, auth)
        @user_token_available(role)
        def decorated(auth, *args, **kwargs):
            if(auth['error']):
                return jsonify({'msg': auth['error']}), 404
            return fn(auth['user'], *args, **kwargs)
        decorated.__name__ = "{}_{}".format(decorated.__name__, fn.__name__)
        return decorated
    #decorator.__name__ = '{}_{}'.format(decorator.__name__, random.randint(1,10000))
    return decorator