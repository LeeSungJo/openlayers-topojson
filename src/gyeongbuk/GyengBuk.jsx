import * as React from "react";
import "./GyengBuk.css";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

import gbmap from "../assets/gbmap_topo.json";

const featureData = feature(gbmap, gbmap.objects["gbmap"]);
// topojson-client는 topoJSON 파일을 D3에서 사용할 수 있게 바꿔주는 라이브러리라고 하네요??
// 그리고 저는 위에 'korea-topo' 라는 이름으로 접근했는데
// 만드신 topoJSON 파일을 열어서 'objects'라고 검색하셔서 객체로 안에 프로퍼티 이름을 적어주시면 된답니다.

export default function GyengBuk() {
  // svg를 그릴 엘리먼트 설정을 위한 ref
  const chart = useRef(null);

  const printD3 = () => {
    // 지도 svg의 너비와 높이
    const width = 800;
    const height = 800;

    // 메르카토르 투영법 설정
    // 우리가 가장 많이 쓰는 도법으로 구형인 지구를 평면으로 표현하는 하나의 방법이라고 하네요??
    const projection = d3.geoMercator().scale(1).translate([0, 0]);
    const path = d3.geoPath().projection(projection);
    const bounds = path.bounds(featureData);

    // svg의 크기에 따른 지도의 크기와 위치값을 설정합니다.
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = 0.9 / Math.max(dx / width, dy / height);
    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    projection.scale(scale).translate(translate);

    // svg를 만들고
    const svg = d3
      .select(chart.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      // ID와 클래스를 부여함
      .attr("id", "gyeng-buk")
      .attr("class", "gyeng-buk");
    const mapLayer = svg.append("g");

    // topoJSON의 데이터를 그려줍니다.
    mapLayer
      .selectAll("path")
      .data(featureData.features)
      .enter()
      .append("path")
      // 요소들에 각각 class 이름을 부여한다. ex) "municipality-포항시"
      .attr("class", function (d) {
        return "municipality-" + d.properties.SIG_KOR_NM;
      })
      .attr("d", path)
      // 클릭시 toggle처럼 색상 켜고 끄기
      .on("click", function (d) {
        console.log(d.target.__data__.properties.SIG_KOR_NM);
        const target = d3.select(this);
        const currentColor = target.attr("fill");
        if (currentColor === "tomato") {
          target.attr("fill", "grey");
        } else {
          target.attr("fill", "tomato");
        }
      });

    // 지역 라벨
    mapLayer
      .selectAll("text")
      .data(featureData.features)
      .enter()
      .append("text")
      .attr("transform", function (d) {
        return "translate(" + path.centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .attr("class", "municipality-label")
      .text(function (d) {
        return d.properties.SIG_KOR_NM;
      });

    // zoom Control
    svg.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([1, 8])
        .on("zoom", zoomed)
    );

    function zoomed({ transform }) {
      mapLayer.attr("transform", transform);
    }
  };

  useEffect(() => {
    printD3();
  }, []);

  return (
    <div className="container">
      <div ref={chart} />
    </div>
  );
}
