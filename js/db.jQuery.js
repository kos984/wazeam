
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
	 *  TODO: reinstall all tables when new script version !!!
	 */
	$.db = {
			// настройки по умолчанию
			_tables:{
				settings:{
					name:'settings',
					fields:['id REAL UNIQUE', 'key TEXT UNIQUE', 'type TEXT', 'value TEXT'],
					insertFieldsList:['key','type','value'],
					rowToObj:function(result,i){
						var key,val,type;
						if (result == null){
							key = this.data[i][0];
							val = this.data[i][2];
							type = this.data[i][1];
						} else {
							key = result.rows.item(i)['key'];
							val = result.rows.item(i)['value'];
							type = result.rows.item(i)['type'];
						}
						
						if (type == 'json'){
							try{
								val = $.parseJSON(val);	
							} catch(e){
								
							}
						}
						return {'key':key,'val':val};
					},
					data:[
						 	['timeCssPosition','json', '{"left":"20px","top":"20px"}'],
						 	['areaAlertCssPosition','json', '{"left":"20px","top":"20px"}'],
						 	//['logTimeAlert','json','{"time":"840","logged":"undefined"}'], //1010 need to delete !!!
						 	['logTimeConfirm','text','true'], // показывать или нет напоминание залогинеть время
						 	['logTimeConfirm_time','text','840'], // показывать или нет напоминание залогинеть время
						 	['logTimeConfirm_logged','text','undefined'], // показывать или нет напоминание залогинеть время
						 	['areaDivMessage','text','true'],
						 	['areaAlertMessage','text','true'],
						 	['showTimer','text','true'],
						 	['timeToRemainderRefresh','text','5'],
						 	['colorsCSSam','text','#900000'],
						 	['colorsCSSing','text','#000090'],
						 	['colorsCSSown','text','#008000']
						 ]
					},
				static_links:{
					name:'static_links',
					fields:['id REAL UNIQUE', 'key TEXT UNIQUE', 'link TEXT'],
					insertFieldsList:['key','link'],
					srtuct:{key:'key',val:'link'},
					rowToObj:function(result,i){
						if (result == null){
							return {'key':this.data[i][0],'val':this.data[i][1]};
						} else {
							return {'key':result.rows.item(i)['key'],'val':result.rows.item(i)['link']};
						}
					},
					data:[
		                    ['Aerial','https://docs.google.com/spreadsheet/viewform?formkey=dDFhcGpGNGdWWmRiTXMxa2tOS2RlYWc6MQ&amp;ifq'],
		                    ['Problematic','https://docs.google.com/spreadsheet/viewform?pli=1&amp;formkey=dDBlRk04X0hqdVFPZkU3VmZkNHFucVE6MQ#gid=0'],
		                    ['IGN bugs','https://docs.google.com/spreadsheet/viewform?formkey=dDRBT21CQ25QODdjMEg5SWtaU29SNUE6MQ']
	                    ]
					},
				cartouches:{
					name:'cartouches',
					fields:['id REAL UNIQUE', 'key TEXT UNIQUE', 'link TEXT'],
					insertFieldsList:['key','link'],
					srtuct:{key:'key',val:'link'},
					rowToObj:function(result,i){
						if (result == null){
							return {'key':this.data[i][0],'val':this.data[i][1]};
						} else {
							return {'key':result.rows.item(i)['key'],'val':result.rows.item(i)['link']};
						}
					},
					data:[
	                        ['old','http://www.waze.com/cartouche_old/'],
	                        ['new','http://www.waze.com/editor/'],
	                        ['beta','http://descartes.waze.com/beta/'],
	                        ['venues','http://descartes.waze.com/venues/']
	                        ]
					}
			},
			//=================================================================================================================================
			// return string
			_toJSON:function(obj){
				var json ='';
				for(var i in obj){
					if (typeof obj[i] !== 'function')
						json += (json == '') ? '':',';
						json += '"'+i+'":"'+obj[i]+'"';
				}
				return '{'+json+'}';
			},
			db_version:'1.09',
			// db object
			db:function(){
					var db = openDatabase("waze", "", "waze bd with setings and ...",30000);
					if(db.version != this.db_version){
						var _this = this;
						db.changeVersion(db.version, this.db_version, function(tx){
							var tables = _this._tables;
							for(var table in tables){
								if (tables[table]['name']){
									_this._createTable(tx,undefined,tables[table]['name']);	
								}
							}
						});
					}
					return db;
				},
			/**
			 * @depracated
			 * @param {Function} callback
			 */
			getOptions:function(callback){
				this.getData(this._tables.settings.name, callback);
			},
			/**
			 * @depracated
			 * @param {Function} callback
			 */
			getStaticLinks:function(callback){
				this.getData(this._tables.static_links.name, callback);
			},
			/**
			 * @depracated
			 * @param {Function} callback
			 */
			getCartouches:function(callback){
				this.getData(this._tables.cartouches.name, callback);
			},
			//===============================================================================================================================
			/**
			 * @param {String} table table name
			 */
			getDefaultData:function(table){
				var _this = $.db;
				var def = {};
				var tmp = undefined;
				for (var i =0, n = _this._tables[table].data.length; i<n; i++){
					tmp = _this._tables[table].rowToObj(null,i);
					def[tmp.key] = tmp.val;
				}
				return def;
			},
			//===============================================================================================================================
			/**
			 * @param {String} table table name
			 * @param {Function} callback function callback
			 */
			getData:function(table,callback){
				if (typeof callback !== 'function' || typeof table !== 'string') return;
				var _this = this;
				
				this.db().transaction(function(tx) {
					tx.executeSql("SELECT * FROM "+table, [],
						// table is exists 
						function (tx,result) { 
							var settings = {};
							var tmp = undefined;
							for(var i = 0, n = result.rows.length; i<n;i++){
								//TODO: key
								tmp = _this._tables[table].rowToObj(result,i);
								settings[tmp.key] = tmp.val;
							}
							callback(settings);
						},
						// table is not exists, create table and set default settings 
						function (tx, error) {
							
							_this._createTable(tx, error,table);
							
							var def = {};
							var tmp = undefined;
							for (var i =0, n = _this._tables[table].data.length; i<n; i++){
								tmp = _this._tables[table].rowToObj(null,i);
								def[tmp.key] = tmp.val;
							}
							callback(def);
						}
					);
				});
			},
			//===============================================================================================================================
			resetTableToDefault:function(table){
				this.db().transaction(function(tx) {
					_this._createTable(tx, null,table);
				});
			},
			//===============================================================================================================================
			/**
			 * @todo need to compate
			 */
			saveOptions:function(table,key,value,json,jkey){
				var _this = this;
				this.db().transaction(function(tx) {
					tx.executeSql("SELECT * FROM "+table+" WHERE key = ?",[key],function(ex,data){
						
						var val = (data.rows.lenght != 0)? _this._tables[table].rowToObj(data.rows(0)) : {'key':key,'val':value};
						
						if (json == true){
							var reg = new RegExp('/'+jkey+':[^,$]+/');
							val.replace(reg,jkey+':'+val);
						}
						
						if(data.rows.length == 0){
							tx.executeSql("INSERT INTO settings (key, type, value) values(?, ?, ?)",
									[i,type,val],null,null);
						} else {
							tx.executeSql("UPDATE settings SET value = ? WHERE key = ?",
									[val,i],null,null); 	
						}
					},
					function(tx, error){
						//TODO: может надо сразу обновлять а может и нет :)
						_this._createTable(tx, error,table);
					});
				});
			},
			//===============================================================================================================================
			/**
			 * srtuct:{key:'key',val:'link'},
			 */
			set:function(table,key,val){
				var _this = this;
				var srtuct = this._tables[table].srtuct;
				this.db().transaction(function(tx) {
					tx.executeSql("SELECT * FROM "+table+" WHERE "+srtuct.key+" = ?",[key],function(ex,data){
						if(data.rows.length == 0){
							var tmp =  _this._tables[table].insertFieldsList.join(', ');
							var query = "INSERT INTO "+table+"("+tmp+") values("+tmp.replace(/\w+/g,'?')+")";
							tx.executeSql(query,[key,val],null,null);
						} else {
							tx.executeSql("UPDATE "+table+" SET "+srtuct.val+" = ? WHERE "+srtuct.key+" = ?",
									[val],null,null); 	
						}
					},
					function(tx, error){
						console.log(tx, error);
					});
				});
			},
			//===============================================================================================================================
			/**
			 * @deprecated
			 * @param {object} options {key:{string|object}value};
			 */
			setOptions:function(options){
				var _this = this;
				for(var i in options){
					if(typeof options[i] !== 'function'){
						this.db().transaction(function(tx) {
							tx.executeSql("SELECT * FROM settings WHERE key = ?",[i],function(ex,data){
								var val ='';
								var type = 'text';
								if (typeof options[i] === 'string'){
									val = options[i];
								}else{
									val = _this._toJSON(options[i]);
									type = 'json';
								}

								if(data.rows.length == 0){
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
			 * @param {Object} tx
			 * @param {Object} error
			 * @param {String} table table name
			 */
			//===========================================================================================================================
			_createTable:function(tx,error,table){
				//drop table before add new data
				tx.executeSql("DROP TABLE IF EXISTS "+table,[],null,null);
				// create table
				tx.executeSql("CREATE TABLE "+table+"("+this._tables[table].fields.join(', ')+")", [], null,null);
				//tx.executeSql("CREATE TABLE settings(id REAL UNIQUE, key TEXT UNIQUE, type TEXT, value TEXT)",[],null,null);
				// appent default settings
				var tmp =  this._tables[table].insertFieldsList.join(', ');
				var query = "INSERT INTO "+table+"("+tmp+") values("+tmp.replace(/\w+/g,'?')+")";
				//for(var i =0, n = this._defaultCartouches.length; i<n;i++){
				//	tx.executeSql(query,this._defaultCartouches[i],null,null);
				//}
				//
				for(var i =0, n = this._tables[table].data.length; i<n;i++){
					tx.executeSql(query,this._tables[table].data[i],null,null);
				}
			}
			//===========================================================================================================================
	};
})(jQuery);

/*
var db = openDatabase("waze", "1.01", "waze bd with setings and ...",20000);
db.transaction(function(tx){
tx.executeSql("DROP TABLE IF EXISTS cartouches",[],null,null);
})
*/
/*
var db = openDatabase("waze", "1.01", "waze bd with setings and ...",20000);
db.transaction(function(tx){
tx.executeSql("DROP TABLE IF EXISTS cartouches",[],null,null);
tx.executeSql("DROP TABLE IF EXISTS settings",[],null,null);
tx.executeSql("DROP TABLE IF EXISTS static_links",[],null,null);
//tx.executeSql("CREATE TABLE settings(id REAL UNIQUE, key TEXT UNIQUE, type TEXT, value TEXT)",[],null,null);
})
*/