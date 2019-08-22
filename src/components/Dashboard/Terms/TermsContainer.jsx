import React from 'react'
import {connect} from 'react-redux';
import Translate from 'react-translate-component';
import { Route, Switch } from 'react-router-dom';

import TermsBar from './TermsBar';
import Creation from './Creation';
import Purchase from './Purchase';

@connect(
    state => ({
       
    }),
    dispatch => ({

    })
)

class TermsContainer extends React.Component {

    render() {
        return (
            <div>
                <br/>
                <section className="content terms">
                    <div className="box">
                        <Switch>
                            <Route path="/terms/creation" component={Creation} />
                            <Route path="/terms/purchase" component={Purchase} />
                        </Switch>
                    </div>
                </section>
                <br/>
            </div>
        );
    }
}

export default TermsContainer;