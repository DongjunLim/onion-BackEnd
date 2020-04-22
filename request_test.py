import requests

URL = 'http://127.0.0.1:3000/' + '라우터 경로'


def get(url,params):
    reponse = requests.get(url,params=params)
    print(reponse.status_code)
    print(reponse.json())

def post(url,data):
    reponse = requests.post(url,data=data)
    print(reponse.status_code)

