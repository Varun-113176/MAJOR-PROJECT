sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/VBox",
    "sap/m/Input",
    "sap/m/CheckBox",
    "sap/m/Button",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (
    Controller,
    Dialog,
    VBox,
    Input,
    CheckBox,
    Button,
    MessageBox,
    MessageToast
) {
    "use strict";

    return Controller.extend("com.varun.project2.fioriproject.controller.Admin", {

        /* SHOW PASSWORD */
        onShowPassword: function (oEvent) {
            this.byId("passwordInput")
                .setType(oEvent.getParameter("selected") ? "Text" : "Password");
        },

        /* LOGIN */
        onLogin: function () {

            var sEmail = this.byId("emailInput").getValue();
            var sPassword = this.byId("passwordInput").getValue();

            var aUsers = JSON.parse(localStorage.getItem("AdminUsers")) || [];

            var oUser = aUsers.find(function (u) {
                return u.email === sEmail;
            });

            if (!oUser) {
                MessageBox.error("This admin email does not exist. Please signup first.");
                return;
            }

            if (oUser.password !== sPassword) {
                MessageBox.error("Incorrect password");
                return;
            }

            MessageToast.show("Admin Login Successful");

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Employee");
        },

        /* OPEN SIGNUP */
        onOpenSignup: function () {

            if (!this._oSignupDialog) {
                this._oSignupDialog = this._createSignupDialog();
            }

            this._oSignupDialog.open();
        },

        /* CREATE SIGNUP DIALOG */
        _createSignupDialog: function () {

            var oFirstName = new Input({ placeholder: "First Name" });

            var oLastName = new Input({
                placeholder: "Last Name",
                class: "sapUiSmallMarginTop"
            });

            var oEmail = new Input({
                placeholder: "Admin Email",
                type: "Email",
                class: "sapUiSmallMarginTop"
            });

            var oPass = new Input({
                placeholder: "Password",
                type: "Password",
                class: "sapUiSmallMarginTop"
            });

            var oConfirm = new Input({
                placeholder: "Confirm Password",
                type: "Password",
                class: "sapUiSmallMarginTop"
            });

            var oDialog = new Dialog({

                title: "Admin Register",
                contentWidth: "380px",

                content: new VBox({
                    class: "sapUiMediumMargin",
                    items: [
                        oFirstName,
                        oLastName,
                        oEmail,
                        oPass,
                        oConfirm,
                        new CheckBox({
                            text: "I Agree to Terms & Conditions",
                            class: "sapUiSmallMarginTop"
                        })
                    ]
                }),

                beginButton: new Button({

                    text: "Register",
                    type: "Emphasized",

                    press: function () {

                        var email = oEmail.getValue();
                        var password = oPass.getValue();

                        /* EMAIL VALIDATION */
                        var emailRegex =
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                        if (!emailRegex.test(email)) {
                            MessageBox.error("Enter valid email format");
                            return;
                        }

                        /* PASSWORD VALIDATION */
                        var passRegex =
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

                        if (!passRegex.test(password)) {
                            MessageBox.error(
                                "Password must contain:\n• 8 characters\n• 1 uppercase\n• 1 lowercase\n• 1 number\n• 1 special character"
                            );
                            return;
                        }

                        if (password !== oConfirm.getValue()) {
                            MessageBox.error("Passwords do not match");
                            return;
                        }

                        var aUsers = JSON.parse(localStorage.getItem("AdminUsers")) || [];

                        aUsers.push({
                            firstname: oFirstName.getValue(),
                            lastname: oLastName.getValue(),
                            email: email,
                            password: password
                        });

                        localStorage.setItem("AdminUsers", JSON.stringify(aUsers));

                        MessageBox.success("Admin Registered Successfully");

                        oDialog.close();
                    }

                }),

                endButton: new Button({
                    text: "Close",
                    press: function () {
                        oDialog.close();
                    }
                })
            });

            return oDialog;
        }

    });
});