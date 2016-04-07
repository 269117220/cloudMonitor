var sub_list_len = 0;
$(function() {
    var flag = window.location.href.indexOf("&");
    //-----从网络进入的情况
    if (flag >= 0) {
        var id_num = (window.location.href.split('?')[1]).split('&')[0];
        var status_id = decodeURI(window.location.href.split('?')[1]).split('&')[1];
        var manager_status = status_id.split("id_start")[0];
        id_net = status_id.split("id_start")[1];
        var netInfo = JSON.parse(localStorage.net_tempInfo)['networks'][id_num];
        //---------显示网络信息
        setNetInfo(netInfo, manager_status);

        //-------子网
        var networks = JSON.parse(localStorage.net_tempInfo)['networks'];
        var curr_subnetids;
        for (var j = 0; j < networks.length; j++) {
            if (networks[j].id == id_net) {
                curr_subnetids = networks[j]['subnets'];
                break;
            }
        }
        var subnets = JSON.parse(localStorage.subnets_tempInfo)['subnets'];
        for (var i = 0; i < subnets.length; i++) {
            var subnet = subnets[i];
            for (var k = 0; k < curr_subnetids.length; k++) {
                if (curr_subnetids[k] == subnet.id) {
                    set_subNet(subnet, subnet.id);
                }
            }
        }
        sub_list_len = curr_subnetids.length;
        var str_footer = '<td colspan="6">Displaying <span id="item_count">' + sub_list_len + '</span> items</td>';
        $(".sub_netInfo_footer").append(str_footer);

        //------端口
        $.ajax({
            type: "GET",
            url: config["host"] + "/ports?token=" + window.localStorage.token,
            success: function(data) {
                var port_Infos = JSON.parse(data)["ports"];
                localStorage.portInfos = data;
                var count_num = 0;
                for (var i = 0; i < port_Infos.length; i++) {
                    port_info = port_Infos[i];
                    if (port_info.network_id == netInfo.id) {
                        count_num++;
                        //----端口名字的处理
                        if (port_info.name == null || port_info.name == "") {
                            port_info.name = "(" + port_info.id.substr(0, 13) + ")";
                        }
                        //----端口的固定IP
                        var fixed_IPs = port_info.fixed_ips;
                        var fixed_ips_str = "";
                        for (var j = 0; j < fixed_IPs.length; j++) {
                            fixed_ips_str += fixed_IPs[j].ip_address + "<br/>";
                        }
                        //-----状态的变换
                        if (port_info.status == "ACTIVE") {
                            port_info.status = "运行中";
                        } else {
                            port_info.status = "状态待补充";
                        }
                        //-----管理员的状态变换
                        if (port_info.admin_state_up == true) {
                            port_info.admin_state_up = "上";
                        } else {
                            port_info.admin_state_up = "状态待补充";
                        }
                        setPortInfo(port_info, fixed_ips_str, port_info.id);
                    }
                }
                var footer_info = '<tfoot><tr class="active tfoot-dsp"><td colspan="6">Displaying <span id="item_count">' + count_num + '</span> items</td></tr></tfoot>';
                $(".port_infos").append(footer_info);
            },
            error: function(data) {
                alert("端口获取失败！");
            }
        });

    } else //-----从拓扑进入的情况
    {
        var id = window.location.href.split('?')[1]
        $.ajax({
            type: "GET",
            url: config["host"] + "/networks?token=" + window.localStorage.token,
            success: function(data) {
                //---------显示网络信息
                var servers = JSON.parse(data);
                var curr_net = 0;
                for (var i = servers['networks'].length - 1; i >= 0; i--) {
                    if (servers['networks'][i].id == id) {
                        if (servers['networks'][i].admin_state_up == true)
                            servers['networks'][i].admin_state_up = "上";
                        else
                            servers['networks'][i].admin_state_up = "下";
                        setNetInfo(servers['networks'][i], servers['networks'][i].admin_state_up);
                        curr_net = i;
                        break;
                    }
                }
                //---------显示子网
                $.ajax({
                    type: "GET",
                    url: config["host"] + "/subnets?token=" + window.localStorage.token,
                    success: function(data) {
                        var subnet_infos = JSON.parse(data)['subnets'];
                        //-----------------------------------
                        var subnets = servers['networks'][curr_net]['subnets'];

                        var subnet_Info = "[";
                        for (var j = 0; j < subnets.length; j++) {
                            // alert(subnets.length);
                            for (var k = 0; k < subnet_infos.length; k++) {
                                //alert(subnets[i]+"=="+subnet_infos[j].id);
                                if (subnets[j] == subnet_infos[k].id) {
                                    // alert(subnets[i]);
                                    if (subnet_Info = "[")
                                        subnet_Info += JSON.stringify(subnet_infos[k]);
                                    else
                                        subnet_Info += "," + JSON.stringify(subnet_infos[k]);
                                }
                            }
                        }
                        var subnetInfoTemp = subnet_Info + "]";
                        var sunNetInfos = JSON.parse(subnetInfoTemp);
                        for (var i = 0; i < sunNetInfos.length; i++)
                            set_subNet(sunNetInfos[i], sunNetInfos[i].id);
                        sub_list_len = sunNetInfos.length;
                        var str_footer = '<td colspan="6">Displaying <span id="item_count">' + sub_list_len + '</span> items</td>';
                        $(".sub_netInfo_footer").append(str_footer);
                        //------------------------------------                      
                        //----------------端口
                        $.ajax({
                            type: "GET",
                            url: config["host"] + "/ports?token=" + window.localStorage.token,
                            success: function(data) {
                                var port_Infos = JSON.parse(data)["ports"];
                                var count_num = 0;
                                for (var i = 0; i < port_Infos.length; i++) {
                                    port_info = port_Infos[i];
                                    if (port_info.network_id == servers['networks'][curr_net].id) {
                                        count_num++;
                                        //----端口名字的处理
                                        if (port_info.name == null || port_info.name == "") {
                                            port_info.name = "(" + port_info.id.substr(0, 13) + ")";
                                        }
                                        //----端口的固定IP
                                        var fixed_IPs = port_info.fixed_ips;
                                        var fixed_ips_str = "";
                                        for (var j = 0; j < fixed_IPs.length; j++) {
                                            fixed_ips_str += fixed_IPs[j].ip_address + "<br/>";
                                        }
                                        //-----状态的变换
                                        if (port_info.status == "ACTIVE") {
                                            port_info.status = "运行中";
                                        } else {
                                            port_info.status = "状态待补充";
                                        }
                                        //-----管理员的状态变换
                                        if (port_info.admin_state_up == true) {
                                            port_info.admin_state_up = "上";
                                        } else {
                                            port_info.admin_state_up = "状态待补充";
                                        }
                                        setPortInfo(port_info, fixed_ips_str, port_info.id);
                                    }
                                }
                                var footer_info = '<tfoot><tr class="active tfoot-dsp"><td colspan="6">Displaying <span id="item_count">' + count_num + '</span> items</td></tr></tfoot>';
                                $(".port_infos").append(footer_info);
                            },
                            error: function(data) {
                                alert("端口获取失败！");
                            }
                        });


                    },
                    error: function(data) {

                    }
                });

            },
            error: function(data) {

            }
        });
    }

});

