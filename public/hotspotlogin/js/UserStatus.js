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

  // chilliController.debug = true;

  // If you use non standard configuration, define your configuration
  if (h.uamip)
    chilliController.host = h.uamip;    // default: 192.168.182.1
  if (h.uamport)
    chilliController.port = h.uamport;  // default: 3990 

  // We choose 5 minutes because is the default interval of Chilli->Radius
  // accounting updates, and looks reasonable for busy sites (avoiding too
  // much load on the network infrastructure and servers) .
  chilliController.interval = h.updateInterval || 300;  // default = 30

  // then define event handler functions
  chilliController.onError  = handleErrors;
  chilliController.onUpdate = updateUI ;

  // get current state
  chilliController.refresh() ;

  function updateHeadings(clientState) {
    txt = null;
    switch(clientState) {
      case chilliController.stateCodes.NOT_AUTH:
        txt = 'Logged out from HotSpot';
        break;
      case chilliController.stateCodes.AUTH:
        txt = 'Logged in to HotSpot';
        break;
    }
    if (txt) {
      document.title = txt;
      if (document.getElementById('headline')) 
        document.getElementById('headline').innerHTML = txt;
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

