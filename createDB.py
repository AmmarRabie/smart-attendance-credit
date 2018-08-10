from App import db
from App import StdAttendace
from App import Lecture

db.create_all()

l1 = Lecture(schedule_id=17653, attendanceStatusOpen=False)
l2 = Lecture(schedule_id=17650, attendanceStatusOpen=True)
l3 = Lecture(schedule_id=17595, attendanceStatusOpen=True)
l4 = Lecture(schedule_id=17651, attendanceStatusOpen=True)

StdAttendace(student_id=1170406 ,lecture=l2, isAttend=True) # صلاح الدين احمد صلاح الدين احمد عثمان المحرزى
StdAttendace(student_id=1170339 ,lecture=l2, isAttend=True) # مهند هانى نظيف على جلبى
StdAttendace(student_id=1170487 ,lecture=l2, isAttend=True) # يوسف عادل محمود محمد نعمه الله جعفر
StdAttendace(student_id=1170170 ,lecture=l2, isAttend=True) # احمد عبد السلام السيد حافظ
StdAttendace(student_id=1170240 ,lecture=l2, isAttend=True) # الفاروق طلعت فاروق احمد
StdAttendace(student_id=1170437 ,lecture=l2, isAttend=True) # ندى محمود اسامة متولى باز
StdAttendace(student_id=1170279 ,lecture=l2, isAttend=True) # روان وليد سالم عبدالعظيم سالم
StdAttendace(student_id=1170461 ,lecture=l2, isAttend=True) # عزالدين طارق نبيل محمد عطيه
StdAttendace(student_id=1170341 ,lecture=l2, isAttend=False) # هايدى محمد مصطفى على
StdAttendace(student_id=1170256 ,lecture=l2, isAttend=False) # عمر محمد هشام فتحى عبدالسلام الطويل

StdAttendace(student_id=1170147 ,lecture=l3, isAttend=True)
StdAttendace(student_id=1164342 ,lecture=l3, isAttend=True)
StdAttendace(student_id=1170436 ,lecture=l3, isAttend=False)

db.session.add(l1)
db.session.add(l2)
db.session.add(l3)
db.session.add(l4)
db.session.commit()