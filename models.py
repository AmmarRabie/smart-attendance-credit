from app import db
from datetime import datetime

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
    secret = db.Column(db.String(11), default='0000')
    def as_dict(self):
        all = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        del all['secret']
        return all
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
