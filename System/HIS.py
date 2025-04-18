#Connect to MongoDB using pymongo
# Import the required libraries
from functios import leer_archivos_dispositivos
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://kevingarciaj:kev3033@cluster0.rnqfiyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
#uri= "mongodb+srv://juandcaguasango:Juandiego123#@cluster0.dwwn4wm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
def conectar_mongo():
    cliente = MongoClient(uri, server_api=ServerApi('1'))
    db = cliente["PacientesDB"]
    return db["Pacientes"]

# Send a ping to confirm a successful connection
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
            leer_archivos_dispositivos('Medical Files',patients)
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

