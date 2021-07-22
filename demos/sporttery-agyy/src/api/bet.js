import createAxios from './createAxios';

const axios = createAxios({
  baseURL: window.NBConfig.BET_URL,
});

export const getBetBalance = params => axios.post('QueryUser', params);

export const getBetHistory = params => axios.post('MyTickets', params);

export const getMultBetList = params => axios.post('TicketBets', params);

export const postDoBetList = params => axios.post('DoBet', params);

export const postPreCash = params => axios.post('PreCash', params);
