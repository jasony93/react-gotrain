import React, { Component, useState } from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';
import '../App.css';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { Auth } from 'aws-amplify';
import Modal from 'react-awesome-modal';
import {updateInterestedList} from '../graphql/mutations'
import {getInterestedList} from '../graphql/queries'

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

      return username
    } catch (error) {
      console.log("failed to get user info")
    }
    
}

async function fetchInterestedList() {

    try {
        const id = await getUsername()
        const variables = {
            id: id
        };
        const interestedListData = await API.graphql(graphqlOperation(getInterestedList, variables));
        const interestedList = interestedListData.data.getInterestedList.list;
        
        return interestedList
        
    } catch (err) { console.log('error fetching intersted list:', err) }
}

async function registerInterestedList() {

    const inputVal = document.getElementById("register").value;

    if (inputVal === "") {
        console.log("Please enter something")
        return
    }

    try {
        const interestedList = await fetchInterestedList();
        const id = await getUsername();
        interestedList.push(inputVal);

        console.log(id, interestedList)
        const variables = {
            input: {
                id: id,
                list: interestedList
            }
        };
        
        await API.graphql(graphqlOperation(updateInterestedList, variables));
        
    } catch (err) { console.log('error registering:', err) }

    window.location.reload();
}

async function deleteSelected(selected) {

    if (selected.length === 0) {
        console.log("please select something")
        return
    }

    try {
        const interestedList = await fetchInterestedList();
        const id = await getUsername();

        const removedList = interestedList.filter(function(value, index, arr){
            return !selected.includes(value);
        })

        const variables = {
            input: {
                id: id,
                list: removedList
            }
        };
        
        await API.graphql(graphqlOperation(updateInterestedList, variables));
        
    } catch (err) { console.log('error registering:', err) }

    window.location.reload();
}

class header extends Component {

    
    constructor(props) {

        super(props);

        this.state = {
            visible : false,
            selected : this.props.selected
        }
    }

    _openModal = () => {
        this.setState({
            visible : true,
            selected : this.props.selected
        });
      }
    
    _closeModal = () => {
        this.setState({
            visible : false,
            selected : this.props.selected
        });
    }

  render() {

    return (
        <div class='header_grid'>
            <div> 
                
            </div>
            <div className='acenter'>
                <div>Gotrain</div>
                <div>
                    <button className='btn_header' onClick={this._openModal}>신규등록</button>
                        <Modal visible={this.state.visible} width="400" height="300" effect="fadeInDown" onClickAway={() => this._closeModal()}>
                        
                            <div className='acenter'>
                                <input className='btn_close' value='X' type='button' onClick={() => this._closeModal()} />
                            </div>
                            
                            <div className='register_input'>
                                <input placeholder="종목을 입력해주세요" id="register"/>
                                <input className='btn_register' value='등록' type='button' onClick={registerInterestedList}/>
                            </div>

                        </Modal>
                    <input type='button' value='삭제' className='btn_header' onClick={() => {deleteSelected(this.props.selected)}}/>
                    <button className='btn_header' onClick={signOut}>로그아웃</button>
                </div>
         
            </div>

            <div className='acenter'> 
                
                
            </div>

            
        </div>
    );
  }
}

export default header;

