import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    StyleSheet,
} from 'react-native';
import { Agenda, CalendarProvider } from 'react-native-calendars';

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
    const [items, setItems] = useState({
        '2023-10-25': [{ text: 'Evento 1', details: 'Detalles del Evento 1' }],
        '2023-10-26': [{ text: 'Evento 2', details: 'Detalles del Evento 2' }],
        '2023-10-27': [],
    });

    const [isModalVisible, setModalVisible] = useState(false);
    const [newEventText, setNewEventText] = useState('');
    const [newEventDetails, setNewEventDetails] = useState('');
    const [selectedDay, setSelectedDay] = useState(null);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const addEvent = () => {
        if (!selectedDay) {
            alert('Por favor, selecciona un día en el calendario.');
            return;
        }

        if (!newEventText) {
            alert('Por favor, ingresa el nombre del evento.');
            return;
        }

        const newEvent = { text: newEventText, details: newEventDetails };

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
    };

    const renderEvent = useCallback(
        (event) => (
            <EventItem event={event} onPress={() => alert(JSON.stringify(event.details).replace(/"/g, ''))} />
        ),
        []
    );

    return (
        <View style={{ flex: 1 }}>
            <CalendarProvider>
                <Agenda
                    onDayLongPress={(day) => {
                        setSelectedDay(day.dateString);
                        toggleModal(); // Mostrar el modal cuando se selecciona un día
                    }}
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
});

export default MiAgenda;
