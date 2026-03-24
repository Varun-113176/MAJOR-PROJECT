sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("com.varun.project2.fioriproject.controller.Analytics", {

        onInit: function () {

            this.attendanceData = [
                { date: "2026-01-03", status: "Present" },
                { date: "2026-01-04", status: "Leave" },
                { date: "2026-01-05", status: "HalfDay" },

                { date: "2026-02-10", status: "Present" },
                { date: "2026-02-11", status: "Present" },
                { date: "2026-02-12", status: "Leave" },

                { date: "2026-03-15", status: "Present" },
                { date: "2026-03-16", status: "HalfDay" },
                { date: "2026-03-17", status: "Present" },

                { date: "2026-07-01", status: "Present" },
                { date: "2026-08-02", status: "Leave" },
                { date: "2026-09-03", status: "Present" }
            ];

            var oModel = new JSONModel();
            this.getView().setModel(oModel);

            // Default Q1
            var chartData = this._getQuarterData("Q1");
            oModel.setProperty("/chartData", chartData);
        },

        _getMonthName: function (m) {
            var map = {
                "01": "Jan", "02": "Feb", "03": "Mar",
                "04": "Apr", "05": "May", "06": "Jun",
                "07": "Jul", "08": "Aug", "09": "Sep",
                "10": "Oct", "11": "Nov", "12": "Dec"
            };
            return map[m];
        },

        _getQuarterData: function (quarter) {

            var quarterMap = {
                Q1: ["01", "02", "03"],
                Q2: ["04", "05", "06"],
                Q3: ["07", "08", "09"],
                Q4: ["10", "11", "12"]
            };

            var months = quarterMap[quarter];

            // Always create 3 months
            var result = months.map(function (m) {
                return {
                    month: this._getMonthName(m),
                    total: 0
                };
            }.bind(this));

            // Fill data
            this.attendanceData.forEach(function (item) {
                var m = item.date.substring(5, 7);

                if (months.includes(m)) {
                    var index = months.indexOf(m);
                    result[index].total++;
                }
            });

            return result;
        },

        onQuarterChange: function (oEvent) {

            var selectedKey = oEvent.getSource().getSelectedKey();

            var chartData = this._getQuarterData(selectedKey);

            this.getView().getModel().setProperty("/chartData", chartData);
        }

    });
});