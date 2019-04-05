import {JetView} from "webix-jet";

export default class PersonalPageView extends JetView{
	config(){
		const form = {
			view: "form",
			localId: "form",
			scroll: false,
			elements: [
				{
					view: "text",
					name: "firstname",
					label: "Firstname",
					labelWidth: 100
				},
				{
					view: "text",
					name: "surname",
					label: "Surname",
					labelWidth: 100
				},
				{
					view: "text",
					name: "patronymic",
					label: "Patronymic",
					labelWidth: 100
				},
				{
					view: "text",
					name: "passport",
					label: "Passport",
					labelWidth: 100
				},
				{
					view: "text",
					name: "dateofbirth",
					label: "Date of Birth",
					labelWidth: 100
				},
				{
					view: "text",
					name: "address",
					label: "Address",
					labelWidth: 100
				},
				{
					view: "text",
					name: "phones",
					label: "Phones",
					labelWidth: 100
				},
				{
					view: "button",
					localId: "updateButton",
					value: "Save",
					click: () => {
						const newValues = this.$getForm().getValues();
						this.savePersonalInformation(newValues);
					}
				},
			],
			rules: {
				$all: webix.rules.isNotEmpty
			}
		}
		return { 
			cols: [{}, {rows: [{}, form, {}]}, {}]
			// view:"datatable",
			// editable: true, 
			// columns: [
			// 	{id: "firstname", header: "firstname", editor: "text"},
			// 	{id: "surname", header: "surname", editor: "text"},
			// 	{id: "patronymic", header: "patronymic", editor: "text"},
			// 	{id: "passport", header: "passport", editor: "text"},
			// 	{id: "dateofbirth", header: "dateofbirth"},
			// 	{id: "address", header: "address", editor: "text"},
			// 	{id: "phones", header: "phones"},
			// 	{id: "cardnumber", header: "cardnumber", editor: "text"},
			// 	{id: "role", header: "Role"},
			// ],
			// url: "http://localhost:3016/users/:id",
			// save: {
			// 	url: "rest->http://localhost:3016/users",
			// 	updateFromResponse: true
			// },
			// css:"webix_shadow_medium" 
		};
	}
	$getForm() {
		return this.$$("form");
	}
	savePersonalInformation(newValues) {
		webix.ajax().put("http://localhost:3016/users/user" + newValues.id + "", newValues);
	}
	init(){
		let form = this.$getForm();
		webix.ajax().get("http://localhost:3016/users/user/:id").then(function (response) {
			response = response.json();
			form.setValues(response);
		});
        
	}
}