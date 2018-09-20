from flask import Flask, request, jsonify, redirect
from functools import wraps
import logging as Log
import xml.etree.ElementTree as ET
import requests
from flask_sqlalchemy import SQLAlchemy
from dicttoxml import dicttoxml as xmlify
from xmltodict import parse as xmltodic #, unparse as xmlify2
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mssql+pyodbc://AMMAR\SQLEXPRESS/test_creditSmartAttendance?driver=ODBC+Driver+11+for+SQL+Server'
db = SQLAlchemy(app)

def routeJsonAndXml(url, root='root'):
    def decorator(f):
        def jsonRes(*args, **kwargs):
            result = f(*args, **kwargs)
            status = 200
            if (type(result) is tuple):
                status = result[2] or status
                forcedRoot = result[0]
                result = result[1] or {''}
                return jsonify({forcedRoot: result}), status
            return jsonify({root: result}), status
        def xmlRes(*args, **kwargs):
            result = f(*args, **kwargs)
            status = 200
            if (type(result) is tuple):
                status = result[2] or status
                forcedRoot = result[0]
                result = result[1] or {''}          
                return xmlify({'cause': result}, custom_root=forcedRoot, attr_type=False), status
            return xmlify(result, custom_root=root, attr_type=False), status
        jsonRes.__name__ = f.__name__ + 'Json'
        xmlRes.__name__ = f.__name__ + 'Xml'
        
        app.route(url.format('json'))(jsonRes)
        app.route(url.format('xml'))(xmlRes)
        return f
    return decorator

# schedule = course => refer to the slot in the faculty table like 'lecture math at wednesday'
# lecture = session => refer to an instance of a schedule like 'lecture math at wednesday second weak of term'
class Lecture(db.Model):
    # [TODO]: should support the owner
    # [TODO]: should support the lecture status, may be the lecture it self is pended so students can't find it
    __tableName__ = 'Lecture'
    id = db.Column(db.Integer, primary_key=True)
    schedule_id = db.Column(db.Integer) # schedule this lecture belongs to
    attendanceStatusOpen = db.Column(db.Boolean, nullable=False)
    owner_id = db.Column(db.String(20)) # professor id (the owner)
    time_created = db.Column(db.DateTime(), default=datetime.now)
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    # def __repr__(self):
    #     return '<Lecture %r>' % self.attendanceStatusOpen
    


class StdAttendance(db.Model):
    student_id = db.Column(db.Integer, primary_key=True)
    lecture_id = db.Column(db.Integer, db.ForeignKey('lecture.id'), primary_key=True)
    isAttend = db.Column(db.Boolean, nullable=False)
    lecture = db.relationship('Lecture',
        backref=db.backref('attendance', lazy=True, cascade="all, delete-orphan"))
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


