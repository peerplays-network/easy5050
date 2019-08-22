import React from 'react';
import {connect} from 'react-redux';
//import counterpart from 'counterpart';
import Translate from 'react-translate-component';

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

//var note1 = translate('terms_conditions.create_note_1');
//var note2 = translate('terms_conditions.create_note_2');
//var note3 = translate('terms_conditions.create_note_3');
//var note4 = translate('terms_conditions.create_note_4');

//var bullet1 = translate('terms_conditions.create_bullet_1');
//var bullet2 = translate('terms_conditions.create_bullet_2');
//var bullet3 = translate('terms_conditions.create_bullet_3');
//var bullet4 = translate('terms_conditions.create_bullet_4');
//var bullet5 = translate('terms_conditions.create_bullet_5');
//var bullet6 = translate('terms_conditions.create_bullet_6');
//var bullet7 = translate('terms_conditions.create_bullet_7');

//var sbullet1 = translate('terms_conditions.create_sbullet_1');
//var sbullet2 = translate('terms_conditions.create_sbullet_2');

const Creation = props => {

    return ([
        
        <div key="0" className="termsContainer">

            <div key="1" className="termsHeaderContainer">
                <Translate component="h1" content="terms_conditions.create_terms_of_use" className="h1" />
            </div>

            <div key="0" className="termsMiddleContainer">
                <Translate component="h2" content="terms_conditions.in_canada" className="h2" />
                <div key="1" className="description">
                    <Translate component="p" content="terms_conditions.create_note_1" />
                    <Translate component="p" content="terms_conditions.create_note_2" />
                </div>

                <ol key="2" className="list">
                    <Translate component="li" content="terms_conditions.create_bullet_1" />
                    <Translate component="li" content="terms_conditions.create_bullet_2" />
                    <Translate component="li" content="terms_conditions.create_bullet_3" />
                    <Translate component="li" content="terms_conditions.create_bullet_4" />
                    <Translate component="li" content="terms_conditions.create_bullet_5" />
                    <Translate component="li" content="terms_conditions.create_bullet_6" />
                    <Translate component="li" content="terms_conditions.create_bullet_7" />
                    <ul key="3" className="list">
                        <Translate component="li" content="terms_conditions.create_sbullet_1" />
                        <Translate component="li" content="terms_conditions.create_sbullet_2" />
                    </ul>
                </ol>

                <div key="4" className="description">
                    <Translate component="p" content="terms_conditions.create_note_3" />
                </div>
            </div> 

            <div key="0" className="termsBottomContainer">
                <Translate component="h2" content="terms_conditions.outside_canada" className="h2" />
                <div key="5" className="description">
                    <Translate component="p" content="terms_conditions.create_note_4" />   
                </div>
            </div>

        </div>
    ]);
}

export default Creation;