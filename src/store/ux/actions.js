import * as types from './actionTypes';

export const showLoading = (payload) => ({type: types.SHOW_LOADING, payload: payload});
export const hideLoading = (payload) => ({type: types.HIDE_LOADING, payload: payload});

export const dataAvailable = (payload) => ({type: types.SET_DATA_AVAILABLE, payload: payload});
export const dataUnavailable = (payload) => ({type: types.SET_DATA_UNAVAILABLE, payload: payload});

export const showConfirm = (title, body, primaryAction, primaryLabel, secondaryLabel, secondaryAction, closable = true, className='') => ({type: types.SHOW_CONFIRM, payload: {title, body, primaryAction, primaryLabel, secondaryLabel, secondaryAction, closable, className} });
export const hideConfirm = () => ({type: types.HIDE_CONFIRM});

export const showAsyncLoading = () => ({type: types.SHOW_ASYNC_LOADING});
export const hideAsyncLoading = () => ({type: types.HIDE_ASYNC_LOADING});

export const toggleSidenav = () => ({type: types.TOGGLE_SIDENAV});
export const toggleSidenavProfile = () => ({type: types.TOGGLE_SIDENAV_PROFILE});

export const isLogin = () => ({type: types.IS_LOGIN});