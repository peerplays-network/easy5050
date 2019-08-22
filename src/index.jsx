import '../assets/scss/style.scss';
import {theme} from '../assets/CSSVariables/theme';
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';
import { configureStore } from './store/configureStore';
import App from 'components/App';
import AppActions from 'actions/AppActions';
import CustomProperties from 'react-custom-properties';

//TODO:: mv to init
import counterpart from 'counterpart';
import locale_en from './../assets/locales/locale-en.json';
import locale_fr from './../assets/locales/locale-fr.json';
import locale_ru from './../assets/locales/locale-ru.json';

counterpart.registerTranslations("en", locale_en);
counterpart.registerTranslations("fr", locale_fr);
counterpart.registerTranslations("ru", locale_ru);
counterpart.setFallbackLocale("en");

if (process.env.NODE_ENV === 'production'){ 
    window.console.log = window.console.warn = window.console.error = function() {}; //supress for prod
}




const history = createHistory();
const store = configureStore(history, window.__initialState__);
store.dispatch(AppActions.init());

export const Root = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <CustomProperties global properties={theme}>
           		<App />
            </CustomProperties>
        </ConnectedRouter>
    </Provider>
);

if (!module.hot) render(<Root />, document.querySelector('react'));
