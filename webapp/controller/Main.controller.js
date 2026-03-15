sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.varun.project2.fioriproject.controller.Main", {

        onInit: function () {
        },

        onHRPress: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("HR");
        },

        onAdminPress: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Admin");
        }

    });
});