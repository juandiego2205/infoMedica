import os
from flask.cli import load_dotenv
from functios import leer_archivos_dispositivos, generar_mensaje_hl7
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv # type: ignore
from flask_pymongo import PyMongo

# Cargar las variables del archivo .env
load_dotenv()

app = Flask(__name__)

# Obtener URI desde variable de entorno
uri = os.getenv("MONGO_URI")
app.config['MONGO_URI'] = uri

mongo = PyMongo(app)
CORS(app)

db = mongo.db
patients = db.Report

@app.route('/cargar_archivos', methods=['POST'])
def cargar_archivos():
    leer_archivos_dispositivos('Medical Files', patients)
    return jsonify({"mensaje": "Archivos cargados correctamente."})

@app.route('/insertar_paciente', methods=['POST'])
def insertar_paciente():
    data = request.json
    if patients.find_one({"ID": data["ID"]}):
        return jsonify({"error": "El paciente ya existe."}), 400

    fecha = data["fecha"]
    fecha_formateada = f"{fecha[:4]}-{fecha[4:6]}-{fecha[6:8]}"

    nuevo_paciente = {
        "nombre": data["nombre"],
        "apellido": data["apellido"],
        "ID": data["ID"],
        "fecha": fecha_formateada,
        "MEDICIONES": data["MEDICIONES"],
    }

    patients.insert_one(nuevo_paciente)
    return jsonify({"mensaje": "Paciente insertado correctamente."})

@app.route('/eliminar_paciente/<id_paciente>', methods=['DELETE'])
def eliminar_paciente(id_paciente):
    if patients.find_one({"ID": id_paciente}):
        patients.delete_one({"ID": id_paciente})
        return jsonify({"mensaje": "Paciente eliminado correctamente."})
    else:
        return jsonify({"error": "Paciente no encontrado."}), 404
    
@app.route('/obtener_paciente/<id_paciente>', methods=['GET'])
def obtener_paciente(id_paciente):
    paciente = patients.find_one({"ID": str(id_paciente)})
    if paciente:
        paciente['_id'] = str(paciente['_id'])  # Por si usas ObjectId
        return jsonify(paciente)
    else:
        return jsonify({"error": "Paciente no encontrado."}), 404
    
@app.route('/actualizar_paciente/<id_paciente>', methods=['PUT'])
def actualizar_paciente(id_paciente):
    data = request.json

    # Buscar al paciente por ID
    paciente = patients.find_one({"ID": str(id_paciente)})
    
    if not paciente:
        return jsonify({"error": "Paciente no encontrado."}), 404

    # No se debe actualizar el ID
    if "ID" in data:
        del data["ID"]

    # Separar en datos a actualizar y datos a eliminar
    update_data = {}
    unset_data = {}

    for key, value in data.items():
        if value in [None, ""]:  # Eliminar campos vacíos
            unset_data[key] = ""
        elif key == "fecha" and len(value) == 8:  # Formatear fecha si es necesario
            fecha_formateada = f"{value[:4]}-{value[4:6]}-{value[6:8]}"
            update_data[key] = fecha_formateada
        else:
            update_data[key] = value

    # Aplicar actualizaciones y eliminaciones
    if update_data:
        patients.update_one({"ID": str(id_paciente)}, {"$set": update_data})
    if unset_data:
        patients.update_one({"ID": str(id_paciente)}, {"$unset": unset_data})

    return jsonify({"mensaje": "Paciente actualizado correctamente."})

@app.route('/leer_paciente/<id_paciente>', methods=['GET'])
def leer_paciente(id_paciente):
    paciente = patients.find_one({"ID": id_paciente}, {"_id": 0})
    generar_mensaje_hl7(paciente)  # Generar mensaje HL7
    if paciente:
        return jsonify(paciente)
    else:
        return jsonify({"error": "Paciente no encontrado."}), 404

if __name__ == "__main__":
    app.run(debug=True)
