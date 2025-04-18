
import os
import pandas as pd
import json as js

# Función para cargar el archivo CSV como diccionario y enviarlo a MongoDB


# Función para cargar el archivo JSON como diccionario y enviarlo a MongoDB
def cargar_json(ruta_json, patients=None):
 # Ruta relativa

    with open(ruta_json, 'r', encoding='utf-8') as archivo:
        pacientes = js.load(archivo)
    if not pacientes:
        return {}
    
    # Tomar el primer paciente
    data = pacientes[0]  
    data_limpio = {key.strip(): value for key, value in data.items()}
    
    # Verificamos y convertimos 'ID' a string si existe
    if 'id' in data_limpio:
        data_limpio['ID'] = str(data_limpio.pop('id'))
    
    # Comprobamos si ya existe el ID en la base de datos
    if patients.find_one({'ID': data_limpio['ID']}):
        return f"[ERROR] El documento con ID {data_limpio['ID']} ya existe en MongoDB."
    
    # Insertar en MongoDB si no existe
    patients.insert_one(data_limpio)
    
    phrase = f"[JSON] Documento insertado en MongoDB: {data_limpio.get('ID', '(sin ID)')}"
    return phrase

def cargar_txt(ruta_txt,patients=None):
    
    # Abre el archivo y lee las líneas
    with open(ruta_txt, encoding='utf-8') as file:
        content = file.readlines()

    areas, tiempos = {}, {}
    nombre, apellido, paciente_id, fecha = "", "", "", ""

    # Procesa cada línea del archivo
    for line in content:
        parts = line.strip().split('|')

        # Extrae los datos del paciente cuando encuentra '3O'
        if '3O' in line:
            nombre, apellido = parts[12].strip(), parts[13].strip()
            paciente_id = parts[2].strip()

        # Extrae los datos de las áreas
        elif 'AREA' in line:
            codigo = parts[2].split('^')[3].strip()
            areas[codigo] = parts[3].strip()
            fecha = parts[12].strip()

        # Extrae los datos de los tiempos
        elif 'TIME' in line:
            codigo = parts[2].split('^')[3].strip()
            tiempos[codigo] = parts[3].strip()

    # Si se ha encontrado un paciente_id, crea el diccionario de datos
    if paciente_id:
        # Formatea la fecha
        fecha_formateada = f"{fecha[:4]}-{fecha[4:6]}-{fecha[6:8]}"
        
        # Organiza los datos en un diccionario
        data_paciente3 = {
            "nombre": nombre,
            "apellido": apellido,
            "ID": paciente_id,
            "fecha": fecha_formateada,
            "MEDICIONES": areas,
            "TIEMPOS": tiempos
        }
        
        # Verifica si el ID ya existe en la base de datos
        if patients.find_one({"ID": paciente_id}):
            return f"[ERROR] El documento con ID {paciente_id} ya existe en MongoDB."
        
        # Si el ID no existe, se inserta el documento
        patients.insert_one(data_paciente3)
        
        return f"[TXT] Documento insertado en MongoDB: {data_paciente3['ID']}"
    else:
        return "[ERROR] No se encontró un paciente con la información especificada."
def cargar_csv(ruta_csv,patients=None, delimitador=';'):

    # Leer el CSV
    df = pd.read_csv(ruta_csv, delimiter=delimitador)
    if df.empty:
        return {}
    
    # Tomar la primera fila y limpiar espacios
    data = df.to_dict(orient='records')[0]
    data_limpio = {key.strip(): value for key, value in data.items()}
    
    # Verificamos y convertimos 'ID' a string si existe
    if 'id' in data_limpio:
        data_limpio['ID'] = str(data_limpio.pop('id'))
    
    # Comprobamos si ya existe el ID en la base de datos
    if patients.find_one({'ID': data_limpio['ID']}):
        return f"[ERROR] El documento con ID {data_limpio['ID']} ya existe en MongoDB."
    
    # Insertar en MongoDB si no existe
    patients.insert_one(data_limpio)
    
    phrase = f"[CSV] Documento insertado en MongoDB: {data_limpio.get('ID', '(sin ID)')}"
    return phrase

def leer_archivos_dispositivos(nombre_archivo,database):
    base_dir = os.path.dirname(os.path.abspath(__file__))  # Ruta del script
    ruta = os.path.join(base_dir, '..',nombre_archivo)
    for filename in os.listdir(ruta):
        file_path = os.path.join(ruta, filename)
        if file_path.endswith('.txt'):
            respuesta= cargar_txt(file_path,database)
            print(respuesta)
        elif file_path.endswith('.csv'):
            respuesta= cargar_csv(file_path,database)
            print(respuesta)
        elif file_path.endswith('.json'):
            respuesta= cargar_json(file_path,database)
            print(respuesta)

