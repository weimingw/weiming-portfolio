import PageMixin from '../../mixins/PageMixin';

import { wrapInField } from '../../helpers/formUtils';
import './usersPage.scss';

// Note to self: turn this into a mixin?
export default {
    props: {
        type: {
            type: String,
        }
    },
    mixins: [ PageMixin ],
    data: function() {
        return {
            fields: {
                email: undefined,
                name: undefined,
                password: undefined,
                passwordConfirmation: undefined,
                newPassword: undefined,
                newPasswordConfirmation: undefined,
                newEmail: undefined,
                newName: undefined,
            },
        }
    },
    methods: {
        getNameField(h) {
            return wrapInField(h,
                <input name='name' class='usersPage-input'
                        value={this.fields.name}
                        onInput={(evt) => this.$set(this.fields, 'name', evt.target.value)} />,
                { name: 'name', label: 'Name' }
            );
        },
        getEmailField(h) {
            return wrapInField(h,
                <input name='email' class='usersPage-input' type="email"
                        value={this.fields.email}
                        onInput={(evt) => this.$set(this.fields, 'email', evt.target.value)} />,
                { name: 'email', label: 'Email' }
            );
        },
        getPasswordField(h) {
            return wrapInField(h,
                <input name='password' class='usersPage-input' type='password'
                        value={this.fields.password}
                        onInput={(evt) => this.$set(this.fields, 'password', evt.target.value)} />,
                { name: 'password', label: 'Password' }
            );
        },
        getPasswordConfirmationField(h) {
            return  wrapInField(h,
                <input name='passwordConfirmation' class='usersPage-input' type='password'
                        value={this.fields.passwordConfirmation}
                        onInput={(evt) => this.$set(this.fields, 'passwordConfirmation', evt.target.value)} />,
                { name: 'passwordConfirmation', label: 'Confirm Password' }
            );
        },
        getNewPasswordField(h) {
            return wrapInField(h,
                <input name='newPassword' class='usersPage-input' type='password'
                        value={this.fields.newPassword}
                        onInput={(evt) => this.$set(this.fields, 'newPassword', evt.target.value)} />,
                { name: 'newPassword', label: 'New Password' }
            );
        },
        getNewPasswordConfirmationField(h) {
            return wrapInField(h,
                <input name='newPasswordConfirmation' class='usersPage-input' type='password'
                        value={this.fields.newPasswordConfirmation}
                        onInput={(evt) => this.$set(this.fields, 'newPasswordConfirmation', evt.target.value)} />,
                { name: 'newPasswordConfirmation', label: 'Confirm New Password' }
            );
        },
        getNewEmailField(h) {
            return wrapInField(h,
                <input name='newEmail' class='usersPage-input' type="email"
                        value={this.fields.newEmail}
                        onInput={(evt) => this.$set(this.fields, 'newEmail', evt.target.value)} />,
                { name: 'newEmail', label: 'New Email' }
            );
        },
        getNewNameField(h) {
            return wrapInField(h,
                <input name='newName' class='usersPage-input'
                        value={this.fields.newName}
                        onInput={(evt) => this.$set(this.fields, 'newName', evt.target.value)} />,
                { name: 'newName', label: 'New Name' }
            );
        },
    },
}
