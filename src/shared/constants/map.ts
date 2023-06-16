import { Fill, Stroke, Style } from 'ol/style.js';

export const selectStyle = new Style({
    fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
    stroke: new Stroke({ color: 'blue', width: 3 }),
});

export const defaultStyle = new Style({
    stroke: new Stroke({ color: 'blue', width: 1 }),
    fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
});
