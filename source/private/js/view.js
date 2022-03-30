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

    const color_x = "#2f4b7c";
    const color_y = "#d45087";
    const color_z = "#ff7c43";

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
    const ctx1 = document.getElementById('spChart').getContext('2d');
    const spChart = new Chart(ctx1, {
        type: 'line',
        responsive: true,
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

    const ctx2 = document.getElementById('tmpChart').getContext('2d');
    const tmpChart = new Chart(ctx2, {
        type: 'line',
        responsive: true,
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

    const ctx3 = document.getElementById('heiChart').getContext('2d');
    const heiChart = new Chart(ctx3, {
        type: 'line',
        responsive: true,
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

    /* --- */

    const setChart = new Chart(document.getElementById('setChart').getContext('2d'), {
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
                    '#f95d6a'
                ],
                pointStyle: 'line'
            },],
        },
        options: {
            maintainAspectRatio: false,
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

    const rxChart = new Chart(document.getElementById('rxChart').getContext('2d'), {
        type: 'line',
        responsive: true,
        maintainAspectRatio: false,
        data: {
            labels: [],
            datasets: [{
                label: 'Rotation X',
                data: [],
                borderWidth: 1,
                borderColor: [
                    color_x
                ],
                pointStyle: 'line'
            }],
        },
        options: {
            maintainAspectRatio: false,
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

    const ryChart = new Chart(document.getElementById('ryChart').getContext('2d'), {
        type: 'line',
        responsive: true,
        maintainAspectRatio: false,
        data: {
            labels: [],
            datasets: [{
                label: 'Rotation Y',
                data: [],
                borderWidth: 1,
                borderColor: [
                    color_y
                ],
                pointStyle: 'line'
            }],
        },
        options: {
            maintainAspectRatio: false,
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

    const rzChart = new Chart(document.getElementById('rzChart').getContext('2d'), {
        type: 'line',
        responsive: true,
        maintainAspectRatio: false,
        data: {
            labels: [],
            datasets: [{
                label: 'Rotation Z',
                data: [],
                borderWidth: 1,
                borderColor: [
                    color_z
                ],
                pointStyle: 'line'
            }],
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });

    const fxChart = new Chart(document.getElementById('fxChart').getContext('2d'), {
        type: 'line',
        responsive: true,
        maintainAspectRatio: false,
        data: {
            labels: [],
            datasets: [{
                label: 'Achse X',
                data: [],
                borderWidth: 1,
                borderColor: [
                    color_x
                ],
                pointStyle: 'line'
            }],
        },
        options: {
            maintainAspectRatio: false,
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

    const fyChart = new Chart(document.getElementById('fyChart').getContext('2d'), {
        type: 'line',
        responsive: true,
        maintainAspectRatio: false,
        data: {
            labels: [],
            datasets: [{
                label: 'Achse Y',
                data: [],
                borderWidth: 1,
                borderColor: [
                    color_y
                ],
                pointStyle: 'line'
            }],
        },
        options: {
            maintainAspectRatio: false,
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

    const fzChart = new Chart(document.getElementById('fzChart').getContext('2d'), {
        type: 'line',
        responsive: true,
        maintainAspectRatio: false,
        data: {
            labels: [],
            datasets: [{
                label: 'Achse Z',
                data: [],
                borderWidth: 1,
                borderColor: [
                    color_z
                ],
                pointStyle: 'line'
            }],
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
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
        setChart.data.labels[i] = data_array[i][7].substring(0, 5);
        setChart.data.datasets[0].data[i] = data_array[i][11];

        spChart.data.labels[i] = data_array[i][7].substring(0, 5);
        spChart.data.datasets[0].data[i] = data_array[i][11];

        tmpChart.data.labels[i] = data_array[i][7].substring(0, 5);
        tmpChart.data.datasets[0].data[i] = data_array[i][6];

        heiChart.data.labels[i] = data_array[i][7].substring(0, 5);
        heiChart.data.datasets[0].data[i] = data_array[i][10];
    }
    setChart.update();

    spChart.update();
    tmpChart.update();
    heiChart.update();

    function set(min, max) {

        let temp;

        if (min > max) {
            temp = min;
            min = max;
            max = temp;
        }

        rxChart.options.scales.x.min = min;
        rxChart.options.scales.x.max = max;

        ryChart.options.scales.x.min = min;
        ryChart.options.scales.x.max = max;

        rzChart.options.scales.x.min = min;
        rzChart.options.scales.x.max = max;

        fxChart.options.scales.x.min = min;
        fxChart.options.scales.x.max = max;

        fyChart.options.scales.x.min = min;
        fyChart.options.scales.x.max = max;

        fzChart.options.scales.x.min = min;
        fzChart.options.scales.x.max = max;

        /* rxChart.data.labels.pop(); */
        /* rxChart.data.datasets[0].data.pop(); */
        for (let i = 1; i < data_array.length - 2; i++) {
            rxChart.data.datasets[0].data.pop();
            rxChart.data.labels.pop();

            ryChart.data.datasets[0].data.pop();
            ryChart.data.labels.pop();

            rzChart.data.datasets[0].data.pop();
            rzChart.data.labels.pop();

            fxChart.data.datasets[0].data.pop();
            fxChart.data.labels.pop();

            fyChart.data.datasets[0].data.pop();
            fyChart.data.labels.pop();

            fzChart.data.datasets[0].data.pop();
            fzChart.data.labels.pop();
        }

        /* rxChart.options.scale.y.tricks.stepSize = 20; */
        for (let i = min; i < max; i++) {
            rxChart.data.labels[i] = data_array[i][7].substring(0, 5);
            rxChart.data.datasets[0].data[i] = data_array[i][3];

            ryChart.data.labels[i] = data_array[i][7].substring(0, 5);
            ryChart.data.datasets[0].data[i] = data_array[i][4];

            rzChart.data.labels[i] = data_array[i][7].substring(0, 5);
            rzChart.data.datasets[0].data[i] = data_array[i][5];


            fxChart.data.labels[i] = data_array[i][7].substring(0, 5);
            fxChart.data.datasets[0].data[i] = data_array[i][0];

            fyChart.data.labels[i] = data_array[i][7].substring(0, 5);
            fyChart.data.datasets[0].data[i] = data_array[i][1];

            fzChart.data.labels[i] = data_array[i][7].substring(0, 5);
            fzChart.data.datasets[0].data[i] = data_array[i][2];
        }
        rxChart.update('none');
        ryChart.update('none');
        rzChart.update('none');

        fxChart.update('none');
        fyChart.update('none');
        fzChart.update('none');
    }

    document.querySelectorAll('.lb-open').forEach((open, index) => {
        const container = document.querySelectorAll('.lb-container')[index];
        const close = document.querySelectorAll('.lb-close')[index];
        const tooltips = document.querySelectorAll('[data-mdb-toggle="tooltip"]');
        open.addEventListener('click', event => {
            container.style.visibility = 'visible';
            container.style.opacity = '1';
            tooltips.forEach((tooltip) => {
                const instance = mdb.Tooltip.getInstance(tooltip);
                instance.hide();
            });
        });

        close.addEventListener('click', event => {
            container.style.visibility = 'hidden';
            container.style.opacity = '0';
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            document.querySelectorAll('.lb-container').forEach((item, index) => {
                item.style.visibility = 'hidden';
                item.style.opacity = '0';
            });
        }
    });

    var canvas = document.getElementById('setChart');
    var overlay = document.getElementById('overlay');
    var chart = setChart;
    console.log(overlay);
    var startIndex = 0;
    overlay.width = canvas.width;
    overlay.height = canvas.height;
    var selectionContext = overlay.getContext('2d');
    var selectionRect = {
        w: 0,
        startX: 0,
        startY: 0
    };
    var drag = false;
    console.log(canvas);
    canvas.addEventListener('pointerdown', evt => {
        const points = chart.getElementsAtEventForMode(evt, 'index', {
            intersect: false
        });
        console.log(points[0].index);
        //(evt, 'nearest', { intersect: true }, true)
        startIndex = points[0].index;
        const rect = canvas.getBoundingClientRect();
        selectionRect.startX = evt.clientX - rect.left;
        selectionRect.startY = chart.chartArea.top;
        drag = true;
        // save points[0]._index for filtering
    });
    canvas.addEventListener('pointermove', evt => {

        const rect = canvas.getBoundingClientRect();
        if (drag) {
            const rect = canvas.getBoundingClientRect();
            selectionRect.w = (evt.clientX - rect.left) - selectionRect.startX;
            selectionContext.globalAlpha = 0.5;
            selectionContext.clearRect(0, 0, canvas.width, canvas.height);
            selectionContext.fillRect(selectionRect.startX,
                selectionRect.startY,
                selectionRect.w,
                chart.chartArea.bottom - chart.chartArea.top);
        } else {
            selectionContext.clearRect(0, 0, canvas.width, canvas.height);
            var x = evt.clientX - rect.left;
            if (x > chart.chartArea.left) {
                selectionContext.fillRect(x,
                    chart.chartArea.top,
                    1,
                    chart.chartArea.bottom - chart.chartArea.top);
            }
        }
    });
    canvas.addEventListener('pointerup', evt => {
        const points = chart.getElementsAtEventForMode(evt, 'index', {
            intersect: false
        });
        drag = false;
        console.log('implement filter between ' + setChart.data.labels[startIndex] + ' and ' + setChart.data.labels[points[0].index]);
        set(startIndex, points[0].index);
        /* https://github.com/chartjs/chartjs-plugin-annotation */
    });
}
