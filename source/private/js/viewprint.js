function init_vp() {

    const ctx1 = document.getElementById('spChart').getContext('2d');
    const spChart = new Chart(ctx1, {
        type: 'line',
        responsive: true,
        maintainAspectRatio: false,
        data: {
            labels: [],
            datasets: [{
                label: 'Geschwindigkeit',
                data: [],
                borderWidth: 1,
                borderColor: [
                    '#d45087'
                ],
                pointStyle: 'line',
            },],
        },
        options: {
            scales: {
                y: {
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });

    const ctx2 = document.getElementById('tmpChart').getContext('2d');
    const tmpChart = new Chart(ctx2, {
        type: 'line',
        responsive: true,
        maintainAspectRatio: false,
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature',
                data: [],
                borderWidth: 1,
                borderColor: [
                    '#ffa600'
                ],
                pointStyle: 'line'
            }],
        },
        options: {
            scales: {
                y: {
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });

    const ctx3 = document.getElementById('heiChart').getContext('2d');
    const heiChart = new Chart(ctx3, {
        type: 'line',
        responsive: true,
        maintainAspectRatio: false,
        data: {
            labels: [],
            datasets: [{
                label: 'Höhenmeter',
                data: [],
                borderWidth: 1,
                borderColor: [
                    '#003f5c'
                ],
                pointStyle: 'line'
            }],
        },
        options: {
            scales: {
                y: {
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });

    for (let i = 1; i < data_array.length - 2; i++) {
        spChart.data.labels[i] = data_array[i][7].substring(0, 5);
        spChart.data.datasets[0].data[i] = data_array[i][11];

        tmpChart.data.labels[i] = data_array[i][7].substring(0, 5);
        tmpChart.data.datasets[0].data[i] = data_array[i][6];

        heiChart.data.labels[i] = data_array[i][7].substring(0, 5);
        heiChart.data.datasets[0].data[i] = data_array[i][10];
    }

    spChart.update('none');
    tmpChart.update('none');
    heiChart.update('none');

    window.print();
}


if (window.location.href.indexOf("/viewprint") != -1) {
    init_vp();
}
