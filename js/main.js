//test pages:
//https://descartesw.waze.com/beta/?zoom=7&lat=25.66934&lon=-100.38657&marker=true&layers=BFTFTTTFTTFTTTTFTTTTFT&segments=176820080  
//https://world.waze.com/editor/?zoom=5&lat=19.02162&lon=-98.82437&layers=BFTFTTTFTTFTTTTFTTTTFT&segments=162329876

//alert('sdfsdf');

(function($){
	//here my widget
	console.log($.widget);
	$.widget("kos.cartouche", {
		// настройки по умолчанию
		options: { 
			timeout: 500,
			vipCssClass:'kos_vip_',
			ingCssClass:'kos_ign_',
			wazeTimer:undefined,
			num:1
		},
		// инициализация widget
		// вносим изменения в DOM и вешаем обработчики
		_create: function() {
			(function(_this){
				_this.options.wazeTimer = window.setInterval(function(){
					//console.log(_this.options.num++);
					_this.checkArea(_this);
				}, _this.options.timeout);
			})(this);
			this.element.on("click."+this.eventNamespace, function(){
				console.log("click");
				
				});
//			this.element;   // искомый объект в jQuery обёртке
//			this.name;      // имя - expose
//			this.namespace; // пространство – book
//			this.element.on("click."+this.eventNamespace, function(){
//			console.log("click");
//			});
		},
		// метод отвечает за применение настроек
		_setOption: function( key, value ) {
		// применяем изменения настроек
		this._super("_setOption", key, value );
		},
		// метод _destroy должен быть антиподом к _create
		// он должен убрать все изменения внесенные изменения в DOM
		// и убрать все обработчики, если таковые были
		_destroy: function() {
			//this.element.unbind('.'+this.eventNamespace);
		},
		// my methods
		checkArea:function(_this){
			options = _this.options;
			var elems = this.element.find('div[id=updatedBy]');
			var elem;
			var arr;
			var regExpArr = /(<span[^>]*>)?(\w+\(\d+\))/g;
			//var arr = str.html().match(/(<span[^>]*>)(\w+\(\d+\))/g);
			for(var i = 0, n = elems.length; i<n;i++){
				elem = $(elems.get(i));
				while(arr = regExpArr.exec(elem.html())){
					
				}
				// get ["dark_lobito(4)", undefined, "dark_lobito(4)"]
				// or ["dark_lobito(4)", <span[^>]*>, "dark_lobito(4)"]
				if (arr && arr[1]) // if we get span
				{
					//test class name
					if(arr[1].indexOf(options.vipCssClass) > 0 || arr[1].indexOf(options.ingCssClass) > 0){
						//console.log(arr[1].indexOf(options.vipCssClass),arr[1].indexOf(options.ingCssClass));
						continue;
					}
				}
				//add span
				var test_vip = arr[2].match(/\w+/)[0];
				if (_this.vip[test_vip]){
					elem.html(function(){ return $(this).html().replace(arr[2],'<span class='+_this.options.vipCssClass+'>'+arr[2]+'</span>'); });
				}else if (_this.ign[test_vip]){
					elem.html(function(){ return $(this).html().replace(arr[2],'<span class='+_this.options.ignCssClass+'>'+arr[2]+'</span>'); });
				}
			}
	
			//console.log(str);
			//clearInterval(options.wazeTimer);
		},
		///////-----------------
		vip : { "AlanOfTheBerg":1080788, "1080788":"AlanOfTheBerg",
				"andrewfatcat":63041, "63041":"andrewfatcat",
				"anthyz":984495,"984495":"anthyz", 
				"arl16":73788, "73788":"arl16",
				"azdude":1309495,"1309495":"azdude",
				"banished":63728,"63728":"banished", 
				"bmcutright":927829, "927829":"bmcutright",
				"CBenson":1219367, "1219367":"CBenson", 
				"dcm684":58610, "58610":"dcm684",
				"djboddy":82367, "82367":"djboddy",
				"domino":26113,"26113":"domino",
				"dsposter":1122125, "1122125":"dsposter",
				"Elgirts":123242,"123242":"Elgirts",
				"elsgk123":1142872, "1142872":"elsgk123",
				"filpaul":966821,"966821":"filpaul",
				"FrisbeeDog":126521, "126521":"FrisbeeDog", 
				"GapSpanner":1161269,"1161269":"GapSpanner",
				"gettingthere":1223327, "1223327":"gettingthere",
				"GizmoGuy411":1152091, "1152091":"GizmoGuy411",
				"hallmike":195132,"195132":"hallmike",		//?zoom=6&lat=38.31188&lon=-88.92392&segments=15373623
				"harling":1198829, "1198829": "harling", 
				"HavanaDay":1090672,"1090672":"HavanaDay",
				"Jallen":1137356, "1137356":"Jallen",
				"jernigan007":1110006, "1110006":"jernigan007",
				"JMunakra":65852, "65852":"JMunakra",
				"jondrush":52508, "52508":"jondrush",
				"jrhamilt":1108188, "1108188":"jrhamilt",
				"jspanos":950523,"950523":"jspanos",
				"jtinge":128295,"128295":"jtinge", 
				"jzoch":52112, "52112":"jzoch",
				"kpsheeha":1, 
				"kyleg1":85027, "85027":"kyleg1",
				"latoso58":1231363, "1231363":"latoso58",
				"Lemon":46480, "46480":"Lemon",
				"mapcat":1311930,"1311930":"mapcat",
				"mdqueenz":128080,"128080":"mdqueenz",
				"MisterAsterix":144936,"144936": "MisterAsterix",
				"mizter6":885243, "885243":"mizter6",		//?zoom=7&lat=33.74827&lon=-117.83447&segments=6829571
				"muchski":52422, "52422":"muchski",
				"Nacron":60160, "60160":"Nacron",		//?zoom=7&lat=28.3541&lon=-81.62531&segments=63705818
				"obsolete29":972239,"972239":"obsolete29",
				"OscarC":111406,"111406": "OscarC",
				"puhsitch":1033013, "1033013":"puhsitch",
				"QuickOK":80173, "80173":"QuickOK",
				"RallyChris":40635, "40635":"RallyChris",
				"russellvt":908811, "908811":"russellvt",
				"stangoodman":1048466,"1048466":"stangoodman",
				"svance92":89475, "89475":"svance92",
				"the1who":1152501, "1152501":"the1who",
				"ttownfeen":913931,"913931": "ttownfeen",
				"UnderDog28":1067767,"1067767":"UnderDog28",	//?zoom=5&lon=-83.7610893249512&lat=32.1241722106934&segments=12015566
				"unwallflower":872572, "872572": "unwallflower",
				"veewonwon":1527009, "1527009":"veewonwon",
				"voip":987394, "987394":"voip",			//?zoom=7&lat=45.57698&lon=-73.61367&segments=60621010
				"Wizird":1022751,"1022751":"Wizird", 
				"WeeeZer14":758882, "758882":"WeeeZer14",	//?zoom=5&lat=35.21406&lon=-84.86878&segments=62279449
				"xbassman":1085909,"1085909":"xbassman",
				"Gfiles":81889,"81889":"Gfiles",// new 
				"kufi":11549236,"11549236":"kufi",
				"nestum":11029033,"11029033":"nestum",
				"liponcio":13307086,"13307086":"liponcio",
				"mfigueiredo":13231773,"13231773":"mfigueiredo",
				"davipt":11154458,"11154458":"davipt",
				"barbosap":12050603,"12050603":"barbosap",
				"Toni-5":10652276,"10652276":"Toni-5",
				"patitoman":10862614,"10862614":"patitoman",
				"viktor89":10992632,"10992632":"viktor89",
				"Nicatman":10253927,"10253927":"Nicatman",
				"Ishero":10389431,"10389431":"Ishero",
				"jmmo20":11653397,"11653397":"jmmo20",
				"elies":10215650,"10215650":"elies",
				"vintxi":11033431,"11033431":"vintxi",
				"TomYXP":11269947,"11269947":"TomYXP",
				"jacob_strauss":11769360,"11769360":"jacob_strauss",
				"enkidu3":13692269,"13692269":"enkidu3",
				"allorente":10517155,"10517155":"allorente",
				"Tole16v":10676499,"10676499":"Tole16v",
				"nexvs":11990694,"11990694":"nexvs",
				"kekecrack":12424389,"12424389":"kekecrack",
				"rvilarl":12624894,"12624894":"rvilarl",
				"acsalas":12599081,"12599081":"acsalas",
				"AdanVelez":12418235,"12418235":"AdanVelez",
				"alex_mayorga":10198471,"10198471":"alex_mayorga",
				"aloperez":10163415,"10163415":"aloperez",
				"alxg":10765913,"10765913":"alxg",
				"arturoae":11773771,"11773771":"arturoae",
				"betobsession":11985566,"11985566":"betobsession",
				"blakviper":11147356,"11147356":"blakviper",
				"carlosdts14":12718218,"12718218":"carlosdts14",
				"caymann":14150893,"14150893":"caymann",
				"dark_lobito":10896998,"10896998":"dark_lobito",
				"eayala":10433673,"10433673":"eayala",
				"fasttigger":13282870,"13282870":"fasttigger",
				"galane":12080913,"12080913":"galane",
				"gmontfort":11280394,"11280394":"gmontfort",
				"guillermovv":12123656,"12123656":"guillermovv",
				"gzmpepe":14839462,"14839462":"gzmpepe",
				"hcollard":11485544,"11485544":"hcollard",
				"himurapiercing":11270097,"11270097":"himurapiercing",
				"hneri":10881191,"10881191":"hneri",
				"IronDrake":12640367,"12640367":"IronDrake",
				"ishoko":11634105,"11634105":"ishoko",
				"jerrynet":10250880,"10250880":"jerrynet",
				"jpvalenz":11055764,"11055764":"jpvalenz",
				"LeonMx":11070011,"11070011":"LeonMx",
				"lingtrin":10684728,"10684728":"lingtrin",
				"luis8770":11664662,"11664662":"luis8770",
				"meggo71":12534953,"12534953":"meggo71",
				"MiguelEq":13789252,"13789252":"MiguelEq",
				"mike_jim":11132371,"11132371":"mike_jim",
				"Mornie":10688644,"10688644":"Mornie",
				"neuronachoca":15687808,"15687808":"neuronachoca",
				"noliveira_ney":13270480,"13270480":"noliveira_ney",
				"photoraven":13875137,"13875137":"photoraven",
				"pmesina":11653969,"11653969":"pmesina",
				"posadajavier":10849867,"10849867":"posadajavier",
				"proexito":11858795,"11858795":"proexito",
				"quarryninja":14913898,"14913898":"quarryninja",
				"RafArtzIBAR":10227130,"10227130":"RafArtzIBAR",
				"rafavivanco":10467020,"10467020":"rafavivanco",
				"raingnomo":13729274,"13729274":"raingnomo",
				"ramgs":10281210,"10281210":"ramgs",
				"Ravill":13915898,"13915898":"Ravill",
				"rcbchih":1112111,"1112111":"rcbchih",
				"rlfabre":13739107,"13739107":"rlfabre",
				"Rodrigojc":13184709,"13184709":"Rodrigojc",
				"Sobres":12834626,"12834626":"Sobres",
				"starmandpc":10877922,"10877922":"starmandpc",
				"tehshiftr":2986205,"2986205":"tehshiftr",
				"anto64":124735,"124735":"anto64",
				"asterix06":88679,"88679":"asterix06",
				"Michelozzo":10623476,"10623476":"Michelozzo",
				"macneo":24723,"24723":"macneo", //https://world.waze.com/editor/?zoom=7&lat=45.57974&lon=9.27294&marker=true&layers=BFTFTTTFTTFTTFTFTTTTFT&segments=83944187
				"Vanni":87004,"87004":"Vanni", //https://world.waze.com/editor/?zoom=5&lat=40.94885&lon=14.8369&marker=true&layers=BFTFTTTFTTFTTFTFTTTTFT&segments=80596275
				"lopaolo69":116712,"116712":"lopaolo69", // https://world.waze.com/editor/?zoom=7&lat=41.8318463984724&lon=14.1017790118609&marker=true
				"ninoleum":1,
				"francescomanzella":11309466,"11309466":"francescomanzella",
				"maxzok":1,
				"andreaDFC":1,
				"alethewolf":1,
				"chrob":95687,"95687":"chrob", //https://world.waze.com/editor/?zoom=7&lat=41.9291361180679&lon=12.5162296180432&marker=true
				"PiSTAPaSTA ":1,
				"trec":10856271,"10856271":"trec"},
		ign:{ "ign_yulia":"Yulia Lysenko",
					"ign_konstantin":"Kostia Upir",
					"ign_elina":"Storozhuk Elina",
					"ign_daria":"Daria Lugovska",
					"ign_zhenya":"Zhenya Harchenko",
					"ign_maryna1":"Maryna Savchuk",
					"ign_olga2":"Olga Grinchuk",
					"ign_alyona":"Alyona Korotya",
					"ign_kira":"Kira Chvarkova",
					"ign_alexander":"Alexandr Elenevsky",
					"ign_maria":"Maria Medushevska",
					"ign_andrey":"Voronyuk Andrey",
					"ign_ivan":"Petrushenko Ivan",
					"ign_irina":"Irina Sahnyuk",
					"ign_oleg1":"Oleg Havryliuk",
					"ign_kateryna1":"Katya Tararaka",
					"ign_victoria1":"Victoria Pavlyuk",
					"ign_anna":"Anna Tkachuk",
					"ign_andrew":"Andrew Borovyk",
					"ign_oleg":"Oleg Polischuk",
					"ign_tania":"Tania Ishutina"}
		//----------------------
	});
	$('body').cartouche();
})(jQuery);