import React, { useEffect, useState } from 'react';

import { View, Text, SafeAreaView, StyleSheet, StatusBar, FlatList, TouchableOpacity } from 'react-native';

import api from './services/api';

export default function App() {
    //cria estados dos projetos da nossa aplicação
    const [projects, setProjects] = useState([]);

    //carrega os dados dos projetos criados (LISTAGEM)
    //a função api.get é disparada (() => {}quando esta > mudar,[]};
    useEffect(() => {
        api.get('projects').then(response => {
            console.log(response.data);
            //abaixo é o array de retorno pra dentro de setProjects
            setProjects(response.data);
        });
    }, []);

async function handleAddProject(){
    //mesmo código do react
    const response = await api.post('projects',{
        title: `Novo projeto ${Date.now()}`,
        owner: 'William'
    });
    //response retorna o novo objeto criado para o vetor agora atualizado.
    const project=response.data;
    setProjects([...projects,project]);   

    //ou substitui as 2 ultimas linhas acima por
    //setProjects([...projects,response.data]); 
    //DATA VEM DO USEEFFECT   data = tudo q tem dentro de cada array[]

}


//flatlist = scroll
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
            <SafeAreaView style={styles.container}>
            <FlatList
            /*data=variável q contem nossos dados da nossa lista sempre um array 'projects fica salvo em data)*/
            data={projects}
            /* Pega cada item do array de data e retorna a informação unica do project.id em project*/
            keyExtractor={project=>project.id}
            /*Função que retorna algo, no caso Text*/
            /*Falta ter acesso ao project.. render recebe várias propriedades dentre elas item (q tem todas 
            infos dos projetos, title,owner,id,etc*/
            renderItem={({item:project})=>(
                <Text style={styles.project}> {project.title} </Text>
            )}
            />
            <TouchableOpacity activeOpacity={0.6} style={styles.button} onPress={handleAddProject}>
                <Text style={styles.buttonText}>Adicionar projeto</Text>
                </TouchableOpacity>
            </SafeAreaView>
           
        </>
    );
}


const styles = StyleSheet.create({
    //container=objeto (propriedade) e dentro o css
    container: {
        flex: 1,
        backgroundColor: '#7159c1',
        //justifyContent: 'center',
        //alignItems: 'center'
    },
    project: {
        color: '#FFF',
        fontSize: 30,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: '#FFF',
        margin: 20,
        height: 50,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },

});


 {/*<View style={styles.container}>
                {projects.map(project => (
                    <Text style={styles.project} key={project.id}> {project.title} </Text>
                ))}
                </View>*/}