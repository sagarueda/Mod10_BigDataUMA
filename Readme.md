# Covid situación in Spain per comunity
We have used a base program that we have seen in class which correspond to the next task:

- Place pins on a map based on location.
- Scale pin radius based on affected number.
- Spain got canary island that is a territory placed far away, we need to cropt that islands and paste them in a visible  place in the map.
The main code to this program is in https://github.com/Lemoncode/d3js-typescript-examples/tree/master/02-maps/02-pin-location-scale 

### Finding new covid data:
The next step was to find a new data contain information of Coronavirus in June:

We have created a new stats2.ts to upload this data.

```diff
export const stats2 = [
    {
      name: "Madrid",
      value: 1886,
    },
    {
      name: "La Rioja",
      value: 390,
    },
    {
      name: "Andalucía",
      value: 1557,
    },
    {
      name: "Cataluña",
      value: 2597,
    },
    {
      name: "Valencia",
      value: 1514,
    },
    {
      name: "Murcia",
      value: 446,
    },
    {
      name: "Extremadura",
      value: 500,
    },
    {
      name: "Castilla La Mancha",
      value: 570,
    },
    {
      name: "País Vasco",
      value: 758,
    },
    {
      name: "Cantabria",
      value: 250,
    },
    {
      name: "Asturias",
      value: 500,
    },
    {
      name: "Galicia",
      value: 713,
    },
    {
      name: "Aragón",
      value: 449,
    },
    {
      name: "Castilla y León",
      value: 800,
    },
    {
      name: "Islas Canarias",
      value: 427,
    },
    {
      name: "Islas Baleares",
      value: 350,
    },
  ];
```

## The next step was to create two buton in index.html
```diff
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="./map.css" />
    <link rel="stylesheet" type="text/css" href="./base.css" />
  </head>
  <body>
    <div>
      <button id="april"> Covid Spain April 2020</button>
      <button id="june"> Covid Spain June 2020</button>
    </div>
    <script type="module" src="./index.ts"></script>
  </body>
</html>
```

# Updating the circles radio according to tha covid cases in each comunity.
To do this task I have created a updateRadius()
```diff
//This function update the Radius of all circulos, using data from June or April
// depend on which buttom the user click on.
const updateRadius = (data :{name:string;value: number; }[]) => {  
    //maxAffected depend on which data set we want to use, the escale is different
    const maxAffected = data.reduce(
      (max, item) => (item.value > max ? item.value : max),
      0);

    const affectedRadiusScale = d3
    .scaleLinear()
    .domain([0, maxAffected])
    .range([0, 50]);

    const calculateRadiusBasedOnAffectedCases = (comunidad: string) => {
    const entry = stats.find((item) => item.name === comunidad);
    return entry ? affectedRadiusScale(entry.value) : 0;
    };

    svg
    .selectAll("circulos")
    .data(latLongCommunities) 
    .transition()
    .duration(500)
    .attr("r", data => calculateRadiusBasedOnAffectedCases(data.name));
    };
 ```
With function getElementByID of each button we can use stats or stats2 which correspond to the covid data from June.


```diff
  document.getElementById("april").addEventListener("click", () => {
    updateRadius(stats);
  });
  
  document.getElementById("june").addEventListener("click", () => {
    updateRadius(stats2);
  });
```

#Running code
To run this code it is neccesary to do
```diff
npm install
npm install topojson-client --save
npm install @types/topojson-client --save-dev
npm start
```
The output is located in 
```diff
localhost:1234
```


The output is:

![github-small](/content/covid.JPG)
