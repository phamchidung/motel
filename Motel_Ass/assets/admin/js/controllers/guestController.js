var homeconfig = {
    pageSize: 5,
    pageIndex: 1
}
var guestController = {
    init: function () {
        guestController.loadData();
        guestController.registerEvent();
    },
    registerEvent: function () {
        $('#frmSaveGuest').validate({
            rules: {
                txtNameGuest: "required",
                txtPhone: {
                    required: true,
                    digits: true
                },
                txtCardID: {
                    required: true,
                    digits: true
                },
                txtTemporaryResidentTo: "required",
                txtTemporaryResidentFrom: "required",

                txtReasonTemporaryResident: "required"
            },
            messages: {
                txtNameGuest: "Vui lòng nhập tên khách",
                txtPhone: {
                    required: "Vui lòng nhập số điện thoại",
                    digits: "Số điện thoại không hợp lệ"
                },
                txtCardID: {
                    required: "Vui lòng nhập số CMND/CCCD",
                    digits: "Số CMND/CCCD không hợp lệ"
                },
                txtTemporaryResidentTo: "Vui lòng chọn ngày bắt đầu tạm trú",

                txtTemporaryResidentFrom: "Vui lòng chọn ngày hết tạm trú",

                txtReasonTemporaryResident: "required"
            }
        });
        $(document).on('click', '.btn-detail-guest', function () {
            $('#modal-detail-guest').modal('show');
            var id = $(this).data('id');
            guestController.loadDetailGuest(id);
        });
        $('#btn-add-guest').off('click').on('click', function () {
            $('#modal-add-update-guest').modal('show');
            guestController.resetForm();
        });
        $('#btn-save-guest').off('click').on('click', function () {
            if ($('#frmSaveGuest').valid()) {
                $('#pagination-guest-parent').html('');
                $('#pagination-guest-parent').html('<ul id="pagination-guest" class="paginnation"></ul>');
                guestController.saveGuest();
            }
        });
    },
    saveGuest: function () {
        var id = parseInt($('#hid-id-guest').val());
        var name = $('#txtNameGuest').val();
        var phone = $('#txtPhone').val();
        var dob = $('#txtDob').val();
        var cardId = $('#txtCardID').val();
        var locationGetCard = $('#txtLocationGetCard').val();
        var dateGetCard = $('#txtDateGetCard').val();
        var household = $('#txtHousehold').val();
        var email = $('#txtEmail').val();
        var jobLocation = $('#txtJobLocation').val();
        var temporaryResidentFrom = $('#txtTemporaryResidentFrom').val();
        var temporaryResidentTo = $('#txtTemporaryResidentTo').val();
        var reasonTemporaryResident = $('#txtReasonTemporaryResident').val();
        var job = $('input[name="job"]:checked').val();
        var gender = $('input[name="gender"]:checked').val();

        var cardIdDetail = {
            CardID: cardId,
            LocationGetCard: locationGetCard,
            DateGetCard: dateGetCard,
            Household: household
        }

        var guest = {
            ID: id,
            Name: name,
            Phone: phone,
            Email: email,
            Representative: false,
            Dob: dob,
            Job: job,
            Gender: gender,
            JobLocation: jobLocation,
            Staying: false,
            CardID: cardId,
            ReasonTemporaryResident: reasonTemporaryResident,
            TemporaryResidentFrom: temporaryResidentFrom,
            TemporaryResidentTo: temporaryResidentTo
        }

        $.ajax({
            url: '/Admin/Guest/SaveGuest',
            data: {
                strGuest: JSON.stringify(guest),
                strCardIDDetail: JSON.stringify(cardIdDetail)
            },
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    bootbox.alert("Lưu thành công");
                    $('#modal-add-update-guest').modal('hide');
                    guestController.loadData();
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
        $('#hid-id-guest').val('0');
        $('#txtNameGuest').val('');
        $('#txtPhone').val('');
        $('#txtDob').val('');
        $('#txtCardID').val('');
        $('#txtLocationGetCard').val('');
        $('#txtDateGetCard').val('');
        $('#txtHousehold').val('');
        $('#txtEmail').val('');
        $('#txtJobLocation').val('');
        $('#txtTemporaryResidentFrom').val('');
        $('#txtTemporaryResidentTo').val('');
        $('#txtReasonTemporaryResident').val('');
    },
    loadDetailGuest: function (id) {
        $.ajax({
            url: '/Admin/Guest/LoadDetailGuest',
            type: 'GET',
            data: {
                id: id
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-detail-guest').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            Gender: (item.Gender == true) ? "Nam" : "Nữ",
                            CardID: item.CardID,
                            LocationGetCard: item.LocationGetCard,
                            DateGetCard: item.DateGetCard,
                            Job: item.Job,
                            Dob: item.Dob,
                            Email: item.Email,
                            JobLocation: item.JobLocation
                        });
                    });
                    $('#tbl-detail-guest').html(html);
                }
            }
        })
    },
    loadData: function () {
        $.ajax({
            url: '/Admin/Guest/LoadDataGuest',
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
                    var template = $('#data-guest').html();
                    var total = response.total;
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
                    $('#tbl-guest').html(html);
                    guestController.paginationGuest(total, function () {
                        guestController.loadData();
                    });
                }
            }
        })
    },
    paginationGuest: function (totalRow, callback) {
        var totalPage = Math.ceil(totalRow / homeconfig.pageSize);
        $('#pagination-guest').twbsPagination({
            totalPages: totalPage,
            visiblePages: 4,
            onPageClick: function (event, page) {
                homeconfig.pageIndex = page;
                setTimeout(callback, 200);
            }
        });
    }
}
guestController.init();