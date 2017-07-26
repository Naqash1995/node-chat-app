const moment = require('moment');

var createMessage = (from,text) => {
return{
        from,
        text,
        createAt: moment().valueOf()
    };
};

var createLocation = (from,latitude,longitude) => {
    return{
        from,
        url: `http://www.google.com/maps?q=${latitude},${longitude}`,
        createAt: moment().valueOf()
    };
};
module.exports = {createMessage,createLocation};