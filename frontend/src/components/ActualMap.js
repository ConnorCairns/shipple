import { Box, Toolbar, Container, Paper } from '@mui/material';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Title from '../components/Title';
import { useContext, useEffect, useRef, useState } from 'react';
import '../css/map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import useChannel from '../services/channel/useChannel';
import { useParams } from 'react-router';
import { useReducerContext } from '../services/ReducerProvider';
import useSocket from '../services/channel/useSocket';
import SocketContext from '../services/channel/SocketContext';

mapboxgl.accessToken = 'pk.eyJ1IjoiY29ubm9yYyIsImEiOiJjbDA0NGxnaHcwMWF4M2RyeWtvMWdheG1rIn0.HrRQ6pMM4EmEEjVQRu9xLQ';

// const pubs = [{ lat: -2.598305, long: 51.456238, name: "Zero Degrees" }, { lat: -2.598908, long: 51.455778, name: "The Ship Inn" }]

const convertPolygon = (polygon) => {
    let new_polygon = []

    for (let i = 0; i < polygon.length; i += 2) {
        new_polygon.push([polygon[i + 1], polygon[i]])
    }

    return new_polygon
}

const ActualMap = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-2.598305);
    const [lat, setLat] = useState(51.456238);
    const [zoom, setZoom] = useState(15);
    const params = useParams()
    const [state, dispatch] = useReducerContext()
    const socket = useContext(SocketContext)



    useEffect(() => {
        const heartbeat = () => {
            if (!socket) return
            if (socket.readyState !== 1) return
            socket.send("heartbeat")
            setTimeout(heartbeat, 500)
        }

        heartbeat()
    }, [])

    const UNSUBSCRIBE = useChannel(params.crawlID, 123)

    const addPubMarkers = () => {
        state.pubs.forEach(pub => {
            const el = document.createElement('div');
            el.className = 'marker';

            const popup = new mapboxgl.Popup({ offset: 25 }).setText(
                pub[0]
            );

            new mapboxgl.Marker(el)
                .setLngLat([pub[2], pub[1]])
                .setPopup(popup)
                .addTo(map.current);
        })
    }

    const addPolygons = (name) => {
        const new_polygon = [convertPolygon(state.polygons)]

        console.log(new_polygon)

        map.current.addSource(name, {
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
            'id': name,
            'type': 'fill',
            'source': name, // reference the data source
            'layout': {},
            'paint': {
                'fill-color': '#0080ff', // blue color fill
                'fill-opacity': 0.5
            }
        });
        // Add a black outline around the polygon.
        map.current.addLayer({
            'id': `outline${state.polygons.length}`,
            'type': 'line',
            'source': name,
            'layout': {},
            'paint': {
                'line-color': '#000',
                'line-width': 3
            }
        });
    }

    useEffect(() => {
        if (!map.current) return
        if (state.polygons !== []) {
            addPolygons(`kms${state.polygons.length}`)
        }
    }, [state.polygons])

    useEffect(() => {
        if (!map.current) return
        if (state.pubs !== []) {
            addPubMarkers()
        }
    }, [state.pubs])

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });

        map.current.on('load', () => {
            map.current.resize()
            addPubMarkers()
            addPolygons("maine")
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
            <Container disableGutters maxWidth="lg" sx={{ mt: 0, mb: 0, mr: 0, ml: 0, display: 'absolute', flexDirection: 'column' }}>
                <div>
                    <div ref={mapContainer} className="map-container" />
                </div>
            </Container>
        </Box>
    )
}

export default ActualMap
