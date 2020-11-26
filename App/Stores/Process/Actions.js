const { createActions } = require("reduxsauce");

const {Types,Creators} = createActions({
    fetchProcess: null,
    fetchProcessSuccess: ['process'],

    fetchProcessDetail: ['idProcess'],
    fetchProcessDetailSuccess: ['processDetail'],

    fetchListProcess: null,
    fetchListProcessSuccess:['ListProcess'],
})
export const ProcessTypes = Types;
export default Creators;