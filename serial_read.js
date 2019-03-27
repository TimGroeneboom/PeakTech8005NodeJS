const SerialPort = require('serialport')
const Delimiter = require('@serialport/parser-delimiter')

const port = new SerialPort('COM4', {
  baudRate: 9600
})

// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message)
})

const dbParser = port.pipe(new Delimiter({ delimiter: [0xA5] }))
port.pipe(dbParser)

dbParser.on('data', data => {
   
    // measured readings
    if( data[1] == 0x0D ){
        var left = data[2] & 255;
        var right = data[4] >> 4;
        var decimal = data[4] & 0x0F;

        var value = ( left * 10 ) + right +  ( decimal / 10 );
        console.log(value);
    }

    // rec is on
    if( data[1] == 0x0A ) {
        console.log("rec is on");
    }

    if( data[1] == 0x1B ) {
      console.log("dbA");
    }

  if( data[1] == 0x1C ) {
    console.log("dbC");
  }
}) 

var keypress = require('keypress');
 
// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
 
// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);

  // rec
  if(key.name == 'r'){
    port.write([0x55], err =>{
      if( err != undefined ) {
        console.log(err);
      }
    });
  }
  // dbc dba switch
  if(key.name == 'd'){
    port.write([0x99], err =>{
      if( err != undefined ) {
        console.log(err);
      }
    });
  }
  // exit
  if (key.name == 'c' ){
    process.exit(0);
  }
    

});
 
process.stdin.setRawMode(true);
process.stdin.resume();