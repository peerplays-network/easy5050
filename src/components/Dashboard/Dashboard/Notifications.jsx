import React from 'react';
import 'react-notifications/lib/notifications.css';
import { connect } from 'react-redux';
import AccountHistoryActions from 'actions/AccountHistoryActions';
import StorageService from 'services/StorageService';
import SignInService from 'services/SignInService';
import AccountChainRepository from 'repositories/AccountChainRepository';
import AppActions from 'actions/AppActions';
import chainTypes from 'constants/chainTypes';
import {NotificationContainer, NotificationManager} from 'react-notifications';

@connect(
    state => {

        const accountHistory = state.accountHistory.get('accountHistory');
        return {
            accountHistory: state.accountHistory.get('accountHistory'),
            accountHistoryLotterySymbols: state.accountHistory.getIn(['accountHistoryLotterySymbols']),
            accountHistoryLotteryPrices: state.accountHistory.getIn(['accountHistoryLotteryPrices']),
            accountHistoryBlocksTime: state.accountHistory.getIn(['accountHistoryBlocksTime']),
            showSignOutModal: state.app.showSignOutModal,
            location: state.router.location.pathname.split('/')[1],
            fullLocation: state.router.location.pathname,
            showAside: state.buyTicketsAside.get('showAside'),
            accountHistoryTableParams: {
                filteredArrayLength: accountHistory.length
            },
            state,
        };
    },

    dispatch => ({
        setDisplayedBalance: bal => dispatch(AppActions.setDisplayedBalance(bal)),
        subscribeHistory: () => dispatch(AccountHistoryActions.subscribeHistory()),
        unsubscribeHistory: () => dispatch(AccountHistoryActions.unsubscribeHistory()),
        setFilteredHistoryLength: size => dispatch(AccountHistoryActions.setFilteredHistoryLength(size)),
        dispatch
    })

)

class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = { notificationTimer: null };
    }

    componentWillUnmount() {
        console.warn('unmounting notifications');
        this.props.unsubscribeHistory();
    }

    componentWillMount() {
        SignInService.checkLoginAccount().then(account => {
            if (account) {
                console.warn('notifications enabled!');
                this.props.subscribeHistory();
            }
        });
    }

    componentDidMount() {
        const timerId = setInterval(() => {
            SignInService.checkLoginAccount().then(account => {
                if (account) {
                    const balance = AccountChainRepository.getAccountBalance(account);
                    this.props.setDisplayedBalance(balance);
                }
            });
        }, 5000);

        this.startNotifications();
    }

    componentWillUpdate() {
        //console.log("notification update");
        if (this.props.showAside === true && this.state.notificationTimer !== null) {
            // pause notifications
            this.pauseNotifications();
        } else if (this.props.showAside === false && this.state.notificationTimer === null) {
            // resume notifications
            this.startNotifications();
        }
    }

    // function for pausing notifications
    pauseNotifications() {
        clearInterval(this.state.notificationTimer);
        this.setState({notificationTimer: null});
    }

    // function for starting notification checks
    startNotifications() {
        this.state.notificationTimer = setInterval(() => {
            SignInService.checkLoginAccount().then(account => {
                if (account) {
                    this.checkNotifications();
                }
            });
        }, 60000);
    }

    notifyMe(text) {
        // Let's check if the browser supports notifications
         if (!('Notification' in window)) {
            alert('This browser does not support desktop notification');
        }

        // Let's check whether notification permissions have already been granted
         else if (Notification.permission === 'granted') {
          // If it's okay let's create a notification
            let notification = new Notification(text);
        }

        // Otherwise, we need to ask the user for permission
         else if (Notification.permission !== 'denied') {
            Notification.requestPermission((permission) => {
            // If the user accepts, let's create a notification
              if (permission === 'granted') {
                let notification = new Notification(text);
            }
          });
        }

        // At last, if the user has denied notifications, and you
        // want to be respectful there is no need to bother them any more.
     }

    checkNotifications() {
        const accountHistory = this.props.accountHistory;
        // console.warn(accountHistory); .filter(item => item.op[0] === 53)
        const currentTime = StorageService.get('lastUpdated') || Date.now();
        // currentTime = currentTime.format('MM.DD.YYYY') + ' ' + currentTime.format('hh:mm A')
        const notifications = accountHistory.toJS().map((tx, index) => {
            tx = {
                ...tx,
                ...this.props.accountHistoryBlocksTime.toJS()[index]
            };

            tx.op[1].symbol = tx.op[1].symbol || this.props.accountHistoryLotterySymbols.toJS()[index];
            tx.op[1].typeName = Object.entries(chainTypes.operations).find(operation => operation[1] === tx.op[0])[0];
            tx.op[1].assetPrice = this.props.accountHistoryLotteryPrices.toJS()[index];

            return tx;
        }).filter(item => item.op[0] === 79).filter(item =>
             item.blockTime >= currentTime - 5000);

        if (notifications.length > 0) {
            this.createNotification(notifications, 'win');
        }
        StorageService.set('lastUpdated', Date.now()); // update the timestamp
    }

    createNotification(drawInfo, type) {
        if (type === 'win') {
            drawInfo.forEach((draw, index) => {
                const drawName = draw.op[1].symbol;
                if (draw.op[1].lottery && !draw.op[1].is_benefactor_reward) {
                    NotificationManager.success(`Congratulations, you've won ${drawName}!`);
                    this.notifyMe(`Congratulations, you've won ${drawName}!`);
                }
            });
        } else if (type === 'ee') {
            NotificationManager.info(`Hey! Look at me!`);
        }

    }

    render() {
        return (
          //<NotificationContainer ref={(child) => { this._child = child; }} />
          <NotificationContainer />
        );
    }

}

export default Notifications;
