(function(a,b){
        function fontsize(){
            b.documentElement.style.fontSize=20*b.documentElement.clientWidth/320+'px';
        }
        fontsize();
        a.addEventListener('resize',fontsize,false);
    })(window,document);