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

        const allRatings = usuarios.map((usuario) => usuario.rating);
        const totalRatings = allRatings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const averageRating = totalRatings / allRatings.length;
  
        // Actualizar el campo de rating del local con el nuevo promedio
        await axios.put(`http://10.0.2.2:5000/api/locales/actualizaRating/${local._id}`, { rating: averageRating });
        setUserReview({ rating: 0, comentario: '' });
      } catch (error) {
        console.error('Error al actualizar el local con la nueva review:', error.message);
      }
    }
    closeModal();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={closeModal}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.modalContainer}>
        
          <View style={styles.container}>
          <Text style={styles.localName}>{local.nombreSitio}</Text>
            <Text style={styles.sectionTitle}>{local.descripcionExtensa}</Text>
            <Text style={styles.sectionTitle}>{local.ubicacion}</Text>
            <Text style={styles.sectionTitle}>Requiere reserva: {local.requiereReserva ? 'Sí' : 'No'}</Text>
            <Text style={styles.sectionTitle}>Horario: {local.horario}</Text>
          </View>
          {/* ...otros detalles del local */}
          <View style={styles.separator2} />
          <Text style={styles.localName}>Reviews</Text>
          <View style={styles.separator} />
          <ScrollView style={styles.scrollView}>
          {usuarios.map((item, index) => (
              <View key={index} style={styles.commentContainer}>
                <View style={styles.userInfo}>
                  <Text style={styles.highlightedUser}>{item.usuario}</Text>
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
          <View style={styles.separator2} />
          <Text style={styles.localName}>Tu reseña</Text>
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
          <View style={styles.buttonsContainer3}>
          <Button style={styles.button} title="Guardar reseña" onPress={handleGuardarReview} />
          <Button style={styles.button} title="Cerrar" onPress={closeModal} />
          </View>
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
  separator2: {
    borderBottomWidth: 4,
    borderBottomColor: '#ccc',
    marginBottom: 5,
  },
  buttonsContainer3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'white',
    marginBottom:30
    
  },
  button: {
    flex:1,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    marginRight:10,
    padding: 10,
    width: '30%',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  highlightedUser: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  container: {
    alignItems: 'center', // Alinea los elementos al centro horizontal
    justifyContent: 'center', // Alinea los elementos al centro vertical
  },
  localName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ModalDetalle;
