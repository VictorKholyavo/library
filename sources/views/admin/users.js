import {JetView} from "webix-jet";

export default class DataView extends JetView{
	config(){
		return { 
			view:"datatable",
			localId: "usersEditTable",
			editable: true, 
			columns: [
				{id: "id", header: "id of user"},
				{id: "firstname", editor: "text", header: "Firstname"},
				{id: "surname", editor: "text", header: "Surname"},
				{id: "patronymic", editor: "text", header: "Patronymic"},
				{id: "passport", editor: "text", header: "Passport"},
				{id: "dateofbirth", header: "Date of Birth"},
				{id: "address", header: "Address"},
				{id: "phones", header: "Phones"},
				{id: "cardnumber", header: "Card number", fillspace: true},
				{id: "role", header: "Role"},
			],
			url: "http://localhost:3016/users",
			save: {
				url: "rest->http://localhost:3016/users",
				updateFromResponse: true
			},
			css:"webix_shadow_medium" 
		};
	}
	init(){
	}
}