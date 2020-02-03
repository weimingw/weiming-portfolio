import more from 'highcharts-more';
import Highcharts from 'highcharts';
more(Highcharts);
import * as colors from '../../common/colors';

const textColor = colors.hexToRgb(colors.LIGHT, 0.75);

// If I ever need to change colors in the future, consult this: https://stackoverflow.com/questions/8607365/how-to-change-the-text-color-in-highcharts
export const baseChartOptions = Object.freeze({
    chart: {
        backgroundColor: 'none',
        style: {
            fontFamily: 'Input Sans Compressed',
        }
    },
    title: {
        style: {
            color: colors.LIGHT,
        },        
    },
    xAxis: {
        labels: {
            style: {
                color: textColor,
            },  
        },  
    },
    yAxis: {
        labels: {
            style: {
                color: textColor,
            },  
        },
    },
    tooltip: {
        backgroundColor: colors.DARKER,
        style: {
            color: colors.LIGHT,
        },
    },
});