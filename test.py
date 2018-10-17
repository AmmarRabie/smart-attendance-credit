from app import app
from models import Lecture, StdAttendance
import imp
imp.load_source('test.routes', 'test.routes.py')

if __name__ == "__main__":
    # use it when you want to run the api from the application
    app.run(debug=True, host='0.0.0.0')
