import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Button, ScrollView, TextInput, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';
import axios from 'axios';
import { useAuth } from '../../utils/context/AuthContext';

const ModalDetalle = ({ local, usuarios, closeModal }) => {
  const { user } = useAuth();
  const [userReview, setUserReview] = useState({ rating: 0, comentario: '' });

  useEffect(() => {
    // Buscar y establecer la reseña del usuario si existe
    const reviewUsuario = usuarios.find((usuario) => usuario.usuario === user.user);
    if (reviewUsuario) {
      setUserReview({ rating: reviewUsuario.rating, comentario: reviewUsuario.comentario });
    }
  }, [user, usuarios]);

  const handleGuardarReview = async () => {
    if (userReview.comentario && userReview.rating > 0) {
      const existenteIndex = usuarios.findIndex((usuario) => usuario.usuario === user.user);
      
      if (existenteIndex !== -1) {
        // Si ya existe un comentario del usuario, actualiza el comentario y el rating
        usuarios[existenteIndex] = {
          ...usuarios[existenteIndex],
          rating: userReview.rating,
          comentario: userReview.comentario,
        };
      } else {
        // Si no existe un comentario del usuario, añade uno nuevo a la lista
        usuarios.push({
          usuario: user.user,
          rating: userReview.rating,
          comentario: userReview.comentario,
        });
      }
  
      try {
        await axios.put(`http://10.0.2.2:5000/api/locales/reviews/${local._id}`, { reviews: usuarios });
        setUserReview({ rating: 0, comentario: '' });
      } catch (error) {
        console.error('Error al actualizar el local con la nueva review:', error.message);
      }
    }
    closeModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={closeModal}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.modalContainer}>
        <Text style={styles.localName}>{local.nombreSitio}</Text>
          <Text style={styles.sectionTitle}>Detalles del local: {local.nombreSitio}</Text>
          <Text style={styles.sectionTitle}>Detalles: {local.descripcionExtensa}</Text>
          <Text style={styles.sectionTitle}>Direccion: {local.ubicacion}</Text>
          <Text style={styles.sectionTitle}>Requiere Reserva: {local.requiereReserva.toString()}</Text>
          <Text style={styles.sectionTitle}>Horario: {local.horario}</Text>
          {/* ...otros detalles del local */}
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>Reviews</Text>
          <ScrollView style={styles.scrollView}>
            {usuarios.map((item, index) => (
              <View key={index} style={styles.commentContainer}>
                <Text>{item.usuario}</Text>
                <View style={styles.ratingContainer}>
                  <Rating
                    type="star"
                    startingValue={item.rating}
                    imageSize={20}
                    readonly={true}
                  />
                </View>
                <Text>{item.comentario}</Text>
                <View style={styles.separator} />
              </View>
            ))}
          </ScrollView>
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>Tu reseña</Text>
          <ScrollView style={styles.userReviewContainer}>
            <Rating
              type="star"
              startingValue={userReview.rating}
              imageSize={20}
              onFinishRating={(value) => setUserReview(prevState => ({ ...prevState, rating: value }))}
            />
            <TextInput
              placeholder="Escribe tu comentario"
              value={userReview.comentario}
              onChangeText={(text) => setUserReview(prevState => ({ ...prevState, comentario: text }))}
              multiline={true}
              style={styles.input}
            />
          </ScrollView>
          <Button title="Guardar reseña" onPress={handleGuardarReview} />
          <Button title="Cerrar" onPress={closeModal} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 5,
  },
  // Otros estilos mantenidos
  scrollView: {
    maxHeight: '40%',
  },
  userReviewContainer: {
    maxHeight: '20%',
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  commentContainer: {
    marginBottom: 10,
  },
  ratingContainer: {
    marginBottom: 5,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 5,
  },
});

export default ModalDetalle;
