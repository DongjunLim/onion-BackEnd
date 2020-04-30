import requests

URL = 'http://127.0.0.1:3000/' + 'feed/'


uploadedFile = {'file' : open('test.jpg', 'rb')}

#headers = {'Content-Type': 'multipart/form-data'}
uploadedData ={'otherData' : 'abcd'}

def get(url,params):
    reponse = requests.get(url,params=params)
    print(reponse.status_code)
    print(reponse.json())

def post(url, upload, data):
    reponse = requests.post(url, files=upload, data=data)#headers=headers
    print(reponse.status_code)


#post('http://127.0.0.1:3000/forMethodTest', feed)




post('http://127.0.0.1:3000/feed/file', uploadedFile, uploadedData)