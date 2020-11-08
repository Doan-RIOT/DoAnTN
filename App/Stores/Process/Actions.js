const { createActions } = require("reduxsauce");

const {Types,Creators} = createActions({
    fetchProcess: null,
    fetchProcessSuccess: ['process'],
})
export const ProcessTypes = Types;
export default Creators;