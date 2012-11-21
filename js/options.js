(function($){
	
	var resetStaticLinks = function(){
		$.db.getStaticLinks(function(links){
			var str = '';
			for(var key in links){
				var link = links[key];
				if ( typeof link !== 'string' ){
					continue;
				}
				str+= "<li><label>Text: <input name='key' type='text' value='"+key+"' required /></label> "+
				"<label>link: <input name='val' type='url' value='"+link+"' required pattern='https?://.+' /></label>"+
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
	$('form[name=usersLinks]').data('table','static_links');
	
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
				str+= "<li><label>Text: <input name='key' type='text' value='"+key+"' required /></label> "+
				"<label>link: <input type='url' name='val' value='"+link+"' required pattern='https?://.+' /></label>"+
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
	$('form[name=cartouche]').data('table','cartouches');
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

	//reset form
	$('form').on('click.reset','input[name=reset]',function(event){
		try{
			$(this).parents('form').data('reset')();	
		}catch(e){
			console.log(e);
		}
		return false;
	});
	//default form
	$('form').on('click.default','input[name=default]',function(event){
		try{
			$.db.resetTableToDefault($(this).parents('form').data('table'));
			$(this).parents('form').data('reset')();	
		}catch(e){
			console.log(e);
		}
		return false;
	});
	//update row
	$('form[name=usersLinks],form[name=cartouche]').on('click.updateRow','input[name=update_row]',function(){
		var table = $(this).parents('form').data('table');
		var $li = $(this).parents('li');
		var key = $li.find('input[name=key]').val();
		var val = $li.find('input[name=val]').val();
		$.db.set(table,key,val);
		$li.append('<span class="saved">saved</span>');
		$li.find('.saved').animate({'opacity':'0'},1000,function(){
			$(this).remove();
		});
	});
	//delete row
	$('form[name=usersLinks],form[name=cartouche]').on('click.delete','input[name=delete]',function(){
		if(!confirm('Are you sure?')) return false;
		var table = $(this).parents('form').data('table');
		var $li = $(this).parents('li');
		var key = $li.find('input[name=key]').val();
		$.db.del(table,key);
		$li.hide('slow',function(){
			$(this).remove();
		});
		return false;
	});
	
	
	$('#time').change(function(e){
		var v = parseInt(this.value);
		var h = parseInt(v / 60);
		if (h < 10) h = '0'+h;
		var m = v % 60;
		if (m < 10) m = '0'+m;
		$(this).parent().next().html(h+':'+m);
	});
	
	//
	$.db.getOptions(function(options){
		var $inputs = $('#script_options label input').bind('change.kos',function(){
			var $this = $(this);
			var name = $this.attr('name');
			var val = $this.val();
			var opt = {};
			opt[name] = val;
			$.db.setOptions(opt);
		});
		var $input = undefined;
		for(var i =0, n = $inputs.length; i<n;i++){
			$input = $($inputs.get(i));
			var name = $input.attr('name');
			try{
				$input.val(options[name]);	
			}catch(e){
				
			}
		}
	});
	//
	$('#script_options input[name="reset_row"]').bind('click.kos',function(){
		var $input  = $(this).parents('li').find('label input');
		var name = $input.attr('name');
		var opt = {};
		try{
			var options = $.db.getDefaultData('settings');
			opt[name] = options[name];
			$input.val(opt[name]);
			$.db.setOptions(opt);
		}catch(e){
			
		}
	});
	
	
})(jQuery);
