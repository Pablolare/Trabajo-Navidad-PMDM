import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type MarcadorEquipoProps = {
  puntos: number;
  color: string;
}

export default function MarcadorEquipo({ puntos, color }: MarcadorEquipoProps) {
  return (
    <View style={[styles.marcador, { backgroundColor: color }]}>
      <Text style={styles.puntosGrandes}>{puntos}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  marcador: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    minHeight: 150,
    maxHeight: 200,
  },
  puntosGrandes: {
    fontSize: 80,
    color: 'white',
    fontWeight: 'bold',
  },
})