import requests

header = {
    "Content-Type": 'application/javascript; charset=ISO-8859-1',
}
response = requests.get('https://www.nmpa.gov.cn/ZvbYc1RuNkYg/6LweYeYIFMkG.a670748.js')
with open('ed.js', 'wb') as file_object:
    file_object.write(response.content)