//----------------删除网络
//---批量删
$(".sub_checks").change(function() {
    if ($(".sub_checks:checked").length != 0) {
        $(".delete_subnetInfo").attr("disabled", false);
    } else {
        $(".delete_subnetInfo").attr("disabled", true);
    }
});
$(".delete_subnetInfo").click(function() {
    var subnets = { "subnet_ids": [] };
    var i = 0;
    $(".sub_checks:checked").each(function() {
        subnets['subnet_ids'][i++] = this.id;
    });
    deletesubnetAjax(subnets);
});
//-------单删
$(document).on("click", ".delete_subnetSimple", function() {
    var subnets = { "subnet_ids": [] };
    subnets['subnet_ids'][0] = this.id;
    deletesubnetAjax(subnets);
});

function deletesubnetAjax(subnets) {
    $.ajax({
        type: "POST",
        data: JSON.stringify(subnets),
        contentType: "application/json",
        url: config['host'] + "/subnet/delete?token=" + window.localStorage.token,
        success: function(data) {
            window.location.href = "#/net/net";
        }
    });
}
//----------------
function setNetInfo(netInfo, manager_status) {
    //--------网络概况
    $("#project_name").text(netInfo.name);
    $("#net_name").html(netInfo.name);
    $("#net_id").html(netInfo.id);
    $("#net_proId").html(netInfo.tenant_id);
    if (netInfo.status == "ACTIVE")
        $("#net_status").html("运行中");
    else
        $("#net_status").html("状态待补充");
    $("#net_managerStatus").html(manager_status);
    $("#net_shared").text(netInfo.shared);
    $("#net_outNet").html(netInfo.port_security_enabled);
    if (netInfo.mtu == "0")
        $("#net_mtu").html("未知");
    else
        $("#net_mtu").html(netInfo.mtu);
}
//---------------创建子网面板配置
var sub1_flag = true;
$(".createchoose_subnet").click(function() {
    $(".createsubnet_multi").slideToggle();
    if (sub1_flag) {
        $(".info_pic2").removeClass("fa fa-angle-double-down");
        $(".info_pic2").addClass("fa fa-angle-double-up");
        sub1_flag = false;
    } else {
        $(".info_pic2").removeClass("fa fa-angle-double-up");
        $(".info_pic2").addClass("fa fa-angle-double-down");
        sub1_flag = true;
    }
});
var sub2_flag = true;
$(".showmoresubnetInfo").click(function() {
    $(".showMoreInfo").slideToggle();
    if (sub2_flag) {
        $(".info_pic3").removeClass("fa fa-angle-double-down");
        $(".info_pic3").addClass("fa fa-angle-double-up");
        sub2_flag = false;
    } else {
        $(".info_pic3").removeClass("fa fa-angle-double-up");
        $(".info_pic3").addClass("fa fa-angle-double-down");
        sub2_flag = true;
    }
});
$(".subnet_opengateway").change(function() {
    if (!$(".subnet_opengateway").is(":checked"))
        $(".creategateway_adrr").attr("disabled", true);
    else
        $(".creategateway_adrr").attr("disabled", false);
});
$(document).on("click", ".add_subnetInfo", function() {
    setNetselect();
});

