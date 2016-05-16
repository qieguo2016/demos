/*-----------------------------【程序说明】-----------------------------
 *	程序说明：	FakeZhihu的交互脚本
 *	程序描述：	使用原生js编写的交互脚本，主要用在移动web端，这里都是一点一点拼凑的，写的非常难看。。。
 *	浏览器支持：Chrome、Firefox、Safari，腾讯X5（若有问题，请更新浏览器到最新版）
 *	2016年05月 Created by @茄果
 *	更多信息请关注我的博客：http://www.cnblogs.com/qieguo/
 *
 *  Licensed under the MIT，转载使用请注明出处！http://www.cnblogs.com/qieguo/
 *--------------------------------------------------------------------
 */


"use strict"

var topSearch = document.getElementById('zd-top-search-input');
var askQuestion = document.getElementById('zd-top-ask-question');
var navMenu = document.getElementsByClassName('zh-nav-menu')[0];
var navUser = document.getElementsByClassName('zh-nav-user')[0];
var navMsg = document.getElementById('zd-nav-msg');
var navMsgSort = navMsg.getElementsByClassName('zh-nav-msg-sort')[0];
var navMsgList = navMsg.getElementsByClassName('zh-nav-msg-list')[0];
var mainCtn = document.getElementById('zd-main');
var pageMask = document.getElementById('zd-mask');
var maskAsk = document.getElementById('zd-mask-ask');
var maskVote = document.getElementById('zd-mask-vote');

var collectionsNav = mainCtn.getElementsByClassName('zh-main-tab-nav')[0];

/* ********    Header    ********/
//search inputbox stretch when got focus
topSearch.addEventListener('focus', function (e) {
	var top = document.getElementById('zd-top');
	top.classList.add('searching');
	//top.className = 'zh-top searching';
});
topSearch.addEventListener('blur', function (e) {
	var top = document.getElementById('zd-top');
	top.classList.remove('searching');
	//top.className = 'zh-top';
});

//modal mask appear when clicked askQuestion button
askQuestion.addEventListener('click', function (e) {
	pageMask.className = 'zh-mask ask';
	document.body.style = 'overflow: hidden;';
	e.stopPropagation();
});
/* ********    Header end   ********/


/* ********    Navigator    ********/
navMenu.addEventListener('click', function (e) {
	var target = e.target;
	var child = this.getElementsByClassName('zh-nav-menu-li');
	for (var index = 0; index < child.length; index++) {
		child[index].className = 'zh-nav-menu-li';
	}
	target.parentElement.className = 'zh-nav-menu-li current';
	switch (target.parentElement.id){
		case 'zd-nav-menu-msg':
			navUser.className = 'zh-nav-user';
			navMsg.classList.toggle('show');
			//navMsg.className = (navMsg.className == 'zh-nav-msg') ? 'zh-nav-msg show' : 'zh-nav-msg';
			break;
		case 'zd-nav-menu-user':
			navMsg.className = 'zh-nav-msg';
			navUser.classList.toggle('show');
			//navUser.className = (navUser.className == 'zh-nav-user') ? 'zh-nav-user show' : 'zh-nav-user';
			break;
		default:
			break;
	}
//	e.preventDefault();
	e.stopPropagation();
});
navMsgSort.addEventListener('click', function (e) {
	var target = (e.target.tagName == 'I') ? e.target : e.target.children[0];
	var child = this.getElementsByClassName('nav-msg-sort');
	for (var index = 0; index < child.length; index++) {
		child[index].className = 'nav-msg-sort';
	}
	target.parentElement.className = 'nav-msg-sort current';
	switch (target.parentElement.name){
		case 'questions':
			navMsgList.innerHTML = '<div class="zh-nav-msg-ctn"><a href=""  class="blue-link" name="author">周宁奕</a> 回答了 <a href=""  class="blue-link" name="question">能利用爬虫技术做到哪些很酷很有趣很有用的事情？</a></div>\
				<div class="zh-nav-msg-ctn"><ahref=""  class="blue-link" name="author">周宁奕</a> 回复了你在 <a href=""  class="blue-link" name="question">能利用爬虫技术做到哪些很酷很有趣很有用的事情？</a> 中 <a href="" class="blue-link" name="author">周宁奕</a> 的回答下的评论</div>\
				<div class="zh-nav-msg-ctn"><a href="" class="blue-link" name="author">haochuan</a> 在 <a href="" class="blue-link" name="field">_haochuan的RandomNotes</a> 中发布了 <a href="" class="blue-link" name="article">当我们说软件工程师的时候我们在说什么</a></div>\
				<div class="zh-nav-msg-ctn"><a href="" class="blue-link" name="author">康石石</a> 回答了 <a href="" class="blue-link" name="question">有哪些好的网站，让人第一眼看了就怦然心动，流连忘返？</a></div>\
				<div class="zh-nav-msg-ctn"><a href="" class="blue-link" name="author">康石石</a> 回复了你在 <a href="" class="blue-link" name="question">有哪些好的网站，让人第一眼看了就怦然心动，流连忘返？</a> 中 <a href="" class="blue-link" name="author">康石石</a> 的回答下的评论</div>\
				<div class="zh-nav-msg-ctn"><a href="" class="blue-link" name="author">张科洋</a> 回答了 <a href="" class="blue-link" name="question">关于 JavaScript 的好书有哪些？</a></div>';
			break;
		case 'users':
			navMsgList.innerHTML = '<div class="zh-nav-msg-empty">有人关注你时会显示在这里</div>';
			break;
		case 'thanks':
			navMsgList.innerHTML = '<div class="zh-nav-msg-ctn">获得 1 次感谢：<a href=""  class="blue-link" name="question">如何写产品交互文档，一份好的交互文档应该包括哪些方面内容？</a> 来自 <a href="" class="blue-link" name="author">张科洋</a></div>';
			break;
		default:
			break;
	}
//	e.preventDefault();
	e.stopPropagation();
});
/* ********    Navigator end   ********/


