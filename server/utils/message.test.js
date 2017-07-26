var expect = require('expect');
var {createMessage,createLocation} = require('./message');

describe('generateMessage', ()=> {
    it('should generate the correct format object of message', ()=>{
        var from = 'naqash';
        var text = 'hey how are you';
        var message = createMessage(from,text);

        expect(message.createAt).toBeA('number');
        expect(message).toInclude({from,text});
    });
});

describe('generateLocationMessage', ()=> {
    it('should generate the correct location object of user', ()=>{
        var from = 'Admin';
        var latitude = 33.729388199999995;
        var longitude = 73.0931461;
        var url = 'http://www.google.com/maps?q=33.729388199999995,73.0931461';
        var message = createLocation(from,latitude,longitude);

        expect(message.createAt).toBeA('number');
        expect(message).toInclude({from,url});
    });
});