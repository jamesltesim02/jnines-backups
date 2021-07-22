function fontSize(designWidth,diyFontSize){
	let dpr=window.devicePixelRatio;
	let scale=1/dpr;
	let metaEle=document.createElement('meta');
	metaEle.name="viewport";
	metaEle.content="width=device-width,initial-scale="+scale+",maximum-scale="+scale+",user-scalable=no";
	let head=document.getElementsByTagName('head')[0];
	head.appendChild(metaEle);
	let html=document.getElementsByTagName('html')[0];
	html.style.fontSize=diyFontSize*document.documentElement.clientWidth/designWidth+'px'
}
fontSize(750,100)

