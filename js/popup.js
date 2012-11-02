
(function($){
	
	/*function saveOptions(options){
		chrome.extension.sendRequest({method: "saveOprions",data:options}, function() {
			//$('body').cartouche(response);
		});
	}*/
	

	//var db = openDatabase("waze", "1.01", "waze bd with setings and ...",20000);
	$checkboxes = $('#checkboxes');
	
	$.db.getOptions(function(settings){
		var cheackboxes = [
		                   //cheackbox name, option name
		                   ['timer','showTimer'],
		                   ['area','areaDivMessage'],
		                   ['alert','areaAlertMessage'],
		                   ['logTime','logTimeAlert']
		                   ];
		var getBindfunction = function(key){
			return function(){
				var data = {};
				data[key] = $(this).is(':checked')+'';;
				$.db.setOptions(data);
				
				chrome.tabs.executeScript(
						//null, {code:"var el = document.getElementById('"+key+"'); if(!el)return; console.log("+data[key]+",('"+data[key]+"'!='true')); el.style.display = ('"+data[key]+"'!='true')?'none':'block'"});
						null, {code:"console.log("+data[key]+",('"+data[key]+"'!='true')); if('"+data[key]+"'!='true'){$('#"+key+"').addClass('kos_hide');}else{$('#"+key+"').removeClass('kos_hide');}"});
				
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