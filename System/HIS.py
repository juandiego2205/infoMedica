#Connect to MongoDB using pymongo
# Import the required libraries
from functios import cargar_datos_paciente, cargar_csv_como_dict, cargar_json_como_dict
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://kevingarciaj:kev3033@cluster0.rnqfiyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
def conectar_mongo():
    cliente = MongoClient.MongoClient(uri, server_api=ServerApi('1'))
    db = cliente["PacientesDB"]
    return db["Pacientes"]
# Send a ping to confirm a successful connection
""""
paciente_json = cargar_json_como_dict('paciente1.json',conectar_mongo())
print(paciente_json)

#Llamada a la función con el archivo de ejemplo
paciente_csv = cargar_csv_como_dict('paciente2.csv',conectar_mongo())
print(paciente_csv)

data_paciente3 = cargar_datos_paciente('paciente3.txt',conectar_mongo())  # Asegúrate de que el archivo esté en la ruta 
print(data_paciente3)
# Llamadas a las funciones para cargar los archivos CSV y JSON
"""
def mostrar_menu():
    print("\n--- MENÚ PRINCIPAL ---")
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
        opcion = input("Seleccione una opción: ")

        if opcion == "1":
            pass

        elif opcion == "2":
            pass

        elif opcion == "3":
            pass

        elif opcion == "4":
            pass

        elif opcion == "5":
            pass
        elif opcion == "6":
            print("Saliendo del programa...")
            break

        else:
            print("Opción no válida. Intente de nuevo.")

if __name__ == "__main__":
    main()

