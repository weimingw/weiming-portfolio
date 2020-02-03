<script>
import './resume.scss';
import { getImageComponent } from '../../../assets';


import endpoints from '../../../../common/endpoints';
import { usePageConfiguration } from '../../../mixins/PageMixin';
import resume from './resume.json';
import { createElement as h, reactive } from '@vue/composition-api';

const LEVELS = [{
    name: 'Mastered',
    className: 'lmGreen',
}, {
    name: 'Proficient',
    className: 'lmBlue',
}, {
    name: 'Comfortable',
    className: 'lmPurple',
}, {
    name: 'Familiar',
    className: 'lmRed',
}]

export default {
    setup(props, ctxt) {
        const state = reactive({
            printMode: false,
        });

        function enterPrintMode() {
            state.printMode = true;
            document.querySelector('.main-headerBar').style.display = 'none';
            document.querySelector('.main-content').style['overflow-y'] = 'unset';
            document.querySelector('.main-content').style['margin-top'] = '0';
            document.querySelector('.main-content').style['background'] = 'white';
            document.querySelector('.sidebar').style.display = 'none';
        };

        return () => 
            (<div class={`resume layout-fullWidth ${state.printMode ? 'printMode' : ''}`}>
                { state.printMode ? null : <button onClick={enterPrintMode}>See Printable Resume</button> }
                <section class='resume-me'>
                    <h2 class='resume-name'>{resume.name}</h2>
                    <h5 class='resume-tagline'>{resume.tagline}</h5>
                    <a class='resume-link' href={resume.linkedin}>{resume.linkedin}</a>
                    <a class='resume-link' href={resume.github}>{resume.github}</a>
                </section>
                <section class='resume-education'>
                    <h4 class='resume-section-header'>Education</h4>
                    <p class='resume-school'>
                        <span>{ resume.education.school }</span>
                        <span>({ resume.education.time })</span>
                        <span>{ resume.education.major }</span>
                    </p>
                </section>
                <section class='resume-skills'>
                    <h4 class='resume-section-header'>Skills</h4>
                    <span class='resume-legend'>
                        {
                            LEVELS.map(({ className, name }) => 
                                <span>
                                    { getImageComponent(h, 'square', { className }) } 
                                    <span class='resume-legend-text ml2'>{ name }</span>
                                </span>
                            )
                        }
                    </span>
                    {
                        resume.skillList.map(category => 
                            <section class='resume-skills-subsection'>
                                <h5>{category.category}</h5>
                                <div class='resume-skills-categorySection'>
                                    { 
                                        category.skills.map(skill => 
                                            <p class={`resume-skills-skillPill level-${skill.level}`}>
                                                { skill.name }
                                            </p>
                                        )
                                    }
                                </div>
                            </section>  
                        )
                    }
                </section>
                <section class='resume-work'>
                    <h4 class='resume-section-header'>Work Experience</h4>
                    {
                        resume.experience.map(({ title, employer, timePeriod, stack, description }) => (
                            <div class='resume-work-entry'>
                                <div class='flexSpaceBetweenJustifiedRow'>
                                    <h5 class='resume-jobTitle'>{ title }</h5>
                                    <span class='resume-employer'>{ employer } ({ timePeriod })</span>
                                </div>
                                <div class='resume-stack'>Stack: { stack }</div>
                                <div class='resume-work-descriptionContainer'> {
                                    description.map(i =>
                                        <p class='resume-work-description'>{ i }</p>
                                    )
                                } </div>
                            </div>
                        ))
                    } 
                </section>
            </div>)
    },
}
</script>
