sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/m/Button",
    "sap/m/HBox"
], function (
    Controller, Fragment,
    MessageToast, MessageBox, ColumnListItem, Text, Button, HBox
) {
    "use strict";

    return Controller.extend("com.varun.project2.fioriproject.controller.Employee", {

        onInit: function () {
            this._sDialogId = this.getView().getId();
        },

        /* ================= CREATE ================= */

        onCreate: function () {

            this._selectedItem = null;

            if (!this._oDialog) {
                Fragment.load({
                    id: this._sDialogId,
                    name: "com.varun.project2.fioriproject.fragments.EmployeeDialog",
                    controller: this
                }).then(function (oDialog) {
                    this._oDialog = oDialog;
                    this.getView().addDependent(oDialog);

                    this._clearDialog();
                    this._enableAllFields();
                    this._oDialog.open();
                }.bind(this));
            } else {
                this._clearDialog();
                this._enableAllFields();
                this._oDialog.open();
            }
        },

        /* ================= UPDATE ================= */

        onUpdate: function () {

            var oItem = this.byId("employeeTable").getSelectedItem();

            if (!oItem) {
                MessageToast.show("Select employee first");
                return;
            }

            var aCells = oItem.getCells();

            var sName = aCells[1].getText();
            var sRole = aCells[2].getText();
            var sCity = aCells[3].getText();
            var sPhone = aCells[4].getText();
            var sEmail = aCells[5].getText();

            this._selectedItem = oItem;

            MessageBox.information(
                "Name: " + sName + "\n" +
                "Role: " + sRole + "\n" +
                "City: " + sCity + "\n" +
                "Phone: " + sPhone + "\n" +
                "Email: " + sEmail,
                {
                    title: "Employee Details",
                    onClose: function () {

                        if (!this._oDialog) {
                            Fragment.load({
                                id: this._sDialogId,
                                name: "com.varun.project2.fioriproject.fragments.EmployeeDialog",
                                controller: this
                            }).then(function (oDialog) {
                                this._oDialog = oDialog;
                                this.getView().addDependent(oDialog);

                                this._fillDialogValues(sName, sRole, sCity, sPhone, sEmail);
                                this._disableFields();
                                this._oDialog.open();
                            }.bind(this));
                        } else {
                            this._fillDialogValues(sName, sRole, sCity, sPhone, sEmail);
                            this._disableFields();
                            this._oDialog.open();
                        }

                    }.bind(this)
                }
            );
        },

        /* ================= ADD / UPDATE ================= */

        onAddEmployee: function () {

            var oTable = this.byId("employeeTable");

            var sName  = Fragment.byId(this._sDialogId, "inputName").getValue();
            var sRole  = Fragment.byId(this._sDialogId, "inputRole").getValue();
            var sCity  = Fragment.byId(this._sDialogId, "inputCity").getValue();
            var sPhone = Fragment.byId(this._sDialogId, "inputPhone").getValue();
            var sEmail = Fragment.byId(this._sDialogId, "inputEmail").getValue();

            if (!sName || !sRole || !sCity || !sPhone || !sEmail) {
                MessageBox.error("All fields are required");
                return;
            }

            if (isNaN(sPhone)) {
                MessageBox.error("Phone must be a number");
                return;
            }

            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(sEmail)) {
                MessageBox.error("Enter valid email format");
                return;
            }

            if (this._selectedItem) {

                var aCells = this._selectedItem.getCells();
                aCells[2].setText(sRole);
                aCells[4].setText(sPhone);
                aCells[5].setText(sEmail);

                MessageToast.show("Employee updated successfully");
                this._selectedItem = null;

            } else {

                var iNewId = oTable.getItems().length + 1;

                var oNewRow = new ColumnListItem({
                    cells: [
                        new Text({ text: iNewId }),
                        new Text({ text: sName }),
                        new Text({ text: sRole }),
                        new Text({ text: sCity }),
                        new Text({ text: sPhone }),
                        new Text({ text: sEmail }),
                        new HBox({
                            items: [
                                new Button({
                                    icon: "sap-icon://slim-arrow-right",
                                    press: this.onNavigate.bind(this)
                                }),
                                new Button({
                                    icon: "sap-icon://delete",
                                    press: this.onDelete.bind(this)
                                })
                            ]
                        })
                    ]
                });

                oTable.addItem(oNewRow);

                MessageToast.show("Employee Added Successfully");

                // 🔥 AUTO NAVIGATION
                this._selectNewEmployee(oNewRow);
            }

            this._oDialog.close();
        },

        /* ================= NAVIGATION ================= */

        onNavigate: function (oEvent) {

            var oItem = oEvent.getSource().getParent().getParent();
            var aCells = oItem.getCells();

            MessageBox.information(
                "Employee Details:\n\n" +
                "Name: " + aCells[1].getText() + "\n" +
                "Role: " + aCells[2].getText() + "\n" +
                "City: " + aCells[3].getText() + "\n" +
                "Phone: " + aCells[4].getText() + "\n" +
                "Email: " + aCells[5].getText()
            );
        },

        _selectNewEmployee: function (oRow) {

            var oTable = this.byId("employeeTable");
            oTable.setSelectedItem(oRow);

            var aCells = oRow.getCells();

            MessageBox.information(
                "Employee Created:\n\n" +
                "Name: " + aCells[1].getText() + "\n" +
                "Role: " + aCells[2].getText() + "\n" +
                "City: " + aCells[3].getText() + "\n" +
                "Phone: " + aCells[4].getText() + "\n" +
                "Email: " + aCells[5].getText()
            );

            setTimeout(function () {
                if (oRow.getDomRef()) {
                    oRow.getDomRef().scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            }, 200);
        },

        /* ================= DELETE ================= */

        onDelete: function (oEvent) {

            var oItem = oEvent.getSource().getParent().getParent();

            MessageBox.confirm("Delete employee?", {
                onClose: function (sAction) {
                    if (sAction === "OK") {
                        this.byId("employeeTable").removeItem(oItem);
                        MessageToast.show("Deleted");
                    }
                }.bind(this)
            });
        },

        /* ================= HELPERS ================= */

        _disableFields: function () {
            Fragment.byId(this._sDialogId, "inputName").setEnabled(false);
            Fragment.byId(this._sDialogId, "inputCity").setEnabled(false);
        },

        _enableAllFields: function () {
            Fragment.byId(this._sDialogId, "inputName").setEnabled(true);
            Fragment.byId(this._sDialogId, "inputCity").setEnabled(true);
        },

        _clearDialog: function () {
            Fragment.byId(this._sDialogId, "inputName").setValue("");
            Fragment.byId(this._sDialogId, "inputRole").setValue("");
            Fragment.byId(this._sDialogId, "inputCity").setValue("");
            Fragment.byId(this._sDialogId, "inputPhone").setValue("");
            Fragment.byId(this._sDialogId, "inputEmail").setValue("");
        },

        _fillDialogValues: function (name, role, city, phone, email) {
            Fragment.byId(this._sDialogId, "inputName").setValue(name);
            Fragment.byId(this._sDialogId, "inputRole").setValue(role);
            Fragment.byId(this._sDialogId, "inputCity").setValue(city);
            Fragment.byId(this._sDialogId, "inputPhone").setValue(phone);
            Fragment.byId(this._sDialogId, "inputEmail").setValue(email);
        },

        onCloseDialog: function () {
            this._oDialog.close();
        }

    });
});