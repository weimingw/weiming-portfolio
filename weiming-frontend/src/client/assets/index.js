import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createElement } from '@vue/composition-api';

import {
    faBars, faCode, faUserCircle, faMale, faFileAlt, faList,
    faLaptopCode, faGamepad, faUserGraduate, faChalkboardTeacher, faChartLine,
    faAngleDown, faAngleUp, faBriefcase, faTools, faPlay, faPause, faVolumeUp,
    faSignInAlt, faUserCog, faMusic, faCarrot, faPlus, faTimes,
    faUtensils, faCaretDown, faCheck, faSave, faPlusSquare, faQuestionCircle,
    faEgg, faClipboardList, faAward, faSquare
} from '@fortawesome/free-solid-svg-icons'

library.add(
    faBars, faCode, faUserCircle, faMale, faFileAlt, faList,
    faLaptopCode, faGamepad, faUserGraduate, faChalkboardTeacher, faChartLine,
    faAngleDown, faAngleUp, faBriefcase, faTools, faPlay, faPause, faVolumeUp,
    faSignInAlt, faUserCog, faMusic, faCarrot, faPlus, faTimes, 
    faUtensils, faCaretDown, faCheck, faSave, faPlusSquare, faQuestionCircle,
    faEgg, faClipboardList, faAward, faSquare
);

import myIcon from './files/icon.svg';
import vegas from './files/vegas.svg';
import javascript from './files/javascript.svg';
import node from './files/node.svg';
import cooking from './files/cooking.svg';
import react from './files/react.svg';
import vue from './files/vue.svg';
import python from './files/python.svg';
import hexagon from './files/hexagon.svg';
import vegetables from './files/vegetables.svg';
import polarChart from './files/polar_chart.svg';
import challenge from './files/challenge.svg';
import loading from './files/loading.gif';

const iconMap = {
    myIcon, vegas, javascript, node, cooking, react, vue, python, hexagon, vegetables, polarChart, loading, challenge
}

export function getIcon(key) {
    return iconMap[key] || iconMap.myIcon;
}

/**
 * Returns a component that contains the image whose key is passed in
 * @param {*} h 
 * @param {*} key 
 * @param {*} opts 
 */
export function getImageComponent(h=createElement, key='myIcon', opts={}) {
    let {
        className = '',
        style = {},
        props = {},
    } = opts;
    let iconPath = iconMap[key];

    if (iconPath) {
        if (iconPath.endsWith('.svg')) {
            return <div class={`${className} svg`} style={{
                maskImage: `url(${iconMap[key]})`,
                ... style,
            }} />
        } else {
            return <img src={iconPath} class={className} {...props} />
        }
    } else {
        return <FontAwesomeIcon class={className} icon={key} {...props} />
    }
}