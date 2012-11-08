(function($){
	
	var resetStaticLinks = function(){
		$.db.getStaticLinks(function(links){
			var str = '';
			for(var key in links){
				var link = links[key];
				if ( typeof link !== 'string' ){
					continue;
				}
				str+= "<li><label>Text: <input type='text' value='"+key+"' required /></label> "+
				"<label>link: <input type='url' value='"+link+"' required pattern='https?://.+' /></label>"+
				"<input type='button' name='delete' value='delete'/>"+
				"<input type='button' name='update_row' value='update'/></li>";
			}
			$('form[name=usersLinks] ul').html(function(){
				var html = str;
				return html;
			});
		});
	};
	$('form[name=usersLinks]').data('reset',resetStaticLinks);
	resetStaticLinks();
	
	//==================================================================================================================================
	
	var resetCartoucheLinks = function(){
		$.db.getCartouches(function(links){
			var str = '';
			for(var key in links){
				var link = links[key];
				if ( typeof link !== 'string' ){
					continue;
				}
				str+= "<li><label>Text: <input type='text' value='"+key+"' required /></label> "+
				"<label>link: <input type='url' value='"+link+"' required pattern='https?://.+' /></label>"+
				"<input type='button' name='delete' value='delete'/>"+
				"<input type='button' name='update_row' value='update'/></li>";
			}
			$('form[name=cartouche] ul').html(function(){
				var html = str;
				return html;
			});
		});
	};
	$('form[name=cartouche]').data('reset',resetCartoucheLinks);
	resetCartoucheLinks();
	//==================================================================================================================================
	
	
	//add new row 
	$('form').on('click.add','input[name=add]',function(event){
		$li = $($(this).parent().find('li').get(0)).clone().hide();
		$li.find('input:not([type=button])').val('');
		$(this).parent().find('ul').append($li);
		$li.show('slow');
		return false;
	});

	//delete row 
	$('form').on('click.delete','input[name=delete]',function(event){
		$(this).parents('li').hide('slow',function(){
			$(this).remove();
		});
		return false;
	});
	
	//reset form
	$('form').on('click.reset','input[name=reset]',function(event){
		$(this).parents('form').data('reset')();
		return false;
	});
})(jQuery);
