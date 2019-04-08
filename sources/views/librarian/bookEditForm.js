import { JetView } from "webix-jet";
let counter = 0;
export default class FormforBookView extends JetView {
	config() {
		const form = {
			view: "form",
			localId: "form",
			scroll: false,
			elements: [
				{
					view: "text",
					name: "title",
					label: "Title",
					labelWidth: 120
				},
				{
					view: "text",
					name: "pages",
					label: "Pages",
					labelWidth: 120
				},
				{
					view: "text",
					name: "year",
					label: "Year",
					labelWidth: 120
				},
				{
					view: "text",
					name: "author",
					label: "Author",
					labelWidth: 120
				},
				// {
				// 	view: "text",
				// 	name: "genres",
				// 	label: "genres"
				// },
				{
					view: "text",
					name: "publisher",
					label: "Publisher",
					labelWidth: 120
				},
				{
					view: "text",
					name: "country",
					label: "Country",
					labelWidth: 120
				},
				{
					view: "text",
					name: "availableCount",
					label: "Available Count",
					labelWidth: 120
				},
				// {
				// 	view: "datepicker",
				// 	label: "Date of Birth",
				// 	labelPosition: "left",
				// 	format: "%d.%m.%Y",
				// 	name: "dateofbirth",
				// },
			],
			rules: {
				$all: webix.rules.isNotEmpty
			}
		};
        
		const buttons = {
			cols: [
				{
					view: "button",
					value: "Add one more genre",
					click: () => {
						counter++;
						this.$getForm().addView({
							view: "richselect",
							label: "Genre "+counter,
							labelWidth: 120,
							name: "genre"+counter,
							options:{
								body: {
									template: "#genre#",
									url:"http://localhost:3016/genres",
								}
							},
						});
					}
				},
				{
					view: "button",
					localId: "updateButton",
					value: "Save",
					hotkey: "Enter",
					click: () => {
						const values = this.$getForm().getValues();
						this.onSubmit(values);
					}
				}
			]
		}

		return {
			view: "window",
			localId: "popup",
			width: 1000,
			position: "center",
			modal: true,
			head: {
				view: "toolbar",
				cols: [
					{ template: " ", type: "header", localId: "formTemplate" },
					{
						view: "icon", icon: "wxi-close", click: () => {
							this.$$("popup").hide();
						}
					}
				]
			},
			body: {rows: [form, buttons]},
			on: {
				onHide: () => {
					this.$getForm().clear();
					this.$getForm().clearValidation();
				}
			}
		};
	}
	showWindow(values, filled) {
		let formTemplate = this.$$("formTemplate");
		this.getRoot().show();
		let form = this.$getForm();
		if (values) {
			values.genres.map(function (genre, index) {
				values["genre"+(index+1)] = genre.id;
				form.addView({
					view: "richselect",
					name: "genre"+(index+1),
					label: "Genre "+(index+1),
					labelWidth: 120,
					options:{
						body: {
							template: "#genre#",
							url:"http://localhost:3016/genres",
						}
					},
				});
			});
            this.$getForm().setValues(values);
            counter = values.genres.length;
			formTemplate.define({ template: "Edit book" });
		}
		formTemplate.refresh();
		this.onSubmit = function (data) {
			// if (this.$getForm().validate()) {
			filled(data);
			// }
		};
	}
	init() {
	}
	$getForm() {
		return this.$$("form");
	}
	hide() {
		this.$$("popup").hide();
	}
}