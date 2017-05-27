var DIR_LJL='../jiebaserver/ljlarticle';

app.get("/",function(req, res){
	fs.readFile("./template/directory.html", 'utf8',function(err, data){
		res.setHeader('content-type', 'text/html');
		

		fs.readdir(DIR_LJL, function(err, files) {
		    if (err) return;
		    var _content = "";
		    var _precontent = "";

		    var _directory_abstract_max_length = 20;
		    files.forEach(function(f) {
		    	var predata = fs.readFileSync("./ljlarticle/" + f, 'utf8');
		    	predata = predata.replace(/(?:\\[rnt]|[\r\n\t　]+)+/g, "").trim();
				//console.log(predata.substring(0, 19));
				if (predata.length > _directory_abstract_max_length) {
					_precontent = predata.substring(0, _directory_abstract_max_length) + "...";
				}
	    		_content = _content
	        		+ '<li><a href="article?file=' + f + '">' + f + '</a>: '+ _precontent +'</li>';	        
		    });
			data = data.replace(/{{CONTENT}}/g, _content);
			res.send(data);  
		});
	});
});
/*
app.get("/directory",function(req, res){
	fs.readFile("./template/directory.html", 'utf8',function(err, data){
		res.setHeader('content-type', 'text/html');
		

		fs.readdir(DIR_LJL, function(err, files) {
		    if (err) return;
		    var _content1 = '<fieldset id="ljl_field" style="border : 0; display : none;">';
		    var _content2 = '<fieldset id="ming_field" style="border : 0; display : none;">';
		    var _precontent = "";

		    var _directory_abstract_max_length = 20;
		    files.forEach(function(f) {
		    	var predata = fs.readFileSync("./ljlarticle/" + f, 'utf8');
		    	predata = predata.replace(/(?:\\[rnt]|[\r\n\t　]+)+/g, "").trim();
				//console.log(predata.substring(0, 19));
				if (predata.length > _directory_abstract_max_length) {
					_precontent = predata.substring(0, _directory_abstract_max_length) + "...";
				}
	    		if(escape(f).indexOf('0704')!=-1){
					_content1 = _content1
	        		+ '<li><a id="'+ escape(f) +'" href="article?file=' + f + '">' + f + '</a>: '+ _precontent +'</li>';
				}
				else{
					_content2 = _content2
					+ '<li><a id="'+ escape(f) +'" href="article?file=' + f + '">' + f + '</a>: '+ _precontent +'</li>';
				}	        
		    });
			_content1 = _content1+"</fieldset>";
		    _content2 = _content2+"</fieldset>";
			data = data.replace(/{{CONTENT}}/g, _content1 + _content2);
			res.send(data);  
		});
	});
});
*/
app.get("/directory_ljl",function(req, res){
	fs.readFile("./template/directory.html", 'utf8',function(err, data){
		res.setHeader('content-type', 'text/html');
		
		var _article_title="羅家倫文存";
		fs.readdir(DIR_LJL, function(err, files) {
		    if (err) return;
		    var _content = "";
		    var _precontent = "";

		    var _directory_abstract_max_length = 20;
		    files.forEach(function(f) {


		    	if(f.indexOf("0704")==-1){
		    		return;
		    	}
		    	var predata = fs.readFileSync("./ljlarticle/" + f, 'utf8');
		    	predata = predata.replace(/(?:\\[rnt]|[\r\n\t　]+)+/g, "").trim();
				//console.log(predata.substring(0, 19));
				if (predata.length > _directory_abstract_max_length) {
					_precontent = predata.substring(0, _directory_abstract_max_length) + "...";
				}

				_content = _content
	        	+ '<li><a href="article?file=' + f + '">' + f + '</a>: '+ _precontent +'</li>';
       
		    });
		    data = data.replace(/{{ARTICLE}}/g, _article_title);
			data = data.replace(/{{CONTENT}}/g, _content);
			res.send(data);  
		});
	});
});

app.get("/directory_ming",function(req, res){
	fs.readFile("./template/directory.html", 'utf8',function(err, data){
		res.setHeader('content-type', 'text/html');
		
		var _article_title="明人文集-謙齋文錄";
		fs.readdir(DIR_LJL, function(err, files) {
		    if (err) return;
		    var _content = "";
		    var _precontent = "";

		    var _directory_abstract_max_length = 20;
		    files.forEach(function(f) {


		    	if(f.indexOf("0704")!=-1){
		    		return;
		    	}
		    	var predata = fs.readFileSync("./ljlarticle/" + f, 'utf8');
		    	predata = predata.replace(/(?:\\[rnt]|[\r\n\t　]+)+/g, "").trim();
				//console.log(predata.substring(0, 19));
				if (predata.length > _directory_abstract_max_length) {
					_precontent = predata.substring(0, _directory_abstract_max_length) + "...";
				}

				_content = _content
	        	+ '<li><a href="article?file=' + f + '">' + f + '</a>: '+ _precontent +'</li>';
       
		    });
		    data = data.replace(/{{ARTICLE}}/g, _article_title);
			data = data.replace(/{{CONTENT}}/g, _content);
			res.send(data);  
		});
	});
});

app.get("/article",function(req, res){
	fs.readFile("./template/article.html", 'utf8',function(err, data){
		res.setHeader('content-type', 'text/html');

		//var _title = "title";
		
		//console.log(typeof(data));
		//console.log(data);
		fs.readFile('./ljlarticle/'+req.query.file, 'utf8', function (err,content) {
		  if (err) {
		    return console.log(err);
		  }
		  var _title = req.query.file;
		  var _content = content;

		  _content = _content.split("\n").join("<br />");

		  data = data.replace(/{{TITLE}}/g, _title);
		  data = data.replace(/{{CONTENT}}/g, _content);
		  res.send(data);
		});
		
		
	});
});
