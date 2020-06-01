import requests
from bs4 import BeautifulSoup

URL = 'https://www.lidl.ro/cautare-magazin?ar=1'
page = requests.get(URL)

soup = BeautifulSoup(page.content, 'html.parser')

element = soup.find_all('article', class_='overlay overlay--small')

ls = []
for i in element:
    print(i.text)
    