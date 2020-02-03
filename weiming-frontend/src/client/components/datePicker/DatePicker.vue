<script>
import './datePicker.scss';
import VueDatePicker from '../../../lib/VueDatePicker/vuejs-datepicker.min';

/*
 * Wrapper around https://github.com/charliekassel/vuejs-datepicker?ref=madewithvuejs.com
 */
export default {
    props: {
    },
    data() {
        return {
            showAbove: false,   // show calendar above the picker
            rightAlign: false,  // show calendar aligned to the right of the picker
        }
    },
    methods: {
        repositionCalendar() {
            const { x, y, width, height } = this.$el.getBoundingClientRect();
            // unfortunately it is impossible to get the actual height and width...
            this.rightAlign = x + 280 > window.innerWidth;
            this.showAbove = y + 266 > window.innerHeight;
        },
        handleSelection(date) {
            // the datepicker is a bit buggy - it returns based on local timezone or something
            date = new Date(date.toISOString().substring(0, 10));
            this.$emit('change', date);
        },
    },
    render(h) {
        const {
            wrapperClass = '',
            calendarClass = '',
            inputClass = '',
            value = undefined,
            ... otherProps
        } = this.$attrs;

        const showAboveClass = this.showAbove ? 'showAbove' : '';
        const rightAlignClass = this.rightAlign ? 'rightAlign' : '';
        const date = value ? value.toUTCString() : undefined;
        // if (date) date.setDate(date.getDate());

        return <VueDatePicker
                ref='wrappedPicker'
                onSelected={this.handleSelection}
                onOpened={this.repositionCalendar}
                wrapperClass={`datePicker ${wrapperClass}`}
                calendarClass={`datePicker-calendar ${calendarClass} ${showAboveClass} ${rightAlignClass}`}
                inputClass={`datePicker-input ${inputClass}`}
                value={date}
                props={{ ...otherProps }}
                useUtc={true}
        />
    },
}
</script>
