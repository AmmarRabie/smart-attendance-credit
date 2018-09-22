# smart-attendance-credit
smart attendance customized for credit hours systems in CUFE
# What is that

This is the main branch for the api our mobile application will use. So, we will only hit urls available here and not the faculty api itself.

As you can expected, this api is responsible for interfacing with the attendance database and the faculty api.
## Why only one api for the app
It may be not the ideal idea, but think of if manager wants to only stop using this attendance system, then he can easily only stop this
api from running.
Also dealing with only api from the app will be more convenient and modular.
# How to start for developers
Now we only have one file called App.py which holding all the logic. We are building this api using flask framework and 
SqlAlchemy for easy creating and interfacing our new database. And any requests or response are formatted in xml format either from faculty api or our api itself, so I use a lib for
easily interacting with it. As our api is very small and easy, we need only the introduction tutorials of these three libs (Flask, SqlAlchemy, ElementTree XML).
You can go ahead and search for every you want, I suggest these tutorials
* [Flask](https://blog.miguelgrinberg.com/post/designing-a-restful-api-with-python-and-flask)
* [SqlAlchemy](http://flask-sqlalchemy.pocoo.org/2.3/quickstart/#a-minimal-application)
* [ElementTree XML](https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.Element.remove)
* [requests](https://medium.com/@patrickcremin/http-requests-in-javascript-and-python-92b718b43b98) for dealing with the faculty api

# How to run it
before you run the main python file `App.py`, you need first to [create virtual environment](#create-virtual-environment) having all dependencies in [requirements.txt](https://github.com/AmmarRabie/smart-attendance-credit/blob/api/requirements.txt) and [create the database.](#create-database)

## create virtual environment
### Setup
point to the api dir and run this command
```
python -m venv venv
```
first venv in the command refer to the module that make the virtual environment and we call it venv. don't change the name of it so that not to update .gitignore file for every developer.

### activate
Now environment is created but we still run globally, to run from it we need no activate first. So run these cmds from api dir
```
cd venv/Scripts/
activate
cd..
cd..
```
### install dependencies
After creating the environment, we need to setup all modules we need which is found in the requirements.txt file. Run this command to do so
```
pip install -r requirements.txt
```

## create database
You should first make the database from sql server using windows authentication and give it a name say 'test_creditSmartAttendance'. Then open the app.py and find this line in the beginning of the file
```
app.config['SQLALCHEMY_DATABASE_URI'] = 'mssql+pyodbc://AMMAR\SQLEXPRESS/test_creditSmartAttendance?driver=ODBC+Driver+11+for+SQL+Server'
```
you have to update tow values according to your database server and name.
* 'AMMAR\SQLEXPRESS' should be your server name this one appears when you open your sql server studio and before you press connect.
* and the database name here is the same as we suppose.

Save the file, and then run this command from your api dir
```
python createDB.py
```
if no error you should see two tables and dummy values in it from sql server (refresh the database first)
## Run the server
To run the api, you want to run it from a virtual environment having all dependencies as we did above.
* activate the venv.
* point to the root dir.
* run the __init__.py using 'python __init__.py' command.
