/*

* _fi = files

TODO: export / download button

*/

function update_fi() {
    const container = document.getElementById('accordionFiles');
    let output = "";
    fetch('/api/tours', { method: 'GET' })
        .then(res => res.json())
        .then(data => get_req = data)
        .then(() => {
            get_req.forEach((data, index) => {
                output +=
                    `<div class="accordion-item">
                        <h2 class="accordion-header d-flex justify-content-center align-items-center" id="heading_` + index + `">

                            <button type="button" class="btn btn-dark ms-3 p-1 rn-name-btn"
                                style="min-width: 25px; min-height: 25px;">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button class="accordion-button collapsed flex-grow-1 accordion-btn text-dark" type="button" data-mdb-toggle="collapse"
                                data-mdb-target="#collapse_` + index + `" aria-expanded="false" aria-controls="collapse_` + index + `"
                                style="box-shadow: none;">
                                ` + data.name + " <span class='ms-4 font-monospace text-black-50 d-none d-md-inline'>[" + data.file + "]</span> " + `
                            </button>

                        </h2>
                        <div id="collapse_` + index + `" class="accordion-collapse collapse" aria-labelledby="heading_` + index + `"
                            data-mdb-parent="#accordionFiles">
                            <div class="accordion-body pt-1">

                                <div class="container-fluid">
                                    <div class="row">

                                        <div class="col-md-3 col-6 pb-4 pb-md-0">
                                            <div class="card">
                                                <div class="card-body p-3">
                                                    <h5 class="card-title text-center">°C</h5>
                                                    <div class="container-fluid m-0 p-0">
                                                        <div class="row">
                                                            <div class="col text-end p-0 px-1">
                                                                Max: <br>
                                                                Min: <br>
                                                                Avg: <br>
                                                            </div>
                                                            <div class="col p-0 px-1 temp_info">
                                                                <span class="badge bg-dark rounded-pill">-</span> <br>
                                                                <span class="badge bg-dark rounded-pill">-</span> <br>
                                                                <span class="badge bg-dark rounded-pill">-</span> <br>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-3 col-6 pb-4 pb-md-0">
                                            <div class="card">
                                                <div class="card-body p-3">
                                                    <h5 class="card-title text-center">Km/h</h5>
                                                    <div class="container-fluid m-0 p-0">
                                                        <div class="row">
                                                            <div class="col text-end p-0 px-1">
                                                                Max: <br>
                                                                Min: <br>
                                                                Avg: <br>
                                                            </div>
                                                            <div class="col p-0 px-1 speed_info">
                                                                <span class="badge bg-dark rounded-pill">-</span> <br>
                                                                <span class="badge bg-dark rounded-pill">-</span> <br>
                                                                <span class="badge bg-dark rounded-pill">-</span> <br>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-1"> </div>

                                        <div class="col-md-4 pb-4 pb-md-0">
                                            <div class="form-outline">
                                                <textarea class="form-control textarea-notes active shadow-3" id="textArea_` + index + `" rows="5"
                                                maxlength="100" style="resize: none;">` + data.notes + `</textarea>
                                                <label class="form-label" for="textArea_` + index + `"
                                                    style="margin-left: 0px;">Notizen</label>
                                                <div class="form-notch">
                                                    <div class="form-notch-leading" style="width: 9px;"></div>
                                                    <div class="form-notch-middle" style="width: 52px;"></div>
                                                    <div class="form-notch-trailing"></div>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="col-md-1">
                                            <button type="button" class="btn btn-dark mb-2 p-0 open-element-btn float-md-none float-end ms-2 ms-md-0"
                                                style="min-width: 30px; min-height: 40px;">
                                                <i class="fas fa-external-link-alt"></i>
                                            </button>
                                            <button type="button" class="btn btn-dark mb-2 p-0 del-element-btn float-md-none float-end ms-2 ms-md-0"
                                                style="min-width: 30px; min-height: 40px;">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                            <button type="button" class="btn btn-dark mb-2 p-0 download-element-btn float-md-none float-end ms-2 ms-md-0"
                                                style="min-width: 30px; min-height: 40px;">
                                                <i class="fas fa-download"></i>
                                            </button>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>`;
            });
            container.innerHTML = output;
            listeners_fi(get_req);
            progress(0);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function listeners_fi(data_array) {
    document.querySelectorAll('.rn-name-btn').forEach((item, index) => {
        item.addEventListener('click', event => {

            /* close open accordion by simulating button click */
            document.querySelectorAll('.accordion-btn').forEach((item) => {
                if (!item.classList.contains("collapsed")) {
                    item.click();
                }
            });

            Swal.fire({
                title: 'Namensänderung',
                input: 'text',
                inputLabel: 'Bitte geben sie ihren gewünschten Namen ein.',
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-danger m-2',
                    cancelButton: 'btn btn-outline-dark m-2'
                },
                buttonsStyling: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Abbrechen',
                confirmButtonText: 'Ändern',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Name kann nicht leer sein!';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    progress(1);
                    fetch('/api/tours?id=' + index + "&name=" + result.value, { method: 'PATCH' })
                        .then(function (response) {
                            update_fi();
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
        });
    });

    document.querySelectorAll('.accordion-btn').forEach((item, index) => {
        const speed_info_container = document.querySelectorAll('.speed_info')[index].querySelectorAll('span');
        const temp_info_container = document.querySelectorAll('.temp_info')[index].querySelectorAll('span');

        item.addEventListener('click', event => {
            if (speed_info_container[0].innerHTML == "-") {
                loading_animation.on();
                fetch('/api/tours?file=' + data_array[index].file, { method: 'GET' })
                    .then(res => res.json())
                    .then(data => get_req = data)
                    .then(function (response) {
                        speed_info_container.forEach((item, index) => {
                            item.innerHTML = get_req[index];
                        });
                        temp_info_container.forEach((item, index) => {
                            item.innerHTML = get_req[index + 3];
                        });
                        loading_animation.off();
                    });
            }
        });
    });

    document.querySelectorAll('.open-element-btn').forEach((item, index) => {
        item.addEventListener('click', event => {
            window.open("/view/" + data_array[index].file, "_blank");
        });
    });

    document.querySelectorAll('.del-element-btn').forEach((item, index) => {
        item.addEventListener('click', event => {

            Swal.fire({
                title: 'Sind Sie sich sicher?',
                text: "Sie können dies nicht rückgängig machen!",
                icon: 'warning',
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-danger m-2',
                    cancelButton: 'btn btn-outline-dark m-2'
                },
                buttonsStyling: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Abbrechen',
                confirmButtonText: 'Löschen'
            }).then((result) => {
                if (result.isConfirmed) {
                    progress(1);
                    fetch('/api/tours?id=' + index, { method: 'DELETE' })
                        .then(function (response) {
                            update_fi();
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
        });
    });

    document.querySelectorAll('.textarea-notes').forEach((item, index) => {
        item.addEventListener('blur', event => {
            fetch('/api/tours?id=' + index + "&notes=" + item.value.replace(/\n/g, "%0A"), { method: 'PATCH' })
                .then(function (response) {
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    });

    document.querySelectorAll('.download-element-btn').forEach((item, index) => {
        item.addEventListener('click', event => {
            window.open("/viewprint/" + data_array[index].file, "_blank");
        });
    });

}

if (window.location.href.indexOf("/files") != -1) {
    update_fi();
}