function setNetselect() {
    $(".private_selected").empty();
    $(".private_selected").append('<option value="test">选择私有网络</option>');
    var servers = JSON.parse(localStorage.net_tempInfo)['networks'];
    var server;
    var str = "";
    for (var i = 0; i < servers.length; i++) {
        server = servers[i];
        str += '<option value="' + server.id + '">' + server.name + '</option>';
    }
    $(".private_selected").append(str);
}
//---------创建子网
$(".create_subnetworkOk").click(function() {
    update_flag = false;
    //------子网名称
    var sub_name = $(".createsubnet_name").val();
    //------私有网络ID
    var private_net = $(".private_selected").val();
    //---获取子网的地址
    var object = $(".createradio_subnetaddr:checked");
    var num_1 = object.parent().siblings().eq(0).val();
    var num_2 = object.parent().siblings().eq(2).val();
    var num_3 = object.parent().siblings().eq(4).val();
    var num_4 = object.parent().siblings().eq(6).val();
    var num_5 = object.parent().siblings().eq(8).val();
    var str_ip = num_1 + "." + num_2 + "." + num_3 + "." + num_4 + "/" + num_5;
    //------------开启网关判断
    var gateWay;
    if ($(".subnet_opengateway").prop("checked")) {
        gateWay = $(".creategateway_adrr").val();
    }
    //--------DHCP
    var dhcp;
    if ($(".subnet_openDHCP").prop("checked")) {
        dhcp = true;
    } else {
        dhcp = false;
    }

    //--------数据提交
    var subnet = {
        "subnet": {
            "name": "",
            "network_id": "",
            "ip_version": 4,
            "cidr": "10.0.0.1",
            "gateway_ip": "",
            "enable_dhcp": false,
            "allocation_pools": [],
            "dns_nameservers": []
        }
    }
    var subnetInfo = subnet['subnet'];
    if (sub_name == "") {
        alert("子网名称必填！");
        return;
    }
    subnetInfo.name = sub_name;
    if (private_net == "test") {
        alert("请选择私有网络！");
        return;
    }
    subnetInfo.network_id = private_net;
    subnetInfo.cidr = str_ip;
    if (gateWay == "")
        delete subnetInfo.gateway_ip;
    else
        subnetInfo.gateway_ip = gateWay;
    subnetInfo.enable_dhcp = dhcp;
    //--------地址池
    if ($(".Addrpool").val() != "") {
        var arr = $(".Addrpool").val().split("\n");

        var temp_arr = [];
        var temp;
        var object = { "start": "", "end": "" };
        for (var i = 0; i < arr.length; i++) {
            temp = arr[i].split(",");
            if (temp.length % 2 != 0) {
                alert("地址池起始地址有误！");
                return;
            }
            object.start = temp[0];
            object.end = temp[1];
            temp_arr[i] = object;
        }
        subnetInfo.allocation_pools = temp_arr;
    }
    //--------DNS服务
    if ($(".DNSserver").val() != "") {
        var arr = $(".DNSserver").val().split("\n");
        for (var i = 0; i < arr.length; i++) {
            subnetInfo.dns_nameservers[i] = arr[i];
        }
    }
    createSubnetAJAX(subnet);
});

