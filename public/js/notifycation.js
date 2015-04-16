$(function(){

	var notification_ids = [];

	function showNotifycation(data)
	{
		var icon_url = "";
		for (var row in data) {
			var notify = data[row];

			if ($.inArray(notify.notification.id, notification_ids) == -1) {
				notification_ids.push(notify.notification.id);

				if (window.webkitNotifications) { 
					var notifycation = window.webkitNotifications.createNotification(icon_url, notify.title, notify.body); 
					notifycation.show();
				} else if (window.Notification) {
					var notifycation = new Notification(notify.title, {
						body : notify.body,
					});
				}
				notifycation.onclick = function(){
					closeNotify(notify.notification.id);
				}
				notifycation.onclose = function(){
					closeNotify(notify.notification.id);
				}
			}

		}
	}

	function getNotifications()
	{
		setInterval(function(){
			$.ajax({
				url : "/public/notify",
				type : "post",
				dataType : "json",
				success : function(res){
					if (res.ret > 0 && res.data) {
						showNotifycation(res.data);
					}
				}
			});
		}, 10000);	
	}

	if (("Notification" in window) || window.webkitNotifications) {
		if (Notification) {
			if (Notification.permission !== "granted")
				Notification.requestPermission();	
		} else if (webkitNotifications) {
			if (webkitNotifications.checkPermission() !== 0)
				window.webkitNotifications.requestPermission();
		}
		getNotifications();
	} else {
		showNotSupport();
	}
});
