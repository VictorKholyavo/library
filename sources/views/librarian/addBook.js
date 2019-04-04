import {JetView} from "webix-jet";

export default class FormforBookView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "form",
					localId: "form",
					scroll: false,
					elements: [
						{
							view: "text",
							name: "title",
							label: "Title",
							labelWidth: 120,
						},
						{
							view: "text",
							name: "pages",
							label: "Pages",
							labelWidth: 120,
						},
						{
							view: "text",
							name: "year",
							label: "Year",
							labelWidth: 120,
						},
						{
							view: "text",
							name: "author",
							label: "Author",
							labelWidth: 120,
						},
						{
							view: "text",
							name: "publisher",
							label: "Publisher",
							labelWidth: 120,
						},
						{
							view: "text",
							name: "country",
							label: "Country",
							labelWidth: 120,
						},
						{
							view: "text",
							name: "availableCount",
							label: "Available count",
							labelWidth: 120,
						},
						{
							view: "richselect",
							name: "genre",
							localId: "genre",
							label: "Genre",
							labelWidth: 120,
							options:{
								body: {
									template: "#genre#",
									url:"http://localhost:3016/genres",
								}
							},
						},
						{
							view: "button",
							localId: "saveButton",
							value: "Save",
							click: () => {
								const values = this.$getForm().getValues();
								this.saveProduct(values);
							}
						}
					
						// {
						// 	view: "richselect",
						// 	name: "type",
						// 	localId: "type",
						// 	label: "Type of Product",
						// 	labelWidth: 120,
						// 	options: {
						// 		on: {
						// 			onShow: function () {
						// 				let typeValue = this.$scope.$$("manufacturer").data.value;
						// 				console.log(typeValue);
						// 				this.getBody().filter(function(obj) {
						// 					console.log(obj);
						// 					for (var i = 0; i < obj.data.length; i++) {
						// 						 if (obj.data[i].$id == typeValue) {
						// 							return obj
						// 						 }
						// 					}
						// 				});
						// 			}
						// 		},
						// 		body: {
						// 			template: "#title#",
						// 			url: "http://localhost:3014/types"
						// 		}
						// 	}
						// },
					]
				},
				{

				}
			]

		};
	}
	saveProduct(values) {
		if (this.$getForm().validate()) {
            console.log(values)
			// webix.ajax().post("http://localhost:3014/products", values);
			// this.$getForm().clear();
			// this.$getForm().clearValidation();
		}
		else {
			webix.message({ type:"error", text:"Invalid info" });
		}
	}
	init() {
	}
	$getForm() {
		return this.$$("form");
	}
}
