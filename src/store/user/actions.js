import moment from 'moment-timezone';

import * as types from './actionTypes';
import Api from '../../util/Api';
import { showLoading, hideLoading, showConfirm, hideConfirm } from '../ux/actions';
import { signOut } from 'next-auth/react';
function fillInfo(dispatch, value) {
    dispatch({
        type: types.FILL_USER_PROFILE, payload: {
            ...value
        }
    });
}

export function fillUserProfile(router, session) {
    return async (dispatch) => {
        dispatch({type: types.FILL_USER_PROFILE, payload: {...session.user}});
    }
}

export function fillWalletSummary() {
    return async (dispatch) => {
        const response = await Api.getInstance().getWalletSummary();
        if (response && response.success) {
            const data = {
                earnings: response.data.history.earnings,
                history: response.data.history.history,
                offering: response.data.history.offering,
                amount_pending: response.data.history.amount_pending,
                amount_withdrawn: response.data.history.amount_withdrawn,
                total_available: response.data.history.total_available,
                bond_calculations: response.data.history.bondCalculations,
                giftBondPopupShown: response.data.user.giftBondPopupShown,
            };
            dispatch({ type: types.FILL_USER_PROFILE, payload: data });
        }
    }
}

export function fillPortfolio() {
    return async (dispatch) => {
        dispatch(showLoading());
        const response = await Api.getInstance().getPortfolio();

        if (response && response.success) {
            dispatch({ type: types.FILL_USER_PROFILE, payload: response.data });
        }

        dispatch(hideLoading());
    }
}

export function signin(username, password, router, callback = () => { }, location, noLoading) {
    return async (dispatch) => {
        if (!noLoading) dispatch(showLoading());
        const response = await Api.getInstance().signin(username, password);
        if (!noLoading) dispatch(hideLoading());
        const analyticsJson = { username, location };
        if (response.success) {
            Analytics.setTrackWithProperties('signInSuccess', analyticsJson);
            if (response.data.role === "investor") {
                dispatch({ type: types.LOGIN_SUCCESS, payload: { ...response.data } });
                dispatch(fillUserProfile(router, false, () => {
                    callback();
                }))

            } else {
                dispatch(showConfirm("Error", "You are not an investor", () => dispatch(hideConfirm()), "Ok"));
            }
        } else {
            Analytics.setTrackWithProperties('signInFailed', analyticsJson);
            dispatch({ type: types.LOGIN_FAILED });
            if (response && response.message.indexOf('User') === -1 && response.message.indexOf('password') === -1) {
                dispatch(showConfirm("Error", response.message, () => dispatch(hideConfirm()), "Ok"));
            } else {
                return response
            }
        }
    }
}

export function signout(router, auth) {
    return async (dispatch) => {
        if(router) {
            signOut()
            router.push('/');
        }
        setTimeout(async () => {
            dispatch({ type: types.SIGNOUT });
        })
    }
}

export function setActivityStatus(value) {
    return async (dispatch) => {
        dispatch(showLoading());
        const response = await Api.getInstance().setActivityStatus(value);
        dispatch(hideLoading());
        if (response && response.success) {
            const response = await Api.getInstance().getuser();
            Analytics.setTrackWithProperties('update', { investmentsVisible: BOOLEAN[value.toString()] }, 'Privacy Settings and Notifications');
            dispatch({
                type: types.FILL_USER_PROFILE, payload: {
                    ...response.data,
                }
            });

        } else {
            dispatch(showConfirm("Error", response.message, () => dispatch(hideConfirm()), "Ok"));
        }
    }
}

export const resendWelcome = (email, callback) => {
    return async (dispatch) => {
        dispatch(showLoading());
        const response = await Api.getInstance().resendWelcome(email);
        dispatch(hideLoading());
        if (response && response.success) {
            if (callback) callback(response)
        } else {
            dispatch(showConfirm("Error", response.message, () => dispatch(hideConfirm()), "Ok"));
        }
    }
}

export const updatingEmail = (newEmail, oldEmail, callback) => {
    return async (dispatch) => {
        dispatch(showLoading());
        const response = await Api.getInstance().updatingEmail(newEmail, oldEmail);
        dispatch(hideLoading());
        return response;
    }
}

