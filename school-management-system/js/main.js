window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
if(!window.indexedDB)
{
	document.write("PLEASE UPDATE YOUR BROWSER");
}

else{
$(document).ready(function(){
	$("#register-form").submit(function(){
		var check_database = window.indexedDB.databases();
		check_database.then(function(db_list){
			if(db_list.length == 0)
			{

				register();
			}

			else{
				$("#message").removeClass("d-none");
				$("#message").addClass("alert-warning");
				$("#message").append("<b>Registration failed !</b> <a href='https://wapinstitute.com'>Please purchase multi version</a> <i class='fa fa-trash ml-4' data-toggle='tooltip' title='To manage another school please delete currently used school record' id='tooltip' style='cursor:pointer'></i>");
				$("#tooltip").tooltip();
				$("#tooltip").click(function(){
					$("#confirm").modal();
					$("#delete-btn").click(function(){
						var all_db = window.indexedDB.databases();
						all_db.then(function(all_db_list){
							var verfiry_delete = window.indexedDB.deleteDatabase(all_db_list[0].name);
							verfiry_delete.onsuccess = function(){
								$("#register-form").trigger('reset');
								$("#message").addClass("d-none");
								$(".delete-message").html("");
								$(".delete-success-notice").removeClass("d-none");
							}
							
						});
					});
				});
				
			}
		});
		return false;
	});



	function register(){
		var school_name = $("#school-name").val();
		var tag_line = $("#tag-line").val();
		var email = $("#email").val();
		var password = $("#password").val();
		var website = $("#website").val();
		var mobile = $("#mobile").val();
		var phone = $("#phone").val();
		var address = $("#address").val();
		var database = window.indexedDB.open(school_name);
		database.onsuccess = function(){
			$("#message").removeClass("d-none");
			$("#message").addClass("alert-success");
			$("#message").append("<b>Success ! </b>dear admin please login...");
			$("#register-form").trigger('reset');
			setTimeout(function(){$("#message").addClass("d-none");$("[href='#login']").click();},2000);
		}

		database.onerror = function(){
			$("#message").removeClass("d-none");
			$("#message").addClass("alert-warning");
			$("#message").append("<b>Oops ! </b>something wrong please contact 9934946118...");
		}

		database.onupgradeneeded = function(){
			var data = {
				school_name:school_name,
				tag_line : tag_line,
				email : email,
				password : password,
				website : website,
				mobile : mobile,
				phone : phone,
				address :address,
				school_logo : "",
				director_signature : "",
				principal_signature : ""
			};
			var idb = this.result;
			var object = idb.createObjectStore("about_school",{keyPath:"school_name"});
			idb.createObjectStore("fee",{keyPath:"class_name"});
			idb.createObjectStore("admission",{keyPath:"adm_no"});
			object.add(data);
		}
	}
});
}





// login
$(document).ready(function(){
	$("#login-form").submit(function(){
		var username = $("#username").val();
		var password = $("#login-password").val();
		var login_data = {
			username : username,
			password : password
		};

		var json_data = JSON.stringify(login_data);
		sessionStorage.setItem("login",json_data);
		if(sessionStorage.getItem("login") != null)
		{
			// find users from database
			var user_database = window.indexedDB.databases();
			user_database.then(function(pending_obj){
				var i;
				for(i=0;i<pending_obj.length;i++)
				{
					var db_name = pending_obj[i].name;
					sessionStorage.setItem("db_name",db_name);
					var database = window.indexedDB.open(db_name);
					database.onsuccess = function(){
						var idb = this.result;
						var permission = idb.transaction("about_school","readwrite");
						var access = permission.objectStore("about_school");
						var json_data = access.get(db_name);
						json_data.onsuccess = function(){
							var user = this.result;
							if(user)
							{
								var db_username = user.email;
								var db_password = user.password;
								var session_data = JSON.parse(sessionStorage.getItem("login"));
								if(session_data.username == db_username)
								{
									if(session_data.password == db_password)
									{
										window.location = "success/welcome.html";
									}

									else{
										$("#login-message").removeClass("d-none");
										$("#login-message").addClass("alert-warning");
										$("#login-message").append("<b>Wrong password</b>");
										$("#login-form").trigger('reset');
									}
								}

								else{
										$("#login-message").removeClass("d-none");
										$("#login-message").addClass("alert-warning");
										$("#login-message").append("<b>User not found </b>");
										$("#login-form").trigger('reset');
								}

							}

							else{
										$("#login-message").removeClass("d-none");
										$("#login-message").addClass("alert-warning");
										$("#login-message").append("<b>Key not found</b>");
										$("#login-form").trigger('reset');
							}
						}
					}
				}
			});
		}

		else{
			$("#login-message").removeClass("d-none");
			$("#login-message").addClass("alert-warning");
			$("#login-message").append("<b>session failed !</b> please try again");
			setTimeout(function(){$("#login-message").addClass("d-none");$("#login-form").trigger('reset');},2000);
		}
		return false;
	});
});


