<script>
import { WriteupSection, WriteupHeader5, WriteupParagraph, WriteupListItem, WriteupDiv, WriteupList } from '../../../components/writeup/index'

export default {
    methods: {
        overview(h) {
            return (<WriteupParagraph>
                The app lets you track your nutritional intake (based primarily on the guidelines from the most recent FDA guidelines) by having letting you put in everything you consumed in a day. There are two pages: the tracker page where you can see every day that you put in data for and the average nutritional intake you had for the days you included and the visualizer page where you can enter data for the day and see the total intake for the day as well as a breakdown of where the nutrients came from.
            </WriteupParagraph>)
        },
        origin(h) {
            return (<WriteupParagraph>
                The idea came from two things: I like cooking my own food, and doctors say that health starts with food. Because packaged food is generally processed and unhealthy and fresh food does not come with nutrition labels, I was worried about not getting the right nutrients. Trying to track nutrition intake by Googling every single item and making a spreadsheet is impractical, so I decided to create my own tracking tool.
            </WriteupParagraph>)
        },
        tasks(h) {
            return <WriteupDiv>
                <WriteupParagraph>
                    My site was so barren that there was a lot to do:
                </WriteupParagraph>
                <WriteupList> {
                    [
                        "Data for recommended daily intake",
                        "Flask app solely to handle backend",
                        "MySQL database to store user data",
                        "MongoDB database to store the foods eaten for each day",
                        "Redis as a cache",
                        "Many components (e.g. dropdown, date picker, progress bar, notifications, tooltips)",
                        "Highcharts to create radar charts on the tracker page",
                        "Utility functions to call Flask backend from the Node app",
                        "Utility functions to call remote endpoints from the client, including ways to automatically handle user sessions",
                        "Countless styling classes and constants",
                        "The pages themselves",
                    ].map(i => <WriteupListItem contents={i} />)
                } </WriteupList>
            </WriteupDiv>
        },
        challengesAndLessons(h) {
            return <WriteupDiv>
                <WriteupParagraph>
                    Being a rank-and-file software engineer, many things are beyond my responsibilities, meaning that I never encountered certain obstacles and considerations before:
                </WriteupParagraph>
                <WriteupList> {
                    [{
                        summary: "ORM Troubles",
                        description: "Originally tried to use SQLAlchemy as the ORM and put in a lot of effort to make it work, but ultimately failed and had to change to Playhouse",
                        lesson: "Learned to give up on buggy libraries earlier on. Playhouse ended up being more minimalistic, which is ideal for my code design philosophy",
                    }, {
                        summary: "Database Choice",
                        description: "Originally wanted to make MySQL the sole storage engine, but Mongo was a better fit, since the data model is nested and documents don’t use incremental private keys, alleviating private key wastage from constant creation and deletion",
                        lesson: "Learned a bit more about pros and cons of SQL and Mongo",
                    }, {
                        summary: "Responsive Design",
                        description: "Styling for responsive design was rocky",
                        lesson: "Learned new CSS through sweat and tears",
                    }, {
                        summary: "Charting Libraries",
                        description: "Tried many graphing libraries, putting in decent effort for each one, but they all were missing features I needed (e.g. adjusting padding between each graph)",
                        lesson: "Tried-and-true libraries should be considered first",
                    }, {
                        summary: "Component Design",
                        description: "Component used to enter food is poorly designed",
                        lesson: "Avoid event emission if ever possible, and consider using Vue’s reactive Objects for such cases in the future (or if implementing React, Context APIs)",
                    }, {
                        summary: "UX Design",
                        description: "The design is not optimal and not accessible",
                        lesson: "I took lessons on web accessibility, but good UX design will require a designer's help",
                    }, {
                        summary: "USDA API Deprecation",
                        description: "The USDA deprecated its old nutritional data API before I was finished and started offering a new API that did not accept batch requests, which lead to me maxing out rate limits",
                        lesson: "Had to create my own batching API that uses my own cache layer, which fixed the rate limit issue",
                    }].map(challenge => 
                        <WriteupDiv>
                            <WriteupHeader5>{challenge.summary}</WriteupHeader5>
                            <WriteupList>
                                <WriteupListItem>{challenge.description}</WriteupListItem>
                                <WriteupListItem>{challenge.lesson}</WriteupListItem>
                            </WriteupList>
                        </WriteupDiv>
                    )
                } </WriteupList>
            </WriteupDiv>
        },
        successes(h) {
            return <WriteupDiv>
                <WriteupParagraph>
                    It’s good to remember the things that went really well
                </WriteupParagraph>
                <WriteupList> {
                    [{
                        summary: "Good Component Design",
                        description: "Creating a Dropdown component with render props made it extremely flexible and easy to turn into Tooltip, Nutritional Breakdown, and Select components",
                    }, {
                        summary: "Overall Aesthetic",
                        description: "I accidentally stumbled on this design (with some helpful input from a friend), but I think it looks quite nice!",
                    }, {
                        summary: "Learning Experience",
                        description: "I learned a lot throughout the process, so I think that's a big success"
                    }].map(success => 
                        <WriteupDiv>
                            <WriteupHeader5>{ success.summary }</WriteupHeader5>
                            <WriteupList>
                                <WriteupListItem className='level2'>{ success.description }</WriteupListItem>
                            </WriteupList>
                        </WriteupDiv>
                    )
                } </WriteupList>
            </WriteupDiv>
        },
    },
    render(h) {
        return <div class='nutritionAbout layout-mediumWidth'>
            <WriteupSection icon='file-alt' label='Overview' contents={this.overview} />
            <WriteupSection icon='egg' label='Origin' contents={this.origin} />
            <WriteupSection icon='clipboard-list' label='Tasks' contents={this.tasks} />
            <WriteupSection icon='challenge' label='Challenges and Lessons Learned' contents={this.challengesAndLessons} />
            <WriteupSection icon='award' label='Successes' contents={this.successes} />
        </div>
    },
}
</script>
