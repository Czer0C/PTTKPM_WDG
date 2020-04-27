import $ from 'jquery';

var intervalID = null;
var intervalTicketTable = null;

function doCountDown(sessionID) {
    if($('.bestsellers_item').length) {
        var timers = $('.bestsellers_item');
        var timer = $(timers);
        
        var target = timer.find('.deals_timer_box');

        var targetTime = target.data('target-time');
        
        // variables for time units
        var hours, minutes, seconds;

        var h = timer.find('.deals_timer_hr');
        var m = timer.find('.deals_timer_min');
        var s = timer.find('.deals_timer_sec');

        var str = targetTime.split(':');
                
        //
        hours = parseInt(str[0], 10);
        minutes = parseInt(str[1], 10);
        seconds = parseInt(str[2], 10);
        
        //
        if (seconds > 0) {
            seconds--;
        }					

        // hết thời gian
        if (hours === 0 && minutes === 0 && seconds === 0) {
            clearInterval(intervalID);
            timer.remove();
            $("#end").text("Đã kết thúc");
            $("#bid-now-btn").prop("disabled", true);
            updateStatusAuctionSession(sessionID);
            updateStatusTicket(sessionID);
            clearInterval(intervalTicketTable);
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
    }
}

export function initTimer(flag, sessionID = null) {
    if (flag === 1) {        
        intervalID = setInterval(doCountDown, 1000, sessionID);            
    }                                
    else if(flag === 0) {
        clearInterval(intervalID);
    }                       	    
}

export function bidBoxWork() {
    
    $(document).ready(function() {
        
        $("[data-value]").on("click", function() {
            var value = $(this).data("value");
            var input = $("#bid-value");
            var step = Number(input.data("step"));
            var min = Number(input.data("min"));
            var val = Number(input.val());

            val = value * step + val;

            if (val < min) {
                val = min;
            }
            input.val(val);
        });
                        

        var clickHandler = function(e) {
            var input = $("#bid-value");
            var sessionId = input.data("session");
            var bidVal = input.val();
            
            var obj = JSON.parse(localStorage.getItem("login"));
            
            if (obj && obj.access_token) {
                const { access_token } = obj;

                $.ajax(
                    {
                        method: 'PUT',
                        beforeSend: function(req) {
                            req.setRequestHeader("Authorization", `Bearer ${access_token}`);
                        },
                        url: '/bid/updateAuctionSession/'+sessionId+'/'+bidVal,
                        success: function(data) {
                            $("#bid-now-btn").one("click", clickHandler);
                            initTimer(0);
                            $(".deals_timer_box").data("target-time", data.bidTime);
                            const timer = data.bidTime;
                            const str = timer.split(":");
                            $(".deals_timer_hr").text(str[0]);
                            $(".deals_timer_min").text(str[1]);
                            $(".deals_timer_sec").text(str[2]);
                            $("#current-price").text(data.currentPrice);
                            $("#bid-value").val(data.currentPrice);
                            $("#bid-value").data("min", data.currentPrice);
                            initTimer(1, sessionId);
                        },
                        complete: function(e) {                        
                            //const key = JSON.parse(localStorage.getItem("login"));                
                            const { username } = obj;
                            $.ajax({
                                method: 'POST',
                                beforeSend: function(req) {
                                    req.setRequestHeader("Authorization", `Bearer ${access_token}`);
                                },
                                url: '/bid/createAuctionTicket',             
                                data: {
                                    sessionID: sessionId,
                                    accountID: username,
                                    bidValue: bidVal,
                                    bidTime: Date.now(),
                                    status: 0
                                },
                                success: function(result) {
                                    $("#bid-now-btn").one("click", clickHandler);
                                    if (!result.success) {
                                        alert("Server Error");
                                    }
                                    else {
                                        $("#history-table tbody").prepend(
                                            "<tr>"+
                                                "<td>"+result.data.accountID+"</td>"+
                                                "<td>"+result.data.bidValue+"</td>"+
                                                "<td>"+result.data.bidTime+"</td>"+
                                            "</tr>"
                                        );
                                    }
                                }
                            });
                        }
                    }
                );
                e.stopImmediatePropagation();
                return false;
            }            
        }

        $("#bid-now-btn").one("click", clickHandler)         
    });    
}

export function refreshAuctionTicketTable(flag, sessionID = null) {    
    if (flag === 1) {
        intervalTicketTable = setInterval(function() {
            var obj = JSON.parse(localStorage.getItem("login"));

            if (obj && obj.access_token && sessionID) {
                const { access_token } = obj;
                $.ajax({
                    method: 'GET',
                    beforeSend: function(req) {
                        req.setRequestHeader("Authorization", `Bearer ${access_token}`);
                    },
                    url: `/bid/getAuctionTicket/${sessionID}`,
                    success: function(data) {
                        // populate html here to update ticket table
                        var tbody = '';                        
                        data.map(item => {
                            tbody += "<tr>"+
                                "<td>"+item.accountID+"</td>"+
                                "<td>"+item.bidValue+"</td>"+
                                "<td>"+item.bidTime+"</td>"+
                            "</tr>"
                        })
                        $("#history-table tbody").html(tbody);
                    }
                });
            }            
        }, 4000, sessionID);
    }
    else if (flag === 0) {
        clearInterval(intervalTicketTable);
    }
}

function updateStatusAuctionSession(sessionID) {
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

function updateStatusTicket(sessionID) {            
    var obj = JSON.parse(localStorage.getItem("login"));
    var winner = '';

	if (obj && obj.access_token) {
        const { access_token, username } = obj;

        // kiểm tra người thắng
        $.ajax({
            method: 'GET',
            beforeSend: function(req) {
				req.setRequestHeader("Authorization", `Bearer ${access_token}`);
            },
            url: `/bid/getWinner/${sessionID}`,
            success: function(data) {
                if (data && data.accountID === username) {
                    winner = data.accountID
                }                
            },
            complete: function() {
                $.ajax({
                    method: 'PUT',
                    beforeSend: function(req) {
                        req.setRequestHeader("Authorization", `Bearer ${access_token}`);
                    },
                    url: '/bid/updateAuctionTicketStatus',
                    data: { accID: winner, ssID: sessionID }
                });
            }
        });        
    }
}