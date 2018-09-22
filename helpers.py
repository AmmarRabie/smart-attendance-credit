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

def buildUrlWithParams(*params):
    baseUrl = 'http://chws.eng.cu.edu.eg/webservice1.asmx/GetData?Params_CommaSeparated={}'
    parameters_coma_separated = ''
    for param in params:
        parameters_coma_separated += '{},'.format(param)
    return baseUrl.format(parameters_coma_separated[:-1])

def isFacultyUser(xmlText):
    return True