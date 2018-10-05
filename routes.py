import xml.etree.ElementTree as ET
from datetime import datetime, timedelta

import requests
import api_request as API
from dicttoxml import dicttoxml as xmlify
from flask import jsonify, request
from jwt import encode as jwtEncode
from xmltodict import parse as xmltodic
from sqlalchemy import desc
from app import app, db
from config import app_secret_key
from helpers import (buildUrlWithParams, filterCode, filterWithChild,
                     formatAttendanceFromDic, isFacultyUser, getScheduleDic)
from models import Lecture, StdAttendance
from wrappers import user_token_available, userRequired, userRequiredJson


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


@routeJsonAndXml('/courses-available.{}', root='courses')
@userRequired('prof')
def getCoursesAvailable(prof):
    # get parameters
    code = request.args.get('code')
    beginTime = request.args.get('begin')
    endTime = request.args.get('end')
    day = request.args.get('day')
    sessionType = request.args.get('type')

    # get all schedules data
    root, error = API.getAllSchedules()
    if(error):
        return 'err', error, 500

    # filter using parameters
    filterCode(root, code)
    filterWithChild(root, 'SessionType', sessionType)
    filterWithChild(root, 'DayName', day)
    filterWithChild(root, 'BeginTime', beginTime)
    filterWithChild(root, 'EndTime', endTime)

    resultList = xmltodic(ET.tostring(root).decode())['AllSchedules']
    resultList = resultList['Schedule'] if resultList != None else []
    return resultList if type(resultList) is list else [resultList]


@routeJsonAndXml('/codes.{}', root='codes')
@userRequired()
def getAllCodes(user):
    allData, error = API.getAllSchedules()
    if (error):
        return 'err', error, 500
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
@userRequired('prof')
def getLectureInfo(prof, lecture_id):
    lecture = Lecture.query.filter_by(id=lecture_id).first()
    if (not lecture):
        return 'err', 'no such lecture', 404  # root, result, status
    # find lecture attendance
    attendance = lecture.attendance
    attendanceList = []
    for att in attendance:
        if (att.isAttend):
            attendanceList.append(str(att.student_id))

    studentAttendanceData = []
    root, error = API.getScheduleStudents(lecture.schedule_id)
    if (error):
        return 'err', error, 500

    # for every student in this schedule find if it attend or not
    for student in root.findall('Student'):
        currentId = student.find('StdCode').text
        studentAttendanceData.append({
            'id': currentId,
            'name': student.find('StdNameArabic').text,
            'attend': currentId in attendanceList
        })
    lectureInfo = lecture.as_dict()
    lectureInfo['att'] = studentAttendanceData
    return lectureInfo


def getLectureInfo_base(prof, lecture_id):
    lecture = Lecture.query.filter_by(id=lecture_id).first()
    if (not lecture):
        return 'err', 'no such lecture', 404  # root, result, status
    # find lecture attendance
    attendance = lecture.attendance
    attendanceList = []
    for att in attendance:
        if (att.isAttend):
            attendanceList.append(str(att.student_id))

    studentAttendanceData = []
    root, error = API.getScheduleStudents(lecture.schedule_id)
    if (error):
        return 'err', error, 500

    # for every student in this schedule find if it attend or not
    for student in root.findall('Student'):
        currentId = student.find('StdCode').text
        studentAttendanceData.append({
            'id': currentId,
            'name': student.find('StdNameArabic').text,
            'attend': currentId in attendanceList
        })
    lectureInfo = lecture.as_dict()
    lectureInfo['att'] = studentAttendanceData
    return lectureInfo


@app.route('/lecture/new/<schedule_id>', methods=['post'])
@userRequiredJson('prof')
def insertLecture(prof, schedule_id):
    # should validate here the schedule id, but it requires fetching large data to only validate
    root, error = API.getSchedule(schedule_id, prof['id'], prof['password'])
    if (error):
        return jsonify({'err': error, 'cause': 'may be server is down or schedule id is not valid'})
    newL = Lecture(schedule_id=schedule_id,
                   attendanceStatusOpen=False, owner_id=prof['id'])
    db.session.add(newL)
    db.session.commit()
    return jsonify({'id': newL.id}), 200


@app.route('/changeStatus/<lecture_id>/<status>', methods=['post'])
@userRequiredJson('prof')
def changeLectureStatus(prof, lecture_id, status):
    lecture = Lecture.query.filter_by(id=lecture_id).first()
    if (not lecture):
        return jsonify({'err': 'no such lecture'}), 404
    if (not prof['id'] == lecture.owner_id):
        return jsonify({'err': 'owner only can change the attendance status'}), 403
    if (not(status == '0' or status == '1')):
        return jsonify({'err': 'status should be 0 or 1, can\'t be ' + status}), 400
    lecture.attendanceStatusOpen = (False, True)[int(status)]
    db.session.commit()
    return jsonify({'mes': 'lecture updated successfully'}), 200


