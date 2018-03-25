let waterFall = {
    init() {
        this.liWidth = $(".news li").outerWidth(true)
        this.coluCount = Math.floor($(".waterFall").width() / this.liWidth)
        this.coluArr = []
        for (let i = 0; i < this.coluCount; i++) {
            this.coluArr.push(0)
        }
        this.bind();
    },
    bind: function () {
        let _this = this;
        // $('.item').find("img").on("load", function () {
        //     $(".news li").each(function () {
        //         _this.layout($(this))
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

        $("ul").css("height", maxValue)
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
        this.total = 41;
        this.finish = false;
        waterFall.init()
        this.bind()
        
    },
    bind() {
        this.get();
        this.lazyLoad()
    },
    get() {
        if ($("li").length <= this.total) {
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
                    _this.render(node)
                })
                _this.currentPage++;
                $(".waterFall>div").hide("slow");
                console.log("ajax")
            }).fail(function () {
                console.log("fail")
            })
        } else {
            this.finish = true;
            $(".waterFall>div").hide("slow");
            $(".noMore").fadeIn();
            $(".noMore").css({
                display:'block',
                margin:'0 auto'
            })
            $("ul").css("height", waterFall.min(waterFall.coluArr).maxValue)
            console.log(waterFall.min(waterFall.coluArr).maxValue)
            console.log(waterFall.coluArr)
        }


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
        $("ul.news").append($node);
       waterFall.layout($node);
       $(window).resize();
    },
    lazyLoad() {
        let timer = null;
        let _this = this
        $(window).on("scroll", function () {
            clearTimeout(timer);
            if ($("ul")[0].scrollHeight-10 <= $(window).scrollTop() + $(window).height()) {
                timer = setTimeout(function () {
                    console.log("scroll")
                    if (_this.finish === false) {
                        $(".waterFall>div").fadeIn();
                        _this.get();
                    }else{
                        console.log("over")
                    }


                }, 500)
            }
        })
    },

}
getData.init()