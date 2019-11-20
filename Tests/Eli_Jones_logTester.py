import requests

base = 'http://localhost:3000'
start = '/login'
signup = '/signup'
passwords = '/passwordStorage'
forgot = '/forgotPass'
rest = '/restTest'
generator = '/generator'
signout = '/signout'


print("The log should show a get request to the login page")
page = requests.get(base + start)

print("The log should show a get request to the sign up page")
page = requests.get(base + signup)

print("The log should show a get request to the /passwords page")
page = requests.get(base + passwords)

print("The log should show a get request to the /forgotPass page")
page = requests.get(base + forgot)

print("The log should show a get request to the /resTest page")
page = requests.get(base + rest)

print("The log should show a get request to the /generator page")
page = requests.get(base + generator)

print("The log should show a get request to the /signout page")
page = requests.get(base + signout)