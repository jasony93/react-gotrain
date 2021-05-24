import React, { Component } from "react";
import Register from "./register";

class registerButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    return (
      <>
        <button onClick={this.openModal}>신규등록</button>
        <Register isOpen={this.state.isModalOpen} close={this.closeModal} />
      </>
    );
  }
}

export default registerButton;