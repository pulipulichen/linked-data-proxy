
app.get("/add_term",function (req, res){
	var term = req.query.term;
	var cache_id = req.query.cache_id;
	var dict_string="";
	// 1. 取得dict_custom.js
	var dict_custom='./scripts/data/dict_custom.json';
	var foo=fs.openSync(dict_custom,'r+');
	fs.readFile(dict_custom, "utf-8" ,function(err,data){
		if(err){
			console.log('檔案讀取錯誤');
		}
		else{
			dict_string=data.toString();
			//console.log(dict_string);
			var term_existat = dict_string.indexOf('"'+term+'",');
			
	// 2. 檢查裡面有沒有這個term
	// 3. 如果沒有
			if(term_existat === -1){    
				//console.log("這是新詞");

			// 4. 把詞庫加入term，重組dict_custom.js
				var _head = dict_string.substr(0,2);
				var _new_term = '\t["' + term  + '", 99999, "n"],\n';
				var _foot = dict_string.substring(2,dict_string.length);

				var _new_dict = _head + _new_term + _foot;

				//var termtojson='["'+term+'", 999, "n" ]';
				// 	["郁離子",9999,"n"],
				fs.writeSync(foo,_new_dict,0);
				fs.close(foo);
				_load_custom_dict();

			// 5. 刪除快取 by cache id
			
			/*	tableArticleCache
				.findById(cache_id)
				.then(function(task){
					console.log(cache_id);
					return task.destroy();
				});
			*/
				tableArticleCache.update(
		  			{result:null},
		  			{where:{id:cache_id}}
		  		);
		  		res.jsonp(true);
			}
	// 6. 如果已經有這個詞了...
			else{
				//console.log("詞庫的第:"+term_existat+"個字找到 "+term+" 這個詞");
				

			}	
		}
		
	});
	
	//console.log(term);
});

_custom_dict = undefined;
_load_custom_dict = function () {
	
	var json = JSON.parse(fs.readFileSync('./scripts/data/dict_custom.json', 'utf8'));
	_custom_dict=json;
	node_jieba_reset();
};	// end of var _load_custom_dict = function () {

_load_custom_dict();