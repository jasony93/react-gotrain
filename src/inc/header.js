import React, { Component, useState } from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';
import '../App.css';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { Auth } from 'aws-amplify';
import Modal from 'react-awesome-modal';
import {updateInterestedList, createInterestedInfo} from '../graphql/mutations'
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

    const inputVal = document.getElementById("register_code").value;

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

        // () => {registerInterestedInfo()}
        
    } catch (err) { console.log('error registering:', err) }

    window.location.reload();
}

async function registerInterestedInfo() {

    const code = document.getElementById("register_code").value;
    const registerDate = document.getElementById("register_date").value;
    const port = document.getElementById("register_port").value;
    const purchasePrice = document.getElementById("register_price").value;
    const soldDate = document.getElementById("register_sold_date").value;
    const soldPrice = document.getElementById("register_sold_price").value;
    const targetPrice = document.getElementById("register_target_price").value;
    const cutoffPrice = document.getElementById("register_cutoff_price").value;
    const weight = document.getElementById("register_weight").value;
    const targetProfit = document.getElementById("register_target_profit").value;
    const totalProfit = document.getElementById("register_total_profit").value;
    const remarks = document.getElementById("register_remarks").value;


    try {
        // const interestedList = await fetchInterestedList();
        // const id = await getUsername();
        // interestedList.push(inputVal);

        console.log(code)
        const variables = {
            input: {
                id: code,
                createdDate: registerDate,
                cutoffPrice: cutoffPrice,
                port: port,
                purchasePrice: purchasePrice,
                remarks: remarks,
                soldDate: soldDate,
                soldPrice: soldPrice,
                targetPrice: targetPrice,
                targetProfit: targetProfit,
                totalProfit: totalProfit,
                weight: weight
            }
        };
        
        await API.graphql(graphqlOperation(createInterestedInfo, variables));
        
    } catch (err) { console.log('error registering:', err) }

    // window.location.reload();
}

async function deleteSelected(selected) {

    console.log(selected)

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
                        <Modal visible={this.state.visible} width="400" height="450" effect="fadeInDown" onClickAway={() => this._closeModal()}>
                        
                            <div className='acenter'>
                                <input className='btn_close' value='X' type='button' onClick={() => this._closeModal()} />
                            </div>
                            
                            <div className='register_grid'>
                                <input className='register_input' placeholder="종목코드" id="register_code"/>
                                <input className='register_input' placeholder="입력날짜" id="register_date"/>
                                <input className='register_input' placeholder="포트" id="register_port"/>
                                <input className='register_input' placeholder="매수가" id="register_price"/>
                                <input className='register_input' placeholder="매도날짜" id="register_sold_date"/>
                                <input className='register_input' placeholder="매도가" id="register_sold_price"/>
                                <input className='register_input' placeholder="정산수익률" id="register_total_profit"/>
                                <input className='register_input' placeholder="목표가" id="register_target_price"/>
                                <input className='register_input' placeholder="손절가" id="register_cutoff_price"/>
                                <input className='register_input' placeholder="비중" id="register_weight"/>
                                <input className='register_input' placeholder="목표수익률" id="register_target_profit"/>
                                <input className='register_input' placeholder="비고" id="register_remarks"/>
                                
                            </div>

                            <input className='btn_register' value='등록' type='button' onClick={() => {
                                registerInterestedList()
                                registerInterestedInfo()
                                }}/>   

                        </Modal>
                    {/* <input type='button' value='삭제' className='btn_header' onClick={() => {deleteSelected(this.props.selected)}}/> */}
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

