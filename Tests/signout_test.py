from bs4 import BeautifulSoup
import requests

base = 'http://localhost:3000'
start = '/signout'

page = requests.get(base + start)

# Create a BeautifulSoup object
soup = BeautifulSoup(page.text, 'html.parser')

# Pull all text from the card-header div
page1 = soup.find(class_='card-header')

print("Does Sign Out runs and Login Page Display?")
# Pull the page title from card-header div
pageT = page1.contents[0]

if pageT == 'Login':
    print('Correct')
else:
    print('Incorrect')