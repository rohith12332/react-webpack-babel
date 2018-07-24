import React, { Component } from 'react';
import Header from './common/Header';
import './index.scss';

class FlexBox extends Component{
    constructor(props){
        super(props)
    }

    componentWillMount() {
        console.log('Component will mount')
    }
    componentDidMount = () => {
        var flexBody = document.querySelector('body');
        flexBody.classList.add('flexbox')
    }
    componentWillUnmount() {
        var flexBody = document.querySelector('body');
        flexBody.classList.remove('flexbox')
    }

    render(){
        return (
            <div className="o-wrapper">
                <header>
                <div className="header-row">
                    <div className="header-row__left">
                        <img src="https://i.pinimg.com/originals/1c/8a/6c/1c8a6cdda56230bf5b97044ee97d1f42.jpg" className="brand-media_logo" />
                    </div>
                    <div className="header-row__right">
                    </div>
                </div>
                </header>
            </div>
        )
    }
}
export default FlexBox;