export const setUser = (user) => {
    return { type: types.SET_USER, payload: user };
}

export const updateImage = (user_image) => {
    return async (dispatch) => {
        dispatch(showLoading());
        const response = await Api.getInstance().updatePicture(user_image);
        if (response.success) {
            dispatch({ type: types.UPDATE_IMAGE, payload: { ...response.data } });
        } else {
            dispatch(showConfirm("Error", response.message, () => dispatch(hideConfirm()), "Ok"));
        }
        dispatch(hideLoading());
    }
}

export function updateProfileInfo(payload, callback = () => { }) {
    return async (dispatch) => {
        dispatch(showLoading());
        const response = await Api.getInstance().updatePersonalProfile(payload);
        dispatch(hideLoading());
        if (response.success) {
            dispatch({ type: types.UPDATE_PROFILE_INFO, payload });
            callback();
        } else {
            dispatch(showConfirm("Error", response.message, () => dispatch(hideConfirm()), "Ok"));
        }
    }
}

export function updateInvestorProfile(payload, callback = () => { }) {
    return async (dispatch) => {
        dispatch(showLoading());
        const response = await Api.getInstance().updateInvestorProfile(payload);
        dispatch(hideLoading());
        if (response.success) {
            dispatch({ type: types.UPDATE_INVESTOR_PROFILE, payload: response.data });
            callback();
        } else {
            dispatch(showConfirm("Error", response.message, () => dispatch(hideConfirm()), "Ok"));
        }
    }
}

export function checkStatus(callback = () => { }) {
    return async (dispatch) => {
        dispatch(showLoading());
        const response = await Api.getInstance().checkStatus();
        dispatch(hideLoading());
        if (response.success) {
            dispatch({ type: types.CHECK_USER_STATUS, payload: response.data.isVerified });
            callback(response.data.isVerified);
        } else {
            callback(false);
        }
    }
}

export function retryPersona(callback = () => { }) {
    return async (dispatch) => {
        dispatch(showLoading());
        const response = await Api.getInstance().retryPersona();
        dispatch(hideLoading());
        if (response.success) {
            dispatch({ type: types.SAVE_PERSONA_INFO, payload: response.data.data });
            callback();
        } else {
            dispatch(showConfirm("Error", response.message, () => dispatch(hideConfirm()), "Ok"));
        }
    }
}

export function inquiryCompleted(inquiryId, callback = () => { }) {
    return async (dispatch) => {
        dispatch(showLoading());
        const response = await Api.getInstance().inquiryCompleted(inquiryId);
        dispatch(hideLoading());
        if (response.success) {
            //  dispatch({ type: types.SAVE_PERSONA_INFO, payload: response.data.data });
            callback();
        } else {
            dispatch(showConfirm("Error", response.message, () => dispatch(hideConfirm()), "Ok"));
        }
    }
}

export function saveSignupInfo(values, analytics, callback) {
    return async (dispatch) => {
        if (values.step!= "step1" && values.step!= "disclosures") dispatch(showLoading());
        const response = await Api.getInstance().signup(values);
        if (values.step!= "step1" && values.step!= "disclosures") dispatch(hideLoading());
        if (response.success) {
            if (values.step === 'step1') {
                Analytics.setTrackWithProperties('signUpSuccessful', analytics);
            }
            dispatch({ type: types.SAVE_PERSONA_INFO, payload: response.data });
            if (callback) callback();
        } else {
            if (values.step === 'step1') {
                Analytics.setTrackWithProperties('signUpFailed', analytics);
            }
            dispatch(showConfirm("Error", response.message, () => dispatch(hideConfirm()), "Ok"));
        }
    }
}

export function changePassword(oldPassword, newPassword, callback = () => { }) {
    return async (dispatch) => {
        dispatch(showLoading());
        const response = await Api.getInstance().changePassword(oldPassword, newPassword);
        dispatch(hideLoading());
        if (response.success) {
            dispatch(hideConfirm());
            callback(response);
        } else {
            dispatch(hideConfirm());
            callback(response);
        }
    }
}