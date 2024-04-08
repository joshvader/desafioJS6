const input = document.querySelector('.input');
const select = document.querySelector('.select');
const button = document.querySelector('.buscar');
const span = document.querySelector('.resultado');
const canvas = document.querySelector('.grafico');

const url = "https://mindicador.cl/api";

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return ` ${day}/${month}/${year}`
}

//Get- Traer información
// Post - Escribir Información
// Put -  Editar Información
// Delete - Eliminar Información

let myChart = null;

function renderGrafico(data) {
    console.log(data)
    const config = {
        type: "line",
        data: {
            labels: data.map((elem) => formatDate(new Date(elem.fecha))
            ),
            datasets: [{
                label: "Ultimos 10 días",
                backgroundColor: "red",
                data: data.map((elem) => elem.valor
                ),
            }]
        }
    }
    canvas.style.backgroundColor = "white";
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(canvas, config);
}
async function buscarCotizacion() {
    try {
        
        const moneda = select.value;
        const fetching = await fetch(`${url}/${moneda}`);
        const data = await fetching.json();
        return data;
    } catch (error) {
        console.log(error);
        span.innerHTML = "Ocurrio un error";
    }
}

button.addEventListener('click', async () => {
    span.innerHTML = `
       Cargando...
    `
    const result = await buscarCotizacion()
    const serie = result.serie;
    const lastValue = serie[0].valor;
    const calculo = (input.value) / lastValue;  
    
    const valor = (calculo).toFixed(2);
    const data = serie.slice(0, 10).reverse();

    span.innerHTML = `
     La Contización del día es $${valor}
    `
    renderGrafico(data);
})


