var homeconfig = {
    pageSize: 5,
    pageIndex: 1
}
var homeController = {
    init: function () {
        homeController.loadData();
        homeController.registerEvent();
    },
    registerEvent: function () {
        $('#frmAddDevice').validate({
            rules: {
                txtQuantity: {
                    required: true,
                    number: true,
                    min: 1
                }
            },
            messages: {
                txtQuantity: {
                    required: "Vui lòng nhập số lượng",
                    number: "Số lượng không hợp lệ",
                    min: "Số lượng không được nhỏ hơn 1 "
                }
            }
        });
        $('#frmSaveMotel').validate({
            rules: {
                txtNameRoom: "required",
                txtFloor: {
                    required: true,
                    number: true,
                    min: 0
                },
                txtPrice: {
                    required: true,
                    number: true,
                    min: 0
                },
                txtSquare: {
                    number: true,
                    min: 0
                },
                txtMaxGuest: {
                    number: true,
                    min: 1,
                    max: 2
                }
            },
            messages: {
                txtNameRoom: "Vui lòng nhập tên phòng",
                txtFloor: {
                    required: "Vui lòng nhập số tầng",
                    number: "Số tầng không hợp lệ",
                    min: "Số tầng không được nhỏ hơn 0"
                },
                txtPrice: {
                    required: "Vui lòng nhập giá thuê phòng",
                    number: "Giá tiền không hợp lệ",
                    min: "Giá tiền không được nhỏ hơn 0"
                },
                txtSquare: {
                    number: "Diện tích phòng không hợp lệ",
                    min: "Diện tích phòng không được nhỏ hơn 0"
                },
                txtMaxGuest: {
                    number: "Số người tối đa không hợp lệ",
                    min: "Số người không được nhỏ hơn 1",
                    max: "Số tối đa là 2"
                }
            }
        });
        $('#btnAddMotel').off('click').on('click', function () {
            $('#modalAddUpdateMotel').modal('show');
            homeController.resetForm();
        });
        $('#btnSaveMotelRoom').off('click').on('click', function () {
            if ($('#frmSaveMotel').valid()) {
                $('#pagination-motel-parent').html('');
                $('#pagination-motel-parent').html('<ul id="pagination-motel" class="paginnation"></ul>');
                homeController.saveRoom();
            }
        });
        $(document).on('click', '.btn-edit-motel', function () {
            $('#modalAddUpdateMotel').modal('show');
            var id = $(this).data('id');
            homeController.loadDetailMotel(id);
        });
        $(document).on('click', '.btn-delete-motel', function () {

            var id = $(this).data('id');
            bootbox.confirm("Bạn chắc chắn xóa chứ!?", function (result) {
                if (result) {
                    $('#pagination-motel-parent').html('');
                    $('#pagination-motel-parent').html('<ul id="pagination-motel" class="paginnation"></ul>');
                    homeController.deleteMotel(id);
                }
            });
        });
        $(document).on('click', '.btn-check-device', function () {
            $('#modal-check-device').modal('show');
            var id = $(this).data('id');
            homeController.loadDevicesOfMotel(id);
        });
        $(document).on('click', '.btn-add-device', function () {
            $('#modal-add-device').modal('show');
            var id = $(this).data('id');
            homeController.loadDataDeviceNotInRoom(id);
            homeController.resetFormDevice(id);
        });
        $('#btn-save-device').off('click').on('click', function () {
            if ($('#frmAddDevice').valid()) {
                $('#pagination-motel-parent').html('');
                $('#pagination-motel-parent').html('<ul id="pagination-motel" class="paginnation"></ul>');
                homeController.saveMotelDevice();
            }
        });
    },
    saveMotelDevice: function () {
        var motelId = parseInt($('#hid-id-motel').val());
        var deviceId = parseInt($('#select-device').val());
        var quantity = parseInt($('#txtQuantity').val());
        var statusDevice = $('#select-status-device').val();
        var guarantee = $('input[name="guarantee"]:checked').val();

        var motelDevice = {
            ID_Motel: motelId,
            ID_Device: deviceId,
            Guarantee: guarantee,
            Quantity: quantity,
            StatusDevice: statusDevice
        }

        $.ajax({
            url: '/Admin/Home/saveMotelDevice',
            data: {
                strMotelDevice: JSON.stringify(motelDevice)
            },
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    bootbox.alert("Lưu thành công");
                    $('#modal-add-device').modal('hide');
                    homeController.loadDevicesOfMotel(motelId);
                } else {
                    bootbox.alert(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    loadDataDeviceNotInRoom: function (id) {
        $.ajax({
            url: '/Admin/Home/loadDataDeviceNotInRoom',
            type: 'GET',
            data: {
                id: id
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-device').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            Name2: item.Name,
                            ID2: item.ID
                        });
                    });
                    $('#select-device').html(html);
                }
            }
        })
    },
    resetFormDevice: function (id) {
        $('#hid-id-motel').val(id);
        $('#select-device').html('');
        $('#txtQuantity').val('');
    },
    loadDevicesOfMotel: function (id) {
        $.ajax({
            url: '/Admin/Home/LoadDevicesOfMotel',
            type: 'GET',
            data: {
                id: id
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-motel-device').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID_Motel: item.ID_Motel,
                            ID_Device: item.ID_Device,
                            Name: item.Name,
                            Unit: item.Unit,
                            Price: item.Price,
                            CompensationPrice: item.CompensationPrice,
                            Quantity: item.Quantity,
                            StatusDevice: item.StatusDevice,
                            Guarantee: (item.Guarantee == true) ? "<span class=\"label label-danger\">Còn bảo hành</span>" : "<span class=\"label label-success\">Hết bảo hành</span>"
                        });
                    });
                    $('#tbl-motel-check-device').html(html);
                }
            }
        })
    },
    deleteMotel: function (id) {
        $.ajax({
            url: '/Admin/Home/DeleteMotel',
            data: {
                id: id
            },
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    bootbox.alert("Xóa thành công");
                    homeController.loadData();
                } else {
                    bootbox.alert("Không thể xóa phòng này!");
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    loadDetailMotel: function (id) {
        $.ajax({
            url: '/Admin/Home/GetDetailMotel',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    var data = response.data;
                    $('#hid-id-room').val(data.ID);
                    $('#txtNameRoom').val(data.Name);
                    $('#txtMaxGuest').val(data.MaxGuest);
                    $('#txtSquare').val(data.Square);
                    $('#txtFloor').val(data.Floor);
                    $('#txtPrice').val(data.Price);
                } else {
                    bootbox.alert(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    saveRoom: function () {
        var name = $('#txtNameRoom').val();
        var maxGues = parseInt($('#txtMaxGuest').val());
        var square = parseFloat($('#txtSquare').val());
        var floor = parseInt($('#txtFloor').val());
        var price = parseFloat($('#txtPrice').val());
        var id = parseInt($('#hid-id-room').val());
        var motelRoom = {
            Name: name,
            MaxGuest: maxGues,
            Square: square,
            Floor: floor,
            Price: price,
            ID: id
        }

        $.ajax({
            url: '/Admin/Home/SaveRoom',
            data: {
                strMotelRoom: JSON.stringify(motelRoom)
            },
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    bootbox.alert("Lưu thành công");
                    $('#modalAddUpdateMotel').modal('hide');
                    homeController.loadData();
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
        $('#hid-id-room').val('0');
        $('#txtNameRoom').val('');
        $('#txtMaxGuest').val('2');
        $('#txtSquare').val('');
        $('#txtFloor').val('');
        $('#txtPrice').val('');
    },
    loadData: function () {
        $.ajax({
            url: '/Admin/Home/LoadDataMotel',
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
                    var template = $('#data-motelRoom').html();
                    var total = response.total;
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            Name: item.Name,
                            Floor: item.Floor,
                            Price: item.Price,
                            MaxGuest: item.MaxGuest,
                            Square: item.Square,
                            ID: item.ID,
                            Status: (item.Status == true) ? "<span class=\"label label-danger\">Đã được thuê</span>" : "<span class=\"label label-success\">Còn trống</span>"
                        });
                    });
                    $('#tblMotelRoom').html(html);
                    homeController.paginationMotel(total, function () {
                        homeController.loadData();
                    });
                }
            }
        })
    },
    paginationMotel: function (totalRow, callback) {
        var totalPage = Math.ceil(totalRow / homeconfig.pageSize);
        $('#pagination-motel').twbsPagination({
            totalPages: totalPage,
            visiblePages: 4,
            onPageClick: function (event, page) {
                homeconfig.pageIndex = page;
                setTimeout(callback, 200);
            }
        });
    }
}

homeController.init();