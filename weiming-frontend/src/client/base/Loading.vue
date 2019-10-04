<script>
import { getImageComponent } from '../../client/assets';

export default {
    props: {
        iconOnly: { type: Boolean, default: false },
    },
    render(h) {
        return <div class='loading'>
            { getImageComponent(h, 'loading', { className: 'loading-icon' }) }
            { !this.iconOnly ? <p>Loading...</p> : null }
        </div>
    },
}
</script>

<style>

</style>