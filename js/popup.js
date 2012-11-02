
(function($){
	
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
		
//indus code :)
			chrome.tabs.getSelected(null, function(tab){
				try{
					var tmp = tab.url;
					var lat = /(?:lat=)(-?\d+(?:\.\d+)?)/.exec(tmp)[1];
					var lon = /(?:lon=)(-?\d+(?:\.\d+)?)/.exec(tmp)[1];
					$('#google_maps').attr('href','http://maps.google.com/maps?q='+lat+'+'+lon);
					$('#bing_maps').attr('href','http://www.bing.com/maps/?v=2&cp='+lat+'~'+lon+'&lvl=18&dir=0&sty=o&where1='+lat+'%2C%20'+lon+'&form=LMLTCC');
					$('#maps').show();
				}catch(e){
					$('#maps').hide();
				}
			});
		$('#google_maps').click(function(){
			try{
				chrome.tabs.getSelected(null, function(tab){ 
					var tmp = tab.url;
					var lat = /(?:lat=)(-?\d+(?:\.\d+)?)/.exec(tmp)[1];
					var lon = /(?:lon=)(-?\d+(?:\.\d+)?)/.exec(tmp)[1];
					chrome.tabs.create({url:'http://maps.google.com/maps?q='+lat+'+'+lon,
						index:tab.index+1});
				});
			} catch(e){
				console.log(e);
			}
			return false;
		});
		$('#bing_maps').click(function(){
			try{
				chrome.tabs.getSelected(null, function(tab){ 
					var tmp = tab.url;
					var lat = /(?:lat=)(-?\d+(?:\.\d+)?)/.exec(tmp)[1];
					var lon = /(?:lon=)(-?\d+(?:\.\d+)?)/.exec(tmp)[1];
					chrome.tabs.create({url:'http://www.bing.com/maps/?v=2&cp='+lat+'~'+lon+'&lvl=18&dir=0&sty=o&where1='+lat+'%2C%20'+lon+'&form=LMLTCC',
						index:tab.index+1});
				});
			} catch(e){
				console.log(e);
			}
			return false;
		});
// end indus code
		
	});
	//$('#body').slideDown('slow');
})(jQuery);