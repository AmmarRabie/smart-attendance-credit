export const attendStudent = (studentId, lectureId) => {
    if (!studentId || !lectureId) return new Promise(
        (resolve, reject) => reject({ message: 'empty id or pass' })
    );
    return new Promise(
        (resolve, reject) => resolve({ msg: 'student attended successfully'})
    );
}

export const fetchLectureInfo = (lectureId) => {
    if (!lectureId) return new Promise(
        (resolve, reject) => reject({ message: 'empty id or pass' })
    );

    lecture = {
        att: 'nothing now (it is simulated)',
        status: true
    }
    return new Promise(
        (resolve, reject) => resolve({ lecture: lecture})
    );
}