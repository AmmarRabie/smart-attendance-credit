from app import cache
import requests
import xml.etree.ElementTree as ET


@cache.memoize(timeout=6*60*60)
def getAllSchedules():
    try:
        r = requests.get('http://std.eng.cu.edu.eg/schedules.aspx/?s=0')
        root = ET.fromstring(r.text)
    except requests.exceptions.ConnectionError as error:
        return None, {'msg': 'server is down now, try again later', 'detail': str(error)}
    except:
        return None, {'msg': 'unexpected error occurred'}
    return root, None


@cache.memoize(timeout=6*60*60)
def getSchedule(id):
    # build request data
    url = 'http://chws.eng.cu.edu.eg/webservice1.asmx?op=GetData'
    contentType = 'application/soap+xml; charset=utf-8'
    body = '''<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
        <GetData xmlns="http://tempuri.org/">
        <Params_CommaSeparated>{0},{1},17,{2};{3}</Params_CommaSeparated>
        </GetData>
    </soap12:Body>
    </soap12:Envelope>
    '''.format(userId, password, schedule_id, attendance)
    try:
        r = requests.get('http://std.eng.cu.edu.eg/schedules.aspx/?s=0')
        root = ET.fromstring(r.text)
    except requests.exceptions.ConnectionError as error:
        return None, {'msg': 'server is down now, try again later', 'detail': str(error)}
    except:
        return None, {'msg': 'unexpected error occurred'}
    return root, None


@cache.memoize(timeout=6*60*60)
def getScheduleStudents(id):
    try:
        r = requests.get(
            'http://std.eng.cu.edu.eg/schedules.aspx/?s={}'.format(id))
        root = ET.fromstring(r.text)
    except requests.exceptions.ConnectionError as error:
        return None, {'msg': 'server is down now, try again later', 'detail': str(error)}
    except:
        return None, {'msg': 'unexpected error occurred'}
    return root, None


def submitLectureAttendance(userId, password, schedule_id, attendance):
    # build request data
    url = 'http://chws.eng.cu.edu.eg/webservice1.asmx?op=GetData'
    contentType = 'application/soap+xml; charset=utf-8'
    body = '''<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
        <GetData xmlns="http://tempuri.org/">
        <Params_CommaSeparated>{0},{1},17,{2};{3}</Params_CommaSeparated>
        </GetData>
    </soap12:Body>
    </soap12:Envelope>
    '''.format(userId, password, schedule_id, attendance)

    # try to make the request
    try:
        r = requests.post(url, data=body, headers={
                          'Content-Type': contentType})
    except:
        return False
    return r.ok


@cache.memoize(timeout=6*60*60)
def testWithDiffParam(s):
    print('testWithDiffParam')
    return s

print(testWithDiffParam(2))
print(testWithDiffParam(5))
print(testWithDiffParam(9))
print(testWithDiffParam(2))
print(testWithDiffParam(5))
print(testWithDiffParam(9))