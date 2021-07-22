const queryState = {
  pickData: {},
  pickSelect: {},
  pickChange: {},
  queryData: {},
};

const mutations = {
  setPickerData(qState, obj) {
    qState.pickData = obj || {};
    mutations.setPickChange(qState);
  },
  setPickChange(qState, obj) {
    qState.pickChange = obj || {};
  },
  setPickerSelect(qState, obj) {
    qState.pickSelect = obj || {};
  },
  setQueryData(qState, obj) {
    qState.queryData = obj || {};
  },
};

const actions = { };

export default {
  namespaced: true,
  state: queryState,
  mutations,
  actions,
};
