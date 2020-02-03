<script>
import * as deepmerge from 'deepmerge';
import { Chart } from 'highcharts-vue';
import * as colors from '../../common/colors';
import { baseChartOptions } from './chartsBase';

const baseOptions = Object.freeze(deepmerge(
    baseChartOptions,
    {
        chart: {
            polar: true,
        },
        yAxis: {
            labels: {
                style: {
                    color: colors.hexToRgb(colors.LIGHT, 0.5),
                },
            },
        },
    }
))

export default {
    props: ['options'],
    render(h) {
        return <Chart options={deepmerge(baseOptions, this.options)} />
    }
}
</script>