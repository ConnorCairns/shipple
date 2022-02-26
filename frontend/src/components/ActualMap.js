import { Box, Toolbar, Container, Paper } from '@mui/material';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Title from '../components/Title';
import { useEffect, useRef, useState } from 'react';
import '../css/map.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiY29ubm9yYyIsImEiOiJjbDA0NGxnaHcwMWF4M2RyeWtvMWdheG1rIn0.HrRQ6pMM4EmEEjVQRu9xLQ';

const pubs = [{ lat: -2.598305, long: 51.456238, name: "Zero Degrees" }, { lat: -2.598908, long: 51.455778, name: "The Ship Inn" }]

const polygon = {
    "coords": [
        51.4667912,
        -2.6117687,
        51.4681712,
        -2.6085272,
        51.46812967288564,
        -2.607795849093956,
        51.4638723,
        -2.6079594,
        51.4580167,
        -2.6102795,
        51.45468768594371,
        -2.613037759684077,
        51.4555685,
        -2.6147229,
        51.4600108,
        -2.6167261,
        51.46477753993079,
        -2.6157319485217987,
        51.4667912,
        -2.6117687
    ]
}


const convertPolygon = (polygon) => {
    let new_polygon = []

    for (let i = 0; i < polygon.coords.length; i += 2) {
        new_polygon.push([polygon.coords[i + 1], polygon.coords[i]])
    }

    return new_polygon
}

const ActualMap = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-2.598305);
    const [lat, setLat] = useState(51.456238);
    const [zoom, setZoom] = useState(15);

    const addPubMarkers = () => {
        pubs.forEach(pub => {
            const el = document.createElement('div');
            el.className = 'marker';

            const popup = new mapboxgl.Popup({ offset: 25 }).setText(
                pub.name
            );

            new mapboxgl.Marker(el)
                .setLngLat([pub.lat, pub.long])
                .setPopup(popup)
                .addTo(map.current);
        })
    }

    const addPolygons = () => {
        const new_polygon = [convertPolygon(polygon)]

        map.current.addSource('maine', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': new_polygon,
                },
            },
        })

        map.current.addLayer({
            'id': 'maine',
            'type': 'fill',
            'source': 'maine', // reference the data source
            'layout': {},
            'paint': {
                'fill-color': '#0080ff', // blue color fill
                'fill-opacity': 0.5
            }
        });
        // Add a black outline around the polygon.
        map.current.addLayer({
            'id': 'outline',
            'type': 'line',
            'source': 'maine',
            'layout': {},
            'paint': {
                'line-color': '#000',
                'line-width': 3
            }
        });
    }

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });

        map.current.on('load', () => {
            addPubMarkers()
            addPolygons()
        })

    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    return (
        <Box component="main" sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            pointerEvents: 'auto'
        }}>
            <Container disableGutters maxWidth="lg" sx={{ mt: 0, mb: 0, display: 'absolute', flexDirection: 'column' }}>
                    <div>
                        <div ref={mapContainer} className="map-container" />
                    </div>
            </Container>
        </Box>
        )
}

export default ActualMap
