;(function() {
    'use strict';

    var $form_add_task = $(".txtb")
    , notcomp_task_list = []
    , comp_task_list = []
    // , tast_datial = {}
    , $task_detail = $(".task-detail")
    , $task_detail_mask = $(".task-detail-mask")
    ; 

    init();

    // store.remove("task_list");
    // store.remove("comp_task_list");

    // console.log(task_list);


    render_notcomp_task_list();

    render_comp_task_list();

    $form_add_task.on("keyup", function(e) {
        e.preventDefault();

        if (e.keyCode == 13 && $(".txtb").val() != "") {
            var new_task = {};
            new_task.content = $(this).val();
            if (!new_task.content) return;

            add_task(new_task);
            $(".notcomp").html("");
            render_notcomp_task_list();

            // console.log(task_list);

            $('.txtb').val("");
        }
    });

    $task_detail_mask.on("click", function() {
        $(this).hide();
        $task_detail.hide();
    });

    function list_item_tpl(data, index) {
        var task = $("<div class='task' data-index=" + index + "></div>").text(data);
        var del = $("<i class='fas fa-trash-alt'></i>").click(function(){
            var p = $(this).parent();
            var temp = confirm("Are you sure to delete?");
            // temp ? p.remove() : null;
            if (temp) {
                p.remove();
                var index = p.attr("data-index");
                if (index == undefined || !notcomp_task_list[index]) return ;
                notcomp_task_list.splice(index,1);
                refresh_notcomp_task_list();
            } else {
                null;
            }
            
        });
        var check = $("<i class='fas fa-check'></i>").click(function(){
            var p = $(this).parent();
            p.remove();
            var index = p.attr("data-index");
            console.log(notcomp_task_list[index]);

            var new_task = {};
            new_task.content = p.text();
            new_task.desc = notcomp_task_list[index].desc;
            new_task.remind = notcomp_task_list[index].remind;
            
            if (index == undefined || !notcomp_task_list[index]) return ;
            notcomp_task_list.splice(index,1);
            refresh_notcomp_task_list();

            
            add_comp_task(new_task);
            refresh_comp_task_list()

            // $('.comp').append(p);
            // $(this).remove();
        });
        var detail = $("<i class='fas fa-ellipsis-h'></i>").click(function() {
            var p = $(this).parent();
            var content = p.text();
            var index = p.attr("data-index");
            
            show_task_detail(content,index,notcomp_task_list);

        });

        task.append(del, check, detail);
        return task;
    };

    function list_comp_item_tpl(data, index) {
        var task = $("<div class='task' data-index=" + index + "></div>").text(data);
        var del = $("<i class='fas fa-trash-alt'></i>").click(function(){
            var p = $(this).parent();
            var temp = confirm("Are you sure to delete?");
            // temp ? p.remove() : null;
            if (temp) {
                p.remove();
                var index = p.attr("data-index");
                if (index == undefined || !comp_task_list[index]) return ;
                comp_task_list.splice(index,1);
                refresh_comp_task_list();
            } else {
                null;
            }
        });
    
        var detail = $("<i class='fas fa-ellipsis-h'></i>").click(function() {
            $(".task-detail")
            var p = $(this).parent();
            var content = p.text();
            var index = p.attr("data-index");
            
            show_task_detail(content,index,comp_task_list);

        });

        task.append(del,detail);
        return task;
    };

    function add_task(new_task) {
        notcomp_task_list.push(new_task);
        store.set('notcomp_task_list',notcomp_task_list);
    }

    function add_comp_task(new_task) {
        comp_task_list.push(new_task);
        store.set('comp_task_list',comp_task_list);
    }


    function render_notcomp_task_list() {
        for (var i = 0; i < notcomp_task_list.length; i++) {
            $(".notcomp").append(list_item_tpl(notcomp_task_list[i].content, i));
        }
    }

    function render_comp_task_list() {
        for (var i = 0; i < comp_task_list.length; i++) {
            $(".comp").append(list_comp_item_tpl(comp_task_list[i].content, i));
        }
    }

    function refresh_notcomp_task_list() {
        $('.notcomp').html("")
        store.set("notcomp_task_list", notcomp_task_list);
        render_notcomp_task_list();
    };

    function refresh_comp_task_list() {
        $('.comp').html("")
        store.set("comp_task_list", comp_task_list);
        render_comp_task_list();
    }

    function show_task_detail(content, index, task_list) {
        console.log(task_list);
        $task_detail.html("");
        $task_detail.show();
        $task_detail_mask.show();
        var task_delete_trigger = $("<i class='fas fa-times'></i>").click(function(){
            $task_detail.hide();
            $task_detail_mask.hide();
        });
        var task_content = $("<input class='task-content'></input>").val(content);
        var task_detail = task_list[index].desc;
        var detail_text = $("<textarea class='text_area' rows='10' cols='20' placeholder='Add some comments to your event...'>").text(task_detail);
        var date_info = task_list[index].remind;
        var remind = $("<div class='remind'><input class='date-info' type='date'></div>").find(".date-info").val(date_info);

        var submit_button = $("<div><button type='submit'>Update</button></div>").on("click", function(){
            var data = {}
            data.content = $(".task-content").val();
            data.desc = $(".text_area").val(); 
            data.remind = $(".date-info").val();
            console.log(data);
            task_list[index] = data;
            if (task_list == notcomp_task_list) {
                refresh_notcomp_task_list();
            } else {
                refresh_comp_task_list();
            }
         });
        

        $task_detail.append(task_delete_trigger, task_content, detail_text, remind, submit_button);
    }

    function init() {
        notcomp_task_list = store.get('notcomp_task_list') || [];
        comp_task_list = store.get('comp_task_list') || [];
    }

    $("#notcomptoggler").on("click", function() {
        if ($(this).attr("class") == "fas fa-angle-down") {
            $(this).attr("class","fas fa-angle-up");
        } else {
            $(this).attr("class","fas fa-angle-down");
        }
        $(".notcomp").toggle(500);
    });
    $("#comptoggler").on("click", function() {
        if ($(this).attr("class") == "fas fa-angle-down") {
            $(this).attr("class","fas fa-angle-up");
        } else {
            $(this).attr("class","fas fa-angle-down");
        }
        $(".comp").toggle(200);
    });
})();
