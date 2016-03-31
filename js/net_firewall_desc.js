$(function() {
    var num = window.location.href.split("?")[1];
    var fireWall = JSON.parse(localStorage.fireWallsInfo)[num];
    var policy_Info = JSON.parse(localStorage.policyInfo)[num];
     var router_Infos = JSON.parse(localStorage.routerInfo)[num];
    //console.log(localStorage.routerInfo);
    //-----状态的转换
    if (fireWall.status == "ACTIVE")
        fireWall.status = "运行中";
    else
        fireWall.status = "状态待补充";
    //-----管理员状态的转换
    if (fireWall.admin_state_up == true || fireWall.admin_state_up == 'true')
        fireWall.admin_state_up = "上";
    else
        fireWall.admin_state_up = "状态待补充";
    //-----描述的判断
    if (fireWall.description == "" || fireWall.description == null) {
        fireWall.description = "无";
    }


    $("#fireWall_name").html(fireWall.name);
    $("#fireWall_desc").html(fireWall.description);
    $("#fireWall_id").html(fireWall.id);
    $("#fireWall_proId").html(fireWall.tenant_id);
    var str='<a href="#/net/firewall-strategy-desc?'+policy_Info.id+'" id="fireWall_policyId">'+policy_Info.id+'</a>';
    localStorage.policyInfo="["+JSON.stringify(policy_Info)+"]";
    console.log(localStorage.policyInfo);
    $("#policy_ID").append(str);
    $("#fireWall_status").html(fireWall.status);
    $("#fireWall_adminStatus").html(fireWall.admin_state_up);
    var str="";
    for(var i=0;i<router_Infos.length;i++)
    {
       var router=router_Infos[i];
       str+=router.name+"<br/>"
    }
    $("#fireWall_router").html(str);

});
