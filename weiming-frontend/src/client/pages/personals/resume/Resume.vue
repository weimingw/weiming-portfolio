<script>
import './resume.scss';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import endpoints from '../../../../common/endpoints';
import PageMixin from '../../../mixins/PageMixin';
import workExperience from './workExperience.json';
import skillList from './skillList.json';

export default {
    mixins: [PageMixin],
    methods: {
        getWorkExperienceElements(h) {
            return workExperience.map(experience => {
                return <div class="resume-workExperienceSection">
                    <div><b>{experience.title}</b></div>
                    <div class="resume-row">
                        <div>{experience.employer}</div>
                        <div>{experience.timePeriod}</div>
                    </div>
                    <div>Stack: {experience.stack}</div>
                    <ul class="resume-list">
                        {experience.description.map(line => <li>{line}</li>)}
                    </ul>
                </div>
            });
        },
        getSkills(h) {
            return skillList.map(list => {
                return [
                    <div><b>{list.category}</b></div>,
                    <ul class="resume-list">
                        { list.skills.map(skill => <li>{skill}</li>) }
                    </ul>
                ]
            })
        },
        getInfoSection(h) {
            return <div class="resume-section">
                <div>Software Engineer, Frontend Focus</div>
                <div>LinkedIn:</div>
                <a class="resume-link" href="https://www.linkedin.com/in/weiming-wu/">
                    https://www.linkedin.com/in/weiming-wu/
                </a>
                <div>Github:</div>
                <a class="resume-link" href="https://github.com/weimingw">
                    https://github.com/weimingw
                </a>
            </div>
        },
        getSkillsSection(h) {
            return <div class="resume-section">
                <h4 class="resume-sectionHeader">
                    <FontAwesomeIcon class="resume-icon" icon="tools" />
                    Skills
                </h4>
                { this.getSkills(h) }
            </div>
        },
        getEducationSection(h) {
            return <div class="resume-section">
                <h4 class="resume-sectionHeader">
                    <FontAwesomeIcon class="resume-icon" icon="user-graduate" />
                    Education
                </h4>
                <div>UC Berkeley</div>
                <div class="resume-row">
                    <div>Computer Science, Economics</div>
                    <div>2013-2016</div>
                </div>
            </div>
        },
        getWorkExperienceSection(h) {
            return <div class="resume-section">
                <h4 class="resume-sectionHeader">
                    <FontAwesomeIcon class="resume-icon" icon="briefcase" />
                    Work Experience
                </h4>
                { this.getWorkExperienceElements(h) }
            </div>
        },
        getHeaderProps() {
            return {
                title: endpoints.personals.pages.resume.label
            }
        }
    },
    render(h) {
        return (<div class="resume noPadding">
            <div class="resume-section resume-leftColumn">
                <div>
                    <div class="resume-header resume-sectionHeader">
                        <FontAwesomeIcon class="resume-icon" icon="user-circle" />
                        <h2>Weiming Wu</h2>
                    </div>
                    { this.getInfoSection(h) }
                    { this.getSkillsSection(h) }
                </div>
            </div>
            <div class="resume-rightColumn">
                <div>
                    <div class="resume-header"></div>
                    { this.getEducationSection(h) }
                    { this.getWorkExperienceSection(h) }
                </div>
            </div>
        </div>)
    }
}
</script>
