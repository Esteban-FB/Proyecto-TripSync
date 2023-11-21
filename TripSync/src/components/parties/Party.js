import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, Modal, TextInput, StyleSheet, ImageBackground  } from 'react-native';
import { useFirebase } from '../../utils/firebase/FireBaseContext';
import { getFirestore, collection, getDocs, query, where, arrayContains, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../utils/context/AuthContext';
import axios from 'axios';

function Party() {
  const { user } = useAuth();
  const firestore = useFirebase();
  const [partiesData, setPartiesData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [usuariosInvitados, setUsuariosInvitados] = useState([]);
  const [partyToEdit, setPartyToEdit] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const [invitedUserExists, setInvitedUserExists] = useState(false);
  const [editingPartyId, setEditingPartyId] = useState(null);
  const [showActivities, setShowActivities] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [activities, setActivities] = useState([]);
  const [selectedPartyForActivities, setSelectedPartyForActivities] = useState(null);

  
  useEffect(() => {

    obtenerDatosDeFirestore();
  }, [firestore]);
  
  async function obtenerDatosDeFirestore() {
    try {
      const db = getFirestore(firestore);
      const partiesCollectionRef = collection(db, 'Parties');

      const userL = user.user; // Reemplaza 'usuarioActual' con la referencia al usuario actual

      // Obtener partys donde el usuario actual es el creador
      const createdByUserQuery = query(
        partiesCollectionRef,
        where('creador', '==', userL)
      );
      const createdByUserSnapshot = await getDocs(createdByUserQuery);

      // Obtener partys donde el usuario actual está en usuariosParty
      const attendedByUserQuery = query(
        partiesCollectionRef,
        where('usuariosParty', 'array-contains', userL)
      );
      const attendedByUserSnapshot = await getDocs(attendedByUserQuery);

      const partiesCreatedByUser = [];
      const partiesAttendedByUser = [];

      createdByUserSnapshot.forEach((doc) => {
        const data = doc.data();
        partiesCreatedByUser.push({
          id: doc.id,
          nombre: data.nombre,
          descripcion: data.descripcion,
          usuariosInvitados: data.usuariosParty || [],
          activities: data.actividades || [],
          // ... (otros datos)
        });
      });

      attendedByUserSnapshot.forEach((doc) => {
        const data = doc.data();
        partiesAttendedByUser.push({
          id: doc.id,
          nombre: data.nombre,
          descripcion: data.descripcion,
          usuariosInvitados: data.usuariosParty || [],
          activities: data.actividades || [],
          // ... (otros datos)
        });
      });

      // Combinar y establecer las parties obtenidas
      const combinedParties = [...partiesCreatedByUser, ...partiesAttendedByUser];
      setPartiesData(combinedParties);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }

  const manejarGuardarParty = async () => {
    try {
      const db = getFirestore(firestore);
      const partiesCollectionRef = collection(db, 'Parties');
      console.log("usuariosInvitados",usuariosInvitados);
      console.log("editingPartyId",editingPartyId);
      const partyData = {
        nombre: nombre,
        descripcion: descripcion,
        usuariosParty: usuariosInvitados,
      };
  
      if (editingPartyId) {
        console.log("Entro a editar");
        // Si hay un editingPartyId, entonces se está editando una fiesta existente
        // Actualizar solo los campos modificados de la fiesta existente en Firestore
        const partyDocRef = doc(partiesCollectionRef, editingPartyId);
  
        // Obtener los datos actuales del documento para no perder los valores no modificados
        const currentParty = await getDoc(partyDocRef);
        const currentPartyData = currentParty.data();
        console.log("currentParty",currentParty);
        console.log("currentPartyData",currentPartyData);
        console.log("partyData",partyData);
        // Combinar los datos actuales con los nuevos para actualizar solo los campos modificados
        const updatedPartyData = {
          ...currentPartyData,
          ...partyData,
        };
  
        await updateDoc(partyDocRef, updatedPartyData);
      } else {
        // Si no hay editingPartyId, se está creando una nueva fiesta
        // Agregar una nueva fiesta a Firestore
        const nuevaParty = {
          ...partyData,
          creador: user.user, // Reemplazar por el usuario actual
          pendientes: [],
          actividades: [],
        };
        await addDoc(partiesCollectionRef, nuevaParty);
      }
  
      // Actualizar la lista de "parties"
      obtenerDatosDeFirestore();
      // Cerrar el modal después de guardar
      setModalVisible(false);
    } catch (error) {
      console.error('Error al guardar la party:', error);
    }
  };
  

  const openActivitiesModal = async (partyId) => {
    try {
      console.log("Id qeu llego: ", partyId);
      const db = getFirestore(); // Obtener la instancia de Firestore
      const partyRef = doc(db, 'Parties', partyId); // Referencia al documento de la fiesta

      // Obtener los datos del documento de la fiesta
      const partySnapshot = await getDoc(partyRef);
      const partyData = partySnapshot.data();

      // Verificar si la fiesta tiene actividades
      if (partyData && partyData.actividades) {
        // Establecer las actividades en el estado para mostrarlas en el modal
        setActivities(partyData.actividades);
        setShowActivitiesModal(true); // Mostrar el modal de actividades
      } else {
        console.log('La fiesta no tiene actividades');
      }
    } catch (error) {
      console.error('Error al obtener las actividades:', error);
    }
  };

  const closeActivitiesModal = () => {
    setShowActivitiesModal(false);
  };

  const openInviteModal = (party) => {
    setSelectedParty(party);
    setPartyToEdit(party);
    setInviteModalVisible(true);
  
    // Establecer editingPartyId si party tiene un ID
    if (party && party.id) {
      setEditingPartyId(party.id);
    } else {
      setEditingPartyId(null); // Si no hay un ID de party, restablecer editingPartyId a null
    }
  };

  const closeInviteModal = () => {
    setInviteModalVisible(false);
    setSelectedParty(null);
    setPartyToEdit(null);
    setInviteInput('');
  };

  const openEditModal = (party) => {
    setPartyToEdit(party);
    // Establecer editingPartyId si party tiene un ID
    if (party && party.id) {
      setEditingPartyId(party.id);
    } else {
      setEditingPartyId(null); // Si no hay un ID de party, restablecer editingPartyId a null
    }
    setNombre(party.nombre || '');
    setDescripcion(party.descripcion || '');
    setUsuariosInvitados(party.usuariosInvitados || []); // Usar party.usuariosParty directamente
    setSelectedParty(party);
    setModalVisible(true);
  };

  const handleInviteUser = async () => {
    const usernameToInvite = inviteInput; // Nombre de usuario ingresado en el campo de invitación
    const userData = await verificarUsuarioEnBackend(usernameToInvite);
  
    if (userData) {
      try {
        const db = getFirestore(firestore);
        const partiesCollectionRef = collection(db, 'Parties');
        console.log('Usuario encontrado:', userData);
        // Suponiendo que tienes una referencia al documento específico al que deseas agregar el usuario
        const partyDocRef = doc(partiesCollectionRef, editingPartyId);
  
        // Obtén los datos actuales del documento
        console.log('editingPartyId:', editingPartyId);
        const partySnapshot = await getDoc(partyDocRef);
        const partyData = partySnapshot.data();
        console.log('partyData:', partyData);
        // Añade el usuario encontrado al array de usuarios invitados si no está ya presente
        if (!partyData.usuariosParty.includes(userData.username)) {
          const updatedUsuariosInvitados = [...partyData.usuariosParty, userData.username];
  
          // Actualiza el campo 'usuariosParty' en el documento con los usuarios invitados actualizados
          await updateDoc(partyDocRef, {
            usuariosParty: updatedUsuariosInvitados,
          });
  
          console.log('Usuario agregado correctamente a usuariosParty.');
        } else {
          console.log('El usuario ya está en la lista de invitados.');
        }
      } catch (error) {
        console.error('Error al agregar el usuario a usuariosParty:', error);
      }
    } else {
      console.log('El usuario no existe o ha ocurrido un error');
    }
  
    closeInviteModal();
  };
  

  const verificarUsuarioEnBackend = async (username) => {
    try {
      const response = await axios.post('http://10.0.2.2:5000/api/login/check-username', {
        username: username,
      });
  
      if (response.status === 200) {
        console.log('El usuario existe');
        // Realiza aquí la lógica correspondiente si el usuario existe
        return response.data; // Devuelve los datos del usuario si se encuentra
      }
    } catch (error) {
      console.error('Error al verificar el usuario:', error);
      // Realiza aquí la lógica correspondiente si ocurre un error
      return null; // Devuelve null si hay un error o el usuario no se encuentra
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background-image.jpg')} // Ruta de la imagen en tus assets
      style={styles.background}
    >
    <ScrollView style={styles.container}>
      
      {partiesData.map((party) => (
        <View key={party.id} style={styles.partyContainer}>
          <Text style={styles.partyName}>{party.nombre}</Text>
          <Text style={styles.partyDescription}>{party.descripcion}</Text>
          {/* Mostrar usuarios invitados si existen para la fiesta actual */}
          {party.usuariosInvitados.length > 0 && (
            <View>
              <Text style={styles.invitedUsers}>Usuarios invitados:</Text>
              {party.usuariosInvitados.map((usuario, index) => (
                <Text key={index} style={styles.invitedUser}>{usuario}</Text>
              ))}
            </View>
          )}
          <View style={styles.buttonsContainer}>
            <Button title="Editar Party" onPress={() => openEditModal(party)} />
            <Button title="Actividades" onPress={() => openActivitiesModal(party.id)} />
            <Button title="Invitar" onPress={() => openInviteModal(party)} />
          </View>
        </View>
      ))}
      {/* Modal para invitar usuario */}
      <Modal visible={inviteModalVisible} transparent={true} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.inviteModalContainer}>
          <TextInput
            placeholder="Invitar usuario"
            value={inviteInput}
            onChangeText={(text) => setInviteInput(text)}
          />
          <View style={styles.buttonContainer2}>
          <Button style={styles.button} title="Invitar" onPress={handleInviteUser} />
          <Button style={styles.button} title="Cancelar" onPress={closeInviteModal} />
          </View>
        </View>
        </View>
      </Modal>
      {/* Modal para crear o editar fiesta */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.editModalContainer}>
          <TextInput
            placeholder="Nombre"
            value={nombre}
            onChangeText={(text) => setNombre(text)}
          />
          <TextInput
            placeholder="Descripción"
            value={descripcion}
            onChangeText={(text) => setDescripcion(text)}
          />
          {/* Mostrar usuarios invitados si existen */}
          {usuariosInvitados && usuariosInvitados.length > 0 && (
            <View>
              <Text>Usuarios invitados:</Text>
              {usuariosInvitados.map((usuario, index) => (
                <Text alignItems='center' key={index}>{usuario}</Text>
              ))}
            </View>
          )}
          <View style={styles.buttonContainer2}>
            <Button style={styles.button} title="Guardar grupo" onPress={manejarGuardarParty} />
            <Button style={styles.button} title="Cancelar" onPress={() => {
              setPartyToEdit(null);
              setModalVisible(false);
            }} />
          </View>
        </View>
        </View>
      </Modal>

      {showActivitiesModal && (
        <Modal visible={showActivitiesModal} transparent={true} animationType="slide">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.editModalContainer}>
              <Text style={styles.modalHeaderText}>Actividades para este grupo</Text>
              {activities.map((activity, index) => (
                <View key={index} style={styles.commentContainer}>
                  <Text style={styles.sectionHeader}>Actividad: {activity.nombre}</Text>
                  <Text style={styles.sectionHeader}>Fecha: {activity.fecha}</Text>
                  {/* Aquí puedes mostrar otros detalles de la actividad si es necesario */}
                  <View style={styles.separator} />
                </View>
              ))}
              <View style={styles.buttonContainer2}>
                <Button style={styles.button} title="Cerrar" onPress={closeActivitiesModal} />
              </View>
            </View>
          </View>
        </Modal>
      )}
      
      <Button title="Crear Nueva Party" onPress={() => openEditModal({})} />
    </ScrollView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  partyContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    backgroundColor:'white'
  },
  partyName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  partyDescription: {
    marginBottom: 10,
  },
  invitedUsers: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  invitedUser: {
    marginLeft: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
    // Estilos para el modal de editar fiesta
    editModalContainer: {
      alignItems:'center',
      width: '80%',
      height: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      elevation: 5,
      // Otros estilos específicos del modal de edición
    },
  
    // Estilos para el modal de invitar usuario
    inviteModalContainer: {
      alignItems:'center',
      width: '80%',
      height: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      elevation: 5,
      // Otros estilos específicos del modal de invitación
    },
    buttonContainer2: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#ccc',
    },
    activitiesModalContainer: {
      width: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      elevation: 5,
    },
    modalHeaderText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    activityContainer: {
      marginBottom: 10,
    },
    activityText: {
      fontSize: 16,
      marginBottom: 5,
    },
    buttonContainer: {
      marginTop: 20,
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 5,
    },
});
export default Party;