function createSubnetAJAX(subnet) {
    console.log(JSON.stringify(subnet));
    var url_info;
    if (update_flag)
        url_info = "/subnet/create";
    else {
        delete subnet['subnet'].cidr;
        delete subnet['subnet'].ip_version;
        delete subnet['subnet'].network_id;
        url_info = "/subnet/update/" + subnet_tempid;
    }
    update_flag = false;
    $.ajax({
        type: "POST",
        data: JSON.stringify(subnet),
        contentType: "application/json",
        url: config['host'] + url_info + "?token=" + window.localStorage.token,
        success: function(data) {
            if (JSON.parse(data)['subnet'] == null || JSON.parse(data)['subnet'] == "undefined") {
                console.log(data);
                alert("请检查子网配置格式！");
            } else {
                window.location.reload();
                window.location.href = "#/net/net";
            }
        }
    });
}

//-------------编辑子网
var update_flag = false;
var subnet_tempid;
$(document).on("click", ".eidt_subnetInfo", function() {
    update_flag = true;
    var curr_id = this.id;
    subnet_tempid = this.id;
    var subnets = JSON.parse(localStorage.subnets_tempInfo)['subnets'];
    var subnet;
    for (var i = 0; i < subnets.length; i++) {
        if (subnets[i].id == curr_id) {
            subnet = subnets[i];
            break;
        }
    }
    $(".createsubnet_name").val(subnet.name);
    setNetselect();
    $(".private_selected option[value='" + id_net + "']").attr("selected", true);
    $(".private_selected").attr("disabled",true);
    var temp_cidr = subnet.cidr;
    if (temp_cidr != "") {
        var num = temp_cidr.split(".")[0];
        if (num == "192") {
            $("#ip_1").attr("checked", true);
            $("#ip_2").attr("checked", false);
            $("#ip_3").attr("checked", false);
            $("#ip1").val(temp_cidr.split(".")[2]);
        } else if (num == "10") {
            $(".createchoose_subnet").click();
            $("#ip_1").attr("checked", false);
            $("#ip_2").attr("checked", true);
            $("#ip_3").attr("checked", false);
            $("#ip2_1").val(temp_cidr.split(".")[1]);
            $("#ip2_2").val(temp_cidr.split(".")[2]);
            $("#ip2_3").val(temp_cidr.split("/")[0].split(".")[3]);
            $("#ip2_4").val(temp_cidr.split("/")[1]);
        } else {
            $(".createchoose_subnet").click();
            $("#ip_1").attr("checked", false);
            $("#ip_2").attr("checked", false);
            $("#ip_3").attr("checked", true);
            $("#ip3_1").val(temp_cidr.split(".")[1]);
            $("#ip3_2").val(temp_cidr.split(".")[2]);
            $("#ip3_3").val(temp_cidr.split("/")[0].split(".")[3]);
            $("#ip3_4").val(temp_cidr.split("/")[1]);
        }
        $("#ip1").attr("disabled", true);
        $("#ip2_1").attr("disabled", true);
        $("#ip2_2").attr("disabled", true);
        $("#ip2_3").attr("disabled", true);
        $("#ip2_4").attr("disabled", true);
        $("#ip3_1").attr("disabled", true);
        $("#ip3_2").attr("disabled", true);
        $("#ip3_3").attr("disabled", true);
        $("#ip3_4").attr("disabled", true);
    }
    $(".creategateway_adrr").val(subnet.gateway_ip);
    var pool_arr = subnet.allocation_pools;
    var pool_str = "";
    for (var i = 0; i < pool_arr.length; i++) {
        var pool = pool_arr[i];
        pool_str += pool.start + "," + pool.end + "\n";
    }
    if (pool_str != "")
        $(".Addrpool").val(pool_str);
    var dns_arr = subnet.dns_nameservers;
    var dns_str = "";
    for (var i = 0; i < dns_str.length; i++) {
        dns_str += dns_str[i] + "\n";
    }
    if (dns_str != "")
        $(".DNSserver").val(dns_str);
});

