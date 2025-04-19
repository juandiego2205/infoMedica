
import os
import pandas as pd
import json as js

# Función para cargar el archivo JSON como diccionario y enviarlo a MongoDB
import json as js

def cargar_json(ruta_json, patients=None):
    with open(ruta_json, 'r', encoding='utf-8') as archivo:
        pacientes = js.load(archivo)
    
    if not pacientes:
        return

    data = pacientes[0]
    data_limpio = {key.strip(): value for key, value in data.items()}

    if 'id' in data_limpio:
        data_limpio['ID'] = str(data_limpio.pop('id'))

    if patients.find_one({'ID': data_limpio['ID']}):
        return

    patients.insert_one(data_limpio)


# Función para cargar el archivo TXT como diccionario y enviarlo a MongoDB
def cargar_txt(ruta_txt, patients=None):
    with open(ruta_txt, encoding='utf-8') as file:
        content = file.readlines()

    areas, tiempos = {}, {}
    nombre, apellido, paciente_id, fecha = "", "", "", ""

    for line in content:
        parts = line.strip().split('|')

        if '3O' in line:
            nombre, apellido = parts[12].strip(), parts[13].strip()
            paciente_id = parts[2].strip()

        elif 'AREA' in line:
            codigo = parts[2].split('^')[3].strip()
            areas[codigo] = parts[3].strip()
            fecha = parts[12].strip()

        elif 'TIME' in line:
            codigo = parts[2].split('^')[3].strip()
            tiempos[codigo] = parts[3].strip()

    if paciente_id:
        fecha_formateada = f"{fecha[:4]}-{fecha[4:6]}-{fecha[6:8]}"

        data_paciente3 = {
            "nombre": nombre,
            "apellido": apellido,
            "ID": paciente_id,
            "fecha": fecha_formateada,
            "MEDICIONES": areas,
            "TIEMPOS": tiempos
        }

        if patients.find_one({"ID": paciente_id}):
            return  # No insertar si ya existe

        patients.insert_one(data_paciente3)


# Función para cargar el archivo CSV como diccionario y enviarlo a MongoDB
import pandas as pd

def cargar_csv(ruta_csv, patients=None, delimitador=';'):
    df = pd.read_csv(ruta_csv, delimiter=delimitador)
    
    if df.empty:
        return  # No hacer nada si el DataFrame está vacío
    
    # Tomar la primera fila y limpiar espacios
    data = df.to_dict(orient='records')[0]
    data_limpio = {key.strip(): value for key, value in data.items()}
    
    # Verificamos y convertimos 'ID' a string si existe
    if 'id' in data_limpio:
        data_limpio['ID'] = str(data_limpio.pop('id'))
    
    # Comprobamos si ya existe el ID en la base de datos
    if patients.find_one({'ID': data_limpio['ID']}):
        return  # No insertar si ya existe
    
    # Insertar en MongoDB si no existe
    patients.insert_one(data_limpio)


def leer_archivos_dispositivos(nombre_archivo,database):
    base_dir = os.path.dirname(os.path.abspath(__file__))  # Ruta del script
    ruta = os.path.join(base_dir, '..',nombre_archivo)
    for filename in os.listdir(ruta):
        file_path = os.path.join(ruta, filename)
        if file_path.endswith('.txt'):
            cargar_txt(file_path,database)
        elif file_path.endswith('.csv'):
            cargar_csv(file_path,database)
        elif file_path.endswith('.json'):
            cargar_json(file_path,database)

