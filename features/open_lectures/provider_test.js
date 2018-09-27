export const fetchStudentActiveLectures = async (studentId) => {
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