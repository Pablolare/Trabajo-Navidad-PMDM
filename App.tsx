import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MarcadorEquipo from './components/MarcadorEquipo';
import ContadorSets from './components/ContadorSets';
import ControlesEquipo from './components/ControlesEquipo';
import { Partido } from './model/Tipos';
import ListarPartidos from './components/ListarPartidos';

export default function App() {
  const [puntosLocal, setPuntosLocal] = useState(0);
  const [puntosVisitante, setPuntosVisitante] = useState(0);
  const [setsLocal, setSetsLocal] = useState(0);
  const [setsVisitante, setSetsVisitante] = useState(0);
  const [modalHistorialVisible, setModalHistorialVisible] = useState(false);
  const API_URL = 'http://192.168.0.21:3000/partidos';

  useEffect(()=>{
    comprobarSet();
  },[puntosLocal,puntosVisitante]
  );

  const comprobarSet=()=>{
    let puntosParaGanar;
    if(setsLocal+setsVisitante===4){
      puntosParaGanar=15;
    } else {
      puntosParaGanar=25;
    }
    const diferenciaMinima = 2;
    if(puntosLocal>=puntosParaGanar && puntosLocal-puntosVisitante>=diferenciaMinima){
      const nuevosSetsLocal = setsLocal+1
      setSetsLocal(nuevosSetsLocal)
      setPuntosLocal(0)
      setPuntosVisitante(0)

      if(nuevosSetsLocal===3){
        Alert.alert('Victoria Equipo Local', 'El equipo local ha ganado el partido',[
          {text:'Guardar y Nuevo Partido', 
            onPress: async () =>{ 
              await guardarPartido()
              await resetPartido()
            }
          }
        ]);
      }
    }

  if (puntosVisitante >= puntosParaGanar && puntosVisitante - puntosLocal >= diferenciaMinima) {
      const nuevosSetsVisitante = setsVisitante+1
      setSetsVisitante(nuevosSetsVisitante)
      setPuntosLocal(0)
      setPuntosVisitante(0)

      if (nuevosSetsVisitante === 3) {
       Alert.alert('Victoria Equipo Visitante', 'El equipo visitante ha ganado el partido',[
          {text:'Nuevo Partido', onPress: resetPartido}
        ]);
      }
    }
  };

  const sumarPuntoLocal = () => {
    setPuntosLocal(puntosLocal + 1);
  };

  const sumarPuntoVisitante = () => {
    setPuntosVisitante(puntosVisitante + 1);
  };

  const restarPuntoLocal = () => {
    if (puntosLocal > 0) {
      setPuntosLocal(puntosLocal - 1);
    }
  };

  const restarPuntoVisitante = () => {
    if (puntosVisitante > 0) {
      setPuntosVisitante(puntosVisitante - 1);
    }
  };

  const cambioCampo = () =>{
    const puntosTemporal = puntosLocal
    setPuntosLocal(puntosVisitante)
    setPuntosVisitante(puntosTemporal)
  }

  const resetPartido = async () => {
    setPuntosLocal(0);
    setPuntosVisitante(0);
    setSetsLocal(0);
    setSetsVisitante(0);
  }

  const guardarPartido = async() => {
    try{
      let ganador = '';
      if(setsLocal===3){
        ganador='local'
      }
      if(setsVisitante===3){
        ganador='visitante'
      }

      const nuevoPartido : Partido = {
        id: Date.now().toString(),
        nombreLocal:'Equipo Local',
        nombreVisitante: 'Equipo Visitante',
        puntosLocal,
        puntosVisitante,
        setsLocal,
        setsVisitante,
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        ganador,
      };

      await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoPartido)
    });

    Alert.alert('¡Guardado!', 'Partido guardado en la base de datos');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar. ¿Está el servidor corriendo?');
    }
  }

  const cargarPartidoGuardado = (partido: Partido) => {
    setPuntosLocal(partido.puntosLocal);
    setPuntosVisitante(partido.puntosVisitante);
    setSetsLocal(partido.setsLocal);
    setSetsVisitante(partido.setsVisitante);
    
    Alert.alert(
      'Partido Cargado',
      '¡Partido cargado correctamente! Puedes continuar jugando.'
    );
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <Text style={styles.nombreEquipoLocal}>Equipo Local</Text>
          <ContadorSets setsLocal={setsLocal} setsVisitante={setsVisitante}/>
        <Text style={styles.nombreEquipoVisitante}>Equipo Visitante</Text>
      </View>

      <View style={styles.zonaMarcadores}>
        <MarcadorEquipo puntos={puntosLocal} color="#2196F3"/>

        <MarcadorEquipo puntos={puntosVisitante} color="#f32121ff"/>
      </View>

      <View style={styles.controlesCentrales}>
        <ControlesEquipo sumarPunto={sumarPuntoLocal} restarPunto={restarPuntoLocal}/>

        <Pressable style={styles.botonControl} onPress={cambioCampo}>
          <Text style={styles.textoBoton}>⇄</Text>
        </Pressable>

        <Pressable style={styles.botonControl} onPress={resetPartido}>
          <Text style={styles.textoBoton}>↻</Text>
        </Pressable>

        <Pressable style={styles.botonHistorial} onPress={() => setModalHistorialVisible(true)}>
          <Text style={styles.textoBotonHistorial}>📋 Historial</Text>
        </Pressable>

        <Pressable style={styles.botonGuardar} onPress={guardarPartido}>
          <Text style={styles.textoBotonGuardar}>💾 Guardar Partido</Text>
        </Pressable>

        <ControlesEquipo sumarPunto={sumarPuntoVisitante} restarPunto={restarPuntoVisitante}/>

        <ListarPartidos visible={modalHistorialVisible} onClose={() => setModalHistorialVisible(false)} apiUrl={API_URL} onCargarPartido={cargarPartidoGuardado}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#2D2D2D',
    padding: 10,
    justifyContent: 'space-around',
  },
  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20, 
    flexShrink: 1, 
  },
  nombreEquipoLocal: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  nombreEquipoVisitante: {
    fontSize: 16, 
    color: '#F44336',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  zonaMarcadores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    flexShrink: 1,
  },
  controlesCentrales: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 5, 
    flexWrap: 'wrap',
  },
  botonControl: {
    backgroundColor: '#424242',
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#666',
    margin: 2, 
  },
  textoBoton: {
    fontSize: 24, 
    color: 'white',
    fontWeight: 'bold',
  },
  botonGuardar: {
    backgroundColor: '#4CAF50',
    padding: 12, 
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    flexShrink: 1,
  },
  textoBotonGuardar: {
    color: 'white',
    fontSize: 14, 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botonHistorial: {
    backgroundColor: '#9C27B0',
    padding: 12, 
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    flexShrink: 1,
  },
  textoBotonHistorial: {
    color: 'white',
    fontSize: 14, 
    fontWeight: 'bold',
  },
  botonGuardarPausa: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    flexShrink: 1,
  },
  textoBotonGuardarPausa: {
    color: 'white',
    fontSize: 14, 
    fontWeight: 'bold',
  },
});