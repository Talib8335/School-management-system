$(document).ready(function(){
	var class_name = sessionStorage.getItem("student_class");
	var db_name = sessionStorage.getItem("db_name");
		var database = window.indexedDB.open(db_name);
		database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("admission","readwrite");
		var access = permission.objectStore("admission");
		var key_name = access.getAllKeys();
		key_name.onsuccess = function(){
			var keys_array = this.result;
			var i;
			for(i=0;i<keys_array.length;i++)
			{
				var check_data = access.get(keys_array[i]);
				check_data.onsuccess = function(){
					var data = this.result;
					if(data.class == class_name)
					{
						var tr = document.createElement("TR");
						var pic_td = document.createElement("TD");
						var image = new Image();
						image.src = data.pic;
						image.width = "80";
						image.height = "80";
						pic_td.append(image);
						var sname_td = document.createElement("TD");
						sname_td.style.verticalAlign ="middle";
						sname_td.innerHTML = data.s_name; 
						var fname_td = document.createElement("TD");
						fname_td.style.verticalAlign ="middle";
						fname_td.innerHTML = data.f_name; 
						var mname_td = document.createElement("TD");
						mname_td.style.verticalAlign ="middle";
						mname_td.innerHTML = data.m_name; 
						var dob_td = document.createElement("TD");
						dob_td.style.verticalAlign ="middle";
						dob_td.innerHTML = data.dob; 
						var doa_td = document.createElement("TD");
						doa_td.style.verticalAlign ="middle";
						doa_td.innerHTML = data.doa; 
						var mo_td = document.createElement("TD");
						mo_td.style.verticalAlign ="middle";
						mo_td.innerHTML = data.mobile_one; 
						var mt_td = document.createElement("TD");
						mt_td.style.verticalAlign ="middle";
						mt_td.innerHTML = data.mobile_two; 
						var ad_td = document.createElement("TD");
						ad_td.style.verticalAlign ="middle";
						ad_td.innerHTML = data.address; 
						tr.append(pic_td);
						tr.append(sname_td);
						tr.append(fname_td);
						tr.append(mname_td);
						tr.append(dob_td);
						tr.append(doa_td);
						tr.append(mo_td);
						tr.append(mt_td);
						tr.append(ad_td);
						$(".student-table").append(tr);
						
						
						
					}

					



				}
			}


		}

	}
});