function set_subNet(data, i) {
    var str = '<tbody><tr><td><input type="checkbox" class="sub_checks" id="' + data.id + '"></td>' +
        '<td><a href="#/net/subnet-desc?' + i + '">' + data.name + '</a>' +
        '</td><td>' + data.cidr +
        '</td><td>' + 'ipv' + data.ip_version +
        '</td><td>' + data.gateway_ip +
        '</td><td><div class="btn-group"><button type="button" id="' + data.id + '" class="btn btn-default btn-sm eidt_subnetInfo" data-toggle="modal" data-target="#add-subnet">编辑子网</button>' +
        '<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"><span class="caret"></span>' +
        '<span class="sr-only">切换下拉菜单</span>' +
        '</button>' +
        '<ul class="dropdown-menu" role="menu">' +
        '<li id="' + data.id + '" class="delete_subnetSimple"><a href="javascript:void(0)"><font color="red">删除子网</font></a></li>' +
        '</ul>' +
        '</div>' +
        '</td>' +
        '</tr>' +
        '</tbody>';
    $(".sub_netInfo").append(str);
}


function setPortInfo(data, fixed_ips_str, i) {
    var str = '<tbody><tr><td><a href="#/net/port-desc?' + i + '">' + data.name +
        '</a></td><td>' + fixed_ips_str + '</td>' +
        '<td>' + data.device_owner + '</td>' +
        '<td>' + data.status + '</td>' +
        '<td>' + data.admin_state_up + '</td><td>' +
        '<div class="btn-group">' +
        '<button type="button" class="btn btn-default btn-sm">编辑端口</button>' +
        '<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">' +
        '<span class="caret"></span>' +
        '<span class="sr-only">切换下拉菜单</span>' +
        '</button>' +
        '<ul class="dropdown-menu" role="menu">' +
        '<li><a href="#">功能</a></li>' +
        '<li><a href="#">另一个功能</a></li>' +
        '<li><a href="#">其他</a></li>' +
        '</ul>' +
        '</div>' +
        '</td>' +
        '</tr>' +
        '</tbody>';
    $(".port_infos").append(str);
}
