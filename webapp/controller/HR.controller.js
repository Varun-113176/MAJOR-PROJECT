sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/VBox",
    "sap/m/Input",
    "sap/m/CheckBox",
    "sap/m/Button",
    "sap/m/MessageBox",
    "sap/m/Select",
    "sap/ui/core/Item",
    "sap/m/MessageToast"
], function (
    Controller,
    Dialog,
    VBox,
    Input,
    CheckBox,
    Button,
    MessageBox,
    Select,
    Item,
    MessageToast
) {
    "use strict";

    return Controller.extend("com.varun.project2.fioriproject.controller.HR", {

        /* SHOW PASSWORD */
        onShowPassword: function (oEvent) {
            this.byId("passwordInput")
                .setType(oEvent.getParameter("selected") ? "Text" : "Password");
        },

        /* LOGIN */
        onLogin: function () {

            var sEmail = this.byId("emailInput").getValue();
            var sPassword = this.byId("passwordInput").getValue();

            var aUsers = JSON.parse(localStorage.getItem("HRUsers")) || [];

            var oUser = aUsers.find(function (u) {
                return u.email === sEmail;
            });

            if (!oUser) {
                MessageBox.error("This email does not exist. Please signup first.");
                return;
            }

            if (oUser.password !== sPassword) {
                MessageBox.error("Incorrect password");
                return;
            }

            MessageToast.show("Login Successful");

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
                placeholder: "Email Address",
                type: "Email",
                class: "sapUiSmallMarginTop"
            });

            /* DEPARTMENT DROPDOWN */

            var oDept = new Select({

                class: "sapUiSmallMarginTop",

                items: [
                    new Item({ key: "TA", text: "Talent Acquisition (Recruitment)" }),
                    new Item({ key: "TD", text: "Training & Development" }),
                    new Item({ key: "CB", text: "Compensation & Benefits" }),
                    new Item({ key: "ER", text: "Employee Relations" }),
                    new Item({ key: "CO", text: "Compliance" }),
                    new Item({ key: "PR", text: "Payroll" }),
                    new Item({ key: "PM", text: "Performance Management" })
                ]

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

                title: "Register",
                contentWidth: "380px",

                content: new VBox({
                    class: "sapUiMediumMargin",
                    items: [
                        oFirstName,
                        oLastName,
                        oEmail,
                        oDept,
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
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

                        var aUsers = JSON.parse(localStorage.getItem("HRUsers")) || [];

                        aUsers.push({
                            firstname: oFirstName.getValue(),
                            lastname: oLastName.getValue(),
                            email: email,
                            department: oDept.getSelectedItem().getText(),
                            password: password
                        });

                        localStorage.setItem("HRUsers", JSON.stringify(aUsers));

                        MessageBox.success("Registered Successfully");

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