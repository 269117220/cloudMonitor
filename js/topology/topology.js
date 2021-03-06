$(function() {
    $("#loading_monitor,#background_monitor").hide();
    $.ajax({
        type: "GET",
        url: config["host"] + "/tuopu?token=" + window.localStorage.token,
        success: function(data) {
            //console.log(">>>"+data);
            expTopoListChange(data);
        },
        error: function(data) {
            createAndHideAlert("获取信息错误！");
        }
    });
    $(".next_page").click(function() {
        $(".footer1_page").hide();
        $(".footer2_page").show();
    });
    $(".front_page").click(function() {
        $(".footer1_page").show();
        $(".footer2_page").hide();
        $('.imgs_pane a').tab('show')
    });
    $(".cpu_type").click(function() {
        //$(this).addClass("btn-default");
        $(".cpu_type").removeClass("btn-primary");
        $(this).addClass("btn-primary");
        var ram_id = $(".Ram_type[class*='btn-primary']").attr("id");
        $(".RAM_InfoShow").empty();
        var num = $(this).attr("id");
        setRAMInfo(new Number(num), ram_id);
        //-------主机类型的响应
        var flavors = JSON.parse(localStorage.instance_temp)['flavors'];
        setSelect(flavors);
    });
    $(document).on("click", ".Ram_type", function() {
            //$(this).addClass("btn-default");
            $(".Ram_type").removeClass("btn-primary");
            $(this).addClass("btn-primary");
            //-------主机类型的响应
            setSelect();
        })
        //-----------云主机和配置之间的切换
    $(".peizhi_select").change(function() {
        var curr_id = $(this).val();
        var flavors = JSON.parse(localStorage.instance_temp)['flavors'];
        instance_Ram_Cpu(curr_id, flavors);
    });
    $(document).on("click", ".img_buttons", function() {
        $(".img_buttons").removeClass("btn-primary");
        $(this).addClass("btn-primary");
    });
    $(document).on("click", ".create_instanceOK", function() {
        $("#loading_monitor").prepend("<span>正在创建,请稍后...</span>");
        $("#loading_monitor,#background_monitor").show();
        submit_instanceInfo();
    });
    $(document).on("click", ".cancel_lineButton", function() {

        $(".showLineModel").hide();
    });
    $(document).on("click", ".delete_line", function() {
        $(".showLineModel").hide();
        var router_temp = {
            "router": {
                "external_gateway_info": null
            }
        };
        $.ajax({
            type: "POST",
            data: JSON.stringify(router_temp),
            contentType: "application/json",
            url: config["host"] + "/router/update/" + router_id + "?token=" + window.localStorage.token,
            success: function(data) {
                window.location.reload();
            }
        });
    });
});
