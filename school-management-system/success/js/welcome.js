// add item
$(document).ready(function(){
	$(".add-field-btn").click(function(){
		var add_element = '<div class="input-group mb-4"><input type="text" name="course-name" class="course-name form-control" placeholder="Hostel fee"><input type="text" name="course-fee" class="form-control course-fee" placeholder="500"><div class="input-group-append"><span class="input-group-text bg-warning">Monthly</span></div></div>';
		$(".add-field-area").append(add_element);
	});
});

// set fee

$(document).ready(function(){
	$(".set-fee-btn").click(function(){
		var class_name = $(".class-name").val();
		var course_fee = [];
		var course_name = [];
		var i;
		$(".course-fee").each(function(i){
			course_fee[i] = $(this).val();
		});

		$(".course-name").each(function(i){
			course_name[i] = $(this).val();
		});

		var fee_object = {
			class_name : class_name,
			course_name : course_name,
			course_fee : course_fee

		};

		// store data in database
		var db_name = sessionStorage.getItem("db_name");
		var database = window.indexedDB.open(db_name);
		database.onsuccess = function(){
			var idb = this.result;
			var permission = idb.transaction("fee","readwrite");
			var access = permission.objectStore("fee");
			var fee_object_store = access.put(fee_object);
			fee_object_store.onsuccess = function(){
				alert("success");
			}

			fee_object_store.onerror = function(){
				alert("error");
			}
		}
	});
});

// show fee
$(document).ready(function(){
	$("#fee-menu").click(function(){
		$("#show-fee").html('');
		$("#fee-modal").modal();
		var db_name = sessionStorage.getItem("db_name");
		var database = window.indexedDB.open(db_name);
		database.onsuccess = function(){
			var idb = this.result;
			var permission = idb.transaction("fee","readwrite");
			var access = permission.objectStore("fee");
			var get_all_keys = access.getAllKeys();
			get_all_keys.onsuccess = function(){
				var keys = this.result;
				var i,j;
				for(i=0;i<keys.length;i++)
				{
					
					var key_data = access.get(keys[i]);
					key_data.onsuccess = function(){
						var fee = this.result;
						var ul = document.createElement("UL");
						ul.className = "nav nav-tabs";
						var li = document.createElement("LI");
						li.className = "nav-item";
						var a = document.createElement("A");
						a.className = "nav-link active";
						a.href = "#";
						a.innerHTML = "Class - "+fee.class_name;
						li.append(a);
						ul.append(li);
						$("#show-fee").append(ul);
						var table = document.createElement("TABLE");
						table.className = "table border-left border-right border-bottom text-center";
						var tr_for_th = document.createElement("TR");
						var tr_for_td = document.createElement("TR");
						for(j=0;j<fee.course_name.length;j++)
						{
							var th = document.createElement("TH");
							th.className = "border-0";
							th.innerHTML = fee.course_name[j];
							tr_for_th.append(th);
						}

						var th_edit = document.createElement("TH");
						th_edit.className ="border-0";
						th_edit.innerHTML = "edit";
						tr_for_th.append(th_edit);

						var th_delete = document.createElement("TH");
						th_delete.className = "border-0";
						th_delete.innerHTML = "delete";
						tr_for_th.append(th_delete);

						for(j=0;j<fee.course_fee.length;j++)
						{
							var td = document.createElement("TD");
							td.className = "border-0";
							td.innerHTML = fee.course_fee[j];
							tr_for_td.append(td);
						}

						// edit fee
						var td_edit_icon = document.createElement("TD");
						td_edit_icon.className = "border-0";
						td_edit_icon.innerHTML = "<i class='fa fa-edit'></i>";
						tr_for_td.append(td_edit_icon);
						
						td_edit_icon.onclick = function(){
							var table = this.parentElement.parentElement;
							var ul = table.previousSibling;
							var a = ul.getElementsByTagName("A");
							var class_name = a[0].innerHTML.split(" ");
							$(".class-name").val(class_name[2]);
							var tr = table.getElementsByTagName("TR");
							var th = tr[0].getElementsByTagName("TH");
							var td = tr[1].getElementsByTagName("TD");
							var course_name = document.getElementsByClassName("course-name");
							var course_fee = document.getElementsByClassName("course-fee");
							course_name[0].parentElement.remove();
							var i;
							for(i=0;i<th.length-2;i++)
							{
								$(".add-field-btn").click();
								course_name[i].value = th[i].innerHTML;
								course_fee[i].value = td[i].innerHTML;
								$("#fee-modal").modal('hide');
							}
							$(".set-fee").addClass("animated shake");
						}

						// delete fee
						var td_delete_icon = document.createElement("TD");
						td_delete_icon.className = "border-0";
						td_delete_icon.innerHTML = "<i class='fa fa-trash'></i>";
						tr_for_td.append(td_delete_icon);

						
						td_delete_icon.onclick = function(){
							var ul = this.parentElement.parentElement.previousSibling;
							var a = ul.getElementsByTagName("A");
							var key_name_with_num = a[0].innerHTML;
							var key_name = key_name_with_num.split(" ");
							var db_name = sessionStorage.getItem("db_name");
							var database = window.indexedDB.open(db_name);
							database.onsuccess = function(){
								var idb = this.result;
								var permission = idb.transaction("fee","readwrite");
								var access = permission.objectStore("fee");
								var delete_notice = access.delete(key_name[2]);
								delete_notice.onsuccess = function(){
									alert("success");
									td_delete_icon.parentElement.parentElement.previousSibling.remove();
									td_delete_icon.parentElement.parentElement.remove();
								}
							}
						}

						table.append(tr_for_th);
						table.append(tr_for_td);
						$("#show-fee").append(table);

					}

				}
			}
		}
	});
});


