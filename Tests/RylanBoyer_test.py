from bs4 import BeautifulSoup
import requests

base = 'http://localhost:3000'
start = '/login'

page = requests.get(base+start)

# Create a BeautifulSoup object
soup = BeautifulSoup(page.text, 'html.parser')

# Pull all text from the card-header div
page1 = soup.find(class_='card-header')

print("Does Login Page Display?")
pageT = page1.contents[0]

if pageT == 'Login':
    print('Correct')
else:
    print('Incorrect')

page1 = soup.find_all(class_='nav-link')
page1 = page1[1]
pageH = page1['href']

page = requests.get(base+pageH)
soup = BeautifulSoup(page.text, 'html.parser')
page1 = soup.find(class_='card-header')

print("Does Sign Up Page Display?")
pageT = page1.contents[0]
#print(pageT)
if pageT == 'Create An Account':
    print('Correct')
else:
    print('Incorrect')
page = requests.get(base+start)
page1 = soup.find(class_='col-md-6 offset-md-4')
page1 = page1.find_all('a')
pageH = '/forgotPass'

page = requests.get(base+pageH)
soup = BeautifulSoup(page.text, 'html.parser')
page1 = soup.find(class_='card-header')
print("Does Recovery Page Display?")
pageT = page1.contents[0]
#print(pageT)
if pageT == 'Recover Your Password':
    print('Correct')
else:
    print('Incorrect')








