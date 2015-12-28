(function() {

  var code = document.querySelectorAll('pre code');
  	console.log(code);
  var length = code.length;
  while(length--){
  	  hljs.highlightBlock(code[length]);
  	  console.log(length)
  }
})();