// retrive class name
$(document).ready(function(){
	var db_name = sessionStorage.getItem("db_name");
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("fee","readwrite");
		var access = permission.objectStore("fee");
		var key_name = access.getAllKeys();
		key_name.onsuccess = function(){
			var keys = this.result;
			var i;
			for(i=0;i<keys.length;i++)
			{
				var option = document.createElement("OPTION");
				option.innerHTML = keys[i];
				$(".class").append(option);
			}
			for(i=0;i<keys.length;i++)
			{
				var option = document.createElement("OPTION");
				option.innerHTML = keys[i];
				$(".find-student").append(option);
			}
		}
	}
});

// upload and preview image
$(document).ready(function(){
	$(".upload-pic").on("change",function(){
		
			var file = this.files[0];
			var url = URL.createObjectURL(file);
			$(".show-pic").attr("src",url);
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(){
				sessionStorage.setItem("upload_pic",this.result);
			}
	
	});
});

// admission
$(document).ready(function(){
	$(".admit-btn").click(function(){
		var a_no,i,max=0;
		var db_name = sessionStorage.getItem("db_name");
		var database = window.indexedDB.open(db_name);
		database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("admission","readwrite");
		var access = permission.objectStore("admission");
		var key_name = access.getAllKeys();
		key_name.onsuccess = function(){
				var keys_array = this.result;
				if(keys_array.length==0)
				{
					a_no = 1;
				}

				else{
					for(i=0;i<keys_array.length;i++)
					{
						var number = Number(keys_array[i]);
						if(number>max)
						{
							max = number;
						}
					}

					a_no = max + 1;

				}
var date = new Date($(".dob").val());
		var dob_day = date.getDate();
		var dob_month = date.getMonth()+1;
		var dob_year = date.getFullYear();
		var dob = dob_day+"/"+dob_month+"/"+dob_year;
		var c_date = new Date();
		var doa_day = c_date.getDate();
		var doa_month = c_date.getMonth()+1;
		var doa_year = c_date.getFullYear();
		var doa = doa_day+"/"+doa_month+"/"+doa_year;
		if(sessionStorage.getItem("upload_pic") != null)
		{
		var admission = {
			adm_no : a_no,
			s_name : $(".s-name").val(),
			f_name : $(".f-name").val(),
			m_name : $(".m-name").val(),
			dob : dob,
			gender : $(".gender").val(),
			mobile_one : $(".mobile-one").val(),
			mobile_two : $(".mobile-two").val(),
			class : $(".class").val(),
			admit_in : $(".admit-in").val(),
			address : $(".address").val(),
			doa : doa,
			pic : sessionStorage.getItem("upload_pic"),
			invoice : []

			};

			 sessionStorage.removeItem("upload_pic");
			 var db_name = sessionStorage.getItem("db_name");
			 var database = window.indexedDB.open(db_name);
			 database.onsuccess = function(){
			 	var idb = this.result;
			 	var permission = idb.transaction("admission","readwrite");
			 	var access = permission.objectStore("admission");
			 	var check_admission = access.add(admission);
			 	check_admission.onsuccess = function(){
			 		var alert = "<div class='alert alert-success'><i class='fa fa-close close' data-dismiss='alert'></i><b>Admission success !</b> <a href='admission_slip.html'>get admission document</a></div>";
			 		$(".admit-notice").html(alert);
			 		adm_no();
			 	}

			 	check_admission.onerror = function(){
			 		var alert = "<div class='alert alert-warning'><i class='fa fa-close close' data-dismiss='alert'></i><b>Admission failed !</b></div>";
			 		$(".admit-notice").html(alert);
			 	}
			 }
		}

		else{
			alert("Please upload the student pic");
		}

			}
		}
	});
});

