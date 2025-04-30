import os
import pandas as pd
import json as js
from datetime import datetime

# Función para cargar el archivo JSON como diccionario y enviarlo a MongoDB
def cargar_json(ruta_json, patients=None):
    with open(ruta_json, 'r', encoding='utf-8') as archivo:
        pacientes = js.load(archivo)
    if not pacientes:
        return {}
    data = pacientes[0]  # Tomar el primer paciente de la lista creada
    data_limpio = {key.strip(): value for key, value in data.items()}

    # Verificamos y convertimos 'ID' a string si existe
    if 'id' in data_limpio:
        data_limpio['ID'] = str(data_limpio.pop('id'))

    # Comprobamos si ya existe el ID en la base de datos
    if patients.find_one({'ID': data_limpio['ID']}):
        return f"[ERROR] El documento con ID {data_limpio['ID']} ya existe en MongoDB."
    
    # Insertar en MongoDB si no existe
    del data_limpio['Comorbilidades']
    data_limpio = {k: v for k, v in data_limpio.items() if v is not None}
    patients.insert_one(data_limpio)

    phrase = f"[JSON] Documento insertado en MongoDB: {data_limpio.get('ID', '(sin ID)')}"

    return phrase

# Función para cargar el archivo TXT como diccionario y enviarlo a MongoDB
def cargar_txt(ruta_txt,patients=None):
    with open(ruta_txt, encoding='utf-8') as file:
        content = file.readlines()
    areas, tiempos = {}, {}
    nombre, apellido, paciente_id, fecha = "", "", "", ""

    for line in content:
        parts = line.strip().split('|')

        if '3O' in line:
            nombre, apellido = parts[12].strip(), parts[13].strip() # Los datos del paciente cuando encuentra '3O'
            paciente_id = parts[2].strip()
        elif 'TOTAL' in line:
            pass
        elif 'AREA' in line:
            codigo = parts[2].split('^')[3].strip()
            areas[codigo] = parts[3].strip()
            fecha = parts[12].strip()
    # Si se ha encontrado un paciente_id, crea el diccionario de datos
    if paciente_id:
        fecha_formateada = f"{fecha[:4]}-{fecha[4:6]}-{fecha[6:8]}" # Formatea la fecha
        
        data_paciente3 = {
            "nombre": nombre,
            "apellido": apellido,
            "ID": paciente_id,
            "fecha": fecha_formateada,
            "MEDICIONES": areas,
        }
        
        # Verifica si el ID ya existe en la base de datos
        if patients.find_one({"ID": paciente_id}):
            return f"[ERROR] El documento con ID {paciente_id} ya existe en MongoDB."
        
        #SI no, se inserta el documento
        data_paciente3 = {k: v for k, v in data_paciente3.items() if v is not None}
        patients.insert_one(data_paciente3)
        
        return f"[TXT] Documento insertado en MongoDB: {data_paciente3['ID']}"
    else:
        return "[ERROR] No se encontró un paciente con la información especificada."

# Función para cargar el archivo CSV como diccionario y enviarlo a MongoDB
def cargar_csv(ruta_csv,patients=None, delimitador=';'):
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
    data_limpio = {k: v for k, v in data_limpio.items() if not pd.isna(v)}
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

def generar_mensaje_hl7(paciente):
    def safe_get(dic, key, default=''):
        return dic.get(key, default).strip() if isinstance(dic.get(key), str) else dic.get(key, default)

    def formato_fecha(fecha):
        if isinstance(fecha, int):
            return str(fecha)
        elif isinstance(fecha, str):
            return fecha.replace("-", "").replace(":", "").replace(" ", "")
        return datetime.now().strftime("%Y%m%d%H%M%S")

    # Preparar carpeta
    carpeta = "data"
    os.makedirs(carpeta, exist_ok=True)

    # Segmento MSH
    mensaje = []
    fecha_actual = datetime.now().strftime("%Y%m%d%H%M%S")
    mensaje.append(f"MSH|^~\\&|LAB|SISTEMA|HIS|HOSPITAL|{fecha_actual}||ORU^R01|MSG001|P|2.5")

    # Segmento PID
    nombre = safe_get(paciente, 'nombre') or safe_get(paciente, 'name') or safe_get(paciente, 'Pname')
    apellido = safe_get(paciente, 'apellido') or safe_get(paciente, 'lastname') or safe_get(paciente, 'Plastname')
    id_paciente = safe_get(paciente, 'ID', 'UNKNOWN')
    pid = f"PID|1||{id_paciente}||{apellido}^{nombre}"
    mensaje.append(pid)

    # Segmento ORC
    mensaje.append("ORC|RE||ORD123||CM")

    # Segmento OBR
    fecha_orden = safe_get(paciente, 'fecha') or safe_get(paciente, 'date')
    mensaje.append(f"OBR|1||ORD123|TEST^RESULTADO^LN||{formato_fecha(fecha_orden)}")

    # Segmento OBX
    obx_count = 1
    if 'MEDICIONES' in paciente:
        for k, v in paciente['MEDICIONES'].items():
            if k.upper() != "TOTAL":  # Excluir TOTAL
                mensaje.append(f"OBX|{obx_count}|NM|{k}^RESULTADO^LN||{v}|||N|||F")
                obx_count += 1
    elif 'test' in paciente:
        for k, v in paciente['test'].items():
            mensaje.append(f"OBX|{obx_count}|NM|{k}^RESULTADO^LN||{v}|||N|||F")
            obx_count += 1
    else:
        for prueba in ['test_tp', 'test_ptt', 'test_fib']:
            if prueba in paciente:
                valor = paciente[prueba]
                nombre_prueba = prueba.replace('test_', '').upper()
                mensaje.append(f"OBX|{obx_count}|NM|{nombre_prueba}^RESULTADO^LN||{valor}|||N|||F")
                obx_count += 1

    # Convertir a texto HL7
    mensaje_hl7 = "\n".join(mensaje)

    # Guardar archivo con timestamp para evitar sobreescritura
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    nombre_archivo = f"{id_paciente}_{timestamp}.hl7"
    ruta_archivo = os.path.join(carpeta, nombre_archivo)
    with open(ruta_archivo, 'w', encoding='utf-8') as f:
        f.write(mensaje_hl7)

