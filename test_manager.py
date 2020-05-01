import requests

URL = 'http://127.0.0.1:3000/' + 'forMethodTest/'

def post(url, data):
    reponse = requests.post(url, data=data)#headers=headers
    print(reponse.status_code)



uploadedData ={'otherData' : 'abcd'}








post(URL, uploadedData)