/* ********    main start   ********/
mainCtn.addEventListener('click', function (e) {
	var target = e.target;
	var value = target.dataset.opt;
	switch (value){
		case 'answer-vote':
			pageMask.className = 'zh-mask vote';
			document.body.style = 'overflow: hidden;';
			e.preventDefault();
			break;
		default:
			break;
	}
	e.stopPropagation();
});
/*********    main end   ********/

/*********    pageMask start  ********/
maskAsk.addEventListener('click', function (e) {
	var value = e.target.dataset.opt;
	switch (value){
		case 'cancel':
			pageMask.className = 'zh-mask';
			document.body.style = 'overflow: visible;';
			break;
		default:
			break;
	}
	//e.preventDefault();
	e.stopPropagation();
});
maskAsk.addEventListener('keypress', function (e) {
	var k = e.charCode,
		target = e.target;
		
	switch (k){
		case 13:
			// press [enter]
			//console.log(target.style.height + " , " +target.scrollHeight);
			//target.style.height = target.scrollHeight;
			break;
		default:
			break;
	}
	//target.rows = (target.scrollHeight - 16) / 24;
	//console.log(target.rows + " , " + target.scrollHeight);
	//e.preventDefault();
	e.stopPropagation();
});


maskVote.addEventListener('click', function (e) {
	var value = e.target.dataset.opt || e.target.parentElement.dataset.opt;
	var btn = this.getElementsByClassName('zh-mask-vote-btn');
	function returnCurrentPage() {
		pageMask.className = 'zh-mask';
		document.body.style = 'overflow: visible;';
	}
	switch (value){
		case 'cancel':
			returnCurrentPage();
			break;
		case 'vote-approval':
			//这里还需要判断不同回答下的赞同和反对
			btn[1].classList.remove('pressed');
			btn[0].classList.toggle('pressed');
			setTimeout(returnCurrentPage, 1500);
			break;
		case 'vote-oppose':
			//这里还需要判断不同回答下的赞同和反对
			btn[0].classList.remove('pressed');
			btn[1].classList.toggle('pressed');
			setTimeout(returnCurrentPage, 1500);
			break;
		default:
			break;
	}
	//e.preventDefault();
	e.stopPropagation();
	
});

/* ********    pageMask end  ********/


collectionsNav.addEventListener('click',function (e) {
	var index,
		target = e.target,
		opt = target.dataset.opt,
		children = this.getElementsByTagName('li'),
		ctn = document.getElementsByClassName('zh-main-collections')[0];
	for (index = 0; index < children.length; index++) {
		children[index].classList.remove('current');
	}
	switch (opt){
		case 'follow':
			target.classList.add('current');
			ctn.innerHTML = '<li><h3><a class="blue-link" href="">关注的话题</a></h3><span>9个答案 • 99个人关注</span></li>\
				<li><h3><a class="blue-link" href="">关注的话题</a></h3><span>9个答案 • 99个人关注</span></li>';
			break;
		case 'creat':
			ctn.innerHTML = '<li><h3><a class="blue-link" href="">创建的话题</a></h3><span>11个答案 • 111个人关注</span></li>\
				<li><h3><a class="blue-link" href="">关注的话题</a></h3><span>11个答案 • 111个人关注</span></li>';
			target.classList.add('current');
			break;
		default:
			break;
	}
	e.stopPropagation();
});