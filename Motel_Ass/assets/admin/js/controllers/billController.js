var now = {
    Year: new Date().getFullYear(),
    Month: new Date().getMonth() + 1
}

var billController = {
    init: function () {
        billController.setTimeNow();
        billController.loadData();
        billController.registerEvent();
    },
    registerEvent: function () {
        $(document).on('change', '#month-bill', function () {
            var monthYear = $(this).val();
            billController.loadData(monthYear);
        });

        $(document).on('click', '.btn-export-bill', function () {
            $('#modal-export-bill').modal('show');
            var idMotel = $(this).data('idmotel');
            var monthBill = $('#month-bill').val();
            billController.resetFormBill();
            billController.loadInforBill(idMotel);

        });
        $("#txtOther").change(function () {
            billController.getTotalMoney();
        });
        $("#txtQuantityMotel").change(function () {
            var quantityMotel = $("#txtQuantityMotel").val();
            var motelPrice = $('#txtMotelPrice').val();
            $('#txtTotalMotelPrice').val(quantityMotel * motelPrice);
            billController.getTotalService();
        });
        $("#txtQuantitySanitary").change(function () {
            var quantitySanitary = $("#txtQuantitySanitary").val();
            var sanitaryPrice = $('#txtSanitaryPrice').val();
            $('#txtTotalSanitaryPrice').val(quantitySanitary * sanitaryPrice);
            billController.getTotalService();
        });
        $("#txtQuantityInternet").change(function () {
            var quantityInternet = $("#txtQuantityInternet").val();
            var internetPrice = $('#txtInternetPrice').val();
            $('#txtTotalInternetPrice').val(quantityInternet * internetPrice);
            billController.getTotalService();
        });
        $("#txtNumberElecttricNow").change(function () {
            var now = parseInt($('#txtNumberElecttricNow').val());
            var before = parseInt($('#txtNumberElecttricBefore').val());
            if (before.length !== 0 && now.length !== 0) {
                //check number now can not smaller than number before
                if (now < before) {
                    bootbox.alert("Số sau không thể nhỏ hơn số trước");
                    $('#txtNumberElecttricNow').val('');
                    $('#txtNumberElecttricUsed').val('');
                    $('#txtTotalElectrictPrice').val('');
                } else {
                    $('#txtNumberElecttricUsed').val(now - before);
                    var used = parseInt($('#txtNumberElecttricUsed').val());
                    var price = parseInt($('#txtElectrictPrice').val());
                    $('#txtTotalElectrictPrice').val(used * price);
                    billController.getTotalService();
                }
            } else {
                $('#txtNumberElecttricUsed').val('');
                $('#txtTotalElectrictPrice').val('');
            }
        });
        $("#txtNumberWaterNow").change(function () {
            var now = parseInt($('#txtNumberWaterNow').val());
            var before = parseInt($('#txtNumberWaterBefore').val());
            if (before.length !== 0 && now.length !== 0) {

                //check number now can not smaller than number before
                if (now < before) {
                    bootbox.alert("Số sau không thể nhỏ hơn số trước");
                    $('#txtNumberWaterNow').val('');
                    $('#txtNumberWaterUsed').val('');
                    $('#txtTotalWaterPrice').val('');
                } else {
                    $('#txtNumberWaterUsed').val(now - before);
                    var used = parseInt($('#txtNumberWaterUsed').val());
                    var price = parseInt($('#txtWaterPrice').val());
                    $('#txtTotalWaterPrice').val(used * price);
                    billController.getTotalService();
                }
            } else {
                $('#txtNumberWaterUsed').val('');
                $('#txtTotalWaterPrice').val('');
            }
        });
        $("#txtNumberWaterBefore").change(function () {
            var now = parseInt($('#txtNumberWaterNow').val());
            var before = parseInt($('#txtNumberWaterBefore').val());
            if (before.length !== 0 && now.length !== 0) {

                //check number now can not smaller than number before
                if (now < before) {
                    bootbox.alert("Số sau không thể nhỏ hơn số trước");
                    $('#txtNumberWaterBefore').val('');
                    $('#txtNumberWaterUsed').val('');
                    $('#txtTotalWaterPrice').val('');
                } else {
                    $('#txtNumberWaterUsed').val(now - before);
                    var used = parseInt($('#txtNumberWaterUsed').val());
                    var price = parseInt($('#txtWaterPrice').val());
                    $('#txtTotalWaterPrice').val(used * price);
                    billController.getTotalService();
                }
            } else {
                $('#txtNumberWaterUsed').val('');
                $('#txtTotalWaterPrice').val('');
            }
        });
        $("#txtNumberElecttricBefore").change(function () {
            var now = parseInt($('#txtNumberElecttricNow').val());
            var before = parseInt($('#txtNumberElecttricBefore').val());
            if (before.length !== 0 && now.length !== 0) {

                //check number now can not smaller than number before
                if (now < before) {
                    bootbox.alert("Số sau không thể nhỏ hơn số trước");
                    $('#txtNumberElecttricBefore').val('');
                    $('#txtNumberElecttricUsed').val('');
                    $('#txtTotalElectrictPrice').val('');
                } else {
                    $('#txtNumberElecttricUsed').val(now - before);
                    var used = parseInt($('#txtNumberElecttricUsed').val());
                    var price = parseInt($('#txtElectrictPrice').val());
                    $('#txtTotalElectrictPrice').val(used * price);
                    billController.getTotalService();
                }
            } else {
                $('#txtNumberElecttricUsed').val('');
                $('#txtTotalElectrictPrice').val('');
            }
        });
    },
    getTotalService: function () {
        var totalMotelPrice = isNaN(parseInt($('#txtTotalMotelPrice').val())) ? 0 : parseInt($('#txtTotalMotelPrice').val());
        var totalElectricPrice = isNaN(parseInt($('#txtTotalElectrictPrice').val())) ? 0 : parseInt($('#txtTotalElectrictPrice').val());
        var totalWaterPrice = isNaN(parseInt($('#txtTotalWaterPrice').val())) ? 0 : parseInt($('#txtTotalWaterPrice').val());
        var totalSanitaryPrice = isNaN(parseInt($('#txtTotalSanitaryPrice').val())) ? 0 : parseInt($('#txtTotalSanitaryPrice').val());
        var totalInternetPrice = isNaN(parseInt($('#txtTotalInternetPrice').val())) ? 0 : parseInt($('#txtTotalInternetPrice').val());

        var totalService = totalMotelPrice + totalElectricPrice + totalWaterPrice
            + totalSanitaryPrice + totalInternetPrice;
        $('#txtTotalService').val(totalService);
        billController.getTotalMoney();
    },
    getTotalMoney: function () {
        var totalService = isNaN(parseInt($('#txtTotalService').val())) ? 0 : parseInt($('#txtTotalService').val());
        var other = isNaN(parseInt($('#txtOther').val())) ? 0 : parseInt($('#txtOther').val());
        $('#txtTotal').val(totalService + other);
    },
    resetFormBill: function () {
        $('#txtMotelPrice').val('');
        $('#txtNumberElecttricBefore').val('');
        $('#txtNumberWaterBefore').val('');

        $('#txtQuantityMotel').val('');
        $('#txtQuantitySanitary').val('');
        $('#txtQuantityInternet').val('');

        $('#txtNumberWaterBefore').val('');
        $('#txtNumberWaterNow').val('');
        $('#txtNumberWaterUsed').val('');

        $('#txtNumberElecttricBefore').val('');
        $('#txtNumberElecttricNow').val('');
        $('#txtNumberElecttricUsed').val('');

        $('#txtTotalMotelPrice').val('');
        $('#txtTotalElectrictPrice').val('');
        $('#txtTotalWaterPrice').val('');
        $('#txtTotalSanitaryPrice').val('');
        $('#txtTotalInternetPrice').val('');

        $('#txtTotalService').val('');
        $('#txtOther').val('');
        $('#txtTotal').val('');
        $('#txtNote').val('');
    },
    loadInforBill: function (idMotel) {
        $.ajax({
            url: '/Admin/Bill/LoadInforBill',
            type: 'GET',
            data: {
                idMotel: idMotel
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var res = JSON.parse(response.data);

                    var countGuest = response.count;
                    var motelPrice = res[0].MotelPrice;
                    var numberElecttricBefore = res[0].NumberElecttricBefore;
                    var numberWaterBefore = res[0].NumberWaterBefore;

                    $('#txtTotalSanitaryPrice').val(countGuest);
                    $('#txtTotalInternetPrice').val(countGuest);

                    $('#txtMotelPrice').val(motelPrice);
                    $('#txtNumberElecttricBefore').val(numberElecttricBefore);
                    $('#txtNumberWaterBefore').val(numberWaterBefore);

                    $('#txtElectrictPrice').val('3000');
                    $('#txtWaterPrice').val('15000');
                    $('#txtSanitaryPrice').val('20000');
                    $('#txtInternetPrice').val('60000');

                    $('#txtQuantitySanitary').val(countGuest);
                    $('#txtQuantityInternet').val(countGuest);

                    $('#txtTotalSanitaryPrice').val(countGuest * 20000);
                    $('#txtTotalInternetPrice').val(countGuest * 60000);
                }
            }
        })
    },
    setTimeNow: function () {
        if (now.Month < 10) {
            now.Month = "0" + now.Month;
        }
        $('#month-bill').val(now.Year + "-" + now.Month);
    },
    loadData: function (monthYear) {
        $.ajax({
            url: '/Admin/Bill/LoadDataBill',
            type: 'GET',
            data: {
                dateSelect: monthYear
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-bill').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID_Motel: item.ID_Motel,
                            BillOfMonth: item.BillOfMonth,
                            NameRoom: item.NameRoom,
                            RepresentativeGuest: item.RepresentativeGuest,
                            TypeOfBill: item.TypeOfBill,
                            TotalMoney: item.TotalMoney == 0 ? "---" : item.TotalMoney,
                            CreatedDate: item.CreatedDate,
                            PayDate: item.PayDate,
                            Paid: (item.Paid == true) ? "Đã thanh toán" : "Chưa thanh tóan"
                        });
                    });
                    $('#tbl-bill').html(html);

                }
            }
        })
    }
}
billController.init();