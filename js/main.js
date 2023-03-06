document.getElementsByClassName('themeColor')[0].onclick=function(){
    document.getElementsByTagName('svg')[0].style.color=this.value;
    document.getElementsByTagName('svg')[1].style.color=this.value;
    document.getElementsByTagName('svg')[2].style.color=this.value;
    document.getElementsByTagName('svg')[3].style.color=this.value;
    document.getElementsByTagName('svg')[4].style.color=this.value;
    document.getElementsByTagName('svg')[5].style.color=this.value;
}

document.getElementById('themecolorOne').onclick=function(){
    document.getElementsByClassName('discover')[0].style.color=this.value;
}