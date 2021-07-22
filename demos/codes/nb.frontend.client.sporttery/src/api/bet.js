// import store from '@/store';
import createAxios from './createAxios';

const axios = createAxios({ baseURL: window.NBConfig.BET_URL });

// axios.interceptors.request.use((config) => {
//   store.commit('portal/updateToken');
//   return config;
// });

export const getBetBalance = params => axios.post('QueryUser', params);

export const getBetHistory = params => axios.post('MyTickets', params);

export const getMultBetList = params => axios.post('TicketBets', params);

export const postDoBetList = params => axios.post('DoBet', params);

export const postDoMixBetList = params => axios.post('DoMixBet', params);

export const postPreCash = params => axios.post('PreCash', params);

export const postPublishPlan = params => axios.post('DeployPlan', params);

export const postFollowPlan = params => axios.post('FollowPlan', params);
