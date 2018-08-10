from App import db
from App import StdAttendance
from App import Lecture

# try:
	# db.create_all()
	# print('3ady 5ales')
# except(err):

db.drop_all()
db.create_all()

l1 = Lecture(id=1, schedule_id=17653, attendanceStatusOpen=False)
l2 = Lecture(id=2, schedule_id=17650, attendanceStatusOpen=True)
l3 = Lecture(id=3, schedule_id=17595, attendanceStatusOpen=True)
l4 = Lecture(id=4, schedule_id=17651, attendanceStatusOpen=True)

StdAttendance(student_id=1170406 ,lecture=l2, isAttend=True) # صلاح الدين احمد صلاح الدين احمد عثمان المحرزى
StdAttendance(student_id=1170339 ,lecture=l2, isAttend=True) # مهند هانى نظيف على جلبى
StdAttendance(student_id=1170487 ,lecture=l2, isAttend=True) # يوسف عادل محمود محمد نعمه الله جعفر
StdAttendance(student_id=1170170 ,lecture=l2, isAttend=True) # احمد عبد السلام السيد حافظ
StdAttendance(student_id=1170240 ,lecture=l2, isAttend=True) # الفاروق طلعت فاروق احمد
StdAttendance(student_id=1170437 ,lecture=l2, isAttend=True) # ندى محمود اسامة متولى باز
StdAttendance(student_id=1170279 ,lecture=l2, isAttend=True) # روان وليد سالم عبدالعظيم سالم
StdAttendance(student_id=1170461 ,lecture=l2, isAttend=True) # عزالدين طارق نبيل محمد عطيه
StdAttendance(student_id=1170341 ,lecture=l2, isAttend=False) # هايدى محمد مصطفى على
StdAttendance(student_id=1170256 ,lecture=l2, isAttend=False) # عمر محمد هشام فتحى عبدالسلام الطويل

StdAttendance(student_id=1170147 ,lecture=l3, isAttend=True)
StdAttendance(student_id=1164342 ,lecture=l3, isAttend=True)
StdAttendance(student_id=1170436 ,lecture=l3, isAttend=False)

db.session.add(l1)
db.session.add(l2)
db.session.add(l3)
db.session.add(l4)
db.session.commit()