// sidebar 
$(document).ready(function(){
	var db_name = sessionStorage.getItem("db_name");
	$(".school-name").html(db_name);
	$(".school-name").css({textTransform:"uppercase"});
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("about_school","readwrite");
		var access = permission.objectStore("about_school");
		var check_data = access.get(db_name);
		check_data.onsuccess = function(){
			var school_information = this.result;
			$(".tag-line").html(school_information.tag_line);
		}
	}

});


// admission number
function adm_no(){
	var max_no = 0;
	var db_name = sessionStorage.getItem("db_name");
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("admission","readwrite");
		var access = permission.objectStore("admission");
		var check_data = access.getAllKeys();
		check_data.onsuccess = function(){
			var keys_array = this.result;
			var i;
			for(i=0;i<keys_array.length;i++)
			{
				if(keys_array[i]>max_no)
				{
					max_no = keys_array[i];
				}
			}

			var a_no = max_no+1;
			sessionStorage.setItem("a_no",max_no);
			$(".a-no").html("A/No : "+a_no);


		}
	}

};

adm_no();

// find students
$(document).ready(function(){
	$(".find-btn").click(function(){
		var a_no = $(".find-admission-no").val();
		sessionStorage.setItem("a_no",a_no);
		window.location = "admission_slip.html";
	});
});

// show signature and logo
$(document).ready(function(){
	var db_name = sessionStorage.getItem("db_name");
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("about_school","readwrite");
		var access = permission.objectStore("about_school");
		var check_data = access.get(db_name);
		check_data.onsuccess = function(){
			var data = this.result;
			if(data.director_signature == "")
			{
				$(".d-sign-input").removeClass("d-none");
			}

			else{
				$(".d-sign-con").removeClass("d-none");
				var signature = data.director_signature;
				var image = new Image();
				image.src = signature;
				image.width = "150";
				image.height = "50";
				$(".d-sign").html(image);
			}
		}
	}
	
});

// upload director photo
$(document).ready(function(){
	$("#director").on("change",function(){
		var file = this.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(){
			var signature = this.result;
			var db_name = sessionStorage.getItem("db_name");
			var database = window.indexedDB.open(db_name); 
			database.onsuccess = function(){
				var idb = this.result;
				var permission = idb.transaction("about_school","readwrite");
				var access = permission.objectStore("about_school");
				var check_data = access.get(db_name);
				check_data.onsuccess = function(){
					var data = this.result;
					data.director_signature = signature;
					var update = access.put(data);
					update.onsuccess = function(){
						window.location = location.href;
					}

					update.onerror = function(){
						alert("update failed");
					}
				}
			}
		}
	});
});


// delete director signature
$(document).ready(function(){
	$(".d-sign-icon").on("click",function(){
			var db_name = sessionStorage.getItem("db_name");
			var database = window.indexedDB.open(db_name); 
			database.onsuccess = function(){
				var idb = this.result;
				var permission = idb.transaction("about_school","readwrite");
				var access = permission.objectStore("about_school");
				var check_data = access.get(db_name);
				check_data.onsuccess = function(){
					var data = this.result;
					data.director_signature = "";
					var update = access.put(data);
					update.onsuccess = function(){
						window.location = location.href;
					}

					update.onerror = function(){
						alert("update failed");
					}
				}
			}
		
	});
});

// show principal signature and logo
$(document).ready(function(){
	var db_name = sessionStorage.getItem("db_name");
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("about_school","readwrite");
		var access = permission.objectStore("about_school");
		var check_data = access.get(db_name);
		check_data.onsuccess = function(){
			var data = this.result;
			if(data.principal_signature == "")
			{
				$(".p-sign-input").removeClass("d-none");
			}

			else{
				$(".p-sign-con").removeClass("d-none");
				var signature = data.principal_signature;
				var image = new Image();
				image.src = signature;
				image.width = "150";
				image.height = "50";
				$(".p-sign").html(image);
			}
		}
	}
	
});

