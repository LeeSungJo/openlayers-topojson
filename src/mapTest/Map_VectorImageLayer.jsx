import React, { useState, useEffect } from "react";
import MapContext from "./MapTestContext";
import "ol/ol.css";
import "./Map_VectorImageLayer.css";
import { Map as OlMap, View } from "ol";
import { defaults as defaultControls, FullScreen } from "ol/control";
import { fromLonLat, get as getProjection } from "ol/proj";
import { Tile as TileLayer } from "ol/layer";
import OSM from "ol/source/OSM.js";
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from "ol/interaction";

// import GeoJSON from "ol/format/GeoJSON.js";
import TopoJSON from "ol/format/TopoJSON.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";

// import { Fill, Stroke, Style } from "ol/style.js";
import gbmap from "../assets/gbmap_topo.json";

const Map_VectorImageLayer = ({ children }) => {
  const [mapObj, setMapObj] = useState({});

  useEffect(() => {
    // const style = new Style({
    //   fill: new Fill({
    //     color: "#eeeeee",
    //   }),
    // });

    // const vectorLayer = new VectorLayer({
    //   background: "#1a2b39",
    //   source: new VectorSource({
    //     url: "../assets/ctp_rvn2.geojson",
    //     // projection: "EPSG:3857",
    //     format: new GeoJSON(),
    //   }),
    //   style: function (feature) {
    //     const color = feature.get("COLOR") || "#eeeeee";
    //     style.getFill().setColor(color);
    //     return style;
    //   },
    // });

    const OpenStreetMap = new TileLayer({
      source: new OSM(),
    });
    let features = new TopoJSON().readFeatures(gbmap);
    let vectorSource = new VectorSource({ features: features });

    const map = new OlMap({
      controls: defaultControls({
        zoom: false,
        rotate: false,
        attribution: false,
      }).extend([new FullScreen()]),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      // OSM : Open Street Map의 약자
      // layers: [OpenStreetMap, vectorLayer],
      layers: [
        OpenStreetMap,
        new VectorLayer({
          source: vectorSource,
        }),
      ],
      target: "map",
      view: new View({
        projection: getProjection("EPSG:4326"),
        center: fromLonLat(
          [128.5055956, 36.5760207], //[경도, 위도] 값 설정 -> 경상북도청기준으로 설정
          getProjection("EPSG:4326")
        ),
        zoom: 15,
      }),
    });

    // const featureOverlay = new VectorLayer({
    //   source: new VectorSource(),
    //   map: map,
    //   style: new Style({
    //     stroke: new Stroke({
    //       color: "rgba(255, 255, 255, 0.7)",
    //       width: 2,
    //     }),
    //   }),
    // });

    // let highlight;
    // const displayFeatureInfo = function (pixel) {
    //   const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
    //     return feature;
    //   });

    //   const info = document.getElementById("info");
    //   if (feature) {
    //     info.innerHTML = feature.get("ECO_NAME") || "&nbsp;";
    //   } else {
    //     info.innerHTML = "&nbsp;";
    //   }

    //   if (feature !== highlight) {
    //     if (highlight) {
    //       featureOverlay.getSource().removeFeature(highlight);
    //     }
    //     if (feature) {
    //       featureOverlay.getSource().addFeature(feature);
    //     }
    //     highlight = feature;
    //   }
    // };

    // map.on("pointermove", function (evt) {
    //   if (evt.dragging) {
    //     return;
    //   }
    //   const pixel = map.getEventPixel(evt.originalEvent);
    //   displayFeatureInfo(pixel);
    // });

    // map.on("click", function (evt) {
    //   displayFeatureInfo(evt.pixel);
    // });

    setMapObj({ map });
    return () => map.setTarget(undefined);
  }, []);

  return <MapContext.Provider value={mapObj}>{children}</MapContext.Provider>;
};

export default Map_VectorImageLayer;
