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
			_defaultOptions:[ // table settings
							 	['timeCssPosition','json', '{"left":"20px","top":"20px"}'],
							 	['areaAlertCssPosition','json', '{"left":"20px","top":"20px"}'],
							 	['logTimeAlert','json','{"time":"1010","enabled":"true","logged":"undefined"}'],
							 	['areaDivMessage','text','true'],
							 	['areaAlertMessage','text','true'],
							 	['showTimer','text','true'],
							 	['timeToRemainderRefresh','text','5']
							 ],
			_defaultStaticLink:[ // table static_links
			                    ['Aerial','https://docs.google.com/spreadsheet/viewform?formkey=dDFhcGpGNGdWWmRiTXMxa2tOS2RlYWc6MQ&amp;ifq'],
			                    ['Problematic','https://docs.google.com/spreadsheet/viewform?pli=1&amp;formkey=dDBlRk04X0hqdVFPZkU3VmZkNHFucVE6MQ#gid=0'],
			                    ['IGN bugs','https://docs.google.com/spreadsheet/viewform?formkey=dDRBT21CQ25QODdjMEg5SWtaU29SNUE6MQ']
		                    ],
		    _defaultCartouches:[
		                        ['old','http://www.waze.com/cartouche_old/'],
		                        ['new','http://www.waze.com/editor/'],
		                        ['beta','http://descartes.waze.com/beta/'],
		                        ['venues','http://descartes.waze.com/venues/']
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
			db:openDatabase("waze", "1.01", "waze bd with setings and ...",30000),
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
							/*if (_this._defaultOptions.length != result.rows.length){
								_this._createSettingsTable(tx, error);
								callback(_this._getDefaultOptions());
								return;
							}*/
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
			 */
			getStaticLinks:function(callback){
				if (typeof callback !== 'function') return;
				var _this = this;
				this.db.transaction(function(tx) {
					tx.executeSql("SELECT * FROM static_links", [],
						// table is exists 
						function (tx,result) { 
							/*if (_this._defaultOptions.length != result.rows.length){
								_this._createSettingsTable(tx, error);
								callback(_this._getDefaultOptions());
								return;
							}*/
							var settings = {};
							for(var i = 0, n = result.rows.length; i<n;i++){
								var key = result.rows.item(i)['key'];
								var val = result.rows.item(i)['link'];
								settings[key] = val;
							}
							callback(settings);
						},
						// table is not exists, create table and set default settings 
						function (tx, error) {
							_this._createStaticLinksTable(tx, error);
							
							var def = {};
							for (var i =0, n = _this._defaultStaticLink.length; i<n; i++){
								def[_this._defaultStaticLink[i][0]] = _this._defaultStaticLink[i][1];
							}
							callback(def);
						}
					);
				});
			},
			/**
			 * 
			 */
			getCartouches:function(callback){
				
				if (typeof callback !== 'function') return;
				var _this = this;
				
				this.db.transaction(function(tx) {
					tx.executeSql("SELECT * FROM cartouches", [],
						// table is exists 
						function (tx,result) { 
						//callback('11');
							var settings = {};
							for(var i = 0, n = result.rows.length; i<n;i++){
								var key = result.rows.item(i)['key'];
								var val = result.rows.item(i)['link'];
								settings[key] = val;
							}
							callback(settings);
						},
						// table is not exists, create table and set default settings 
						function (tx, error) {
							//callback('22');
							
							_this._createCartouchesTable(tx, error);
							
							var def = {};
							for (var i =0, n = _this._defaultCartouches.length; i<n; i++){
								def[_this._defaultCartouches[i][0]] = _this._defaultCartouches[i][1];
							}
							callback(def);
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
			},
			_createStaticLinksTable:function(tx,error){
				//drop table before add new data
				tx.executeSql("DROP TABLE IF EXISTS static_links",[],null,null);
				// create table
				tx.executeSql("CREATE TABLE static_links (id REAL UNIQUE, key TEXT UNIQUE, link TEXT)", [], null, null);
				// appent default settings
				for(var i =0, n = this._defaultStaticLink.length; i<n;i++){
					tx.executeSql("INSERT INTO static_links (key, link) values(?, ?)",
							this._defaultStaticLink[i],null,null);
				}
			},
			_createCartouchesTable:function(tx,error){
				//drop table before add new data
				tx.executeSql("DROP TABLE IF EXISTS cartouches",[],null,null);
				// create table
				tx.executeSql("CREATE TABLE cartouches (id REAL UNIQUE, key TEXT UNIQUE, link TEXT)", [], null, null);
				// appent default settings
				for(var i =0, n = this._defaultCartouches.length; i<n;i++){
					tx.executeSql("INSERT INTO cartouches (key, link) values(?, ?)",
							this._defaultCartouches[i],null,null);
				}
			}
	};
})(jQuery);


//var db = openDatabase("waze", "1.01", "waze bd with setings and ...",20000);
//db.transaction(function(tx){
//tx.executeSql("DROP TABLE IF EXISTS cartouches",[],null,null);
//})