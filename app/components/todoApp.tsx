import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Animated, Modal, Button } from 'react-native';
import styles from '../styles/style';  // Importando os estilos
import { Ionicons } from '@expo/vector-icons'; // Para usar os ícones de lua e sol

const ToDoApp = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<{ id: number; name: string; description: string; deadline: string; completed: boolean, fadeAnim: any }[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado para o modo escuro
  const [selectedTask, setSelectedTask] = useState<any>(null);  // Tarefa selecionada para edição
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const addTask = () => {
    if (task) {
      setTasks([...tasks, { 
        id: tasks.length + 1, 
        name: task, 
        description: '',  // Descrição inicialmente vazia
        deadline: '',     // Prazo inicialmente vazio
        completed: false,
        fadeAnim: new Animated.Value(1), // Inicializa a opacidade da tarefa
      }]);
      setTask('');
    }
  };

  const toggleTask = (id: any) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (id: any) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleTaskComplete = (id: any) => {
    toggleTask(id);
    setTimeout(() => {
      const updatedTasks = tasks.map(task => {
        if (task.id === id) {
          Animated.timing(task.fadeAnim, {
            toValue: 0, 
            duration: 1000, 
            useNativeDriver: true,
          }).start();
        }
        return task;
      });
      setTasks(updatedTasks);
    }, 2000); // Remover a tarefa após 2 segundos de animação
    setTimeout(() => {
      removeTask(id);
    }, 3000); // Remover da lista depois da animação
  };

  // Alterna entre os modos escuro e claro
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Função para abrir o modal de edição de tarefa
  const openTaskModal = (task: any) => {
    setSelectedTask(task);
    setDescription(task.description);
    setDeadline(task.deadline);
  };

  // Função para salvar a edição da tarefa
  const saveTaskEdits = () => {
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? { ...task, description, deadline } : task
    ));
    setSelectedTask(null);
    setDescription('');
    setDeadline('');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#f8f8f8' }]}>
      <Text style={[styles.header, { color: isDarkMode ? '#fff' : '#333' }]}>To-Do List Dev 🎯</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: isDarkMode ? '#555' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
          placeholder="Adicionar Tarefa"
          placeholderTextColor={isDarkMode ? '#bbb' : '#888'}
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <Animated.View 
            style={[ 
              styles.taskContainer, 
              { opacity: item.fadeAnim, backgroundColor: isDarkMode ? '#444' : '#fff' }
            ]}
          >
            <TouchableOpacity
              style={[styles.circle, item.completed && styles.completedCircle, { borderColor: isDarkMode ? '#fff' : '#007BFF' }]}
              onPress={() => handleTaskComplete(item.id)}
            />
            <Text style={[styles.taskText, item.completed && styles.completedText, { color: isDarkMode ? '#fff' : '#333' }]} onPress={() => openTaskModal(item)}>
              {item.name}
            </Text>
            <TouchableOpacity onPress={() => removeTask(item.id)}>
              <Text style={[styles.removeButton, { color: isDarkMode ? '#f00' : '#d00' }]}>Remove</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        keyExtractor={item => item.id.toString()}
      />

      {/* Modal para editar tarefa */}
      {selectedTask && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedTask !== null}
          onRequestClose={() => setSelectedTask(null)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { 
              backgroundColor: isDarkMode ? '#444' : '#fff', 
              height: '60%' 
            }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Editar Tarefa</Text>
                <TextInput
                  style={[styles.inputModal, { backgroundColor: isDarkMode ? '#555' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
                  placeholder="Descrição"
                  placeholderTextColor={isDarkMode ? '#bbb' : '#888'}
                  value={description}
                  onChangeText={setDescription}
                />
                <TextInput
                  style={[styles.inputModal, { backgroundColor: isDarkMode ? '#555' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
                  placeholder="Prazo (Ex: 28-03-2025)"
                  placeholderTextColor={isDarkMode ? '#bbb' : '#888'}
                  value={deadline}
                  onChangeText={setDeadline}
                />
              </View>

              <View style={{ marginTop: 20 }}>
                <TouchableOpacity onPress={saveTaskEdits} style={[styles.buttonModal]}>
                  <Text style={{ textAlign: 'center', color: '#fff' }}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTask(null)} style={[styles.buttonModal]}>
                  <Text style={{ textAlign: 'center', color: '#fff' }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Ícone de modo escuro e claro */}
      <TouchableOpacity onPress={toggleDarkMode} style={styles.toggleButton}>
        <Ionicons 
          name={isDarkMode ? "moon" : "sunny"} 
          size={40} 
          color={isDarkMode ? "#fff" : "#000"} 
        />
      </TouchableOpacity>
    </View>
  );
};

export default ToDoApp;