def professor(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # validate the token
        return f(*args, **kwargs)
    return decorated

def student(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # validate the token
        return f(*args, **kwargs)
    return decorated

def user(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # validate the token
        return f(*args, **kwargs)
    return decorated

@routeJsonAndXml('/courses-available.{}', root='courses')
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
    print("len of schedules returned: ", len(root.getchildren()))
    resultList = xmltodic(ET.tostring(root).decode())['AllSchedules']
    resultList = resultList['Schedule'] if resultList != None else []
    return resultList if type(resultList) is list else [resultList] 

@routeJsonAndXml('/codes.{}', root='codes')
def getAllCodes():
    r = requests.get('https://std.eng.cu.edu.eg/schedules.aspx/?s=0')
    print('at getAllCodes: data received from api')
    allData = ET.fromstring(r.text)
    uniqueCodes = []
    for schedule in allData:
        codeElement = schedule.find('Code')
        codeElement.text = codeElement.text[0:3]
        if (codeElement.text not in uniqueCodes):
            uniqueCodes.append(codeElement.text)
    return uniqueCodes

# note that attendance only returned for studnets currently in the schedule, meaning that if student attend in lecture of
# schedule and then unregistered from this schedule will not be came back in attendance list
@routeJsonAndXml('/lecture.{}/<lecture_id>', 'lecture')
def getLectureInfo(lecture_id):
    lecture = Lecture.query.filter_by(id=lecture_id).first()
    if (not lecture):
        return 'err', 'no such lecture', 404 # root, result, status
    # find lecture attendance
    attendance = lecture.attendance
    attendanceList = []
    for att in attendance:
        if (att.isAttend):
            attendanceList.append(str(att.student_id))
            
    studentAttendanceData = []
    url = 'https://std.eng.cu.edu.eg/schedules.aspx/?s={}'.format(lecture.schedule_id)
    print('fetching from: %r' %url)
    r = requests.get(url)
    print('return from: %r' %url)
    root = ET.fromstring(r.text)
    for student in root.findall('Student'): # for every student in this schedule find if it attend or not
        currentId = student.find('StdCode').text
        studentAttendanceData.append({
            'id': currentId,
            'name': student.find('StdNameArabic').text,
            'attend': currentId in attendanceList
        })
    return {'id': lecture.id, 'status': lecture.attendanceStatusOpen,'schedule_id': lecture.schedule_id, 'att': studentAttendanceData}

@app.route('/lecture/new/<schedule_id>', methods=['post'])
@professor
def insertLecture(schedule_id):
    # should validate here the schedule id, but it requires fetching large data to only validate
    newL = Lecture(schedule_id=schedule_id, attendanceStatusOpen=False)
    db.session.add(newL)
    db.session.commit()
    return jsonify({'id': newL.id}), 202

@app.route('/changeStatus/<lecture_id>/<status>', methods=['post'])
@professor
def changeLectureStatus(lecture_id, status):
    # should validate that he is the owner!!
    lecture = Lecture.query.filter_by(id=lecture_id).first()
    if (not lecture):
        return jsonify({'err': 'no such lecture'}), 404
    if (not(status == '0' or status == '1')):
        return jsonify({'err': 'status should be 0 or 1, can\'t be ' + status}), 400
    lecture.attendanceStatusOpen = (False,True)[int(status)]
    db.session.commit()
    return jsonify({'mes': 'lecture updated successfully'}), 200

@app.route('/attendance/<student_id>/<lecture_id>/<isAttend>')
@user
def changeStdAttendance(student_id, lecture_id, isAttend):
    # [TODO]: make sure that if the user is student, he update his attendance only
    lecture = Lecture.query.filter_by(id=lecture_id).first()
    if (not lecture):
        return jsonify({'err': 'no such lecture'}), 404

    if (lecture.attendanceStatusOpen == False):
        return jsonify({'err': 'not allowed, attendance is closed now'}), 403

    for att in lecture.attendance:
        if (str(att.student_id) == student_id):
            att.isAttend = bool(int(isAttend))
            db.session.add(lecture)
            db.session.commit()
            return jsonify({'mes': 'attendance updated successfully'}), 200
    
    url = 'https://std.eng.cu.edu.eg/schedules.aspx/?s=' + str(lecture.schedule_id)
    print('fetching from: %r' %url)
    r = requests.get(url)
    print('return from: %r' %url)
    root = ET.fromstring(r.text)
    for student in root.findall('Student'): # for every student in this schedule find if it attend or not
        currentId = student.find('StdCode').text
        if (currentId == student_id):
            lecture.attendance.append(StdAttendance(student_id=student_id, lecture_id=lecture_id, isAttend=bool(int(isAttend))))
            db.session.add(lecture)
            db.session.commit()
            return jsonify({'mes': 'attendance updated successfully'}), 200

    return jsonify({'err': 'no such student'}), 404

@professor
@app.route('/submit/<lecture_id>', methods=['post'])
def submitLectureAttendance(lecture_id):
    # [TODO]: should be the owner of the lecture

    lecture = getLectureInfo(lecture_id)
    if (type(lecture) is tuple): # there is an error ocurred
        return jsonify({'err': lecture[1]}), 404

    url = 'http://chws.eng.cu.edu.eg/webservice1.asmx?op=GetData'
    contentType = 'application/soap+xml; charset=utf-8'
    attendanceDataFormated = formatAttendanceFromDic(lecture.get('att')) 
    body = '''<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
        <GetData xmlns="http://tempuri.org/">
        <Params_CommaSeparated>{0},{1},17,{2};{3}</Params_CommaSeparated>
        </GetData>
    </soap12:Body>
    </soap12:Envelope>
    '''.format('testm','testm', lecture.get('schedule_id'), attendanceDataFormated)
    r = requests.post(url, data=body, headers={'Content-Type': contentType})
    if (not r.ok()):
        return jsonify({'err': 'can not submit the attendance'}), 400

    # deleting the submitted lecture
    submittedLecture = Lecture.query.filter_by(id=lecture_id).first()
    db.session.delete(submittedLecture)
    db.session.commit()
    
    return jsonify({'msg': 'submitted'}), 200

@routeJsonAndXml('/<student_id>/lectures.{}', root='lectures')
def getStdAvailableLectures(student_id):
    openLectures = Lecture.query.filter_by(attendanceStatusOpen=True)
    lectures = []
    for lecture in openLectures:
        print('[Lecture]: ')
        print(lecture.id)
        # [TODO]: may be more than lecture have the same schedule id!!, it shouldn't be only one open 
        r = requests.get('https://std.eng.cu.edu.eg/schedules.aspx/?s={}'.format(lecture.schedule_id))
        root = ET.fromstring(r.text)
        for student in root.findall('Student'):
            if (student.find('StdCode').text != student_id):
                continue
            lectures.append({'Lecture': lecture.as_dict()})
            # uncomment break if you want only first lecture
            # break
    return lectures


@routeJsonAndXml('/prof/<professor_id>/lectures.{}', root='lectures')
def getProfLectures(professor_id):
    profLectures = Lecture.query.filter_by(owner_id=professor_id)
    lectures = []
    for lecture in profLectures:
        curr = lecture.as_dict()
        # [TODO]: get the schedule data also and append it
        # [TODO]: get the professor data also and append it
        lectures.append(curr)
    return lectures

@app.route('/login')
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return jsonify({'err': "you should enter username and password"}), 401
    
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
    if (codeValue is None or codeValue.strip() == ''): return
    for child in root.findall('Schedule'):
        if (not (child.find('Code').text[0:3] == codeValue)):
            root.remove(child)

def filterWithChild(root, key, value):
    print('filterWithChild')
    if (value is None or value.strip() == ''): return
    for child in root.findall('Schedule'):
        if (not (child.find(key).text.strip() == value)):
            root.remove(child)
    print(root.getchildren().__len__())

def formatAttendanceFromDic(attendance):
    formatedString = ''
    for stdAtt in attendance:
        if (not stdAtt.get('attend')):
            formatedString += '|{}'.format(stdAtt.get('id'))
    if (formatedString.__len__ == 0):
        return formatedString
    return formatedString[1:]

if __name__ == "__main__":
    # use it when you want to run the api from the application
     app.run(debug=True, host='0.0.0.0')
    # use it when you want to run the api from your browser on pc
    # app.run(debug=True)
