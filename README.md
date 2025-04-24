python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
CREAR UNA CARPETA EN EL BAKEND QUE SEA .ENV CON EL SIGUIENTE CODIGO 

""#MONGO_URI=mongodb+srv://kevingarciaj:kev3033@cluster0.rnqfiyd.mongodb.net/HIS?retryWrites=true&w=majority
MONGO_URI=mongodb+srv://JuanDiego:2022@cluster0.rnqfiyd.mongodb.net/HIS?retryWrites=true&w=majority
appName=Cluster0""

CORRE EL CODIGO ![image](https://github.com/user-attachments/assets/243da239-baf2-469d-ae55-c36f69a92e29)

PARA EL FRONTEND
descargamos node.js https://nodejs.org/es , con las tolls necesarias 
cd frontend
$env:PATH += ";C:\Program Files\nodejs\"
verificamos - npm -v 
corremos--  npm install
corremos - npm start
