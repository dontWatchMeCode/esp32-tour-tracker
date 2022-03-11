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
}

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    responsive: true,
    data: {
        labels: [],
        datasets: [{
            label: 'Geschwindigkeit',
            data: [],
            borderWidth: 1,
            borderColor: [
                'rgba(153, 102, 255, 1)'
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

if (window.location.href.indexOf("/view") != -1) {
    myChart.update();

    myChart.options.scales.y.max = 20;

    for (let i = 1; i < data_array.length - 2; i++) {
        myChart.data.labels[i] = data_array[i][7].substring(0, 5);
        myChart.data.datasets[0].data[i] = data_array[i][11];
    }
}