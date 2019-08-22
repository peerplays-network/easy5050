import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import appReducer from './AppReducer';
import modalReducer from './ModalReducer';
import asideReducer from './AsideReducer';
import signInPageReducer from './SignInPageReducer';
import signUpPageReducer from './SignUpPageReducer';
import dashboardReducer from './DashboardReducer';
import sweepsReducer from './SweepsReducer';
import accountHistory from './AccountHistoryReducer';
import buyTicketsAside from './BuyTicketsAsideReducer';
import confirmationModalReducer from './ConfirmationModalReducer';
import successModalReducer from './SuccessModalReducer';
import claimBtsPageReducer from './ClaimBtsReducer';


const rootReducer = combineReducers({
    app: appReducer,
    claimBtsPage: claimBtsPageReducer,
    signInPage: signInPageReducer,
    signUpPage: signUpPageReducer,
    modal: modalReducer.reducer,
    aside: asideReducer.reducer,
    dashboard: dashboardReducer.reducer,
    confirmationModal: confirmationModalReducer.reducer,
    successModal: successModalReducer.reducer,
    accountHistory: accountHistory.reducer,
    sweeps: sweepsReducer.reducer,
    buyTicketsAside: buyTicketsAside.reducer,
    form: formReducer,
    router: routerReducer
})

export default rootReducer
