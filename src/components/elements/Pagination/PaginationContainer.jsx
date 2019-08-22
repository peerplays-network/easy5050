import React from 'react';
import moment from 'moment';
import $ from 'jquery';
import classNames from 'classnames';
import 'jquery-datepicker';
import constants from 'constants/tables';
import imgMagGlass from '../../../../assets/images/magGlass-25.png';
import { List } from 'immutable';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { NavLink } from 'react-router-dom';
import NavLinkText from './NavLinkText';
import SlidingMenu from './SlidingMenu';
import CustomProperties from 'react-custom-properties';
import 'react-tippy/dist/tippy.css';
import {
  Tooltip,
} from 'react-tippy';
import '../../../../assets/scss/styles.css';
// translations
counterpart.registerTranslations(
  'cn',
  require('../../../../assets/locales/locale-cn')
);
counterpart.registerTranslations(
  'de',
  require('../../../../assets/locales/locale-de')
);
counterpart.registerTranslations(
  'en',
  require('../../../../assets/locales/locale-en')
);
counterpart.registerTranslations(
  'es',
  require('../../../../assets/locales/locale-es')
);
counterpart.registerTranslations(
  'fr',
  require('../../../../assets/locales/locale-fr')
);
counterpart.registerTranslations(
  'ko',
  require('../../../../assets/locales/locale-ko')
);
counterpart.registerTranslations(
  'tr',
  require('../../../../assets/locales/locale-tr')
);
counterpart.registerTranslations(
  'ru',
  require('../../../../assets/locales/locale-ru')
);

