import React, { map,useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    StyleSheet,
    Alert,
    ImageBackground 
} from 'react-native';
import { Agenda, CalendarProvider } from 'react-native-calendars';
import axios from 'axios'; // Asegúrate de instalar axios: npm install axios
import { useAuth } from '../../utils/context/AuthContext'; // Suponiendo que aquí tienes el contexto con la información del usuario
import { useFocusEffect } from '@react-navigation/native';

// Componente interno optimizado con React.memo
const EventItem = React.memo(({ event, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(event)}>
            <Text style={styles.cardText}>{event.text}</Text>
            <Text>{event.details}</Text>
        </TouchableOpacity>
    );
});

const MiAgenda = React.memo(() => {
    const {user } = useAuth(); // Obteniendo la información del usuario desde el contexto
    // const [items, setItems] = useState({
    //     '2023-11-29': [{ text: 'Evento 1', details: 'Detalles del Evento 1' }],
    //     '2023-11-29': [{ text: 'Evento 2', details: 'Detalles del Evento 2' }],
    //     '2023-11-19': [],
    // });
     const [items, setItems] = useState({});
    const [isModalVisible, setModalVisible] = useState(false);
    const [newEventText, setNewEventText] = useState('');
    const [newEventDetails, setNewEventDetails] = useState('');
    const [selectedDay, setSelectedDay] = useState(null);

    // useEffect(() => {
    //     const fetchUserDays = async () => {
    //         try {
    //             const response = await axios.get(`http://10.0.2.2:5000/api/agenda/dias-usuario/${user.user}`);
    //             const userDays = response.data || [];
    //             console.log("llega",userDays);
    //             const formattedItems = {};

    //             userDays.forEach((day) => {
    //                 const { date, events } = day.dias[0];
    //                 console.log("entro",date)
    //                 const formattedEvents = events.map((event, index) => ({
    //                     text: event.text, // Texto del evento desde la base de datos
    //                     details: event.details, // Detalles del evento desde la base de datos
    //                 }));

    //                 formattedItems[date] = formattedEvents;
    //             });
    //             console.log("formattedItems",formattedItems);
    //             setItems((prevItems) => {
    //                 // Limpiar el estado anterior antes de agregar los nuevos datos
    //                 return { ...prevItems, ...formattedItems };
    //             });
    //             console.log("items",items);
    //         } catch (error) {
    //             console.error('Error al obtener los días del usuario:', error.message);
    //         }
    //     };

    //     fetchUserDays();
    // }, [user.user]);
    useFocusEffect(
        React.useCallback(() => {
          const fetchUserDays = async () => {
            try {
              const response = await axios.get(`http://10.0.2.2:5000/api/agenda/dias-usuario/${user.user}`);
              const userDays = response.data || [];
              console.log("llega", userDays);
              const formattedItems = {};
      
              userDays.forEach((day) => {
                const { date, events } = day.dias[0];
                console.log("entro", date);
                const formattedEvents = events.map((event, index) => ({
                  text: event.text, // Texto del evento desde la base de datos
                  details: event.details, // Detalles del evento desde la base de datos
                }));
      
                formattedItems[date] = formattedEvents;
              });
              console.log("formattedItems", formattedItems);
              setItems((prevItems) => {
                // Limpiar el estado anterior antes de agregar los nuevos datos
                return { ...prevItems, ...formattedItems };
              });
              console.log("items", items);
            } catch (error) {
              console.error('Error al obtener los días del usuario:', error.message);
            }
          };
      
          fetchUserDays();
        }, [user.user])
      );

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const addEvent = async () => {
        if (!selectedDay) {
            alert('Por favor, selecciona un día en el calendario.');
            return;
        }

        if (!newEventText) {
            alert('Por favor, ingresa el nombre del evento.');
            return;
        }

        const newEvent = { text: newEventText, details: newEventDetails };

        // Actualizar el estado local
        setItems((prevState) => {
            const updatedItems = { ...prevState };

            if (updatedItems[selectedDay]) {
                updatedItems[selectedDay].push(newEvent);
            } else {
                updatedItems[selectedDay] = [newEvent];
            }

            return updatedItems;
        });

        // Limpiar los campos después de agregar el evento
        setNewEventText('');
        setNewEventDetails('');
        setSelectedDay(null);
        toggleModal();

        try {
            // Enviar el evento al servidor usando Axios
            await axios.post('http://10.0.2.2:5000/api/agenda/agregar-evento', {
                date: selectedDay,
                text: newEventText,
                details: newEventDetails,
                usuario: user.user,
            });

            // Manejar la respuesta del servidor si es necesario
        } catch (error) {
            console.log(error)
            console.error('Error al enviar el evento al servidor:', error.message);
            // Puedes manejar el error según tus necesidades
        }
    };

    // const renderEvent = useCallback(
    //     (event) => (
    //         <EventItem event={event} onPress={() => alert(JSON.stringify(event.details).replace(/"/g, ''))} />
    //     ),
    //     []
    // );
    const renderEvent = (event) => (
        // Renderizar cada evento como lo hacías antes
        <EventItem event={event} onPress={() => alert(JSON.stringify(event.details))} />
    );
    
    const onDayPress = (day) => {
        const currentDate = new Date(); // Obtener la fecha actual
        const selectedDate = new Date(day.dateString); // Obtener la fecha seleccionada

        // Verificar si la fecha seleccionada es anterior a la fecha actual
        if (selectedDate < currentDate) {
            Alert.alert('Error', 'No puedes crear eventos en fechas pasadas.');
        } else {
            setSelectedDay(day.dateString);
            toggleModal(); // Mostrar el modal cuando se selecciona un día
        }
    };



    return (
        <View style={{ flex: 1}}>
            
            <CalendarProvider >
                {/* <Agenda
                    onDayLongPress={(day) => {
                        setSelectedDay(day.dateString);
                        toggleModal(); // Mostrar el modal cuando se selecciona un día
                    }}
                    items={items} // Utilizar el estado items para representar los eventos en la Agenda
                    renderItem={renderEvent}
                    renderEmptyDate={() => (
                        <View
                            style={{ height: 15, flex: 1, backgroundColor: 'lightgray' }}
                        />
                    )}
                    rowHasChanged={(r1, r2) => r1.text !== r2.text}
                /> */}
                
                <Agenda
                    onDayLongPress={onDayPress} // Utilizar la función de validación en el evento onDayLongPress
                    items={items}
                    renderItem={renderEvent}
                    renderEmptyDate={() => (
                        <View
                            style={{ height: 15, flex: 1, backgroundColor: 'lightgray' }}
                        />
                    )}
                    rowHasChanged={(r1, r2) => r1.text !== r2.text}
                />
            </CalendarProvider>
                        
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre del evento"
                            value={newEventText}
                            onChangeText={(text) => setNewEventText(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Detalles del evento"
                            value={newEventDetails}
                            onChangeText={(details) => setNewEventDetails(details)}
                        />
                        <TouchableOpacity style={styles.button} onPress={addEvent}>
                            <Text style={styles.buttonText}>Agregar Evento</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={toggleModal}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.separator} />
        </View>
        
    );
    
});

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
        width: 200,
    },
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 5,
      },
});

export default MiAgenda;
