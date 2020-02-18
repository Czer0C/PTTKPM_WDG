import $ from 'jquery';

var intervalID = null;

export function timer(flag, sessionID = null) {
    if (flag === 1) {
        doTimer(sessionID);    
    }                                
    else if(flag === 0) {
		//console.log(intervalID);
        for (let i = 1; i < intervalID; i++) {
			clearInterval(i);
		}
    }                       	    
}

function updateStatus(sessionID) {
	var obj = JSON.parse(localStorage.getItem("login"));

	if (obj && obj.access_token && sessionID) {
		const { access_token } = obj;		
		$.ajax({
			method: 'PUT',
			beforeSend: function(req) {
				req.setRequestHeader("Authorization", `Bearer ${access_token}`);
			},
			url: '/auction/updateStatusAuctionSession',
			data: { ssID: sessionID }
		});
	}	
}

function doTimer(sessionID) {
		
	if($('.bestsellers_item').length)
	{
		var timers = $('.bestsellers_item');
		timers.each(function()
		{
			var timer = $(this);
			
			var target = timer.find('.deals_timer_box');

			var targetTime = target.data('target-time');
			
			// variables for time units
			var hours, minutes, seconds;

			var h = timer.find('.deals_timer_hr');
			var m = timer.find('.deals_timer_min');
			var s = timer.find('.deals_timer_sec');							

			

			intervalID = setInterval(function ()
			{					
				var str = targetTime.split(':');
				
				//
				hours = parseInt(str[0], 10);
				minutes = parseInt(str[1], 10);
				seconds = parseInt(str[2], 10);
				
				//
				if (seconds > 0) {
					seconds--;
				}					

				//
				if (hours === 0 && minutes === 0 && seconds === 0) {
					clearInterval(intervalID);
					timer.remove();
					updateStatus(sessionID);
				}

				if (seconds === 0 && minutes > 0) {
					seconds = 59;
					minutes--;
				}
				if (minutes === 0 && hours > 0) {
					minutes = 59;
					hours--;
				}

				if (seconds < 10) {
					seconds = '0' + seconds;
				}
				if (minutes < 10) {
					minutes = '0' + minutes;
				}
				if (hours < 10) {
					hours = '0' + hours;
				}					
				
				// display results
				h.text(hours);
				m.text(minutes);
				s.text(seconds); 
				
				targetTime = `${hours+':'+minutes+':'+seconds}`;
				target.data('target-time', targetTime);
			}, 1000);
		});	
	}	
}