@app.route('/attendance/<student_id>/<lecture_id>/<isAttend>', methods=['post'])
@userRequiredJson('any')
def changeStdAttendance(user, student_id, lecture_id, isAttend):
    if (student_id == '0'):
        student_id = user['id']
    lecture = Lecture.query.filter_by(id=lecture_id).first()
    if (not lecture):
        return jsonify({'err': 'no such lecture'}), 404
    # std => should be his attendance and atetndance is open
    if (user['role'] == 'std'):
        if(user['id'] != student_id):
            return jsonify({'err': "student can only update his attendance"}), 403
        if (lecture.attendanceStatusOpen == False):
            return jsonify({'err': 'not allowed, attendance is closed now'}), 403
    elif (lecture.owner_id != user['id']):
        return jsonify({'err': 'owner only can change the attendance of students'}), 403

    for att in lecture.attendance:
        if (str(att.student_id) == student_id):
            att.isAttend = bool(int(isAttend))
            db.session.add(lecture)
            db.session.commit()
            return jsonify({'mes': 'attendance updated successfully'}), 200

    root, error = API.getScheduleStudents(lecture.schedule_id)
    if (error):
        return jsonify({'err': error}), 500

    # for every student in this schedule find if it attend or not
    for student in root.findall('Student'):
        currentId = student.find('StdCode').text
        if (currentId == student_id):
            lecture.attendance.append(StdAttendance(
                student_id=student_id, lecture_id=lecture_id, isAttend=bool(int(isAttend))))
            db.session.add(lecture)
            db.session.commit()
            return jsonify({'mes': 'attendance updated successfully'}), 200

    return jsonify({'err': 'no such student'}), 404


@app.route('/submit/<lecture_id>', methods=['post'])
@userRequiredJson('prof')
def submitLectureAttendance(prof, lecture_id):
    lecture = getLectureInfo_base(prof, lecture_id)
    if (type(lecture) is tuple):  # there is an error ocurred
        return jsonify({'err': lecture[1]}), lecture[2]

    if (not prof['id'] == lecture['owner_id']):
        return jsonify({'err': 'owner only can submit the attendance'}), 403

    attendanceDataFormated = formatAttendanceFromDic(lecture.get('att'))
    ok = API.submitLectureAttendance(prof['id'], prof['password'], lecture.get(
        'schedule_id'), attendanceDataFormated)

    if (not ok):
        return jsonify({'err': 'can not submit the attendance'}), 400

    # deleting the submitted lecture
    submittedLecture = Lecture.query.filter_by(id=lecture_id).first()
    db.session.delete(submittedLecture)
    db.session.commit()

    return jsonify({'msg': 'submitted'}), 200


@routeJsonAndXml('/std/lectures.{}', root='lectures')
@userRequired('std')
def getStdAvailableLectures(std):
    # std['id'] = "1122325"  # for quick debug only
    openLectures = Lecture.query.filter_by(attendanceStatusOpen=True).order_by(
        desc(Lecture.time_created))  # [TODO]: should i retrieve only opened one or all
    lectures = []
    for lecture in openLectures:
        print("[Lecture]: {}".format(lecture.id))
        studentsRoot, studentsError = API.getScheduleStudents(
            lecture.schedule_id)
        if(studentsError):
            return 'err', studentsError, 500

        # if (lecture.schedule_id in ids): # optimization
        #     lectures.append(lecture.as_dict())
        #     continue

        for student in studentsRoot.findall('Student'):
            if (student.find('StdCode').text == std['id']):
                lectureInfo = lecture.as_dict()
                root, error = API.getSchedule(
                    lectureInfo['schedule_id'], std['id'], std['password'])
                if(error):
                    return 'err', error, 500
                # merge two dictionaries
                lectureInfo.update(getScheduleDic(root))
                lectures.append(lectureInfo)
            # uncomment break if you want only first lecture
                # break here from 2 loops
    return lectures


@routeJsonAndXml('/prof/lectures.{}', root='lectures')
@userRequired('prof')
def getProfLectures(prof):
    profLectures = Lecture.query.filter_by(
        owner_id=prof['id']).order_by(desc(Lecture.time_created))
    lectures = []
    for lecture in profLectures:
        curr = lecture.as_dict()
        # [TODO]: get the schedule data also and append it
        # [TODO]: get the professor data also and append it
        lectures.append(curr)
    return lectures


@app.route('/lecture/<lecture_id>/status')
@userRequiredJson()
def getLectureAttendanceStatus(user, lecture_id):
    lecture = Lecture.query.filter_by(id=lecture_id).first()
    if (not lecture):
        return jsonify({'err': 'no such lecture'}), 404
    return jsonify({'status': lecture.attendanceStatusOpen})


@app.route('/std/<lecture_id>/status')
@userRequiredJson('std')
def getStdAttendance(std, lecture_id):
    lecture = Lecture.query.filter_by(id=lecture_id).first()
    if (not lecture):
        return jsonify({'err': 'no such lecture'}), 404
    isAttend = False
    for stdAttendance in lecture.attendance:
        if(str(stdAttendance.student_id) == std['id'] and stdAttendance.isAttend == True):
            isAttend = True
            break
    return jsonify({'status': isAttend})


@app.route('/login')
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return jsonify({'err': "you should enter username and password"}), 401

    userId = auth.username
    password = auth.password

    try:
        r = requests.get(buildUrlWithParams(userId, password, 0, 0))
    except requests.exceptions.ConnectionError as error:
        return 'exception', {'msg': 'server is down now, try again later', 'detail': str(error)}, 200
    if(not isFacultyUser(r.text)):
        return jsonify({'err': 'incorrect id or password '}), 401

    role = ('std', 'prof')[not userId.isdigit()]
    token = jwtEncode({
        'username': userId,
        'password': password,
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=48)
    }, app.config['SECRET_KEY']).decode('UTF-8')
    return jsonify({'token': token, 'role': role}), 200
