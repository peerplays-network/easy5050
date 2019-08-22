import React from 'react';

import DrawForm from './DrawForm';

class Create extends React.Component {
	constructor(props) {
        super(props);
        this.state = {hide: false};
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
    	this.props.hide()
    }

    render() {

        return (
            <section key="1" className="content content-create">
                <div className="box">
                    <DrawForm
                		hide={this.closeModal}
                        visible={this.props.visible}
                        onClose={this.props.hide}
                     />
                </div>
            </section>
        )
    }
}

export default Create;