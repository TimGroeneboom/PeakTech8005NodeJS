const SerialPort = require('serialport')
const Delimiter = require('@serialport/parser-delimiter')

const port = new SerialPort('COM4', {
  baudRate: 9600
})

const dbParser = port.pipe(new Delimiter({ delimiter: [0xA5] }))
port.pipe(dbParser)

dbParser.on('data', data => {
   // console.log(data)
    if( data[1] == 0x0D ){
        var left = data[2] & 255;
        var right = data[4] >> 4;
        var decimal = data[4] & 0x0F;

        var value = ( left * 10 ) + right +  ( decimal / 10 );
        console.log(value);
    }
}) 