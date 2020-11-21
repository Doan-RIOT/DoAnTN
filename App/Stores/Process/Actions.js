const { createActions } = require("reduxsauce");

const {Types,Creators} = createActions({
    fetchProcess: null,
    fetchProcessSuccess: ['process'],

    fetchProcessDetail: null,
    fetchProcessDetailSuccess: ['processDetail'],
})
export const ProcessTypes = Types;
export default Creators;