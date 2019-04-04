import {JetView} from "webix-jet";

export default class DataView extends JetView{
	config(){
		return { 
			view:"datatable", 
			columns: [
				{id: "firstname", header: "firstname"},
				{id: "surname", header: "surname"},
				{id: "patronymic", header: "patronymic"},
				{id: "passport", header: "passport"},
				{id: "dateofbirth", header: "dateofbirth"},
				{id: "address", header: "address"},
				{id: "phones", header: "phones"},
				{id: "cardnumber", header: "cardnumber"},
				{id: "role", header: "Role"},
			],
			url: "http://localhost:3016/users/getInfo",
			css:"webix_shadow_medium" 
		};
	}
	init(){
	}
}