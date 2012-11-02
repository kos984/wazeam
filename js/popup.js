
(function($){
	
	/*function saveOptions(options){
		chrome.extension.sendRequest({method: "saveOprions",data:options}, function() {
			//$('body').cartouche(response);
		});
	}*/
	
	$checkboxes = $('#checkboxes');
	$timer = $checkboxes.find('input[name=timer]').bind('click.CartugeVipManagers',function(){
		alert('hello');
	});
	
	var db = openDatabase("waze", "1.01", "waze bd with setings and ...",20000);
	
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM settings", [],
			// table is exists 
			function (tx,result) { 
				//alert('dsfsdf')
				var settings = {};
				for(var i = 0, n = result.rows.length; i<n;i++){
					var key = result.rows.item(i)['key'];
					var val = result.rows.item(i)['value'];
					if (result.rows.item(i)['type'] == 'json'){
						try{
							settings[key] = $.parseJSON(val);	
						} catch(e){
							
						}
					} else {
						settings[key] = val;	
					}
				}
				$timer.prop('checked',((settings.showTimer == 'true')?true:false));
			},
			// table is not exists, create table and set default settings 
			function (tx, error) {
				createSettingsTable(tx, error);
			}
		);
	});
	
})(jQuery);