export default ({
  currentPage,
  amountOfItems,
  setPage,
  setFilters,
  activeFilters,
  setActiveDraws,
  activeDraws,
  balance,
  location,
  signOutFunc
}) => {
    let pickerInput;
    const limit = constants.LIMIT;

    const onSetPreviousPage = () =>
    currentPage > 1 ? setPage(currentPage - 1) : null;

    const onSetNextPage = () =>
    currentPage * limit < amountOfItems ? setPage(currentPage + 1) : null;

    const toggleCalendar = () => $(pickerInput).trigger('focus');
    const textFilter =
    activeFilters &&
    activeFilters.findIndex(filter => filter.key === 'textFilter') != -1
      ? activeFilters.get(
          activeFilters.findIndex(filter => filter.key === 'textFilter')
        ).val
      : '';

    const dateStartFilter =
    activeFilters &&
    activeFilters.findIndex(filter => filter.key === 'dateRange') != -1
      ? activeFilters.get(
          activeFilters.findIndex(filter => filter.key === 'dateRange')
        ).val.start_date
      : '';

    const dateEndFilter =
    activeFilters &&
    activeFilters.findIndex(filter => filter.key === 'dateRange') != -1
      ? activeFilters.get(
          activeFilters.findIndex(filter => filter.key === 'dateRange')
        ).val.end_date
      : '';

    const resetCalendar = () => {
        if (setDateFilterEnd) {
            setDateFilterEnd(null);
        }
    };

    const whiteTextStyle = {
        color: 'white'
    };

  // const updateTextFilter = (event) => {
  //     setTextFilter(event.target.value);
  // };

    const updateFilters = event => {
        if (!setFilters) {
            return;
        }
        let filters;
        const txtFilter = $('#textFilter');
        filters =
      (txtFilter !== undefined && txtFilter.val()) !== ''
        ? List([{ key: 'textFilter', val: txtFilter.val() }])
        : List();
    // compile filters from component values
    // filters: List([{'key':'textFilter','val': 'net'},{'key':'dateRange', 'val':{'start_date':'01-02-18', 'end_date':'04-05-19'}}])

    // checking for valid dates
        let startDateDom = $('#startDate'),
            endDateDom = $('#endDate'),
            startDateVal,
            endDateVal;

        startDateVal = startDateDom ? startDateDom.val() : '';
        endDateVal = endDateDom ? endDateDom.val() : '';

        let startDate = moment(startDateVal, 'YYYY-MM-DD', true),
            endDate = moment(endDateVal, 'YYYY-MM-DD', true),
            dateFilter = {};

        dateFilter.start_date = startDate.isValid()
      ? startDate.format('YYYY-MM-DD')
      : undefined;
        dateFilter.end_date = endDate.isValid()
      ? endDate.format('YYYY-MM-DD')
      : undefined;
        if (dateFilter.start_date || dateFilter.end_date) {
            filters = filters.push({ key: 'dateRange', val: dateFilter });
        }
        setFilters(filters);
    };

    const onChangeActiveDraws = event => {
        // console.warn(event.target.checked, event.target.name);
        setActiveDraws(!event.target.checked);
    };

    const setPicker = input => {
        pickerInput = input;

        $(pickerInput).datepicker({
            onSelect: dateText => {
                if (setDateFilterEnd) {
                    setDateFilterEnd(new Date(dateText).toISOString());
                }
            }
        });

        if (dateFilterEnd) {
            $(pickerInput).datepicker(
        'setDate',
        moment(dateFilterEnd).format('MM/DD/YYYY')
      );
        }
    };
    const slideMenu = () => {
        const menu = document.querySelector('.sliding-menu');
        menu.style.right = '0';
    };

  // console.log("Amount of Items:" + amountOfItems);
    return (
      
      <div className="filters darkGrey">
        <div className="container padding-zero">
          <div className="row m-0">
            <div className="col-md-5 d-flex justify-content-left margin-zero">
              <NavLink
                  id="dashboard"
                  to={'/dashboard'}
                  className="nav__item"
                  activeClassName="activeMenu"
              >

                <Tooltip
             // options
                    title="Displays a table of currently active draws"
                    position="bottom"
                    arrow="true"
                >
                  <NavLinkText
                      icon="fas fa-list-ul"
                      text="navigation.dashboard"
                      padding="pt-3 pb-3 px-2"
                  />
                </Tooltip>

              </NavLink>

              <NavLink
                  id="myDraws"
                  to={'/draws/mytickets'}
                  className="nav__item"
                  activeClassName="activeMenu"
              >
                <Tooltip
             // options
                    title="Displays a list of all your tickets"
                    position="bottom"
                    arrow="true"
                >
                  <NavLinkText
                      icon="fas fa-ticket-alt"
                      text="navigation.my_draws"
                      padding="pt-3 pb-3 px-2"
                  />
                </Tooltip>
              </NavLink>
              <NavLink
                  id="history"
                  to={'/history'}
                  className="nav__item"
                  activeClassName="activeMenu"
              >
                <Tooltip
             // options
                    title="Displays a list of all actions your account has done"
                    position="bottom"
                    arrow="true"
                >
                  <NavLinkText
                      icon="fas fa-history"
                      text="navigation.history"
                      padding="pt-3 pb-3 px-2"
                  />
                </Tooltip>
              </NavLink>

            </div>
            <div className="col-md-4 d-flex align-items-center margin-zero">
              {setFilters &&
                <Tooltip
                  // options
                  title={location.pathname.includes('history') ? 'Enter dates to filter down history entries' : 'Enter dates to narrow down draws based on resolution time'}
                  position="bottom"
                  arrow="true"
                  distance="20"
                >
                  <div className="d-flex align-items-center">
                    <Translate
                      component="span"
                      content="navigation.from"
                      className="page-string text-uppercase"
                    />{' '}
                    <input
                      id="startDate"
                      value={dateStartFilter}
                      className="drawFromDteSearch darkGrey page-string"
                      type="date"
                      onChange={updateFilters.bind(this)}
                    />
                    <Translate
                      component="span"
                      content="navigation.to"
                      className="page-string text-uppercase"
                    />{' '}
                    <input
                      id="endDate"
                      value={dateEndFilter}
                      className="drawToDteSearch darkGrey page-string"
                      type="date"
                      onChange={updateFilters.bind(this)}
                    />
                  </div>
                </Tooltip>              
              }
              
            </div>
            {setFilters ? (
              <div className="col-md-3 criteriaTextSearch margin-zero">

                <input
                    id="textFilter"
                    className="txtSearch drawNameSearch colorMyBackBlack input-page-string text-uppercase"
                    value={textFilter}
                    type="text"
                    placeholder={counterpart.translate(
                  'navigation.search_placeholder'
                )}
                    onChange={updateFilters.bind(this)}
                />
                <Tooltip
                // options
                    title="Enter the name of a draw to narrow down your search"
                    position="bottom"
                    arrow="true"
                    distance="20"
                >
                  <i className="fas fa-search ml-2" />
                </Tooltip>
                <div className="divider-left ml-4 pl-4">
                  <a
                      className="no-decoration"
                      href="javascript:void(0)"
                      onClick={slideMenu.bind(this)}
                  >
                    <Tooltip
                // options
                        title="Display a menu of user options"
                        position="bottom"
                        arrow="true"
                        distance="20"
                    >
                      <i className="fas fa-user" />
                    </Tooltip>
                  </a>
                </div>
              </div>
          ) : (
            <div className="col-md-3 d-flex align-items-center justify-content-end margin-zero">
              <div className="divider-left ml-4 pl-4">
                <a
                    className="no-decoration"
                    href="javascript:void(0)"
                    onClick={slideMenu.bind(this)}
                >
                  <i className="fas fa-user" />
                </a>
              </div>
            </div>
          )}
          </div>
        </div>
        <SlidingMenu
            searchPlaceholder={counterpart.translate(
          'navigation.search_placeholder'
        )}
            updateSearch={updateFilters.bind(this)}
            textFilter={textFilter}
            balance={balance}
            signOut={signOutFunc}
        />
      </div>

    );
};
