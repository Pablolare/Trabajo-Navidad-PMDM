import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

type ControlesEquipoProps = {
  sumarPunto: () => void;
  restarPunto: () => void;
}

export default function ControlesEquipo({ sumarPunto, restarPunto }: ControlesEquipoProps) {
  return (
    <View>
      <Pressable style={styles.boton} onPress={sumarPunto}>
        <Text style={styles.textoBoton}>+</Text>
      </Pressable>

      <Pressable style={styles.boton} onPress={restarPunto}>
        <Text style={styles.textoBoton}>-</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  boton: {
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
})