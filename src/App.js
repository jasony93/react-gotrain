/* src/App.js */
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './graphql/mutations'
import { listTodos, getInterestedList } from './graphql/queries'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify';
import './App.css';

import { Head } from './inc'
import { stockList } from './inc'


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


const App = () => {

  const [selected, setSelected] = useState([])
  // const [newSelected, setNewSelected] = useState([])
  const property = {"selected": selected, "setSelected": setSelected}
  // const test = 'test';

  useEffect(() => {
    console.log(selected)
    // setNewSelected(selected)
  }, [selected])


  return (

    <div>
      <Head selected={selected}/>
      {/* <stockList /> */}
      {stockList(property)}
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