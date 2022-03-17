function update_fi() {
    const container = document.getElementById('output_tbl');
    let output = "";
    fetch('/api/tours', { method: 'GET' })
        .then(res => res.json())
        .then(data => get_req = data)
        .then(() => {
            console.log(get_req);
            get_req.forEach((data, index) => {
                output += "";
            });
            /* container.innerHTML = output; */
            listeners_dv();
            progress_dv(0);
        })
        .catch(function (error) {
            console.log(error);
        });
    /* TODO */
}

if (window.location.href.indexOf("/files") != -1) {
    update_fi();
}
