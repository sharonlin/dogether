// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "Notification.requestPermission" beforehand).
*/
function show(msg) {
  // var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  // var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  // var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.

	// popup.onclick = function() {
	// 	chrome.tabs.create({url : "popup.html"});
	// 	popup.cancel();
	// }

	function msg(){
		var notification = new Notification("DoGether", {body: "New test(s) assigned, please provide feedback", icon: "img.jpg" });
		// notification.onshow = function() { setTimeout(notification.close(), 15000); };
		notification.onclick = function(){
			window.open('http://myd-vm08561.hpeswlab.net:8787/ui/', '_blank');
			this.cancel();
		};
	}
	msg();

  // new Notification(hour + time[2] + ' ' + period, {
  //   // icon: '48.png',
  //   body: msg,
		// onClick: function () {
		// 	window.open('http://localhost:8100', '_blank');
		// }
  // });
}

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   // The display activation.
  localStorage.frequency = 1;        // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
}


var socket = io.connect('http://myd-vm08561.hpeswlab.net:8787');

// socket.on("hello",function(data){
// 	console.log(data.text);
// 	chrome.runtime.sendMessage({msg:"socket",text:data.text},function(response){});
// });
//
// socket.on("notify!",function(data){
// 	// console.log(data.text);
// 	debugger;
// 	// chrome.runtime.sendMessage({msg:"socket",text:data.text},function(response){});
// 	show(new Date());
// });

// chrome.runtime.onMessage.addListener(
// 	function(request,sender,senderResponse){
// 		if(request.msg==="notify!"){
// 			console.log("receive from socket server: "+request.text);
// 		}
// 	}
// );

socket.on("*",function(event,data) {
	debugger;
	console.log(event);
	console.log(data);
});

socket.on("notify!",function(data){
	debugger;
	if (data.email===localStorage['email']){
		show(data.msg);
	}else{
		console.log("User: " + data.email + " got message (filtered)");
	}

	// chrome.runtime.sendMessage({msg:"notify!"},function(response){});
});


// chrome.runtime.onMessage.addListener(
// 	function(request,sender,senderResponse){
// 		if(request.msg==="socket"){
// 			console.log("receive from socket server: "+request.text);
// 		}
// 	}
// );

 
// Test for notification support.
// if (window.Notification) {
//   // While activated, show notifications at the display frequency.
//   if (JSON.parse(localStorage.isActivated)) { show(); }
//
//   var interval = 0; // The display interval, in minutes.
//
//   setInterval(function() {
//     interval++;
//
//     if (
//       JSON.parse(localStorage.isActivated) &&
//         localStorage.frequency <= interval
//     ) {
//       show();
//       interval = 0;
//     }
//   }, 60000);
// }
