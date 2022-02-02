import * as types from './actionTypes';

const initialState = {
    data_available: false,
    loading: false,
    forceLoading: false,
    asyncLoading: false,
    change_password: false,
    confirm: {
        title: '',
        body: '',
        onConfirm: () => { },
        visible: false,
        sidenav_open: false,
        sidenav_profile_open: false,
        closable: false,
    },
    isLogin: false
};

const ux = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.SET_DATA_AVAILABLE:
            return {
                ...state,
                data_available: true
            };
        case types.SET_DATA_UNAVAILABLE:
            return {
                ...state,
                data_available: false
            };
        case types.SHOW_LOADING:
            return {
                ...state,
                loading: true,
                forceLoading: action.payload ? action.payload.forceLoading : state.forceLoading
            };

        case types.HIDE_LOADING:
            return {
                ...state,
                loading: false,
                forceLoading: action.payload ? action.payload.forceLoading : state.forceLoading
            };
        case types.SHOW_CONFIRM:
            return {
                ...state,
                confirm: {
                    title: action.payload.title,
                    body: action.payload.body,
                    primaryAction: () => action.payload.primaryAction(action.payload.type),
                    secondaryAction: () => action.payload.secondaryAction(action.payload.type),
                    visible: true,
                    primaryLabel: action.payload.primaryLabel,
                    secondaryLabel: action.payload.secondaryLabel,
                    closable: action.payload.closable,
                    className: action.payload.className
                }
            };

        case types.HIDE_CONFIRM:
            return {
                ...state,
                confirm: {
                    title: '',
                    body: '',
                    primaryAction: () => { },
                    secondaryAction: () => { },
                    visible: false,
                    primaryLabel: '',
                    secondaryLabel: ''
                }
            };
        case types.SHOW_ASYNC_LOADING: {
            return {
                ...state,
                asyncLoading: true,
            };
        }

        case types.HIDE_ASYNC_LOADING: {
            return {
                ...state,
                asyncLoading: false,
            };
        }

        case types.TOGGLE_SIDENAV: {
            return {
                ...state,
                sidenav_open: !state.sidenav_open
            };
        }

        case types.TOGGLE_SIDENAV_PROFILE: {
            return {
                ...state,
                sidenav_profile_open: !state.sidenav_profile_open
            };
        }

        case types.SHOW_CHANGE_PASSWORD:
            return {
                ...state,
                change_password: true,
            }

        case types.HIDE_CHANGE_PASSWORD:
            return {
                ...state,
                change_password: false,
            }

        case types.IS_LOGIN:
            return {
                ...state,
                isLogin: !state.isLogin,
            }

        default:
            return state;
    }
}

export default ux;
