// requires ChilliController.js
// See: http://www.coova.org/CoovaChilli/JSON
//
// Copyright(c) 2010, Guido De Rosa <guido.derosa@vemarsas.it>
// License: MIT

function showUserStatus(h) {

  // Utility functions and objects
  //
  function formatStateCode(code) {
    switch(code) {
      case chilliController.stateCodes.UNKNOWN:
        return 'Unknown';
      case chilliController.stateCodes.NOT_AUTH:
        return 'Not Authorized';
      case chilliController.stateCodes.AUTH:
        return 'Authorized';
      case chilliController.stateCodes.AUTH_PENDING:
        return 'Authorization Pending';
      case chilliController.stateCodes.AUTH_SPLASH:
        return 'AUTH_SPLASH'; // What does it mean?
      default:
        return code;
    }
  }

  // If you use non standard configuration, define your configuration
  if (h.uamip)
    chilliController.host = h.uamip;    // default: ?
  if (h.uamport)
    chilliController.port = h.uamport;  // default: 3990 

  // We choose 5 minutes because is the default interval of Chilli->Radius
  // accounting updates, and looks reasonable for busy sites (avoiding too
  // much load on the network infrastructure and servers) .
  chilliController.interval = 300;      // default: 30 seconds

  // then define event handler functions
  chilliController.onError  = handleErrors;
  chilliController.onUpdate = updateUI ;

  //  finally, get current state
  chilliController.refresh() ;

  function updateHeadings(clientState) {
    switch(clientState) {
      case chilliController.stateCodes.NOT_AUTH:
        document.getElementsByTagName('TITLE')[0].innerHTML =
        document.getElementById('headline').innerHTML       = 
            'Logged out from HotSpot';
        break;
      case chilliController.stateCodes.AUTH:
        document.getElementsByTagName('TITLE')[0].innerHTML =
        document.getElementById('headline').innerHTML       =
            'Logged in to HotSpot';
        break;
    }
  }

  // when the reply is ready, this handler function is called
  function updateUI( cmd ) {
    updateHeadings(chilliController.clientState);
    document.getElementById('userName').innerHTML = (
        chilliController.session.userName
    );
    document.getElementById('clientState').innerHTML = (
      formatStateCode(chilliController.clientState) 
    );
    document.getElementById('sessionTime').innerHTML = (
      chilliController.formatTime(
        chilliController.accounting.sessionTime, '0')
    );
    if (chilliController.session.sessionTimeout) {
      var timeLeft = Math.max(
        (
          chilliController.session.sessionTimeout -
          chilliController.accounting.sessionTime
        ),
          0 
      )
      document.getElementById('timeLeft').innerHTML = (
        chilliController.formatTime(timeLeft, 0) 
      );
    } else {
      document.getElementById('timeLeft').innerHTML = ''
    }
    var download_bytes = 
      chilliController.accounting.inputOctets +
      Math.pow(2, 32) * chilliController.accounting.inputGigawords; 
    var upload_bytes = 
      chilliController.accounting.outputOctets +
      Math.pow(2, 32) * chilliController.accounting.outputGigawords;    
    document.getElementById('download').innerHTML = (
      chilliController.formatBytes(download_bytes, 0)
    );
    document.getElementById('upload').innerHTML = (
      chilliController.formatBytes(upload_bytes, 0)
    );
    document.getElementById('interval').innerHTML = (
      chilliController.formatTime(chilliController.interval, 0)
    );
  }

  // If an error occurs, this handler will be called instead
  function handleErrors ( code ) {
    alert('The last contact with the Controller failed. Error code =' + code);
  }


}

