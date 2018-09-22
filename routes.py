import xml.etree.ElementTree as ET
from datetime import datetime, timedelta

import requests
from dicttoxml import dicttoxml as xmlify
from flask import jsonify, request
from jwt import encode as jwtEncode
from xmltodict import parse as xmltodic  # , unparse as xmlify2

from app import app, db
from config import app_secret_key
from helpers import (buildUrlWithParams, filterCode, filterWithChild,
                      formatAttendanceFromDic, isFacultyUser)
from models import Lecture, StdAttendance
from wrappers import user_token_available, userRequired


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
def getCoursesAvailable():
    # get parameters
    code = request.args.get('code')
    beginTime = request.args.get('begin')
    endTime = request.args.get('end')
    day = request.args.get('day')
    sessionType = request.args.get('type')

    # get all schedules data
    try:
        r = requests.get('https://std.eng.cu.edu.eg/schedules.aspx/?s=0')
    except requests.exceptions.ConnectionError as error:
        return 'exception', {'msg': 'server is down now, try again later', 'detail': str(error)}, 200
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
    try:
        r = requests.get('https://std.eng.cu.edu.eg/schedules.aspx/?s=0')
    except requests.exceptions.ConnectionError as error:
        return 'exception', {'msg': 'server is down now, try again later', 'detail': str(error)}, 200
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
        return 'err', 'no such lecture', 404  # root, result, status
    # find lecture attendance
    attendance = lecture.attendance
    attendanceList = []
    for att in attendance:
        if (att.isAttend):
            attendanceList.append(str(att.student_id))

    studentAttendanceData = []
    url = 'https://std.eng.cu.edu.eg/schedules.aspx/?s={}'.format(
        lecture.schedule_id)
    print('fetching from: %r' % url)
    try:
        r = requests.get(url)
    except requests.exceptions.ConnectionError as error:
        return 'exception', {'msg': 'server is down now, try again later', 'detail': str(error)}, 200
    print('return from: %r' % url)
    root = ET.fromstring(r.text)
    # for every student in this schedule find if it attend or not
    for student in root.findall('Student'):
        currentId = student.find('StdCode').text
        studentAttendanceData.append({
            'id': currentId,
            'name': student.find('StdNameArabic').text,
            'attend': currentId in attendanceList
        })
    return {'id': lecture.id, 'status': lecture.attendanceStatusOpen, 'schedule_id': lecture.schedule_id, 'att': studentAttendanceData}


@app.route('/lecture/new/<schedule_id>', methods=['post'])
# @professor
def insertLecture(schedule_id):
    # should validate here the schedule id, but it requires fetching large data to only validate
    newL = Lecture(schedule_id=schedule_id, attendanceStatusOpen=False)
    db.session.add(newL)
    db.session.commit()
    return jsonify({'id': newL.id}), 200


@app.route('/changeStatus/<lecture_id>/<status>', methods=['post'])
# @professor
def changeLectureStatus(lecture_id, status):
    # should validate that he is the owner!!
    lecture = Lecture.query.filter_by(id=lecture_id).first()
    if (not lecture):
        return jsonify({'err': 'no such lecture'}), 404
    if (not(status == '0' or status == '1')):
        return jsonify({'err': 'status should be 0 or 1, can\'t be ' + status}), 400
    lecture.attendanceStatusOpen = (False, True)[int(status)]
    db.session.commit()
    return jsonify({'mes': 'lecture updated successfully'}), 200


@app.route('/attendance/<student_id>/<lecture_id>/<isAttend>')
# @user
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

    url = 'https://std.eng.cu.edu.eg/schedules.aspx/?s=' + \
        str(lecture.schedule_id)
    print('fetching from: %r' % url)
    try:
        r = requests.get(url)
    except requests.exceptions.ConnectionError as error:
        return 'exception', {'msg': 'server is down now, try again later', 'detail': str(error)}, 200
    print('return from: %r' % url)
    root = ET.fromstring(r.text)
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
def submitLectureAttendance(lecture_id):
    # [TODO]: should be the owner of the lecture

    lecture = getLectureInfo(lecture_id)
    if (type(lecture) is tuple):  # there is an error ocurred
        return jsonify({'err': lecture[1]}), 404

    # build request data
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
    '''.format('testm', 'testm', lecture.get('schedule_id'), attendanceDataFormated)

    # try to make the request
    try:
        r = requests.post(url, data=body, headers={
                          'Content-Type': contentType})
    except requests.exceptions.ConnectionError as error:
        return 'exception', {'msg': 'server is down now, try again later', 'detail': str(error)}, 200
    if (not r.ok):
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
        try:
            r = requests.get(
                'https://std.eng.cu.edu.eg/schedules.aspx/?s={}'.format(lecture.schedule_id))
        except requests.exceptions.ConnectionError as error:
            return 'exception', {'msg': 'server is down now, try again later', 'detail': str(error)}, 200
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

    try:
        r = requests.get(buildUrlWithParams(userId, password, 0,0))
    except requests.exceptions.ConnectionError as error:
        return 'exception', {'msg': 'server is down now, try again later', 'detail': str(error)}, 200
    if(not isFacultyUser(r.text)):
        return jsonify({'err': 'incorrect id or password '}), 400

    role = ('std', 'prof')[not userId.isdigit()]
    token = jwtEncode({
        'username': userId,
        'password': password,
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=48)
    }, app.config['SECRET_KEY']).decode('UTF-8')
    return jsonify({'token': token, 'role': role}), 200
