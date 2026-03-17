sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("com.varun.project2.fioriproject.controller.Analytics", {

        onInit: function () {

            // 🔥 Sample Attendance Data (daily)
            var attendanceData = [
                { date: "2026-01-03", status: "Present" },
                { date: "2026-01-04", status: "Leave" },
                { date: "2026-01-05", status: "HalfDay" },

                { date: "2026-02-10", status: "Present" },
                { date: "2026-02-11", status: "Present" },
                { date: "2026-02-12", status: "Leave" },

                { date: "2026-03-15", status: "Present" },
                { date: "2026-03-16", status: "HalfDay" },
                { date: "2026-03-17", status: "Present" }
            ];

            var chartData = this._prepareChartData(attendanceData);

            var oModel = new JSONModel({
                chartData: chartData
            });

            this.getView().setModel(oModel);
        },

        /* 🔥 Convert Daily → Monthly */
        _prepareChartData: function (attendanceData) {

            var result = {};

            attendanceData.forEach(function (item) {

                var month = item.date.substring(0, 7); // YYYY-MM

                if (!result[month]) {
                    result[month] = {
                        month: month,
                        present: 0,
                        leave: 0,
                        halfday: 0
                    };
                }

                if (item.status === "Present") {
                    result[month].present++;
                } else if (item.status === "Leave") {
                    result[month].leave++;
                } else if (item.status === "HalfDay") {
                    result[month].halfday++;
                }

            });

            return Object.values(result);
        }

    });
});