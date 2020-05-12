import requests, json

#URL = 'http://127.0.0.1:3000/' + 'forMethodTest/'

URL = 'http://127.0.0.1:5000/' + 'classify'

def post(url, data):
    reponse = requests.post(url, data=data)#headers=headers
    print(reponse.text)



uploadedData ={'filename' : 'test.jpg'}








post(URL, json.dumps(uploadedData))