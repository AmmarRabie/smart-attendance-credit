from app import app
from models import Lecture, StdAttendance
import routes


if __name__ == "__main__":
    # use it when you want to run the api from the application
    app.run(debug=False, host='0.0.0.0')
