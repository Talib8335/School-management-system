$(document).ready(function(){
	var db_name = sessionStorage.getItem("db_name");
	var a_no = sessionStorage.getItem("a_no");
	$(".school-name").html(db_name);
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("about_school","readwrite");
		var access = permission.objectStore("about_school");
		var check_data = access.get(db_name);
		check_data.onsuccess = function(){
			var data = this.result;
			$(".tag-line").html(data.tag_line);
			$(".cell").html("OFFICE CELL : "+data.mobile+", "+data.phone);
		}

		var s_permission = idb.transaction("admission","readwrite");
		var s_access = s_permission.objectStore("admission");
		var admission = s_access.get(Number(a_no));
		admission.onsuccess = function(){
			var data = this.result;
			if(data)
			{
				$(".s-name").html(data.s_name);
				var image = new Image();
				image.src = data.pic;
				image.width = "150";
				image.height = "150";
				$("#pic").html(image);
				$(".gender").html(data.gender);

			}

			else{
				alert("Student not found !");

			}
		}
	}
});