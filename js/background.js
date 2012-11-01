var settings = {};
	//CREATE BD AND SET DEFAULT PARAMETRS
	var db = openDatabase("waze", "1.01", "waze bd with setings and ...",20000);
	db.transaction(function(tx) {
		tx.executeSql("SELECT COUNT(*) FROM settings", [],
			// table is exists 
			function (tx,result) { 
				//alert('dsfsdf') 
			},
			// table is not exists, create table and set default settings 
			function (tx, error) {
				tx.executeSql("CREATE TABLE settings (id REAL UNIQUE, key TEXT UNIQUE, type TEXT, value TEXT)", [], null, null);
				tx.executeSql("INSERT INTO settings (key, type, value) values(?, ?, ?)", 
					["timeCssPosition",'json', '{\'left\':\'20px\',\'top\':\'20px;\'}']
					, null, null);
			}
		);
	});
	
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var db = openDatabase("waze", "1.01", "waze bd with setings and ...",20000);
	
	switch(request.method){
		case 'getSettingsCartouche':{
			db.transaction(function(tx) {
				tx.executeSql("SELECT * FROM settings", [],
					// table is exists 
					function (tx,result) { 
						//alert('dsfsdf')
						var settings = {};
						for(var i = 0, n = result.rows.length; i<n;i++){
							if (result.rows.item(i)['type'] == 'json'){
								settings[result.rows.item(i)['key']] = $.parseJSON(result.rows.item(i)['value']);
							}
						}
						sendResponse(settings);//{'timeout': 2000});
					},
					// table is not exists, create table and set default settings 
					function (tx, error) {
						sendResponse({});
					}
				);
			});
		}
		case 'saveOprions':{
			if(!request.data) return;
			for(var i in request.data){
				if(typeof request.data[i] !== 'function'){
					db.transaction(function(tx) {
						tx.executeSql("UPDATE settings SET value = "+ request.data[i] +" WHERE key = "+i,[],null,null);
					});
				}
			}
			//if(request.data)
		}
	} // end switch;

});