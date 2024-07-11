// public/scripts/chart.js

let openTrashChart, trashChart;

async function fetchData() {
    try {
        const response = await fetch('/data');
        const data = await response.json();
        document.getElementById('person-distance').textContent = `Distancia: ${data.distanceToPerson} cm`;
        //document.getElementById('trash-distance').textContent = `Distance to trash: ${data.distanceToTrash} cm`;

        // Calcular y mostrar el porcentaje de llenado actual
        const percentage = calculateTrashPercentage(data.distanceToTrash);
        document.getElementById('trash-fill-percentage').textContent = `Trash Fill Percentage: ${percentage.toFixed(2)}%`;

        // Actualizar el nivel de llenado del tacho de basura
        const trashFill = document.getElementById('trash-fill');
        trashFill.style.height = `${percentage}%`;

        // Cambiar el color según el porcentaje
        if (percentage < 30) {
            trashFill.style.backgroundColor = 'green';
        } else if (percentage >= 30 && percentage <= 70) {
            trashFill.style.backgroundColor = 'yellow';
        } else {
            trashFill.style.backgroundColor = 'red';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchAllData() {
    try {
        const response = await fetch('/all-data');
        const result = await response.json();
        const data = result.data;
        const openTrashCount = result.openTrashCount;
        const graphData = result.graphData;
        const openTrashGraphData = result.openTrashGraphData;
        const trashPercentages = result.trashPercentages;

        console.log('All data:', data);
        console.log('Open trash count:', openTrashCount);
        console.log('Graph data:', graphData);
        console.log('Open trash graph data:', openTrashGraphData);
        console.log('Trash percentages:', trashPercentages);

        const labelsOpenTrash = openTrashGraphData.map(entry => new Date(entry.timestamp));
        const openTrashCounts = openTrashGraphData.map(entry => entry.openTrashCount);

        const labelsTrash = trashPercentages.map(entry => new Date(entry.timestamp));
        const percentagesTrash = trashPercentages.map(entry => entry.percentage);

        console.log('Labels Open Trash:', labelsOpenTrash);
        console.log('Open Trash Counts:', openTrashCounts);
        console.log('Labels Trash:', labelsTrash);
        console.log('Percentages Trash:', percentagesTrash);

        // Actualizar el gráfico para N° Tacho Abierto
        if (openTrashChart) {
            openTrashChart.data.labels = labelsOpenTrash;
            openTrashChart.data.datasets[0].data = openTrashCounts;
            openTrashChart.update();
        } else {
            const ctxOpenTrash = document.getElementById('open-trash-chart').getContext('2d');
            openTrashChart = new Chart(ctxOpenTrash, {
                type: 'line',
                data: {
                    labels: labelsOpenTrash,
                    datasets: [
                        {
                            label: 'N° Tacho Abierto',
                            data: openTrashCounts,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill: false,
                            spanGaps: true
                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'minute',
                                tooltipFormat: 'HH:mm:ss'
                            }
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Actualizar el gráfico para Distance to trash como porcentaje de llenado
        if (trashChart) {
            trashChart.data.labels = labelsTrash;
            trashChart.data.datasets[0].data = percentagesTrash;
            trashChart.update();
        } else {
            const ctxTrash = document.getElementById('trash-chart').getContext('2d');
            trashChart = new Chart(ctxTrash, {
                type: 'line',
                data: {
                    labels: labelsTrash,
                    datasets: [
                        {
                            label: 'Trash Fill Percentage (%)',
                            data: percentagesTrash,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            fill: false
                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'minute',
                                tooltipFormat: 'HH:mm:ss',
                                stepSize: 5
                            }
                        },
                        y: {
                            beginAtZero: true,
                            max: 100 // Ensure the y-axis goes from 0 to 100
                        }
                    }
                }
            });
        }

        // Mostrar el contador en la página web
        document.getElementById('open-trash-count').textContent = `N° Tacho Abierto: ${openTrashCount}`;
    } catch (error) {
        console.error('Error fetching all data:', error);
    }
}

function calculateTrashPercentage(distanceToTrash) {
    const maxDistance = 34;
    const minDistance = 1;
    const percentage = ((maxDistance - distanceToTrash) / (maxDistance - minDistance)) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Clamp the value between 0 and 100
}

// Actualizar datos y gráficos cada segundo
setInterval(fetchData, 1000);
setInterval(fetchAllData, 1000);

// Obtener datos inicialmente
fetchData();
fetchAllData();
