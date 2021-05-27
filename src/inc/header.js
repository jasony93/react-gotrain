import React, { Component } from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';
import '../App.css';

import { Auth } from 'aws-amplify';
import Modal from 'react-awesome-modal';

async function signOut() {

    try {
        await Auth.signOut({ global: true });
    } catch (error) {
        console.log('error signing out: ', error);
    }

    window.location.reload();
}

class header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible : false
        }
    }

    _openModal = () => {
        this.setState({
            visible : true
        });
      }
    
    _closeModal = () => {
        this.setState({
            visible : false
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
                    <div>
                        테스트
                        <input  value='닫기' type='button' onClick={() => this._closeModal()}/>
                    </div>
                    </Modal>
                    <button className='btn_header'>
                       조회
                    </button> 
                    <button className='btn_header' onClick={signOut}>로그아웃</button>
                </div>
         
            </div>

            <div className='acenter'> 
                <div>sdfsdf</div>
                <div>
                    
                </div>
                
            </div>

            
        </div>
    );
  }
}

export default header;

