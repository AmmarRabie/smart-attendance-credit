from flask import Flask, request, jsonify, redirect
from functools import wraps
import logging as Log
import xml.etree.ElementTree as ET
import requests

app = Flask(__name__)


@app.route('/tryFromApp')
def tryFromApp():
    output = ['ammar', 'abrar']
    return jsonify({'response': output}), 200


@app.route('/courses-available')
def getCoursesAvailable():
    # get parameters
    code = request.args.get('code')
    beginTime = request.args.get('begin')
    endTime = request.args.get('end')
    day = request.args.get('day')
    sessionType = request.args.get('type')

    # get all schedules data 
    r = requests.get('https://std.eng.cu.edu.eg/schedules.aspx/?s=0')
    root = ET.fromstring(r.text)

    # filter using parameters
    filterCode(root, code)
    filterWithChild(root, 'SessionType', sessionType)
    filterWithChild(root, 'DayName', day)
    filterWithChild(root, 'BeginTime', beginTime)
    filterWithChild(root, 'EndTime', endTime)

    # log the size
    print("len of schedules returned: " + root.getchildren().__len__())   

    return ET.tostring(root).decode()

@app.route('/codes')
def getAllCodes():
    r = requests.get('https://std.eng.cu.edu.eg/schedules.aspx/?s=0')
    print('at getAllCodes: data received from api')
    allData = ET.fromstring(r.text)
    codesRote = ET.fromstring('<codes> </codes>')
    uniqueCodes = []
    for schedule in allData:
        codeElement = schedule.find('Code')
        codeElement.text = codeElement.text[0:3]
        if (codeElement.text not in uniqueCodes):
            uniqueCodes.append(codeElement.text)
            codesRote.append(codeElement)
    return ET.tostring(codesRote).decode()

@app.route('/login')
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return jsonify({'mes': "you should enter username and password"}), 400
    
    userId = auth.username
    password = auth.password

    # ...
    # login process from api using userId and password
    # ...

    # [start]: simulation of login
    if (len(userId) > 4 and len(password) > 4):
        return jsonify({'token': 'thisIsRealToken' + userId, 'role': ('std', 'prof')[not userId.isdigit()]}), 200

    return jsonify({'err': 'incorrect id or password '}), 400



############################################ Helpers ################################################################################

def filterCode(root, codeValue):
    if (codeValue is None): return
    for child in root.findall('Schedule'):
        if (not (child.find('Code').text[0:3] == codeValue)):
            root.remove(child)

def filterWithChild(root, key, value):
    print('filterWithChild')
    if (value is None): return
    for child in root.findall('Schedule'):
        if (not (child.find(key).text.strip() == value)):
            root.remove(child)
    print(root.getchildren().__len__())

if __name__ == "__main__":
    # use it when you want to run the api from the application
    # app.run(debug=True, host='0.0.0.0')
    # use it when you want to run the api from your browser on pc
    app.run(debug=True)
