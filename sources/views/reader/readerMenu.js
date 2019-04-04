import { JetView, plugins } from "webix-jet";

export default class TopView extends JetView {
	config() {
		var header = {
			type: "header", template: this.app.config.name, css: "webix_header app_header"
		};

		var menu = {
			view: "menu", 
			localId: "top:readermenu",
			css: "app_menu",
			width: 180, layout: "y", select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{ value: "Users", id: "reader.library", icon: "wxi-columns" },
			]
		};

		var ui = {
			type: "clean", paddingX: 5, css: "app_layout", cols: [
				{ paddingX: 5, paddingY: 10, rows: [{ css: "webix_shadow_medium", rows: [header, menu] }] },
				{
					type: "wide", paddingY: 10, paddingX: 5, rows: [
						{ $subview: true },
						{ view: "button", value: "Logout", width: 150, click: () => {this.do_logout(); window.location.reload(true); }}
					]
				}
			]
		};

		return ui;
	}
	do_logout() {
		const user = this.app.getService("user");
		user.logout().catch(function () {
			//error handler
		});
	}
	init() {
		this.use(plugins.Menu, this.$$("top:readermenu"));
	}
}