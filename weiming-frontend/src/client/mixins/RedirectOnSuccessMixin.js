/**
 * Used by pages that need to read 'redirect' from the URL
 * Example: Login uses this to send the user back to where they were if they were forced to login
 */
export const RedirectOnSuccessMixin = {
    computed: {
        redirectObj() {
            const params = new URLSearchParams(window.location.search);
            const redirectLink = params.get('redirect');
            return redirectLink ?
                    { path: redirectLink } :
                    undefined;
        }
    },
}