
(function($){
	
	/*function saveOptions(options){
		chrome.extension.sendRequest({method: "saveOprions",data:options}, function() {
			//$('body').cartouche(response);
		});
	}*/
	

	//var db = openDatabase("waze", "1.01", "waze bd with setings and ...",20000);
	$checkboxes = $('#checkboxes');
	
	$.db.getOptions(function(settings){
		var cheackboxes = [['timer','showTimer']];
		var getBindfunction = function(key){
			return function(){
				var data = {};
				data[key] = $(this).is(':checked')+'';;
				$.db.setOptions(data);
			};
		};
		for(var i = 0, n = cheackboxes.length; i<n;i++){
			$checkboxes.find('input[name='+cheackboxes[i][0]+']') //cheackboxes[i][0] = timer
				.bind('click.CartugeVipManagers',getBindfunction(cheackboxes[i][1])) //cheackboxes[i][1] = 'showTimer'
				.prop('checked',((settings[cheackboxes[i][1]] == 'true')?true:false));
		}
		/*$timer = $checkboxes.find('input[name=timer]')
			.bind('click.CartugeVipManagers',getBindfunction('showTimer'))
			.prop('checked',((settings.showTimer == 'true')?true:false));*/
		/*$timer = $checkboxes.find('input[name=timer]')
			.bind('click.CartugeVipManagers',function(){
				var val = $(this).is(':checked')+'';
				$.db.setOptions({showTimer:val});
			})
			.prop('checked',((settings.showTimer == 'true')?true:false));*/
		
	});
	
})(jQuery);