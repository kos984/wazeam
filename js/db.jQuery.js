(function($){
	/**
	 * user api
	 * 
	 * getOptions {Function}
	 * @param {Function} callback
	 * 
	 * setOptions {Function}
	 * @param {object} options {key:{string|object}value};
	 * 
	 * query
	 * @todo
	 *  
	 */
	$.db = {
			// настройки по умолчанию
			_defaultOptions:[
							 	['timeCssPosition','json', '{"left":"20px","top":"20px"}'],
							 	['areaAlertCssPosition','json', '{"left":"20px","top":"20px"}'],
							 	['logTimeAlert','json','{"time":"1010","enabled":"true","logged":"undefined"}'],
							 	['areaDivMessage','text','true'],
							 	['areaAlertMessage','text','true'],
							 	['showTimer','text','true'],
							 	['timeToRemainderRefresh','text','5']
							 ],
			// возвращает настройки по умолчанию в виде обйекта
			_getDefaultOptions:function(){
				var options = {};
				for(var i=0, n = this._defaultOptions.length, optionsArr = this._defaultOptions; i<n;i++){
					if (optionsArr[i][1] == 'json'){
						options[optionsArr[i][0]] = $.parseJSON(optionsArr[i][2]);
					} else {
						options[optionsArr[i][0]] = optionsArr[i][2];
					}
				}
				return options;
			},
			// return strig
			_toJSON:function(obj){
				var json ='';
				for(var i in obj){
					if (typeof obj[i] !== 'function')
						json += (json == '') ? '':',';
						json += '"'+i+'":"'+obj[i]+'"';
				}
				return '{'+json+'}';
			},
			// db object
			db:openDatabase("waze", "1.01", "waze bd with setings and ...",20000),
			/**
			 * 
			 * @param {Function} callback
			 */
			getOptions:function(callback){
				if (typeof callback !== 'function') return;
				var _this = this;
				this.db.transaction(function(tx) {
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
							callback(settings);
							//$timer.prop('checked',((settings.showTimer == 'true')?true:false));
						},
						// table is not exists, create table and set default settings 
						function (tx, error) {
							_this._createSettingsTable(tx, error);
							callback(_this._getDefaultOptions());
						}
					);
				});
			},
			/**
			 * 
			 * @param {object} options {key:{string|object}value};
			 */
			setOptions:function(options){
				var _this = this;
				for(var i in options){
					if(typeof options[i] !== 'function'){
						this.db.transaction(function(tx) {
							tx.executeSql("SELECT * FROM settings WHERE key = ?",[i],function(ex,data){
								var val ='';
								var type = 'text';
								if (typeof options[i] === 'string'){
									val = options[i];
								}else{
									val = _this._toJSON(options[i]);
									type = 'json';
								}

								if(data.rows.lenght == 0){
									tx.executeSql("INSERT INTO settings (key, type, value) values(?, ?, ?)",
											[i,type,val],null,null);
								} else {
									tx.executeSql("UPDATE settings SET value = ? WHERE key = ?",
											[val,i],null,null); 	
								}
							},
							function(tx, error){
								//TODO: может надо сразу обновлять а может и нет :)
								_this._createSettingsTable(tx, error);
							});
						});
					}
				}
			},
			/**
			 * 
			 * @param {String} query
			 * @param {Function} callback
			 */
			query:function(query,callback){
				// TODO: надо зделать выполнение запросов
			},
			/**
			 * create table settings in db and add default settings
			 * @param tx
			 * @param error
			 */
			_createSettingsTable:function(tx, error){
				//drop table before add new data
				tx.executeSql("DROP TABLE IF EXISTS settings",[],null,null);
				// create table
				tx.executeSql("CREATE TABLE settings (id REAL UNIQUE, key TEXT UNIQUE, type TEXT, value TEXT)", [], null, null);
				// appent default settings
				for(var i =0, n = this._defaultOptions.length; i<n;i++){
					tx.executeSql("INSERT INTO settings (key, type, value) values(?, ?, ?)",
							this._defaultOptions[i],null,null);
				}
			}
	};
})(jQuery);