if (window.location.href.indexOf("/devices") != -1) {

    function init() {
        update();
    }

    function timer() {
        update();
    }

    function update() {
        const container = document.getElementById('output_tbl');
        let output = "";
        fetch('/api/key', { method: 'GET' })
            .then(res => res.json())
            .then(data => get_req = data)
            .then(() => {
                get_req.forEach((data, index) => {
                    output
                        += "<tr> <th scope='col' class='d-none d-xl-table-cell text-center api-key'> <div class='form-outline'> <input class='form-control active' type='text' value='" + data[1] + "' aria-label='readonly api key' readonly='' disabled> <div style='position:absolute; left:0; right:0; top:0; bottom:0;'></div> <label class='form-label' style='margin-left: 0px;'>Readonly</label> <div class='form-notch'> <div class='form-notch-leading' style='width: 9px;'></div> <div class='form-notch-middle' style='width: 60px;'></div> <div class='form-notch-trailing'></div> </div> </div> </th> <th scope='col'> <div class='input-group align-items-center justify-content-center flex-nowrap'> <div class='form-outline float-start'> <input type='text' class='form-control input-name placeholder-active' value=" + data[0] + "> <div class='form-notch'> <div class='form-notch-leading' style='width: 9px;'></div> <div class='form-notch-middle' style='width: 0px;'></div> <div class='form-notch-trailing'></div> </div> </div> <button type='button' class='btn btn-outline-dark d-table-cell d-xl-none copy-key'> <i class='fas fa-copy'></i> </button> <button type='button' class='btn btn-outline-dark d-table-cell d-xl-none del-key'> <i class='fas fa-trash'></i> </button> </div> </th> <th class='d-none d-xl-table-cell'> <button type='button' class='btn btn-outline-dark copy-key'> <i class='fas fa-copy'></i> </button> <button type='button' class='btn btn-outline-dark del-key'> <i class='fas fa-trash'></i> </button> </th></tr>";
                });
                container.innerHTML = output;
                listeners();
                progress(0);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function index_calc(arg) {
        if (arg % 2 != 0) { arg = (arg / 2) - 0.5; }
        else { arg = (arg / 2); }

        return arg;
    }

    function listeners() {
        document.querySelectorAll('.api-key > div').forEach((item, index) => {
            api_key = document.querySelectorAll('.api-key input')[index_calc(index)].value.trim();
            console.log(api_key);
            item.addEventListener('click', event => {
                navigator.clipboard.writeText(api_key);
                alert("API key kopiert:\n\n" + api_key.substr(0, 40) + "...");
            })
        });

        document.querySelectorAll('.input-name').forEach((item, index) => {
            item.addEventListener('blur', event => {
                progress(1);
                input_name = document.querySelectorAll('.input-name')[index].value;
                fetch('/api/key?id=' + index + '&value=' + input_name, { method: 'PATCH' })
                    .then(function (response) {
                        progress(0);
                    });
            })
        });

        document.querySelectorAll('.del-key').forEach((item, index) => {
            item.addEventListener('click', event => {
                if (confirm("Sind sie sicher?")) {
                    progress(1);
                    fetch('/api/key?id=' + (index_calc(index)), { method: 'DELETE' })
                        .then(function (response) {
                            update();
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            })
        });

        document.querySelectorAll('.copy-key').forEach((item, index) => {
            item.addEventListener('click', event => {
                api_key = document.querySelectorAll('.api-key input')[index_calc(index)].value.trim();
                navigator.clipboard.writeText(api_key);
                alert("API key kopiert:\n\n" + api_key.substr(0, 40) + "...");
            })
        });
    }

    document.getElementById('add-key').addEventListener('click', () => {
        progress(1);
        fetch('/api/key', { method: 'POST' })
            .then(function (response) {
                update();
            })
            .catch(function (error) {
                console.log(error);
            });
    });

    function progress(status) {
        const container = document.getElementById("loading");
        if (status == 1) {
            click_block.open();
            loading_animation.on();
        } else {
            click_block.close();
            loading_animation.off();
        }
    }

    init();
    setInterval(() => { timer() }, 30000);
}