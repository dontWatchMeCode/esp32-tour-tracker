/*

* _dv = devices

*/

function init_dv() {
    update_dv();

    document.getElementById('add-key').addEventListener('click', () => {
        progress_dv(1);
        fetch('/api/key', { method: 'POST' })
            .then(function (response) {
                update_dv();
            })
            .catch(function (error) {
                console.log(error);
            });
    });
}

function timer_dv() {
    update_dv();
}

function update_dv() {
    const container = document.getElementById('output_tbl');
    let output = "";
    fetch('/api/key', { method: 'GET' })
        .then(res => res.json())
        .then(data => get_req = data)
        .then(() => {
            get_req.forEach((data, index) => {
                output += "<tr> <th scope='col' class='d-none d-xl-table-cell text-center api-key'> <div class='form-outline'> <input class='form-control active' type='text' value='" + data[1] + "' aria-label='readonly api key' readonly='' disabled> <div style='position:absolute; left:0; right:0; top:0; bottom:0;'></div> <label class='form-label' style='margin-left: 0px;'>Readonly</label> <div class='form-notch'> <div class='form-notch-leading' style='width: 9px;'></div> <div class='form-notch-middle' style='width: 55px;'></div> <div class='form-notch-trailing'></div> </div> </div> </th> <th scope='col'> <div class='input-group align-items-center justify-content-center flex-nowrap'> <div class='form-outline float-start'> <input type='text' class='form-control input-name placeholder-active' value='" + data[0] + "'> <div class='form-notch'> <div class='form-notch-leading' style='width: 9px;'></div> <div class='form-notch-middle' style='width: 0px;'></div> <div class='form-notch-trailing'></div> </div> </div> <button type='button' class='btn btn-outline-dark d-table-cell d-xl-none copy-key'> <i class='fas fa-copy'></i> </button> <button type='button' class='btn btn-outline-dark d-table-cell d-xl-none del-key'> <i class='fas fa-trash'></i> </button> </div> </th> <th class='d-none d-xl-table-cell'> <button type='button' class='btn btn-outline-dark copy-key'> <i class='fas fa-copy'></i> </button> <button type='button' class='btn btn-outline-dark del-key'> <i class='fas fa-trash'></i> </button> </th></tr>";
            });
            container.innerHTML = output;
            listeners_dv();
            progress_dv(0);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function index_calc_dv(arg) {
    if (arg % 2 != 0) { arg = (arg / 2) - 0.5; }
    else { arg = (arg / 2); }

    return arg;
}

function listeners_dv() {
    document.querySelectorAll('.api-key > div').forEach((item, index) => {
        api_key = document.querySelectorAll('.api-key input')[index_calc_dv(index)].value.trim();
        item.addEventListener('click', event => {
            navigator.clipboard.writeText(api_key);
            Swal.fire({
                title: 'API key kopiert:',
                text: api_key.substr(0, 40) + "...",
                icon: 'success',
                customClass: {
                    confirmButton: 'btn btn-outline-dark m-2'
                },
                buttonsStyling: false,
            });
        });
    });

    document.querySelectorAll('.input-name').forEach((item, index) => {
        item.addEventListener('blur', event => {
            progress_dv(1);
            input_name = document.querySelectorAll('.input-name')[index].value;
            fetch('/api/key?id=' + index + '&value=' + input_name, { method: 'PATCH' })
                .then(function (response) {
                    progress_dv(0);
                });
        });
    });

    document.querySelectorAll('.del-key').forEach((item, index) => {
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
                    progress_dv(1);
                    fetch('/api/key?id=' + (index_calc_dv(index)), { method: 'DELETE' })
                        .then(function (response) {
                            update_dv();
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
        });
    });

    document.querySelectorAll('.copy-key').forEach((item, index) => {
        item.addEventListener('click', event => {
            api_key = document.querySelectorAll('.api-key input')[index_calc_dv(index)].value.trim();
            navigator.clipboard.writeText(api_key);
            Swal.fire({
                title: 'API key kopiert:',
                text: api_key.substr(0, 40) + "...",
                icon: 'success',
                customClass: {
                    confirmButton: 'btn btn-outline-dark m-2'
                },
                buttonsStyling: false,
            });
        });
    });
}

function progress_dv(status) {
    const container = document.getElementById("loading");
    if (status == 1) {
        click_block.open();
        loading_animation.on();
    } else {
        click_block.close();
        loading_animation.off();
    }
}

if (window.location.href.indexOf("/devices") != -1) {
    init_dv();
    setInterval(() => { timer_dv(); }, 30000);
}
