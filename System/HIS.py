#Connect to MongoDB using pymongo
# Import the required libraries
from functios import leer_archivos_dispositivos
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json

uri = "mongodb+srv://kevingarciaj:kev3033@cluster0.rnqfiyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
#uri= "mongodb+srv://juandcaguasango:Juandiego123#@cluster0.dwwn4wm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
def conectar_mongo():
    cliente = MongoClient(uri, server_api=ServerApi('1'))
    db = cliente["PacientesDB"]
    return db["Pacientes"]

# Send a ping to confirm a successful connection
def mostrar_menu():
    print("\n--- MENU PRINCIPAL ---")
    print("1.Cargar Archivos (TXT, CSV, JSON)")
    print("2.Insertar Pacientes")
    print("3.ELiminar Paciente")
    print("4.Actualizar Paciente")
    print("5.Leer Paciente")
    print("6.Salir")

def main():
    patients = conectar_mongo()
    while True:
        mostrar_menu()
        opcion = input("Seleccione una opcion: ")

        if opcion == "1":
            leer_archivos_dispositivos('Medical Files',patients)
            pass

        elif opcion == "2":
            nombre = input("Ingrese el nombre del paciente: ")
            apellido = input("Ingrese el apellido del paciente: ")
            paciente_id = input("Ingrese el ID del paciente: ")
            fecha = input("Ingrese la fecha de nacimiento (YYYYMMDD): ")
            areas = input("Ingrese los nombres de las áreas de salud (separadas por comas): ").split(",")
            tiempos = input("Ingrese los nombres de los tiempos de salud (separados por comas): ").split(",")

            # Verifica si el ID ya existe en la base de datos
            if patients.find_one({"ID": paciente_id}):
                print(f"[ERROR] El documento con ID {paciente_id} ya existe en MongoDB.")
                continue

            # Pedir valores para cada área
            valores_areas = {}
            for area in areas:
                valor = input(f"Ingrese el valor para el área '{area.strip()}': ")
                valores_areas[area.strip()] = valor

            # Pedir valores para cada tiempo
            valores_tiempos = {}
            for tiempo in tiempos:
                valor = input(f"Ingrese el valor para el tiempo '{tiempo.strip()}': ")
                valores_tiempos[tiempo.strip()] = valor

            # Formatea la fecha
            fecha_formateada = f"{fecha[:4]}-{fecha[4:6]}-{fecha[6:8]}"

            paciente_nuevo = {
                "nombre": nombre,
                "apellido": apellido,
                "ID": paciente_id,
                "fecha": fecha_formateada,
                "MEDICIONES": valores_areas,
                "TIEMPOS": valores_tiempos
            }

            # Inserta el nuevo paciente en la base de datos
            patients.insert_one(paciente_nuevo)
            print(f"[✔] Paciente {nombre} {apellido} insertado correctamente.")
            pass

        elif opcion == "3":
            id_paciente = input("Ingrese el ID del paciente a eliminar: ")
            # Verifica si el paciente existe
            paciente = patients.find_one({"ID": id_paciente})
            if paciente:
                # Elimina el paciente
                patients.delete_one({"ID": id_paciente})
                print(f"Paciente con ID {id_paciente} eliminado.")
            pass

        elif opcion == "4":
            id_paciente = input("Ingrese el ID del paciente a actualizar: ")
            # Verifica si el paciente existe
            paciente = patients.find_one({"ID": id_paciente})
            if paciente:
                # Solicita los nuevos datos
                nuevo_nombre = input("Ingrese el nuevo nombre: ")
                nuevo_apellido = input("Ingrese el nuevo apellido: ")
                # Actualiza el paciente
                patients.update_one({"ID": id_paciente}, {"$set": {"nombre": nuevo_nombre, "apellido": nuevo_apellido}})
                print(f"Paciente con ID {id_paciente} actualizado.")
            else:
                print(f"No se encontró un paciente con ID {id_paciente}.")
            
            pass

        elif opcion == "5":
            id_paciente = input("Ingrese el ID del paciente a leer: ")
            # Verifica si el paciente existe 
            paciente = patients.find_one({"ID": id_paciente})
            if paciente:
                print(f"Paciente encontrado: {paciente}")
            else:
                print(f"No se encontró un paciente con ID {id_paciente}.")
            pass
        elif opcion == "6":
            print("Saliendo del programa...")
            break

        else:
            print("Opción no válida. Intente de nuevo.")

if __name__ == "__main__":
    main()

