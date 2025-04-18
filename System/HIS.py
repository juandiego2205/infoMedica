#Connect to MongoDB using pymongo
# Import the required libraries
from functios import leer_archivos_dispositivos
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://kevingarciaj:kev3033@cluster0.rnqfiyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

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
            pass
        elif opcion == "6":
            print("Saliendo del programa...")
            break

        else:
            print("Opción no válida. Intente de nuevo.")

if __name__ == "__main__":
    main()

