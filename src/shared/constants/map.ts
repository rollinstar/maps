import { Icon, Style, Stroke, Fill } from 'ol/style.js';
import pin from 'assets/img/marker.svg';

export const selectStyle = new Style({
    fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
    stroke: new Stroke({ color: 'blue', width: 3 }),
});

export const defaultStyle = new Style({
    stroke: new Stroke({ color: 'blue', width: 1 }),
    fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
});

export const markerStyle = new Style({
    image: new Icon({ opacity: 1, scale: 1, src: pin }),
});

export const bufferStyle = new Style({
    stroke: new Stroke({
        color: 'rgba( 0, 0, 255, 0.9)',
        width: 2,
    }),
    fill: new Fill({
        color: 'rgba( 255, 0, 0, 0.4)',
    }),
});
