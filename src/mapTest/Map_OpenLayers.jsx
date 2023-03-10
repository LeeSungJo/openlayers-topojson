import React, { useState, useEffect } from "react";
import MapContext from "./MapTestContext";
import "ol/ol.css";
import { Map as OlMap, View } from "ol";
import { defaults as defaultControls, FullScreen } from "ol/control";
import { fromLonLat, get as getProjection } from "ol/proj";
import { Tile as TileLayer } from "ol/layer";
import { TileWMS } from "ol/source";
import OSM from "ol/source/OSM.js";
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from "ol/interaction";

const Map_OpenLayers = ({ children }) => {
  const [mapObj, setMapObj] = useState({});

  useEffect(() => {
    const map = new OlMap({
      controls: defaultControls({ zoom: false, rotate: false }).extend([
        new FullScreen(),
      ]),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      // OSM : Open Street Map의 약자
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new TileLayer({
          source: new TileWMS({
            url: "http://localhost:9999/geoserver/korea/wms",
            params: { LAYERS: "korea:gbmap", TILED: true }, //workspace:layer
            serverType: "geoserver",
            transition: 0,
          }),
        }),
        // params: {
        //   FORMAT: "image/png",
        //   VERSION: "1.3.0",
        //   tiled: true,
        //   STYLES: "",
        //   LAYERS: "korea",
        // },
        // new TileLayer({
        //   source: new TileWMS({
        //     url: "http://localhost:9999/geoserver/korea/wms",
        //     params: { LAYERS: "korea:gbmap", TILED: true }, //workspace:layer
        //     serverType: "geoserver",
        //     // Countries have transparency, so do not fade tiles:
        //     transition: 0,
      ],
      target: "map",
      view: new View({
        projection: getProjection("EPSG:3857"),
        center: fromLonLat(
          [128.5055956, 36.5760207], //[경도, 위도] 값 설정 -> 경상북도청기준으로 설정
          getProjection("EPSG:3857")
        ),
        zoom: 15,
      }),
    });

    setMapObj({ map });
    return () => map.setTarget(undefined);
  }, []);

  return <MapContext.Provider value={mapObj}>{children}</MapContext.Provider>;
};

export default Map_OpenLayers;
