from flask import Flask, request, jsonify, redirect
from functools import wraps
import logging as Log
import xml.etree.ElementTree as ET
import requests
from flask_sqlalchemy import SQLAlchemy
from dicttoxml import dicttoxml

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mssql+pyodbc://AMMAR\SQLEXPRESS/test_creditSmartAttendance?driver=ODBC+Driver+11+for+SQL+Server'
db = SQLAlchemy(app)

# schedule = course => refer to the slot in the faculty table like 'lecture math at wednesday'
# lecture = session => refer to an instance of a schedule like 'lecture math at wednesday second weak of term'
class Lecture(db.Model):
    __tableName__ = 'Lecture'
    id = db.Column(db.Integer, primary_key=True)
    schedule_id = db.Column(db.Integer) # schedule this lecture belongs to
    attendanceStatusOpen = db.Column(db.Boolean, nullable=False)
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
    print("len of schedules returned: " + root.getchildren().__len__().__str__())   

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

# note that attendance only returned for studnets currently in the schedule, meaning that if student attend in lecture of
# schedule and then unregistered from this schedule will not be came back in attendance list
@app.route('/lecture.json/<lecture_id>')
def getLectureInfo_Json(lecture_id, shouldJsonify=True):
    lecture = Lecture.query.filter_by(id=lecture_id).first()
    if (not lecture):
        return jsonify({'err': 'no such lecture'}), 404
    # find lecture attendance
    attendance = lecture.attendance
    attendanceList = []
    for att in attendance:
        if (att.isAttend):
            attendanceList.append(str(att.student_id))


    studentAttendanceData = []
    url = 'https://std.eng.cu.edu.eg/schedules.aspx/?s=' + lecture.schedule_id.__str__()
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

    json = {'id': lecture.id, 'status': lecture.attendanceStatusOpen,'schedule_id': lecture.schedule_id, 'att': studentAttendanceData}
    return jsonify({'Lecture': json}) if shouldJsonify else json

@app.route('/lecture/<lecture_id>')
@app.route('/lecture.xml/<lecture_id>')
def getLectureInfo(lecture_id):
    return dicttoxml(getLectureInfo_Json(lecture_id, shouldJsonify=False), attr_type=False, custom_root='Lecture')

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
            lecture.attendance.append(StdAttendace(student_id=student_id, lecture_id=lecture_id, isAttend=bool(int(isAttend))))
            db.session.add(lecture)
            db.session.commit()
            return jsonify({'mes': 'attendance updated successfully'}), 200

    return jsonify({'err': 'no such student'}), 404

@app.route('/submit/<lecture_id>', methods=['post'])
@professor
def submitLectureAttendance(lecture_id):
    # [TODO]: should be the owner of the lecture
    attendanceXml = dicttoxml(getLectureInfo_Json(lecture_id, shouldJsonify = False).get('att'), custom_root='LectureAttendance')
    # [TODO]: call here faculty api and send the attendance
    submittedLecture = Lecture.query.filter_by(id=lecture_id).first()
    db.session.delete(submittedLecture)
    db.session.commit()
    return jsonify({'err': 'submitAttendance not implemented yet'}), 404

@app.route('/<student_id>/lectures')
def getStdAvailableLectures(student_id):
    openLectures = Lecture.query.filter_by(attendanceStatusOpen=True)
    lectures = []
    for lecture in openLectures:
        print('[Lecture]: ')
        print(lecture.id)
        r = requests.get('https://std.eng.cu.edu.eg/schedules.aspx/?s=' + lecture.schedule_id.__str__())
        root = ET.fromstring(r.text)
        for student in root.findall('Student'):
            if (student.find('StdCode').text != student_id):
                continue
            lectures.append({'Lecture': lecture.as_dict()})
            # uncomment break if you want only first lecture
            # break
    return  jsonify({'Lectures': lectures})


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
     app.run(debug=True, host='0.0.0.0')
    # use it when you want to run the api from your browser on pc
    # app.run(debug=True)
