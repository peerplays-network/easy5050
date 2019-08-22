import React from 'react';

export default class BrowserSupportModal extends React.Component {

    constructor(props) {
      super(props);
    }

    render() {

    	const browserSupportHeight = {
        height: '60px'
      }

    	return (
    		<div className="browserSupportBackground pt-4 pr-4 pl-4">
          <h3 className="browserSupportMessageText text-golden text-uppercase text-bold text-center">
						Unsupported Browser Detected            
          </h3>
          <p className="text-center icon-white"> We have detected that you are using a web browser that is not officially supported. This page has been optimized for Google Chrome, and Mozilla FireFox, and some features may not work correctly on other browsers. For the best playing experience, we suggest downloading one of these browsers.</p>
          <div className="row justify-content-center mt-5">
            <div className="col-3 justify-content-center mr-1">
              <a href='https://www.google.com/chrome/'><i class="fab fa-chrome fa-4x" style={browserSupportHeight}></i></a>
            </div>
            <div className="col-3 justify-content-center ml-1">
              <a href='https://www.mozilla.org/en-US/firefox/'><i class="fab fa-firefox fa-4x " style={browserSupportHeight}></i></a>
            </div>
          </div>
          <div className="text-align-center p-4">
            <button className="btn-forward browser-button-width text-center" onClick={this.props.closeBrowserSupportMessage}>OK</button>
          </div>
        </div>
    	);
    }
}