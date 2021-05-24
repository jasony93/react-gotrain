/* src/App.js */
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './graphql/mutations'
import { listTodos, getInterestedList } from './graphql/queries'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify';

import testPage from "./testPage"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import RegisterButton from "./registerButton"


// import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

// const myAppConfig = {
//   // ...
//   'aws_appsync_graphqlEndpoint': 'https://mg4tmtxrl5edbdkkufb6pdwgsm.appsync-api.us-east-1.amazonaws.com/graphql',
//   'aws_appsync_region': 'us-east-1',
//   'aws_appsync_authenticationType': 'API_KEY',
//   'aws_appsync_apiKey': 'da2-vi6z744p3vgx3gtpd7dcmgarv4',
//   // ...
// }

// Amplify.configure(myAppConfig);


const initialState = { name: '', description: '' }


const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  async function signOut() {
    try {
        await Auth.signOut({ global: true });
    } catch (error) {
        console.log('error signing out: ', error);
    }

    window.location.reload();
  }

  async function getUsername() {
    try{
      const {username} = await Auth.currentAuthenticatedUser();
      console.log(username)
      return username
    } catch (error) {
      console.log("failed to get user info")
    }
    
  }

  async function fetchInterestedList() {

    try {
      const id = await getUsername()

      console.log(id)

      const variables = {
        id: id
      };
      const interestedListData = await API.graphql(graphqlOperation(getInterestedList, variables));

      // const interestedList = interestedListData.list;
      console.log(interestedListData)
    } catch (err) { console.log('error fetching intersted list:', err) }
  }

  return (
    <div style={styles.container}>
      
      <div style={styles.topBar}>
        <button style={styles.button}>GoTrain</button>
        <RegisterButton>신규등록</RegisterButton>
        <button style={styles.logoutButton} onClick={signOut}>로그아웃</button>
        {/* <button style={styles.button} onClick={getUsername}>get user info </button> */}
      </div>
      {/* <h2>Amplify Todos</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      /> */}
      {/* <button style={styles.button} onClick={addTodo}>Create Todo</button> */}
      
      {/* <button style={styles.button} onClick={fetchInterestedList}>관심종목불러오기 </button> */}
      <Router>
        <Link to="/testPage">관심종목 모두 불러오기</Link>
        <Switch>
          <Route path="/testPage" component={testPage}>

          </Route>
        </Switch>
      </Router>
      
      {/* {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            <p style={styles.todoName}>{todo.name}</p>
            <p style={styles.todoDescription}>{todo.description}</p>
          </div>
        ))
      } */}

    </div>
    
  )
}

const styles = {
  container: { width: "100%", margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px', width: '20%', height:'100%' },
  topBar: { backgroundColor: 'black', color: 'white', fontSize: 16},
  logoutButton: {backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px', width: '20%', height:'100%', align:'right'}
}

export default withAuthenticator(App)