// upload principal photo
$(document).ready(function(){
	$("#principal").on("change",function(){
		var file = this.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(){
			var signature = this.result;
			var db_name = sessionStorage.getItem("db_name");
			var database = window.indexedDB.open(db_name); 
			database.onsuccess = function(){
				var idb = this.result;
				var permission = idb.transaction("about_school","readwrite");
				var access = permission.objectStore("about_school");
				var check_data = access.get(db_name);
				check_data.onsuccess = function(){
					var data = this.result;
					data.principal_signature = signature;
					var update = access.put(data);
					update.onsuccess = function(){
						window.location = location.href;
					}

					update.onerror = function(){
						alert("update failed");
					}
				}
			}
		}
	});
});


// delete principal signature
$(document).ready(function(){
	$(".p-sign-icon").on("click",function(){
			var db_name = sessionStorage.getItem("db_name");
			var database = window.indexedDB.open(db_name); 
			database.onsuccess = function(){
				var idb = this.result;
				var permission = idb.transaction("about_school","readwrite");
				var access = permission.objectStore("about_school");
				var check_data = access.get(db_name);
				check_data.onsuccess = function(){
					var data = this.result;
					data.principal_signature = "";
					var update = access.put(data);
					update.onsuccess = function(){
						window.location = location.href;
					}

					update.onerror = function(){
						alert("update failed");
					}
				}
			}
		
	});
});

// upload school logo
$(document).ready(function(){
	$(".school-input").on("change",function(){
		var file = this.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(){
			var logo = this.result;
			var db_name = sessionStorage.getItem("db_name");
			var database = window.indexedDB.open(db_name); 
			database.onsuccess = function(){
				var idb = this.result;
				var permission = idb.transaction("about_school","readwrite");
				var access = permission.objectStore("about_school");
				var check_data = access.get(db_name);
				check_data.onsuccess = function()
				{
					var data = this.result;
					data.school_logo = logo;
					var update = access.put(data);
					update.onsuccess = function(){

						window.location = location.href;
					}

					update.onerror = function(){
						alert("Update failed");
					}
				}

			}
		}

	});
});

// show school logo
$(document).ready(function(){
	var db_name = sessionStorage.getItem("db_name");
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("about_school","readwrite");
		var access = permission.objectStore("about_school");
		var check_data = access.get(db_name);
		check_data.onsuccess = function(){
			var data = this.result;
			if(data.school_logo != "")
			{
				var logo = data.school_logo;
				var image = new Image();
				image.src = logo;
				image.width = "110";
				image.height = "100";
				$(".show-pic").html(image);
			}

			
		}
	}
	
});

// invoice
$(document).ready(function(){
	$(".invoice-btn").click(function(){
		var a_no = Number($(".admission-no").val());
		var invoice_date = $(".invoice-date").val();
		var db_name = sessionStorage.getItem("db_name");
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("admission","readwrite");
		var access = permission.objectStore("admission");
		var check_data = access.get(a_no);
		check_data.onsuccess = function(){
			var data = this.result;
			if(data)
			{
				var class_name = data.class;
				var fee_permission = idb.transaction("fee","readwrite");
				var fee_access = fee_permission.objectStore("fee");
				var check_fee_data = fee_access.get(class_name);
				check_fee_data.onsuccess = function(){
					var fee_data = this.result;
					if(fee_data)
					{
						var invoice_no;
						if(data.invoice.length == 0)
						{
							invoice_no = 1;
						}

						else{
							invoice_no = data.invoice.length+1;
						}
						var invoice_data = {
							invoice_no : invoice_no,
							invoice_date : invoice_date,
							course_name : fee_data.course_name,
							course_fee : fee_data.course_fee
						}

						  var update_permission = idb.transaction("admission","readwrite");
						  var update_access = update_permission.objectStore("admission");
						  var update_check_data = update_access.get(a_no);
						  update_check_data.onsuccess = function(){
						  	var update_object = this.result;
						  	update_object.invoice.push(invoice_data);
						  	var update = update_access.put(update_object);
						  	update.onsuccess = function(){
						  		sessionStorage.setItem("invoice_a_no",a_no);
						  		window.location = "invoice.html";
						  	}

						  	update.onerror = function(){
						  		alert("invoice failed");
						  	}
						  }

					}

					else{
						alert("fee not found please set the fee");
					}
				}

			}

			else{
				alert("student not found")
			}
		}

		}

		});
});

// find students by class
$(document).ready(function(){
	$(".find-student").on("change",function(){
		sessionStorage.setItem("student_class",this.value);
		window.location = "students.html";
	});
});