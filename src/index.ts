import * as d3 from "d3";
import * as topojson from "topojson-client";

const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");

//Covid data from April 2020
import { stats } from "./stats";
//Covid data from June 2020
import { stats2 } from "./stats2";

import { latLongCommunities } from "./communities";

// set the affected color scale
const color = d3
  .scaleThreshold<number, string>()
  .domain([0, 1, 100, 500, 700, 5000])
  .range([
    "#FFFFF",
    "#FFE8E5",
    "#F88F70",
    "#CD6A4E",
    "#A4472D",
    "#7B240E",
    "#540000",
  ]);

const maxAffected = stats.reduce(
  (max, item) => (item.value > max ? item.value : max),
  0
);

const affectedRadiusScale = d3
  .scaleLinear()
  .domain([0, maxAffected])
  .range([0, 50]); // 50 pixel max radius, we could calculate it relative to width and height

const calculateRadiusBasedOnAffectedCases = (comunidad: string) => {
  const entry = stats.find((item) => item.name === comunidad);

  return entry ? affectedRadiusScale(entry.value) : 0;
};

const aProjection = d3Composite.geoConicConformalSpain();

const geoPath = d3.geoPath().projection(aProjection);

const geojson = topojson.feature(spainjson, spainjson.objects.ESP_adm1);

aProjection.fitSize([1024, 800], geojson);

const svg = d3
.select("body")
.append("svg")
.attr("width", 1024)
.attr("height", 800)
.attr("style", "background-color: #FBFAF0");

svg
.selectAll("path")
.data(geojson["features"])
.enter()
.append("path")
.attr("class", "country")
// use geoPath to convert the data into the current projection
// https://stackoverflow.com/questions/35892627/d3-map-d-attribute
.attr("d", geoPath as any);

svg
.selectAll("circulos")
.data(latLongCommunities)
.enter()
.append("circle")
.attr("class", "affected-marker")
.attr("r", (d) => calculateRadiusBasedOnAffectedCases(d.name))
.attr("cx", (d) => aProjection([d.long, d.lat])[0])
.attr("cy", (d) => aProjection([d.long, d.lat])[1]);

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

  document.getElementById("april").addEventListener("click", () => {
    updateRadius(stats);
  });
  
  document.getElementById("june").addEventListener("click", () => {
    updateRadius(stats2);
  });