import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./registerStyle.css";

class Register extends Component {
  state = {
    email: "",
    password: "",
  };

  loginHandler = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    
  };   ////계산된 속성명 사용

  buttonHandler = () => {
    console.log('button clicked');
  };

  loginClickHandler = () => {

    console.log('Login Button clicked');
    // const { email, password } = this.state;
    // fetch("http://10.58.2.17:8000/auth/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email,
    //     password,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((res) => console.log(res));
  }; 

  render() {
    const { isOpen, close } = this.props;   //아까 버튼에서 props로 가져온것
    return (
      <>
        {isOpen ? (  

         ////만약 isopen(this.state.isModalOpen)이 true일때 코드를 실행 false면  null
        /// <div onClick={close}> 로그인창 말고 회색 바탕을 누를시 모달이 꺼지게 만듬
	      ///<span className="close" onClick={close}>&times;</span> x버튼 누를시 꺼짐
        ////<div className="modalContents" onClick={isOpen}> 로그인 화면은 버튼 클릭해서 들어오면
         /// true인 상태로 있어서 화면이 안꺼진다.
      
          <div style={styles.modal}>
            <div onClick={close}>
              <div style={styles.loginModal}>
                <button style={styles.close} onClick={close}>
                  &times;
                </button>
                <div style={styles.modalContents} onClick={isOpen}>
                  
                  <input
                    name="email"
                    style={styles.loginId}
                    type="text"
                    autoFocus
                    placeholder="종목명"
                    onChange={this.loginHandler}
                  />
                  <button onClick={() => console.log("clicked!")}>테스트버튼</button>
                  <button style={styles.loginBtn} onClick={() => console.log('clicked!')}>
                    {"등록"}
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

const styles = {
    modal: {position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(0,0,0,0.6)'},
    loginModal: {width: 480, height: 621, background: 'white', position: 'relative', margin: '50px auto', padding: '20px', box: 'border-box'},
    close: {float: 'right', font: 15, background: 'black', color: 'white'},
    loginId: {margin: '10px auto', width: 100, height: 40, border: '1px solid #e5e5e5', padding: '6px 12px',},
    loginBtn: {margin: '10px auto', height: 50, font: 14, padding: '13px 30px', cursor: 'pointer', background: "black", color: 'white'},
    modalContents: {margin: '0px auto', width: '100%', position: 'relative', padding: '0 20px 32px', display: 'flex', justify: 'content', flex: 'column'}
      // 
      // 
      // 
      // outline: none,
      // box-sizing: border-box},
}

export default Register;