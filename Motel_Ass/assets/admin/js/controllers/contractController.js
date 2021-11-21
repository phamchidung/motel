var homeconfig = {
    pageSize: 5,
    pageIndex: 1
}
var contractController = {
    init: function () {
        contractController.loadData();
        contractController.loadDataNameRoom();
        contractController.loadDataGuest();
        contractController.registerEvent();
    },
    registerEvent: function () {
        $(document).on('click', '.btn-select-guest', function () {
            var idGuest = $(this).data('id');
            var idRoom = $('#select-room').val();
            contractController.loadDataGuestSelected(idGuest, idRoom);
        });
        $(document).on('click', '.btn-remove-guest', function () {
            var idGuest = $(this).data('id');
            contractController.removeGuest(idGuest);
        });
        $('#select-room').on('change', function () {
            contractController.clearSessionGuest();
        });
        $('#btn-add-contract').off('click').on('click', function () {
            $('#modal-add-update-contract').modal('show');
            contractController.resetForm();
        });
        $('#btn-save-contract').off('click').on('click', function () {
            $('#pagination-contract-parent').html('');
            $('#pagination-contract-parent').html('<ul id="pagination-contract" class="paginnation"></ul>');
            contractController.saveContract();
            contractController.resetForm();
        });
    },
    saveContract: function () {
        var ID = $('#hid-id-contract').val();
        var ID_Motel = $('#select-room').val();
        var ID_Guest_Representative = $('#select-representative').val();
        var Deposive = $('#txtDeposive').val();
        var DateStart = $('#txtDateStart').val();
        var DateStop = $('#txtDateStop').val();
        var PaymentPeriod = $('#txtPaymentPeriod').val();
        var DatePayNextPeriod = $('#txtDatePayNextPeriod').val();

        var contract = {
            ID: ID,
            ID_Motel: ID_Motel,
            ID_Guest_Representative: ID_Guest_Representative,
            Deposive: Deposive,
            DateStart: DateStart,
            DateStop: DateStop,
            PaymentPeriod: PaymentPeriod,
            DatePayNextPeriod: DatePayNextPeriod
        }

        $.ajax({
            url: '/Admin/Contract/SaveContract',
            data: {
                strContract: JSON.stringify(contract)
            },
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    bootbox.alert("Lưu thành công");
                    $('#modal-add-update-contract').modal('hide');
                    contractController.loadData();
                } else {
                    bootbox.alert(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    resetForm: function () {
        $('#hid-id-contract').val('0');
        $('#tbl-contract-guest-selected').html('');
        contractController.loadDataGuest();
        contractController.loadDataNameRoom();
        $('#select-representative').html('');
        $('#txtDeposive').val('');
        $('#txtPaymentPeriod').val('');
        $('#txtDatePayNextPeriod').val('');
        $('#txtDateStart').val('');
        $('#txtDateStop').val('');
        contractController.clearSessionGuest();
    },
    clearSessionGuest: function () {
        $.ajax({
            url: '/Admin/Contract/ClearSession',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var html = '';
                    $('#tbl-contract-guest-selected').html(html);
                }
            }
        })
    },
    removeGuest: function (idGuest) {
        $.ajax({
            url: '/Admin/Contract/removeGuest',
            type: 'GET',
            data: {
                idGuest: idGuest,
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var html2 = '';
                    var template = $('#data-contract-guest-selected').html();
                    var template2 = $('#data-representative').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.ID,
                            Name: item.Name,
                        });
                        html2 += Mustache.render(template2, {
                            ID: item.ID,
                            Name: item.Name
                        })
                    });
                    $('#tbl-contract-guest-selected').html(html);
                    $('#select-representative').html(html2);
                }
            }
        })
    },
    loadDataGuestSelected: function (idGuest, idRoom) {
        $.ajax({
            url: '/Admin/Contract/loadDataGuestSelected',
            type: 'GET',
            data: {
                idGuest: idGuest,
                idRoom: idRoom
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    if (response.message != null) {
                        bootbox.alert(response.message);
                    }
                    var data = response.data;
                    var html = '';
                    var html2 = '';
                    var template = $('#data-contract-guest-selected').html();
                    var template2 = $('#data-representative').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.ID,
                            Name: item.Name,
                            Phone: item.Phone
                        });
                        html2 += Mustache.render(template2, {
                            ID: item.ID,
                            Name: item.Name,
                            Phone: item.Phone
                        })
                    });
                    $('#tbl-contract-guest-selected').html(html);
                    $('#select-representative').html(html2);
                }
            }
        })
    },
    loadDataGuest: function () {
        $.ajax({
            url: '/Admin/Contract/LoadDataGuest',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-contract-guest').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.ID,
                            Name: item.Name,
                            Phone: item.Phone,
                            Staying: (item.Staying == true) ? "Đang ở" : "Mới",
                            MotelRoom: item.MotelRoom,
                            Representative: (item.Representative == true) ? "Người đại diện" : "Không phải"
                        });
                    });
                    $('#tbl-contract-guest').html(html);
                }
            }
        })
    },
    loadDataNameRoom: function () {
        $.ajax({
            url: '/Admin/Contract/loadDataNameRoom',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-name-room').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            Name: item.Name,
                            ID: item.ID
                        });
                    });
                    $('#select-room').html(html);
                }
            }
        })
    },
    loadData: function () {
        $.ajax({
            url: '/Admin/Contract/LoadDataContract',
            type: 'GET',
            data: {
                page: homeconfig.pageIndex,
                pageSize: homeconfig.pageSize
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-contract').html();
                    var total = response.total;
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            NameRoom: item.NameRoom,
                            RepresentativeName: item.RepresentativeName,
                            DateStart: item.DateStart,
                            DateStop: item.DateStop,
                            Deposive: item.Deposive
                        });
                    });
                    $('#tbl-contract').html(html);
                    contractController.paginationContract(total, function () {
                        contractController.loadData();
                    });
                }
            }
        })
    },
    paginationContract: function (totalRow, callback) {
        var totalPage = Math.ceil(totalRow / homeconfig.pageSize);
        $('#pagination-contract').twbsPagination({
            totalPages: totalPage,
            visiblePages: 4,
            onPageClick: function (event, page) {
                homeconfig.pageIndex = page;
                setTimeout(callback, 200);
            }
        });
    }
}
contractController.init();