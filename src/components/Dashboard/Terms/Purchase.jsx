import React from 'react'
import {connect} from 'react-redux';
//import counterpart from 'counterpart';
import Translate from 'react-translate-component';

import '../../../../assets/scss/components/_terms.scss';


/*
    a note that was here before I started working on this -
    [NTD: In order for this to be effective the Participant will need to be informed of what the “Jurisdiction” is and have access to, at a minimum, a summary of the License terms or rules of play of the Permitted Lottery. If that is not going to be made available then Participants should, at a minimum represent that they “are eligible to participate, or not otherwise prohibited from participating in the Permitted Lottery, under Applicable Laws.”]
*/

// translations
//counterpart.registerTranslations('cn', require('../../../../assets/locales/locale-cn'));
//counterpart.registerTranslations('de', require('../../../../assets/locales/locale-de'));
//counterpart.registerTranslations('en', require('../../../../assets/locales/locale-en'));
//counterpart.registerTranslations('es', require('../../../../assets/locales/locale-es'));
//counterpart.registerTranslations('fr', require('../../../../assets/locales/locale-fr'));
//counterpart.registerTranslations('ko', require('../../../../assets/locales/locale-ko'));
//counterpart.registerTranslations('tr', require('../../../../assets/locales/locale-tr'));
//counterpart.registerTranslations('ru', require('../../../../assets/locales/locale-ru'));

//var translate = require('counterpart');

//var note1 = translate('terms_conditions.participate_note_1');
//var note2 = translate('terms_conditions.participate_note_2');
//var note3 = translate('terms_conditions.participate_note_3');
//var note4 = translate('terms_conditions.participate_note_4');
//var bullet1 = translate('terms_conditions.participate_bullet_1');
//var bullet2 = translate('terms_conditions.participate_bullet_2');
//var bullet3 = translate('terms_conditions.participate_bullet_3');

class Purchase extends React.Component {
    render() {
        return ( ([

            <div key="0" className="termsContainer">

                <div key="1" className="termsHeaderContainer">
                    <Translate component="h1" content="terms_conditions.participate_terms_of_use" className="h1" />
                </div>

                <div key="2" className="termsMiddleContainer">
                    <Translate component="h2" content="terms_conditions.in_canada" className="h2" />
                    <div key="3" className="description">
                        <Translate component="p" content="terms_conditions.participate_note_1" />
                        <Translate component="p" content="terms_conditions.participate_note_2" />
                        <ul key="4" className="list">
                            <Translate component="li" content="terms_conditions.participate_bullet_1" />
                            <Translate component="li" content="terms_conditions.participate_bullet_2" />
                            <Translate component="li" content="terms_conditions.participate_bullet_3" />
                        </ul>
                        <Translate component="p" content="terms_conditions.participate_note_3" />
                    </div>
                </div>

                <div key="5" className="termsBottomContainer">
                    <Translate component="h2" content="terms_conditions.outside_canada" className="h2" />
                    <div key="6" className="description">
                        <Translate component="p" content="terms_conditions.participate_note_4" />
                    </div>
                </div>
            </div>

        ]));
    }
}

export default Purchase;
