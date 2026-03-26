sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("com.varun.project2.fioriproject.controller.Analytics", {

        onInit: function () {

            this.empName = "Nancy Davolio";

            this.attendanceData = this._generateAttendance2026();

            var oModel = new JSONModel();
            this.getView().setModel(oModel);

            oModel.setProperty("/chartData", this._getYearData());

            var oViz = this.getView().byId("histogramChart");

            if (oViz) {
                oViz.setVizProperties({
                    plotArea: {
                        dataLabel: { visible: true }
                    }
                });

                oViz.attachSelectData(this.onBarSelect, this);
            }
        },

        _generateAttendance2026: function () {

            var data = [];
            var start = new Date("2026-01-01");
            var end = new Date("2026-12-31");

            while (start <= end) {

                var day = start.getDay();

                if (day !== 0 && day !== 6) {

                    var rand = Math.random();
                    var status = rand < 0.7 ? "Present" : rand < 0.9 ? "HalfDay" : "Absent";

                    data.push({
                        date: start.toISOString().split("T")[0],
                        status: status,
                        employee: this.empName
                    });
                }

                start.setDate(start.getDate() + 1);
            }

            return data;
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

        _getYearData: function () {

            var result = [];

            for (var m = 1; m <= 12; m++) {

                var monthStr = m.toString().padStart(2, "0");
                var count = 0;

                this.attendanceData.forEach(function (item) {
                    if (item.date.substring(5, 7) === monthStr) {
                        count++;
                    }
                });

                result.push({
                    month: this._getMonthName(monthStr),
                    total: count,
                    monthNum: monthStr
                });
            }

            return result;
        },

        onBarSelect: function (oEvent) {

            var data = oEvent.getParameter("data")[0].data;
            var month = data.monthNum;

            this._showHeatmap(month);
        },

        _showHeatmap: function (month) {

            var days = [];

            this.attendanceData.forEach(function (item) {
                if (item.date.substring(5, 7) === month) {
                    days.push(item);
                }
            });

            var text = days.map(function (d) {
                return d.date + " - " + d.status;
            }).join("\n");

            MessageBox.information(text, {
                title: "Month " + month + " Attendance"
            });
        },

        onQuarterChange: function () {
            this.getView().getModel().setProperty("/chartData", this._getYearData());
        }

    });
});