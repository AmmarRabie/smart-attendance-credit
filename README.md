# smart-attendance-credit
smart attendance customized for credit hours systems in CUFE
# What is that
This is the main branch for the api our mobile application will use. So, we will only hit urls available here and not the faculty api itself.
As you can expected, this api is responsilbe for interfacing with the attendance database and the faculty api.
## Why only one api for the app
It may be not the ideal idea, but think of if manager wants to only stop using this attendance system, then he can easly only stop this
api from running.
Also dealing with only api from the app will be more convenient and modular.
# How to start for developers
Now we only have one file called App.py which holding all the logic. We are building this api using flask framework and 
SqlAlchemy for easy creating and intefacing our new database. And any requests or response are formatted in xml format either from faculty api or our api itsel, so I use a lib for
easly interacting with it. As our api is very small and easy, we need only the introduction tutorials of these three libs (Flask, SqlAlchemy, ElementTree XML).
You can go ahead and search for every you want, I suggest these tutorials
Flask: https://blog.miguelgrinberg.com/post/designing-a-restful-api-with-python-and-flask
SqlAlchemy: not sure 😢
ElementTree XML: https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.Element.remove
requests for dealing with the faculty api: https://medium.com/@patrickcremin/http-requests-in-javascript-and-python-92b718b43b98

# Run the api
To run the api, you want to run it from a virtual enviroment hasing all dependencies.
1- activate the venv.
2- point to the root dir.
3- run the App.py using 'python App.py' command.
