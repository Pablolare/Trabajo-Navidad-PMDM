import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Partido } from '../model/Tipos';

type ListarPartidosProps={
    visible:boolean;
    onClose: () => void;    //funcion cerrar el modal
    apiUrl:string;
    onCargarPartido: (partido: Partido) => void; // funcion para continuar un partido 
}

export default function ListarPartidos({visible,onClose,apiUrl,onCargarPartido}:ListarPartidosProps) {    
    const [partidos, setPartidos] = useState<Partido[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (visible) {
            cargarPartidos();
        }
    }, [visible]);

    const cargarPartidos = async () => {
        try{
            setCargando(true)
            //peticion GET
            const respuesta = await fetch(apiUrl)
            const datos = await respuesta.json()
            //Guardar los datos
            setPartidos(datos)
        } catch(error){
            Alert.alert('Error', 'No se pudieron cargar los partidos');
        }
        setCargando(false)
    }

    const eliminarPartido = async (id: string) => {
    Alert.alert(
      'Eliminar Partido',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          onPress: async () => {
            try {
              // petición DELETE
              await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
              });
              
              // Recargar la lista
              await cargarPartidos();
              Alert.alert('Éxito', 'Partido eliminado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar');
            }
          }
        }
      ]
    );
  };

  const continuarPartido = (partido: Partido) => {
    Alert.alert(
      'Continuar Partido',
      `¿Continuar partido ${partido.id}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Continuar', 
          onPress: () => {
            // Llamar a la función que pasamos por props
            onCargarPartido(partido);
            onClose(); // Cerrar el modal
          }
        }
      ]
    );
  };

return (
    <Modal visible={visible} animationType="slide">
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>Historial de Partidos</Text>
            <Pressable onPress={onClose} style={styles.botonCerrar}>
                <Text style={{color:'white'}}>Cerrar</Text>
            </Pressable>
            {/*bucle por cada partido que hay*/}
            {cargando ? (<Text>Cargando partidos...</Text>) : partidos.length === 0 ? (<Text>No hay partidos guardados</Text>) : (
            <ScrollView>
                {partidos.map((partido) => (
                    <View key={partido.id} style={styles.item}>
                    <Text>{partido.fecha} - {partido.nombreLocal} vs {partido.nombreVisitante}</Text>
                    <Text style={{color:'white'}}>Resultado: {partido.setsLocal}-{partido.setsVisitante}</Text>
                        <View style={styles.botones}>
                            <Pressable onPress={() => continuarPartido(partido)}>
                                <Text style={{color:'white'}}>Continuar</Text>
                            </Pressable>
                            <Pressable onPress={() => eliminarPartido(partido.id)}>
                                <Text style={{color:'white'}}>Eliminar</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}
            </ScrollView>
        )}
        </View>
    </Modal>
 )
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: '#2D2D2D',
        padding: 20,
    },
    titulo: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
      botonCerrar: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 20,
    },
    item: {
        backgroundColor: '#424242',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    botones: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
})