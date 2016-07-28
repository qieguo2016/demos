/**
 * method 1 写死的字符替换，复用性为0
 */
var dataset = [{
	author: "Pete Hunt",
	id: 10000,
	text: "This is one comment"
}, {
	author: "张三",
	id: 10001,
	text: "我就静静看着，不说话"
}, {
	author: "Jordan Walke",
	id: 10002,
	text: "This is another comment"
}];

var template = '<li class="cmt-li"><span class="cmt-author"></span><span class="cmt-id"></span><span class="cmt-text"></span></li>';

function addItem(cnt, dataset) {
	// cnt，data的预处理，此处省略
	var temp = '';
	dataset.forEach(function(data) {
		temp += '<li class="cmt_li"><span class="cmt_author">' + data.author + '</span><span class="cmt_id">' + data.id + '</span><span class="cmt_text">' + data.text + '</span></li>'
	})
	cnt.innerHTML = temp;
}

addItem(document.querySelector('.cmts'), dataset);

/**
 * 	method 2 正则匹配，可内嵌js代码
 * 	原理：
 * 		1、收集字符串中的js代码（<%、%>之间的代码），将js代码放入字符串中，通过new function('arg', 'function body')创建函数。
 * 		2、不是js的代码当做字符串按照当前位置嵌入到js代码中，生成的js代码操作这些字符串拼接成最终的输出。
 * 	缺点：js与html代码互相嵌套，逻辑混乱容易出错。如果js不操作html代码可能会好一点。
 */
var TemplateEngine = function(html, options) {
	var re = /<%([^%>]+)?%>/g,
		reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
		code = 'var r=[];\n',
		cursor = 0;
	var add = function(line, js) {
		js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		return add;
	}
	while(match = re.exec(html)) {
		add(html.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(html.substr(cursor, html.length - cursor));
	code += 'return r.join("");';
	return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}
var template =
	'My skills:' +
	'<%for(var index in this.skills) {%>' +
	'<a href="#"><%this.skills[index]%></a>' +
	'<%}%>';
	
	/*** 
	 * 上述例子后面生成的函数为：
	 * return 
	 * 'My skills:' +
	 * for(var index in this.skills){
	 * 	<a href="#">this.skills[index]</a>
	 * }
	 */	
	 
console.log(TemplateEngine(template, {
	skills: ["js", "html", "css"]
}));