/*

* set max => infoChart.options.scales.y.max = 20;
* colors for graphs
    #003f5c
    #2f4b7c
    #665191
    #a05195
    #d45087
    #f95d6a
    #ff7c43
    #ffa600
* color for map
    fade => 'blue', 'yellow', 'red'

? multible axes
TODO: better way to display forces
TODO: mobile view

*/

function initMap() {
    const f = chroma.scale(['blue', 'yellow', 'red']);

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        center: new google.maps.LatLng(data_array[1][8], data_array[1][9]),
        mapTypeId: "terrain",
    });

    let max = 0;

    for (i = 1; i < data_array.length - 2; i++) {
        if (max < data_array[i][11]) {
            max = data_array[i][11];
        }
    }

    for (i = 1; i < data_array.length - 2; i++) {
        let pos1 = new google.maps.LatLng(data_array[i][8], data_array[i][9]);
        let pos2 = new google.maps.LatLng(data_array[i + 1][8], data_array[i + 1][9]);

        var check_speed = [10, 50, 100];
        var current_speed = data_array[i][11];

        polyline = new google.maps.Polyline({
            path: [pos1, pos2],
            geodesic: true,
            strokeColor: f(current_speed / max).toString(),
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: map
        });
    }

    /* bad performence */
    /* for (i = 1; i < data_array.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(data_array[i][8], data_array[i][9]),
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#996699',
                fillOpacity: 0.5,
                strokeWeight: 0,
                scale: 7
            },
            title: 'kmh: ' + data_array[i][11] + '; alt: ' + data_array[i][10]
        })
    } */
    const ctx1 = document.getElementById('infoChart').getContext('2d');
    const infoChart = new Chart(ctx1, {
        type: 'line',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                label: 'km/h',
                data: [],
                borderWidth: 1,
                borderColor: [
                    '#58508d'
                ],
                pointStyle: 'line',
            },
            {
                label: 'C',
                data: [],
                borderWidth: 1,
                borderColor: [
                    '#ff6361'
                ],
                pointStyle: 'line'
            },
            {
                label: 'H',
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
                    beginAtZero: true,
                    suggestedMax: 50
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });

    const ctx2 = document.getElementById('accChart').getContext('2d');
    const accChart = new Chart(ctx2, {
        type: 'line',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                label: 'x',
                data: [],
                borderWidth: 1,
                borderColor: [
                    '#003f5c'
                ],
                pointStyle: 'line'
            },
            {
                label: 'y',
                data: [],
                borderWidth: 1,
                borderColor: [
                    '#58508d'
                ],
                pointStyle: 'line'
            },
            {
                label: 'z',
                data: [],
                borderWidth: 1,
                borderColor: [
                    '#bc5090'
                ],
                pointStyle: 'line'
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });

    const ctx3 = document.getElementById('rotChart').getContext('2d');
    const rotChart = new Chart(ctx3, {
        type: 'line',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                label: 'x',
                data: [],
                borderWidth: 1,
                borderColor: [
                    '#003f5c'
                ],
                pointStyle: 'line'
            },
            {
                label: 'y',
                data: [],
                borderWidth: 1,
                borderColor: [
                    '#58508d'
                ],
                pointStyle: 'line'
            },
            {
                label: 'z',
                data: [],
                borderWidth: 1,
                borderColor: [
                    '#bc5090'
                ],
                pointStyle: 'line'
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
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
        infoChart.data.labels[i] = data_array[i][7].substring(0, 5);
        infoChart.data.datasets[0].data[i] = data_array[i][11];
        infoChart.data.datasets[1].data[i] = data_array[i][6];
        infoChart.data.datasets[2].data[i] = data_array[i][10];

        accChart.data.labels[i] = data_array[i][7].substring(0, 5);
        accChart.data.datasets[0].data[i] = data_array[i][0];
        accChart.data.datasets[1].data[i] = data_array[i][1];
        accChart.data.datasets[2].data[i] = data_array[i][2];

        rotChart.data.labels[i] = data_array[i][7].substring(0, 5);
        rotChart.data.datasets[0].data[i] = data_array[i][3];
        rotChart.data.datasets[1].data[i] = data_array[i][4];
        rotChart.data.datasets[2].data[i] = data_array[i][5];
    }
    infoChart.update();
    accChart.update();
    rotChart.update();
}
