(function ($) {

    var $table = $("#users-table");
    var $form = $("#users-edit-id");
    var type;

	$.getJSON("/user", function(usersList) {
        for (var i = 0; i < usersList.length; i++) {
        	var user = usersList[i];
            addRow(user);
        }
    });

    $table.click(function (e) {
        $row = $(e.target).parents(".row")[0];
        if (e.target.textContent === "Remove"){
            $.ajax({
                type: "delete",
                url: "user?id=" + $row.id,
                contentType: "application/json",
                dataType: "json",
                complete: function(result){  // чому не запускаэть на функції success ???
                    $("#" + result.responseText).remove();
                }});
        }

        if (e.target.textContent === "Edit"){
            $.getJSON("user?id=" + $row.id, function(usersList) {
                $($form).removeClass("users-edit-hidden");        // можливо стукати до всіх через id ??????????????????
                $form[0][0].value = usersList.id;
                $form[0][1].value = usersList.fullName;
                $form[0][2].value = usersList.birthday;
                $form[0][3].value = usersList.profession;
                $form[0][4].value = usersList.address;
                country();                              // выдобразити прваильно краъну
                $form[0][5].option = usersList.country;
                $form[0][6].value = usersList.shortInfo;
                $form[0][7].value = usersList.fullInfo;
                //$form[0][4].value = usersList.email;

            });
        }
    });

    $("#create").click( function(e) {
            $($form).removeClass("users-edit-hidden");
            country();
            e.preventDefault();
    });

	$("#cancel").click( function(e) {
		$($form).addClass("users-edit-hidden");
        e.preventDefault();
	});


	$($form).submit( function(e) {
        e.preventDefault();
        $(this).addClass("users-edit-hidden");

        var toCreate = {
            "id": $form[0][0].value,
            "fullName": $form[0][1].value,   // чи правильний доступ до значень форм
            "birthday": $form[0][2].value,
            "profession": $form[0][3].value,
            "address": $form[0][4].value,  // email  і address не повинно бути обним значенням
            "country": $form[0][5].value,
            "shortInfo": $form[0][6].value,
            "fullInfo": $form[0][7].value
            //"email": $form[0][4].value
        };
        type = toCreate.id === "" ? "POST" : "PUT";

        $.ajax({
                type: type,
                url: "/user",
                contentType: "application/json",
                dataType: "JSON",
                data: JSON.stringify(toCreate)
            }).done(function(user) {
                addRow(user);
                clearForm();
            });
            return false;

    });

    function country() {
        $.getJSON("/countries", function (data) {
            for (var i = 0; i < data.length; i++) {
                $("<option></option>")
                    .appendTo("#country")
                    .text(data[i])
                    .value = data[i];
            }
        });
    }

	function addRow(user){
        var $tr;
        if (type === "PUT"){
            $tr = $("#"+user.id);
            $tr.empty();
        }else {
            $tr = $("<tr></tr>")
                .appendTo($table)
                .addClass("row")
                .attr("id", user.id);
        }
        $("<td></td>")
            .text(user.fullName)
            .appendTo($tr);
        $("<td></td>")
            .text(user.profession)
            .appendTo($tr);
        $("<td></td>")
            .text(user.shortInfo)
            .appendTo($tr);
        var $td = $("<td></td>")
            .appendTo($tr);
        $("<button></button>")
            .text("Remove")
            .appendTo($td);
        $("<button></button>")
            .text("Edit")
            .appendTo($td);
	}

	function clearForm() {

	    for ( var i = 0; i < $form[0].length; i++){
            $form[0][i].value = "";
        }
    }
}(jQuery));








