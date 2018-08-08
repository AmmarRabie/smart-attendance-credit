from flask import Flask, request, jsonify, redirect
from functools import wraps
import logging as Log
import xml.etree.ElementTree as ET
import requests
from flask_sqlalchemy import SQLAlchemy
from dicttoxml import dicttoxml

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mssql+pyodbc://AMMAR\SQLEXPRESS/test_from_api?driver=ODBC+Driver+11+for+SQL+Server'
db = SQLAlchemy(app)


class Lecture(db.Model):
    __tableName__ = 'Lecture'
    id = db.Column(db.Integer, primary_key=True)
    attendanceStatusOpen = db.Column(db.Boolean, nullable=False)
    # def __repr__(self):
    #     return '<Post %r>' % self.attendanceStatusOpen    
    


class StdAttendace(db.Model):
    student_id = db.Column(db.Integer, primary_key=True)
    lecture_id = db.Column(db.Integer, db.ForeignKey('lecture.id'), primary_key=True)
    isAttend = db.Column(db.Boolean, nullable=False)
    lecture = db.relationship('Lecture',
        backref=db.backref('attendance', lazy=True))
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}        
    # def __repr__(self):
    #     return '<Post %r>' % self.isAttend


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

@app.route('/attendance/<lecture_id>')
def getStudnetAttendance(lecture_id): 
    return jsonify({'err': 'getStudnetAttendance not implemented yet'}), 404

@app.route('/submit/<lecture_id>', methods=['post'])
def submitAttendance(lecture_id):
    return jsonify({'err': 'submitAttendance not implemented yet'}), 404

@app.route('/codes')
def getAttendanceStatus():
    return jsonify({'err': 'not implemented yet'}), 404

@app.route('/lecture.json/<lecture_id>')
def getLectureInfo_Json(lecture_id, jsonify=True):
    lecture = Lecture.query.filter_by(id=lecture_id).first()
    attendance = lecture.attendance
    attendanceList = []
    for att in attendance:
        attendanceList.append(att.as_dict())
    json = {'Lecture': {'id': lecture.id, 'status': lecture.attendanceStatusOpen, 'att': attendanceList}}
    return jsonify({'Lecture': json}) if jsonify else json

@app.route('/lecture/<lecture_id>')
@app.route('/lecture.xml/<lecture_id>')
def getLectureInfo(lecture_id):
    return dicttoxml(getLectureInfo_Json(lecture_id, jsonify=False), attr_type=False)

@app.route('/lecture/new', methods=['post'])
def insertLecture(lecture_id):
    return jsonify({'err': 'submitAttendance not implemented yet'}), 404

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
