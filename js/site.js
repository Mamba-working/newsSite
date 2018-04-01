var EventCenter = {
    on: function (type, handler) {
        $(document).on(type, handler)
    },
    fire: function (type, data) {
        $(document).trigger(type, data)
    }
}
let waterFall = {
    init() {
        this.liWidth = $(".news li").outerWidth(true)
        this.coluCount = Math.floor($(".waterFall").width() / this.liWidth)
        this.coluArr = []
        for (let i = 0; i < this.coluCount; i++) {
            this.coluArr.push(0)
        }
        // this.li = []
        this.bind();
    },
    bind: function () {
        let _this = this;
        // $('.item').find("img").on("load", function () {
        //     $(".news li").each(function () {
        //         _this.layout($(this))
        //     })

        // })
        // EventCenter.on("append",(e,data)=>{
        //     this.li.push(data.node)
        // })
        // EventCenter.on("endGet", () =>{
        //     console.log("end")
        //     this.li.forEach(function(n){
                
        //            _this.layout(n);
                   
        //     })

        // })
        $(window).on("resize", function () {
            let timer = null;
            clearTimeout(timer);
            setTimeout(function () {
                _this.coluCount = Math.floor($(".waterFall").width() / _this.liWidth)
                _this.coluArr = []
                for (let i = 0; i < _this.coluCount; i++) {
                    _this.coluArr.push(0)
                }
                $(".news li").each(function () {
                    _this.layout($(this))
                })
                $("ul").css("height",Math.max(...waterFall.coluArr))
                $(".news li").fadeIn()
            }, 500)

        })
    },
    layout: function ($node) {
        let minIndex = this.min(this.coluArr).minIndex;
        let maxValue = this.min(this.coluArr).maxValue;
        let minValue = this.coluArr[minIndex];
        $node.css({
            top: minValue,
            left: minIndex * this.liWidth
        })

        this.coluArr[minIndex] += $node.outerHeight(true)
    },
    min: function (arr) {
        let minValue = arr[0];
        let minIndex = 0;
        let maxValue = arr[0];
        let maxIndex = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < minValue) {
                minValue = arr[i];
                minIndex = i;
            }
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] > maxValue) {
                maxValue = arr[i];
                maxIndex = i;
            }
        }
        return {
            minIndex,
            maxValue
        }
    }
}
let getData = {
    init: function () {
        this.count = 20;
        this.currentPage = 0;
        this.bind()
        
    },
    bind() {
        let _this = this
        this.get();
        $(".more").on("click",this.get.bind(getData))
    },
    get() {
            let _this = this
            $.ajax({
                url: "https://platform.sina.com.cn/slide/album_tech",
                dataType: 'jsonp',
                jsonp: "jsoncallback",
                data: {
                    app_key: '1271687855',
                    num: _this.count,
                    page: _this.currentPage
                }
            }).done(function (ret) {
                ret.data.forEach(function (node) {
                    _this.render(node);
                })
                $(window).resize();
                

                _this.currentPage++;
                
            }).fail(function () {
            })
                
    },
    render(node) {
        let template =
            `
        <li class="item" "> 
          <a href="#" class="link">
            <img src="" alt="">
          </a> 
          <h4 class="header"></h4>
          <p class="desp"></p>
        </li>
        `
        let $node = $(template);
        $node.find("img").attr("src", node.img_url);
        $node.find("h4").text(node.short_name);
        $node.find("p").text(node.short_intro);
        $node.css("display","none");
        $(".news").append($node)

    },
    lazyLoad() {
        let timer = null;
        let _this = this
   
    },

}
waterFall.init()
getData.init()

