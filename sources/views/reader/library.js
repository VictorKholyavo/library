import {JetView} from "webix-jet";

export default class DataView extends JetView{
	config(){
		return { 
			view:"datatable", 
			localId: "library",
			columns: [
				{id: "firstname", header: "firstname"},
			],
			url: "http://localhost:3016/users/getInfo",
			css:"webix_shadow_medium" 
		};
	}
	init(){
	}
}