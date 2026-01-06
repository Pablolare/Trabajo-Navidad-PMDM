import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type ContadorSetsProps = {
  setsLocal: number;
  setsVisitante: number;
}

export default function ContadorSets({ setsLocal, setsVisitante }: ContadorSetsProps) {
  return (
    <View style={styles.contadorSets}>
      <View style={styles.contenedorSetLocal}>
        <Text style={styles.textoSet}>{setsLocal}</Text>
      </View>
      <Text style={styles.separadorSets}>:</Text>
      <View style={styles.contenedorSetVisitante}>
        <Text style={styles.textoSet}>{setsVisitante}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
   contadorSets: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  contenedorSetLocal: {
    backgroundColor: '#2196F3',
    width: 50,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenedorSetVisitante: {
    backgroundColor: '#F44336',
    width: 50,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoSet: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  separadorSets: {
    fontSize: 24, 
    color: 'white',
    fontWeight: 'bold',
  },
})