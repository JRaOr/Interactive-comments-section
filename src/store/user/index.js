import * as types from './actionTypes';
import Api from '../../util/Api';

const initialState = {
    id: null,
    image: null,
    email: null,
    articles: [],
};

export default function user(state = initialState, action = {}) {
    switch (action.type) {
        case types.FILL_USER_PROFILE: {
            return {
                ...state,
                ...action.payload
            };
        }

        case types.LOGIN_SUCCESS:
            Api.setInstance(action.payload.access_token);
            localStorage.setItem('token', action.payload.access_token);
            return {
                ...state,
                name: action.payload.name,
                microservice_account: action.payload.microservice_account,
                userId: action.payload.userId,
                investment_limit: action.payload.investment_limit,
            };

        case types.LOGIN_FAILED:
            return state;


        case types.SET_USER:

            return {
                ...state,
                name: action.payload.name,
                avatar: action.payload.avatar,
            };

        case types.SIGNOUT:
            Api.setInstance(null);
            localStorage.removeItem('token');
            return initialState;

        case types.UPDATE_IMAGE:
            return {
                ...state,
                avatar: action.payload.user_image,
            };

        case types.SAVE_PERSONA_INFO:
            return {
                ...state,
                persona_info: action.payload,
            };

        case types.UPDATE_PROFILE_INFO: {
            return {
                ...state,
                username: action.payload.username,
                email: action.payload.email,
                streetAddress: action.payload.address,
                streetAddress2: action.payload.address2,
                zip: action.payload.zip,
                country: action.payload.country,
                state: action.payload.state,
                city: action.payload.city
            };
        }
        case types.UPDATE_INVESTOR_PROFILE: {
            return {
                ...state,
                annualIncome: action.payload.annualIncome,
                netWorth: action.payload.netWorth,
                externalInvestment: action.payload.amountInvested,
                isAccredited: action.payload.isAccredited,
                grossIncomeCheck: action.payload.gross_income_check,
                organizationAssetsCheck: action.payload.organization_assets_check,
                spousalGrossIncomeCheck: action.payload.spousal_gross_income_check,
                totalInvestmentLimit: action.payload.totalInvestmentLimit
            };
        }

        case types.CHECK_USER_STATUS: {
            return {
                ...state,
                isVerified: action.payload
            };
        }

        default:
            return state;
    }
}