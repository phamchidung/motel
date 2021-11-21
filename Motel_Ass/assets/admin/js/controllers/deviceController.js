var deviceController = {
    init: function () {
        deviceController.loadData();
        deviceController.registerEvent();
    },
    registerEvent: function () {
        $('#frm-save-device').validate({
            rules: {
                txtName: "required",
                txtPrice: {
                    required: true,
                    number: true,
                    min: 0
                },
                txtCompensationPrice: {
                    required: true,
                    number: true,
                    min: 0
                }
            },
            messages: {
                txtName: "Vui lòng nhập tên thiết bị",
                txtPrice: {
                    required: "Vui lòng nhập giá thiết bị",
                    number: "Giá thiết bị không hợp lệ",
                    min: "Giá thiết bị không được nhỏ hơn 0"
                },
                txtCompensationPrice: {
                    required: "Vui lòng nhập giá bồi thường",
                    number: "Giá bồi thường không hợp lệ",
                    min: "Giá bồi thường không được nhỏ hơn 0"
                }
            }
        });
        $('#btn-add-device').off('click').on('click', function () {
            $('#modalAddUpdateDevice').modal('show');
            deviceController.resetForm();
        });
        $('#btn-save-device').off('click').on('click', function () {
            if ($('#frm-save-device').valid()) {
                deviceController.saveDevice();
            }
        });
    },
    saveDevice: function () {
        var name = $('#txtName').val();
        var price = parseInt($('#txtPrice').val());
        var compensationPrice = parseInt($('#txtCompensationPrice').val());
        var note = $('#txtNote').val();
        var unit = $('#slUnit').val();
        var device = {
            Name: name,
            Price: price,
            CompensationPrice: compensationPrice,
            Note: note,
            Unit: unit
        }

        $.ajax({
            url: '/Admin/Device/SaveDevice',
            data: {
                strDevice: JSON.stringify(device)
            },
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    bootbox.alert("Lưu thành công");
                    $('#modalAddUpdateDevice').modal('hide');
                    deviceController.loadData();
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
        $('#hid-id-device').val('0');
        $('#txtName').val('');
        $('#txtPrice').val('');
        $('#txtCompensationPrice').val('');
        $('#txtNote').val('');
    },
    loadData: function () {
        $.ajax({
            url: '/Admin/Device/LoadDataDevice',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-device').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            Name: item.Name,
                            Unit: item.Unit,
                            Price: item.Price,
                            CompensationPrice: item.CompensationPrice,
                            TotalQuantity: item.TotalQuantity
                        });
                    });
                    $('#tbl-device').html(html);
                }
            }
        })
    }
}

deviceController.init();